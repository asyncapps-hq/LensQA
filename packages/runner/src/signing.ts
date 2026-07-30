import { createHmac, timingSafeEqual } from 'node:crypto'

export function signPayload(secret: string, body: string): string {
  return createHmac('sha256', secret).update(body).digest('hex')
}

export function verifySignature(secret: string, body: string, signature: string): boolean {
  const expected = signPayload(secret, body)
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export function hashApiToken(token: string): string {
  return createHmac('sha256', 'lensqa-token').update(token).digest('hex')
}
