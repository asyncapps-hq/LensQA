'use client'

import { useMotion } from '@/lib/motion/provider'

export function ThemeToggle() {
  const { enabled, setEnabled } = useMotion()
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button
        className="btn ghost"
        style={{ padding: '0.45rem 0.75rem' }}
        onClick={() => {
          const root = document.documentElement
          root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light'
        }}
      >
        Theme
      </button>
      <button className="btn ghost" style={{ padding: '0.45rem 0.75rem' }} onClick={() => setEnabled(!enabled)}>
        Motion {enabled ? 'on' : 'off'}
      </button>
    </div>
  )
}
