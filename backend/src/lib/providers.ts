import { createGroq } from '@ai-sdk/groq';
import { createAnthropic } from '@ai-sdk/anthropic';
import { GROQ_API_KEY, ANTHROPIC_API_KEY } from '@/config/main-config.ts';

export const groq = createGroq({
  apiKey: GROQ_API_KEY,
});

export const anthropic = createAnthropic({
  apiKey: ANTHROPIC_API_KEY,
});

// Primary model: Groq Llama 3.3 70B (fast inference, ~300 tok/sec)
export const primaryModel = groq('llama-3.3-70b-versatile');

// Fallback model: Anthropic Claude Sonnet (higher quality, slower)
export const fallbackModel = anthropic('claude-sonnet-4-5');
