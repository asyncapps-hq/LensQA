import { TokenPanel } from '@/components/TokenPanel'
import { WebhookPanel } from '@/components/WebhookPanel'

export default function SettingsPage() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Settings</h1>
      <div className="grid-2">
        <TokenPanel />
        <WebhookPanel />
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <h3>Members</h3>
        <ul>
          <li>you@example.com · owner</li>
          <li>jordan@example.com · admin</li>
          <li>qa@example.com · member</li>
        </ul>
        <h3>Usage</h3>
        <p className="muted">Screenshots 1,240 / 10,000 · Storage 280MB · Seats 3</p>
        <h3>Feature flags</h3>
        <p className="muted">ai_triage=false · github_app=true · self_hosted_runners=true</p>
      </div>
    </div>
  )
}
