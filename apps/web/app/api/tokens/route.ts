import { NextResponse } from 'next/server'
import { createToken, hashToken } from '@/lib/signing'

const issued: Array<{ hash: string; createdAt: string }> = []

export async function POST() {
  const token = createToken()
  issued.push({ hash: hashToken(token), createdAt: new Date().toISOString() })
  return NextResponse.json({ token, hint: 'Store hash only; token shown once', count: issued.length })
}

export async function GET() {
  return NextResponse.json({
    tokens: issued.map((t) => ({ hashPrefix: t.hash.slice(0, 10), createdAt: t.createdAt })),
  })
}
