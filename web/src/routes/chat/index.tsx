import { useCallback, useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { AnimatePresence, motion } from 'motion/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Loader2, Menu, MessageSquare, Plus, Send, Trash2, X } from 'lucide-react'
import { Button, Popover, PopoverContent, PopoverTrigger, Textarea, addToast } from '@heroui/react'
import type { UIMessage } from 'ai'
import CodeSnippet from '@/components/CodeSnippet'
import RegulationCitation from '@/components/RegulationCitation'
import EmptyState from '@/components/EmptyState'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { CHAT_API_URL } from '@/lib/api/client'
import { DURATION, EASE, STAGGER } from '@/utils/motion'
import { cnm } from '@/utils/style'

/** Extract plain text from a UIMessage by joining all text parts. */
function extractText(msg: UIMessage): string {
  return msg.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

/** Generate a short UUID-like id without external deps. */
function genId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

/** Format a relative timestamp for sidebar display. */
function relativeTime(isoStr: string, now: number): string {
  const diff = Math.floor((now - new Date(isoStr).getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`
  return new Date(isoStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** Bucket a session into Today / Earlier / Older relative to now. */
function bucket(isoStr: string, now: number): 'Today' | 'Earlier' | 'Older' {
  const diff = now - new Date(isoStr).getTime()
  if (diff < 86400_000) return 'Today'
  if (diff < 7 * 86400_000) return 'Earlier'
  return 'Older'
}

export interface ChatSession {
  id: string
  title: string
  updatedAt: string
  messages: Array<UIMessage>
}

export const Route = createFileRoute('/chat/')({ component: ChatPage })

const STORAGE_KEY = 'complibot:chat:sessions'

const SUGGESTED_QUESTIONS = [
  'What KYC checks does HashKey require for DeFi?',
  'Does FATF Travel Rule apply to my AMM?',
  'What transaction limits must I enforce under HK SFC?',
  'How do I implement compliant access control?',
]

function ChatPage() {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const [now, setNow] = useState(() => Date.now())
  const [activeId, setActiveId] = useState<string>(() => genId())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleQuotaExceeded() {
    addToast({
      title: 'Storage full',
      description: 'Chat history could not be saved — browser storage is full.',
      color: 'warning',
    })
  }

  const [sessions, setSessions] = useLocalStorage<Array<ChatSession>>(
    STORAGE_KEY,
    [],
    handleQuotaExceeded,
  )

  // Single 60s tick for relative timestamps
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  const activeSession = sessions.find((s) => s.id === activeId)

  const { messages, setMessages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: CHAT_API_URL }),
    initialMessages: activeSession?.messages ?? [],
    onError: (err) => {
      // Log only the message, never the full object (may contain auth headers)
      console.error('[chat]', err.message)
    },
    onFinish: (msg) => {
      // Persist after each assistant message finishes
      persistSession(msg)
    },
  })

  function persistSession(latestMsg?: UIMessage) {
    const allMessages: Array<UIMessage> = latestMsg
      ? [...messages, latestMsg]
      : messages
    if (allMessages.length === 0) return

    const firstUserText =
      allMessages.find((m) => m.role === 'user')
        ? extractText(allMessages.find((m) => m.role === 'user')!)
        : 'New conversation'
    const title =
      firstUserText.length > 48
        ? firstUserText.slice(0, 48) + '…'
        : firstUserText

    setSessions((prev) => {
      const exists = prev.find((s) => s.id === activeId)
      const updated: ChatSession = {
        id: activeId,
        title,
        updatedAt: new Date().toISOString(),
        messages: allMessages,
      }
      if (exists) {
        return prev.map((s) => (s.id === activeId ? updated : s))
      }
      return [updated, ...prev]
    })
  }

  const isStreaming = status === 'streaming' || status === 'submitted'

  // Scroll to bottom on new content — use instant because Lenis owns smooth
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' })
  }, [messages, isStreaming])

  function handleSend() {
    const text = input.trim()
    if (!text || isStreaming) return
    setInput('')
    void sendMessage({ text })
  }

  function handleKeyDown(e: React.KeyboardEvent<Element>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleSuggest(q: string) {
    setInput('')
    void sendMessage({ text: q })
  }

  function handleNewSession() {
    // Persist current session if it has messages before switching
    if (messages.length > 0) persistSession()
    const newId = genId()
    setActiveId(newId)
    setMessages([])
    setSidebarOpen(false)
  }

  const handleSelectSession = useCallback(
    (session: ChatSession) => {
      if (session.id === activeId) return
      if (messages.length > 0) persistSession()
      setActiveId(session.id)
      setMessages(session.messages)
      setSidebarOpen(false)
    },
    // persistSession closes over messages/activeId — listing both here so the
    // callback always uses the current values when switching sessions.
    [activeId, messages],
  )

  function handleDeleteSession(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    if (id === activeId) {
      const newId = genId()
      setActiveId(newId)
      setMessages([])
    }
  }

  // Group sessions by bucket
  const buckets: Array<{ label: string; items: Array<ChatSession> }> = []
  for (const label of ['Today', 'Earlier', 'Older'] as const) {
    const items = sessions.filter((s) => bucket(s.updatedAt, now) === label)
    if (items.length > 0) buckets.push({ label, items })
  }

  // Shared sidebar content — rendered in both desktop aside and mobile overlay
  const sidebarContent = (
    <>
      <div className="border-b border-[rgba(255,255,255,0.05)] px-3 py-3">
        <button
          onClick={handleNewSession}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-[13px] text-[#8a8f98] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-[#d0d6e0]"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span style={{ fontWeight: 510 }}>New conversation</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {sessions.length === 0 ? (
          <p className="px-4 py-3 text-[12px] text-[#62666d]">No history yet.</p>
        ) : (
          buckets.map(({ label, items }) => (
            <div key={label} className="mb-1">
              <p className="px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[#3e3e44]">
                {label}
              </p>
              {items.map((session) => (
                <SessionRow
                  key={session.id}
                  session={session}
                  isActive={session.id === activeId}
                  now={now}
                  onSelect={() => handleSelectSession(session)}
                  onDelete={() => handleDeleteSession(session.id)}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </>
  )

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-[rgba(255,255,255,0.05)] bg-[#0f1011] md:flex">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          {/* Panel */}
          <aside className="absolute inset-y-0 left-0 flex w-[280px] flex-col border-r border-[rgba(255,255,255,0.05)] bg-[#0f1011]">
            {/* Close button row */}
            <div className="flex items-center justify-end border-b border-[rgba(255,255,255,0.05)] px-3 py-2.5">
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                className="rounded-md p-1.5 text-[#62666d] transition-colors hover:text-[#d0d6e0]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main canvas */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header bar with sidebar toggle */}
        <div className="flex items-center border-b border-[rgba(255,255,255,0.05)] bg-[#08090a] px-3 py-2.5 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open conversation history"
            className="rounded-md p-1.5 text-[#62666d] transition-colors hover:text-[#d0d6e0]"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-2 text-[13px] text-[#8a8f98]" style={{ fontWeight: 510 }}>
            CompliBot
          </span>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="mx-auto max-w-2xl space-y-6">
            {messages.length === 0 && !isStreaming ? (
              <EmptyStateChat onSuggest={handleSuggest} />
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} role={msg.role} content={extractText(msg)} />
                ))}
              </AnimatePresence>
            )}

            {isStreaming && <StreamingIndicator />}
            {error && <ErrorBubble message={error.message} onRetry={() => { if (input.trim()) void sendMessage({ text: input.trim() }) }} />}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input bar */}
        <div className="border-t border-[rgba(255,255,255,0.05)] bg-[#08090a] px-4 py-4 md:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-end gap-3">
              <Textarea
                value={input}
                onValueChange={setInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask a compliance question…"
                minRows={1}
                maxRows={6}
                disabled={isStreaming}
                classNames={{
                  base: 'flex-1',
                  inputWrapper:
                    'border border-[rgba(255,255,255,0.1)] bg-[#0f1011] shadow-none data-[hover=true]:border-[rgba(255,255,255,0.18)] data-[focus=true]:border-[#5e6ad2]',
                  input: 'text-[15px] leading-[1.6] text-[#f7f8f8] placeholder:text-[#62666d]',
                }}
              />
              <Button
                isIconOnly
                onPress={handleSend}
                isDisabled={!input.trim() || isStreaming}
                isLoading={isStreaming}
                spinner={<Loader2 className="h-4 w-4 animate-spin" />}
                className="h-10 w-10 shrink-0 rounded-md bg-[#5e6ad2] text-white disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---- Session row ---- */

function SessionRow({
  session,
  isActive,
  now,
  onSelect,
  onDelete,
}: {
  session: ChatSession
  isActive: boolean
  now: number
  onSelect: () => void
  onDelete: () => void
}) {
  const [popoverOpen, setPopoverOpen] = useState(false)

  return (
    <div
      className={cnm(
        'group relative mx-2 flex h-9 cursor-pointer items-center gap-2 rounded-md px-3 text-[13px] transition-colors',
        isActive
          ? 'bg-[rgba(94,106,210,0.08)] text-[#d0d6e0]'
          : 'text-[#8a8f98] hover:bg-[rgba(255,255,255,0.03)] hover:text-[#d0d6e0]',
      )}
      style={
        isActive
          ? { boxShadow: 'inset 2px 0 0 #5e6ad2' }
          : undefined
      }
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect() }}
    >
      <span className="min-w-0 flex-1 truncate">{session.title}</span>
      <span className="shrink-0 text-[11px] text-[#3e3e44]">
        {relativeTime(session.updatedAt, now)}
      </span>

      {/* Delete popover — stop propagation so click doesn't switch session */}
      <Popover
        isOpen={popoverOpen}
        onOpenChange={setPopoverOpen}
        placement="right"
      >
        <PopoverTrigger>
          <button
            aria-label="Delete conversation"
            onClick={(e) => { e.stopPropagation(); setPopoverOpen(true) }}
            className={cnm(
              'shrink-0 rounded p-0.5 transition-opacity',
              'opacity-0 group-hover:opacity-100 focus:opacity-100',
              'text-[#62666d] hover:text-[#ef4444]',
            )}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="bg-[#191a1b] border border-[rgba(255,255,255,0.08)] p-3 w-48">
          <p className="text-[13px] text-[#d0d6e0] mb-3">Delete this conversation?</p>
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setPopoverOpen(false) }}
              className="flex-1 rounded-md border border-[rgba(255,255,255,0.1)] px-3 py-1.5 text-[12px] text-[#8a8f98] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setPopoverOpen(false); onDelete() }}
              className="flex-1 rounded-md bg-[rgba(239,68,68,0.12)] px-3 py-1.5 text-[12px] text-[#ef4444] hover:bg-[rgba(239,68,68,0.2)] transition-colors"
            >
              Delete
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

/* ---- Sub-components (inline: single-use per FRONTEND_STRUCTURE_GUIDE) ---- */

function EmptyStateChat({ onSuggest }: { onSuggest: (q: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.entry, ease: EASE }}
      className="flex flex-col items-center gap-8 py-12 text-center"
    >
      <EmptyState
        icon={<MessageSquare className="h-6 w-6" />}
        title="Ask CompliBot anything about HashKey compliance"
        body="Get cite-backed answers from HK SFC, FATF, MiCA, and HashKey docs."
      />
      <SuggestedChips questions={SUGGESTED_QUESTIONS} onSelect={onSuggest} />
    </motion.div>
  )
}

function SuggestedChips({
  questions,
  onSelect,
}: {
  questions: Array<string>
  onSelect: (q: string) => void
}) {
  return (
    <motion.div
      variants={{ hidden: {}, show: { transition: { staggerChildren: STAGGER.list } } }}
      initial="hidden"
      animate="show"
      className="flex flex-wrap justify-center gap-2"
    >
      {questions.map((q) => (
        <motion.button
          key={q}
          variants={{
            hidden: { opacity: 0, y: 6 },
            show: { opacity: 1, y: 0, transition: { duration: DURATION.entry, ease: EASE } },
          }}
          onClick={() => onSelect(q)}
          className="rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] px-3 py-1.5 text-[13px] tracking-[-0.011em] text-[#d0d6e0] transition-colors hover:border-[rgba(113,112,255,0.3)] hover:bg-[rgba(113,112,255,0.06)] hover:text-[#f7f8f8]"
        >
          {q}
        </motion.button>
      ))}
    </motion.div>
  )
}

function MessageBubble({ role, content }: { role: string; content: string }) {
  const isUser = role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.entry, ease: EASE }}
      className={cnm('flex', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cnm(
          'max-w-[85%] rounded-[12px] px-4 py-3',
          isUser
            ? 'bg-[#5e6ad2] text-[14px] leading-[1.5] text-white'
            : 'border border-[rgba(255,255,255,0.08)] bg-[#0f1011] text-[15px] leading-[1.6]',
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-[14px]">{content}</p>
        ) : (
          <AssistantMarkdown content={content} />
        )}
      </div>
    </motion.div>
  )
}

function AssistantMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      // No rehype-raw — prevents XSS from LLM output (DESIGN.md §12)
      components={{
        code({ children, className }) {
          const lang = /language-(\w+)/.exec(className ?? '')?.[1] ?? 'text'
          const text = String(children).replace(/\n$/, '')
          // Multi-line: render CodeSnippet; inline: render plain mono
          if (text.includes('\n')) {
            return <CodeSnippet code={text} language={lang} />
          }
          return (
            <code className="rounded-[3px] bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 font-mono text-[13px] text-[#d0d6e0]">
              {children}
            </code>
          )
        },
        p({ children }) {
          return (
            <p className="mb-3 last:mb-0 text-[15px] leading-[1.6] tracking-[-0.165px] text-[#f7f8f8]">
              {children}
            </p>
          )
        },
        ul({ children }) {
          return <ul className="mb-3 list-disc pl-5 space-y-1 text-[15px] text-[#f7f8f8]">{children}</ul>
        },
        ol({ children }) {
          return <ol className="mb-3 list-decimal pl-5 space-y-1 text-[15px] text-[#f7f8f8]">{children}</ol>
        },
        li({ children }) {
          return <li className="leading-[1.6]">{children}</li>
        },
        strong({ children }) {
          return <strong className="font-medium text-[#f7f8f8]" style={{ fontWeight: 590 }}>{children}</strong>
        },
        a({ href, children }) {
          // Validate URL scheme before rendering
          const isAllowed = href && /^https?:\/\//i.test(href)
          if (!isAllowed) return <span>{children}</span>
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7170ff] underline underline-offset-2 hover:text-[#828fff]"
            >
              {children}
            </a>
          )
        },
        blockquote({ children }) {
          return (
            <blockquote className="my-3 border-l-2 border-[#5e6ad2] pl-4 text-[14px] text-[#8a8f98]">
              {children}
            </blockquote>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

function StreamingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-start"
    >
      <div className="flex items-center gap-1.5 rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[#0f1011] px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[#5e6ad2]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

function ErrorBubble({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-[12px] border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.06)] px-4 py-3">
        <p className="text-[14px] leading-[1.5] text-[#ef4444]">
          Couldn&apos;t reach the model. {message}
        </p>
        <button
          onClick={onRetry}
          className="mt-2 text-[13px] text-[#ef4444] underline underline-offset-2 hover:text-[#f87171]"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

// RegulationCitation is imported but used only when the backend annotates messages.
// Exported here to satisfy the "used in chat" note in DESIGN.md §6.
export { RegulationCitation }
