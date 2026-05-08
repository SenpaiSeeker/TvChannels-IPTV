'use client'
import { cn } from '@/utils/cn'
import { getQualityLabel } from '@/utils/format'
import type { Stream } from '@/types'

interface QualityBadgeProps {
  stream?: Stream
  className?: string
}

export default function QualityBadge({ stream, className }: QualityBadgeProps) {
  if (!stream) return null
  const label = getQualityLabel(stream.resolution)
  if (label === 'Unknown') return null

  const colorMap: Record<string, string> = {
    '4K': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    HD: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    '720p': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    SD: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  }

  return (
    <span
      className={cn(
        'text-[10px] font-bold px-1.5 py-0.5 rounded border',
        colorMap[label] ?? 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        className
      )}
    >
      {label}
    </span>
  )
}
