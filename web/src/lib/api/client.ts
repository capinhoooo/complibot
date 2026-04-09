import { env } from '@/env'

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `HTTP ${res.status}`
    let code = String(res.status)
    try {
      const body = (await res.json()) as { error?: string; code?: string }
      if (body.error) message = body.error
      if (body.code) code = body.code
    } catch {
      // non-JSON error body — keep defaults
    }
    throw new ApiError(res.status, code, message)
  }
  return res.json() as Promise<T>
}

function buildUrl(path: string): string {
  const base = env.VITE_API_URL.replace(/\/$/, '')
  return `${base}${path}`
}

export const apiClient = {
  async get<T>(path: string, signal?: AbortSignal): Promise<T> {
    const res = await fetch(buildUrl(path), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal,
    })
    return handleResponse<T>(res)
  },

  async post<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
    const res = await fetch(buildUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    })
    return handleResponse<T>(res)
  },
}

export const CHAT_API_URL = buildUrl('/api/chat')
