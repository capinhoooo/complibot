import { Button } from '@heroui/react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  body?: string
  action?: {
    label: string
    onPress: () => void
  }
}

export default function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-[#62666d]">
          {icon}
        </div>
      )}
      <div className="space-y-1.5">
        <p
          className="text-[17px] leading-[1.5] tracking-[-0.165px] text-[#f7f8f8]"
          style={{ fontWeight: 590 }}
        >
          {title}
        </p>
        {body && (
          <p className="max-w-xs text-[15px] leading-[1.6] tracking-[-0.165px] text-[#8a8f98]">
            {body}
          </p>
        )}
      </div>
      {action && (
        <Button
          size="sm"
          variant="bordered"
          onPress={action.onPress}
          className="mt-1 border-[rgba(255,255,255,0.1)] text-[13px] text-[#d0d6e0]"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
