import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createToken, hashToken, signBody, verifyBody } from './signing.ts'
import { classifyDiff, ruleSummary } from './intelligence.ts'

test('signing roundtrip', () => {
  const body = '{"ok":true}'
  const sig = signBody('secret', body)
  assert.equal(verifyBody('secret', body, sig), true)
  assert.equal(verifyBody('secret', body, 'nope'), false)
})

test('token hashing stable', () => {
  const t = createToken()
  assert.equal(hashToken(t), hashToken(t))
  assert.notEqual(hashToken(t), t)
})

test('intelligence helpers', () => {
  assert.equal(classifyDiff('CTA translated off-screen'), 'visibility')
  assert.match(
    ruleSummary([{ kind: 'visual', severity: 'error', code: 'DIFF', message: 'shift' }], 'abc'),
    /abc/,
  )
})
