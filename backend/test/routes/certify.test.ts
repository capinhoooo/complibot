import { describe, it, expect, mock, beforeAll, afterAll } from 'bun:test';
import Fastify from 'fastify';

// Mock @prisma/client to prevent initialization error
mock.module('@prisma/client', () => ({
  PrismaClient: class MockPrismaClient {},
}));

// Mock viem with all needed exports (including those used by lib/viem.ts)
mock.module('viem', () => ({
  verifyTypedData: mock((args: any) => {
    if (args.signature === '0xaabb1122') return Promise.resolve(true);
    return Promise.resolve(false);
  }),
  keccak256: mock(() => '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'),
  toHex: mock((val: string) => `0x${Buffer.from(val).toString('hex')}`),
  encodePacked: mock(() => '0xencoded'),
  createPublicClient: mock(() => ({})),
  createWalletClient: mock(() => ({})),
  http: mock(() => ({})),
  defineChain: mock((config: any) => config),
  encodeAbiParameters: mock(() => '0x'),
  parseAbiParameters: mock(() => []),
}));

// Mock viem/accounts
mock.module('viem/accounts', () => ({
  privateKeyToAccount: mock(() => ({ address: '0x0000000000000000000000000000000000000000' })),
}));

// Mock lib/viem to prevent actual chain initialization
mock.module('../../src/lib/viem', () => ({
  publicClient: {},
  walletClient: null,
  currentChain: { id: 133, name: 'HashKey Chain Testnet' },
  hashkeyTestnet: { id: 133 },
  hashkeyMainnet: { id: 177 },
}));

// Mock chain service
mock.module('../../src/services/chain', () => ({
  checkKycStatus: mock(() => Promise.resolve({ isValid: true, level: 1 })),
  createAttestation: mock(() =>
    Promise.resolve({
      uid: '0xattestation123',
      txHash: '0xtxhash456',
      schemaUid: '0xschema789',
    })
  ),
  ChainServiceError: class ChainServiceError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ChainServiceError';
    }
  },
}));

// Mock prisma
mock.module('../../src/lib/prisma', () => ({
  prisma: {
    auditSession: {
      findUnique: mock(({ where }: any) => {
        if (where.id === 'valid-session-id') {
          return Promise.resolve({
            id: 'valid-session-id',
            code: 'pragma solidity ^0.8.24; contract Test {}',
            findings: { critical: 0, high: 1, medium: 2, low: 1 },
            score: 85,
            verdict: 'PASS',
          });
        }
        if (where.id === 'low-score-session') {
          return Promise.resolve({
            id: 'low-score-session',
            code: 'pragma solidity ^0.8.24;',
            findings: { critical: 0, high: 0, medium: 0, low: 0 },
            score: 50,
            verdict: 'FAIL',
          });
        }
        if (where.id === 'critical-session') {
          return Promise.resolve({
            id: 'critical-session',
            code: 'pragma solidity ^0.8.24;',
            findings: { critical: 1, high: 0, medium: 0, low: 0 },
            score: 75,
            verdict: 'FAIL',
          });
        }
        return Promise.resolve(null);
      }),
    },
    complianceCertificate: {
      findUnique: mock(() => Promise.resolve(null)),
      create: mock(({ data }: any) =>
        Promise.resolve({
          ...data,
          id: 'cert-1',
          createdAt: new Date('2026-04-04T12:00:00Z'),
        })
      ),
    },
  },
  prismaQuery: {
    auditSession: { findUnique: mock(() => Promise.resolve(null)) },
    complianceCertificate: { findUnique: mock(() => Promise.resolve(null)), create: mock(() => Promise.resolve({})) },
  },
  getPrisma: mock(),
}));

const { certifyRoutes } = await import('../../src/routes/certify.ts');

describe('POST /api/certify', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    await app.register(certifyRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  const validPayload = {
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    developerAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    auditSessionId: 'valid-session-id',
    complianceScore: 85,
    findingsSummary: { critical: 0, high: 1, medium: 2, low: 1 },
    signature: '0xaabb1122',
    nonce: 1,
  };

  it('returns 400 for invalid request body', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/certify',
      payload: { contractAddress: 'not-an-address' },
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns 400 for score below threshold', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/certify',
      payload: { ...validPayload, complianceScore: 50 },
    });

    // Zod rejects scores below 70
    expect(response.statusCode).toBe(400);
  });

  it('returns 401 for invalid signature', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/certify',
      payload: { ...validPayload, signature: '0xdeadbeef' },
    });

    expect(response.statusCode).toBe(401);
    const body = response.json();
    expect(body.error).toBe('Invalid signature');
  });

  it('returns 404 for nonexistent audit session', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/certify',
      payload: { ...validPayload, auditSessionId: 'nonexistent' },
    });

    expect(response.statusCode).toBe(404);
    const body = response.json();
    expect(body.error).toBe('Audit session not found');
  });

  it('returns 400 when audit session score is below threshold', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/certify',
      payload: { ...validPayload, auditSessionId: 'low-score-session' },
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error).toContain('below threshold');
  });

  it('returns 400 for critical findings', async () => {
    // Use a session that has critical findings on the server side
    // The route trusts server-side data, not client-submitted findingsSummary
    const response = await app.inject({
      method: 'POST',
      url: '/api/certify',
      payload: {
        ...validPayload,
        auditSessionId: 'critical-session',
        findingsSummary: { critical: 1, high: 0, medium: 0, low: 0 },
      },
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error).toContain('critical findings');
  });

  it('issues certificate for valid request', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/certify',
      payload: validPayload,
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.attestationUid).toBeDefined();
    expect(body.txHash).toBeDefined();
    expect(body.schemaUid).toBeDefined();
    expect(body.explorerUrl).toContain('testnet-explorer.hsk.xyz');
    expect(body.certificateUrl).toContain('/cert/');
    expect(body.timestamp).toBeDefined();
  });
});
