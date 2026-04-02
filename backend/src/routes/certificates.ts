import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AddressParamSchema, CertificateDetailParamSchema } from '@/shared/schemas.ts';
import { prisma } from '@/lib/prisma.ts';

export async function certificatesRoutes(app: FastifyInstance) {
  /**
   * GET /api/certs/:address
   * List all compliance certificates for a developer address.
   */
  app.get('/api/certs/:address', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = AddressParamSchema.safeParse(request.params);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Invalid address format',
        details: parseResult.error.issues,
      });
    }

    const { address } = parseResult.data;

    try {
      const certificates = await prisma.complianceCertificate.findMany({
        where: { developerAddress: address.toLowerCase() },
        orderBy: { createdAt: 'desc' },
        take: 50, // Paginate: never return unbounded results
        select: {
          attestationUid: true,
          txHash: true,
          contractAddress: true,
          developerAddress: true,
          score: true,
          findings: true,
          explorerUrl: true,
          createdAt: true,
        },
      });

      return reply.send({ certificates });
    } catch (error) {
      app.log.error({ error }, 'Certificates list error');
      return reply.status(500).send({ error: 'Failed to fetch certificates' });
    }
  });

  /**
   * GET /api/certs/:address/:uid
   * Get a single certificate by attestation UID, including the audit session.
   */
  app.get('/api/certs/:address/:uid', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = CertificateDetailParamSchema.safeParse(request.params);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Invalid parameters',
        details: parseResult.error.issues,
      });
    }

    const { uid } = parseResult.data;

    try {
      const certificate = await prisma.complianceCertificate.findUnique({
        where: { attestationUid: uid },
        include: { auditSession: true },
      });

      if (!certificate) {
        return reply.status(404).send({ error: 'Certificate not found' });
      }

      return reply.send({ certificate });
    } catch (error) {
      app.log.error({ error }, 'Certificate detail error');
      return reply.status(500).send({ error: 'Failed to fetch certificate' });
    }
  });
}
