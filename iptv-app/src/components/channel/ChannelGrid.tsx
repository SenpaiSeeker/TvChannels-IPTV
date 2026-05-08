'use client'
import ChannelCard from './ChannelCard'
import type { Channel, Stream } from '@/types'

interface ChannelGridProps {
  channels: Channel[]
  streams?: Stream[]
  emptyMessage?: string
}

export default function ChannelGrid({ channels, streams = [], emptyMessage = 'No channels found' }: ChannelGridProps) {
  const streamMap = new Map(streams.map((s) => [s.channel, s]))

  if (channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <span className="text-3xl">📺</span>
        </div>
        <p className="text-gray-400 text-lg font-medium">{emptyMessage}</p>
        <p className="text-gray-600 text-sm mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
      {channels.map((channel) => (
        <ChannelCard
          key={channel.id}
          channel={channel}
          stream={streamMap.get(channel.id)}
          size="md"
        />
      ))}
    </div>
  )
}
