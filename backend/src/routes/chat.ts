import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { ChatRequestSchema } from '@/shared/schemas.ts';
import { primaryModel } from '@/lib/providers.ts';
import { retrieveChunks, formatChunksForPrompt } from '@/services/rag.ts';
import { buildRegQueryPrompt } from '@/prompts/regquery.ts';

/**
 * POST /api/chat
 *
 * Streaming chat endpoint that is wire-compatible with `@ai-sdk/react` `useChat`
 * (AI SDK v6). Uses `result.toUIMessageStreamResponse()` so the client receives
 * the AI SDK data-stream protocol (SSE chunks of UI message parts) instead of
 * raw text. Without this framing the `useChat` hook cannot consume the response.
 *
 * The request body shape is the AI SDK v6 UIMessage shape:
 *   { messages: Array<{ id, role, parts: Array<{type, text, ...}> }>, id? }
 *
 * The route is RAG-grounded against the regulations and HashKey Chain knowledge
 * base. It mirrors the prompt logic of `/api/regquery` but speaks the protocol
 * `useChat` expects.
 */
export async function chatRoutes(app: FastifyInstance) {
  app.post('/api/chat', {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '1 minute',
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    // 1. Validate input at the route boundary.
    const parseResult = ChatRequestSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Invalid request',
        details: parseResult.error.issues,
      });
    }

    const { messages } = parseResult.data;

    // 2. Find the last user text part for the RAG retrieval query.
    // We do not concatenate every previous message to keep the embedding query
    // focused on the user's latest intent.
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMessage) {
      return reply.status(400).send({ error: 'No user message found' });
    }

    const lastUserText = lastUserMessage.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text' && typeof (p as { text?: unknown }).text === 'string')
      .map((p) => p.text)
      .join('\n')
      .trim();

    if (!lastUserText) {
      return reply.status(400).send({ error: 'No user text content found' });
    }

    try {
      // 3. RAG: regulations + HashKey-specific docs (mirrors regquery semantics).
      const chunks = await retrieveChunks(lastUserText, {
        topK: 5,
        categories: ['regulation', 'hashkey'],
      });
      const context = formatChunksForPrompt(chunks);

      // 4. Convert UIMessages -> ModelMessages so streamText can consume them.
      // useChat sends `parts`; streamText needs the canonical ModelMessage shape.
      const modelMessages = await convertToModelMessages(messages as UIMessage[]);

      const result = streamText({
        model: primaryModel,
        system: buildRegQueryPrompt(context),
        messages: modelMessages,
        onError: ({ error }) => {
          // Never log the full error object: AI SDK errors can carry response
          // headers including Authorization: Bearer <api-key>. Log only the
          // class + message so secrets cannot leak into log sinks.
          const safe = error instanceof Error ? `${error.name}: ${error.message}` : 'Unknown LLM error';
          app.log.error({ error: safe }, 'Chat stream error');
        },
      });

      // 5. Return the UI message stream response. Fastify v5's reply.send()
      //    natively forwards a Web Standard Response (status, headers, body
      //    ReadableStream) to the client, so we don't need raw socket writes.
      return reply.send(result.toUIMessageStreamResponse());
    } catch (error) {
      // Generic error to client. Full details to server logs.
      app.log.error({ error }, 'Chat route error');
      return reply.status(500).send({ error: 'Failed to process chat request' });
    }
  });
}
