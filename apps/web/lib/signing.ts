import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto'

export function signBody(secret: string, body: string) {
  return createHmac('sha256', secret).update(body).digest('hex')
}

export function verifyBody(secret: string, body: string, signature: string | null) {
  if (!signature) return false
  const expected = signBody(secret, body)
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export function createToken() {
  return `lq_${randomBytes(24).toString('hex')}`
}

export function hashToken(token: string) {
  return createHmac('sha256', 'lensqa-api-token').update(token).digest('hex')
}
