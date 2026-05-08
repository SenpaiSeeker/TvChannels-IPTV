'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FavoriteChannel } from '@/types'

interface FavoritesState {
  favorites: FavoriteChannel[]
  addFavorite: (channelId: string) => void
  removeFavorite: (channelId: string) => void
  isFavorite: (channelId: string) => boolean
  clearFavorites: () => void
  exportFavorites: () => string
  importFavorites: (data: string) => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (channelId: string) => {
        const existing = get().favorites.find((f) => f.channelId === channelId)
        if (!existing) {
          set((state) => ({
            favorites: [...state.favorites, { channelId, addedAt: Date.now() }],
          }))
        }
      },

      removeFavorite: (channelId: string) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.channelId !== channelId),
        }))
      },

      isFavorite: (channelId: string) => {
        return get().favorites.some((f) => f.channelId === channelId)
      },

      clearFavorites: () => set({ favorites: [] }),

      exportFavorites: () => {
        return JSON.stringify(get().favorites)
      },

      importFavorites: (data: string) => {
        try {
          const parsed = JSON.parse(data) as FavoriteChannel[]
          set({ favorites: parsed })
        } catch {
          console.error('Invalid favorites data')
        }
      },
    }),
    { name: 'iptv-favorites' }
  )
)
