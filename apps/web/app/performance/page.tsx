export default function PerformancePage() {
  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <h1>Performance</h1>
      <p className="muted">Budgets enforced in the runner. Dashboard motion uses transform/opacity only.</p>
      <div className="grid-3">
        {[
          ['LCP budget', '≤ 2.5s'],
          ['Transfer budget', '≤ 2MB'],
          ['Motion frame budget', '≤ 16ms'],
        ].map(([k, v]) => (
          <div key={k} className="card">
            <div className="muted">{k}</div>
            <div className="metric">{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
