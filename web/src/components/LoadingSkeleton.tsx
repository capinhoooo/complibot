import { Skeleton } from '@heroui/react'
import { cnm } from '@/utils/style'

interface LoadingSkeletonProps {
  lines?: number
  className?: string
}

/** Multi-line shimmer block. Default 3 lines. */
export default function LoadingSkeleton({ lines = 3, className }: LoadingSkeletonProps) {
  return (
    <div className={cnm('space-y-3', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={cnm(
            'rounded-md bg-[rgba(255,255,255,0.04)]',
            i === lines - 1 ? 'h-4 w-2/3' : 'h-4 w-full',
          )}
        />
      ))}
    </div>
  )
}
