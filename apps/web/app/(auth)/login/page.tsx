'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('you@example.com')
  return (
    <div className="container" style={{ maxWidth: 420, paddingTop: '4rem' }}>
      <h1>Sign in</h1>
      <p className="muted">Email magic link or GitHub OAuth when Supabase is configured. Demo mode skips auth.</p>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', padding: '0.8rem', borderRadius: 12, border: '1px solid var(--line)', background: 'transparent' }}
      />
      <Link className="btn" href="/dashboard" style={{ marginTop: '1rem', width: '100%' }}>
        Continue to demo dashboard
      </Link>
    </div>
  )
}
