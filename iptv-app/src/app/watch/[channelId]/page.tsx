'use client'
import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Heart, Globe, Tag, Languages, ArrowLeft, ExternalLink,
  Wifi, WifiOff, Share2, SkipBack, SkipForward,
  Shuffle, List, Tv2, Search, X
} from 'lucide-react'
import { useChannelStore } from '@/stores/channelStore'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { useHistoryStore } from '@/stores/historyStore'
import VideoPlayer, { type VideoPlayerHandle } from '@/components/player/VideoPlayer'
import TVRemote from '@/components/player/TVRemote'
import { getFlagEmoji } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { Stream, Channel } from '@/types'

export default function WatchPage() {
  const params = useParams()
  const router = useRouter()
  const channelId = params.channelId as string

  const { channels, streams, loading, fetchAll } = useChannelStore()
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore()
  const { addHistory } = useHistoryStore()

  const [selectedStreamIndex, setSelectedStreamIndex] = useState(0)
  const [imgError, setImgError] = useState(false)
  const [volume, setVolume] = useState(80)
  const [muted, setMuted] = useState(false)
  const [showChannelList, setShowChannelList] = useState(false)
  const [selectedSimilarCategory, setSelectedSimilarCategory] = useState<string | null>(null)
  const [similarSearch, setSimilarSearch] = useState('')

  const playerRef = useRef<VideoPlayerHandle>(null)

  useEffect(() => {
    fetchAll()
  }, [])

  const channel = useMemo(() => channels.find((c) => c.id === channelId), [channels, channelId])
  const channelStreams = useMemo(() => streams.filter((s) => s.channel === channelId), [streams, channelId])
  const currentStream: Stream | undefined = channelStreams[selectedStreamIndex]

  const streamMap = useMemo(() => new Map(streams.map((s) => [s.channel, s])), [streams])

  // All live channels (with streams) — used for prev/next navigation
  const liveChannels = useMemo(() => channels.filter((c) => streamMap.has(c.id)), [channels, streamMap])
  const currentIndex = useMemo(() => liveChannels.findIndex((c) => c.id === channelId), [liveChannels, channelId])

  // Categories available for similar channels tabs
  const similarCategories = useMemo(() => {
    if (!channel) return []
    const cats: string[] = []
    if (channel.country) cats.push('country:' + channel.country)
    if (channel.categories) channel.categories.forEach((c) => cats.push(c))
    return cats
  }, [channel])

  // Active similar category tab (default to first)
  const activeSimilarCategory = selectedSimilarCategory ?? similarCategories[0] ?? null

  // Similar channels filtered by active category
  const similarChannels = useMemo(() => {
    if (!channel) return []
    if (!activeSimilarCategory) return []
    if (activeSimilarCategory.startsWith('country:')) {
      const countryCode = activeSimilarCategory.replace('country:', '')
      return channels.filter((c) => c.id !== channelId && c.country === countryCode)
    }
    return channels.filter(
      (c) => c.id !== channelId && c.categories?.includes(activeSimilarCategory)
    )
  }, [channels, channel, channelId, activeSimilarCategory])

  const filteredSimilarChannels = useMemo(() => {
    if (!similarSearch.trim()) return similarChannels
    const q = similarSearch.toLowerCase().trim()
    return similarChannels.filter((c) => c.name.toLowerCase().includes(q))
  }, [similarChannels, similarSearch])

  useEffect(() => {
    if (channel) {
      addHistory(channel.id)
    }
  }, [channel])

  // Reset stream index when channel changes
  useEffect(() => {
    setSelectedStreamIndex(0)
    setImgError(false)
    setSimilarSearch('')
  }, [channelId])

  const navigateToChannel = useCallback((ch: Channel) => {
    router.push(`/watch/${ch.id}`)
  }, [router])

  const goPrev = useCallback(() => {
    if (liveChannels.length === 0) return
    const idx = currentIndex <= 0 ? liveChannels.length - 1 : currentIndex - 1
    navigateToChannel(liveChannels[idx])
  }, [liveChannels, currentIndex, navigateToChannel])

  const goNext = useCallback(() => {
    if (liveChannels.length === 0) return
    const idx = currentIndex >= liveChannels.length - 1 ? 0 : currentIndex + 1
    navigateToChannel(liveChannels[idx])
  }, [liveChannels, currentIndex, navigateToChannel])

  const goRandom = useCallback(() => {
    if (liveChannels.length === 0) return
    let idx = Math.floor(Math.random() * liveChannels.length)
    if (idx === currentIndex) idx = (idx + 1) % liveChannels.length
    navigateToChannel(liveChannels[idx])
  }, [liveChannels, currentIndex, navigateToChannel])

  const favorite = channel ? isFavorite(channel.id) : false

  const toggleFavorite = () => {
    if (!channel) return
    if (favorite) removeFavorite(channel.id)
    else addFavorite(channel.id)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: channel?.name, url: window.location.href })
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
        <div className="xl:col-span-2 space-y-4">
          {/* Video Player */}
          {currentStream ? (
            <VideoPlayer
              ref={playerRef}
              stream={currentStream}
              channelName={channel.name}
              channelNumber={currentIndex >= 0 ? currentIndex + 1 : undefined}
              className="w-full aspect-video"
              onPrevChannel={goPrev}
              onNextChannel={goNext}
              onToggleChannelList={() => setShowChannelList((v) => !v)}
              externalVolume={volume}
              externalMuted={muted}
              onVolumeChange={setVolume}
              onMuteChange={setMuted}
            />
          ) : (
            <div className="w-full aspect-video bg-black/60 rounded-2xl flex flex-col items-center justify-center border border-white/5">
              <WifiOff className="w-12 h-12 text-gray-600 mb-3" />
              <p className="text-gray-400 font-medium">No streams available</p>
              <p className="text-gray-600 text-sm mt-1">This channel may be offline or geo-restricted</p>
            </div>
          )}

          {/* ── TV Remote Navigation ── */}
          <TVRemote
            currentChannel={channel}
            allChannels={channels}
            streamMap={streamMap}
            onChannelChange={navigateToChannel}
            volume={volume}
            muted={muted}
            onVolumeChange={setVolume}
            onMuteToggle={() => setMuted((m) => !m)}
            onFullscreen={() => playerRef.current?.toggleFullscreen()}
          />

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
                    {currentIndex >= 0 && (
                      <span className="text-xs text-indigo-400 font-mono bg-indigo-600/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                        CH {String(currentIndex + 1).padStart(2, '0')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <button
                  onClick={goPrev}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  title="Previous Channel"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={goNext}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  title="Next Channel"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
                <button
                  onClick={goRandom}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                  title="Random Channel"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
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
          <div className="glass-card rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-white/5">
              <Tv2 className="w-4 h-4 text-indigo-400" />
              <h3 className="font-semibold text-white text-sm">Similar Channels</h3>
              <span className="ml-auto text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                {filteredSimilarChannels.length}
              </span>
            </div>

            {/* Category Tabs */}
            {similarCategories.length > 0 && (
              <div className="flex gap-1.5 px-3 py-2.5 overflow-x-auto scrollbar-hide border-b border-white/5">
                {similarCategories.map((cat) => {
                  const isActive = (selectedSimilarCategory ?? similarCategories[0]) === cat
                  const label = cat.startsWith('country:')
                    ? (getFlagEmoji(cat.replace('country:', '')) + ' ' + cat.replace('country:', '').toUpperCase())
                    : cat.charAt(0).toUpperCase() + cat.slice(1)
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedSimilarCategory(cat)}
                      className={
                        'flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ' +
                        (isActive
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200')
                      }
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Search */}
            <div className="px-3 py-2 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                <input
                  type="text"
                  value={similarSearch}
                  onChange={(e) => setSimilarSearch(e.target.value)}
                  placeholder="Search channels..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-8 py-1.5 text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                />
                {similarSearch && (
                  <button
                    onClick={() => setSimilarSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Channel List */}
            <div className="overflow-y-auto max-h-[360px] divide-y divide-white/5 custom-scrollbar">
              {filteredSimilarChannels.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                  <span className="text-3xl mb-2">📺</span>
                  <p className="text-sm text-gray-500">No channels found</p>
                </div>
              ) : (
                filteredSimilarChannels.map((ch) => (
                  <Link
                    key={ch.id}
                    href={`/watch/${ch.id}`}
                    scroll={false}
                    className={
                      'flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group ' +
                      (ch.id === channelId ? 'bg-indigo-600/10' : '')
                    }
                  >
                    {/* Logo */}
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {ch.logo ? (
                        <Image
                          src={ch.logo}
                          alt={ch.name}
                          width={40}
                          height={40}
                          className="object-contain p-0.5"
                          unoptimized
                        />
                      ) : (
                        <span className="text-base">{getFlagEmoji(ch.country)}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-300 truncate group-hover:text-white transition-colors leading-tight">
                        {ch.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {getFlagEmoji(ch.country)} {ch.country?.toUpperCase()}
                        {ch.categories && ch.categories.length > 0 && (
                          <span className="ml-1 capitalize text-gray-700">· {ch.categories[0]}</span>
                        )}
                      </p>
                    </div>

                    {/* Live dot */}
                    {streamMap.has(ch.id) ? (
                      <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 shadow-sm shadow-green-400/50" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-gray-700 flex-shrink-0" />
                    )}
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Quick Nav: Prev / Next */}
          <div className="glass-card rounded-2xl p-4 space-y-3">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <List className="w-4 h-4 text-indigo-400" />
              Quick Navigation
            </h3>
            {/* Prev */}
            {currentIndex > 0 && (
              <button
                onClick={goPrev}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 transition-all group text-left"
              >
                <SkipBack className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {liveChannels[currentIndex - 1]?.logo ? (
                    <Image src={liveChannels[currentIndex - 1].logo!} alt="" width={32} height={32} className="object-contain p-0.5" unoptimized />
                  ) : (
                    <span className="text-xs">{getFlagEmoji(liveChannels[currentIndex - 1]?.country || '')}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider">Previous</p>
                  <p className="text-xs text-gray-300 truncate font-medium">{liveChannels[currentIndex - 1]?.name}</p>
                </div>
              </button>
            )}
            {/* Next */}
            {currentIndex < liveChannels.length - 1 && (
              <button
                onClick={goNext}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 transition-all group text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider">Next</p>
                  <p className="text-xs text-gray-300 truncate font-medium">{liveChannels[currentIndex + 1]?.name}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {liveChannels[currentIndex + 1]?.logo ? (
                    <Image src={liveChannels[currentIndex + 1].logo!} alt="" width={32} height={32} className="object-contain p-0.5" unoptimized />
                  ) : (
                    <span className="text-xs">{getFlagEmoji(liveChannels[currentIndex + 1]?.country || '')}</span>
                  )}
                </div>
                <SkipForward className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
              </button>
            )}
            {/* Random */}
            <button
              onClick={goRandom}
              className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 hover:border-purple-500/40 transition-all group"
            >
              <Shuffle className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-300 font-medium">Random Channel</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
