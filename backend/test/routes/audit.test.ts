import { describe, it, expect, mock, beforeAll, afterAll } from 'bun:test';
import Fastify from 'fastify';

// Mock @prisma/client to prevent initialization error
mock.module('@prisma/client', () => ({
  PrismaClient: class MockPrismaClient {},
}));

// Mock RAG retrieval
mock.module('../../src/services/rag', () => ({
  retrieveChunks: mock(() =>
    Promise.resolve([
      { content: 'ReentrancyGuard pattern...', source: 'patterns/reentrancy_guard.md', category: 'pattern', similarity: 0.88 },
    ])
  ),
  formatChunksForPrompt: mock((chunks: any[]) =>
    chunks.map((c: any) => c.content).join('\n')
  ),
}));

// Mock the AI SDK to return a deterministic structured audit response.
// The route uses generateText (non-streaming) and feeds the text into the
// audit parser, so we return JSON-shaped findings + summary the parser will
// recognize.
const AUDIT_LLM_OUTPUT = `Here is the audit:

{"severity": "HIGH", "title": "Missing reentrancy guard on transfer", "description": "Direct balance update without ReentrancyGuard violates HashKey Chain best practices.", "location": {"function": "transfer", "line": 12}, "fix": "Add OpenZeppelin ReentrancyGuard.", "code_before": "function transfer", "code_after": "function transfer nonReentrant", "regulation": "HashKey Chain Security Guideline 3.2"}

{"severity": "MEDIUM", "title": "No transaction limit", "description": "FATF Travel Rule requires per-tx limits.", "location": {"function": "transfer", "line": 12}, "fix": "Add maxTransfer modifier.", "code_before": "", "code_after": "", "regulation": "FATF R.16"}

{"total_findings": 2, "critical": 0, "high": 1, "medium": 1, "low": 0, "compliance_score": 80, "verdict": "CONDITIONAL", "top_recommendation": "Add reentrancy guard."}`;

mock.module('ai', () => ({
  generateText: mock(() => Promise.resolve({ text: AUDIT_LLM_OUTPUT })),
  // Other exports kept as no-ops to satisfy any incidental imports.
  streamText: mock(() => ({})),
  convertToModelMessages: mock((m: any) => Promise.resolve(m)),
}));

mock.module('../../src/lib/providers', () => ({
  primaryModel: { modelId: 'test-model' },
  fallbackModel: { modelId: 'test-fallback' },
}));

// Mock prisma — capture the data passed to auditSession.create so we can
// assert the persisted shape.
const createCalls: any[] = [];
mock.module('../../src/lib/prisma', () => {
  const auditSession = {
    create: mock((args: any) => {
      createCalls.push(args);
      return Promise.resolve({
        id: 'audit-session-123',
        createdAt: new Date('2026-04-07T12:00:00Z'),
      });
    }),
  };
  return {
    prisma: { auditSession },
    prismaQuery: { auditSession },
  };
});

const { auditRoutes } = await import('../../src/routes/audit.ts');

const SAMPLE_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleToken {
    mapping(address => uint256) public balances;

    function transfer(address to, uint256 amount) external {
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}`;

describe('POST /api/audit', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    await app.register(auditRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 400 for empty body', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/audit',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns 400 for contract code below minimum length', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/audit',
      payload: {
        messages: [{ role: 'user', content: 'Audit this' }],
        contractCode: 'too short',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns 400 when contractCode is omitted', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/audit',
      payload: {
        messages: [{ role: 'user', content: 'Audit the contract I pasted in the editor' }],
      },
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error).toBe('contractCode is required');
  });

  it('returns 400 for invalid wallet address format', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/audit',
      payload: {
        messages: [{ role: 'user', content: 'Audit this' }],
        contractCode: SAMPLE_CONTRACT,
        walletAddress: 'not-a-wallet',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('persists AuditSession and returns auditSessionId for valid request', async () => {
    createCalls.length = 0;
    const response = await app.inject({
      method: 'POST',
      url: '/api/audit',
      payload: {
        messages: [{ role: 'user', content: 'Please audit this contract for compliance' }],
        contractCode: SAMPLE_CONTRACT,
        contractName: 'SimpleToken',
        targetChain: 'hashkey_testnet',
        walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();

    // Response shape contract for the frontend
    expect(body.auditSessionId).toBe('audit-session-123');
    expect(body.score).toBe(80); // Recomputed: 100 - (0*25 + 1*15 + 1*5 + 0*2) = 80
    expect(body.verdict).toBe('CONDITIONAL'); // score >= 70 with high findings
    expect(body.findingsSummary).toEqual({ critical: 0, high: 1, medium: 1, low: 0 });
    expect(Array.isArray(body.findings)).toBe(true);
    expect(body.findings).toHaveLength(2);
    expect(body.findings[0].severity).toBe('HIGH');
    expect(body.summary.total_findings).toBe(2);
    expect(body.createdAt).toBeDefined();

    // Persistence assertion: prisma.auditSession.create was called with the
    // correct shape. This is the load-bearing fix the certify route depends on.
    expect(createCalls).toHaveLength(1);
    const persisted = createCalls[0].data;
    expect(persisted.code).toBe(SAMPLE_CONTRACT);
    expect(persisted.contractName).toBe('SimpleToken');
    expect(persisted.walletAddress).toBe('0xabcdef1234567890abcdef1234567890abcdef12');
    expect(persisted.score).toBe(80);
    expect(persisted.verdict).toBe('CONDITIONAL');
    expect(persisted.findings).toBeDefined();
  });

  it('persists with null walletAddress when omitted', async () => {
    createCalls.length = 0;
    const response = await app.inject({
      method: 'POST',
      url: '/api/audit',
      payload: {
        messages: [{ role: 'user', content: 'Audit this' }],
        contractCode: SAMPLE_CONTRACT,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(createCalls).toHaveLength(1);
    expect(createCalls[0].data.walletAddress).toBeNull();
  });
});
