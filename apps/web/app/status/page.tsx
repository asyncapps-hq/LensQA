export default function StatusPage() {
  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <h1>Status</h1>
      <div className="grid-3">
        {[
          ['API', 'Operational'],
          ['Ingest', 'Operational'],
          ['Dashboard', 'Operational'],
        ].map(([name, state]) => (
          <div key={name} className="card">
            <strong>{name}</strong>
            <div className="status-pill passed" style={{ marginTop: 8 }}>
              {state}
            </div>
          </div>
        ))}
      </div>
      <p className="muted">Non-sensitive health only. Details: /api/health · /api/ready · /api/version</p>
    </div>
  )
}
