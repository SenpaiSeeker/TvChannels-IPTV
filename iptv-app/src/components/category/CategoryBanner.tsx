'use client'
import { motion } from 'framer-motion'
import { Flame, Wifi, TrendingUp } from 'lucide-react'
import type { ExtendedCategory } from '@/types'

interface CategoryBannerProps {
  category: ExtendedCategory
}

export default function CategoryBanner({ category }: CategoryBannerProps) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-8" style={{ minHeight: 220 }}>
      {/* Animated gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 20% 50%, ${category.color}33 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, ${category.color}22 0%, transparent 50%), #0a0a0f`,
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${category.color}88 1px, transparent 1px), linear-gradient(90deg, ${category.color}88 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-10 -left-10 w-64 h-64 rounded-full blur-3xl"
        style={{ background: category.color }}
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-10 right-20 w-48 h-48 rounded-full blur-3xl"
        style={{ background: category.color }}
      />

      {/* Border glow */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{ boxShadow: `inset 0 0 0 1px ${category.color}33` }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 p-6 md:p-10">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-5xl md:text-6xl"
          style={{
            background: `${category.color}22`,
            border: `1px solid ${category.color}44`,
            boxShadow: `0 0 30px ${category.color}33`,
          }}
        >
          {category.icon}
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1 min-w-0"
        >
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{category.name}</h1>
            {category.trending && (
              <span
                className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: `${category.color}22`, color: category.color, border: `1px solid ${category.color}44` }}
              >
                <TrendingUp className="w-3 h-3" />
                TRENDING
              </span>
            )}
            {category.featured && (
              <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Flame className="w-3 h-3" />
                FEATURED
              </span>
            )}
          </div>

          <p className="text-gray-400 text-sm md:text-base mb-4 max-w-2xl leading-relaxed">
            {category.description}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-500" />
              <span className="text-gray-400 text-sm">
                <span className="text-white font-semibold">{category.total_channels.toLocaleString()}</span> total channels
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-gray-400 text-sm">
                <span className="text-green-400 font-semibold">{category.active_channels.toLocaleString()}</span> live now
              </span>
            </div>
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {category.subcategories.slice(0, 4).map((sub) => (
                  <span
                    key={sub}
                    className="text-xs px-2 py-0.5 rounded-full text-gray-400"
                    style={{ background: `${category.color}15`, border: `1px solid ${category.color}25` }}
                  >
                    {sub}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="hidden md:flex flex-col items-center gap-2 flex-shrink-0"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: `${category.color}22`, border: `2px solid ${category.color}55` }}
          >
            <Wifi className="w-6 h-6" style={{ color: category.color }} />
          </div>
          <span className="text-xs text-gray-500">Live Streams</span>
        </motion.div>
      </div>
    </div>
  )
}
