import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getRun } from '@/lib/demo-data'
import { ConfidenceScore } from '@/components/ConfidenceScore'
import { DiffViewer } from '@/components/DiffViewer'
import { RunPipelineVisualizer } from '@/components/RunPipelineVisualizer'
import { ReviewActions } from '@/components/ReviewActions'

export default async function RunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const run = getRun(id)
  if (!run) notFound()
  const failed = run.results.find((r) => r.status === 'failed')

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>
        Run {run.commitSha}{' '}
        <span className={`status-pill ${run.status}`}>{run.status}</span>
      </h1>
      <p className="muted">
        {run.branch} · {run.projectName}
      </p>
      <div style={{ margin: '1rem 0' }}>
        <RunPipelineVisualizer active={run.status === 'failed' ? 'review' : 'upload'} />
      </div>
      <div className="grid-2">
        <ConfidenceScore score={run.confidence} />
        <div className="card">
          <strong>Results</strong>
          <ul>
            {run.results.map((r) => (
              <li key={r.id}>
                <Link href={`/review/${r.id}`}>
                  {r.testName}@{r.viewport} · {r.status}
                </Link>
              </li>
            ))}
          </ul>
          {failed && <ReviewActions resultId={failed.id} />}
        </div>
      </div>
      {failed && (
        <div style={{ marginTop: '1rem' }}>
          <DiffViewer title={`${failed.testName} @ ${failed.viewport}`} />
        </div>
      )}
    </div>
  )
}
