import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    openapi: '3.1.0',
    info: { title: 'LensQA API', version: '0.1.0' },
    paths: {
      '/api/health': { get: { summary: 'Health' } },
      '/api/ready': { get: { summary: 'Readiness' } },
      '/api/version': { get: { summary: 'Version' } },
      '/api/ingest/runs': {
        post: {
          summary: 'Ingest run results',
          security: [{ bearerAuth: [] }],
        },
      },
      '/api/tokens': { post: { summary: 'Create project token' } },
      '/api/export/{runId}': { get: { summary: 'Export run as json|csv|junit' } },
      '/api/webhooks/github': { post: { summary: 'GitHub App webhook' } },
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer' },
      },
    },
  })
}
