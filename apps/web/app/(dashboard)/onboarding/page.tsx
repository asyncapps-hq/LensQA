import Link from 'next/link'

export default function OnboardingPage() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Onboarding</h1>
      <ol className="card" style={{ lineHeight: 1.8 }}>
        <li>Create org & project (seeded: Lumen Labs / demo-store)</li>
        <li>
          Install runner: <code>npx lensqa init</code>
        </li>
        <li>Copy project token from Settings</li>
        <li>Add GitHub Actions workflow from the repo template</li>
        <li>
          Push a CSS bug → open{' '}
          <Link href="/runs/run_fail">failed run</Link> → review diff
        </li>
      </ol>
      <Link className="btn" href="/dashboard">
        Enter dashboard
      </Link>
    </div>
  )
}
