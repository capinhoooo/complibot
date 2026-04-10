import { useRouter } from '@tanstack/react-router'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

interface ErrorPageProps {
  error?: Error
  reset?: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter()

  function handleRetry() {
    if (reset) {
      reset()
    } else {
      void router.invalidate()
    }
  }

  function handleHome() {
    void router.navigate({ to: '/' })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-20 bg-[#08090a]">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]">
          <AlertTriangle className="h-6 w-6 text-[#f59e0b]" />
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#62666d]">
            Error
          </p>
          <h1
            className="text-[32px] leading-[1.13] tracking-[-0.704px] text-[#f7f8f8]"
            style={{ fontWeight: 510 }}
          >
            Something went wrong
          </h1>
          <p className="text-[15px] leading-[1.6] tracking-[-0.165px] text-[#8a8f98]">
            An unexpected error occurred. Try refreshing the page.
          </p>
        </div>

        {error && (
          <div className="rounded-[8px] border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.04)] px-4 py-3 text-left">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#62666d] mb-1">
              Details
            </p>
            <p className="font-mono text-[13px] text-[#ef4444] break-all">
              {error.message || 'Unknown error'}
            </p>
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-md bg-[#5e6ad2] px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#6b77e0]"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <button
            onClick={handleHome}
            className="inline-flex items-center gap-2 rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] px-4 py-2.5 text-[13px] font-medium text-[#d0d6e0] transition-colors hover:bg-[rgba(255,255,255,0.04)]"
          >
            <Home className="h-4 w-4" />
            Go home
          </button>
        </div>
      </div>
    </div>
  )
}
