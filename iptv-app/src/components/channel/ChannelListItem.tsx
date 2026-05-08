'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { getFlagEmoji } from '@/utils/format'
import { useFavoritesStore } from '@/stores/favoritesStore'
import LiveBadge from './LiveBadge'
import QualityBadge from './QualityBadge'
import type { Channel, Stream } from '@/types'

interface ChannelListItemProps {
  channel: Channel
  stream?: Stream
  index?: number
}

export default function ChannelListItem({ channel, stream, index = 0 }: ChannelListItemProps) {
  const [imgError, setImgError] = useState(false)
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore()
  const favorite = isFavorite(channel.id)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (favorite) removeFavorite(channel.id)
    else addFavorite(channel.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.3) }}
    >
      <Link href={`/watch/${channel.id}`}>
        <div className="flex items-center gap-4 px-4 py-3 rounded-xl glass-card border border-white/5 hover:border-indigo-500/30 hover:bg-white/5 transition-all group cursor-pointer">
          {/* Logo */}
          <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden border border-white/5">
            {channel.logo && !imgError ? (
              <Image
                src={channel.logo}
                alt={channel.name}
                width={40}
                height={40}
                className="object-contain w-full h-full p-1"
                onError={() => setImgError(true)}
                unoptimized
              />
            ) : (
              <span className="text-xl">{getFlagEmoji(channel.country)}</span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                {channel.name}
              </p>
              <LiveBadge live={!!stream} />
              <QualityBadge stream={stream} />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{getFlagEmoji(channel.country)} {channel.country?.toUpperCase()}</span>
              {channel.languages && channel.languages.length > 0 && (
                <>
                  <span>·</span>
                  <span>{channel.languages.slice(0, 2).join(', ')}</span>
                </>
              )}
              {channel.categories && channel.categories.length > 0 && (
                <>
                  <span>·</span>
                  <span className="capitalize">{channel.categories.slice(0, 2).join(', ')}</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={toggleFavorite}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <Heart
                className={cn('w-3.5 h-3.5', favorite ? 'fill-red-500 text-red-500' : 'text-gray-400')}
              />
            </button>
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:bg-indigo-600/40">
              <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400 ml-0.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
