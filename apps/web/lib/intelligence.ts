import type { QualityFinding } from '@lensqa/shared'

export type RegionClass = 'text' | 'image' | 'spacing' | 'color' | 'visibility' | 'position'

export function classifyDiff(message: string): RegionClass {
  const m = message.toLowerCase()
  if (m.includes('off-screen') || m.includes('hidden') || m.includes('opacity')) return 'visibility'
  if (m.includes('shift') || m.includes('translate') || m.includes('position')) return 'position'
  if (m.includes('color') || m.includes('contrast')) return 'color'
  if (m.includes('space') || m.includes('gap') || m.includes('margin')) return 'spacing'
  if (m.includes('image') || m.includes('icon')) return 'image'
  return 'text'
}

export function ruleSummary(findings: QualityFinding[], commit?: string) {
  const visual = findings.find((f) => f.kind === 'visual' && f.severity === 'error')
  if (visual) {
    return `Visual regression${commit ? ` after commit ${commit}` : ''}: ${visual.message}`
  }
  if (findings.length === 0) return 'All quality checks passed.'
  return `${findings.length} findings across ${new Set(findings.map((f) => f.kind)).size} check kinds.`
}

export function groupBySignature(items: Array<{ id: string; diffSignature?: string | null }>) {
  const map = new Map<string, string[]>()
  for (const item of items) {
    const key = item.diffSignature || item.id
    const list = map.get(key) || []
    list.push(item.id)
    map.set(key, list)
  }
  return [...map.entries()].map(([signature, ids]) => ({ signature, ids }))
}
