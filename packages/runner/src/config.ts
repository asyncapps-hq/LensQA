import type { LensqaConfig, QualityFinding } from '@lensqa/shared'
import { readFileSync, existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

export async function loadConfig(cwd = process.cwd()): Promise<LensqaConfig> {
  const tsPath = resolve(cwd, 'lensqa.config.ts')
  const jsPath = resolve(cwd, 'lensqa.config.js')
  const jsonPath = resolve(cwd, 'lensqa.config.json')
  if (existsSync(tsPath) || existsSync(jsPath)) {
    const mod = await import(pathToFileURL(existsSync(tsPath) ? tsPath : jsPath).href)
    return validateConfig(mod.default ?? mod)
  }
  if (existsSync(jsonPath)) {
    return validateConfig(JSON.parse(readFileSync(jsonPath, 'utf8')))
  }
  throw new Error('No lensqa.config.ts|js|json found. Run: lensqa init')
}

export function validateConfig(input: unknown): LensqaConfig {
  if (!input || typeof input !== 'object') throw new Error('Config must be an object')
  const c = input as Partial<LensqaConfig>
  if (!c.baseURL || typeof c.baseURL !== 'string') throw new Error('baseURL is required')
  if (!Array.isArray(c.tests) || c.tests.length === 0) throw new Error('tests[] is required')
  for (const t of c.tests) {
    if (!t.name || !t.url) throw new Error('Each test needs name and url')
  }
  return c as LensqaConfig
}
