import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { verifyTypedData, keccak256, toHex, encodePacked } from 'viem';
import { CertifyRequestSchema } from '@/shared/schemas.ts';
import { getEIP712Domain, CERTIFY_TYPES } from '@/shared/constants.ts';
import { prisma } from '@/lib/prisma.ts';
import { checkKycStatus, createAttestation, ChainServiceError } from '@/services/chain.ts';
import { currentChain } from '@/lib/viem.ts';

export async function certifyRoutes(app: FastifyInstance) {
  app.post('/api/certify', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '1 minute',
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    // 0. Validate input
    const parseResult = CertifyRequestSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Invalid request',
        details: parseResult.error.issues,
      });
    }

    const body = parseResult.data;

    try {
      // 1. Verify EIP-712 signature (domain uses active chain ID to prevent cross-chain replay)
      const eip712Domain = getEIP712Domain(currentChain.id);
      const isValid = await verifyTypedData({
        address: body.developerAddress as `0x${string}`,
        domain: eip712Domain,
        types: CERTIFY_TYPES,
        primaryType: 'CertifyRequest',
        message: {
          contractAddress: body.contractAddress as `0x${string}`,
          developerAddress: body.developerAddress as `0x${string}`,
          auditHash: keccak256(toHex(body.auditSessionId)),
          complianceScore: BigInt(body.complianceScore),
          nonce: BigInt(body.nonce),
        },
        signature: body.signature as `0x${string}`,
      });

      if (!isValid) {
        app.log.warn({ developerAddress: body.developerAddress }, 'Invalid EIP-712 signature');
        return reply.status(401).send({ error: 'Invalid signature' });
      }

      // 2. Check KYC status on HashKey Chain
      const kyc = await checkKycStatus(body.developerAddress as `0x${string}`);
      if (!kyc.isValid) {
        app.log.info({ developerAddress: body.developerAddress }, 'KYC verification failed');
        return reply.status(403).send({ error: 'KYC verification required on HashKey Chain' });
      }

      // 3. Verify audit session exists and meets requirements
      const session = await prisma.auditSession.findUnique({
        where: { id: body.auditSessionId },
      });

      if (!session) {
        return reply.status(404).send({ error: 'Audit session not found' });
      }

      // Use SERVER-SIDE score from the audit session, not the client-supplied value.
      // The client can submit a manipulated complianceScore; the DB record is authoritative.
      const serverScore = session.score;
      const rawFindings = session.findings as { findings?: unknown[]; summary?: { critical?: number; high?: number; medium?: number; low?: number }; critical?: number; high?: number; medium?: number; low?: number };
      const serverFindings = {
        critical: rawFindings.summary?.critical ?? rawFindings.critical ?? 0,
        high: rawFindings.summary?.high ?? rawFindings.high ?? 0,
        medium: rawFindings.summary?.medium ?? rawFindings.medium ?? 0,
        low: rawFindings.summary?.low ?? rawFindings.low ?? 0,
      };

      if (serverScore < 70) {
        return reply.status(400).send({ error: 'Compliance score below threshold (70)' });
      }

      if (serverFindings.critical > 0) {
        return reply.status(400).send({ error: 'Cannot certify with unresolved critical findings' });
      }

      // 3b. Prevent duplicate certification (replay protection)
      // Each audit session can only be certified once (enforced by unique constraint on auditSessionId).
      // We check first to avoid wasting gas, but the DB unique constraint is the true guard
      // against the race condition where two concurrent requests pass the check simultaneously.
      const existingCert = await prisma.complianceCertificate.findUnique({
        where: { auditSessionId: body.auditSessionId },
      });
      if (existingCert) {
        app.log.warn({ auditSessionId: body.auditSessionId, existingUid: existingCert.attestationUid }, 'Duplicate certify attempt');
        return reply.status(409).send({
          error: 'Audit session already certified',
          attestationUid: existingCert.attestationUid,
        });
      }

      // 4. Create EAS attestation on-chain
      const auditHash = keccak256(
        encodePacked(
          ['string', 'string'],
          [session.code, JSON.stringify(session.findings)]
        )
      );

      const attestation = await createAttestation({
        contractAddress: body.contractAddress as `0x${string}`,
        developerAddress: body.developerAddress as `0x${string}`,
        complianceScore: serverScore,
        auditHash,
        criticalFindings: serverFindings.critical,
        highFindings: serverFindings.high,
        mediumFindings: serverFindings.medium,
        lowFindings: serverFindings.low,
      });

      // 5. Determine explorer URL based on chain (use centralized config, not raw env var)
      const explorerBase = currentChain.id === 177
        ? 'https://hashkey.blockscout.com'
        : 'https://testnet.hashkeyscan.io';

      // 6. Save certificate to database
      // The unique constraint on auditSessionId is the final guard against race conditions.
      // If two concurrent requests both pass the findUnique check above, only one will succeed
      // here; the other will throw a Prisma unique constraint violation (P2002).
      let certificate;
      try {
        certificate = await prisma.complianceCertificate.create({
          data: {
            attestationUid: attestation.uid,
            txHash: attestation.txHash,
            schemaUid: attestation.schemaUid,
            contractAddress: body.contractAddress,
            developerAddress: body.developerAddress,
            score: serverScore,
            findings: serverFindings,
            explorerUrl: `${explorerBase}/tx/${attestation.txHash}`,
            auditSessionId: body.auditSessionId,
          },
        });
      } catch (dbError: unknown) {
        // Handle unique constraint violation (race condition: concurrent certify requests)
        const isPrismaUniqueViolation =
          dbError != null &&
          typeof dbError === 'object' &&
          'code' in dbError &&
          (dbError as { code: string }).code === 'P2002';
        if (isPrismaUniqueViolation) {
          const existing = await prisma.complianceCertificate.findUnique({
            where: { auditSessionId: body.auditSessionId },
          });
          return reply.status(409).send({
            error: 'Audit session already certified',
            attestationUid: existing?.attestationUid ?? attestation.uid,
          });
        }
        throw dbError; // Re-throw non-duplicate errors
      }

      app.log.info(
        { attestationUid: certificate.attestationUid, txHash: certificate.txHash },
        'Certificate issued'
      );

      return reply.send({
        attestationUid: certificate.attestationUid,
        txHash: certificate.txHash,
        schemaUid: certificate.schemaUid,
        explorerUrl: certificate.explorerUrl,
        certificateUrl: `/cert/${certificate.attestationUid}`,
        timestamp: certificate.createdAt.toISOString(),
      });
    } catch (error) {
      if (error instanceof ChainServiceError) {
        app.log.error({ error: error.message }, 'Chain service error during certification');
        return reply.status(502).send({ error: 'Blockchain service error' });
      }
      app.log.error({ error }, 'Certify route error');
      return reply.status(500).send({ error: 'Failed to issue certificate' });
    }
  });
}
