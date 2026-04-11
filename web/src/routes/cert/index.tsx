import { useState } from 'react'
import { Link, createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { LayoutGroup, motion } from 'motion/react'
import { ExternalLink, ShieldCheck } from 'lucide-react'
import { Button, Chip, Input, ScrollShadow } from '@heroui/react'
import { isAddress } from 'viem'
import { z } from 'zod'
import type { CertSummary } from '@/lib/api/certificates'
import ScoreGauge from '@/components/ScoreGauge'
import EmptyState from '@/components/EmptyState'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { listCertificates } from '@/lib/api/certificates'
import { activeExplorerUrl } from '@/lib/wagmi'
import { DURATION, EASE, STAGGER } from '@/utils/motion'
import { cnm } from '@/utils/style'

/* ---- Search params schema (URL-driven filters) ---- */

const ScoreFilter = z
  .enum(['all', '90+', '70-89', '40-69', '<40'])
  .catch('all')
const DateFilter = z
  .enum(['all', '24h', '7d', '30d'])
  .catch('all')
const VerdictFilter = z
  .enum(['all', 'compliant', 'needs_review', 'non_compliant'])
  .catch('all')

const CertSearchSchema = z.object({
  score: ScoreFilter,
  date: DateFilter,
  verdict: VerdictFilter,
})

type CertSearch = z.infer<typeof CertSearchSchema>

export const Route = createFileRoute('/cert/')({
  validateSearch: CertSearchSchema,
  component: CertListPage,
})

/* ---- Filter helpers ---- */

function matchesScore(cert: CertSummary, filter: CertSearch['score']): boolean {
  switch (filter) {
    case 'all': return true
    case '90+': return cert.score >= 90
    case '70-89': return cert.score >= 70 && cert.score < 90
    case '40-69': return cert.score >= 40 && cert.score < 70
    case '<40': return cert.score < 40
  }
}

function matchesDate(cert: CertSummary, filter: CertSearch['date']): boolean {
  if (filter === 'all') return true
  const age = Date.now() - new Date(cert.createdAt).getTime()
  switch (filter) {
    case '24h': return age < 86_400_000
    case '7d': return age < 7 * 86_400_000
    case '30d': return age < 30 * 86_400_000
  }
}

function matchesVerdict(cert: CertSummary, filter: CertSearch['verdict']): boolean {
  // CertSummary doesn't carry verdict — we derive from score as a proxy
  // since the backend doesn't return verdict on the list endpoint
  if (filter === 'all') return true
  const derived =
    cert.score >= 70
      ? cert.findings.critical === 0
        ? 'compliant'
        : 'needs_review'
      : 'non_compliant'
  return derived === filter
}

/* ---- Page ---- */

function CertListPage() {
  const { address, isConnected } = useAccount()
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const filters = useSearch({ from: '/cert/' })

  // Resolve the address to query: wallet by default, manual search if user typed one
  const queryAddress = (() => {
    const trimmed = search.trim()
    if (isAddress(trimmed)) return trimmed
    if (isConnected && address) return address
    return null
  })()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['certificates', queryAddress],
    queryFn: ({ signal }) => listCertificates(queryAddress!, signal),
    enabled: !!queryAddress,
    staleTime: 30_000,
  })

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
  }

  function setFilter<TKey extends keyof CertSearch>(key: TKey, value: CertSearch[TKey]) {
    void navigate({
      to: '/cert',
      search: (prev: CertSearch) => ({ ...prev, [key]: value }),
      replace: true,
    })
  }

  function resetFilters() {
    void navigate({
      to: '/cert',
      search: { score: 'all', date: 'all', verdict: 'all' },
      replace: true,
    })
  }

  const isFiltered =
    filters.score !== 'all' || filters.date !== 'all' || filters.verdict !== 'all'

  // Client-side filter the fetched list
  const filtered = data
    ? data.filter(
        (c) =>
          matchesScore(c, filters.score) &&
          matchesDate(c, filters.date) &&
          matchesVerdict(c, filters.verdict),
      )
    : []

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.entry, ease: EASE }}
        className="mb-8 space-y-1"
      >
        <h1
          className="text-[32px] leading-[1.13] tracking-[-0.704px] text-[#f7f8f8]"
          style={{ fontWeight: 400 }}
        >
          Certificates
        </h1>
        <p className="text-[15px] leading-[1.6] text-[#8a8f98]">
          On-chain compliance attestations issued via HashKey Chain.
        </p>
      </motion.div>

      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <Input
          value={search}
          onValueChange={setSearch}
          placeholder="Search by wallet address (0x…)"
          classNames={{
            inputWrapper:
              'border border-[rgba(255,255,255,0.1)] bg-[#0f1011] shadow-none data-[hover=true]:border-[rgba(255,255,255,0.18)] data-[focus=true]:border-[#5e6ad2]',
            input: 'text-[14px] text-[#f7f8f8] placeholder:text-[#62666d]',
          }}
        />
      </form>

      {/* Filter chips — horizontal scroll on mobile, wrap on md+ */}
      {data && data.length > 0 && (
        <FilterBar
          filters={filters}
          setFilter={setFilter}
          isFiltered={isFiltered}
          onReset={resetFilters}
          total={data.length}
          shown={filtered.length}
        />
      )}

      {/* States */}
      {!queryAddress && (
        <EmptyState
          icon={<ShieldCheck className="h-6 w-6" />}
          title="Connect your wallet or search by address"
          body="Certificates issued to a wallet address appear here."
          action={{
            label: 'Audit a contract',
            onPress: () => void navigate({ to: '/audit' }),
          }}
        />
      )}

      {queryAddress && isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[#0f1011] p-5"
            >
              <LoadingSkeleton lines={3} />
            </div>
          ))}
        </div>
      )}

      {queryAddress && error && (
        <div className="flex flex-col gap-3">
          <p className="text-[14px] text-[#ef4444]">Couldn't load certificates.</p>
          <Button
            size="sm"
            onPress={() => void refetch()}
            className="self-start bg-[#5e6ad2] text-[13px] text-white"
          >
            Retry
          </Button>
        </div>
      )}

      {queryAddress && !isLoading && !error && data && data.length === 0 && (
        <EmptyState
          icon={<ShieldCheck className="h-6 w-6" />}
          title="No certificates yet"
          body="Be the first to audit a contract and issue an on-chain attestation."
          action={{
            label: 'Audit a contract',
            onPress: () => void navigate({ to: '/audit' }),
          }}
        />
      )}

      {/* Zero-result empty state when filters active */}
      {queryAddress && !isLoading && !error && data && data.length > 0 && filtered.length === 0 && (
        <EmptyState
          icon={<ShieldCheck className="h-6 w-6" />}
          title="No certificates match these filters"
          body="Try widening the score range, date window, or verdict filter."
          action={{ label: 'Clear filters', onPress: resetFilters }}
        />
      )}

      {filtered.length > 0 && (
        <LayoutGroup>
          <motion.div
            variants={{ show: { transition: { staggerChildren: STAGGER.grid } } }}
            initial="hidden"
            animate="show"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((cert) => (
              <CertCard key={cert.attestationUid} cert={cert} />
            ))}
          </motion.div>
        </LayoutGroup>
      )}
    </div>
  )
}

