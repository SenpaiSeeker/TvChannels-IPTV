'use client'
import { create } from 'zustand'
import type { Channel, Stream } from '@/types'

interface PlayerState {
  currentChannel: Channel | null
  currentStream: Stream | null
  isPlaying: boolean
  isFullscreen: boolean
  isPiP: boolean
  isMiniPlayer: boolean
  volume: number
  muted: boolean
  error: string | null
  setChannel: (channel: Channel, stream: Stream) => void
  setPlaying: (playing: boolean) => void
  setFullscreen: (fullscreen: boolean) => void
  setPiP: (pip: boolean) => void
  setMiniPlayer: (mini: boolean) => void
  setVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
  setError: (error: string | null) => void
  clearPlayer: () => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentChannel: null,
  currentStream: null,
  isPlaying: false,
  isFullscreen: false,
  isPiP: false,
  isMiniPlayer: false,
  volume: 80,
  muted: false,
  error: null,

  setChannel: (channel, stream) => set({ currentChannel: channel, currentStream: stream, error: null }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setFullscreen: (isFullscreen) => set({ isFullscreen }),
  setPiP: (isPiP) => set({ isPiP }),
  setMiniPlayer: (isMiniPlayer) => set({ isMiniPlayer }),
  setVolume: (volume) => set({ volume }),
  setMuted: (muted) => set({ muted }),
  setError: (error) => set({ error }),
  clearPlayer: () => set({ currentChannel: null, currentStream: null, isPlaying: false, error: null }),
}))
