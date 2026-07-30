import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { MetricCard } from '@/components/MetricCard'
import { RunPipelineVisualizer } from '@/components/RunPipelineVisualizer'
import { LandingMotion } from '@/components/LandingMotion'

export default function HomePage() {
  return (
    <div>
      <div className="container">
        <header className="nav">
          <div className="logo">
            Lens<span>QA</span>
          </div>
          <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/tour">Tour</Link>
            <Link href="/security">Security</Link>
            <Link href="/dashboard">Dashboard</Link>
            <ThemeToggle />
            <Link className="btn" href="/onboarding">
              Start free
            </Link>
          </nav>
        </header>

        <section className="hero">
          <div>
            <span className="badge">Frontend Quality Cloud</span>
            <h1 className="hero-title">Catch the CSS bug that kills checkout — before revenue does.</h1>
            <p>
              LensQA runs deterministic Playwright workers for visual diffs, a11y, performance, network, and responsive
              regressions, then gives your team a cinematic review workspace with baseline governance.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <Link className="btn" href="/runs/run_fail">
                Break the checkout demo
              </Link>
              <Link className="btn ghost" href="/tour">
                Product tour
              </Link>
            </div>
            <div className="grid-3" style={{ marginTop: '2rem' }}>
              <MetricCard label="Pass rate" value={91} suffix="%" />
              <MetricCard label="Minutes to root cause" value={3} />
              <MetricCard label="Checkout bugs caught" value={128} />
            </div>
          </div>
          <div className="card">
            <div className="muted" style={{ marginBottom: '0.75rem' }}>
              Live run pipeline
            </div>
            <RunPipelineVisualizer active="compare" />
            <div style={{ marginTop: '1rem' }} className="muted">
              Queued → launch → navigate → capture → compare → upload → review
            </div>
            <div className="card" style={{ marginTop: '1rem', background: 'rgba(255,93,122,0.08)', borderColor: 'rgba(255,93,122,0.35)' }}>
              <strong>diff · mobile cart</strong>
              <p className="muted" style={{ margin: '0.4rem 0 0' }}>
                Checkout CTA translated 140% off-screen after a CSS merge. GitHub Check failed. Diff highlighted.
              </p>
            </div>
          </div>
        </section>

        <LandingMotion />

        <section className="grid-3" style={{ paddingBottom: '4rem' }}>
          {[
            ['Visual + quality engine', 'Screenshots, a11y, Web Vitals, console, SEO, crawl, responsive sweeps in one result.'],
            ['Baseline governance', 'Branch-aware baselines, required reviewers, release confidence, protected prod.'],
            ['Wow review UX', 'Swipe/blink diffs, filmstrip journeys, annotations, command palette, realtime presence.'],
          ].map(([title, body]) => (
            <article key={title} className="card feature-card">
              <h3 style={{ marginTop: 0 }}>{title}</h3>
              <p className="muted">{body}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
