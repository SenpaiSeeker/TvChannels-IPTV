import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Categories — IPTVStream',
  description: 'Browse thousands of live TV channels by category — Sports, News, Movies, Music, Kids, Anime, Documentary and more.',
  openGraph: {
    title: 'Browse Categories — IPTVStream',
    description: 'Browse thousands of live TV channels by category.',
    type: 'website',
  },
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
