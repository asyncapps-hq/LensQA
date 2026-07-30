'use client'

import { useEffect, useMemo, useState } from 'react'

type Mode = 'side-by-side' | 'overlay' | 'swipe' | 'blink'

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
      <rect width="100%" height="100%" fill="#12121c"/>
      <text x="40" y="60" fill="#9b96b0" font-family="sans-serif" font-size="22">Expected baseline</text>
      <rect x="60" y="120" width="220" height="48" rx="24" fill="#6d7cff"/>
      <text x="95" y="150" fill="white" font-family="sans-serif" font-size="16">Checkout</text>
    </svg>`,
  )

const ACTUAL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
      <rect width="100%" height="100%" fill="#12121c"/>
      <text x="40" y="60" fill="#ff5d7a" font-family="sans-serif" font-size="22">Actual (regressed)</text>
      <rect x="520" y="120" width="220" height="48" rx="24" fill="#6d7cff" opacity="0.2"/>
      <text x="40" y="220" fill="#ff5d7a" font-family="sans-serif" font-size="16">CTA translated off-screen</text>
    </svg>`,
  )

export function DiffViewer({ title = 'cart @ mobile' }: { title?: string }) {
  const [mode, setMode] = useState<Mode>('side-by-side')
  const [opacity, setOpacity] = useState(0.5)
  const [swipe, setSwipe] = useState(50)
  const [blink, setBlink] = useState(true)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (mode !== 'blink') return
    const id = setInterval(() => setBlink((b) => !b), 700)
    return () => clearInterval(id)
  }, [mode])

  const modes = useMemo(() => ['side-by-side', 'overlay', 'swipe', 'blink'] as Mode[], [])

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <strong>{title}</strong>
          <div className="muted" style={{ fontSize: '0.85rem' }}>
            Synchronized zoom · magnifier · keyboard ready
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {modes.map((m) => (
            <button key={m} className={`btn ghost`} style={{ padding: '0.4rem 0.7rem' }} onClick={() => setMode(m)} aria-pressed={mode === m}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', margin: '0.8rem 0', flexWrap: 'wrap' }}>
        <label className="muted">
          Opacity{' '}
          <input type="range" min={0} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />
        </label>
        <label className="muted">
          Zoom{' '}
          <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
        </label>
        {mode === 'swipe' && (
          <label className="muted">
            Swipe{' '}
            <input type="range" min={0} max={100} value={swipe} onChange={(e) => setSwipe(Number(e.target.value))} />
          </label>
        )}
      </div>

      <div className="diff-stage" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
        {mode === 'side-by-side' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <img src={PLACEHOLDER} alt="Expected baseline" />
            <img src={ACTUAL} alt="Actual screenshot" />
          </div>
        )}
        {mode === 'overlay' && (
          <div style={{ position: 'relative' }}>
            <img src={PLACEHOLDER} alt="Expected baseline" />
            <img src={ACTUAL} alt="Actual screenshot" style={{ position: 'absolute', inset: 0, opacity }} />
          </div>
        )}
        {mode === 'swipe' && (
          <div style={{ position: 'relative' }}>
            <img src={PLACEHOLDER} alt="Expected baseline" />
            <div style={{ position: 'absolute', inset: 0, width: `${swipe}%`, overflow: 'hidden' }}>
              <img src={ACTUAL} alt="Actual screenshot" style={{ width: `${10000 / Math.max(swipe, 1)}%`, maxWidth: 'none' }} />
            </div>
          </div>
        )}
        {mode === 'blink' && <img src={blink ? PLACEHOLDER : ACTUAL} alt={blink ? 'Expected' : 'Actual'} />}
      </div>
    </div>
  )
}
