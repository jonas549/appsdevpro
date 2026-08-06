import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAgentToken, NO_STORE } from "@/lib/agent-auth"
import { toSlug, uniqueSlug } from "@/lib/slug"
import { sanitizeBodyHtml, HtmlValidationError } from "@/lib/sanitize"
import {
  validate,
  toPrismaData,
  toAgentPostSummary,
  deserializeFaq,
  SITE_URL,
  type AgentPostInput,
} from "@/lib/agent-posts"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function slugIsTaken(slug: string, exceptId: string): Promise<boolean> {
  const found = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } })
  return found !== null && found.id !== exceptId
}

/**
 * GET /api/agent/blog/posts/:id — leer un post completo.
 *
 * No está en la especificación, pero el agente lo necesita para hacer un PATCH
 * informado (leer el estado actual antes de corregir).
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireAgentToken(_request)
  if (denied) return denied

  const { id } = await params
  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) {
    return NextResponse.json({ error: "Not Found" }, { status: 404, headers: NO_STORE })
  }

  const { faqTitle, faq } = deserializeFaq(post.faq_data)
  return NextResponse.json(
    {
      id: post.id,
      title: post.title,
      slug: post.slug,
      url: `${SITE_URL}/blog/${post.slug}`,
      metaTitle: post.meta_title,
      metaDescription: post.meta_description,
      excerpt: post.excerpt,
      bodyHtml: post.content,
      coverImageUrl: post.featured_image,
      coverImageAlt: post.cover_image_alt,
      faqTitle,
      faq,
      tags: post.tags,
      status: post.published ? "published" : "draft",
      publishedAt: (post.publishedAt ?? post.createdAt).toISOString(),
      clientRequestId: post.clientRequestId,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    },
    { headers: NO_STORE },
  )
}

/**
 * PATCH /api/agent/blog/posts/:id — actualizar (§4.2)
 *
 * Todos los campos son opcionales; sólo se tocan los que vengan en el cuerpo.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireAgentToken(request)
  if (denied) return denied

  const { id } = await params

  let body: AgentPostInput
  try {
    body = (await request.json()) as AgentPostInput
  } catch {
    return NextResponse.json(
      { error: "Bad Request", details: ["El cuerpo debe ser JSON válido"] },
      { status: 400, headers: NO_STORE },
    )
  }

  const { errors, warnings } = validate(body, "patch")
  if (errors.length > 0) {
    return NextResponse.json({ error: "Bad Request", details: errors }, { status: 400, headers: NO_STORE })
  }

  const existing = await prisma.blogPost.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Not Found" }, { status: 404, headers: NO_STORE })
  }

  // Sólo se sanitiza (y se toca `content`) si el cuerpo trae bodyHtml.
  let sanitizedHtml: string | undefined
  if (body.bodyHtml !== undefined) {
    try {
      sanitizedHtml = sanitizeBodyHtml(body.bodyHtml as string)
    } catch (err) {
      if (err instanceof HtmlValidationError) {
        return NextResponse.json(
          { error: "Unprocessable Entity", details: [err.message] },
          { status: 422, headers: NO_STORE },
        )
      }
      throw err
    }
  }

  // El slug sólo cambia si lo piden explícitamente. Cambiar el título NO
  // reescribe el slug: rompería la URL de un post ya indexado.
  let slug: string | undefined
  if (typeof body.slug === "string" && body.slug.trim() && toSlug(body.slug) !== existing.slug) {
    slug = await uniqueSlug(toSlug(body.slug), (s) => slugIsTaken(s, id))
  }

  const data = toPrismaData(body, { slug, sanitizedHtml }) as Parameters<typeof prisma.blogPost.update>[0]["data"]

  // Si pasa a publicado y nunca tuvo fecha de publicación, se le pone ahora.
  if (body.status === "published" && existing.publishedAt === null && data.publishedAt === undefined) {
    data.publishedAt = new Date()
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { ...toAgentPostSummary(existing), unchanged: true },
      { headers: NO_STORE },
    )
  }

  try {
    const post = await prisma.blogPost.update({ where: { id }, data })
    const payload = toAgentPostSummary(post)
    return NextResponse.json(
      warnings.length > 0 ? { ...payload, warnings } : payload,
      { headers: NO_STORE },
    )
  } catch (err) {
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json(
        { error: "Conflict", reason: "slug o clientRequestId ya existe" },
        { status: 409, headers: NO_STORE },
      )
    }
    console.error("[agent/posts] PATCH falló:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: NO_STORE })
  }
}
