export interface Channel {
  id: string
  name: string
  alt_names?: string[]
  network?: string
  owners?: string[]
  country: string
  subdivision?: string
  city?: string
  broadcast_area?: string[]
  languages?: string[]
  categories?: string[]
  is_nsfw?: boolean
  launched?: string
  closed?: string
  replaced_by?: string
  website?: string
  logo?: string
}

export interface Stream {
  channel: string
  url: string
  http_referrer?: string
  user_agent?: string
  quality?: string
  resolution?: {
    width: number
    height: number
  }
  status?: string
  timeshift?: string
  guide_id?: string[]
}

export interface Category {
  id: string
  name: string
}

export interface ExtendedCategory {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  gradient: string
  description: string
  total_channels: number
  active_channels: number
  trending?: boolean
  featured?: boolean
  subcategories?: string[]
}

export interface CategoryFilters {
  query: string
  countries: string[]
  languages: string[]
  hdOnly: boolean
  activeOnly: boolean
  nsfw: boolean
  sortBy: 'name' | 'country' | 'active' | 'quality'
  sortDir: 'asc' | 'desc'
}

export interface CategoryStore {
  categories: ExtendedCategory[]
  selectedCategory: string | null
  channels: Channel[]
  loading: boolean
  filters: CategoryFilters
  page: number
  hasMore: boolean
}

export interface Country {
  code: string
  name: string
  languages?: string[]
  flag?: string
}

export interface Language {
  code: string
  name: string
}

export interface Guide {
  channel: string
  site: string
  site_id: string
  site_name: string
  lang: string
  url: string
}

export interface EPGProgram {
  title: string
  description?: string
  start: string
  stop: string
  channel: string
  image?: string
  category?: string
}

export interface FavoriteChannel {
  channelId: string
  addedAt: number
}

export interface HistoryEntry {
  channelId: string
  watchedAt: number
  duration?: number
}

export interface PlayerSettings {
  engine: 'hlsjs' | 'native' | 'videojs'
  quality: 'auto' | 'hd' | 'sd'
  autoplay: boolean
  volume: number
  muted: boolean
}

export interface AppSettings {
  theme: 'dark' | 'light'
  language: string
  player: PlayerSettings
  enableNSFW: boolean
  enableAnalytics: boolean
}

export interface SearchFilters {
  query: string
  countries: string[]
  categories: string[]
  languages: string[]
  quality: string[]
  httpsOnly: boolean
  activeOnly: boolean
}

export interface ChannelWithStream extends Channel {
  stream?: Stream
}
