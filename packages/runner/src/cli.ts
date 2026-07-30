#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadConfig, validateConfig } from './config.js'
import { uploadRun } from './upload.js'
import { hashApiToken } from './signing.js'
import type { RunIngestPayload } from '@lensqa/shared'

const [cmd, ...args] = process.argv.slice(2)

async function main() {
  switch (cmd) {
    case 'init':
      return init()
    case 'run':
      return run()
    case 'upload':
      return upload(args[0])
    case 'list':
      return list()
    case 'help':
    case undefined:
      return help()
    default:
      console.error(`Unknown command: ${cmd}`)
      help()
      process.exit(2)
  }
}

function help() {
  console.log(`LensQA runner

Usage:
  lensqa init              Create lensqa.config.ts
  lensqa run               Validate config and print planned tests
  lensqa upload <file>     Upload run JSON to API
  lensqa list              List tests from config
  lensqa help
`)
}

function init() {
  const target = resolve(process.cwd(), 'lensqa.config.ts')
  if (existsSync(target)) {
    console.log('lensqa.config.ts already exists')
    return
  }
  writeFileSync(
    target,
    `import type { LensqaConfig } from '@lensqa/shared'

const config: LensqaConfig = {
  baseURL: process.env.LENSQA_BASE_URL || 'http://localhost:4173',
  browsers: ['chromium'],
  viewports: [
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'mobile', width: 390, height: 844, isMobile: true },
  ],
  checks: ['visual', 'accessibility', 'performance', 'console', 'network', 'responsive', 'seo'],
  thresholds: { maxDiffPixels: 100 },
  masks: ['.live-stock'],
  tests: [
    { name: 'home', url: '/?freeze=1', fullPage: true, tags: ['smoke'] },
    { name: 'cart', url: '/cart?freeze=1', fullPage: true, tags: ['checkout'] },
  ],
}

export default config
`,
  )
  mkdirSync(resolve(process.cwd(), '.lensqa'), { recursive: true })
  console.log('Created lensqa.config.ts')
}

async function run() {
  const config = await loadConfig()
  console.log(JSON.stringify({ baseURL: config.baseURL, tests: config.tests.map((t) => t.name), checks: config.checks }, null, 2))
  console.log('Run Playwright with: npm run test:visual')
  process.exit(0)
}

async function list() {
  const config = await loadConfig()
  for (const t of config.tests) console.log(`${t.name}\t${t.url}`)
}

async function upload(file?: string) {
  if (!file) {
    console.error('Usage: lensqa upload <run.json>')
    process.exit(2)
  }
  const { readFileSync } = await import('node:fs')
  const payload = JSON.parse(readFileSync(resolve(file), 'utf8')) as RunIngestPayload
  const apiUrl = process.env.LENSQA_API_URL || 'http://localhost:3000'
  const token = process.env.LENSQA_PROJECT_TOKEN
  if (!token) {
    console.error('LENSQA_PROJECT_TOKEN required')
    process.exit(2)
  }
  const result = await uploadRun({
    apiUrl,
    token,
    secret: process.env.LENSQA_SIGNING_SECRET,
    payload,
  })
  if (!result.ok) {
    console.error(result.error)
    process.exit(1)
  }
  console.log('Uploaded', result.id)
}

// self-check
if (process.env.LENSQA_SELFTEST === '1') {
  validateConfig({ baseURL: 'http://x', tests: [{ name: 'a', url: '/' }] })
  console.log('token-hash', hashApiToken('demo').slice(0, 8))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
