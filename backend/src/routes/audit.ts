import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { generateText } from 'ai';
import { AuditSchema } from '@/shared/schemas.ts';
import { primaryModel } from '@/lib/providers.ts';
import { retrieveChunks, formatChunksForPrompt } from '@/services/rag.ts';
import { buildAuditPrompt } from '@/prompts/audit.ts';
import { parseAuditOutput } from '@/services/auditParser.ts';
import { prisma } from '@/lib/prisma.ts';

/**
 * POST /api/audit
 *
 * Runs a one-shot compliance audit against a Solidity contract and PERSISTS
 * the result as an `AuditSession` row. The certify flow (`POST /api/certify`)
 * looks up the session by id to attach the on-chain attestation, so this
 * endpoint MUST return an `auditSessionId` the client can carry forward.
 *
 * Previously this route streamed raw LLM text and wrote nothing to the
 * database, which meant the certify flow had no session to reference. We
 * intentionally trade streaming UX here for correctness: certificate
 * issuance is the load-bearing path and depends on a durable audit record.
 *
 * The response shape is JSON, not SSE. The score, verdict, and finding
 * counts in the response are recomputed server-side from the parsed
 * findings (see `services/auditParser.ts`) so a malicious model output
 * cannot inflate a contract's compliance score on the way to the chain.
 */
export async function auditRoutes(app: FastifyInstance) {
  app.post('/api/audit', {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '1 minute',
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    // 1. Validate input at the route boundary.
    const parseResult = AuditSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Invalid request',
        details: parseResult.error.issues,
      });
    }

    const body = parseResult.data;

    // The audit prompt is keyed off `contractCode`, but the schema marks it
    // optional for backwards compatibility with the legacy chat-style audit
    // surface. Without code there is nothing to persist as a session, so we
    // reject early instead of writing a phantom row to the DB.
    if (!body.contractCode) {
      return reply.status(400).send({ error: 'contractCode is required' });
    }

    try {
      // 2. RAG retrieval: pull compliance patterns relevant to the audit.
      const patterns = await retrieveChunks(
        'solidity compliance pattern KYC access control',
        {
          topK: 8,
          categories: ['pattern', 'hashkey', 'template'],
        },
      );
      const patternContext = formatChunksForPrompt(patterns);

      // 3. Run the LLM to completion. Audit is one-shot — we need the full
      // text in memory so we can parse it and persist a structured record.
      const messages = body.messages.length > 0
        ? body.messages
        : [{ role: 'user' as const, content: 'Audit this contract for compliance.' }];
      const result = await generateText({
        model: primaryModel,
        system: buildAuditPrompt(patternContext, body.contractCode),
        messages,
      });

      // 4. Parse findings + recompute score/verdict server-side.
      const report = parseAuditOutput(result.text);

      // 5. Persist the audit session. Prisma uses parameterized queries
      // under the hood; never interpolate user input into raw SQL.
      // The findings JSON is round-tripped through JSON.parse/stringify so
      // Prisma's strict InputJsonValue type accepts the structured payload
      // without complaining about non-index-signature object types.
      const findingsJson = JSON.parse(
        JSON.stringify({
          findings: report.findings,
          summary: report.summary,
        }),
      );

      const session = await prisma.auditSession.create({
        data: {
          walletAddress: body.walletAddress ?? null,
          code: body.contractCode,
          contractName: body.contractName ?? null,
          findings: findingsJson,
          score: report.summary.compliance_score,
          verdict: report.summary.verdict,
        },
        select: {
          id: true,
          createdAt: true,
        },
      });

      app.log.info(
        {
          auditSessionId: session.id,
          score: report.summary.compliance_score,
          verdict: report.summary.verdict,
          walletAddress: body.walletAddress ?? null,
          contractName: body.contractName ?? null,
        },
        'Audit session persisted',
      );

      // 6. Return the auditSessionId AND the report shape the frontend needs.
      // findingsSummary is broken out at the top level so the certify flow
      // can pass it directly into its EIP-712 signature payload.
      return reply.send({
        auditSessionId: session.id,
        score: report.summary.compliance_score,
        verdict: report.summary.verdict,
        findingsSummary: {
          critical: report.summary.critical,
          high: report.summary.high,
          medium: report.summary.medium,
          low: report.summary.low,
        },
        findings: report.findings,
        summary: report.summary,
        rawOutput: result.text,
        createdAt: session.createdAt.toISOString(),
      });
    } catch (error) {
      app.log.error({ error }, 'Audit route error');
      return reply.status(500).send({ error: 'Failed to audit contract' });
    }
  });
}
