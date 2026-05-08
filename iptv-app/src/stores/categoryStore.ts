'use client'
import { create } from 'zustand'
import type { ExtendedCategory, CategoryFilters, Channel, Stream } from '@/types'

export const CATEGORY_META: Record<string, Omit<ExtendedCategory, 'total_channels' | 'active_channels'>> = {
  news: {
    id: 'news',
    name: 'News',
    slug: 'news',
    icon: '📰',
    color: '#3b82f6',
    gradient: 'from-blue-900/80 via-blue-800/40 to-transparent',
    description: 'Stay informed with live news channels from around the world — breaking news, politics, finance, and more.',
    trending: true,
    featured: true,
    subcategories: ['International News', 'Local News', 'Political News', 'Financial News'],
  },
  sports: {
    id: 'sports',
    name: 'Sports',
    slug: 'sports',
    icon: '🏆',
    color: '#f59e0b',
    gradient: 'from-amber-900/80 via-amber-800/40 to-transparent',
    description: 'Live sports coverage — football, basketball, UFC, motorsport, eSports and more.',
    trending: true,
    featured: true,
    subcategories: ['Football', 'Basketball', 'UFC', 'Motorsport', 'eSports'],
  },
  movies: {
    id: 'movies',
    name: 'Movies',
    slug: 'movies',
    icon: '🎬',
    color: '#ef4444',
    gradient: 'from-red-900/80 via-red-800/40 to-transparent',
    description: 'Hollywood blockbusters, Asian cinema, action, horror, drama and more.',
    featured: true,
    subcategories: ['Hollywood', 'Asian Movies', 'Action', 'Horror', 'Drama'],
  },
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment',
    slug: 'entertainment',
    icon: '✨',
    color: '#8b5cf6',
    gradient: 'from-violet-900/80 via-violet-800/40 to-transparent',
    description: 'General TV, reality shows, celebrity content, variety shows and more.',
    featured: true,
    subcategories: ['General TV', 'Reality Show', 'Celebrity', 'Variety Show'],
  },
  music: {
    id: 'music',
    name: 'Music',
    slug: 'music',
    icon: '🎵',
    color: '#ec4899',
    gradient: 'from-pink-900/80 via-pink-800/40 to-transparent',
    description: 'Pop, rock, EDM, K-Pop and 24/7 music channels.',
    subcategories: ['Pop', 'Rock', 'EDM', 'K-Pop'],
  },
  kids: {
    id: 'kids',
    name: 'Kids',
    slug: 'kids',
    icon: '🧸',
    color: '#10b981',
    gradient: 'from-emerald-900/80 via-emerald-800/40 to-transparent',
    description: 'Safe and fun content for children — cartoons, anime kids, and educational shows.',
    subcategories: ['Cartoon', 'Anime Kids', 'Education'],
  },
  documentary: {
    id: 'documentary',
    name: 'Documentary',
    slug: 'documentary',
    icon: '🎥',
    color: '#6366f1',
    gradient: 'from-indigo-900/80 via-indigo-800/40 to-transparent',
    description: 'Explore nature, history, science and the world through documentary channels.',
    subcategories: ['Nature', 'History', 'Science'],
  },
  animation: {
    id: 'animation',
    name: 'Anime',
    slug: 'animation',
    icon: '⛩️',
    color: '#f97316',
    gradient: 'from-orange-900/80 via-orange-800/40 to-transparent',
    description: 'Anime 24/7, subbed and dubbed — the best of Japanese animation.',
    trending: true,
    subcategories: ['Anime 24/7', 'Subbed', 'Dubbed'],
  },
  religious: {
    id: 'religious',
    name: 'Religion',
    slug: 'religious',
    icon: '🕌',
    color: '#84cc16',
    gradient: 'from-lime-900/80 via-lime-800/40 to-transparent',
    description: 'Spiritual and religious channels — Islam, Christian, Hindu, Buddhist.',
    subcategories: ['Islam', 'Christian', 'Hindu', 'Buddhist'],
  },
  education: {
    id: 'education',
    name: 'Education',
    slug: 'education',
    icon: '📚',
    color: '#06b6d4',
    gradient: 'from-cyan-900/80 via-cyan-800/40 to-transparent',
    description: 'Technology, science, programming and educational content.',
    subcategories: ['Technology', 'Science', 'Programming'],
  },
  lifestyle: {
    id: 'lifestyle',
    name: 'Lifestyle',
    slug: 'lifestyle',
    icon: '🌿',
    color: '#14b8a6',
    gradient: 'from-teal-900/80 via-teal-800/40 to-transparent',
    description: 'Cooking, travel, fashion and lifestyle channels.',
    subcategories: ['Cooking', 'Travel', 'Fashion'],
  },
  auto: {
    id: 'auto',
    name: 'Auto',
    slug: 'auto',
    icon: '🚗',
    color: '#64748b',
    gradient: 'from-slate-900/80 via-slate-800/40 to-transparent',
    description: 'Automotive, motorsport and car culture channels.',
  },
  business: {
    id: 'business',
    name: 'Business',
    slug: 'business',
    icon: '💼',
    color: '#0ea5e9',
    gradient: 'from-sky-900/80 via-sky-800/40 to-transparent',
    description: 'Business, finance, economy and market channels.',
  },
  travel: {
    id: 'travel',
    name: 'Travel',
    slug: 'travel',
    icon: '✈️',
    color: '#a78bfa',
    gradient: 'from-violet-900/80 via-violet-800/40 to-transparent',
    description: 'Travel, tourism and adventure channels from around the world.',
  },
  cooking: {
    id: 'cooking',
    name: 'Cooking',
    slug: 'cooking',
    icon: '🍳',
    color: '#fb923c',
    gradient: 'from-orange-900/80 via-orange-800/40 to-transparent',
    description: 'Culinary arts, recipes, and food culture channels.',
  },
  science: {
    id: 'science',
    name: 'Science',
    slug: 'science',
    icon: '🔬',
    color: '#22d3ee',
    gradient: 'from-cyan-900/80 via-cyan-800/40 to-transparent',
    description: 'Science, technology, space and discovery channels.',
  },
  general: {
    id: 'general',
    name: 'General',
    slug: 'general',
    icon: '📺',
    color: '#94a3b8',
    gradient: 'from-slate-900/80 via-slate-800/40 to-transparent',
    description: 'General purpose TV channels for all audiences.',
  },
}

