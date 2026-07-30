import { NextResponse } from 'next/server'
import { getRun } from '@/lib/demo-data'

export async function GET(_req: Request, ctx: { params: Promise<{ runId: string }> }) {
  const { runId } = await ctx.params
  const run = getRun(runId)
  if (!run) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const format = new URL(_req.url).searchParams.get('format') || 'json'
  if (format === 'junit') {
    const cases = run.results
      .map(
        (r) =>
          `<testcase classname="${r.testName}" name="${r.viewport}" time="${(r.durationMs / 1000).toFixed(2)}">${
            r.status === 'failed' ? `<failure message="visual diff"/>` : ''
          }</testcase>`,
      )
      .join('')
    const xml = `<?xml version="1.0"?><testsuite name="lensqa" tests="${run.results.length}">${cases}</testsuite>`
    return new NextResponse(xml, { headers: { 'content-type': 'application/xml' } })
  }
  if (format === 'csv') {
    const lines = ['test,viewport,status,changedPixelRatio', ...run.results.map((r) => `${r.testName},${r.viewport},${r.status},${r.changedPixelRatio}`)]
    return new NextResponse(lines.join('\n'), { headers: { 'content-type': 'text/csv' } })
  }
  return NextResponse.json(run)
}
