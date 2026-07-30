import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="container" style={{ maxWidth: 420, paddingTop: '4rem' }}>
      <h1>Create account</h1>
      <p className="muted">Connect Supabase Auth for production signup.</p>
      <Link className="btn" href="/onboarding">
        Start onboarding
      </Link>
    </div>
  )
}
