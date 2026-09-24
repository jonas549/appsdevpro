'use client'

import { openConsentSettings } from '@/app/lib/consent'

/** Reabre el panel de cookies para cambiar o retirar el consentimiento. */
export default function CookieSettingsButton({ className, children = 'Configurar cookies' }: { className?: string; children?: React.ReactNode }) {
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      {children}
    </button>
  )
}
