'use client'
import { useState } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown, LayoutGrid, List } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { useCategoryStore } from '@/stores/categoryStore'
import type { Country, Language } from '@/types'

interface CategoryFiltersProps {
  countries: Country[]
  languages: Language[]
  totalResults: number
  color?: string
}

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'country-asc', label: 'Country A–Z' },
  { value: 'active-desc', label: 'Live First' },
  { value: 'quality-desc', label: 'Best Quality' },
]

export default function CategoryFilters({ countries, languages, totalResults, color = '#6366f1' }: CategoryFiltersProps) {
  const { filters, setFilters, resetFilters, viewMode, setViewMode } = useCategoryStore()
  const [showAdvanced, setShowAdvanced] = useState(false)

  const activeFilterCount = [
    filters.countries.length > 0,
    filters.languages.length > 0,
    filters.hdOnly,
    filters.activeOnly,
  ].filter(Boolean).length

  const sortValue = `${filters.sortBy}-${filters.sortDir}`
  const handleSort = (val: string) => {
    const [sortBy, sortDir] = val.split('-') as [typeof filters.sortBy, typeof filters.sortDir]
    setFilters({ sortBy, sortDir })
  }

  const toggleCountry = (code: string) => {
    const next = filters.countries.includes(code)
      ? filters.countries.filter((c) => c !== code)
      : [...filters.countries, code]
    setFilters({ countries: next })
  }

  const toggleLanguage = (code: string) => {
    const next = filters.languages.includes(code)
      ? filters.languages.filter((l) => l !== code)
      : [...filters.languages, code]
    setFilters({ languages: next })
  }

  return (
    <div className="space-y-3 mb-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => setFilters({ query: e.target.value })}
            placeholder="Search channels in this category..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/60 transition-all"
            style={{ '--tw-ring-color': color } as React.CSSProperties}
          />
          {filters.query && (
            <button
              onClick={() => setFilters({ query: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortValue}
            onChange={(e) => handleSort(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#12121a]">
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all',
            showAdvanced || activeFilterCount > 0
              ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400'
              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/8'
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span
              className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
              style={{ background: color }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* View mode */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-1.5 rounded-lg transition-all',
              viewMode === 'grid' ? 'bg-indigo-600/30 text-indigo-400' : 'text-gray-500 hover:text-white'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-1.5 rounded-lg transition-all',
              viewMode === 'list' ? 'bg-indigo-600/30 text-indigo-400' : 'text-gray-500 hover:text-white'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced filters panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass border border-white/5 rounded-xl p-4 space-y-4">
              {/* Quick toggles */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilters({ activeOnly: !filters.activeOnly })}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    filters.activeOnly
                      ? 'bg-green-500/20 border-green-500/40 text-green-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  )}
                >
                  <span className={cn('w-1.5 h-1.5 rounded-full', filters.activeOnly ? 'bg-green-400 animate-pulse' : 'bg-gray-600')} />
                  Live Only
                </button>
                <button
                  onClick={() => setFilters({ hdOnly: !filters.hdOnly })}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    filters.hdOnly
                      ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  )}
                >
                  HD Only
                </button>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <X className="w-3 h-3" />
                    Clear All
                  </button>
                )}
              </div>

              {/* Country filter */}
              {countries.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Country</p>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {countries.slice(0, 30).map((c) => (
                      <button
                        key={c.code}
                        onClick={() => toggleCountry(c.code)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs border transition-all',
                          filters.countries.includes(c.code)
                            ? 'text-white border-indigo-500/50'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/8'
                        )}
                        style={filters.countries.includes(c.code) ? { background: `${color}22`, borderColor: `${color}55` } : {}}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Language filter */}
              {languages.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Language</p>
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                    {languages.slice(0, 20).map((l) => (
                      <button
                        key={l.code}
                        onClick={() => toggleLanguage(l.code)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs border transition-all',
                          filters.languages.includes(l.code)
                            ? 'text-white border-indigo-500/50'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/8'
                        )}
                        style={filters.languages.includes(l.code) ? { background: `${color}22`, borderColor: `${color}55` } : {}}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Showing <span className="text-white font-medium">{totalResults.toLocaleString()}</span> channels
        </span>
        {activeFilterCount > 0 && (
          <button onClick={resetFilters} className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Reset filters
          </button>
        )}
      </div>
    </div>
  )
}
