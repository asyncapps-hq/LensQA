import type { LensqaConfig } from '@lensqa/shared'

const config: LensqaConfig = {
  baseURL: process.env.LENSQA_BASE_URL || 'http://127.0.0.1:4173',
  browsers: ['chromium'],
  viewports: [
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'mobile', width: 390, height: 844, isMobile: true },
  ],
  checks: ['visual', 'accessibility', 'performance', 'console', 'network', 'responsive', 'seo'],
  thresholds: { maxDiffPixels: 80 },
  masks: ['.live-stock'],
  budgets: { lcpMs: 4000, transferBytes: 2_000_000, requestCount: 50 },
  tests: [
    { name: 'home', url: '/?freeze=1', fullPage: true, tags: ['smoke'] },
    { name: 'cart', url: '/cart?freeze=1', fullPage: true, tags: ['checkout'] },
    { name: 'checkout', url: '/checkout?freeze=1', fullPage: true, tags: ['checkout'] },
  ],
}

export default config
