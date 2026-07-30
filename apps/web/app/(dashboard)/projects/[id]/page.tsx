import Link from 'next/link'
import { demoProject, demoRuns } from '@/lib/demo-data'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{demoProject.name}</h1>
      <p className="muted">Project id: {id}</p>
      <div className="card">
        <h3>Environments</h3>
        <ul>
          <li>local · {demoProject.baseUrl}</li>
          <li>staging · https://staging.example.com</li>
        </ul>
        <h3>Recent runs</h3>
        <ul>
          {demoRuns.map((r) => (
            <li key={r.id}>
              <Link href={`/runs/${r.id}`}>
                {r.branch} · {r.status}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
