'use client'

import { useState } from 'react'

export function TokenPanel() {
  const [token, setToken] = useState<string | null>(null)
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Project tokens</h3>
      <p className="muted">Shown once. Stored as HMAC hashes server-side.</p>
      <button
        className="btn"
        onClick={async () => {
          const res = await fetch('/api/tokens', { method: 'POST' })
          const json = (await res.json()) as { token: string }
          setToken(json.token)
        }}
      >
        Generate token
      </button>
      {token && (
        <pre style={{ marginTop: '0.75rem', overflow: 'auto', fontSize: '0.8rem' }}>{token}</pre>
      )}
      <pre className="muted" style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
        {`# CI snippet
LENSQA_PROJECT_TOKEN=...
npx lensqa upload .lensqa/last-run.json`}
      </pre>
    </div>
  )
}
