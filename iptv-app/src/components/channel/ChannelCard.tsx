'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Play, Wifi, WifiOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { getFlagEmoji } from '@/utils/format'
import { useFavoritesStore } from '@/stores/favoritesStore'
import type { Channel, Stream } from '@/types'

interface ChannelCardProps {
  channel: Channel
  stream?: Stream
  size?: 'sm' | 'md' | 'lg'
  showFavorite?: boolean
}

export default function ChannelCard({ channel, stream, size = 'md', showFavorite = true }: ChannelCardProps) {
  const [imgError, setImgError] = useState(false)
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore()
  const favorite = isFavorite(channel.id)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (favorite) removeFavorite(channel.id)
    else addFavorite(channel.id)
  }

  const sizeClasses = {
    sm: 'w-36 h-24',
    md: 'w-44 h-28',
    lg: 'w-56 h-36',
  }

  const logoSize = {
    sm: 40,
    md: 48,
    lg: 64,
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="channel-card flex-shrink-0"
    >
      <Link href={`/watch/${channel.id}`} className="block">
        <div
          className={cn(
            'relative rounded-xl overflow-hidden glass-card border border-white/5 cursor-pointer group',
            sizeClasses[size]
          )}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/10" />

          {/* Logo */}
          <div className="absolute inset-0 flex items-center justify-center p-3">
            {channel.logo && !imgError ? (
              <Image
                src={channel.logo}
                alt={channel.name}
                width={logoSize[size]}
                height={logoSize[size]}
                className="object-contain max-w-full max-h-full"
                onError={() => setImgError(true)}
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-lg bg-indigo-600/30 flex items-center justify-center">
                  <span className="text-lg">{getFlagEmoji(channel.country)}</span>
                </div>
                <span className="text-xs text-gray-400 text-center line-clamp-2 font-medium">
                  {channel.name}
                </span>
              </div>
            )}
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
          </div>

          {/* Stream status */}
          <div className="absolute top-2 left-2">
            {stream ? (
              <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded-full">
                <Wifi className="w-2.5 h-2.5" />
                LIVE
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400/60 border border-red-500/20 px-1.5 py-0.5 rounded-full">
                <WifiOff className="w-2.5 h-2.5" />
                OFF
              </span>
            )}
          </div>

          {/* Favorite button */}
          {showFavorite && (
            <button
              onClick={toggleFavorite}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <Heart
                className={cn('w-3 h-3', favorite ? 'fill-red-500 text-red-500' : 'text-white')}
              />
            </button>
          )}
        </div>

        {/* Channel name */}
        <div className="mt-2 px-1">
          <p className="text-xs font-medium text-gray-300 truncate">{channel.name}</p>
          <p className="text-xs text-gray-600 truncate">
            {getFlagEmoji(channel.country)} {channel.country?.toUpperCase()}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