/* ---- Filter bar ---- */

const SCORE_OPTIONS: Array<{ value: CertSearch['score']; label: string }> = [
  { value: 'all', label: 'All' },
  { value: '90+', label: '90+' },
  { value: '70-89', label: '70–89' },
  { value: '40-69', label: '40–69' },
  { value: '<40', label: '<40' },
]

const DATE_OPTIONS: Array<{ value: CertSearch['date']; label: string }> = [
  { value: 'all', label: 'All time' },
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
]

const VERDICT_OPTIONS: Array<{ value: CertSearch['verdict']; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'compliant', label: 'Compliant' },
  { value: 'needs_review', label: 'Needs review' },
  { value: 'non_compliant', label: 'Non-compliant' },
]

function FilterBar({
  filters,
  setFilter,
  isFiltered,
  onReset,
  total,
  shown,
}: {
  filters: CertSearch
  setFilter: <TKey extends keyof CertSearch>(key: TKey, value: CertSearch[TKey]) => void
  isFiltered: boolean
  onReset: () => void
  total: number
  shown: number
}) {
  return (
    <div className="mb-6 space-y-3">
      {/* Chips — horizontal scroll on mobile, wrap on md+ */}
      <ScrollShadow
        orientation="horizontal"
        className="md:overflow-visible"
        hideScrollBar
      >
        <div className="flex flex-nowrap gap-x-4 gap-y-2 md:flex-wrap">
          {/* Score group */}
          <div className="flex flex-nowrap items-center gap-1.5">
            <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.06em] text-[#3e3e44]">
              Score
            </span>
            {SCORE_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                label={opt.label}
                isActive={filters.score === opt.value}
                onPress={() => setFilter('score', opt.value)}
              />
            ))}
          </div>

          <span aria-hidden className="hidden h-4 w-px self-center bg-[rgba(255,255,255,0.08)] md:block" />

          {/* Date group */}
          <div className="flex flex-nowrap items-center gap-1.5">
            <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.06em] text-[#3e3e44]">
              Date
            </span>
            {DATE_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                label={opt.label}
                isActive={filters.date === opt.value}
                onPress={() => setFilter('date', opt.value)}
              />
            ))}
          </div>

          <span aria-hidden className="hidden h-4 w-px self-center bg-[rgba(255,255,255,0.08)] md:block" />

          {/* Verdict group */}
          <div className="flex flex-nowrap items-center gap-1.5">
            <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.06em] text-[#3e3e44]">
              Verdict
            </span>
            {VERDICT_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                label={opt.label}
                isActive={filters.verdict === opt.value}
                onPress={() => setFilter('verdict', opt.value)}
              />
            ))}
          </div>
        </div>
      </ScrollShadow>

      {/* Result count + reset */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-[12px] text-[#62666d]">
          Showing {shown} of {total}
        </span>
        {isFiltered && (
          <button
            onClick={onReset}
            className="text-[12px] text-[#5e6ad2] hover:text-[#7170ff] transition-colors"
          >
            Reset filters
          </button>
        )}
      </div>
    </div>
  )
}

