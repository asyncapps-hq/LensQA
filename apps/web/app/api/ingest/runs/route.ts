import { NextResponse } from 'next/server'
import { verifyBody, createToken, hashToken } from '@/lib/signing'
import type { RunIngestPayload } from '@lensqa/shared'

// ponytail: in-memory ingest store for demo without Supabase
const runs: Array<RunIngestPayload & { id: string }> = []

export async function POST(request: Request) {
  const body = await request.text()
  const secret = process.env.LENSQA_SIGNING_SECRET
  if (secret) {
    const ok = verifyBody(secret, body, request.headers.get('x-lensqa-signature'))
    if (!ok) return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'missing bearer token' }, { status: 401 })
  }
  let payload: RunIngestPayload
  try {
    payload = JSON.parse(body) as RunIngestPayload
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }
  if (!payload.projectId || !Array.isArray(payload.results)) {
    return NextResponse.json({ error: 'projectId and results required' }, { status: 400 })
  }
  const id = payload.runId || createToken()
  runs.push({ ...payload, id })
  return NextResponse.json({ id, stored: runs.length })
}

export async function GET() {
  return NextResponse.json({ runs: runs.slice(-20) })
}

export function __hashForTests(token: string) {
  return hashToken(token)
}
