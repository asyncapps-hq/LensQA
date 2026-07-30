'use client'

import { useEffect, useRef } from 'react'
import { useMotion } from './provider'
import { countUp, pipelinePulse, reveal, staggerReveal } from './anime'

export function useReveal<T extends HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<T | null>(null)
  const { enabled } = useMotion()
  useEffect(() => {
    if (ref.current) void reveal(ref.current, enabled)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps])
  return ref
}

export function useStagger(selector: string, deps: unknown[] = []) {
  const { enabled } = useMotion()
  useEffect(() => {
    void staggerReveal(selector, enabled)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, selector, ...deps])
}

export function useCountUp(to: number) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const { enabled } = useMotion()
  useEffect(() => {
    if (ref.current) void countUp(ref.current, to, enabled)
  }, [to, enabled])
  return ref
}

export function usePipeline(selector: string) {
  const { enabled } = useMotion()
  useEffect(() => {
    void pipelinePulse(selector, enabled)
  }, [selector, enabled])
}
