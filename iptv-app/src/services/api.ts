import axios from 'axios'
import type { Channel, Stream, Category, Country, Language, Guide } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'https://iptv-org.github.io/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})

// Cache in memory
const cache: Record<string, { data: unknown; ts: number }> = {}
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function fetchWithCache<T>(url: string): Promise<T> {
  const now = Date.now()
  if (cache[url] && now - cache[url].ts < CACHE_TTL) {
    return cache[url].data as T
  }
  const res = await api.get<T>(url)
  cache[url] = { data: res.data, ts: now }
  return res.data
}

export const channelsService = {
  getAll: () => fetchWithCache<Channel[]>('/channels.json'),
  getById: async (id: string) => {
    const channels = await fetchWithCache<Channel[]>('/channels.json')
    return channels.find((c) => c.id === id) || null
  },
  getByCategory: async (category: string) => {
    const channels = await fetchWithCache<Channel[]>('/channels.json')
    return channels.filter((c) => c.categories?.includes(category))
  },
  getByCountry: async (country: string) => {
    const channels = await fetchWithCache<Channel[]>('/channels.json')
    return channels.filter((c) => c.country === country)
  },
  getByLanguage: async (language: string) => {
    const channels = await fetchWithCache<Channel[]>('/channels.json')
    return channels.filter((c) => c.languages?.includes(language))
  },
}

export const streamsService = {
  getAll: () => fetchWithCache<Stream[]>('/streams.json'),
  getByChannel: async (channelId: string) => {
    const streams = await fetchWithCache<Stream[]>('/streams.json')
    return streams.filter((s) => s.channel === channelId)
  },
  getFirst: async (channelId: string) => {
    const streams = await fetchWithCache<Stream[]>('/streams.json')
    return streams.find((s) => s.channel === channelId) || null
  },
}

export const categoriesService = {
  getAll: () => fetchWithCache<Category[]>('/categories.json'),
}

export const countriesService = {
  getAll: () => fetchWithCache<Country[]>('/countries.json'),
  getByCode: async (code: string) => {
    const countries = await fetchWithCache<Country[]>('/countries.json')
    return countries.find((c) => c.code === code) || null
  },
}

export const languagesService = {
  getAll: () => fetchWithCache<Language[]>('/languages.json'),
}

export const guidesService = {
  getAll: () => fetchWithCache<Guide[]>('/guides.json'),
  getByChannel: async (channelId: string) => {
    const guides = await fetchWithCache<Guide[]>('/guides.json')
    return guides.filter((g) => g.channel === channelId)
  },
}

export const blocklistService = {
  getAll: () => fetchWithCache<{ channel: string; ref: string }[]>('/blocklist.json'),
}

export function getChannelLogoUrl(channelId: string): string {
  return `https://iptv-org.github.io/iptv/logos/${channelId}.png`
}
