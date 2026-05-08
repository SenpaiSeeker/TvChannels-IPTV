'use client'
import { useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Globe } from 'lucide-react'
import { useChannelStore } from '@/stores/channelStore'
import ChannelGrid from '@/components/channel/ChannelGrid'
import { getFlagEmoji } from '@/utils/format'

export default function CountryPage() {
  const params = useParams()
  const code = params.code as string
  const { channels, streams, countries, fetchAll, loading } = useChannelStore()

  useEffect(() => {
    fetchAll()
  }, [])

  const country = useMemo(() => countries.find((c) => c.code === code), [countries, code])
  const countryChannels = useMemo(() => {
    return channels.filter((c) => c.country === code)
  }, [channels, code])

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-3xl">
          {getFlagEmoji(code)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-400 uppercase tracking-wider">Country</span>
          </div>
          <h1 className="text-3xl font-bold text-white">{country?.name || code.toUpperCase()}</h1>
          <p className="text-gray-500 text-sm">{countryChannels.length.toLocaleString()} channels</p>
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
        <ChannelGrid channels={countryChannels} streams={streams} emptyMessage="No channels found for this country" />
      )}
    </div>
  )
}
