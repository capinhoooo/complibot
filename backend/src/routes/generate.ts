import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { streamText } from 'ai';
import { GenerateSchema } from '@/shared/schemas.ts';
import { primaryModel } from '@/lib/providers.ts';
import { retrieveChunks, formatChunksForPrompt } from '@/services/rag.ts';
import { buildGeneratePrompt } from '@/prompts/generate.ts';

export async function generateRoutes(app: FastifyInstance) {
  app.post('/api/generate', {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '1 minute',
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    // Validate request body
    const parseResult = GenerateSchema.safeParse(request.body);
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
      // RAG retrieval: pull compliance patterns, templates, and regulations
      const chunks = await retrieveChunks(lastUserMessage.content, {
        topK: 8,
        categories: ['pattern', 'template', 'regulation', 'hashkey'],
      });
      const context = formatChunksForPrompt(chunks);

      // Stream LLM response
      const result = streamText({
        model: primaryModel,
        system: buildGeneratePrompt(context),
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
      app.log.error({ error }, 'Generate route error');
      return reply.status(500).send({ error: 'Failed to generate contract' });
    }
  });
}
