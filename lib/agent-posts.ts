import type { Prisma } from "@/src/generated/prisma/client"

/**
 * Capa de traducción entre el contrato público de /api/agent/* y el modelo real
 * de Prisma.
 *
 * Por fuera: nombres limpios en camelCase (metaTitle, bodyHtml, coverImageUrl…)
 * y FAQ como { question, answer }.
 *
 * Por dentro: las columnas que ya existen (meta_title, content, featured_image…)
 * y el FAQ serializado como { heading, items: [{ q, a }] }, que es el formato
 * que ya leen el editor del admin y la plantilla del post. No se migra el
 * formato: los 7 posts existentes lo usan y cambiarlo obligaría a tocar
 * app/admin/blog/[id]/page.tsx y app/blog/[slug]/page.tsx.
 */

export const SITE_URL = "https://appsdeveloperspro.com"

export type PostStatus = "published" | "draft"

export interface AgentFaqItem {
  question: string
  answer: string
}

export interface AgentPostInput {
  title?: unknown
  slug?: unknown
  metaTitle?: unknown
  metaDescription?: unknown
  excerpt?: unknown
  bodyHtml?: unknown
  coverImageUrl?: unknown
  coverImageAlt?: unknown
  faqTitle?: unknown
  faq?: unknown
  tags?: unknown
  status?: unknown
  publishedAt?: unknown
  clientRequestId?: unknown
}

/** Campos obligatorios al crear (§3 de la especificación). */
const REQUIRED_ON_CREATE = [
  "title",
  "metaTitle",
  "metaDescription",
  "excerpt",
  "bodyHtml",
] as const

export interface ValidationResult {
  errors: string[]
  warnings: string[]
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0
}

export function validate(body: AgentPostInput, mode: "create" | "patch"): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (mode === "create") {
    for (const field of REQUIRED_ON_CREATE) {
      if (!isNonEmptyString(body[field])) {
        errors.push(`'${field}' es obligatorio y debe ser un string no vacío`)
      }
    }
  }

  // En PATCH todos los campos son opcionales, pero si vienen deben ser válidos.
  for (const field of [...REQUIRED_ON_CREATE, "slug", "coverImageUrl", "coverImageAlt", "faqTitle", "clientRequestId"] as const) {
    const v = body[field as keyof AgentPostInput]
    if (v !== undefined && typeof v !== "string") {
      errors.push(`'${field}' debe ser un string`)
    }
  }

  if (body.status !== undefined && body.status !== "published" && body.status !== "draft") {
    errors.push(`'status' debe ser "published" o "draft"`)
  }

  if (body.publishedAt !== undefined) {
    if (typeof body.publishedAt !== "string" || Number.isNaN(Date.parse(body.publishedAt))) {
      errors.push(`'publishedAt' debe ser una fecha ISO 8601 válida`)
    }
  }

  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags) || body.tags.some((t) => typeof t !== "string")) {
      errors.push(`'tags' debe ser un array de strings`)
    }
  }

  if (body.faq !== undefined) {
    if (!Array.isArray(body.faq)) {
      errors.push(`'faq' debe ser un array de { question, answer }`)
    } else {
      body.faq.forEach((item, i) => {
        const it = item as Record<string, unknown>
        if (!it || typeof it !== "object" || !isNonEmptyString(it.question) || !isNonEmptyString(it.answer)) {
          errors.push(`'faq[${i}]' debe tener 'question' y 'answer' no vacíos`)
        }
      })
    }
  }

  if (isNonEmptyString(body.coverImageUrl)) {
    try {
      const u = new URL(body.coverImageUrl)
      if (u.protocol !== "https:" && u.protocol !== "http:") {
        errors.push(`'coverImageUrl' debe ser http(s)`)
      }
    } catch {
      errors.push(`'coverImageUrl' debe ser una URL absoluta válida`)
    }
  }

  // Límites recomendados, no bloqueantes (§3).
  if (typeof body.metaTitle === "string" && body.metaTitle.length > 60) {
    warnings.push(`'metaTitle' tiene ${body.metaTitle.length} caracteres; se recomienda ≤ 60`)
  }
  if (typeof body.metaDescription === "string" && body.metaDescription.length > 160) {
    warnings.push(`'metaDescription' tiene ${body.metaDescription.length} caracteres; se recomienda ≤ 160`)
  }
  if (isNonEmptyString(body.coverImageUrl) && !isNonEmptyString(body.coverImageAlt)) {
    warnings.push(`'coverImageUrl' sin 'coverImageAlt': la portada quedará sin texto alternativo`)
  }

  return { errors, warnings }
}

