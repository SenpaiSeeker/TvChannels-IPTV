'use client'
import { useEffect } from 'react'

type KeyHandler = (e: KeyboardEvent) => void

export function useKeyboard(handlers: Record<string, KeyHandler>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const handler = handlers[e.key] || handlers[e.code]
      if (handler) {
        handler(e)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}
