'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function ReviewActions({ resultId }: { resultId: string }) {
  const router = useRouter()
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'a') setMsg('Accepted baseline (demo)')
      if (e.key === 'r') setMsg('Rejected change (demo)')
      if (e.key === 'i') setMsg('Marked intentional (demo)')
      if (e.key === 'n') router.push(`/review/${resultId}`)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [resultId, router])

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
      <button className="btn" onClick={() => setMsg('Accepted baseline (demo)')}>
        Accept <span className="kbd">A</span>
      </button>
      <button className="btn danger" onClick={() => setMsg('Rejected change (demo)')}>
        Reject <span className="kbd">R</span>
      </button>
      <button className="btn ghost" onClick={() => setMsg('Marked intentional (demo)')}>
        Intentional <span className="kbd">I</span>
      </button>
      {msg && <p className="muted">{msg}</p>}
    </div>
  )
}
