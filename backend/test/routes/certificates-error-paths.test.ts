import { describe, it, expect, mock, beforeAll, afterAll } from 'bun:test';
import Fastify from 'fastify';

mock.module('@prisma/client', () => ({
  PrismaClient: class MockPrismaClient {},
}));

const mockFindMany = mock(() => Promise.reject(new Error('Database connection lost')));
const mockFindUnique = mock(() => Promise.reject(new Error('Database connection lost')));

mock.module('../../src/lib/prisma', () => ({
  prisma: {
    complianceCertificate: {
      findMany: mockFindMany,
      findUnique: mockFindUnique,
    },
  },
  prismaQuery: {
    complianceCertificate: {
      findMany: mock(() => Promise.resolve([])),
      findUnique: mock(() => Promise.resolve(null)),
    },
  },
  getPrisma: mock(),
}));

const { certificatesRoutes } = await import('../../src/routes/certificates.ts');

describe('Certificate Routes: Error Paths', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    await app.register(certificatesRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/certs/:address', () => {
    it('returns 500 when database query fails', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/certs/0xabcdef1234567890abcdef1234567890abcdef12',
      });

      expect(response.statusCode).toBe(500);
      const body = response.json();
      expect(body.error).toBe('Failed to fetch certificates');
    });

    it('returns 400 for address that is too long', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/certs/0xabcdef1234567890abcdef1234567890abcdef12FF',
      });

      expect(response.statusCode).toBe(400);
    });

    it('returns 400 for address with special characters', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/certs/0xabcdef1234567890abcdef1234567890abcdef1!',
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/certs/:address/:uid', () => {
    it('returns 500 when database query fails on detail endpoint', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/certs/0xabcdef1234567890abcdef1234567890abcdef12/0xuid123',
      });

      expect(response.statusCode).toBe(500);
      const body = response.json();
      expect(body.error).toBe('Failed to fetch certificate');
    });

    it('returns 400 for invalid address in detail endpoint', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/certs/invalid/0xuid',
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
