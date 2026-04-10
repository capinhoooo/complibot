/**
 * CategoryBars — horizontal compliance category breakdown bars.
 *
 * Used in: audit/index.tsx (with animation) and cert/$uid.tsx (instant={true}).
 *
 * Layout: grid `minmax(80px,96px) 1fr 56px`, 6px bar height.
 * Tier colors: ≥0.85 emerald, 0.60–0.85 indigo, 0.30–0.60 warning, <0.30 danger.
 * Animation: 240ms scaleX entry, 40ms stagger, fires once via useRef guard.
 */
import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { DURATION, EASE, STAGGER } from '@/utils/motion'

export interface CategoryScore {
  label: string
  score: number | null
}

interface CategoryBarsProps {
  categories: Array<CategoryScore>
  instant?: boolean
}

function tierColor(score: number): string {
  if (score >= 0.85) return '#10b981' // emerald
  if (score >= 0.6) return '#5e6ad2'  // indigo
  if (score >= 0.3) return '#f59e0b'  // warning
  return '#ef4444'                     // danger
}

// Canonical category order per spec
const CANONICAL_ORDER = ['KYC', 'Limits', 'Reporting', 'Access']

export function normalizeCategoryBars(
  categories: Array<CategoryScore>,
): Array<CategoryScore> {
  const map = new Map(categories.map((c) => [c.label, c]))
  return CANONICAL_ORDER.map((label) => map.get(label) ?? { label, score: null })
}

export default function CategoryBars({
  categories,
  instant = false,
}: CategoryBarsProps) {
  const normalized = normalizeCategoryBars(categories)
  const [animate, setAnimate] = useState(instant)
  const firedRef = useRef(false)

  useEffect(() => {
    if (instant || firedRef.current) return
    firedRef.current = true
    // requestAnimationFrame to ensure bars are in the DOM before scaleX starts
    const id = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(id)
  }, [instant])

  return (
    <div className="space-y-2.5" role="list" aria-label="Compliance categories">
      {normalized.map((cat, i) => {
        const hasScore = cat.score !== null
        const ratio = hasScore ? Math.max(0, Math.min(1, cat.score)) : 0
        const color = hasScore ? tierColor(ratio) : '#3e3e44'
        const pct = Math.round(ratio * 100)

        return (
          <div
            key={cat.label}
            role="listitem"
            className="grid items-center gap-3"
            style={{ gridTemplateColumns: 'minmax(80px,96px) 1fr 56px' }}
          >
            {/* Label */}
            <span className="text-[12px] tracking-[-0.011em] text-[#8a8f98]">
              {cat.label}
            </span>

            {/* Bar track */}
            <div
              className="h-[6px] overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]"
              aria-hidden
            >
              <motion.div
                className="h-full rounded-full origin-left"
                style={{ backgroundColor: color, scaleX: 0 }}
                animate={animate ? { scaleX: hasScore ? ratio : 0 } : { scaleX: 0 }}
                transition={{
                  duration: DURATION.entry,
                  ease: EASE,
                  delay: instant ? 0 : i * STAGGER.list,
                }}
              />
            </div>

            {/* Value */}
            <span
              className="text-right text-[12px] tabular-nums"
              style={{ color: hasScore ? color : '#3e3e44' }}
            >
              {hasScore ? `${pct}%` : '—'}
            </span>
          </div>
        )
      })}
    </div>
  )
}
