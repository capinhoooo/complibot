import { motion } from 'motion/react'
import { ExternalLink } from 'lucide-react'
import { DURATION, EASE } from '@/utils/motion'

interface RegulationCitationProps {
  name: string
  section?: string
  url?: string
  /** Optional short excerpt / context */
  excerpt?: string
}

export default function RegulationCitation({
  name,
  section,
  url,
  excerpt,
}: RegulationCitationProps) {
  const content = (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ duration: DURATION.micro, ease: EASE }}
      className="flex flex-col gap-1 rounded-[8px] border-l-2 border-l-[#5e6ad2] border-t border-r border-b border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-4 py-3"
    >
      <div className="flex items-center gap-2">
        <span
          className="text-[14px] leading-[1.4] tracking-[-0.182px] text-[#f7f8f8]"
          style={{ fontWeight: 590 }}
        >
          {name}
        </span>
        {section && (
          <span className="text-[13px] leading-[1.4] tracking-[-0.13px] text-[#8a8f98]">
            {section}
          </span>
        )}
        {url && (
          <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-[#62666d]" aria-hidden />
        )}
      </div>
      {excerpt && (
        <p className="text-[13px] leading-[1.5] tracking-[-0.13px] text-[#8a8f98]">{excerpt}</p>
      )}
    </motion.div>
  )

  if (url) {
    // Validate URL scheme before rendering — reject javascript: / data: / vbscript:
    const isAllowedScheme = /^https?:\/\//i.test(url)
    if (isAllowedScheme) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          {content}
        </a>
      )
    }
  }

  return content
}