export const DEFAULT_FILTERS: CategoryFilters = {
  query: '',
  countries: [],
  languages: [],
  hdOnly: false,
  activeOnly: false,
  nsfw: false,
  sortBy: 'name',
  sortDir: 'asc',
}

interface CategoryStoreState {
  filters: CategoryFilters
  setFilters: (f: Partial<CategoryFilters>) => void
  resetFilters: () => void
  viewMode: 'grid' | 'list'
  setViewMode: (m: 'grid' | 'list') => void
}

export const useCategoryStore = create<CategoryStoreState>((set) => ({
  filters: DEFAULT_FILTERS,
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
  viewMode: 'grid',
  setViewMode: (m) => set({ viewMode: m }),
}))

export function getCategoryMeta(slug: string): Omit<ExtendedCategory, 'total_channels' | 'active_channels'> {
  return (
    CATEGORY_META[slug] ?? {
      id: slug,
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      slug,
      icon: '📺',
      color: '#6366f1',
      gradient: 'from-indigo-900/80 via-indigo-800/40 to-transparent',
      description: `Browse all ${slug} channels.`,
    }
  )
}

export function buildExtendedCategories(
  apiCategories: { id: string; name: string }[],
  channels: Channel[],
  streams: Stream[]
): ExtendedCategory[] {
  const streamSet = new Set(streams.map((s) => s.channel))
  return apiCategories.map((cat) => {
    const meta = getCategoryMeta(cat.id)
    const catChannels = channels.filter((c) => c.categories?.includes(cat.id))
    const activeCount = catChannels.filter((c) => streamSet.has(c.id)).length
    return {
      ...meta,
      name: meta.name || cat.name,
      total_channels: catChannels.length,
      active_channels: activeCount,
    }
  })
}
