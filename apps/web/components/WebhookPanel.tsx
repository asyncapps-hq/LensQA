'use client'

import { useState } from 'react'

export function WebhookPanel() {
  const [url, setUrl] = useState('https://hooks.example.com/lensqa')
  const [saved, setSaved] = useState(false)
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Webhooks</h3>
      <p className="muted">Events: run.completed, review.required, baseline.approved</p>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '100%', padding: '0.7rem', borderRadius: 12, border: '1px solid var(--line)', background: 'transparent' }}
      />
      <button className="btn" style={{ marginTop: '0.75rem' }} onClick={() => setSaved(true)}>
        Save webhook
      </button>
      {saved && <p className="muted">Saved (demo). Secret hashed at rest.</p>}
    </div>
  )
}
