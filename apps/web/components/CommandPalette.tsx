'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

const ACTIONS = [
  { label: 'Go to dashboard', href: '/dashboard' },
  { label: 'Open failed run', href: '/runs/run_fail' },
  { label: 'Review mobile cart', href: '/review/res_fail_cart_mobile' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Settings / tokens', href: '/settings' },
  { label: 'Onboarding', href: '/onboarding' },
  { label: 'Status page', href: '/status' },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const router = useRouter()
  const items = useMemo(
    () => ACTIONS.filter((a) => a.label.toLowerCase().includes(q.toLowerCase())),
    [q],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!open) return null
  return (
    <div
      role="dialog"
      aria-label="Command palette"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'grid',
        placeItems: 'start center',
        paddingTop: '12vh',
        zIndex: 80,
      }}
      onClick={() => setOpen(false)}
    >
      <div className="card" style={{ width: 'min(560px, 92vw)' }} onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type a command…"
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            borderRadius: 12,
            border: '1px solid var(--line)',
            background: 'transparent',
            marginBottom: '0.75rem',
          }}
        />
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {items.map((item) => (
            <li key={item.href}>
              <button
                className="btn ghost"
                style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 4 }}
                onClick={() => {
                  setOpen(false)
                  router.push(item.href)
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
