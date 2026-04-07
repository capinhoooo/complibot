import './dotenv.ts';

import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { APP_PORT, CORS_ORIGINS, IS_DEV } from './src/config/main-config.ts';

// Routes
import { healthRoutes } from './src/routes/health.ts';
import { statsRoutes } from './src/routes/stats.ts';
import { generateRoutes } from './src/routes/generate.ts';
import { regqueryRoutes } from './src/routes/regquery.ts';
import { chatRoutes } from './src/routes/chat.ts';
import { auditRoutes } from './src/routes/audit.ts';
import { certifyRoutes } from './src/routes/certify.ts';
import { certificatesRoutes } from './src/routes/certificates.ts';

// ---- Create Fastify instance ----

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
    transport: IS_DEV ? { target: 'pino-pretty' } : undefined,
  },
  // Increase body size limit for contract code in audit requests
  bodyLimit: 1_048_576, // 1MB
});

// ---- Global error handler ----

app.setErrorHandler((error: Error & { statusCode?: number }, _request, reply) => {
  app.log.error({ error }, 'Unhandled error');

  if (error.statusCode === 429) {
    return reply.status(429).send({ error: 'Too many requests. Please try again later.' });
  }

  // Never expose internal error details to clients
  return reply.status(error.statusCode ?? 500).send({
    error: 'Internal server error',
  });
});

// ---- Register plugins ----

await app.register(FastifyCors, {
  origin: CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean),
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, // Explicitly disable credentials with multi-origin
});

await app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

// ---- Register routes ----

await app.register(healthRoutes);
await app.register(statsRoutes);
await app.register(generateRoutes);
await app.register(regqueryRoutes);
await app.register(chatRoutes);
await app.register(auditRoutes);
await app.register(certifyRoutes);
await app.register(certificatesRoutes);

// ---- Start server ----

const port = APP_PORT;
const host = process.env.HOST ?? '0.0.0.0';

try {
  await app.listen({ port, host });
  app.log.info(`CompliBot API running on http://${host}:${port}`);
} catch (error) {
  app.log.fatal({ error }, 'Failed to start server');
  process.exit(1);
}

// ---- Graceful shutdown ----

const shutdown = async (signal: string) => {
  app.log.info(`${signal} received, shutting down gracefully...`);
  try {
    await app.close();
    app.log.info('Server closed');
    process.exit(0);
  } catch (error) {
    app.log.error({ error }, 'Error during shutdown');
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
