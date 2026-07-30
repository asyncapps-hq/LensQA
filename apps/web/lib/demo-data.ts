import type { QualityFinding, RunStatus } from '@lensqa/shared'
import { computeConfidence } from '@lensqa/shared'

export type DemoResult = {
  id: string
  testName: string
  status: 'passed' | 'failed' | 'flaky'
  browser: string
  viewport: string
  changedPixelRatio: number
  durationMs: number
  checks: QualityFinding[]
  assignee?: string
}

export type DemoRun = {
  id: string
  projectId: string
  projectName: string
  status: RunStatus
  branch: string
  commitSha: string
  confidence: number
  startedAt: string
  finishedAt: string
  results: DemoResult[]
}

export const demoOrg = {
  id: 'org_demo',
  name: 'Lumen Labs',
  slug: 'lumen-labs',
}

export const demoProject = {
  id: 'proj_demo',
  name: 'demo-store',
  slug: 'demo-store',
  baseUrl: 'http://127.0.0.1:4173',
}

const failedChecks: QualityFinding[] = [
  {
    kind: 'visual',
    severity: 'error',
    code: 'DIFF',
    message: 'Mobile checkout button shifted off-screen',
    fingerprint: 'visual:cart:mobile:checkout-shift',
  },
  {
    kind: 'responsive',
    severity: 'error',
    code: 'PRIMARY_ACTION_HIDDEN',
    message: 'Primary CTA not in viewport on Pixel 5',
  },
]

export const demoRuns: DemoRun[] = [
  {
    id: 'run_pass',
    projectId: demoProject.id,
    projectName: demoProject.name,
    status: 'passed',
    branch: 'main',
    commitSha: 'abc1111',
    confidence: 98,
    startedAt: new Date(Date.now() - 7200_000).toISOString(),
    finishedAt: new Date(Date.now() - 7000_000).toISOString(),
    results: [
      {
        id: 'res_pass_cart',
        testName: 'cart',
        status: 'passed',
        browser: 'chromium',
        viewport: 'desktop',
        changedPixelRatio: 0,
        durationMs: 1180,
        checks: [],
      },
    ],
  },
  {
    id: 'run_fail',
    projectId: demoProject.id,
    projectName: demoProject.name,
    status: 'failed',
    branch: 'fix/checkout-css',
    commitSha: 'def2222',
    confidence: computeConfidence(failedChecks).score,
    startedAt: new Date(Date.now() - 1200_000).toISOString(),
    finishedAt: new Date(Date.now() - 1000_000).toISOString(),
    results: [
      {
        id: 'res_fail_cart_mobile',
        testName: 'cart',
        status: 'failed',
        browser: 'chromium',
        viewport: 'mobile',
        changedPixelRatio: 0.084,
        durationMs: 1420,
        checks: failedChecks,
        assignee: 'you',
      },
      {
        id: 'res_fail_cart_desktop',
        testName: 'cart',
        status: 'passed',
        browser: 'chromium',
        viewport: 'desktop',
        changedPixelRatio: 0.001,
        durationMs: 1100,
        checks: [],
      },
    ],
  },
]

export function getRun(id: string) {
  return demoRuns.find((r) => r.id === id)
}

export function getResult(id: string) {
  for (const run of demoRuns) {
    const result = run.results.find((r) => r.id === id)
    if (result) return { run, result }
  }
  return null
}

export const demoAnalytics = {
  passRate: 91,
  visualChangeRate: 7,
  avgChangedPixels: 0.012,
  unresolvedReviews: 1,
  flakyTests: 0,
  topFailing: [{ name: 'cart@mobile', count: 3 }],
  runtimeTrend: [42, 44, 41, 47, 45, 43, 48],
}
