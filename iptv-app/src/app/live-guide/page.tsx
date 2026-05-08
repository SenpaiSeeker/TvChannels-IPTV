'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Radio, Play, Globe, Search } from 'lucide-react'
import { useChannelStore } from '@/stores/channelStore'
import { getFlagEmoji } from '@/utils/format'
import { cn } from '@/utils/cn'

const POPULAR_COUNTRIES = ['us', 'gb', 'fr', 'de', 'es', 'it', 'br', 'in', 'jp', 'kr', 'au', 'ca', 'mx', 'ru', 'cn']

export default function LiveGuidePage() {
  const { channels, streams, countries, fetchAll, loading } = useChannelStore()
  const [selectedCountry, setSelectedCountry] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchAll()
  }, [])

  const streamSet = useMemo(() => new Set(streams.map((s) => s.channel)), [streams])
  const streamMap = useMemo(() => new Map(streams.map((s) => [s.channel, s])), [streams])

  const liveChannels = useMemo(() => {
    let filtered = channels.filter((c) => streamSet.has(c.id))

    if (selectedCountry !== 'all') {
      filtered = filtered.filter((c) => c.country === selectedCountry)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(q))
    }

    return filtered.slice(0, 200)
  }, [channels, streamSet, selectedCountry, searchQuery])

  const popularCountries = useMemo(() => {
    return POPULAR_COUNTRIES
      .map((code) => countries.find((c) => c.code === code))
      .filter(Boolean) as typeof countries
  }, [countries])

  const now = new Date()
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Radio className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Live Guide</h1>
            <p className="text-gray-500 text-sm">
              {streamSet.size.toLocaleString()} live streams • {timeStr}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full font-bold live-badge">
            ● LIVE
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search live channels..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
        />
      </div>

      {/* Country filter */}
      <div className="flex gap-2 overflow-x-auto carousel-container pb-2 mb-6">
        <button
          onClick={() => setSelectedCountry('all')}
          className={cn(
            'flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            selectedCountry === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          )}
        >
          <Globe className="w-3.5 h-3.5" />
          All Countries
        </button>
        {popularCountries.map((country) => (
          <button
            key={country.code}
            onClick={() => setSelectedCountry(country.code)}
            className={cn(
              'flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              selectedCountry === country.code
                ? 'bg-indigo-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            )}
          >
            {getFlagEmoji(country.code)} {country.name}
          </button>
        ))}
      </div>

      {/* Live channels grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="h-20 shimmer rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Showing <span className="text-white font-medium">{liveChannels.length}</span> live channels
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {liveChannels.map((channel) => {
              const stream = streamMap.get(channel.id)
              return (
                <Link
                  key={channel.id}
                  href={`/watch/${channel.id}`}
                  className="flex items-center gap-3 p-3 glass-card rounded-xl hover:border-indigo-500/30 transition-all group"
                >
                  {/* Logo */}
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {channel.logo ? (
                      <Image
                        src={channel.logo}
                        alt={channel.name}
                        width={48}
                        height={48}
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <span className="text-xl">{getFlagEmoji(channel.country)}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">
                      {channel.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-600">
                        {getFlagEmoji(channel.country)} {channel.country?.toUpperCase()}
                      </span>
                      {channel.categories?.[0] && (
                        <span className="text-xs text-indigo-400/70 capitalize">{channel.categories[0]}</span>
                      )}
                    </div>
                  </div>

                  {/* Play button */}
                  <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400 ml-0.5" />
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