function FilterChip({
  label,
  isActive,
  onPress,
}: {
  label: string
  isActive: boolean
  onPress: () => void
}) {
  return (
    <Chip
      size="sm"
      radius="full"
      variant={isActive ? 'solid' : 'flat'}
      onPress={onPress}
      className={cnm(
        'cursor-pointer text-[12px] transition-colors select-none',
        isActive
          ? 'bg-[#5e6ad2] text-white'
          : 'bg-[rgba(255,255,255,0.04)] text-[#8a8f98] hover:bg-[rgba(255,255,255,0.07)] hover:text-[#d0d6e0]',
      )}
    >
      {label}
    </Chip>
  )
}

/* ---- Cert card ---- */

function CertCard({ cert }: { cert: CertSummary }) {
  const date = new Date(cert.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: DURATION.entry, ease: EASE } },
      }}
      transition={{ duration: 0.24, ease: EASE }}
    >
      <Link
        to="/cert/$uid"
        params={{ uid: cert.attestationUid }}
        className="group block rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[#0f1011] p-5 transition-colors hover:border-[rgba(94,106,210,0.35)] hover:bg-[#111213]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="font-mono text-[12px] text-[#8a8f98] truncate">
              {cert.contractAddress.slice(0, 6)}…{cert.contractAddress.slice(-4)}
            </p>
            <p className="text-[12px] text-[#62666d]">{date}</p>
          </div>
          <ScoreGauge score={cert.score} size={52} />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2 text-[12px] text-[#62666d]">
            <span>{cert.findings.critical}C</span>
            <span>{cert.findings.high}H</span>
            <span>{cert.findings.medium}M</span>
          </div>
          {/^https:\/\//i.test(cert.explorerUrl) && (
            <a
              href={cert.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[12px] text-[#62666d] hover:text-[#d0d6e0] transition-colors"
              aria-label="View on explorer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
