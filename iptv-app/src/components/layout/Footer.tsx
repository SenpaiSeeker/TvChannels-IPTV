import Link from 'next/link'
import { Tv } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-16 py-8 px-4">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
              <Tv className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">
              IPTV<span className="text-indigo-400">Stream</span>
            </span>
          </div>
          <p className="text-xs text-gray-600 text-center">
            Data sourced from{' '}
            <a
              href="https://iptv-org.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300"
            >
              iptv-org
            </a>
            . This app acts as a metadata browser only. All broadcast rights belong to respective channel owners.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <Link href="/settings" className="hover:text-gray-400 transition-colors">Settings</Link>
            <Link href="/favorites" className="hover:text-gray-400 transition-colors">Favorites</Link>
            <Link href="/history" className="hover:text-gray-400 transition-colors">History</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
