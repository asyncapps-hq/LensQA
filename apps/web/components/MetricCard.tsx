'use client'

import { useCountUp } from '@/lib/motion/hooks'

export function MetricCard({ label, value, suffix = '' }: { label: string; value: number; suffix?: string }) {
  const ref = useCountUp(value)
  return (
    <div className="card">
      <div className="muted">{label}</div>
      <div className="metric">
        <span ref={ref}>0</span>
        {suffix}
      </div>
    </div>
  )
}
