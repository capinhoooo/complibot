import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { streamText } from 'ai';
import { RegQuerySchema } from '@/shared/schemas.ts';
import { primaryModel } from '@/lib/providers.ts';
import { retrieveChunks, formatChunksForPrompt } from '@/services/rag.ts';
import { buildRegQueryPrompt } from '@/prompts/regquery.ts';

export async function regqueryRoutes(app: FastifyInstance) {
  app.post('/api/regquery', {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '1 minute',
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = RegQuerySchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Invalid request',
        details: parseResult.error.issues,
      });
    }

    const body = parseResult.data;
    const lastUserMessage = body.messages.findLast((m) => m.role === 'user');
    if (!lastUserMessage) {
      return reply.status(400).send({ error: 'No user message found' });
    }

    try {
      // RAG retrieval: regulations and HashKey-specific docs
      const chunks = await retrieveChunks(lastUserMessage.content, {
        topK: 5,
        categories: ['regulation', 'hashkey'],
      });
      const context = formatChunksForPrompt(chunks);

      const result = streamText({
        model: primaryModel,
        system: buildRegQueryPrompt(context),
        messages: body.messages,
      });

      reply.hijack();
      const origin = request.headers.origin;
      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        ...(origin && { 'Access-Control-Allow-Origin': origin }),
      });

      const reader = result.textStream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          reply.raw.write(value);
        }
      } finally {
        reply.raw.end();
      }
      return;
    } catch (error) {
      app.log.error({ error }, 'RegQuery route error');
      return reply.status(500).send({ error: 'Failed to process regulatory query' });
    }
  });
}
