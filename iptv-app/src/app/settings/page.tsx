'use client'
import { Settings, Monitor, Volume2, Globe, Shield, Zap, RotateCcw } from 'lucide-react'
import { useSettingsStore } from '@/stores/settingsStore'
import { cn } from '@/utils/cn'

export default function SettingsPage() {
  const settings = useSettingsStore()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <Settings className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-500 text-sm">Customize your viewing experience</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <section className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-4 h-4 text-indigo-400" />
            <h2 className="font-semibold text-white">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Theme</p>
                <p className="text-xs text-gray-600">Choose your preferred color scheme</p>
              </div>
              <div className="flex gap-2">
                {(['dark', 'light'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => settings.updateSettings({ theme })}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                      settings.theme === theme
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    )}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Player */}
        <section className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-yellow-400" />
            <h2 className="font-semibold text-white">Player</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Player Engine</p>
                <p className="text-xs text-gray-600">Select the video playback engine</p>
              </div>
              <div className="flex gap-2">
                {(['hlsjs', 'native', 'videojs'] as const).map((engine) => (
                  <button
                    key={engine}
                    onClick={() => settings.updateSettings({ player: { ...settings.player, engine } })}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                      settings.player.engine === engine
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    )}
                  >
                    {engine}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Default Quality</p>
                <p className="text-xs text-gray-600">Preferred stream quality</p>
              </div>
              <div className="flex gap-2">
                {(['auto', 'hd', 'sd'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => settings.updateSettings({ player: { ...settings.player, quality: q } })}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium uppercase transition-all',
                      settings.player.quality === q
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    )}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Autoplay</p>
                <p className="text-xs text-gray-600">Automatically start playing when opening a channel</p>
              </div>
              <button
                onClick={() => settings.updateSettings({ player: { ...settings.player, autoplay: !settings.player.autoplay } })}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  settings.player.autoplay ? 'bg-indigo-600' : 'bg-white/10'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform',
                    settings.player.autoplay ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Default Volume</p>
                <p className="text-xs text-gray-600">{settings.player.volume}%</p>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.player.volume}
                onChange={(e) => settings.updateSettings({ player: { ...settings.player, volume: Number(e.target.value) } })}
                className="w-32 accent-indigo-500"
              />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-green-400" />
            <h2 className="font-semibold text-white">Content</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Show NSFW Channels</p>
                <p className="text-xs text-gray-600">Display adult content channels in search results</p>
              </div>
              <button
                onClick={() => settings.updateSettings({ enableNSFW: !settings.enableNSFW })}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  settings.enableNSFW ? 'bg-red-600' : 'bg-white/10'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform',
                    settings.enableNSFW ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Analytics</p>
                <p className="text-xs text-gray-600">Help improve the app with anonymous usage data</p>
              </div>
              <button
                onClick={() => settings.updateSettings({ enableAnalytics: !settings.enableAnalytics })}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  settings.enableAnalytics ? 'bg-indigo-600' : 'bg-white/10'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform',
                    settings.enableAnalytics ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Language */}
        <section className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-blue-400" />
            <h2 className="font-semibold text-white">Language</h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { code: 'en', label: 'English' },
              { code: 'id', label: 'Indonesian' },
              { code: 'es', label: 'Spanish' },
              { code: 'fr', label: 'French' },
              { code: 'de', label: 'German' },
              { code: 'pt', label: 'Portuguese' },
              { code: 'ar', label: 'Arabic' },
              { code: 'zh', label: 'Chinese' },
            ].map(({ code, label }) => (
              <button
                key={code}
                onClick={() => settings.updateSettings({ language: code })}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  settings.language === code
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Reset */}
        <button
          onClick={settings.resetSettings}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/8 rounded-xl transition-all text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}
