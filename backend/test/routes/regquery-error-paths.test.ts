import { describe, it, expect, mock, beforeAll, afterAll } from 'bun:test';
import Fastify from 'fastify';

mock.module('@prisma/client', () => ({
  PrismaClient: class MockPrismaClient {},
}));

const mockRetrieveChunks = mock(() => Promise.reject(new Error('Embedding API rate limited')));

mock.module('../../src/services/rag', () => ({
  retrieveChunks: mockRetrieveChunks,
  formatChunksForPrompt: mock((chunks: any[]) => chunks.map((c: any) => c.content).join('\n')),
}));

// Include generateText/convertToModelMessages stubs so this mock surface
// matches the other test files' mocks. Bun caches the first mocked surface
// and later imports of missing names fail with a SyntaxError otherwise.
mock.module('ai', () => ({
  streamText: mock(() => ({
    textStream: new ReadableStream<string>({
      start(controller) {
        controller.enqueue('answer');
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

describe('POST /api/regquery: Error Paths', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    await app.register(regqueryRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 500 when RAG service throws during regquery', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/regquery',
      payload: {
        messages: [{ role: 'user', content: 'What are the FATF requirements?' }],
      },
    });

    expect(response.statusCode).toBe(500);
    const body = response.json();
    expect(body.error).toBe('Failed to process regulatory query');
  });

  it('returns 400 for empty string content in message', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/regquery',
      payload: {
        messages: [{ role: 'user', content: '' }],
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
