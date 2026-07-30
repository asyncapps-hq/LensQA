export function ConfidenceScore({ score }: { score: number }) {
  const color = score >= 90 ? 'var(--ok)' : score >= 70 ? 'var(--warn)' : 'var(--danger)'
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div
        aria-label={`Release confidence ${score}`}
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          border: `3px solid ${color}`,
          fontWeight: 900,
        }}
      >
        {score}
      </div>
      <div>
        <strong>Release confidence</strong>
        <div className="muted" style={{ fontSize: '0.85rem' }}>
          Weighted visual · a11y · perf · network evidence. Never overrides approval gates.
        </div>
      </div>
    </div>
  )
}
