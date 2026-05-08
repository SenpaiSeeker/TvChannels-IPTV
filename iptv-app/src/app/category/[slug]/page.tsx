'use client'
import { useEffect, useMemo, useCallback, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Fuse from 'fuse.js'
import { useChannelStore } from '@/stores/channelStore'
import { useCategoryStore, buildExtendedCategories, getCategoryMeta } from '@/stores/categoryStore'
import CategoryBanner from '@/components/category/CategoryBanner'
import CategoryFilters from '@/components/category/CategoryFilters'
import CategoryTabs from '@/components/category/CategoryTabs'
import CategorySidebar from '@/components/category/CategorySidebar'
import ChannelCard from '@/components/channel/ChannelCard'
import ChannelListItem from '@/components/channel/ChannelListItem'
import { CarouselSkeleton } from '@/components/ui/Skeleton'
import type { ExtendedCategory, Channel } from '@/types'

const PAGE_SIZE = 48

export default function CategoryPage() {
  const params = useParams()
  const slug = params?.slug as string

  const { channels, streams, categories: apiCategories, countries, languages, loading, fetchAll } = useChannelStore()
  const { filters, resetFilters, viewMode } = useCategoryStore()
  const [page, setPage] = useState(1)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchAll()
  }, [])

  // Reset filters & page when navigating to a new category
  useEffect(() => {
    resetFilters()
    setPage(1)
  }, [slug])

  // Build extended categories
  const extendedCategories = useMemo(
    () => buildExtendedCategories(apiCategories, channels, streams),
    [apiCategories, channels, streams]
  )

  // Current category meta
  const currentCategory: ExtendedCategory = useMemo(() => {
    const found = extendedCategories.find((c) => c.slug === slug || c.id === slug)
    if (found) return found
    const meta = getCategoryMeta(slug)
    const catChannels = channels.filter((c) => c.categories?.includes(slug))
    const streamSet = new Set(streams.map((s) => s.channel))
    return {
      ...meta,
      total_channels: catChannels.length,
      active_channels: catChannels.filter((c) => streamSet.has(c.id)).length,
    }
  }, [extendedCategories, slug, channels, streams])

  // Stream map
  const streamMap = useMemo(() => new Map(streams.map((s) => [s.channel, s])), [streams])

  // Base channels for this category
  const baseChannels = useMemo(
    () => channels.filter((c) => c.categories?.includes(slug)),
    [channels, slug]
  )

  // Fuse for search
  const fuse = useMemo(
    () =>
      new Fuse(baseChannels, {
        keys: ['name', 'alt_names', 'country', 'languages'],
        threshold: 0.35,
        includeScore: true,
      }),
    [baseChannels]
  )

  // Filtered + sorted channels
  const filteredChannels = useMemo(() => {
    let result: Channel[] = baseChannels

    // Search
    if (filters.query.trim()) {
      result = fuse.search(filters.query).map((r) => r.item)
    }

    // Country filter
    if (filters.countries.length > 0) {
      result = result.filter((c) => filters.countries.includes(c.country))
    }

    // Language filter
    if (filters.languages.length > 0) {
      result = result.filter((c) => c.languages?.some((l) => filters.languages.includes(l)))
    }

    // Active only
    if (filters.activeOnly) {
      result = result.filter((c) => streamMap.has(c.id))
    }

    // HD only
    if (filters.hdOnly) {
      result = result.filter((c) => {
        const s = streamMap.get(c.id)
        return s?.resolution && s.resolution.height >= 720
      })
    }

    // NSFW filter (hide by default)
    if (!filters.nsfw) {
      result = result.filter((c) => !c.is_nsfw)
    }

    // Sort
    result = [...result].sort((a, b) => {
      const dir = filters.sortDir === 'asc' ? 1 : -1
      if (filters.sortBy === 'name') return a.name.localeCompare(b.name) * dir
      if (filters.sortBy === 'country') return (a.country || '').localeCompare(b.country || '') * dir
      if (filters.sortBy === 'active') {
        const aLive = streamMap.has(a.id) ? 1 : 0
        const bLive = streamMap.has(b.id) ? 1 : 0
        return (bLive - aLive) * dir
      }
      if (filters.sortBy === 'quality') {
        const aH = streamMap.get(a.id)?.resolution?.height ?? 0
        const bH = streamMap.get(b.id)?.resolution?.height ?? 0
        return (bH - aH) * dir
      }
      return 0
    })

    return result
  }, [baseChannels, filters, fuse, streamMap])

  // Paginated slice
  const visibleChannels = useMemo(
    () => filteredChannels.slice(0, page * PAGE_SIZE),
    [filteredChannels, page]
  )

  const hasMore = visibleChannels.length < filteredChannels.length

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((p) => p + 1)
      }
    },
    [hasMore]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 })
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [handleObserver])

  // Countries & languages present in this category
  const categoryCountries = useMemo(() => {
    const codes = new Set(baseChannels.map((c) => c.country).filter(Boolean))
    return countries.filter((c) => codes.has(c.code))
  }, [baseChannels, countries])

  const categoryLanguages = useMemo(() => {
    const codes = new Set(baseChannels.flatMap((c) => c.languages ?? []))
    return languages.filter((l) => codes.has(l.code))
  }, [baseChannels, languages])

  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="w-full h-56 shimmer rounded-2xl" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-28 h-9 shimmer rounded-xl flex-shrink-0" />
          ))}
        </div>
        <CarouselSkeleton />
        <CarouselSkeleton />
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Banner */}
      <CategoryBanner category={currentCategory} />

      {/* Category Tabs */}
      {extendedCategories.length > 0 && (
        <CategoryTabs categories={extendedCategories} />
      )}

      {/* Main layout: sidebar + content */}
      <div className="flex gap-8">
        {/* Sidebar */}
        <CategorySidebar categories={extendedCategories} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Filters */}
          <CategoryFilters
            countries={categoryCountries}
            languages={categoryLanguages}
            totalResults={filteredChannels.length}
            color={currentCategory.color}
          />

          {/* Empty state */}
          {filteredChannels.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4"
                style={{ background: `${currentCategory.color}15`, border: `1px solid ${currentCategory.color}25` }}
              >
                {currentCategory.icon}
              </div>
              <p className="text-gray-300 text-lg font-semibold mb-1">No channels found</p>
              <p className="text-gray-600 text-sm">Try adjusting your filters or search query</p>
            </motion.div>
          )}

          {/* Grid view */}
          {viewMode === 'grid' && filteredChannels.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {visibleChannels.map((channel, i) => (
                <motion.div
                  key={channel.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.015, 0.4) }}
                >
                  <ChannelCard
                    channel={channel}
                    stream={streamMap.get(channel.id)}
                    size="md"
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* List view */}
          {viewMode === 'list' && filteredChannels.length > 0 && (
            <div className="space-y-2">
              {visibleChannels.map((channel, i) => (
                <ChannelListItem
                  key={channel.id}
                  channel={channel}
                  stream={streamMap.get(channel.id)}
                  index={i}
                />
              ))}
            </div>
          )}

          {/* Infinite scroll loader */}
          <div ref={loaderRef} className="py-8">
            {hasMore && (
              <div className="flex justify-center gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-44 h-28 shimmer rounded-xl" />
                ))}
              </div>
            )}
            {!hasMore && filteredChannels.length > 0 && (
              <p className="text-center text-gray-600 text-sm py-4">
                All {filteredChannels.length.toLocaleString()} channels loaded
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
