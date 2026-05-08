'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { CATEGORY_META } from '@/stores/categoryStore'
import type { ExtendedCategory } from '@/types'

interface CategoryTabsProps {
  categories: ExtendedCategory[]
}

export default function CategoryTabs({ categories }: CategoryTabsProps) {
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)

  const sorted = [...categories].sort((a, b) => b.active_channels - a.active_channels)

  return (
    <div className="relative mb-6">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 carousel-container"
      >
        {sorted.map((cat) => {
          const isActive = pathname === `/category/${cat.slug}`
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={cn(
                'flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 relative',
                isActive
                  ? 'text-white border-transparent'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/8 hover:border-white/20'
              )}
              style={isActive ? { background: `${cat.color}22`, borderColor: `${cat.color}55`, color: cat.color } : {}}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.name}</span>
              {cat.active_channels > 0 && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                  style={
                    isActive
                      ? { background: `${cat.color}33`, color: cat.color }
                      : { background: 'rgba(255,255,255,0.08)', color: '#9ca3af' }
                  }
                >
                  {cat.active_channels}
                </span>
              )}
              {cat.trending && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </Link>
          )
        })}
      </div>
      {/* Gradient fade right */}
      <div className="absolute right-0 top-0 bottom-2 w-12 gradient-right pointer-events-none" />
    </div>
  )
}
