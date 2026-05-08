'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  RefreshCw, AlertCircle, Loader2, PictureInPicture2,
  Settings, ChevronUp, ChevronDown
} from 'lucide-react'
import { cn } from '@/utils/cn'
import type { Stream } from '@/types'

interface VideoPlayerProps {
  stream: Stream
  channelName: string
  onError?: (err: string) => void
  className?: string
}

export default function VideoPlayer({ stream, channelName, onError, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hlsRef = useRef<unknown>(null)
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [volume, setVolume] = useState(80)
  const [muted, setMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  const initPlayer = useCallback(async () => {
    const video = videoRef.current
    if (!video || !stream.url) return

    setIsLoading(true)
    setError(null)

    // Destroy existing HLS instance
    if (hlsRef.current) {
      const hls = hlsRef.current as { destroy: () => void }
      hls.destroy()
      hlsRef.current = null
    }

    const url = stream.url
    const isHLS = url.includes('.m3u8') || url.includes('m3u8')

    try {
      if (isHLS) {
        const HlsModule = await import('hls.js')
        const Hls = HlsModule.default

        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
            maxBufferLength: 30,
            maxMaxBufferLength: 600,
            startLevel: -1,
          })

          hls.loadSource(url)
          hls.attachMedia(video)

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setIsLoading(false)
            video.play().catch(() => {})
          })

          hls.on(Hls.Events.ERROR, (_: unknown, data: { fatal: boolean; type: string }) => {
            if (data.fatal) {
              setError('Stream error. Retrying...')
              setIsLoading(false)
              setTimeout(() => {
                if (retryCount < 3) {
                  setRetryCount((c) => c + 1)
                  initPlayer()
                } else {
                  setError('Stream unavailable. Please try another channel.')
                }
              }, 3000)
            }
          })

          hlsRef.current = hls
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari native HLS
          video.src = url
          video.addEventListener('loadedmetadata', () => {
            setIsLoading(false)
            video.play().catch(() => {})
          })
        } else {
          setError('HLS not supported in this browser')
          setIsLoading(false)
        }
      } else {
        // Direct stream
        video.src = url
        video.addEventListener('canplay', () => {
          setIsLoading(false)
          video.play().catch(() => {})
        })
        video.addEventListener('error', () => {
          setError('Failed to load stream')
          setIsLoading(false)
        })
      }
    } catch (err) {
      setError('Failed to initialize player')
      setIsLoading(false)
    }
  }, [stream.url, retryCount])

  useEffect(() => {
    initPlayer()
    return () => {
      if (hlsRef.current) {
        const hls = hlsRef.current as { destroy: () => void }
        hls.destroy()
      }
    }
  }, [stream.url])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onWaiting = () => setIsLoading(true)
    const onPlaying = () => setIsLoading(false)

    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('waiting', onWaiting)
    video.addEventListener('playing', onPlaying)

    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('waiting', onWaiting)
      video.removeEventListener('playing', onPlaying)
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play()
    else video.pause()
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  const handleVolumeChange = (val: number) => {
    const video = videoRef.current
    if (!video) return
    video.volume = val / 100
    setVolume(val)
    if (val === 0) setMuted(true)
    else setMuted(false)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const togglePiP = async () => {
    const video = videoRef.current
    if (!video) return
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else {
        await video.requestPictureInPicture()
      }
    } catch {}
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000)
  }

  const handleRetry = () => {
    setRetryCount(0)
    initPlayer()
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-black rounded-xl overflow-hidden group',
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : '',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
      />

      {/* Loading overlay */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-3" />
          <p className="text-white text-sm">Loading stream...</p>
          <p className="text-gray-500 text-xs mt-1 truncate max-w-xs">{stream.url}</p>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
          <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
          <p className="text-white text-sm font-medium mb-1">{error}</p>
          <p className="text-gray-500 text-xs mb-4">Stream may be offline or geo-restricted</p>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}

      {/* Controls */}
      <div
        className={cn(
          'absolute inset-0 flex flex-col justify-end transition-opacity duration-300',
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Top bar */}
        <div className="relative flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full live-badge font-bold">
              ● LIVE
            </span>
            <span className="text-white text-sm font-semibold">{channelName}</span>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="relative flex items-center gap-3 px-4 pb-4">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white fill-white" />
            ) : (
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            )}
          </button>

          {/* Volume */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              {muted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>
            {showVolumeSlider && (
              <div
                className="absolute bottom-10 left-0 bg-black/80 rounded-lg p-2 flex flex-col items-center gap-1"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <ChevronUp
                  className="w-4 h-4 text-white cursor-pointer"
                  onClick={() => handleVolumeChange(Math.min(100, volume + 10))}
                />
                <span className="text-white text-xs">{volume}%</span>
                <ChevronDown
                  className="w-4 h-4 text-white cursor-pointer"
                  onClick={() => handleVolumeChange(Math.max(0, volume - 10))}
                />
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* PiP */}
          <button
            onClick={togglePiP}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            title="Picture in Picture"
          >
            <PictureInPicture2 className="w-4 h-4 text-white" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 text-white" />
            ) : (
              <Maximize className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Click to play/pause */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={togglePlay}
        style={{ zIndex: 1 }}
      />
      {/* Controls need higher z-index */}
      <style>{`.absolute.inset-0.flex.flex-col.justify-end { z-index: 2; }`}</style>
    </div>
  )
}
