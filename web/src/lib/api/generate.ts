import { env } from '@/env'

export class GenerateError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'GenerateError'
  }
}

/**
 * Stream a contract generation from POST /api/generate.
 * The backend writes raw text chunks (not AI SDK framing),
 * so we read the ReadableStream directly.
 */
export async function streamGenerate(
  prompt: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const base = env.VITE_API_URL.replace(/\/$/, '')
  const res = await fetch(`${base}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user' as const, content: prompt }],
    }),
    signal,
  })

  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const body = (await res.json()) as { error?: string }
      if (body.error) message = body.error
    } catch {
      // non-JSON error body
    }
    throw new GenerateError(res.status, message)
  }

  const reader = res.body!.getReader()

  const decoder = new TextDecoder()
  let done = false
  try {
    while (!done) {
      const result = await reader.read()
      done = result.done
      if (result.value) {
        onChunk(decoder.decode(result.value, { stream: true }))
      }
    }
  } finally {
    reader.releaseLock()
  }
}
