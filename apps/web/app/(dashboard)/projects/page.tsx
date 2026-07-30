import Link from 'next/link'
import { demoProject, demoRuns } from '@/lib/demo-data'

export default function ProjectsPage() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Projects</h1>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>{demoProject.name}</h2>
        <p className="muted">{demoProject.baseUrl}</p>
        <p>{demoRuns.length} recent runs</p>
        <Link className="btn" href={`/projects/${demoProject.id}`}>
          Open project
        </Link>
      </div>
    </div>
  )
}
