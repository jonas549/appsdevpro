// Leads de la landing /tiendas-shopify.
//
// No hay columnas nuevas en `Lead` (decisión: no tocar el schema), así que el
// origen y los campos propios de la landing se guardan en los que ya existen:
//   - `message` empieza por LANDING_SOURCE_TAG y lleva los datos estructurados
//   - `company` guarda la URL de la tienda si ya tiene una
// El admin los muestra sin cambios (el mensaje sale completo en el modal).

export const LANDING_SOURCE = "tiendas-shopify"
export const LANDING_SOURCE_TAG = "[Origen: Landing Tiendas Shopify]"

export const PRODUCT_RANGES = {
  "menos-50": "Menos de 50",
  "50-500": "De 50 a 500",
  "500-1000": "De 500 a 1.000",
  "mas-1000": "Más de 1.000",
} as const

export type ProductRange = keyof typeof PRODUCT_RANGES

export interface LandingLead {
  name: string
  email: string
  phone_code: string
  phone: string
  products: ProductRange | null
  hasStore: "si" | "no" | null
  storeUrl: string | null
  idea: string | null
}

export type ParseResult =
  | { ok: true; lead: LandingLead }
  | { ok: false; error: string; field?: string }
  | { ok: false; honeypot: true }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_CODE_RE = /^\+\d{1,4}$/

// Quita caracteres de control (saltos de línea incluidos): el nombre acaba en
// el asunto del email y no debe poder partir cabeceras.
// (no-control-regex desactivado a propósito: buscar caracteres de control es justo lo que hacen)
function oneLine(v: unknown, max: number): string {
  // eslint-disable-next-line no-control-regex
  return typeof v === "string" ? v.replace(/[\u0000-\u001F\u007F]+/g, " ").trim().slice(0, max) : ""
}

function multiLine(v: unknown, max: number): string {
  return typeof v === "string"
    // eslint-disable-next-line no-control-regex
    ? v.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000B-\u001F\u007F]+/g, " ").trim().slice(0, max)
    : ""
}

/** Acepta "mitienda.com" y le añade https://. Sólo http(s). */
export function normalizeStoreUrl(raw: string): string | null {
  if (!raw) return null
  const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    const u = new URL(withProto)
    if (u.protocol !== "http:" && u.protocol !== "https:") return null
    if (!u.hostname.includes(".")) return null
    return u.toString()
  } catch {
    return null
  }
}

export function parseLandingLead(body: Record<string, unknown>): ParseResult {
  // Honeypot: campo oculto que una persona nunca rellena.
  if (oneLine(body.website, 200)) return { ok: false, honeypot: true }

  const name = oneLine(body.name, 100)
  const email = oneLine(body.email, 200).toLowerCase()
  const phone_code = oneLine(body.phone_code, 6) || "+34"
  const phoneRaw = oneLine(body.phone, 40)
  const phoneDigits = phoneRaw.replace(/\D/g, "")

  if (name.length < 2) return { ok: false, error: "Escribe tu nombre", field: "name" }
  if (!PHONE_CODE_RE.test(phone_code)) return { ok: false, error: "Prefijo no válido", field: "phone_code" }
  if (phoneDigits.length < 6 || phoneDigits.length > 15) return { ok: false, error: "Revisa tu número de WhatsApp", field: "phone" }
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Revisa tu correo", field: "email" }

  const productsRaw = oneLine(body.products, 20)
  let products: ProductRange | null = null
  if (productsRaw) {
    if (!(productsRaw in PRODUCT_RANGES)) return { ok: false, error: "Cantidad de productos no válida", field: "products" }
    products = productsRaw as ProductRange
  }

  const hasStoreRaw = oneLine(body.hasStore, 4)
  const hasStore = hasStoreRaw === "si" || hasStoreRaw === "no" ? hasStoreRaw : null
  if (hasStoreRaw && !hasStore) return { ok: false, error: "Valor no válido", field: "hasStore" }

  let storeUrl: string | null = null
  if (hasStore === "si") {
    const rawUrl = oneLine(body.storeUrl, 300)
    if (rawUrl) {
      storeUrl = normalizeStoreUrl(rawUrl)
      if (!storeUrl) return { ok: false, error: "Revisa el enlace de tu tienda", field: "storeUrl" }
    }
  }

  const idea = hasStore === "no" ? multiLine(body.idea, 2000) || null : null

  return { ok: true, lead: { name, email, phone_code, phone: phoneRaw, products, hasStore, storeUrl, idea } }
}

export function hasStoreLabel(lead: LandingLead): string {
  if (lead.hasStore === "si") return lead.storeUrl ? `Sí — ${lead.storeUrl}` : "Sí"
  if (lead.hasStore === "no") return "No"
  return "Sin responder"
}

/** Texto que va a la columna `message` (NOT NULL). Empieza siempre por la etiqueta de origen. */
export function composeLandingMessage(lead: LandingLead): string {
  const lines = [
    LANDING_SOURCE_TAG,
    `Productos: ${lead.products ? PRODUCT_RANGES[lead.products] : "Sin responder"}`,
    `¿Tiene tienda?: ${hasStoreLabel(lead)}`,
  ]
  if (lead.idea) lines.push("", "Idea:", lead.idea)
  return lines.join("\n")
}
