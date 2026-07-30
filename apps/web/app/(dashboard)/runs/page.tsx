import Link from 'next/link'
import { demoRuns } from '@/lib/demo-data'

export default function RunsPage() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Runs</h1>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Commit</th>
              <th>Branch</th>
              <th>Status</th>
              <th>Results</th>
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
                <td>{run.results.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
