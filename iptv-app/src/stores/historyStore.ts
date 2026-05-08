'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { HistoryEntry } from '@/types'

interface HistoryState {
  history: HistoryEntry[]
  addHistory: (channelId: string) => void
  removeHistory: (channelId: string) => void
  clearHistory: () => void
  getRecent: (limit?: number) => HistoryEntry[]
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],

      addHistory: (channelId: string) => {
        set((state) => {
          const filtered = state.history.filter((h) => h.channelId !== channelId)
          return {
            history: [{ channelId, watchedAt: Date.now() }, ...filtered].slice(0, 100),
          }
        })
      },

      removeHistory: (channelId: string) => {
        set((state) => ({
          history: state.history.filter((h) => h.channelId !== channelId),
        }))
      },

      clearHistory: () => set({ history: [] }),

      getRecent: (limit = 20) => {
        return get().history.slice(0, limit)
      },
    }),
    { name: 'iptv-history' }
  )
)
