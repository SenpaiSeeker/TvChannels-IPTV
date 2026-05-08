'use client'
import { useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Tag } from 'lucide-react'
import { useChannelStore } from '@/stores/channelStore'
import ChannelGrid from '@/components/channel/ChannelGrid'

const CATEGORY_ICONS: Record<string, string> = {
  news: '📰',
  sports: '⚽',
  movies: '🎬',
  music: '🎵',
  kids: '🧸',
  documentary: '🎥',
  entertainment: '🎭',
  animation: '🎨',
  comedy: '😂',
  cooking: '🍳',
  travel: '✈️',
  science: '🔬',
  business: '💼',
  religious: '🙏',
  weather: '🌤️',
  auto: '🚗',
  shop: '🛍️',
  general: '📺',
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const { channels, streams, fetchAll, loading } = useChannelStore()

  useEffect(() => {
    fetchAll()
  }, [])

  const categoryChannels = useMemo(() => {
    return channels.filter((c) => c.categories?.includes(slug))
  }, [channels, slug])

  const label = slug.charAt(0).toUpperCase() + slug.slice(1)
  const icon = CATEGORY_ICONS[slug] || '📺'

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-2xl">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-indigo-400 uppercase tracking-wider">Category</span>
          </div>
          <h1 className="text-3xl font-bold text-white">{label}</h1>
          <p className="text-gray-500 text-sm">
            {categoryChannels.length.toLocaleString()} channels
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="w-full h-28 shimmer rounded-xl" />
              <div className="w-3/4 h-3 shimmer rounded" />
            </div>
          ))}
        </div>
      ) : (
        <ChannelGrid
          channels={categoryChannels}
          streams={streams}
          emptyMessage={`No ${label} channels found`}
        />
      )}
    </div>
  )
}
