import { sanitizeInlineHtml, stripAllHtml } from "@/lib/sanitize"

/**
 * Capa de traducción y validación para /api/agent/content/sections (§13).
 *
 * A diferencia del blog, aquí no hay nombres "limpios" que traducir: el agente
 * trabaja directamente con las claves reales de SiteContent (app2_title,
 * app2_desc…), porque son las que el admin muestra y las que hay que citar para
 * saber qué se está tocando. Lo que sí traduce esta capa es el FORMATO del
 * valor: cada clave tiene un tipo y una sanitización distinta según cómo la
 * pinta la plantilla.
 *
 * De momento sólo se expone la sección 'apps' (decisión del usuario, 2026-08-06).
 */

/** Secciones que el agente puede leer y escribir. */
export const ALLOWED_SECTIONS = ["apps"] as const
export type AllowedSection = (typeof ALLOWED_SECTIONS)[number]

/**
 * Cómo se pinta cada campo, que es lo que decide su sanitización:
 *
 *  - `text`   → la plantilla lo interpola como texto ({app.title}). Sin marcado.
 *  - `html`   → la plantilla usa dangerouslySetInnerHTML. Marcado en línea.
 *  - `csv`    → lista separada por comas (Apps.tsx:129 hace .split(',')).
 *  - `url`    → href de un enlace. Absoluta http(s), o vacía para ocultarlo.
 *  - `status` → alimenta getBadgeStyle() (Apps.tsx:138), que sólo entiende tres valores.
 */
export type FieldType = "text" | "html" | "csv" | "url" | "status"

/** Valores que getBadgeStyle() sabe pintar; cualquier otro cae en el estilo 'nda'. */
export const STATUS_VALUES = ["active", "upcoming", "nda"] as const

/**
 * Las 26 claves reales de section='apps', verificadas contra la base de datos
 * el 2026-08-07. La especificación proponía nombres tipo `app2.titulo`; no
 * existen. El esquema real es snake_case en inglés y plano.
 */
const APPS_FIELDS: Record<string, FieldType> = {
  heading: "text",
  subheading: "html",
  ...buildAppFields(1),
  ...buildAppFields(2),
  ...buildAppFields(3),
}

function buildAppFields(n: 1 | 2 | 3): Record<string, FieldType> {
  return {
    [`app${n}_status`]: "status",
    [`app${n}_badge`]: "text",
    [`app${n}_title`]: "text",
    [`app${n}_subtitle`]: "text",
    [`app${n}_desc`]: "html",
    [`app${n}_tags`]: "csv",
    [`app${n}_cta`]: "text",
    [`app${n}_store_url`]: "url",
  }
}

const SCHEMA: Record<AllowedSection, Record<string, FieldType>> = {
  apps: APPS_FIELDS,
}

export function isAllowedSection(v: unknown): v is AllowedSection {
  return typeof v === "string" && (ALLOWED_SECTIONS as readonly string[]).includes(v)
}

export function fieldsOf(section: AllowedSection): Record<string, FieldType> {
  return SCHEMA[section]
}

export function typeOfKey(section: AllowedSection, key: string): FieldType | null {
  return SCHEMA[section][key] ?? null
}

/** Longitudes máximas por tipo, para que un fallo del agente no llene la columna. */
const MAX_LENGTH: Record<FieldType, number> = {
  text: 300,
  html: 20_000,
  csv: 500,
  url: 2_000,
  status: 20,
}

export class SectionValidationError extends Error {}

/**
 * Convierte HTML por bloques al formato que espera la plantilla.
 *
 * Apps.tsx:187 hace `app.desc.split('\n\n')` y envuelve CADA trozo en su propio
 * <p>. Si guardásemos "<p>uno</p><p>dos</p>" tal cual, el split devolvería un
 * único trozo con los dos <p> dentro, y acabarían anidados dentro del <p> de la
 * plantilla — HTML inválido que el parser del navegador deshace por su cuenta.
 *
 * Y no basta con pasar el HTML por sanitizeInlineHtml: <p> no está en su
 * allowlist, así que se descarta la etiqueta pero se conserva el texto, y los
 * dos párrafos quedarían pegados en uno.
 *
 * Por eso el corte de párrafo se traduce a "\n\n" ANTES de sanitizar, que es
 * exactamente cómo están guardados hoy los tres app*_desc y los defaults de
 * APP_DEFAULTS.
 */
