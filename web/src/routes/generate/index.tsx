import { useRef, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { ArrowRight, Code, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@heroui/react'
import CodeSnippet from '@/components/CodeSnippet'
import EmptyState from '@/components/EmptyState'
import { GenerateError, streamGenerate } from '@/lib/api/generate'
import { DURATION, EASE } from '@/utils/motion'
import { cnm } from '@/utils/style'

export const Route = createFileRoute('/generate/')({ component: GeneratePage })

const EXAMPLE_PROMPT =
  'A staking pool that accepts HSK, enforces KYC verification via HashKey\'s isHuman() check, has a 7-day lock period, and emits compliance events for all deposits and withdrawals.'

function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<'idle' | 'streaming' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const abortRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const thisId = ++requestIdRef.current
    setOutput('')
    setError('')
    setStatus('streaming')

    try {
      await streamGenerate(
        prompt.trim(),
        (chunk) => {
          if (thisId !== requestIdRef.current) return
          setOutput((prev) => prev + chunk)
        },
        controller.signal,
      )
      if (thisId === requestIdRef.current) {
        setStatus('done')
      }
    } catch (err: unknown) {
      if (thisId !== requestIdRef.current) return
      if (err instanceof DOMException && err.name === 'AbortError') return
      const message =
        err instanceof GenerateError
          ? err.message
          : 'Something went wrong. Please try again.'
      setError(message)
      setStatus('error')
    }
  }

  const handleClear = () => {
    abortRef.current?.abort()
    setPrompt('')
    setOutput('')
    setError('')
    setStatus('idle')
  }

  const handleLoadExample = () => {
    setPrompt(EXAMPLE_PROMPT)
  }

  const isStreaming = status === 'streaming'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.page, ease: EASE }}
      className="flex min-h-[calc(100vh-3.5rem)] flex-col md:flex-row"
    >
      {/* Left pane: prompt input */}
      <div className="flex flex-col border-b border-[rgba(255,255,255,0.08)] md:w-[55%] md:border-b-0 md:border-r">
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] px-4 py-3">
          <div className="flex items-center gap-2">
            <h1
              className="text-[14px] tracking-[-0.011em] text-[#f7f8f8]"
              style={{ fontWeight: 510 }}
            >
              Contract Generator
            </h1>
          </div>
          <span className="text-[12px] tabular-nums text-[#62666d]">
            {prompt.length.toLocaleString()} chars
          </span>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the smart contract you want to build..."
          disabled={isStreaming}
          className={cnm(
            'flex-1 resize-none bg-transparent px-4 py-4 font-mono text-[14px] leading-[1.7] text-[#f7f8f8] placeholder-[#3e3e44] outline-none',
            'min-h-[200px] md:min-h-0',
          )}
        />

        <div className="flex flex-wrap items-center gap-2 border-t border-[rgba(255,255,255,0.08)] px-4 py-3">
          <Button
            size="sm"
            variant="flat"
            onPress={handleLoadExample}
            isDisabled={isStreaming}
            className="text-[13px] text-[#8a8f98]"
          >
            Load example
          </Button>
          <Button
            size="sm"
            variant="flat"
            onPress={handleClear}
            isDisabled={isStreaming && !output}
            className="text-[13px] text-[#8a8f98]"
          >
            Clear
          </Button>
          <div className="flex-1" />
          <Button
            size="sm"
            color="primary"
            onPress={handleGenerate}
            isDisabled={isStreaming || !prompt.trim()}
            className="gap-1.5 bg-[#5e6ad2] text-[13px] font-medium text-white"
          >
            {isStreaming ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Generating…
              </>
            ) : (
              'Generate'
            )}
          </Button>
        </div>
      </div>

      {/* Right pane: output */}
      <div className="flex flex-1 flex-col overflow-hidden md:w-[45%]">
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] px-4 py-3">
          <h2
            className="text-[14px] tracking-[-0.011em] text-[#f7f8f8]"
            style={{ fontWeight: 510 }}
          >
            Output
          </h2>
          {isStreaming && (
            <span className="flex items-center gap-1.5 text-[12px] text-[#7170ff]">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#7170ff]" />
              Streaming…
            </span>
          )}
        </div>

        <div className="flex-1 overflow-auto p-4">
          {status === 'idle' && !output && (
            <EmptyState
              icon={<Code className="h-5 w-5" />}
              title="Describe what you want to build"
              body="CompliBot will generate a compliant Solidity contract with KYC gates, access control, and compliance events baked in."
            />
          )}

          {status === 'error' && (
            <div className="rounded-[10px] border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.06)] p-4">
              <p className="text-[14px] text-[#ef4444]">{error}</p>
              <Button
                size="sm"
                variant="flat"
                onPress={handleGenerate}
                className="mt-3 text-[13px] text-[#ef4444]"
              >
                Retry
              </Button>
            </div>
          )}

          {(status === 'streaming' || status === 'done') && output && (
            <div className="space-y-4">
              <CodeSnippet code={output} language="solidity" />

              {status === 'done' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, ease: EASE }}
                  className="flex flex-wrap gap-2"
                >
                  <Link
                    to="/audit"
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#5e6ad2] px-3 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#6b77e0]"
                  >
                    Open in Audit
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
