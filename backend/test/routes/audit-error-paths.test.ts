import { describe, it, expect, mock, beforeAll, afterAll } from 'bun:test';
import Fastify from 'fastify';

mock.module('@prisma/client', () => ({
  PrismaClient: class MockPrismaClient {},
}));

const mockRetrieveChunks = mock(() => Promise.reject(new Error('pgvector connection lost')));

mock.module('../../src/services/rag', () => ({
  retrieveChunks: mockRetrieveChunks,
  formatChunksForPrompt: mock((chunks: any[]) => chunks.map((c: any) => c.content).join('\n')),
}));

mock.module('ai', () => ({
  generateText: mock(() => Promise.resolve({ text: '{"severity":"LOW","title":"x","description":"y"}' })),
  streamText: mock(() => ({})),
  convertToModelMessages: mock((m: any) => Promise.resolve(m)),
}));

mock.module('../../src/lib/providers', () => ({
  primaryModel: { modelId: 'test-model' },
  fallbackModel: { modelId: 'test-fallback' },
}));

mock.module('../../src/lib/prisma', () => {
  const auditSession = {
    create: mock(() => Promise.resolve({ id: 'sess-1', createdAt: new Date() })),
  };
  return {
    prisma: { auditSession },
    prismaQuery: { auditSession },
  };
});

const { auditRoutes } = await import('../../src/routes/audit.ts');

const VALID_CODE = 'pragma solidity ^0.8.24; contract Test { function foo() external {} }';

describe('POST /api/audit: Error Paths', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    await app.register(auditRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 500 when RAG service throws during audit', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/audit',
      payload: {
        messages: [{ role: 'user', content: 'Audit this contract' }],
        contractCode: VALID_CODE,
      },
    });

    expect(response.statusCode).toBe(500);
    const body = response.json();
    expect(body.error).toBe('Failed to audit contract');
  });

  it('returns 400 for invalid targetChain value', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/audit',
      payload: {
        messages: [{ role: 'user', content: 'Audit' }],
        contractCode: VALID_CODE,
        targetChain: 'ethereum_mainnet',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns 400 when contractCode missing (no DB write attempted)', async () => {
    // The audit route now requires contractCode because the persisted
    // AuditSession row is the certify-flow anchor. Without code there is
    // nothing to certify against.
    const response = await app.inject({
      method: 'POST',
      url: '/api/audit',
      payload: {
        messages: [{ role: 'assistant', content: 'I found issues' }],
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
