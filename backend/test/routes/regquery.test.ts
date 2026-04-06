import { describe, it, expect, mock, beforeAll, afterAll } from 'bun:test';
import Fastify from 'fastify';

// Mock @prisma/client to prevent initialization error
mock.module('@prisma/client', () => ({
  PrismaClient: class MockPrismaClient {},
}));

// Mock dependencies
mock.module('../../src/services/rag', () => ({
  retrieveChunks: mock(() =>
    Promise.resolve([
      { content: 'FATF Travel Rule requires...', source: 'regulations/fatf_travel_rule.md', category: 'regulation', similarity: 0.9 },
    ])
  ),
  formatChunksForPrompt: mock((chunks: any[]) =>
    chunks.map((c: any) => c.content).join('\n')
  ),
}));

// The /api/regquery route reads `result.textStream.getReader()` directly
// (legacy raw-text SSE framing). We mock the textStream as a simple
// ReadableStream of UTF-8 encoded text chunks so the reader loop terminates
// after one chunk.
//
// Bun's `mock.module` caches the first mocked surface across the test run.
// Other test files mock `generateText` and `convertToModelMessages`, so we
// must include them here too as no-ops; otherwise Bun fails subsequent
// imports of those names with a SyntaxError.
mock.module('ai', () => ({
  streamText: mock(() => ({
    textStream: new ReadableStream<string>({
      start(controller) {
        controller.enqueue('regulatory answer');
        controller.close();
      },
    }),
  })),
  generateText: mock(() => Promise.resolve({ text: '' })),
  convertToModelMessages: mock((m: any) => Promise.resolve(m)),
}));

mock.module('../../src/lib/providers', () => ({
  primaryModel: { modelId: 'test-model' },
  fallbackModel: { modelId: 'test-fallback' },
}));

const { regqueryRoutes } = await import('../../src/routes/regquery.ts');

describe('POST /api/regquery', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    await app.register(regqueryRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 400 for empty body', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/regquery',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns 400 when no user message found', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/regquery',
      payload: {
        messages: [{ role: 'assistant', content: 'test' }],
      },
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.error).toBe('No user message found');
  });

  it('streams response for valid regulatory question', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/regquery',
      payload: {
        messages: [
          { role: 'user', content: 'What are the FATF Travel Rule requirements for VASPs?' },
        ],
      },
    });

    expect(response.statusCode).toBe(200);
    // Route writes 'text/event-stream' directly via reply.raw.writeHead.
    expect(response.headers['content-type']).toBe('text/event-stream');
  });
});
