export const motionTokens = {
  duration: { instant: 120, fast: 220, base: 420, slow: 700 },
  easing: {
    out: 'cubicBezier(0.16, 1, 0.3, 1)',
    inOut: 'cubicBezier(0.45, 0, 0.55, 1)',
  },
  stagger: { tight: 40, base: 70, loose: 110 },
} as const
