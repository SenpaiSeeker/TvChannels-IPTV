'use client'
import { useEffect, useMemo } from 'react'
import { Tv, Globe, Star, Clock, Flame } from 'lucide-react'
import { useChannelStore } from '@/stores/channelStore'
import { useHistoryStore } from '@/stores/historyStore'
import { useFavoritesStore } from '@/stores/favoritesStore'
import HeroBanner from '@/components/ui/HeroBanner'
import ChannelCarousel from '@/components/channel/ChannelCarousel'
import { CarouselSkeleton } from '@/components/ui/Skeleton'
import { CATEGORY_META } from '@/stores/categoryStore'

const CATEGORIES = [
  'news', 'sports', 'movies', 'entertainment', 'music', 'kids',
  'documentary', 'animation', 'religious', 'education', 'lifestyle', 'business',
]

export default function HomePage() {
  const { channels, streams, loading, fetchAll } = useChannelStore()
  const { history } = useHistoryStore()
  const { favorites } = useFavoritesStore()

  useEffect(() => {
    fetchAll()
  }, [])

  const streamMap = useMemo(() => new Map(streams.map((s) => [s.channel, s])), [streams])
  const channelMap = useMemo(() => new Map(channels.map((c) => [c.id, c])), [channels])

  // Featured channels (with logos and streams)
  const featuredChannels = useMemo(() => {
    const withStreams = channels.filter((c) => streamMap.has(c.id) && c.logo)
    return withStreams.slice(0, 8)
  }, [channels, streamMap])

  // Trending (most popular countries)
  const trendingChannels = useMemo(() => {
    const popular = ['us', 'gb', 'fr', 'de', 'es', 'it', 'br', 'in', 'jp', 'kr']
    return channels
      .filter((c) => popular.includes(c.country?.toLowerCase()) && streamMap.has(c.id))
      .slice(0, 20)
  }, [channels, streamMap])

  // Recently watched
  const recentChannels = useMemo(() => {
    return history
      .slice(0, 20)
      .map((h) => channelMap.get(h.channelId))
      .filter(Boolean) as typeof channels
  }, [history, channelMap])

  // Favorite channels
  const favoriteChannels = useMemo(() => {
    return favorites
      .slice(0, 20)
      .map((f) => channelMap.get(f.channelId))
      .filter(Boolean) as typeof channels
  }, [favorites, channelMap])

  // Category channels
  const categoryChannels = useMemo(() => {
    const result: Record<string, typeof channels> = {}
    for (const catId of CATEGORIES) {
      result[catId] = channels
        .filter((c) => c.categories?.includes(catId) && streamMap.has(c.id))
        .slice(0, 20)
    }
    return result
  }, [channels, streamMap])

  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="w-full h-[420px] shimmer rounded-2xl" />
        {Array.from({ length: 4 }).map((_, i) => (
          <CarouselSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Banner */}
      <HeroBanner channels={featuredChannels} />

      {/* Recently Watched */}
      {recentChannels.length > 0 && (
        <ChannelCarousel
          title="Continue Watching"
          channels={recentChannels}
          streams={streams}
          icon={<Clock className="w-5 h-5" />}
          viewAllHref="/history"
        />
      )}

      {/* Favorites */}
      {favoriteChannels.length > 0 && (
        <ChannelCarousel
          title="My Favorites"
          channels={favoriteChannels}
          streams={streams}
          icon={<Star className="w-5 h-5" />}
          viewAllHref="/favorites"
        />
      )}

      {/* Trending */}
      <ChannelCarousel
        title="Trending Channels"
        channels={trendingChannels}
        streams={streams}
        icon={<Flame className="w-5 h-5" />}
        viewAllHref="/search"
      />

      {/* Category sections */}
      {CATEGORIES.map((catId) => {
        const meta = CATEGORY_META[catId]
        if (!meta || !categoryChannels[catId]?.length) return null
        return (
          <ChannelCarousel
            key={catId}
            title={`${meta.icon} ${meta.name}`}
            channels={categoryChannels[catId]}
            streams={streams}
            viewAllHref={`/category/${meta.slug}`}
          />
        )
      })}

      {/* All channels count */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 glass border border-white/5 px-6 py-3 rounded-full">
          <Tv className="w-4 h-4 text-indigo-400" />
          <span className="text-gray-400 text-sm">
            <span className="text-white font-semibold">{channels.length.toLocaleString()}</span> channels available
          </span>
          <Globe className="w-4 h-4 text-indigo-400" />
          <span className="text-gray-400 text-sm">
            <span className="text-white font-semibold">{streams.length.toLocaleString()}</span> live streams
          </span>
        </div>
      </div>
    </div>
  )
}
