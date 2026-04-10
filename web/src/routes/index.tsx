import { useEffect, useRef, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import {
  ArrowRight,
  Code,
  FileCode,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Skeleton } from '@heroui/react'
import { ApiError, apiClient } from '@/lib/api/client'
import { DURATION, EASE, STAGGER } from '@/utils/motion'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <TwoLanguageProblem />
      <HowItWorks />
      <Capabilities />
      <KnowledgeBase />
      <FinalCTA />
    </div>
  )
}

/* ---------- 1. Hero ---------- */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[rgba(255,255,255,0.05)]">
      {/* subtle radial glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(900px 420px at 50% -80px, rgba(94,106,210,0.18), transparent 60%)',
        }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-28 text-center md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: EASE }}
          className="flex items-center gap-2"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#8a8f98]">
            Hashkey Chain Horizon Hackathon
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#62666d]">
            HashKey Chain
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, delay: 0.04, ease: EASE }}
          className="max-w-3xl text-[36px] font-medium leading-[1.06] tracking-[-0.792px] text-[#f7f8f8] sm:text-[48px] sm:leading-[1.04] sm:tracking-[-1.056px] md:text-[56px] md:leading-[1.02] md:tracking-[-1.22px]"
          style={{ fontWeight: 510 }}
        >
          Build compliant DeFi without a legal team.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, delay: 0.08, ease: EASE }}
          className="max-w-xl text-[18px] leading-[1.6] tracking-[-0.165px] text-[#8a8f98]"
        >
          CompliBot reads HK SFC, FATF, and HashKey docs so your contracts
          don&apos;t have to. Ask questions, audit Solidity, and prove compliance
          on-chain.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, delay: 0.12, ease: EASE }}
          className="flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link
            to="/chat"
            className="group inline-flex items-center gap-2 rounded-md bg-[#5e6ad2] px-4 py-2.5 text-[14px] font-medium tracking-[-0.012em] text-white shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_2px_4px_rgba(0,0,0,0.4)] transition-colors hover:bg-[#6b77e0]"
          >
            Ask a question
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] px-4 py-2.5 text-[14px] font-medium tracking-[-0.012em] text-[#f7f8f8] transition-colors hover:bg-[rgba(255,255,255,0.04)]"
          >
            Audit your contract
          </Link>
        </motion.div>

        <LiveStatStrip />
      </div>
    </section>
  )
}

// Stats shape returned by GET /api/stats (not yet implemented in backend)
interface StatsData {
  certificatesIssued: number
  averageScore: number
  contractsAudited: number
}

type StatsState =
  | { status: 'loading' }
  | { status: 'soft'; message: string }
  | { status: 'hard' }
  | { status: 'ok'; data: StatsData }

function LiveStatStrip() {
  const [state, setState] = useState<StatsState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    // TODO: wire to GET /api/stats once that backend endpoint ships.
    // Currently falls back to soft-fallback state immediately.
    apiClient
      .get<StatsData>('/api/stats')
      .then((data) => {
        if (!cancelled) setState({ status: 'ok', data })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        // 404 or network — backend doesn't have /api/stats yet. Use soft fallback.
        const is404 =
          err instanceof ApiError && (err.status === 404 || err.status === 405)
        const isNetwork = err instanceof TypeError
        if (is404 || isNetwork) {
          setState({ status: 'soft', message: 'Stats unavailable' })
        } else {
          setState({ status: 'hard' })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const TILE_DEFS = [
    { key: 'certificatesIssued', label: 'Certificates issued' },
    { key: 'averageScore', label: 'Average score' },
    { key: 'contractsAudited', label: 'Contracts audited' },
  ] as const

  const DEMO_VALUES = {
    certificatesIssued: 38,
    averageScore: 76.4,
    contractsAudited: 142,
  } as const

  if (state.status === 'hard') {
    return (
      <p className="mt-6 text-[12px] text-[#62666d]">Stats unavailable</p>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2, ease: EASE }}
      className="mt-8 flex w-full max-w-xl overflow-hidden rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[#0f1011]"
      role="region"
      aria-label="Live statistics"
    >
      {TILE_DEFS.map((tile, i) => {
        const isLast = i === TILE_DEFS.length - 1
        const value =
          state.status === 'ok'
            ? state.data[tile.key]
            : state.status === 'soft'
              ? DEMO_VALUES[tile.key]
              : null

        return (
          <div
            key={tile.key}
            className={`flex flex-1 flex-col items-center justify-center gap-1 px-4 py-3 ${
              !isLast ? 'border-r border-[rgba(255,255,255,0.08)]' : ''
            }`}
          >
            <div className="h-12 flex items-center justify-center">
              {state.status === 'loading' ? (
                <Skeleton className="h-8 w-16 rounded-md" />
              ) : (
                <AnimatedNumber
                  value={value!}
                  decimals={tile.key === 'averageScore' ? 1 : 0}
                />
              )}
            </div>
            <span className="text-[11px] tracking-[-0.006em] text-[#62666d]">{tile.label}</span>
          </div>
        )
      })}
    </motion.div>
    {state.status === 'soft' && (
      <span className="text-[10px] tracking-[0.04em] uppercase" style={{ color: '#3e3e44' }}>
        demo
      </span>
    )}
    </div>
  )
}

function AnimatedNumber({
  value,
  decimals = 0,
}: {
  value: number
  decimals?: number
}) {
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString(),
  )
  const [display, setDisplay] = useState('0')
  const firedRef = useRef(false)

  useEffect(() => {
    if (firedRef.current) return
    firedRef.current = true

    const controls = animate(mv, value, {
      duration: 0.8,
      ease: EASE,
    })

    const unsubscribe = rounded.on('change', (v) => setDisplay(String(v)))

    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [value, mv, rounded])

  return (
    <span
      className="text-[32px] leading-none tabular-nums text-[#f7f8f8] sm:text-[48px]"
      style={{ fontWeight: 510 }}
      aria-label={String(value)}
    >
      {display}
    </span>
  )
}

/* ---------- 2. Two-language problem ---------- */

function TwoLanguageProblem() {
  const cards = [
    {
      label: 'Developers',
      title: 'Solidity, foundry, EIPs',
      body: 'Fluent in opcodes, gas, and inheritance. Allergic to legal PDFs.',
    },
    {
      label: 'Regulations',
      title: 'HK SFC, FATF, MiCA',
      body: 'Paragraphs in plain English about KYC, thresholds, and reporting.',
    },
    {
      label: 'Deployment',
      title: 'A contract that has to satisfy both',
      body: 'One side speaks in opcodes, the other in legalese. Mistakes are fines.',
    },
  ]
  return (
    <Section
      eyebrow="The problem"
      title="A two-language problem."
      subtitle="Smart contracts and regulations speak past each other. CompliBot translates."
    >
      <motion.div
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="grid gap-5 md:grid-cols-3"
      >
        {cards.map((c) => (
          <motion.div
            key={c.label}
            variants={itemVariants}
            className="rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-6"
          >
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#62666d]">
              {c.label}
            </div>
            <h3
              className="mt-3 text-[20px] leading-[1.3] tracking-[-0.24px] text-[#f7f8f8]"
              style={{ fontWeight: 590 }}
            >
              {c.title}
            </h3>
            <p className="mt-2 text-[15px] leading-[1.6] tracking-[-0.165px] text-[#8a8f98]">
              {c.body}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}

/* ---------- 3. How it works ---------- */

function HowItWorks() {
  const steps = [
    {
      n: '00',
      title: 'Generate',
      body: 'Describe what you need. CompliBot writes a compliant Solidity contract from scratch.',
    },
    {
      n: '01',
      title: 'Ask',
      body: 'Chat with CompliBot. Cite-backed answers from HK SFC, FATF, MiCA, and HashKey docs.',
    },
    {
      n: '02',
      title: 'Audit',
      body: 'Paste a contract. Get findings tied to specific regulations and severities.',
    },
    {
      n: '03',
      title: 'Prove',
      body: 'Clear the 70-point bar and issue a compliance certificate on-chain.',
    },
  ]
  return (
    <Section
      eyebrow="How it works"
      title="Generate. Ask. Audit. Prove."
      subtitle="Four steps, one workflow. No legal retainer."
    >
      <motion.ol
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
      >
        {steps.map((s) => (
          <motion.li
            key={s.n}
            variants={itemVariants}
            className="relative overflow-hidden rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-6"
          >
            <div className="font-mono text-[11px] tracking-[0.02em] text-[#62666d]">
              {s.n}
            </div>
            <h3
              className="mt-3 text-[20px] leading-[1.3] tracking-[-0.24px] text-[#f7f8f8]"
              style={{ fontWeight: 590 }}
            >
              {s.title}
            </h3>
            <p className="mt-2 text-[15px] leading-[1.6] tracking-[-0.165px] text-[#8a8f98]">
              {s.body}
            </p>
          </motion.li>
        ))}
      </motion.ol>
    </Section>
  )
}

/* ---------- 4. Capabilities ---------- */

function Capabilities() {
  const caps = [
    {
      icon: MessageSquare,
      title: 'RegQuery',
      body: 'RAG-grounded chat with every paragraph tied back to its source document.',
      href: '/chat' as const,
    },
    {
      icon: FileCode,
      title: 'AuditAssist',
      body: 'Static analysis that maps Solidity patterns to KYC, limits, reporting, access.',
      href: '/audit' as const,
    },
    {
      icon: ShieldCheck,
      title: 'Compliance Certificate',
      body: 'On-chain SBT attestation issued by an attester role after signature + KYC checks.',
      href: '/cert' as const,
    },
    {
      icon: Code,
      title: 'ContractGen',
      body: 'Describe what you want in plain English. Get a full, deployment-ready Solidity contract with compliance baked in.',
      href: '/generate' as const,
    },
  ]
  return (
    <Section
      eyebrow="Capabilities"
      title="Four surfaces, one copilot."
      subtitle="Pick the tool for the job, or run them end-to-end."
    >
      <motion.div
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
      >
        {caps.map((c) => {
          const Icon = c.icon
          return (
            <motion.div key={c.title} variants={itemVariants}>
              <Link
                to={c.href}
                className="group block rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-6 transition-colors hover:border-[rgba(113,112,255,0.35)] hover:bg-[rgba(113,112,255,0.04)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[rgba(94,106,210,0.12)] text-[#7170ff]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3
                  className="mt-5 text-[20px] leading-[1.3] tracking-[-0.24px] text-[#f7f8f8]"
                  style={{ fontWeight: 590 }}
                >
                  {c.title}
                </h3>
                <p className="mt-2 text-[15px] leading-[1.6] tracking-[-0.165px] text-[#8a8f98]">
                  {c.body}
                </p>
                <div className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-[#7170ff] transition-transform group-hover:translate-x-0.5">
                  Open
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </Section>
  )
}

/* ---------- 5. Knowledge base coverage ---------- */

function KnowledgeBase() {
  const sources = [
    'HK SFC',
    'FATF Travel Rule',
    'EU MiCA',
    'HashKey KYC SBT',
    'OpenZeppelin',
    'EIP-712',
  ]
  return (
    <Section
      eyebrow="Knowledge base"
      title="Every answer has a citation."
      subtitle="CompliBot only speaks from its indexed corpus. No hallucinations."
    >
      <motion.div
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6"
      >
        {sources.map((s) => (
          <motion.div
            key={s}
            variants={itemVariants}
            className="text-[15px] font-medium tracking-[-0.011em] text-[#62666d] transition-colors hover:text-[#d0d6e0]"
          >
            {s}
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}

/* ---------- 6. Final CTA strip ---------- */

function FinalCTA() {
  return (
    <section className="border-y border-[rgba(255,255,255,0.05)] bg-[#0f1011]">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-20 text-center md:flex-row md:justify-between md:text-left">
        <div className="max-w-xl space-y-2">
          <h2
            className="text-[32px] leading-[1.13] tracking-[-0.704px] text-[#f7f8f8]"
            style={{ fontWeight: 510 }}
          >
            Ready to ship compliant?
          </h2>
          <p className="text-[16px] leading-[1.5] text-[#8a8f98]">
            Three minutes from paste to on-chain attestation.
          </p>
        </div>
        <Link
          to="/audit"
          className="inline-flex items-center gap-2 rounded-md bg-[#5e6ad2] px-5 py-3 text-[14px] font-medium tracking-[-0.012em] text-white transition-colors hover:bg-[#6b77e0]"
        >
          Try CompliBot
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}

/* ---------- Shared inline helpers ---------- */

function Section({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-[rgba(255,255,255,0.05)]">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mb-12 max-w-2xl space-y-3"
        >
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#7170ff]">
            {eyebrow}
          </div>
          <h2
            className="text-[32px] leading-[1.13] tracking-[-0.704px] text-[#f7f8f8]"
            style={{ fontWeight: 510 }}
          >
            {title}
          </h2>
          <p className="text-[17px] leading-[1.6] text-[#8a8f98]">{subtitle}</p>
        </motion.div>
        {children}
      </div>
    </section>
  )
}

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: STAGGER.grid },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE },
  },
}
