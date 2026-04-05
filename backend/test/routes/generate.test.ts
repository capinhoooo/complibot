import { describe, it, expect, mock, beforeAll, afterAll } from 'bun:test';
import Fastify from 'fastify';

// Mock @prisma/client to prevent initialization error
mock.module('@prisma/client', () => ({
  PrismaClient: class MockPrismaClient {},
}));

// Mock RAG service
mock.module('../../src/services/rag', () => ({
  retrieveChunks: mock(() =>
    Promise.resolve([
      { content: 'KYC gate pattern: use isHuman()', source: 'patterns/kyc_gate.md', category: 'pattern', similarity: 0.85 },
    ])
  ),
  formatChunksForPrompt: mock((chunks: any[]) =>
    chunks.map((c: any) => c.content).join('\n')
  ),
}));

// Mock AI SDK streamText. The /api/generate route reads textStream directly
// and pipes raw chunks to reply.raw, so we expose textStream as a simple
// ReadableStream<string> the route's getReader() loop can consume.
//
// Includes generateText/convertToModelMessages stubs so this mock surface
// matches the other test files' mocks (Bun caches the first mocked surface
// across files; missing names cause later imports to fail).
mock.module('ai', () => ({
  streamText: mock(() => ({
    textStream: new ReadableStream<string>({
      start(controller) {
        controller.enqueue('test');
        controller.close();
      },
    }),
  })),
  generateText: mock(() => Promise.resolve({ text: '' })),
  convertToModelMessages: mock((m: any) => Promise.resolve(m)),
}));

// Mock providers
mock.module('../../src/lib/providers', () => ({
  primaryModel: { modelId: 'test-model' },
  fallbackModel: { modelId: 'test-fallback' },
}));

const { generateRoutes } = await import('../../src/routes/generate.ts');

describe('POST /api/generate', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    await app.register(generateRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 400 for empty body', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/generate',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns 400 for missing messages', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/generate',
      payload: { messages: [] },
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns 400 when no user message is present', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/generate',
      payload: {
        messages: [{ role: 'assistant', content: 'Hello' }],
      },
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error).toBe('No user message found');
  });

  it('returns streaming response for valid request', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/generate',
      payload: {
        messages: [
          { role: 'user', content: 'Build a KYC-gated ERC-20 token' },
        ],
      },
    });

    expect(response.statusCode).toBe(200);
    // Route writes 'text/event-stream' directly via reply.raw.writeHead.
    expect(response.headers['content-type']).toBe('text/event-stream');
  });
});
