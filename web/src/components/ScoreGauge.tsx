'use client'

import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { EASE } from '@/utils/motion'

interface ScoreGaugeProps {
  score: number
  size?: number
}

function scoreColor(score: number): string {
  if (score >= 70) return '#10b981'
  if (score >= 40) return '#f59e0b'
  return '#ef4444'
}

export default function ScoreGauge({ score, size = 96 }: ScoreGaugeProps) {
  const clampedScore = Math.min(100, Math.max(0, score))
  const stroke = 6
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  // We only draw 270° of the circle (from 135° to 405°)
  const arc = circumference * 0.75
  const color = scoreColor(clampedScore)

  const offsetValue = useMotionValue(arc)
  const displayScore = useMotionValue(0)
  const roundedScore = useTransform(displayScore, (v) => Math.round(v))

  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true
    const targetOffset = arc - arc * (clampedScore / 100)
    animate(offsetValue, targetOffset, {
      duration: 0.48,
      ease: EASE,
    })
    animate(displayScore, clampedScore, {
      duration: 0.48,
      delay: 0.12,
      ease: EASE,
    })
  }, [arc, clampedScore, displayScore, offsetValue])

  // Rotate so the gap is centered at the bottom: start at 135°
  const rotate = 135

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        aria-hidden
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
          strokeDasharray={`${arc} ${circumference}`}
          strokeLinecap="round"
          fill="none"
        />
        {/* Fill */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${arc} ${circumference}`}
          strokeDashoffset={offsetValue}
          strokeLinecap="round"
          fill="none"
          style={{ filter: `drop-shadow(0 0 4px ${color}66)` }}
        />
      </svg>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.32, duration: 0.24 }}
        className="absolute text-center tabular-nums"
        style={{
          fontSize: size >= 112 ? 28 : size >= 80 ? 22 : 16,
          fontWeight: 590,
          letterSpacing: '-0.704px',
          color,
        }}
      >
        {roundedScore}
      </motion.span>
    </div>
  )
}
