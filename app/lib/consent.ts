// Consentimiento de cookies (RGPD) y etiquetas de Google / Meta.
//
// Ninguna etiqueta de terceros se carga sin consentimiento: ConsentManager lee
// la elección guardada y sólo entonces inyecta gtag.js y el píxel de Meta.
// Mientras no hay consentimiento, window.gtag y window.fbq no existen y todas
// las llamadas `window.gtag?.(...)` del sitio son no-ops.

export const GA_ID = "G-8J3B6TQM9Q"
export const ADS_ID = "AW-18468464760"

// Conversión "formulario enviado" de Google Ads.
export const ADS_LEAD_SEND_TO = "AW-18468464760/r1jSCMOb0YMdEPjQueZE"
export const ADS_LEAD_VALUE = 50

// PENDIENTE (Jonas): sustituir por el send_to de la conversión de WhatsApp
// ("AW-18468464760/<etiqueta>"). Mientras contenga PENDIENTE no se envía nada.
export const ADS_WHATSAPP_SEND_TO = "AW-18468464760/PENDIENTE_ETIQUETA_WHATSAPP"
export const ADS_WHATSAPP_VALUE = 25

export interface Consent {
  v: 1
  analytics: boolean // Google Analytics 4
  ads: boolean // Google Ads + píxel de Meta
  ts: string
}

const KEY = "adp_consent"
export const CONSENT_CHANGE_EVENT = "adp:consent-change"
export const CONSENT_OPEN_EVENT = "adp:consent-open"

// Copia en memoria: vale aunque localStorage esté bloqueado.
let current: Consent | null = null

export function readConsent(): Consent | null {
  if (current) return current
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const c = JSON.parse(raw) as Partial<Consent>
    if (c.v !== 1 || typeof c.analytics !== "boolean" || typeof c.ads !== "boolean") return null
    current = c as Consent
    return current
  } catch {
    return null
  }
}

export function saveConsent(analytics: boolean, ads: boolean): Consent {
  const c: Consent = { v: 1, analytics, ads, ts: new Date().toISOString() }
  current = c
  try {
    localStorage.setItem(KEY, JSON.stringify(c))
  } catch {
    // Sin almacenamiento la elección vale sólo para esta visita.
  }
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_CHANGE_EVENT, { detail: c }))
  return c
}

/** Reabre el panel de cookies (enlace "Configurar cookies"). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))
}

/**
 * Conversión de Google Ads. Sólo sale si el visitante aceptó las cookies de
 * publicidad; sin ese consentimiento la etiqueta ni siquiera está cargada.
 */
export function trackAdsConversion(sendTo: string, value: number, transactionId?: string) {
  if (sendTo.includes("PENDIENTE")) return
  if (!readConsent()?.ads) return
  window.gtag?.("event", "conversion", {
    send_to: sendTo,
    value,
    currency: "USD",
    ...(transactionId ? { transaction_id: transactionId } : {}),
  })
}
