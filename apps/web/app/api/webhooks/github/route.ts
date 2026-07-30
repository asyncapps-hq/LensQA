import { NextResponse } from 'next/server'
import { createHmac } from 'node:crypto'

export async function POST(request: Request) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET
  const body = await request.text()
  if (secret) {
    const sig = request.headers.get('x-hub-signature-256')
    const expected = 'sha256=' + createHmac('sha256', secret).update(body).digest('hex')
    if (sig !== expected) return NextResponse.json({ error: 'bad signature' }, { status: 401 })
  }
  const event = request.headers.get('x-github-event') || 'unknown'
  // ponytail: acknowledge events; check-run updates land when GitHub App credentials exist
  return NextResponse.json({ ok: true, event })
}
