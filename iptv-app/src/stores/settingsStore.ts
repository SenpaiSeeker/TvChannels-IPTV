'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppSettings } from '@/types'

interface SettingsState extends AppSettings {
  updateSettings: (settings: Partial<AppSettings>) => void
  resetSettings: () => void
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  language: 'en',
  player: {
    engine: 'hlsjs',
    quality: 'auto',
    autoplay: true,
    volume: 80,
    muted: false,
  },
  enableNSFW: false,
  enableAnalytics: true,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
      resetSettings: () => set(defaultSettings),
    }),
    { name: 'iptv-settings' }
  )
)
