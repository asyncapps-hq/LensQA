import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'

const LINKS = [
  ['/dashboard', 'Overview'],
  ['/projects', 'Projects'],
  ['/runs', 'Runs'],
  ['/analytics', 'Analytics'],
  ['/settings', 'Settings'],
  ['/onboarding', 'Onboarding'],
  ['/', 'Marketing'],
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="logo" style={{ marginBottom: '1rem' }}>
          Lens<span>QA</span>
        </div>
        <nav aria-label="Dashboard">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: '2rem' }}>
          <ThemeToggle />
          <p className="muted" style={{ fontSize: '0.75rem', marginTop: '0.75rem' }}>
            Press <span className="kbd">⌘K</span> for commands
          </p>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  )
}
