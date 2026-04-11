import { useEffect, useRef, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import {
  ArrowRight,
  BarChart3,
  FileCode,
  MessageSquare,
  Shield,
  ShieldCheck,
} from 'lucide-react'
import { Skeleton } from '@heroui/react'
import { apiClient } from '@/lib/api/client'
import { DURATION, EASE, STAGGER } from '@/utils/motion'
import { cnm } from '@/utils/style'

export const Route = createFileRoute('/dashboard/')({ component: DashboardPage })

interface StatsData {
  certificatesIssued: number
  averageScore: number
  contractsAudited: number
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
    transition: { duration: DURATION.entry + 0.16, ease: EASE },
  },
}

function DashboardPage() {
  const { data, isLoading, isError } = useQuery<StatsData>({
    queryKey: ['stats'],
    queryFn: ({ signal }) => apiClient.get<StatsData>('/api/stats', signal),
    staleTime: 60_000,
    retry: 1,
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.page, ease: EASE }}
        className="mb-10 space-y-1.5"
      >
        <h1
          className="text-[32px] leading-[1.13] tracking-[-0.704px] text-[#f7f8f8]"
          style={{ fontWeight: 510 }}
        >
          Ecosystem Dashboard
        </h1>
        <p className="text-[15px] leading-[1.6] tracking-[-0.165px] text-[#8a8f98]">
          Live stats from the CompliBot network on HashKey Chain.
        </p>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <StatCard
          label="Contracts Audited"
          value={data?.contractsAudited}
          isLoading={isLoading}
          isError={isError}
          decimals={0}
        />
        <StatCard
          label="Certificates Issued"
          value={data?.certificatesIssued}
          isLoading={isLoading}
          isError={isError}
          decimals={0}
        />
        <StatCard
          label="Average Score"
          value={data?.averageScore}
          isLoading={isLoading}
          isError={isError}
          decimals={1}
        />
      </motion.div>

      {/* About + Quick Actions */}
      <motion.div
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-4 md:grid-cols-2"
      >
        <AboutCard />
        <QuickActionsCard />
      </motion.div>
    </div>
  )
}

/* ---- Stat card ---- */

function StatCard({
  label,
  value,
  isLoading,
  isError,
  decimals,
}: {
  label: string
  value: number | undefined
  isLoading: boolean
  isError: boolean
  decimals: number
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col gap-3 rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[#0f1011] p-6"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#62666d]">
          {label}
        </span>
      </div>

      <div className="flex h-14 items-center">
        {isLoading ? (
          <Skeleton className="h-10 w-24 rounded-md" />
        ) : isError || value === undefined ? (
          <span
            className="text-[48px] leading-none tabular-nums text-[#3e3e44]"
            style={{ fontWeight: 510 }}
            aria-label="Unavailable"
          >
            —
          </span>
        ) : (
          <AnimatedNumber value={value} decimals={decimals} />
        )}
      </div>
    </motion.div>
  )
}

/* ---- Animated number (identical pattern to landing page) ---- */

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
      className="text-[48px] leading-none tabular-nums text-[#f7f8f8]"
      style={{ fontWeight: 510 }}
      aria-label={String(value)}
    >
      {display}
    </span>
  )
}

/* ---- About card ---- */

const CAPABILITIES = [
  {
    icon: MessageSquare,
    title: 'RegQuery',
    body: 'RAG-grounded chat with every answer tied back to its source document.',
  },
  {
    icon: FileCode,
    title: 'AuditAssist',
    body: 'Static analysis that maps Solidity patterns to KYC, limits, and reporting requirements.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Certificate',
    body: 'On-chain SBT attestation issued after a contract clears the 70-point threshold.',
  },
]

function AboutCard() {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[#0f1011] p-6"
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#7170ff]">
          About CompliBot
        </span>
      </div>
      <p className="mb-6 mt-3 text-[14px] leading-[1.6] tracking-[-0.011em] text-[#8a8f98]">
        CompliBot reads HK SFC, FATF, and HashKey docs so your contracts don't
        have to. Three surfaces, one compliance workflow.
      </p>

      <div className="space-y-4">
        {CAPABILITIES.map((cap) => {
          const Icon = cap.icon
          return (
            <div key={cap.title} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[rgba(94,106,210,0.12)] text-[#7170ff]">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div>
                <p
                  className="text-[13px] leading-[1.4] tracking-[-0.011em] text-[#f7f8f8]"
                  style={{ fontWeight: 590 }}
                >
                  {cap.title}
                </p>
                <p className="mt-0.5 text-[13px] leading-[1.5] tracking-[-0.011em] text-[#62666d]">
                  {cap.body}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ---- Quick actions card ---- */

const ACTIONS = [
  {
    label: 'Ask a question',
    description: 'Get cite-backed answers from the compliance corpus.',
    to: '/chat' as const,
    primary: true,
  },
  {
    label: 'Audit a contract',
    description: 'Paste Solidity and get findings mapped to regulations.',
    to: '/audit' as const,
    primary: false,
  },
  {
    label: 'View certificates',
    description: 'Browse on-chain attestations by wallet address.',
    to: '/cert' as const,
    primary: false,
  },
]

function QuickActionsCard() {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[#0f1011] p-6"
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#7170ff]">
          Quick Actions
        </span>
      </div>
      <p className="mt-3 text-[14px] leading-[1.6] tracking-[-0.011em] text-[#8a8f98]">
        Jump straight to the tool you need.
      </p>

      <div className="mt-6 space-y-3">
        {ACTIONS.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={cnm(
              'group flex items-center justify-between gap-3 rounded-md px-4 py-3 text-[14px] font-medium tracking-[-0.012em] transition-colors',
              action.primary
                ? 'bg-[#5e6ad2] text-white shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_2px_4px_rgba(0,0,0,0.4)] hover:bg-[#6b77e0]'
                : 'border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-[#f7f8f8] hover:bg-[rgba(255,255,255,0.04)]',
            )}
          >
            <div className="min-w-0">
              <div>{action.label}</div>
              <div
                className={cnm(
                  'mt-0.5 text-[12px] font-normal',
                  action.primary ? 'text-[rgba(255,255,255,0.65)]' : 'text-[#62666d]',
                )}
              >
                {action.description}
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </motion.div>
  )
}
