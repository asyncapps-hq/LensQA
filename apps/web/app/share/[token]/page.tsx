import { DiffViewer } from '@/components/DiffViewer'
import { getRun } from '@/lib/demo-data'

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const run = getRun('run_fail')
  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1>Shared report</h1>
      <p className="muted">
        Token {token.slice(0, 8)}… · read-only · expires · revocable (demo)
      </p>
      {run && (
        <>
          <p>
            {run.branch} · {run.status} · confidence {run.confidence}
          </p>
          <DiffViewer />
        </>
      )}
    </div>
  )
}
