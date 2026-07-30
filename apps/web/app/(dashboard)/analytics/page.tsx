import { demoAnalytics } from '@/lib/demo-data'
import { MetricCard } from '@/components/MetricCard'

export default function AnalyticsPage() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Analytics</h1>
      <div className="grid-3">
        <MetricCard label="Pass rate" value={demoAnalytics.passRate} suffix="%" />
        <MetricCard label="Flaky tests" value={demoAnalytics.flakyTests} />
        <MetricCard label="Avg changed px ratio" value={Math.round(demoAnalytics.avgChangedPixels * 1000)} suffix="‰" />
      </div>
      <div className="grid-2" style={{ marginTop: '1rem' }}>
        <div className="card">
          <strong>Runtime trend (min)</strong>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140, marginTop: 12 }}>
            {demoAnalytics.runtimeTrend.map((v, i) => (
              <div
                key={i}
                title={`${v}m`}
                style={{
                  flex: 1,
                  height: `${v * 2}px`,
                  borderRadius: 8,
                  background: 'linear-gradient(180deg, var(--accent-2), var(--accent))',
                }}
              />
            ))}
          </div>
        </div>
        <div className="card">
          <strong>Top failing</strong>
          <ul>
            {demoAnalytics.topFailing.map((t) => (
              <li key={t.name}>
                {t.name} · {t.count}
              </li>
            ))}
          </ul>
          <p className="muted">Rule summary: mobile-only checkout shift after commit def2222.</p>
        </div>
      </div>
    </div>
  )
}
