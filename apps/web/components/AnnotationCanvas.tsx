'use client'

import { useState } from 'react'

export function AnnotationCanvas() {
  const [rects, setRects] = useState<Array<{ x: number; y: number; w: number; h: number }>>([])
  const [draft, setDraft] = useState<{ x: number; y: number } | null>(null)

  return (
    <div className="card">
      <strong>Region annotations</strong>
      <p className="muted" style={{ fontSize: '0.85rem' }}>
        Drag on the canvas to comment on a region.
      </p>
      <div
        role="application"
        aria-label="Annotation canvas"
        style={{ position: 'relative', height: 180, borderRadius: 12, border: '1px dashed var(--line)', background: 'rgba(255,255,255,0.02)' }}
        onMouseDown={(e) => {
          const bounds = e.currentTarget.getBoundingClientRect()
          setDraft({ x: e.clientX - bounds.left, y: e.clientY - bounds.top })
        }}
        onMouseUp={(e) => {
          if (!draft) return
          const bounds = e.currentTarget.getBoundingClientRect()
          const x2 = e.clientX - bounds.left
          const y2 = e.clientY - bounds.top
          setRects((r) => [
            ...r,
            {
              x: Math.min(draft.x, x2),
              y: Math.min(draft.y, y2),
              w: Math.abs(x2 - draft.x),
              h: Math.abs(y2 - draft.y),
            },
          ])
          setDraft(null)
        }}
      >
        {rects.map((r, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: r.x,
              top: r.y,
              width: r.w,
              height: r.h,
              border: '2px solid var(--accent-2)',
              background: 'rgba(39,224,194,0.12)',
            }}
          />
        ))}
      </div>
      <textarea
        placeholder="Thread comment… @teammate"
        style={{ width: '100%', marginTop: '0.75rem', minHeight: 70, borderRadius: 12, border: '1px solid var(--line)', background: 'transparent', padding: '0.7rem' }}
      />
    </div>
  )
}
