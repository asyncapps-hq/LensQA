import { notFound } from 'next/navigation'
import { getResult } from '@/lib/demo-data'
import { DiffViewer } from '@/components/DiffViewer'
import { ReviewActions } from '@/components/ReviewActions'
import { AnnotationCanvas } from '@/components/AnnotationCanvas'

export default async function ReviewPage({ params }: { params: Promise<{ resultId: string }> }) {
  const { resultId } = await params
  const found = getResult(resultId)
  if (!found) notFound()
  const { run, result } = found

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>
        Review {result.testName}@{result.viewport}
      </h1>
      <p className="muted">
        {run.branch} · {result.browser} · changed pixels {(result.changedPixelRatio * 100).toFixed(1)}%
      </p>
      <div className="grid-2" style={{ marginBottom: '1rem' }}>
        <div className="card">
          <strong>Findings</strong>
          <ul>
            {result.checks.length === 0 && <li className="muted">No findings</li>}
            {result.checks.map((c) => (
              <li key={c.code}>
                <span className={`status-pill ${c.severity === 'error' ? 'failed' : 'pending'}`}>{c.kind}</span> {c.message}
              </li>
            ))}
          </ul>
          <ReviewActions resultId={result.id} />
          <p className="muted" style={{ fontSize: '0.8rem' }}>
            Presence: you · jordan (viewing)
          </p>
        </div>
        <AnnotationCanvas />
      </div>
      <DiffViewer title={`${result.testName} @ ${result.viewport}`} />
    </div>
  )
}
