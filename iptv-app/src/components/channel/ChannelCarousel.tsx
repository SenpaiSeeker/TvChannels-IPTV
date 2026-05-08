'use client'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import ChannelCard from './ChannelCard'
import type { Channel, Stream } from '@/types'

interface ChannelCarouselProps {
  title: string
  channels: Channel[]
  streams?: Stream[]
  icon?: React.ReactNode
  viewAllHref?: string
}

export default function ChannelCarousel({
  title,
  channels,
  streams = [],
  icon,
  viewAllHref,
}: ChannelCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 400
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  const streamMap = new Map(streams.map((s) => [s.channel, s]))

  if (channels.length === 0) return null

  return (
    <section className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          {icon && <span className="text-indigo-400">{icon}</span>}
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
            {channels.length}
          </span>
        </div>
        {viewAllHref && (
          <a
            href={viewAllHref}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View all →
          </a>
        )}
      </div>

      {/* Carousel */}
      <div className="relative group">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-indigo-500/50"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto carousel-container pb-2"
        >
          {channels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              stream={streamMap.get(channel.id)}
            />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-indigo-500/50"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>

        {/* Gradient fades */}
        <div className="absolute left-0 top-0 bottom-2 w-8 gradient-left pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-2 w-8 gradient-right pointer-events-none" />
      </div>
    </section>
  )
}