export function normalizeBlockHtml(raw: string): string {
  const withBreaks = raw
    .replace(/\r\n?/g, "\n")
    // Cierre de bloque = corte de párrafo.
    .replace(/<\/(?:p|div|h[1-6]|li|blockquote|section|article)\s*>/gi, "\n\n")
    // Dos <br> seguidos es la otra forma habitual de separar párrafos.
    .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, "\n\n")

  const clean = sanitizeInlineHtml(withBreaks)

  return clean
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function normalizeCsv(raw: string): string {
  return stripAllHtml(raw)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .join(",")
}

function normalizeUrl(raw: string): string {
  const trimmed = stripAllHtml(raw)
  // Vacío es legítimo: Apps.tsx:210 lo usa para decidir si el CTA apunta al
  // App Store o al ancla de contacto.
  if (!trimmed) return ""

  let url: URL
  try {
    url = new URL(trimmed)
  } catch {
    throw new SectionValidationError("debe ser una URL absoluta válida, o una cadena vacía")
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new SectionValidationError("debe usar el esquema http o https")
  }
  return url.toString()
}

/**
 * Valida y normaliza un valor según el tipo de su clave.
 * Lanza SectionValidationError con el motivo; el route handler lo convierte en 400.
 */
export function normalizeValue(type: FieldType, rawValue: unknown): string {
  if (typeof rawValue !== "string") {
    throw new SectionValidationError("'value' debe ser un string")
  }
  if (rawValue.length > MAX_LENGTH[type]) {
    throw new SectionValidationError(
      `supera el máximo de ${MAX_LENGTH[type]} caracteres (tiene ${rawValue.length})`,
    )
  }

  switch (type) {
    case "text":
      return stripAllHtml(rawValue)
    case "html":
      return normalizeBlockHtml(rawValue)
    case "csv":
      return normalizeCsv(rawValue)
    case "url":
      return normalizeUrl(rawValue)
    case "status": {
      const v = stripAllHtml(rawValue).toLowerCase()
      if (!(STATUS_VALUES as readonly string[]).includes(v)) {
        throw new SectionValidationError(
          `debe ser uno de: ${STATUS_VALUES.join(", ")}`,
        )
      }
      return v
    }
  }
}

export interface SectionUpdate {
  key: string
  value: string
}

/**
 * Valida el array `updates` entero antes de tocar la base de datos: si una sola
 * clave está mal, no se escribe ninguna. Deja la ficha en un estado coherente en
 * vez de a medias.
 */
export function validateUpdates(
  section: AllowedSection,
  updates: unknown,
): { normalized: SectionUpdate[]; errors: string[] } {
  const errors: string[] = []
  const normalized: SectionUpdate[] = []

  if (!Array.isArray(updates)) {
    return { normalized, errors: ["'updates' debe ser un array de { key, value }"] }
  }
  if (updates.length === 0) {
    return { normalized, errors: ["'updates' no puede estar vacío"] }
  }

  const seen = new Set<string>()

  updates.forEach((item, i) => {
    const it = item as Record<string, unknown> | null
    if (!it || typeof it !== "object" || Array.isArray(it)) {
      errors.push(`updates[${i}]: debe ser un objeto { key, value }`)
      return
    }

    const key = typeof it.key === "string" ? it.key.trim() : ""
    if (!key) {
      errors.push(`updates[${i}]: 'key' es obligatorio`)
      return
    }
    if (seen.has(key)) {
      errors.push(`updates[${i}]: '${key}' aparece más de una vez`)
      return
    }
    seen.add(key)

    const type = typeOfKey(section, key)
    if (!type) {
      errors.push(
        `updates[${i}]: '${key}' no es una clave válida de la sección '${section}'`,
      )
      return
    }

    try {
      normalized.push({ key, value: normalizeValue(type, it.value) })
    } catch (err) {
      if (err instanceof SectionValidationError) {
        errors.push(`updates[${i}] ('${key}'): ${err.message}`)
        return
      }
      throw err
    }
  })

  return { normalized, errors }
}
