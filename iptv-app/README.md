# 📺 IPTVStream

A modern, feature-rich IPTV streaming web application built with Next.js 15, React 19, TypeScript, and TailwindCSS. Stream thousands of free live TV channels from around the world.

## ✨ Features

- 🌍 **10,000+ Live Channels** — Sourced from iptv-org.github.io
- 🎬 **HLS.js Video Player** — Adaptive bitrate streaming with auto-reconnect
- 🔍 **Advanced Search** — Fuzzy search with filters by country, category, language
- ❤️ **Favorites System** — Save, export, and import favorite channels
- 📜 **Watch History** — Track recently watched channels
- 📡 **Live Guide** — Browse all live streams by country
- 🎨 **Dark Mode UI** — Neon glow, glassmorphism, Smart TV inspired design
- 📱 **Responsive** — Mobile, tablet, desktop, and TV optimized
- ⚡ **PWA Ready** — Installable as a native app
- 🖼️ **Picture-in-Picture** — Watch while browsing
- ⌨️ **Keyboard Shortcuts** — Full keyboard navigation

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Environment Variables

```env
NEXT_PUBLIC_API_BASE=https://iptv-org.github.io/api
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_DEFAULT_PLAYER=hlsjs
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home page
│   ├── watch/[channelId]/  # Channel watch page
│   ├── search/             # Search page
│   ├── favorites/          # Favorites page
│   ├── history/            # Watch history page
│   ├── settings/           # Settings page
│   ├── live-guide/         # Live TV guide
│   ├── category/[slug]/    # Category page
│   └── country/[code]/     # Country page
├── components/
│   ├── player/             # Video player components
│   ├── channel/            # Channel card, carousel, grid
│   ├── layout/             # Navbar, Footer
│   ├── ui/                 # Hero banner, Skeleton loaders
│   └── search/             # Search components
├── services/               # API service layer
├── stores/                 # Zustand state management
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript interfaces
└── utils/                  # Utility functions
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 + React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS + custom CSS
- **Animations**: Framer Motion
- **State**: Zustand with persistence
- **Video**: HLS.js
- **Search**: Fuse.js (fuzzy search)
- **HTTP**: Axios
- **Data**: iptv-org.github.io public API

## 📡 Data Sources

All channel data is sourced from the [iptv-org](https://github.com/iptv-org/iptv) open-source project:

- Channels: `https://iptv-org.github.io/api/channels.json`
- Streams: `https://iptv-org.github.io/api/streams.json`
- Categories: `https://iptv-org.github.io/api/categories.json`
- Countries: `https://iptv-org.github.io/api/countries.json`
- Languages: `https://iptv-org.github.io/api/languages.json`

## ⚖️ Legal Disclaimer

This application acts as a metadata browser/player only. It does not host or store any streams. All broadcast rights belong to their respective channel owners. Stream availability depends on geographic location and channel policies.

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy!
