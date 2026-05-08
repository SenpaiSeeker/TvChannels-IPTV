# PRD — IPTV Streaming Web Application

**Platform:** Vercel / GitHub Pages Compatible
**Data Source:** [iptv-org.github.io](https://iptv-org.github.io/?utm_source=chatgpt.com)
**Project Type:** Fullstack Web IPTV Application
**Target:** Modern IPTV streaming platform with advanced filtering, EPG, search, categories, favorites, playback analytics, adaptive player, and multi-device support.

---

# 1. Product Overview

Membangun aplikasi IPTV modern berbasis web menggunakan data publik dari proyek IPTV-org yang menyediakan ribuan channel TV global melalui format JSON, M3U, dan API metadata.

Aplikasi harus:

* Modern
* Cepat
* Responsive
* Mudah di deploy di Vercel/GitHub Pages
* Mendukung Smart TV style UI
* Support Desktop + Mobile + Tablet
* Mendukung HLS/DASH/MPEGTS playback
* Mendukung pencarian channel realtime
* Mendukung favorites & history
* Mendukung live EPG
* Mendukung multiple players
* Support multi language
* Support PWA offline caching

---

# 2. Goals

## Primary Goals

* Streaming TV global gratis
* Menampilkan channel dengan metadata lengkap
* Menyediakan UX seperti Netflix + Smart TV
* Playback stabil
* Support ribuan channel

## Secondary Goals

* PWA installable
* Chromecast support
* Picture-in-picture
* Keyboard shortcuts
* Theme customization
* Admin analytics
* Multi source fallback

---

# 3. Tech Stack

## Frontend

* Next.js 15+
* React 19
* TypeScript
* TailwindCSS
* Framer Motion
* Zustand / Redux Toolkit
* Shadcn/UI

## Video Player

* HLS.js
* Shaka Player
* Video.js
* Dash.js fallback

## Backend (Optional)

* Next.js API Routes
* Edge Functions
* Redis cache
* Supabase/Firebase optional

## Deployment

* Vercel
* GitHub Pages (static mode)
* Cloudflare Pages optional

---

# 4. IPTV-org APIs & Sources

## Base Repository

[IPTV-org GitHub Repository](https://github.com/iptv-org/iptv?utm_source=chatgpt.com)

---

# 5. Data Sources

## Channels JSON

```txt
https://iptv-org.github.io/api/channels.json
```

## Channels M3U

```txt
https://iptv-org.github.io/iptv/index.m3u
```

## Categories

```txt
https://iptv-org.github.io/api/categories.json
```

## Countries

```txt
https://iptv-org.github.io/api/countries.json
```

## Languages

```txt
https://iptv-org.github.io/api/languages.json
```

## Regions

```txt
https://iptv-org.github.io/api/regions.json
```

## Subdivisions

```txt
https://iptv-org.github.io/api/subdivisions.json
```

## Streams

```txt
https://iptv-org.github.io/api/streams.json
```

## Guides / EPG

```txt
https://iptv-org.github.io/api/guides.json
```

## Blocked Streams

```txt
https://iptv-org.github.io/api/blocklist.json
```

## Logos

```txt
https://iptv-org.github.io/logo/{channel}.png
```

---

# 6. Core Features

# 6.1 Home Page

## Sections

* Trending Channels
* Popular Countries
* Recently Watched
* Recommended
* News
* Sports
* Movies
* Music
* Kids
* Religion
* Anime
* Entertainment

## UI

* Hero banner autoplay
* Horizontal smart-TV carousels
* Animated cards
* Lazy loading
* Infinite scroll

---

# 6.2 Advanced Search System

## Search By

* Channel name
* Country
* Language
* Category
* Resolution
* Network
* Stream URL
* NSFW flag
* Broadcast area

## Search Features

* Fuzzy search
* Voice search
* Typo tolerance
* Instant search
* Search suggestions
* Trending search

---

# 6.3 Advanced Filters

## Country Filter

* Multi select
* Flag icons

## Category Filter

* Sports
* News
* Movies
* Music
* Documentary
* Kids
* Anime
* Adult (optional hidden)

## Language Filter

* Multi-language

## Technical Filters

* HD/SD/4K
* HLS only
* DASH only
* HTTPS only
* GEO restricted
* Active streams only

---

# 6.4 Channel Details Page

## Information

* Logo
* Name
* Country
* Language
* Category
* Stream quality
* Broadcast area
* Official website
* EPG schedule
* Similar channels

## Player Features

* Live playback
* Subtitle support
* Audio track switch
* Quality selector
* Fullscreen
* Mini player
* PiP mode
* Playback speed

---

# 6.5 Video Player System

## Supported Formats

* HLS (.m3u8)
* DASH (.mpd)
* MPEGTS
* MP4 livestream

## Advanced Features

* Auto reconnect
* Auto fallback stream
* Buffer recovery
* Stream health monitor
* Error detection
* Stream timeout handling

## Playback Engines

Priority:

1. Native browser support
2. HLS.js
3. Shaka Player
4. Video.js fallback

---

# 6.6 EPG Integration

## Features

* Current program
* Upcoming shows
* Timeline
* Schedule grid
* Auto timezone conversion

## UI

* TV Guide mode
* Smart TV style

---

# 6.7 Favorites System

## Features

* Add/remove favorite
* Sync local storage
* Export favorites
* Import favorites
* Favorite categories

---

# 6.8 Watch History

## Features

* Continue watching
* Recently viewed
* Resume playback

---

# 6.9 User Settings

## Settings

* Theme
* Language
* Player engine
* Default quality
* Autoplay
* Hardware acceleration

---

# 6.10 PWA Features

## Requirements

* Installable app
* Offline caching
* Background sync
* Push notifications

---

# 7. UI/UX Requirements

# Theme

* Dark mode default
* Neon glow effects
* Glassmorphism
* Smart TV inspired

## Animations

* Smooth transitions
* Hover scaling
* Dynamic blur backgrounds

## Responsive

* Mobile first
* TV optimized
* Keyboard navigation

---

# 8. Architecture

# Frontend Structure

```txt
/app
/components
/lib
/hooks
/store
/services
/types
/utils
/styles
/public
```

---

# 9. State Management

## Store Modules

* channels
* player
* favorites
* history
* settings
* search

---

# 10. API Service Layer

# Service Modules

```txt
services/
├── channels.ts
├── streams.ts
├── epg.ts
├── countries.ts
├── categories.ts
├── languages.ts
├── player.ts
```

---

# 11. Channel Object Schema

```ts
interface Channel {
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
```

---

# 12. Stream Schema

```ts
interface Stream {
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
}
```

---

# 13. Performance Requirements

## Target

* Lighthouse > 90
* Initial load < 2s
* Streaming latency minimal

## Optimization

* ISR caching
* Edge cache
* Lazy image
* Dynamic imports
* Virtualized lists

---

# 14. Security

## Requirements

* CSP headers
* XSS protection
* Sanitized stream URLs
* Rate limiting
* Anti abuse

---

# 15. SEO

## Requirements

* Dynamic metadata
* OpenGraph
* Sitemap
* Structured data

---

# 16. Accessibility

## Requirements

* Keyboard support
* Screen reader support
* High contrast mode

---

# 17. Admin Dashboard (Optional)

## Features

* Stream analytics
* Broken stream detector
* User statistics
* Watch time
* Popular channels

---

# 18. Deployment Modes

# Vercel Mode

## Features

* Edge runtime
* API caching
* ISR support

# GitHub Pages Mode

## Features

* Static export
* Client-side fetching

---

# 19. Environment Variables

```env
NEXT_PUBLIC_API_BASE=https://iptv-org.github.io/api
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_DEFAULT_PLAYER=hlsjs
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

# 20. Pages Structure

```txt
/
├── /watch/[channel]
├── /category/[slug]
├── /country/[code]
├── /language/[code]
├── /favorites
├── /history
├── /settings
├── /search
├── /live-guide
```

---

# 21. Future Features

## Planned

* AI recommendations
* Multi view streaming
* DVR recording
* User accounts
* Watch parties
* Chat rooms
* Subtitle scraping
* Torrent TV support

---

# 22. Suggested NPM Packages

## Core

```bash
next
react
typescript
tailwindcss
zustand
axios
```

## Video

```bash
hls.js
video.js
shaka-player
dashjs
```

## UI

```bash
framer-motion
lucide-react
shadcn-ui
```

## Utility

```bash
fuse.js
react-intersection-observer
idb-keyval
```

---

# 23. Smart TV Features

## Remote Navigation

* Arrow key support
* Focus mode
* Spatial navigation

## TV Layout

* 10-foot UI
* Large cards
* Overscan safe area

---

# 24. Error Handling

## Cases

* Stream offline
* GEO blocked
* Timeout
* Unsupported codec

## Recovery

* Retry stream
* Auto switch mirror
* Show backup stream

---

# 25. Suggested Folder Example

```txt
src/
├── app/
├── components/
│   ├── player/
│   ├── channel/
│   ├── layout/
│   ├── tv-guide/
│   └── search/
├── services/
├── stores/
├── hooks/
├── types/
├── utils/
└── styles/
```

---

# 26. Monetization (Optional)

## Features

* Banner ads
* Premium no ads
* Donations
* IPTV import subscriptions

---

# 27. Legal Disclaimer

Aplikasi hanya bertindak sebagai browser/player metadata publik dari IPTV-org.

Tidak menyimpan stream di server sendiri.

Semua hak siar milik pemilik channel masing-masing.

---

# 28. Recommended Advanced Features

## MUST HAVE

* Auto mirror switching
* Channel uptime checker
* Stream benchmarking
* Local caching
* Adaptive bitrate
* Channel health scoring

## NICE TO HAVE

* Chromecast
* AirPlay
* Smart TV app
* Electron desktop app

---

# 29. Recommended Development Phases

## Phase 1

* Basic player
* Channel listing
* Search
* Categories

## Phase 2

* EPG
* Favorites
* History
* PWA

## Phase 3

* Analytics
* AI recommendation
* Multi stream

---

# 30. Final Deliverables

## Source Code

* Full Next.js source
* API abstraction layer
* Reusable components

## Documentation

* README
* Deployment guide
* ENV setup
* Architecture docs

## Deployment

* Vercel ready
* GitHub Pages ready
* Docker optional
