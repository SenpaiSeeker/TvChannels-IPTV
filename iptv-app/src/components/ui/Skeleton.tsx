import { cn } from '@/utils/cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('shimmer rounded-lg', className)} />
}

export function ChannelCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-44">
      <Skeleton className="w-44 h-28 rounded-xl" />
      <Skeleton className="w-32 h-3 mt-2 rounded" />
      <Skeleton className="w-16 h-2 mt-1 rounded" />
    </div>
  )
}

export function CarouselSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="w-48 h-6 rounded" />
      <div className="flex gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <ChannelCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
