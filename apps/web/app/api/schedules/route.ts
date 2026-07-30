import { NextResponse } from 'next/server'

const schedules = [
  { id: 'sch_1', projectId: 'proj_demo', cron: '0 9 * * 1-5', timezone: 'Asia/Kuala_Lumpur', active: true },
]

export async function GET() {
  return NextResponse.json({ schedules })
}

export async function POST(request: Request) {
  const body = (await request.json()) as { cron?: string; timezone?: string }
  if (!body.cron) return NextResponse.json({ error: 'cron required' }, { status: 400 })
  const row = {
    id: `sch_${schedules.length + 1}`,
    projectId: 'proj_demo',
    cron: body.cron,
    timezone: body.timezone || 'UTC',
    active: true,
  }
  schedules.push(row)
  return NextResponse.json(row)
}
