import Link from 'next/link'
import { demoAnalytics, demoRuns } from '@/lib/demo-data'
import { MetricCard } from '@/components/MetricCard'
import { ConfidenceScore } from '@/components/ConfidenceScore'
import { RunPipelineVisualizer } from '@/components/RunPipelineVisualizer'

export default function DashboardPage() {
  const latest = demoRuns[1]!
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Overview</h1>
      <p className="muted">Lumen Labs · demo-store · seeded portfolio data</p>
      <div className="grid-3" style={{ margin: '1.25rem 0' }}>
        <MetricCard label="Pass rate" value={demoAnalytics.passRate} suffix="%" />
        <MetricCard label="Unresolved reviews" value={demoAnalytics.unresolvedReviews} />
        <MetricCard label="Visual change rate" value={demoAnalytics.visualChangeRate} suffix="%" />
      </div>
      <div className="grid-2">
        <ConfidenceScore score={latest.confidence} />
        <div className="card">
          <strong>Latest run pipeline</strong>
          <div style={{ marginTop: '0.75rem' }}>
            <RunPipelineVisualizer active="review" />
          </div>
          <Link href={`/runs/${latest.id}`} className="btn" style={{ marginTop: '1rem' }}>
            Open failed run
          </Link>
        </div>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Run</th>
              <th>Branch</th>
              <th>Status</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {demoRuns.map((run) => (
              <tr key={run.id}>
                <td>
                  <Link href={`/runs/${run.id}`}>{run.commitSha}</Link>
                </td>
                <td>{run.branch}</td>
                <td>
                  <span className={`status-pill ${run.status}`}>{run.status}</span>
                </td>
                <td>{run.confidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
