import { describe, it, expect, mock, beforeAll, afterAll } from 'bun:test';
import Fastify from 'fastify';

// Mock @prisma/client to prevent initialization error
mock.module('@prisma/client', () => ({
  PrismaClient: class MockPrismaClient {},
}));

const mockCertificates = [
  {
    attestationUid: '0xuid1',
    txHash: '0xtx1',
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    developerAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    score: 85,
    findings: { critical: 0, high: 1, medium: 2, low: 1 },
    explorerUrl: 'https://testnet-explorer.hsk.xyz/tx/0xtx1',
    createdAt: new Date('2026-04-04T12:00:00Z'),
  },
];

mock.module('../../src/lib/prisma', () => ({
  prisma: {
    complianceCertificate: {
      findMany: mock(({ where }: any) => {
        if (where.developerAddress === '0xabcdef1234567890abcdef1234567890abcdef12') {
          return Promise.resolve(mockCertificates);
        }
        return Promise.resolve([]);
      }),
      findUnique: mock(({ where }: any) => {
        if (where.attestationUid === '0xuid1') {
          return Promise.resolve({
            ...mockCertificates[0],
            schemaUid: '0xschema1',
            auditSessionId: 'session-1',
            auditSession: {
              id: 'session-1',
              code: 'contract Test {}',
              findings: [],
              score: 85,
              verdict: 'PASS',
            },
          });
        }
        return Promise.resolve(null);
      }),
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

describe('Certificate routes', () => {
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
    it('returns 400 for invalid address', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/certs/not-an-address',
      });

      expect(response.statusCode).toBe(400);
    });

    it('returns certificates for valid address', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/certs/0xabcdef1234567890abcdef1234567890abcdef12',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.certificates).toBeArray();
      expect(body.certificates.length).toBe(1);
      expect(body.certificates[0].attestationUid).toBe('0xuid1');
    });

    it('returns empty array for address with no certificates', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/certs/0x0000000000000000000000000000000000000001',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.certificates).toBeArray();
      expect(body.certificates.length).toBe(0);
    });
  });

  describe('GET /api/certs/:address/:uid', () => {
    it('returns certificate detail with audit session', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/certs/0xabcdef1234567890abcdef1234567890abcdef12/0xuid1',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.certificate).toBeDefined();
      expect(body.certificate.attestationUid).toBe('0xuid1');
      expect(body.certificate.auditSession).toBeDefined();
      expect(body.certificate.auditSession.score).toBe(85);
    });

    it('returns 404 for nonexistent certificate', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/certs/0xabcdef1234567890abcdef1234567890abcdef12/0xnonexistent',
      });

      expect(response.statusCode).toBe(404);
      const body = response.json();
      expect(body.error).toBe('Certificate not found');
    });
  });
});
