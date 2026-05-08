'use client'
import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { useChannelStore } from '@/stores/channelStore'
import { useChannelSearch } from '@/hooks/useChannels'
import ChannelGrid from '@/components/channel/ChannelGrid'
import { cn } from '@/utils/cn'
import { getFlagEmoji } from '@/utils/format'
import type { SearchFilters } from '@/types'

const QUALITY_OPTIONS = ['HD', 'SD', '4K', '720p']

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const { categories, countries, languages, streams, loading, fetchAll } = useChannelStore()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Partial<SearchFilters>>({
    query: initialQuery,
    countries: [],
    categories: [],
    languages: [],
    quality: [],
    httpsOnly: false,
    activeOnly: false,
  })

  useEffect(() => {
    fetchAll()
  }, [])

  useEffect(() => {
    setFilters((f) => ({ ...f, query: initialQuery }))
  }, [initialQuery])

  const results = useChannelSearch(filters)
  const streamMap = useMemo(() => new Map(streams.map((s) => [s.channel, s])), [streams])

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((f) => ({ ...f, [key]: value }))
  }

  const toggleArrayFilter = (key: 'countries' | 'categories' | 'languages', value: string) => {
    setFilters((f) => {
      const arr = f[key] || []
      return {
        ...f,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      }
    })
  }

  const clearFilters = () => {
    setFilters({ query: filters.query, countries: [], categories: [], languages: [], quality: [], httpsOnly: false, activeOnly: false })
  }

  const activeFilterCount =
    (filters.countries?.length || 0) +
    (filters.categories?.length || 0) +
    (filters.languages?.length || 0) +
    (filters.httpsOnly ? 1 : 0) +
    (filters.activeOnly ? 1 : 0)

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Search Channels</h1>
        <p className="text-gray-500">Find channels by name, country, language, or category</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={filters.query || ''}
            onChange={(e) => updateFilter('query', e.target.value)}
            placeholder="Search by channel name, network..."
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/8 transition-all text-sm"
            autoFocus
          />
          {filters.query && (
            <button
              onClick={() => updateFilter('query', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-sm font-medium',
            showFilters || activeFilterCount > 0
              ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400'
              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
          )}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={cn('w-4 h-4 transition-transform', showFilters && 'rotate-180')} />
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="glass-card rounded-2xl p-6 mb-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Filters</h3>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-indigo-400 hover:text-indigo-300">
                Clear all
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Categories</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => toggleArrayFilter('categories', cat.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                    filters.categories?.includes(cat.id)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Countries */}
          <div>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Countries</p>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {countries.slice(0, 50).map((country) => (
                <button
                  key={country.code}
                  onClick={() => toggleArrayFilter('countries', country.code)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    filters.countries?.includes(country.code)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  )}
                >
                  {getFlagEmoji(country.code)} {country.name}
                </button>
              ))}
            </div>
          </div>

          {/* Technical filters */}
          <div>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Technical</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilter('httpsOnly', !filters.httpsOnly)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  filters.httpsOnly ? 'bg-green-600/30 text-green-400 border border-green-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                )}
              >
                HTTPS Only
              </button>
              <button
                onClick={() => updateFilter('activeOnly', !filters.activeOnly)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  filters.activeOnly ? 'bg-green-600/30 text-green-400 border border-green-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                )}
              >
                Active Streams Only
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {loading ? 'Loading...' : (
            <>
              <span className="text-white font-semibold">{results.length.toLocaleString()}</span> channels found
            </>
          )}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="w-full h-28 shimmer rounded-xl" />
              <div className="w-3/4 h-3 shimmer rounded" />
            </div>
          ))}
        </div>
      ) : (
        <ChannelGrid
          channels={results.slice(0, 120)}
          streams={streams}
          emptyMessage="No channels match your search"
        />
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <SearchContent />
    </Suspense>
  )
}
