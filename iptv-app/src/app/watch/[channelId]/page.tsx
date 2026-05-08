'use client'
import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Heart, Globe, Tag, Languages, ArrowLeft, ExternalLink,
  Wifi, WifiOff, Share2, ChevronRight
} from 'lucide-react'
import { useChannelStore } from '@/stores/channelStore'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { useHistoryStore } from '@/stores/historyStore'
import VideoPlayer from '@/components/player/VideoPlayer'
import ChannelCard from '@/components/channel/ChannelCard'
import { getFlagEmoji } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { Stream } from '@/types'

export default function WatchPage() {
  const params = useParams()
  const router = useRouter()
  const channelId = params.channelId as string

  const { channels, streams, loading, fetchAll } = useChannelStore()
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore()
  const { addHistory } = useHistoryStore()

  const [selectedStreamIndex, setSelectedStreamIndex] = useState(0)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    fetchAll()
  }, [])

  const channel = useMemo(() => channels.find((c) => c.id === channelId), [channels, channelId])
  const channelStreams = useMemo(() => streams.filter((s) => s.channel === channelId), [streams, channelId])
  const currentStream: Stream | undefined = channelStreams[selectedStreamIndex]

  // Similar channels
  const similarChannels = useMemo(() => {
    if (!channel) return []
    return channels
      .filter(
        (c) =>
          c.id !== channelId &&
          (c.country === channel.country ||
            c.categories?.some((cat) => channel.categories?.includes(cat)))
      )
      .slice(0, 12)
  }, [channels, channel, channelId])

  const streamMap = useMemo(() => new Map(streams.map((s) => [s.channel, s])), [streams])

  useEffect(() => {
    if (channel) {
      addHistory(channel.id)
    }
  }, [channel])

  const favorite = channel ? isFavorite(channel.id) : false

  const toggleFavorite = () => {
    if (!channel) return
    if (favorite) removeFavorite(channel.id)
    else addFavorite(channel.id)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: channel?.name,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="w-full aspect-video shimmer rounded-2xl mb-6" />
        <div className="shimmer w-64 h-8 rounded mb-4" />
        <div className="shimmer w-full h-24 rounded" />
      </div>
    )
  }

  if (!channel && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="text-6xl mb-4">📺</div>
        <h1 className="text-2xl font-bold text-white mb-2">Channel Not Found</h1>
        <p className="text-gray-400 mb-6">This channel doesn&apos;t exist or has been removed.</p>
        <Link href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
          Back to Home
        </Link>
      </div>
    )
  }

  if (!channel) return null

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Video Player */}
          {currentStream ? (
            <VideoPlayer
              stream={currentStream}
              channelName={channel.name}
              className="w-full aspect-video"
            />
          ) : (
            <div className="w-full aspect-video bg-black/60 rounded-2xl flex flex-col items-center justify-center border border-white/5">
              <WifiOff className="w-12 h-12 text-gray-600 mb-3" />
              <p className="text-gray-400 font-medium">No streams available</p>
              <p className="text-gray-600 text-sm mt-1">This channel may be offline or geo-restricted</p>
            </div>
          )}

          {/* Stream selector */}
          {channelStreams.length > 1 && (
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Available Streams</h3>
              <div className="flex flex-wrap gap-2">
                {channelStreams.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedStreamIndex(i)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                      i === selectedStreamIndex
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    )}
                  >
                    Stream {i + 1}
                    {s.quality && ` • ${s.quality}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Channel Info */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Logo */}
                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {channel.logo && !imgError ? (
                    <Image
                      src={channel.logo}
                      alt={channel.name}
                      width={64}
                      height={64}
                      className="object-contain"
                      onError={() => setImgError(true)}
                      unoptimized
                    />
                  ) : (
                    <span className="text-2xl">{getFlagEmoji(channel.country)}</span>
                  )}
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-white">{channel.name}</h1>
                  {channel.alt_names && channel.alt_names.length > 0 && (
                    <p className="text-gray-500 text-sm">{channel.alt_names.join(', ')}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-400">
                      {getFlagEmoji(channel.country)} {channel.country?.toUpperCase()}
                    </span>
                    {channelStreams.length > 0 ? (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <Wifi className="w-3 h-3" />
                        {channelStreams.length} stream{channelStreams.length > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-400/60">
                        <WifiOff className="w-3 h-3" />
                        Offline
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFavorite}
                  className={cn(
                    'p-2.5 rounded-xl border transition-all',
                    favorite
                      ? 'bg-red-500/20 border-red-500/40 text-red-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  )}
                >
                  <Heart className={cn('w-4 h-4', favorite && 'fill-red-400')} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                {channel.website && (
                  <a
                    href={channel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {channel.categories && channel.categories.length > 0 && (
                <div className="flex items-start gap-2">
                  <Tag className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Categories</p>
                    <div className="flex flex-wrap gap-1">
                      {channel.categories.map((cat) => (
                        <Link
                          key={cat}
                          href={`/category/${cat}`}
                          className="text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full capitalize hover:bg-indigo-600/30 transition-colors"
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {channel.languages && channel.languages.length > 0 && (
                <div className="flex items-start gap-2">
                  <Languages className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Languages</p>
                    <p className="text-sm text-gray-300">{channel.languages.join(', ')}</p>
                  </div>
                </div>
              )}

              {channel.broadcast_area && channel.broadcast_area.length > 0 && (
                <div className="flex items-start gap-2">
                  <Globe className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Broadcast Area</p>
                    <p className="text-sm text-gray-300">{channel.broadcast_area.slice(0, 3).join(', ')}</p>
                  </div>
                </div>
              )}

              {channel.network && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Network</p>
                  <p className="text-sm text-gray-300">{channel.network}</p>
                </div>
              )}

              {channel.launched && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Launched</p>
                  <p className="text-sm text-gray-300">{channel.launched}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Similar Channels */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Similar Channels</h3>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </div>
            <div className="space-y-2">
              {similarChannels.slice(0, 8).map((ch) => (
                <Link
                  key={ch.id}
                  href={`/watch/${ch.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {ch.logo ? (
                      <Image
                        src={ch.logo}
                        alt={ch.name}
                        width={40}
                        height={40}
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <span className="text-sm">{getFlagEmoji(ch.country)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-300 truncate group-hover:text-white transition-colors">
                      {ch.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {getFlagEmoji(ch.country)} {ch.country?.toUpperCase()}
                    </p>
                  </div>
                  {streamMap.has(ch.id) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* More similar channels grid */}
      {similarChannels.length > 8 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-white mb-4">More Like This</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarChannels.slice(8).map((ch) => (
              <ChannelCard key={ch.id} channel={ch} stream={streamMap.get(ch.id)} size="sm" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
