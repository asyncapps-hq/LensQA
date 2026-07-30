export default function SecurityPage() {
  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <h1>Security</h1>
      <ul className="card">
        <li>RLS on every tenant table</li>
        <li>Private artifact bucket + short-lived signed URLs</li>
        <li>API tokens & webhook secrets stored as hashes</li>
        <li>HMAC ingest signatures · GitHub webhook verification</li>
        <li>No service/secret keys in the browser bundle</li>
        <li>AI triage opt-in with redaction controls (off by default)</li>
      </ul>
    </div>
  )
}
