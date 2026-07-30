'use client'

import { usePipeline } from '@/lib/motion/hooks'

const STEPS = ['queued', 'launch', 'navigate', 'capture', 'compare', 'upload', 'review']

export function RunPipelineVisualizer({ active = 'compare' }: { active?: string }) {
  usePipeline('.pipeline .step')
  return (
    <div className="pipeline" aria-label="Run pipeline">
      {STEPS.map((step) => (
        <div key={step} className={`step ${step === active ? 'active' : ''}`}>
          {step}
        </div>
      ))}
    </div>
  )
}
