import { test, expect } from '@playwright/test'
import {
  collectA11yFindings,
  collectSeoFindings,
  collectResponsiveFindings,
  collectPerfFindings,
} from '../src/quality.ts'

test('quality checks on cart', async ({ page }) => {
  const consoleErrors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => consoleErrors.push(err.message))

  await page.goto('/cart?freeze=1')
  await page.evaluate((errs) => {
    ;(window as unknown as { __lensqaConsole: string[] }).__lensqaConsole = errs
  }, consoleErrors)

  const findings = [
    ...(await collectA11yFindings(page)),
    ...(await collectSeoFindings(page)),
    ...(await collectResponsiveFindings(page)),
    ...(await collectPerfFindings(page, { lcpMs: 5000, transferBytes: 5_000_000 })),
  ]

  const errors = findings.filter((f) => f.severity === 'error')
  expect(errors, JSON.stringify(errors, null, 2)).toEqual([])
  expect(consoleErrors).toEqual([])
})
