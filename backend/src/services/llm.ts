import { streamText, generateText, type StreamTextResult } from 'ai';
import { primaryModel, fallbackModel } from '@/lib/providers.ts';

interface StreamOptions {
  system: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}

/**
 * Extract a safe error message from an LLM error without leaking API keys,
 * internal URLs, or other sensitive details that may be present in the
 * full error object or response body.
 */
function safeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Only log the error name and message, never the full object
    // which may contain headers with Authorization: Bearer <key>
    return `${error.name}: ${error.message}`;
  }
  return 'Unknown LLM error';
}

/**
 * Stream text from the primary model (Groq Llama 3.3 70B).
 * If the primary model errors during streaming, the error is logged
 * but the stream has already started, so the client will see a partial response.
 */
export function streamWithFallback(options: StreamOptions): StreamTextResult<Record<string, never>, never> {
  return streamText({
    model: primaryModel,
    system: options.system,
    messages: options.messages,
    onError: ({ error }) => {
      console.error('[LLM] Primary model stream error:', safeErrorMessage(error));
    },
  });
}

/**
 * Generate text (non-streaming) with automatic fallback.
 * Tries the primary model first, falls back to Anthropic on failure.
 */
export async function generateWithFallback(options: StreamOptions): Promise<string> {
  try {
    const result = await generateText({
      model: primaryModel,
      system: options.system,
      messages: options.messages,
    });
    return result.text;
  } catch (error) {
    console.error('[LLM] Primary model failed, falling back to Anthropic:', safeErrorMessage(error));
    const result = await generateText({
      model: fallbackModel,
      system: options.system,
      messages: options.messages,
    });
    return result.text;
  }
}
