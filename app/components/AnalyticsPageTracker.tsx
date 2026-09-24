'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { GA_ID } from '@/app/lib/consent'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

// page_view en cada navegación cliente. El de la carga inicial lo manda el
// `config` de ConsentManager; sin consentimiento window.gtag no existe.
export default function AnalyticsPageTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const last = useRef<string | null>(null)

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    if (last.current === null || last.current === url) { last.current = url; return }
    last.current = url
    window.gtag?.('config', GA_ID, { page_path: url })
  }, [pathname, searchParams])

  return null
}
