import type { FastifyInstance } from 'fastify';
import { prisma } from '@/lib/prisma.ts';

export async function statsRoutes(app: FastifyInstance) {
  app.get('/api/stats', async (_request, reply) => {
    try {
      const [certificateCount, scoreAggregate, auditCount] = await Promise.all([
        prisma.complianceCertificate.count(),
        prisma.complianceCertificate.aggregate({ _avg: { score: true } }),
        prisma.auditSession.count(),
      ]);

      const averageScore = scoreAggregate._avg.score != null
        ? Math.round(scoreAggregate._avg.score * 10) / 10
        : 0;

      reply.header('Cache-Control', 'public, max-age=60');

      return reply.send({
        certificatesIssued: certificateCount,
        averageScore,
        contractsAudited: auditCount,
      });
    } catch (error) {
      app.log.error({ error }, 'Failed to fetch stats');
      return reply.status(500).send({ error: 'Failed to fetch stats' });
    }
  });
}
