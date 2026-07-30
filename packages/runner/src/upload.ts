import type { RunIngestPayload } from '@lensqa/shared'
import { signPayload } from './signing.js'

export async function uploadRun(opts: {
  apiUrl: string
  token: string
  secret?: string
  payload: RunIngestPayload
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const body = JSON.stringify(opts.payload)
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Bearer ${opts.token}`,
  }
  if (opts.secret) headers['x-lensqa-signature'] = signPayload(opts.secret, body)
  const res = await fetch(`${opts.apiUrl.replace(/\/$/, '')}/api/ingest/runs`, {
    method: 'POST',
    headers,
    body,
  })
  const json = (await res.json().catch(() => ({}))) as { id?: string; error?: string }
  if (!res.ok) return { ok: false, error: json.error || res.statusText }
  return { ok: true, id: json.id }
}
