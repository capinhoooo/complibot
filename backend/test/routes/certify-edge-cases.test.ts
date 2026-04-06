import { describe, it, expect, mock, beforeAll, afterAll } from 'bun:test';
import Fastify from 'fastify';

// Mock @prisma/client to prevent initialization error
mock.module('@prisma/client', () => ({
  PrismaClient: class MockPrismaClient {},
}));

// Mock viem
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

mock.module('viem/accounts', () => ({
  privateKeyToAccount: mock(() => ({ address: '0x0000000000000000000000000000000000000000' })),
}));

mock.module('../../src/lib/viem', () => ({
  publicClient: {},
  walletClient: null,
  currentChain: { id: 133, name: 'HashKey Chain Testnet' },
  hashkeyTestnet: { id: 133 },
  hashkeyMainnet: { id: 177 },
}));

// Track mock calls for duplicate check
const mockFindUniqueCert = mock(() => Promise.resolve(null));

// Mock chain service: KYC passes, but createAttestation throws ChainServiceError
class ChainServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChainServiceError';
  }
}

const mockCheckKyc = mock(() => Promise.resolve({ isValid: true, level: 1 }));
const mockCreateAttestation = mock(() =>
  Promise.resolve({
    uid: '0xattestation123',
    txHash: '0xtxhash456',
    schemaUid: '0xschema789',
  })
);

mock.module('../../src/services/chain', () => ({
  checkKycStatus: mockCheckKyc,
  createAttestation: mockCreateAttestation,
  ChainServiceError,
}));

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
        return Promise.resolve(null);
      }),
    },
    complianceCertificate: {
      findUnique: mockFindUniqueCert,
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

describe('POST /api/certify: Edge Cases', () => {
  let app: ReturnType<typeof Fastify>;

  const validPayload = {
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    developerAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    auditSessionId: 'valid-session-id',
    complianceScore: 85,
    findingsSummary: { critical: 0, high: 1, medium: 2, low: 1 },
    signature: '0xaabb1122',
    nonce: 1,
  };

  beforeAll(async () => {
    app = Fastify({ logger: false });
    await app.register(certifyRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 409 for duplicate certification', async () => {
    mockFindUniqueCert.mockResolvedValueOnce({
      attestationUid: '0xexisting-uid',
      auditSessionId: 'valid-session-id',
    });

    const response = await app.inject({
      method: 'POST',
      url: '/api/certify',
      payload: validPayload,
    });

    expect(response.statusCode).toBe(409);
    const body = response.json();
    expect(body.error).toBe('Audit session already certified');
    expect(body.attestationUid).toBe('0xexisting-uid');
  });

  it('returns 403 when KYC verification fails', async () => {
    mockFindUniqueCert.mockResolvedValueOnce(null);
    mockCheckKyc.mockResolvedValueOnce({ isValid: false, level: 0 });

    const response = await app.inject({
      method: 'POST',
      url: '/api/certify',
      payload: validPayload,
    });

    expect(response.statusCode).toBe(403);
    const body = response.json();
    expect(body.error).toContain('KYC');
  });

  it('returns 502 when chain service throws ChainServiceError', async () => {
    mockFindUniqueCert.mockResolvedValueOnce(null);
    mockCheckKyc.mockResolvedValueOnce({ isValid: true, level: 1 });
    mockCreateAttestation.mockRejectedValueOnce(
      new ChainServiceError('Attester wallet not configured')
    );

    const response = await app.inject({
      method: 'POST',
      url: '/api/certify',
      payload: validPayload,
    });

    expect(response.statusCode).toBe(502);
    const body = response.json();
    expect(body.error).toBe('Blockchain service error');
  });

  it('returns 500 for unexpected errors', async () => {
    mockFindUniqueCert.mockResolvedValueOnce(null);
    mockCheckKyc.mockResolvedValueOnce({ isValid: true, level: 1 });
    mockCreateAttestation.mockRejectedValueOnce(new Error('Unexpected database crash'));

    const response = await app.inject({
      method: 'POST',
      url: '/api/certify',
      payload: validPayload,
    });

    expect(response.statusCode).toBe(500);
    const body = response.json();
    expect(body.error).toBe('Failed to issue certificate');
  });

  it('returns 400 for non-integer compliance score', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/certify',
      payload: { ...validPayload, complianceScore: 85.5 },
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns 400 for missing findingsSummary fields', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/certify',
      payload: {
        ...validPayload,
        findingsSummary: { critical: 0 }, // missing high, medium, low
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
