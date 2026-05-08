'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TrendingUp, Flame } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { ExtendedCategory } from '@/types'

interface CategorySidebarProps {
  categories: ExtendedCategory[]
}

export default function CategorySidebar({ categories }: CategorySidebarProps) {
  const pathname = usePathname()

  const trending = categories.filter((c) => c.trending).slice(0, 5)
  const all = [...categories].sort((a, b) => b.total_channels - a.total_channels)

  return (
    <aside className="w-56 flex-shrink-0 hidden xl:block">
      <div className="sticky top-24 space-y-6">
        {/* Trending */}
        {trending.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Trending</span>
            </div>
            <div className="space-y-1">
              {trending.map((cat) => {
                const isActive = pathname === `/category/${cat.slug}`
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all group',
                      isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )}
                    style={isActive ? { background: `${cat.color}18`, color: cat.color } : {}}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{cat.name}</p>
                      <p className="text-xs text-gray-600">{cat.active_channels} live</p>
                    </div>
                    <Flame className="w-3 h-3 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* All categories */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">All Categories</span>
          </div>
          <div className="space-y-0.5">
            {all.map((cat) => {
              const isActive = pathname === `/category/${cat.slug}`
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all',
                    isActive ? 'text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
                  )}
                  style={isActive ? { background: `${cat.color}18`, color: cat.color } : {}}
                >
                  <span>{cat.icon}</span>
                  <span className="flex-1 truncate">{cat.name}</span>
                  <span className="text-xs text-gray-600">{cat.total_channels}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}
