'use client'
import { Wifi, WifiOff } from 'lucide-react'
import { cn } from '@/utils/cn'

interface LiveBadgeProps {
  live: boolean
  className?: string
  size?: 'sm' | 'md'
}

export default function LiveBadge({ live, className, size = 'sm' }: LiveBadgeProps) {
  if (live) {
    return (
      <span
        className={cn(
          'flex items-center gap-1 font-bold rounded-full border',
          size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1',
          'bg-green-500/20 text-green-400 border-green-500/30',
          className
        )}
      >
        <Wifi className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
        LIVE
      </span>
    )
  }
  return (
    <span
      className={cn(
        'flex items-center gap-1 font-bold rounded-full border',
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1',
        'bg-red-500/10 text-red-400/60 border-red-500/20',
        className
      )}
    >
      <WifiOff className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      OFF
    </span>
  )
}
