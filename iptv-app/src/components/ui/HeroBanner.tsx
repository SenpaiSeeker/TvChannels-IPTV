'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Info, Wifi } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getFlagEmoji } from '@/utils/format'
import type { Channel } from '@/types'

interface HeroBannerProps {
  channels: Channel[]
}

export default function HeroBanner({ channels }: HeroBannerProps) {
  const [current, setCurrent] = useState(0)
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (channels.length === 0) return
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % Math.min(channels.length, 8))
    }, 5000)
    return () => clearInterval(timer)
  }, [channels.length])

  if (channels.length === 0) return null

  const channel = channels[Math.min(current, channels.length - 1)]

  return (
    <div className="relative w-full h-[420px] md:h-[520px] rounded-2xl overflow-hidden mb-8">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/60 to-black" />

          {/* Channel logo as background */}
          {channel.logo && !imgErrors.has(current) && (
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <Image
                src={channel.logo}
                alt={channel.name}
                width={400}
                height={400}
                className="object-contain"
                onError={() => setImgErrors((s) => new Set([...s, current]))}
                unoptimized
              />
            </div>
          )}

          {/* Animated grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {/* Live badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1.5 text-xs bg-red-500 text-white px-2.5 py-1 rounded-full font-bold live-badge">
                <Wifi className="w-3 h-3" />
                LIVE
              </span>
              <span className="text-xs text-gray-400">
                {getFlagEmoji(channel.country)} {channel.country?.toUpperCase()}
              </span>
              {channel.categories && channel.categories[0] && (
                <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full capitalize">
                  {channel.categories[0]}
                </span>
              )}
            </div>

            {/* Channel logo */}
            {channel.logo && !imgErrors.has(current) ? (
              <div className="mb-3">
                <Image
                  src={channel.logo}
                  alt={channel.name}
                  width={80}
                  height={80}
                  className="object-contain rounded-xl"
                  onError={() => setImgErrors((s) => new Set([...s, current]))}
                  unoptimized
                />
              </div>
            ) : null}

            {/* Channel name */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              {channel.name}
            </h1>

            {/* Meta */}
            <p className="text-gray-400 text-sm mb-6 max-w-lg">
              {channel.languages?.join(', ')} •{' '}
              {channel.broadcast_area?.slice(0, 2).join(', ') || 'Global'}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link
                href={`/watch/${channel.id}`}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all neon-glow hover:scale-105"
              >
                <Play className="w-4 h-4 fill-white" />
                Watch Now
              </Link>
              <Link
                href={`/watch/${channel.id}`}
                className="flex items-center gap-2 px-5 py-3 glass border border-white/10 hover:border-indigo-500/50 text-white font-medium rounded-xl transition-all"
              >
                <Info className="w-4 h-4" />
                Details
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 right-6 flex gap-1.5">
        {Array.from({ length: Math.min(channels.length, 8) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === current ? 'bg-indigo-400 w-4' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
