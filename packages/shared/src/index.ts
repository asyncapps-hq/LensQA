export type { Database, Json } from './database'

export type OrgRole = 'owner' | 'admin' | 'member' | 'viewer'
export type RunStatus = 'pending' | 'running' | 'passed' | 'failed' | 'approved' | 'cancelled'
export type ReviewDecision = 'accepted' | 'rejected' | 'intentional' | 'pending'
export type CheckKind =
  | 'visual'
  | 'accessibility'
  | 'performance'
  | 'console'
  | 'network'
  | 'responsive'
  | 'seo'
  | 'runtime'

export interface ViewportSpec {
  name: string
  width: number
  height: number
  isMobile?: boolean
  deviceScaleFactor?: number
}

export interface LensqaConfig {
  projectId?: string
  baseURL: string
  tests: TestCaseConfig[]
  browsers?: Array<'chromium' | 'firefox' | 'webkit'>
  viewports?: ViewportSpec[]
  colorSchemes?: Array<'light' | 'dark'>
  locale?: string
  timezoneId?: string
  reducedMotion?: 'reduce' | 'no-preference'
  thresholds?: { maxDiffPixels?: number; maxDiffPixelRatio?: number }
  masks?: string[]
  hide?: string[]
  readySelector?: string
  checks?: CheckKind[]
  budgets?: PerformanceBudget
  crawl?: CrawlConfig
}

export interface TestCaseConfig {
  name: string
  url: string
  selector?: string
  fullPage?: boolean
  steps?: JourneyStep[]
  masks?: string[]
  threshold?: number
  tags?: string[]
}

export interface JourneyStep {
  name: string
  action: 'goto' | 'click' | 'fill' | 'wait' | 'screenshot'
  selector?: string
  value?: string
  url?: string
}

export interface CrawlConfig {
  sitemap?: string
  urls?: string[]
  maxPages?: number
  sameOriginOnly?: boolean
}

export interface PerformanceBudget {
  lcpMs?: number
  cls?: number
  ttfbMs?: number
  transferBytes?: number
  requestCount?: number
}

export interface RunIngestPayload {
  projectId: string
  runId?: string
  commitSha?: string
  branch?: string
  prNumber?: number
  environment?: string
  status: RunStatus
  startedAt: string
  finishedAt?: string
  results: ResultIngest[]
  meta?: Record<string, unknown>
}

export interface ResultIngest {
  testName: string
  status: 'passed' | 'failed' | 'flaky' | 'skipped'
  browser: string
  viewport: string
  colorScheme?: string
  locale?: string
  changedPixelRatio?: number
  durationMs?: number
  checks?: QualityFinding[]
  artifacts?: ArtifactRef[]
  diffSignature?: string
}

export interface QualityFinding {
  kind: CheckKind
  severity: 'info' | 'warn' | 'error'
  code: string
  message: string
  fingerprint?: string
  evidence?: Record<string, unknown>
}

export interface ArtifactRef {
  kind: 'expected' | 'actual' | 'diff' | 'trace' | 'console' | 'network' | 'dom' | 'video'
  path: string
  contentType: string
  checksum?: string
  bytes?: number
}

export interface ConfidenceBreakdown {
  score: number
  weights: Record<string, number>
  penalties: Array<{ reason: string; delta: number }>
}

export function computeConfidence(findings: QualityFinding[]): ConfidenceBreakdown {
  const weights = {
    visual: 35,
    accessibility: 20,
    performance: 15,
    network: 10,
    console: 10,
    responsive: 5,
    seo: 3,
    runtime: 2,
  } as const
  let score = 100
  const penalties: ConfidenceBreakdown['penalties'] = []
  for (const f of findings) {
    if (f.severity === 'info') continue
    const w = weights[f.kind] ?? 5
    const delta = f.severity === 'error' ? -(w * 0.4) : -(w * 0.15)
    score += delta
    penalties.push({ reason: `${f.kind}:${f.code}`, delta })
  }
  return { score: Math.max(0, Math.min(100, Math.round(score))), weights: { ...weights }, penalties }
}

export function flakeScore(outcomes: Array<'passed' | 'failed'>): number {
  if (outcomes.length < 2) return 0
  let flips = 0
  for (let i = 1; i < outcomes.length; i++) {
    if (outcomes[i] !== outcomes[i - 1]) flips++
  }
  return Math.min(1, flips / (outcomes.length - 1))
}

export function hashToken(token: string): string {
  // ponytail: SHA-256 via Web Crypto when available; Node crypto in runner
  let h = 0
  for (let i = 0; i < token.length; i++) h = (Math.imul(31, h) + token.charCodeAt(i)) | 0
  return `lq_${Math.abs(h).toString(16)}`
}
