import { test } from 'node:test'
import assert from 'node:assert/strict'
import { computeConfidence, flakeScore } from './index.js'

test('computeConfidence penalizes visual errors', () => {
  const r = computeConfidence([
    { kind: 'visual', severity: 'error', code: 'DIFF', message: 'changed' },
  ])
  assert.ok(r.score < 100)
  assert.equal(r.penalties.length, 1)
})

test('flakeScore detects alternating outcomes', () => {
  assert.equal(flakeScore(['passed', 'failed', 'passed', 'failed']), 1)
  assert.equal(flakeScore(['passed', 'passed']), 0)
})
