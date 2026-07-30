import { NextResponse } from 'next/server'
import packageJson from '../../../package.json'

export async function GET() {
  return NextResponse.json({
    name: '@lensqa/web',
    version: packageJson.version,
    gitSha: process.env.VERCEL_GIT_COMMIT_SHA || 'dev',
  })
}
