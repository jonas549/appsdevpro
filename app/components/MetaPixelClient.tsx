'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: (...args: unknown[]) => void
  }
}

// PageView en cada navegación cliente. El píxel lo carga ConsentManager (con
// el PageView inicial) sólo si se aceptan las cookies de publicidad.
export default function MetaPixelClient() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const last = useRef<string | null>(null)

  useEffect(() => {
    const url = pathname + '?' + searchParams.toString()
    if (last.current === null || last.current === url) { last.current = url; return }
    last.current = url
    window.fbq?.('track', 'PageView')
  }, [pathname, searchParams])

  return null
}
