import { describe, it, expect, mock, beforeAll, afterAll, beforeEach } from 'bun:test';
import Fastify from 'fastify';

// Mock prisma at the module level before any imports
const mockQueryRaw = mock(() => Promise.resolve([{ '?column?': 1 }]));

mock.module('../../src/lib/prisma', () => ({
  prisma: {
    $queryRaw: mockQueryRaw,
    $disconnect: mock(() => Promise.resolve()),
  },
  prismaQuery: {
    $queryRaw: mockQueryRaw,
    $disconnect: mock(() => Promise.resolve()),
  },
  getPrisma: () => ({
    $queryRaw: mockQueryRaw,
    $disconnect: mock(() => Promise.resolve()),
  }),
}));

// Also mock @prisma/client to prevent initialization error
mock.module('@prisma/client', () => ({
  PrismaClient: class MockPrismaClient {
    $queryRaw = mockQueryRaw;
    $disconnect = mock(() => Promise.resolve());
  },
}));

// Import after mocks
const { healthRoutes } = await import('../../src/routes/health.ts');

describe('GET /api/health', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    await app.register(healthRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    mockQueryRaw.mockImplementation(() => Promise.resolve([{ '?column?': 1 }]));
  });

  it('returns healthy status when database is connected', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/health',
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.status).toBe('healthy');
    expect(body.database).toBe('connected');
    expect(body.timestamp).toBeDefined();
  });

  it('returns unhealthy status when database query fails', async () => {
    mockQueryRaw.mockImplementation(() => Promise.reject(new Error('Connection refused')));

    const response = await app.inject({
      method: 'GET',
      url: '/api/health',
    });

    expect(response.statusCode).toBe(503);
    const body = response.json();
    expect(body.status).toBe('unhealthy');
    expect(body.database).toBe('disconnected');
  });
});
