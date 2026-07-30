import type { RunIngestPayload } from '@lensqa/shared'

export class LensqaClient {
  constructor(
    private opts: {
      baseUrl: string
      token: string
      fetchImpl?: typeof fetch
    },
  ) {}

  async ingestRun(payload: RunIngestPayload) {
    const fetchImpl = this.opts.fetchImpl || fetch
    const res = await fetchImpl(`${this.opts.baseUrl.replace(/\/$/, '')}/api/ingest/runs`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.opts.token}`,
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`ingest failed: ${res.status}`)
    return res.json() as Promise<{ id: string }>
  }

  async exportRun(runId: string, format: 'json' | 'csv' | 'junit' = 'json') {
    const fetchImpl = this.opts.fetchImpl || fetch
    const res = await fetchImpl(`${this.opts.baseUrl}/api/export/${runId}?format=${format}`)
    if (!res.ok) throw new Error(`export failed: ${res.status}`)
    return format === 'json' ? res.json() : res.text()
  }
}
