'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type MotionContextValue = {
  enabled: boolean
  setEnabled: (v: boolean) => void
}

const MotionContext = createContext<MotionContextValue>({ enabled: true, setEnabled: () => {} })

export function MotionProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cookieOff = document.cookie.includes('lensqa_motion=off')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const off = params.get('motion') === 'off' || cookieOff || reduced || localStorage.getItem('lensqa_motion') === 'off'
    setEnabledState(!off)
    document.documentElement.dataset.motion = off ? 'off' : 'on'
  }, [])

  const setEnabled = useCallback((v: boolean) => {
    setEnabledState(v)
    localStorage.setItem('lensqa_motion', v ? 'on' : 'off')
    document.documentElement.dataset.motion = v ? 'on' : 'off'
  }, [])

  const value = useMemo(() => ({ enabled, setEnabled }), [enabled, setEnabled])
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

export function useMotion() {
  return useContext(MotionContext)
}
