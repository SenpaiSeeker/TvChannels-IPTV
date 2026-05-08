'use client'
import { create } from 'zustand'
import type { Channel, Stream, Category, Country, Language } from '@/types'
import { channelsService, streamsService, categoriesService, countriesService, languagesService } from '@/services/api'

interface ChannelState {
  channels: Channel[]
  streams: Stream[]
  categories: Category[]
  countries: Country[]
  languages: Language[]
  loading: boolean
  error: string | null
  initialized: boolean
  fetchAll: () => Promise<void>
  getChannelById: (id: string) => Channel | undefined
  getStreamsByChannel: (id: string) => Stream[]
}

export const useChannelStore = create<ChannelState>((set, get) => ({
  channels: [],
  streams: [],
  categories: [],
  countries: [],
  languages: [],
  loading: false,
  error: null,
  initialized: false,

  fetchAll: async () => {
    if (get().initialized) return
    set({ loading: true, error: null })
    try {
      const [channels, streams, categories, countries, languages] = await Promise.all([
        channelsService.getAll(),
        streamsService.getAll(),
        categoriesService.getAll(),
        countriesService.getAll(),
        languagesService.getAll(),
      ])
      set({ channels, streams, categories, countries, languages, loading: false, initialized: true })
    } catch (err) {
      set({ error: 'Failed to load channel data', loading: false })
    }
  },

  getChannelById: (id: string) => {
    return get().channels.find((c) => c.id === id)
  },

  getStreamsByChannel: (id: string) => {
    return get().streams.filter((s) => s.channel === id)
  },
}))
