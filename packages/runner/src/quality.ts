import type { QualityFinding } from '@lensqa/shared'
import type { Page } from '@playwright/test'

export async function collectConsoleFindings(page: Page): Promise<QualityFinding[]> {
  const findings: QualityFinding[] = []
  // Caller should attach listener before navigation; this reads page errors via evaluate if any were stored
  const errors = await page.evaluate(() => (window as unknown as { __lensqaConsole?: string[] }).__lensqaConsole ?? [])
  for (const msg of errors) {
    findings.push({
      kind: 'console',
      severity: 'error',
      code: 'CONSOLE_ERROR',
      message: msg,
      fingerprint: `console:${msg.slice(0, 80)}`,
    })
  }
  return findings
}

export async function collectSeoFindings(page: Page): Promise<QualityFinding[]> {
  const findings: QualityFinding[] = []
  const meta = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
    viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content') ?? '',
  }))
  if (!meta.title) findings.push({ kind: 'seo', severity: 'warn', code: 'MISSING_TITLE', message: 'Document title missing' })
  if (!meta.description) findings.push({ kind: 'seo', severity: 'warn', code: 'MISSING_DESCRIPTION', message: 'Meta description missing' })
  if (!meta.viewport) findings.push({ kind: 'seo', severity: 'error', code: 'MISSING_VIEWPORT', message: 'Viewport meta missing' })
  return findings
}

export async function collectA11yFindings(page: Page): Promise<QualityFinding[]> {
  const findings: QualityFinding[] = []
  const data = await page.evaluate(() => {
    const main = !!document.querySelector('main')
    const h1 = document.querySelectorAll('h1').length
    const unlabeledButtons = [...document.querySelectorAll('button, a.btn')].filter(
      (el) => !(el.textContent || '').trim() && !el.getAttribute('aria-label'),
    ).length
    return { main, h1, unlabeledButtons }
  })
  if (!data.main) findings.push({ kind: 'accessibility', severity: 'error', code: 'NO_MAIN', message: 'Missing <main> landmark', fingerprint: 'a11y:main' })
  if (data.h1 !== 1) findings.push({ kind: 'accessibility', severity: 'warn', code: 'H1_COUNT', message: `Expected 1 h1, found ${data.h1}`, fingerprint: 'a11y:h1' })
  if (data.unlabeledButtons > 0) findings.push({ kind: 'accessibility', severity: 'error', code: 'UNLABELED_CONTROL', message: `${data.unlabeledButtons} unlabeled controls`, fingerprint: 'a11y:label' })
  return findings
}

export async function collectResponsiveFindings(page: Page): Promise<QualityFinding[]> {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
  if (!overflow) return []
  return [{ kind: 'responsive', severity: 'error', code: 'HORIZONTAL_OVERFLOW', message: 'Page overflows horizontally', fingerprint: 'resp:overflow' }]
}

export async function collectPerfFindings(page: Page, budgets?: { lcpMs?: number; transferBytes?: number }): Promise<QualityFinding[]> {
  const timing = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const transfer = resources.reduce((s, r) => s + (r.transferSize || 0), 0)
    return { ttfb: nav?.responseStart ?? 0, transfer: transfer, requests: resources.length }
  })
  const findings: QualityFinding[] = []
  if (budgets?.lcpMs && timing.ttfb > budgets.lcpMs) {
    findings.push({ kind: 'performance', severity: 'warn', code: 'SLOW_TTFB', message: `TTFB ${Math.round(timing.ttfb)}ms`, evidence: timing })
  }
  if (budgets?.transferBytes && timing.transfer > budgets.transferBytes) {
    findings.push({ kind: 'performance', severity: 'warn', code: 'HEAVY_PAGE', message: `Transfer ${timing.transfer} bytes`, evidence: timing })
  }
  return findings
}
