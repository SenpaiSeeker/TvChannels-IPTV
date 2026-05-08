'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Heart, History, Settings, Tv, Menu, X, Radio, ChevronDown, LayoutGrid } from 'lucide-react'
import { cn } from '@/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORY_META } from '@/stores/categoryStore'

const navLinks = [
  { href: '/', label: 'Home', icon: Tv },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/live-guide', label: 'Live Guide', icon: Radio },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/history', label: 'History', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const FEATURED_CATEGORIES = [
  'news', 'sports', 'movies', 'entertainment', 'music', 'kids', 'documentary', 'animation',
  'religious', 'education', 'lifestyle', 'business',
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [catOpen, setCatOpen] = useState(false)
  const catRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const isCategoryActive = pathname.startsWith('/category')

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass border-b border-white/5' : 'bg-transparent'
      )}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center neon-glow">
              <Tv className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              IPTV<span className="text-indigo-400">Stream</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === href
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}

            {/* Categories dropdown */}
            <div ref={catRef} className="relative">
              <button
                onClick={() => setCatOpen(!catOpen)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isCategoryActive || catOpen
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <LayoutGrid className="w-4 h-4" />
                Categories
                <ChevronDown className={cn('w-3 h-3 transition-transform', catOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-72 glass border border-white/10 rounded-2xl p-3 shadow-2xl"
                    style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
                  >
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider px-2 mb-2">
                      Browse Categories
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {FEATURED_CATEGORIES.map((id) => {
                        const meta = CATEGORY_META[id]
                        if (!meta) return null
                        const isActive = pathname === `/category/${meta.slug}`
                        return (
                          <Link
                            key={id}
                            href={`/category/${meta.slug}`}
                            onClick={() => setCatOpen(false)}
                            className={cn(
                              'flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all',
                              isActive
                                ? 'text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            )}
                            style={isActive ? { background: `${meta.color}18`, color: meta.color } : {}}
                          >
                            <span className="text-base">{meta.icon}</span>
                            <span className="font-medium">{meta.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <Link
                        href="/search"
                        onClick={() => setCatOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs text-indigo-400 hover:bg-indigo-600/10 transition-all"
                      >
                        View all channels →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search channels..."
                className="w-56 pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/8 transition-all"
              />
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/5"
          >
            <div className="px-4 py-3 space-y-1">
              <form onSubmit={handleSearch} className="mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search channels..."
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </form>
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    pathname === href
                      ? 'bg-indigo-600/20 text-indigo-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}

              {/* Mobile categories section */}
              <div className="pt-2 border-t border-white/5">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider px-3 mb-2">Categories</p>
                <div className="grid grid-cols-3 gap-1">
                  {FEATURED_CATEGORIES.map((id) => {
                    const meta = CATEGORY_META[id]
                    if (!meta) return null
                    return (
                      <Link
                        key={id}
                        href={`/category/${meta.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-xs transition-all',
                          pathname === `/category/${meta.slug}`
                            ? 'text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        )}
                        style={pathname === `/category/${meta.slug}` ? { background: `${meta.color}18`, color: meta.color } : {}}
                      >
                        <span className="text-xl">{meta.icon}</span>
                        <span className="font-medium">{meta.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
