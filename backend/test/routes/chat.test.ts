import { describe, it, expect, mock, beforeAll, afterAll } from 'bun:test';
import Fastify from 'fastify';

mock.module('@prisma/client', () => ({
  PrismaClient: class MockPrismaClient {},
}));

mock.module('../../src/services/rag', () => ({
  retrieveChunks: mock(() =>
    Promise.resolve([
      { content: 'FATF Travel Rule R.16...', source: 'regulations/fatf.md', category: 'regulation', similarity: 0.91 },
    ])
  ),
  formatChunksForPrompt: mock((chunks: any[]) => chunks.map((c: any) => c.content).join('\n')),
}));

// Simulate what AI SDK v6 streamText().toUIMessageStreamResponse() returns:
// a Web Standard Response with a streaming body. Fastify v5 reply.send()
// natively forwards this.
mock.module('ai', () => ({
  streamText: mock(() => ({
    toUIMessageStreamResponse: () =>
      new Response(
        new ReadableStream({
          start(controller) {
            // Mimic the AI SDK data-stream protocol shape (SSE-style chunks).
            // Real responses contain framed JSON parts; we just need a valid
            // stream the test client can read.
            controller.enqueue(
              new TextEncoder().encode('data: {"type":"text-delta","textDelta":"hello"}\n\n'),
            );
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
            controller.close();
          },
        }),
        {
          status: 200,
          headers: {
            'content-type': 'text/event-stream',
            'cache-control': 'no-cache',
          },
        },
      ),
  })),
  convertToModelMessages: mock((messages: any[]) =>
    Promise.resolve(
      messages.map((m: any) => ({
        role: m.role,
        content: (m.parts ?? []).filter((p: any) => p.type === 'text').map((p: any) => p.text).join(''),
      })),
    ),
  ),
}));

mock.module('../../src/lib/providers', () => ({
  primaryModel: { modelId: 'test-model' },
  fallbackModel: { modelId: 'test-fallback' },
}));

const { chatRoutes } = await import('../../src/routes/chat.ts');

describe('POST /api/chat', () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    await app.register(chatRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 400 for empty body', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns 400 for legacy {role, content} message shape', async () => {
    // The chat route accepts the AI SDK v6 UIMessage shape (parts array),
    // not the legacy {role, content} string used by /api/regquery.
    const response = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: {
        messages: [{ role: 'user', content: 'Hello' }],
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns 400 when no user message present', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: {
        messages: [
          {
            id: 'm-1',
            role: 'assistant',
            parts: [{ type: 'text', text: 'I am the assistant' }],
          },
        ],
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error).toBe('No user message found');
  });

  it('streams a UI message stream response for a valid useChat-shaped request', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: {
        id: 'chat-session-1',
        messages: [
          {
            id: 'm-1',
            role: 'user',
            parts: [{ type: 'text', text: 'Do I need KYC for a DEX on HashKey Chain?' }],
          },
        ],
      },
    });

    expect(response.statusCode).toBe(200);
    // The response must carry an SSE-flavored content-type because that is
    // what useChat reads. Anything else and the hook will refuse to parse.
    expect(response.headers['content-type']).toContain('text/event-stream');
    // Body must contain at least one SDK-protocol chunk.
    expect(response.body).toContain('data:');
  });

  it('accepts assistant messages in the history alongside user messages', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/chat',
      payload: {
        messages: [
          {
            id: 'm-1',
            role: 'user',
            parts: [{ type: 'text', text: 'What is FATF?' }],
          },
          {
            id: 'm-2',
            role: 'assistant',
            parts: [{ type: 'text', text: 'FATF is...' }],
          },
          {
            id: 'm-3',
            role: 'user',
            parts: [{ type: 'text', text: 'Tell me more' }],
          },
        ],
      },
    });

    expect(response.statusCode).toBe(200);
  });
});
