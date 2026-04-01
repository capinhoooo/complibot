import type { FastifyInstance } from 'fastify';
import { prisma } from '@/lib/prisma.ts';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/api/health', async (_request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      app.log.error({ error }, 'Health check: database connection failed');
      return reply.status(503).send({
        status: 'unhealthy',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      });
    }

    return reply.send({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  });
}
