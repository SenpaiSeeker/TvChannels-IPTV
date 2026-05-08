'use client'
import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Heart, Trash2, Download, Upload } from 'lucide-react'
import { useChannelStore } from '@/stores/channelStore'
import { useFavoritesStore } from '@/stores/favoritesStore'
import ChannelGrid from '@/components/channel/ChannelGrid'

export default function FavoritesPage() {
  const { channels, streams, fetchAll } = useChannelStore()
  const { favorites, clearFavorites, exportFavorites, importFavorites } = useFavoritesStore()

  useEffect(() => {
    fetchAll()
  }, [])

  const channelMap = useMemo(() => new Map(channels.map((c) => [c.id, c])), [channels])

  const favoriteChannels = useMemo(() => {
    return favorites
      .map((f) => channelMap.get(f.channelId))
      .filter(Boolean) as typeof channels
  }, [favorites, channelMap])

  const handleExport = () => {
    const data = exportFavorites()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'iptv-favorites.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const data = ev.target?.result as string
        importFavorites(data)
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Favorites</h1>
          </div>
          <p className="text-gray-500 ml-13">
            {favorites.length} saved channel{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition-all"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button
              onClick={clearFavorites}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg text-sm transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {favoriteChannels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-red-400/40" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No favorites yet</h2>
          <p className="text-gray-500 mb-6 max-w-sm">
            Start adding channels to your favorites by clicking the heart icon on any channel card.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
          >
            Browse Channels
          </Link>
        </div>
      ) : (
        <ChannelGrid channels={favoriteChannels} streams={streams} />
      )}
    </div>
  )
}
