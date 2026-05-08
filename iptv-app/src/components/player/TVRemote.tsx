'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  List, Hash, Tv, Volume2, VolumeX, Maximize,
  SkipBack, SkipForward, Home, Search, Heart,
  Shuffle, RotateCcw, Wifi, WifiOff
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { getFlagEmoji } from '@/utils/format'
import { useFavoritesStore } from '@/stores/favoritesStore'
import type { Channel, Stream } from '@/types'

interface TVRemoteProps {
  currentChannel: Channel
  allChannels: Channel[]
  streamMap: Map<string, Stream>
  onChannelChange: (channel: Channel) => void
  volume?: number
  muted?: boolean
  onVolumeChange?: (v: number) => void
  onMuteToggle?: () => void
  onFullscreen?: () => void
}

export default function TVRemote({
  currentChannel,
  allChannels,
  streamMap,
  onChannelChange,
  volume = 80,
  muted = false,
  onVolumeChange,
  onMuteToggle,
  onFullscreen,
}: TVRemoteProps) {
  const router = useRouter()
  const { isFavorite } = useFavoritesStore()

  // Channels with streams only (live channels)
  const liveChannels = allChannels.filter((c) => streamMap.has(c.id))

  const currentIndex = liveChannels.findIndex((c) => c.id === currentChannel.id)

  const [showChannelList, setShowChannelList] = useState(false)
  const [showOSD, setShowOSD] = useState(false)
  const [osdChannel, setOsdChannel] = useState<Channel | null>(null)
  const [channelInput, setChannelInput] = useState('')
  const [showNumberInput, setShowNumberInput] = useState(false)
  const osdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const showOSDFor = useCallback((ch: Channel) => {
    setOsdChannel(ch)
    setShowOSD(true)
    if (osdTimerRef.current) clearTimeout(osdTimerRef.current)
    osdTimerRef.current = setTimeout(() => setShowOSD(false), 3000)
  }, [])

  const goToChannel = useCallback((ch: Channel) => {
    showOSDFor(ch)
    onChannelChange(ch)
  }, [onChannelChange, showOSDFor])

  const goPrev = useCallback(() => {
    if (liveChannels.length === 0) return
    const idx = currentIndex <= 0 ? liveChannels.length - 1 : currentIndex - 1
    goToChannel(liveChannels[idx])
  }, [liveChannels, currentIndex, goToChannel])

  const goNext = useCallback(() => {
    if (liveChannels.length === 0) return
    const idx = currentIndex >= liveChannels.length - 1 ? 0 : currentIndex + 1
    goToChannel(liveChannels[idx])
  }, [liveChannels, currentIndex, goToChannel])

  const goRandom = useCallback(() => {
    if (liveChannels.length === 0) return
    let idx = Math.floor(Math.random() * liveChannels.length)
    if (idx === currentIndex) idx = (idx + 1) % liveChannels.length
    goToChannel(liveChannels[idx])
  }, [liveChannels, currentIndex, goToChannel])

  // Number input for channel switching (like real TV)
  const handleNumberKey = useCallback((digit: string) => {
    const next = channelInput + digit
    setChannelInput(next)
    setShowNumberInput(true)
    if (inputTimerRef.current) clearTimeout(inputTimerRef.current)
    inputTimerRef.current = setTimeout(() => {
      const num = parseInt(next, 10)
      if (num >= 1 && num <= liveChannels.length) {
        goToChannel(liveChannels[num - 1])
      }
      setChannelInput('')
      setShowNumberInput(false)
    }, 1500)
  }, [channelInput, liveChannels, goToChannel])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      switch (e.key) {
        case 'ArrowLeft':
        case 'PageDown':
          e.preventDefault()
          goPrev()
          break
        case 'ArrowRight':
        case 'PageUp':
          e.preventDefault()
          goNext()
          break
        case 'ArrowUp':
          e.preventDefault()
          onVolumeChange?.(Math.min(100, volume + 5))
          break
        case 'ArrowDown':
          e.preventDefault()
          onVolumeChange?.(Math.max(0, volume - 5))
          break
        case 'm':
        case 'M':
          onMuteToggle?.()
          break
        case 'f':
        case 'F':
          onFullscreen?.()
          break
        case 'l':
        case 'L':
          setShowChannelList((v) => !v)
          break
        case 'r':
        case 'R':
          goRandom()
          break
        default:
          if (e.key >= '0' && e.key <= '9') {
            handleNumberKey(e.key)
          }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goPrev, goNext, goRandom, handleNumberKey, volume, onVolumeChange, onMuteToggle, onFullscreen])

  // Scroll active channel into view in list
  useEffect(() => {
    if (showChannelList && listRef.current) {
      const active = listRef.current.querySelector('[data-active="true"]')
      active?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [showChannelList, currentChannel.id])

  const prevChannel = currentIndex > 0 ? liveChannels[currentIndex - 1] : liveChannels[liveChannels.length - 1]
  const nextChannel = currentIndex < liveChannels.length - 1 ? liveChannels[currentIndex + 1] : liveChannels[0]

  return (
    <>
      {/* ── OSD (On-Screen Display) overlay ── */}
      <AnimatePresence>
        {showOSD && osdChannel && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="flex items-center gap-4 bg-black/90 border border-white/10 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-2xl min-w-[320px]">
              {/* Channel number */}
              <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-300 font-bold text-lg">
                  {(liveChannels.findIndex((c) => c.id === osdChannel.id) + 1).toString().padStart(2, '0')}
                </span>
              </div>
              {/* Logo */}
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                {osdChannel.logo ? (
                  <Image src={osdChannel.logo} alt={osdChannel.name} width={48} height={48} className="object-contain p-1" unoptimized />
                ) : (
                  <span className="text-xl">{getFlagEmoji(osdChannel.country)}</span>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base truncate">{osdChannel.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-gray-400 text-xs">{getFlagEmoji(osdChannel.country)} {osdChannel.country?.toUpperCase()}</span>
                  {streamMap.has(osdChannel.id) && (
                    <span className="flex items-center gap-1 text-[10px] text-green-400 font-bold">
                      <Wifi className="w-2.5 h-2.5" /> LIVE
                    </span>
                  )}
                  {isFavorite(osdChannel.id) && (
                    <span className="text-[10px] text-red-400">♥ Fav</span>
                  )}
                </div>
                {osdChannel.categories && osdChannel.categories.length > 0 && (
                  <p className="text-gray-600 text-xs mt-0.5 capitalize">{osdChannel.categories.slice(0, 2).join(' · ')}</p>
                )}
              </div>
              {/* Live indicator */}
              <div className="flex-shrink-0">
                <span className="flex items-center gap-1 text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                  ● LIVE
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Channel Number Input OSD ── */}
      <AnimatePresence>
        {showNumberInput && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            <div className="bg-black/90 border border-indigo-500/40 backdrop-blur-xl rounded-2xl px-10 py-8 text-center shadow-2xl">
              <p className="text-gray-500 text-xs mb-2 uppercase tracking-widest">Channel</p>
              <p className="text-white font-bold text-6xl tracking-widest font-mono">{channelInput || '—'}</p>
              <p className="text-gray-600 text-xs mt-2">of {liveChannels.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main TV Remote Bar ── */}
      <div className="w-full glass-card rounded-2xl border border-white/10 p-4 mt-4">
        <div className="flex flex-col gap-3">
          {/* Top row: prev/next channel preview + controls */}
          <div className="flex items-center gap-3">
            {/* Prev channel preview */}
            <button
              onClick={goPrev}
              className="flex items-center gap-2 flex-1 min-w-0 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 transition-all group"
              title="Previous Channel (← Arrow)"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                {prevChannel?.logo ? (
                  <Image src={prevChannel.logo} alt={prevChannel.name} width={32} height={32} className="object-contain p-0.5" unoptimized />
                ) : (
                  <span className="text-xs">{getFlagEmoji(prevChannel?.country || '')}</span>
                )}
              </div>
              <div className="flex-1 min-w-0 text-left hidden sm:block">
                <p className="text-xs text-gray-500">Previous</p>
                <p className="text-xs text-gray-300 truncate font-medium">{prevChannel?.name}</p>
              </div>
            </button>

            {/* Center controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Channel number display */}
              <div className="hidden md:flex flex-col items-center px-3 py-1.5 rounded-xl bg-indigo-600/10 border border-indigo-500/20">
                <span className="text-[10px] text-indigo-400 uppercase tracking-wider">CH</span>
                <span className="text-white font-bold text-sm font-mono">
                  {currentIndex >= 0 ? String(currentIndex + 1).padStart(2, '0') : '--'}
                </span>
              </div>

              {/* Random */}
              <button
                onClick={goRandom}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-purple-500/20 border border-white/5 hover:border-purple-500/30 flex items-center justify-center transition-all group"
                title="Random Channel (R)"
              >
                <Shuffle className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
              </button>

              {/* Channel List toggle */}
              <button
                onClick={() => setShowChannelList((v) => !v)}
                className={cn(
                  'w-9 h-9 rounded-xl border flex items-center justify-center transition-all group',
                  showChannelList
                    ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-400'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-indigo-500/30 text-gray-400 hover:text-indigo-400'
                )}
                title="Channel List (L)"
              >
                <List className="w-4 h-4 transition-colors" />
              </button>
            </div>

            {/* Next channel preview */}
            <button
              onClick={goNext}
              className="flex items-center gap-2 flex-1 min-w-0 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 transition-all group justify-end"
              title="Next Channel (→ Arrow)"
            >
              <div className="flex-1 min-w-0 text-right hidden sm:block">
                <p className="text-xs text-gray-500">Next</p>
                <p className="text-xs text-gray-300 truncate font-medium">{nextChannel?.name}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                {nextChannel?.logo ? (
                  <Image src={nextChannel.logo} alt={nextChannel.name} width={32} height={32} className="object-contain p-0.5" unoptimized />
                ) : (
                  <span className="text-xs">{getFlagEmoji(nextChannel?.country || '')}</span>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
            </button>
          </div>

          {/* Bottom row: volume + number pad + shortcuts */}
          <div className="flex items-center gap-3">
            {/* Volume controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={onMuteToggle}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all"
                title="Mute (M)"
              >
                {muted || volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onVolumeChange?.(Math.max(0, volume - 10))}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all text-xs font-bold"
                  title="Volume Down (↓)"
                >
                  −
                </button>
                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${muted ? 0 : volume}%` }}
                  />
                </div>
                <button
                  onClick={() => onVolumeChange?.(Math.min(100, volume + 10))}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all text-xs font-bold"
                  title="Volume Up (↑)"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex-1" />

            {/* Number pad */}
            <div className="hidden lg:flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                <button
                  key={n}
                  onClick={() => handleNumberKey(String(n))}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-indigo-600/20 border border-white/5 hover:border-indigo-500/30 flex items-center justify-center text-gray-400 hover:text-indigo-300 transition-all text-xs font-mono font-bold"
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="hidden xl:flex items-center gap-2 text-[10px] text-gray-700">
              <span className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5">←→ CH</span>
              <span className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5">↑↓ VOL</span>
              <span className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5">L List</span>
              <span className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5">R Random</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Channel List Panel ── */}
      <AnimatePresence>
        {showChannelList && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mt-3"
          >
            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-semibold text-white">Channel List</span>
                  <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">{liveChannels.length} live</span>
                </div>
                <button
                  onClick={() => setShowChannelList(false)}
                  className="text-gray-600 hover:text-white transition-colors text-xs"
                >
                  ✕ Close
                </button>
              </div>

              {/* Channel grid */}
              <div
                ref={listRef}
                className="max-h-72 overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 custom-scrollbar"
              >
                {liveChannels.map((ch, idx) => {
                  const isActive = ch.id === currentChannel.id
                  return (
                    <button
                      key={ch.id}
                      data-active={isActive}
                      onClick={() => {
                        goToChannel(ch)
                        setShowChannelList(false)
                      }}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all group',
                        isActive
                          ? 'bg-indigo-600/25 border border-indigo-500/40 text-white'
                          : 'hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-400 hover:text-white'
                      )}
                    >
                      {/* Channel number */}
                      <span className={cn(
                        'text-[10px] font-mono font-bold w-6 flex-shrink-0 text-center',
                        isActive ? 'text-indigo-400' : 'text-gray-700'
                      )}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {/* Logo */}
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {ch.logo ? (
                          <Image src={ch.logo} alt={ch.name} width={28} height={28} className="object-contain p-0.5" unoptimized />
                        ) : (
                          <span className="text-xs">{getFlagEmoji(ch.country)}</span>
                        )}
                      </div>
                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{ch.name}</p>
                        <p className="text-[10px] text-gray-700 truncate">{ch.country?.toUpperCase()}</p>
                      </div>
                      {/* Live dot */}
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
