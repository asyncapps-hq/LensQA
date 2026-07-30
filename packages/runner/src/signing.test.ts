import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateConfig } from './config.js'
import { signPayload, verifySignature, hashApiToken } from './signing.js'

test('validateConfig requires baseURL and tests', () => {
  assert.throws(() => validateConfig({}))
  const cfg = validateConfig({ baseURL: 'http://x', tests: [{ name: 'a', url: '/' }] })
  assert.equal(cfg.tests.length, 1)
})

test('hmac verify', () => {
  const body = 'hello'
  const sig = signPayload('s', body)
  assert.equal(verifySignature('s', body, sig), true)
  assert.ok(hashApiToken('x').length > 10)
})
