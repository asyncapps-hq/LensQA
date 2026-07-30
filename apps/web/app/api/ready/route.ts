import { NextResponse } from 'next/server'

export async function GET() {
  const ready = true
  return NextResponse.json({ ready }, { status: ready ? 200 : 503 })
}
