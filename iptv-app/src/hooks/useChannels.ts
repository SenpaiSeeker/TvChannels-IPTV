'use client'
import { useEffect, useMemo } from 'react'
import { useChannelStore } from '@/stores/channelStore'
import Fuse from 'fuse.js'
import type { Channel, SearchFilters } from '@/types'

export function useChannels() {
  const store = useChannelStore()

  useEffect(() => {
    store.fetchAll()
  }, [])

  return store
}

export function useChannelSearch(filters: Partial<SearchFilters>) {
  const { channels, streams } = useChannelStore()

  const fuse = useMemo(
    () =>
      new Fuse(channels, {
        keys: ['name', 'alt_names', 'network', 'country', 'categories', 'languages'],
        threshold: 0.3,
        includeScore: true,
      }),
    [channels]
  )

  const results = useMemo(() => {
    let filtered: Channel[] = channels

    if (filters.query && filters.query.trim()) {
      filtered = fuse.search(filters.query).map((r) => r.item)
    }

    if (filters.countries && filters.countries.length > 0) {
      filtered = filtered.filter((c) => filters.countries!.includes(c.country))
    }

    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((c) =>
        c.categories?.some((cat) => filters.categories!.includes(cat))
      )
    }

    if (filters.languages && filters.languages.length > 0) {
      filtered = filtered.filter((c) =>
        c.languages?.some((lang) => filters.languages!.includes(lang))
      )
    }

    if (filters.httpsOnly) {
      const streamMap = new Set(
        streams.filter((s) => s.url.startsWith('https')).map((s) => s.channel)
      )
      filtered = filtered.filter((c) => streamMap.has(c.id))
    }

    if (filters.activeOnly) {
      const activeChannels = new Set(streams.map((s) => s.channel))
      filtered = filtered.filter((c) => activeChannels.has(c.id))
    }

    return filtered
  }, [channels, streams, fuse, filters])

  return results
}

export function useChannelsByCategory(category: string, limit?: number) {
  const { channels } = useChannelStore()
  return useMemo(() => {
    const filtered = channels.filter((c) => c.categories?.includes(category))
    return limit ? filtered.slice(0, limit) : filtered
  }, [channels, category, limit])
}

export function useChannelsByCountry(country: string, limit?: number) {
  const { channels } = useChannelStore()
  return useMemo(() => {
    const filtered = channels.filter((c) => c.country === country)
    return limit ? filtered.slice(0, limit) : filtered
  }, [channels, country, limit])
}

export function useFeaturedChannels(limit = 10) {
  const { channels, streams } = useChannelStore()
  return useMemo(() => {
    const streamSet = new Set(streams.map((s) => s.channel))
    const withStreams = channels.filter((c) => streamSet.has(c.id) && c.logo)
    // Shuffle and pick
    const shuffled = [...withStreams].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, limit)
  }, [channels, streams, limit])
}
