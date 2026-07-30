'use client'

import { motionTokens } from './tokens'

type AnimeLike = {
  (params: Record<string, unknown>): { pause: () => void; play: () => void; seek: (t: number) => void; reverse: () => void; restart: () => void; duration: number }
  timeline: (params?: Record<string, unknown>) => {
    add: (params: Record<string, unknown>, offset?: string | number) => unknown
    play: () => void
    pause: () => void
    seek: (t: number) => void
    reverse: () => void
    restart: () => void
  }
  stagger: (value: number, opts?: Record<string, unknown>) => unknown
  remove: (targets: unknown) => void
}

let animeMod: AnimeLike | null = null

async function getAnime(): Promise<AnimeLike | null> {
  if (typeof window === 'undefined') return null
  if (animeMod) return animeMod
  try {
    // animejs v4 exports named animate/createTimeline; keep adapter flexible
    const mod = await import('animejs')
    const anyMod = mod as unknown as Record<string, unknown>
    if (typeof anyMod.animate === 'function') {
      const animate = anyMod.animate as AnimeLike
      const createTimeline = anyMod.createTimeline as AnimeLike['timeline'] | undefined
      const stagger = (anyMod.stagger as AnimeLike['stagger']) || ((v: number) => v)
      animeMod = Object.assign(animate, {
        timeline: createTimeline || ((params?: Record<string, unknown>) => {
          const anims: Array<() => void> = []
          return {
            add: (p: Record<string, unknown>) => { anims.push(() => animate(p)); return undefined },
            play: () => anims.forEach((fn) => fn()),
            pause: () => {},
            seek: () => {},
            reverse: () => {},
            restart: () => anims.forEach((fn) => fn()),
          }
        }),
        stagger,
        remove: (anyMod.remove as AnimeLike['remove']) || (() => {}),
      })
      return animeMod
    }
    animeMod = (mod as unknown as { default: AnimeLike }).default || (mod as unknown as AnimeLike)
    return animeMod
  } catch {
    return null
  }
}

export async function reveal(targets: string | Element | Element[], enabled: boolean) {
  if (!enabled) return null
  const anime = await getAnime()
  if (!anime) return null
  return anime({
    targets,
    opacity: [0, 1],
    translateY: [16, 0],
    easing: motionTokens.easing.out,
    duration: motionTokens.duration.base,
  })
}

export async function staggerReveal(targets: string, enabled: boolean) {
  if (!enabled) return null
  const anime = await getAnime()
  if (!anime) return null
  return anime({
    targets,
    opacity: [0, 1],
    translateY: [12, 0],
    delay: anime.stagger(motionTokens.stagger.base),
    easing: motionTokens.easing.out,
    duration: motionTokens.duration.base,
  })
}

export async function countUp(el: HTMLElement, to: number, enabled: boolean) {
  if (!enabled) {
    el.textContent = String(to)
    return null
  }
  const anime = await getAnime()
  if (!anime) {
    el.textContent = String(to)
    return null
  }
  const obj = { val: 0 }
  return anime({
    targets: obj,
    val: to,
    round: 1,
    duration: motionTokens.duration.slow,
    easing: motionTokens.easing.out,
    update: () => {
      el.textContent = String(obj.val)
    },
  })
}

export async function pipelinePulse(targets: string, enabled: boolean) {
  if (!enabled) return null
  const anime = await getAnime()
  if (!anime) return null
  const tl = anime.timeline({ easing: motionTokens.easing.out })
  tl.add({ targets, opacity: [0.4, 1], scale: [0.96, 1], delay: anime.stagger(90), duration: 360 })
  return tl
}
