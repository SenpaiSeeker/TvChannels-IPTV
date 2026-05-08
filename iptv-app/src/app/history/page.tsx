'use client'
import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { History, Trash2, Play, Clock } from 'lucide-react'
import { useChannelStore } from '@/stores/channelStore'
import { useHistoryStore } from '@/stores/historyStore'
import { getFlagEmoji, timeAgo } from '@/utils/format'
import { cn } from '@/utils/cn'

export default function HistoryPage() {
  const { channels, streams, fetchAll } = useChannelStore()
  const { history, removeHistory, clearHistory } = useHistoryStore()

  useEffect(() => {
    fetchAll()
  }, [])

  const channelMap = useMemo(() => new Map(channels.map((c) => [c.id, c])), [channels])
  const streamSet = useMemo(() => new Set(streams.map((s) => s.channel)), [streams])

  const historyWithChannels = useMemo(() => {
    return history
      .map((h) => ({ ...h, channel: channelMap.get(h.channelId) }))
      .filter((h) => h.channel)
  }, [history, channelMap])

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <History className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Watch History</h1>
          </div>
          <p className="text-gray-500">
            {history.length} channel{history.length !== 1 ? 's' : ''} watched
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg text-sm transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear History
          </button>
        )}
      </div>

      {historyWithChannels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
            <History className="w-10 h-10 text-blue-400/40" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No watch history</h2>
          <p className="text-gray-500 mb-6 max-w-sm">
            Channels you watch will appear here so you can easily find them again.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
          >
            Start Watching
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {historyWithChannels.map(({ channel, watchedAt, channelId }) => {
            if (!channel) return null
            const hasStream = streamSet.has(channelId)
            return (
              <div key={`${channelId}-${watchedAt}`} className="glass-card rounded-xl p-4 group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {channel.logo ? (
                      <Image
                        src={channel.logo}
                        alt={channel.name}
                        width={48}
                        height={48}
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <span className="text-xl">{getFlagEmoji(channel.country)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{channel.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-600" />
                      <span className="text-xs text-gray-500">{timeAgo(watchedAt)}</span>
                      <span className={cn('w-1.5 h-1.5 rounded-full', hasStream ? 'bg-green-400' : 'bg-gray-600')} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/watch/${channelId}`}
                      className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-indigo-400" />
                    </Link>
                    <button
                      onClick={() => removeHistory(channelId)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
