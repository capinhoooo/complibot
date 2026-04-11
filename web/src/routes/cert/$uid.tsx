import { useEffect, useRef, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Check, Copy, ExternalLink } from 'lucide-react'
import type { CategoryScore } from '@/components/CategoryBars'
import type { CertDetail } from '@/lib/api/certificates'
import CategoryBars from '@/components/CategoryBars'
import EmptyState from '@/components/EmptyState'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import ScoreGauge from '@/components/ScoreGauge'
import { getCertificate } from '@/lib/api/certificates'
import { activeExplorerUrl } from '@/lib/wagmi'
import { DURATION, EASE, EASE_SOFT } from '@/utils/motion'
import { cnm } from '@/utils/style'

export const Route = createFileRoute('/cert/$uid')({
  component: CertDetailPage,
})

const CONFIRMATION_THRESHOLD = 12

function CertDetailPage() {
  const { uid } = Route.useParams()
  const { address } = useAccount()
  const navigate = useNavigate()

  const addressParam = address ?? '0x0000000000000000000000000000000000000000'

  // confirmations < 12 → poll every 3s to watch for finalization
  const [isFinalized, setIsFinalized] = useState(false)

  // BOLA risk: uid comes from the URL. The backend must enforce that the
  // certificate belongs to the requesting user (or be intentionally public).
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['certificate', 'by-uid', uid],
    queryFn: ({ signal }) => getCertificate(addressParam, uid, signal),
    staleTime: 60_000,
    retry: 1,
    // Poll while confirmations are below threshold — stop once finalized
    refetchInterval: isFinalized ? false : 3000,
  })

  const confirmations = data?.confirmations
  const needsPolling =
    confirmations !== undefined && confirmations < CONFIRMATION_THRESHOLD

  // Once we cross the threshold, mark finalized (stops polling)
  useEffect(() => {
    if (confirmations !== undefined && confirmations >= CONFIRMATION_THRESHOLD) {
      setIsFinalized(true)
    }
  }, [confirmations])

  if (isLoading) return <DetailSkeleton />

  if (error) {
    const is404 = error instanceof Error && error.message.includes('404')
    if (is404) {
      return (
        <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6">
          <EmptyState
            title="Certificate not found"
            body="This certificate UID does not exist or has not been indexed yet."
            action={{ label: 'Back to certificates', onPress: () => void navigate({ to: '/cert' }) }}
          />
        </div>
      )
    }
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <div className="flex items-center gap-3 rounded-[8px] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.05)] px-4 py-3">
          <p className="text-[14px] text-[#ef4444]">Couldn't load certificate.</p>
          <button onClick={() => void refetch()} className="ml-auto text-[13px] text-[#ef4444] underline">
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const date = new Date(data.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  })

  const verdictMap = {
    compliant: { label: 'Compliant', color: '#10b981' },
    needs_review: { label: 'Needs review', color: '#f59e0b' },
    non_compliant: { label: 'Non-compliant', color: '#ef4444' },
  }
  const verdictKey = data.auditSession?.verdict
  const verdict =
    verdictKey && verdictKey in verdictMap
      ? verdictMap[verdictKey as keyof typeof verdictMap]
      : { label: 'Reviewed', color: '#7170ff' }

  // Category bars: use backend-supplied categories if present, else muted placeholders
  // (no client-side derivation on cert detail — we don't have the findings list here)
  const categoryBars: Array<CategoryScore> = data.categories ?? [
    { label: 'KYC', score: null },
    { label: 'Limits', score: null },
    { label: 'Reporting', score: null },
    { label: 'Access', score: null },
  ]

  // KYC level label — e.g. "Level 2 — Enhanced"
  const kycLevelName = (level: number): string => {
    const names: Record<number, string | undefined> = {
      0: 'None',
      1: 'Basic',
      2: 'Enhanced',
      3: 'Institutional',
    }
    return names[level] ?? 'Unknown'
  }
  const kycLabel =
    data.kycLevel !== undefined
      ? `Level ${data.kycLevel} — ${kycLevelName(data.kycLevel)}`
      : null

  // confirmations is defined whenever needsPolling is true or when finalized after polling
  const showConfirmationPill =
    confirmations !== undefined && (needsPolling || isFinalized)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      {/* Back */}
      <Link
        to="/cert"
        className="mb-8 inline-flex items-center gap-1.5 text-[13px] text-[#8a8f98] hover:text-[#d0d6e0] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Certificates
      </Link>

      {/* Header row */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1
              className="text-[32px] leading-[1.13] tracking-[-0.704px] text-[#f7f8f8]"
              style={{ fontWeight: 400 }}
            >
              Certificate
            </h1>
            {showConfirmationPill && (
              <ConfirmationPill
                confirmations={confirmations}
                isFinalized={isFinalized}
              />
            )}
          </div>
          <p className="text-[13px] tracking-[-0.13px] text-[#62666d]">{date}</p>
        </div>
        <div className="flex items-center gap-3">
          <ScoreGauge score={data.score} size={72} />
          <div className="space-y-0.5">
            <p className="text-[12px] text-[#8a8f98]">Score</p>
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium"
              style={{ color: verdict.color, background: `${verdict.color}18` }}
            >
              {verdict.label}
            </span>
          </div>
        </div>
      </div>

      {/* Detail rows */}
      <div className="mb-8 divide-y divide-[rgba(255,255,255,0.05)] rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[#0f1011]">
        <DetailRow label="Contract" value={data.contractAddress} isAddress explorerBase={activeExplorerUrl} />
        <DetailRow label="Developer" value={data.developerAddress} isAddress explorerBase={activeExplorerUrl} />
        {/* KYC level — TODO: backend /api/certs/:address/:uid does not yet return kycLevel */}
        {kycLabel !== null ? (
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-[13px] text-[#8a8f98]">KYC level</span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#d0d6e0]">{kycLabel}</span>
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px]"
                style={{ color: '#7a7fad', background: 'rgba(122,127,173,0.12)' }}
              >
                verified on-chain
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-[13px] text-[#8a8f98]">KYC level</span>
            <span className="text-[13px] text-[#3e3e44]">—</span>
          </div>
        )}
        <DetailRow label="Tx hash" value={data.txHash} isAddress={false} explorerBase={activeExplorerUrl} txHash />
        {/* Block number — TODO: backend does not yet return blockNumber */}
        {data.blockNumber !== undefined ? (
          <BlockNumberRow blockNumber={data.blockNumber} explorerBase={activeExplorerUrl} txHash={data.txHash} />
        ) : (
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-[13px] text-[#8a8f98]">Block</span>
            <span className="text-[13px] text-[#3e3e44]">—</span>
          </div>
        )}
        <DetailRow label="Attestation UID" value={data.attestationUid} isAddress={false} />
        {data.auditSession && (
          <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-[13px] text-[#8a8f98]">Audit session</span>
            <span className="font-mono text-[13px] text-[#d0d6e0]">
              {data.auditSession.id.slice(0, 16)}…
            </span>
          </div>
        )}
      </div>

      {/* Findings summary */}
      <div className="mb-8 space-y-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#62666d]">
          Findings at issuance time
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Critical', value: data.findings.critical, color: '#ef4444' },
            { label: 'High', value: data.findings.high, color: '#f59e0b' },
            { label: 'Medium', value: data.findings.medium, color: '#7170ff' },
            { label: 'Low', value: data.findings.low, color: '#10b981' },
          ].map((f) => (
            <div
              key={f.label}
              className="rounded-[8px] border border-[rgba(255,255,255,0.08)] bg-[#0f1011] px-3 py-3 text-center"
            >
              <p
                className="text-[22px] leading-[1.2] tabular-nums"
                style={{ color: f.color, fontWeight: 590 }}
              >
                {f.value}
              </p>
              <p className="mt-0.5 text-[11px] text-[#62666d]">{f.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category bars — instant (no sweep on detail page per §item7) */}
      <div className="mb-8 space-y-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#62666d]">
          By category
        </p>
        <CategoryBars categories={categoryBars} instant />
      </div>

      {/* Verify on-chain */}
      <div className="rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[#0f1011] px-5 py-4">
        <p className="mb-3 text-[13px] font-medium text-[#d0d6e0]">Verify on-chain</p>
        {/^https:\/\//i.test(activeExplorerUrl) && (
          <a
            href={`${activeExplorerUrl}/tx/${data.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] px-4 py-2 text-[13px] font-medium text-[#d0d6e0] transition-colors hover:bg-[rgba(255,255,255,0.04)]"
          >
            <ExternalLink className="h-4 w-4" />
            Open on HashKey Blockscout
          </a>
        )}
      </div>
    </div>
  )
}

/* ---- Confirmation polling pill ---- */

function ConfirmationPill({
  confirmations,
  isFinalized,
}: {
  confirmations: number
  isFinalized: boolean
}) {
  // Show "Finalized" state briefly then fade out
  const [visible, setVisible] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isFinalized) {
      timerRef.current = setTimeout(() => setVisible(false), 2000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isFinalized])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: DURATION.entry, ease: EASE }}
        >
          {isFinalized ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium"
              style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)' }}
            >
              Finalized
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium"
              style={{ color: '#8a8f98', background: 'rgba(255,255,255,0.06)' }}
            >
              <BreathingDot />
              Confirming… {confirmations} / {CONFIRMATION_THRESHOLD} blocks
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function BreathingDot() {
  return (
    <motion.span
      className="inline-block h-1.5 w-1.5 rounded-full bg-[#5e6ad2]"
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: EASE_SOFT }}
      aria-hidden
    />
  )
}

/* ---- Block number row ---- */

function BlockNumberRow({
  blockNumber,
  explorerBase,
  txHash,
}: {
  blockNumber: number
  explorerBase: string
  txHash: string
}) {
  const explorerHref =
    /^https:\/\//i.test(explorerBase)
      ? `${explorerBase}/tx/${txHash}`
      : null

  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <span className="text-[13px] text-[#8a8f98]">Block</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[14px] text-[#d0d6e0]">
          {blockNumber.toLocaleString()}
        </span>
        {explorerHref && (
          <a
            href={explorerHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View transaction on explorer"
            className="rounded p-1 text-[#62666d] transition-colors hover:text-[#d0d6e0]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  )
}

/* ---- Detail row ---- */

function DetailRow({
  label,
  value,
  isAddress: isAddr,
  explorerBase,
  txHash,
}: {
  label: string
  value: string
  isAddress?: boolean
  explorerBase?: string
  txHash?: boolean
}) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    void navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const short = value.length > 20 ? `${value.slice(0, 8)}…${value.slice(-6)}` : value
  const explorerHref = (() => {
    if (!explorerBase || !/^https:\/\//i.test(explorerBase)) return null
    if (isAddr) return `${explorerBase}/address/${value}`
    if (txHash) return `${explorerBase}/tx/${value}`
    return null
  })()

  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <span className="text-[13px] text-[#8a8f98]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[13px] text-[#d0d6e0]">{short}</span>
        <button
          onClick={handleCopy}
          aria-label="Copy"
          className={cnm(
            'rounded p-1 transition-colors',
            copied ? 'text-[#10b981]' : 'text-[#62666d] hover:text-[#d0d6e0]',
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
        {explorerHref && (
          <a
            href={explorerHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on explorer"
            className="rounded p-1 text-[#62666d] transition-colors hover:text-[#d0d6e0]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  )
}

/* ---- Detail skeleton ---- */

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 space-y-8">
      <div className="h-4 w-24 rounded-md bg-[rgba(255,255,255,0.04)]" />
      <div className="flex items-start justify-between gap-4">
        <LoadingSkeleton lines={2} className="w-64" />
        <div className="h-[72px] w-[72px] rounded-full bg-[rgba(255,255,255,0.04)]" />
      </div>
      <LoadingSkeleton lines={5} />
    </div>
  )
}

// Suppress unused import warning — CertDetail is used by the query type
void (null as unknown as CertDetail)
