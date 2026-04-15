import { useCallback, useEffect, useRef, useState } from 'react'
import { createFileRoute, useNavigate  } from '@tanstack/react-router'
import { useAccount, useSignTypedData } from 'wagmi'
import { getAddress, isAddress } from 'viem'
import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, ChevronDown, ChevronUp, FileCode, Loader2, Shield } from 'lucide-react'
import { Button, Input, addToast } from '@heroui/react'
import type {AuditFinding, AuditResponse} from '@/lib/api/audit';
import ScoreGauge from '@/components/ScoreGauge'
import CategoryBars from '@/components/CategoryBars'
import EmptyState from '@/components/EmptyState'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import RegulationCitation from '@/components/RegulationCitation'
import {   runAudit } from '@/lib/api/audit'
import {
  CERTIFY_DOMAIN,
  CERTIFY_TYPES,
  deriveAuditHash,
  postCertify,
} from '@/lib/api/certify'
import { ApiError } from '@/lib/api/client'
import { DURATION, EASE, STAGGER } from '@/utils/motion'
import { cnm } from '@/utils/style'

export const Route = createFileRoute('/audit/')({ component: AuditPage })

// Example contract from 06_complibot_frontend_demo.md — no KYC, no limits, demo target
const EXAMPLE_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract SimpleSwap {
    address public owner;
    IERC20 public tokenA;
    IERC20 public tokenB;
    uint256 public constant RATE = 100; // 1 tokenA = 100 tokenB

    constructor(address _tokenA, address _tokenB) {
        owner = msg.sender;
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    function swap(uint256 amountA) external {
        require(amountA > 0, "Amount must be positive");
        uint256 amountB = amountA * RATE;
        require(tokenA.transferFrom(msg.sender, address(this), amountA), "Transfer failed");
        require(tokenB.transfer(msg.sender, amountB), "Transfer failed");
    }

    function withdraw(address token, uint256 amount) external {
        require(msg.sender == owner, "Not owner");
        IERC20(token).transfer(msg.sender, amount);
    }
}`

const ANALYSIS_LABELS = [
  'Checking KYC gates…',
  'Analyzing transaction limits…',
  'Reviewing reporting hooks…',
  'Evaluating access controls…',
]

const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low', 'info'] as const
const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#7170ff',
  low: '#10b981',
  info: '#62666d',
}

// Contract address input validation states
type AddrState = 'idle' | 'invalid' | 'valid'

function AuditPage() {
  const [code, setCode] = useState('')
  const [report, setReport] = useState<AuditResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [labelIdx, setLabelIdx] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const labelTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  // Monotonic request counter: if a newer request starts before an older one
  // resolves, the older result is discarded rather than overwriting the newer state.
  const requestIdRef = useRef(0)
  const navigate = useNavigate()

  // Contract address — raw input + debounced validation state
  const [contractAddrInput, setContractAddrInput] = useState('')
  const [addrState, setAddrState] = useState<AddrState>('idle')
  const addrDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleContractAddrChange(val: string) {
    setContractAddrInput(val)
    if (addrDebounceRef.current) clearTimeout(addrDebounceRef.current)
    if (!val.trim()) {
      setAddrState('idle')
      return
    }
    addrDebounceRef.current = setTimeout(() => {
      setAddrState(isAddress(val.trim()) ? 'valid' : 'invalid')
    }, 120)
  }

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (addrDebounceRef.current) clearTimeout(addrDebounceRef.current)
    }
  }, [])

  const { address: walletAddress, isConnected } = useAccount()
  // Mounted gate: wagmi reads window state, which is unavailable during SSR.
  // Without this, canCertify can be truthy on the server and cause a hydration mismatch.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  function startLabelCycle() {
    setLabelIdx(0)
    labelTimer.current = setInterval(() => {
      setLabelIdx((i) => (i + 1) % ANALYSIS_LABELS.length)
    }, 1800)
  }

  function stopLabelCycle() {
    if (labelTimer.current) {
      clearInterval(labelTimer.current)
      labelTimer.current = null
    }
  }

  const handleAnalyze = useCallback(async () => {
    const trimmed = code.trim()
    if (!trimmed || isLoading) return

    setError(null)
    setReport(null)
    setIsLoading(true)
    startLabelCycle()

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    // Capture the request id for this invocation. If a newer call starts
    // before this one resolves, thisId < requestIdRef.current and we discard.
    const thisId = ++requestIdRef.current

    try {
      const result = await runAudit(
        {
          contractCode: trimmed,
          walletAddress:
            isConnected && walletAddress && isAddress(walletAddress)
              ? walletAddress
              : undefined,
        },
        abortRef.current.signal,
      )
      if (thisId !== requestIdRef.current) return
      setReport(result)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      if (thisId !== requestIdRef.current) return
      const raw =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Unexpected error'
      const msg = raw.length > 200 ? 'Something went wrong. Please try again.' : raw
      setError(msg)
    } finally {
      if (thisId === requestIdRef.current) {
        setIsLoading(false)
        stopLabelCycle()
      }
    }
  }, [code, isLoading, isConnected, walletAddress])

  function handleClear() {
    setCode('')
    setReport(null)
    setError(null)
    abortRef.current?.abort()
  }

  // The checksummed contract address to include in the EIP-712 message.
  // Only valid when addrState === 'valid'.
  const checksummedContractAddr =
    addrState === 'valid'
      ? getAddress(contractAddrInput.trim())
      : null

  const canCertify =
    mounted &&
    report &&
    report.score >= 70 &&
    isConnected &&
    walletAddress &&
    isAddress(walletAddress) &&
    addrState === 'valid' &&
    checksummedContractAddr !== null

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden md:flex-row flex-col">
        {/* Left: code editor */}
        <div className="flex flex-col border-r border-[rgba(255,255,255,0.05)] md:w-[55%] min-h-0 shrink-0 h-[45vh] md:h-auto">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] bg-[#0f1011] px-4 py-2.5">
            <span className="text-[12px] tracking-[-0.011em] text-[#8a8f98]">
              Solidity contract
            </span>
            <span className="text-[11px] text-[#62666d]">
              {code.split('\n').length} lines
            </span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            placeholder="// Paste your Solidity contract here…"
            className="flex-1 resize-none bg-[#08090a] p-4 font-mono text-[14px] leading-[1.6] text-[#f7f8f8] placeholder:text-[#3e3e44] focus:outline-none"
          />
        </div>

        {/* Right: report panel */}
        <div className="flex flex-col overflow-y-auto md:w-[45%]">
          <ReportPanel
            report={report}
            isLoading={isLoading}
            labelText={ANALYSIS_LABELS[labelIdx]}
            error={error}
            onRetry={handleAnalyze}
            canCertify={canCertify ?? false}
            walletAddress={walletAddress}
            contractAddress={checksummedContractAddr}
            contractAddrInput={contractAddrInput}
            addrState={addrState}
            onContractAddrChange={handleContractAddrChange}
            navigate={navigate}
          />
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="shrink-0 border-t border-[rgba(255,255,255,0.05)] bg-[#0f1011] px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="bordered"
            onPress={handleClear}
            isDisabled={isLoading}
            className="border-[rgba(255,255,255,0.1)] text-[13px] text-[#8a8f98]"
          >
            Clear
          </Button>
          <Button
            size="sm"
            variant="bordered"
            onPress={() => setCode(EXAMPLE_CONTRACT)}
            isDisabled={isLoading}
            className="border-[rgba(255,255,255,0.1)] text-[13px] text-[#8a8f98]"
          >
            Load example
          </Button>
          <Button
            size="sm"
            onPress={handleAnalyze}
            isDisabled={!code.trim() || isLoading}
            isLoading={isLoading}
            spinner={<Loader2 className="h-4 w-4 animate-spin" />}
            className="ml-auto bg-[#5e6ad2] text-[13px] font-medium text-white disabled:opacity-40"
          >
            Analyze
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ---- Report panel ---- */

interface ReportPanelProps {
  report: AuditResponse | null
  isLoading: boolean
  labelText: string
  error: string | null
  onRetry: () => void
  canCertify: boolean
  walletAddress: `0x${string}` | undefined
  contractAddress: `0x${string}` | null
  contractAddrInput: string
  addrState: AddrState
  onContractAddrChange: (val: string) => void
  navigate: ReturnType<typeof useNavigate>
}

function ReportPanel({
  report,
  isLoading,
  labelText,
  error,
  onRetry,
  canCertify,
  walletAddress,
  contractAddress,
  contractAddrInput,
  addrState,
  onContractAddrChange,
  navigate,
}: ReportPanelProps) {
  if (isLoading) return <LoadingPanel labelText={labelText} />
  if (error)
    return (
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-start gap-3 rounded-[8px] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.05)] px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#ef4444]" />
          <div className="space-y-1">
            <p className="text-[14px] font-medium text-[#ef4444]">Audit failed</p>
            <p className="text-[13px] text-[#8a8f98]">{error}</p>
          </div>
        </div>
        <Button size="sm" onPress={onRetry} className="self-start bg-[#5e6ad2] text-white text-[13px]">
          Retry
        </Button>
      </div>
    )
  if (!report)
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          icon={<FileCode className="h-6 w-6" />}
          title="Paste a Solidity contract on the left, then hit Analyze."
          body="Get findings mapped to KYC, limits, reporting, and access control regulations."
          action={{ label: 'Try the example', onPress: onRetry }}
        />
      </div>
    )

  const sortedFindings = [...report.findings].sort((a, b) => {
    const aIdx = SEVERITY_ORDER.indexOf(a.severity.toLowerCase() as typeof SEVERITY_ORDER[number])
    const bIdx = SEVERITY_ORDER.indexOf(b.severity.toLowerCase() as typeof SEVERITY_ORDER[number])
    return aIdx - bIdx
  })

  // Derive per-category scores from findings if backend does not supply them.
  // Groups findings by category, averages a 0–1 score based on severity weight.
  const categoryBars = deriveCategories(report.findings)

  // Address input color cues
  const addrColor =
    addrState === 'valid'
      ? '#10b981'
      : addrState === 'invalid'
        ? '#ef4444'
        : undefined

  return (
    <div className="space-y-6 p-6">
      {/* Score + verdict */}
      <div className="flex items-center gap-5">
        <ScoreGauge score={report.score} size={96} />
        <div className="space-y-1">
          <p className="text-[13px] tracking-[-0.011em] text-[#8a8f98]">Compliance score</p>
          <VerdictBadge verdict={report.verdict} />
          <p className="text-[12px] text-[#62666d]">
            {report.findingsSummary.critical}C · {report.findingsSummary.high}H · {report.findingsSummary.medium}M · {report.findingsSummary.low}L
          </p>
        </div>
      </div>

      {/* Category breakdown bars */}
      <div className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#62666d]">
          By category
        </p>
        <CategoryBars categories={categoryBars} />
      </div>

      {/* Summary */}
      <div className="space-y-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#62666d]">
          Summary
        </p>
        <p className="text-[15px] leading-[1.6] tracking-[-0.165px] text-[#d0d6e0]">
          {report.summary.top_recommendation ?? 'No findings detected'}
        </p>
      </div>

      {/* Findings */}
      {sortedFindings.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#62666d]">
            Findings ({sortedFindings.length})
          </p>
          <motion.div
            variants={{ show: { transition: { staggerChildren: STAGGER.findings } } }}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {sortedFindings.map((f, i) => (
              <FindingCard key={`${f.severity}-${i}`} finding={f} />
            ))}
          </motion.div>
        </div>
      )}

      {/* Contract address input — shown when score ≥ 70 so the certify CTA is reachable */}
      {report.score >= 70 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#62666d]">
            Deployed contract address
          </p>
          <Input
            value={contractAddrInput}
            onValueChange={onContractAddrChange}
            placeholder="0x…"
            aria-label="Deployed contract address"
            classNames={{
              inputWrapper: cnm(
                'border bg-[#0f1011] shadow-none transition-colors',
                addrState === 'idle' && 'border-[rgba(255,255,255,0.1)] data-[hover=true]:border-[rgba(255,255,255,0.18)] data-[focus=true]:border-[#5e6ad2]',
                addrState === 'invalid' && 'border-[rgba(239,68,68,0.5)] data-[hover=true]:border-[rgba(239,68,68,0.7)] data-[focus=true]:border-[#ef4444]',
                addrState === 'valid' && 'border-[rgba(16,185,129,0.5)] data-[hover=true]:border-[rgba(16,185,129,0.7)] data-[focus=true]:border-[#10b981]',
              ),
              input: 'font-mono text-[13px] placeholder:text-[#3e3e44]',
            }}
            style={{ '--tw-text-opacity': '1', color: addrColor } as React.CSSProperties}
          />
          {addrState === 'invalid' && (
            <p className="text-[12px] text-[#ef4444]">Not a valid Ethereum address.</p>
          )}
        </div>
      )}

      {/* Certify CTA */}
      {canCertify && walletAddress && contractAddress && (
        <CertifyButton
          report={report}
          walletAddress={walletAddress}
          contractAddress={contractAddress}
          onSuccess={(url) => void navigate({ to: url as '/cert/$uid', params: { uid: url.split('/').pop() ?? '' } })}
        />
      )}

      {!canCertify && report.score < 70 && (
        <div className="rounded-[8px] border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.04)] px-4 py-3 text-[13px] text-[#8a8f98]">
          Score below 70 — resolve critical and high findings to unlock certification.
        </div>
      )}

      {!canCertify && report.score >= 70 && !walletAddress && (
        <div className="rounded-[8px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-4 py-3 text-[13px] text-[#8a8f98]">
          Connect your wallet to issue an on-chain compliance certificate.
        </div>
      )}

      {!canCertify && report.score >= 70 && walletAddress && addrState !== 'valid' && (
        <div className="rounded-[8px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-4 py-3 text-[13px] text-[#8a8f98]">
          Enter the deployed contract address above to issue a certificate.
        </div>
      )}
    </div>
  )
}

function LoadingPanel({ labelText }: { labelText: string }) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <div className="h-24 w-24 shrink-0">
          <LoadingSkeleton lines={1} className="h-24 w-24 rounded-full" />
        </div>
        <div className="flex-1 space-y-2">
          <LoadingSkeleton lines={2} />
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={labelText}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: DURATION.entry, ease: EASE }}
          className="text-[14px] text-[#8a8f98]"
        >
          {labelText}
        </motion.p>
      </AnimatePresence>
      <LoadingSkeleton lines={5} />
    </div>
  )
}

function VerdictBadge({ verdict }: { verdict: AuditResponse['verdict'] }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    PASS: { label: 'Compliant', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    CONDITIONAL: { label: 'Needs review', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    FAIL: { label: 'Non-compliant', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  }
  const { label, color, bg } = map[verdict] ?? { label: verdict, color: '#8a8f98', bg: 'rgba(138,143,152,0.1)' }
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium"
      style={{ color, background: bg }}
    >
      {label}
    </span>
  )
}

function FindingCard({ finding }: { finding: AuditFinding }) {
  const [open, setOpen] = useState(false)
  const color = SEVERITY_COLORS[finding.severity.toLowerCase()] ?? '#62666d'

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0, transition: { duration: DURATION.entry, ease: EASE } },
      }}
      className="overflow-hidden rounded-[8px] border border-[rgba(255,255,255,0.08)] bg-[#0f1011]"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-[rgba(255,255,255,0.02)] transition-colors"
      >
        <span
          className="mt-0.5 inline-flex items-center rounded-[3px] px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.04em] shrink-0"
          style={{ color, background: `${color}18` }}
        >
          {finding.severity}
        </span>
        <span className="flex-1 text-[14px] leading-[1.4] tracking-[-0.011em] text-[#f7f8f8]" style={{ fontWeight: 510 }}>
          {finding.title}
        </span>
        {open ? (
          <ChevronUp className="mt-0.5 h-4 w-4 shrink-0 text-[#62666d]" />
        ) : (
          <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-[#62666d]" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATION.entry, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-[rgba(255,255,255,0.05)] px-4 pb-4 pt-3">
              <p className="text-[14px] leading-[1.5] text-[#d0d6e0]">{finding.description}</p>
              {finding.location?.line ? (
                <p className="font-mono text-[12px] text-[#62666d]">Line {finding.location.line}</p>
              ) : null}
              {finding.fix && (
                <div>
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.06em] text-[#62666d]">
                    Recommendation
                  </p>
                  <p className="text-[13px] leading-[1.5] text-[#8a8f98]">{finding.fix}</p>
                </div>
              )}
              {finding.regulation && (
                <RegulationCitation
                  name={finding.regulation}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ---- Category derivation helper ---- */

// Canonical category mapping from finding categories to bar labels.
// AuditFinding.category is a free-form string from the backend; we normalise
// it into one of the four canonical bars by keyword matching.
const CATEGORY_MAP: Record<string, string> = {
  kyc: 'KYC',
  'know your customer': 'KYC',
  limit: 'Limits',
  'transaction limit': 'Limits',
  reporting: 'Reporting',
  access: 'Access',
  'access control': 'Access',
  ownership: 'Access',
}

function findingCategoryToBar(raw: string): string {
  const lower = raw.toLowerCase()
  for (const [key, label] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key)) return label
  }
  return 'Access' // fallback
}

/**
 * Derive category scores (0–1) from a list of findings.
 * Severity weights: critical=0, high=0.25, medium=0.5, low=0.75, info=1.0.
 * If a category has no findings, score = 1.
 */
function deriveCategories(
  findings: Array<AuditFinding>,
): Array<{ label: string; score: number | null }> {
  const WEIGHT: Record<string, number> = {
    critical: 0,
    high: 0.25,
    medium: 0.5,
    low: 0.75,
    info: 1.0,
  }
  const CANONICAL = ['KYC', 'Limits', 'Reporting', 'Access']
  const groups = new Map<string, Array<number>>()
  for (const f of findings) {
    const bar = findingCategoryToBar(f.regulation ?? f.title)
    const sev = f.severity.toLowerCase()
    const existing = groups.get(bar)
    if (existing) {
      existing.push(WEIGHT[sev] ?? 0.5)
    } else {
      groups.set(bar, [WEIGHT[sev] ?? 0.5])
    }
  }
  return CANONICAL.map((label) => {
    const scores = groups.get(label)
    if (!scores || scores.length === 0) return { label, score: 1 }
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    return { label, score: avg }
  })
}

/* ---- Certify button with EIP-712 flow ---- */

function CertifyButton({
  report,
  walletAddress,
  contractAddress,
  onSuccess,
}: {
  report: AuditResponse
  walletAddress: `0x${string}`
  contractAddress: `0x${string}`
  onSuccess: (certUrl: string) => void
}) {
  const [isCertifying, setIsCertifying] = useState(false)
  const { signTypedDataAsync } = useSignTypedData()

  async function handleCertify() {
    if (isCertifying) return
    setIsCertifying(true)

    try {
      // Nonce: 4 cryptographically random bytes → bigint (MED-4).
      // 4 bytes keeps the value within Number.MAX_SAFE_INTEGER so the backend
      // z.number().int() schema accepts it after Number() conversion in postCertify.
      const nonceBytes = crypto.getRandomValues(new Uint8Array(4))
      const nonce = nonceBytes.reduce((acc, byte) => (acc << 8n) | BigInt(byte), 0n)
      const auditHash = deriveAuditHash(report.auditSessionId)

      // Step 1: prompt wallet signature — use the real checksummed contract address
      const signature = await signTypedDataAsync({
        domain: CERTIFY_DOMAIN,
        types: CERTIFY_TYPES,
        primaryType: 'CertifyRequest',
        message: {
          contractAddress,
          developerAddress: walletAddress,
          auditHash,
          complianceScore: BigInt(report.score),
          nonce,
        },
      })

      // Step 2: POST to backend
      console.log('[certify] auditSessionId:', report.auditSessionId)
      const result = await postCertify({
        contractAddress,
        developerAddress: walletAddress,
        auditSessionId: report.auditSessionId,
        complianceScore: report.score,
        findingsSummary: report.findingsSummary,
        signature,
        nonce,
      })

      addToast({
        title: 'Certificate issued',
        description: `Tx: ${result.txHash.slice(0, 10)}…`,
        color: 'success',
      })

      onSuccess(result.certificateUrl)
    } catch (err) {
      // Never log the full error (may contain headers with auth tokens)
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Certification failed'
      addToast({ title: 'Certification failed', description: msg, color: 'danger' })
    } finally {
      setIsCertifying(false)
    }
  }

  return (
    <Button
      onPress={handleCertify}
      isDisabled={isCertifying}
      isLoading={isCertifying}
      spinner={<Loader2 className="h-4 w-4 animate-spin" />}
      className="w-full bg-[#5e6ad2] text-[14px] font-medium text-white"
    >
      {isCertifying ? 'Signing…' : 'Issue Certificate'}
    </Button>
  )
}