/** { question, answer }[] + faqTitle  ->  string JSON { heading, items:[{q,a}] } */
export function serializeFaq(faq: AgentFaqItem[] | undefined, faqTitle: string | undefined): string | null {
  const items = (faq ?? [])
    .filter((f) => f.question?.trim() && f.answer?.trim())
    .map((f) => ({ q: f.question.trim(), a: f.answer.trim() }))

  if (items.length === 0) return null
  return JSON.stringify({ heading: faqTitle?.trim() || "Preguntas frecuentes", items })
}

/** string JSON { heading, items:[{q,a}] }  ->  { faqTitle, faq:[{question,answer}] } */
export function deserializeFaq(raw: string | null): { faqTitle: string | null; faq: AgentFaqItem[] } {
  if (!raw) return { faqTitle: null, faq: [] }
  try {
    const parsed = JSON.parse(raw) as { heading?: string; items?: { q?: string; a?: string }[] }
    return {
      faqTitle: parsed.heading ?? null,
      faq: (parsed.items ?? [])
        .filter((i) => i.q && i.a)
        .map((i) => ({ question: i.q as string, answer: i.a as string })),
    }
  } catch {
    return { faqTitle: null, faq: [] }
  }
}

export function statusToPublished(status: unknown): boolean {
  return status !== "draft"
}

/** Campos que van a Prisma. Sólo incluye las claves realmente presentes. */
export function toPrismaData(
  body: AgentPostInput,
  opts: { slug?: string; sanitizedHtml?: string },
): Prisma.BlogPostUncheckedCreateInput | Prisma.BlogPostUncheckedUpdateInput {
  const data: Record<string, unknown> = {}

  if (body.title !== undefined) data.title = (body.title as string).trim()
  if (opts.slug !== undefined) data.slug = opts.slug
  if (opts.sanitizedHtml !== undefined) data.content = opts.sanitizedHtml
  if (body.excerpt !== undefined) data.excerpt = (body.excerpt as string).trim()
  if (body.metaTitle !== undefined) data.meta_title = (body.metaTitle as string).trim() || null
  if (body.metaDescription !== undefined) data.meta_description = (body.metaDescription as string).trim() || null
  if (body.coverImageUrl !== undefined) data.featured_image = (body.coverImageUrl as string).trim() || null
  if (body.coverImageAlt !== undefined) data.cover_image_alt = (body.coverImageAlt as string).trim() || null
  if (body.tags !== undefined) data.tags = body.tags as string[]
  if (body.clientRequestId !== undefined) data.clientRequestId = (body.clientRequestId as string).trim() || null

  if (body.faq !== undefined || body.faqTitle !== undefined) {
    data.faq_data = serializeFaq(body.faq as AgentFaqItem[] | undefined, body.faqTitle as string | undefined)
  }

  if (body.status !== undefined) data.published = statusToPublished(body.status)
  if (body.publishedAt !== undefined) data.publishedAt = new Date(body.publishedAt as string)

  return data as Prisma.BlogPostUncheckedCreateInput
}

/** Forma pública devuelta por POST y PATCH (§4.1). */
export function toAgentPostSummary(post: {
  id: string
  slug: string
  published: boolean
  publishedAt: Date | null
  createdAt: Date
}) {
  return {
    id: post.id,
    slug: post.slug,
    url: `${SITE_URL}/blog/${post.slug}`,
    status: (post.published ? "published" : "draft") as PostStatus,
    publishedAt: (post.publishedAt ?? post.createdAt).toISOString(),
  }
}

/** Forma mínima del listado (§4.3). */
export function toAgentPostListItem(post: {
  id: string
  title: string
  slug: string
  published: boolean
  publishedAt: Date | null
  createdAt: Date
}) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    status: (post.published ? "published" : "draft") as PostStatus,
    publishedAt: (post.publishedAt ?? post.createdAt).toISOString(),
  }
}
