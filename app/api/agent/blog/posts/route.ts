import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAgentToken, NO_STORE } from "@/lib/agent-auth"
import { toSlug, uniqueSlug } from "@/lib/slug"
import { sanitizeBodyHtml, HtmlValidationError } from "@/lib/sanitize"
import {
  validate,
  toPrismaData,
  toAgentPostSummary,
  toAgentPostListItem,
  type AgentPostInput,
} from "@/lib/agent-posts"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const LIST_DEFAULT_LIMIT = 20
const LIST_MAX_LIMIT = 100

async function slugIsTaken(slug: string, exceptId?: string): Promise<boolean> {
  const found = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } })
  return found !== null && found.id !== exceptId
}

/**
 * POST /api/agent/blog/posts — crear un post (§4.1)
 */
export async function POST(request: Request) {
  const denied = requireAgentToken(request)
  if (denied) return denied

  let body: AgentPostInput
  try {
    body = (await request.json()) as AgentPostInput
  } catch {
    return NextResponse.json(
      { error: "Bad Request", details: ["El cuerpo debe ser JSON válido"] },
      { status: 400, headers: NO_STORE },
    )
  }

  const { errors, warnings } = validate(body, "create")
  if (errors.length > 0) {
    return NextResponse.json({ error: "Bad Request", details: errors }, { status: 400, headers: NO_STORE })
  }

  // Idempotencia (§8): si ya procesamos este clientRequestId, devolvemos el post
  // existente con 409 en vez de crear un duplicado.
  const clientRequestId = typeof body.clientRequestId === "string" ? body.clientRequestId.trim() : ""
  if (clientRequestId) {
    const existing = await prisma.blogPost.findUnique({ where: { clientRequestId } })
    if (existing) {
      return NextResponse.json(
        { error: "Conflict", reason: "clientRequestId ya procesado", post: toAgentPostSummary(existing) },
        { status: 409, headers: NO_STORE },
      )
    }
  }

  // Sanitizado (§6) antes de tocar la base de datos.
  let sanitizedHtml: string
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

  // Slug (§5): el que venga, o derivado del título; con sufijo si está ocupado.
  const requested = typeof body.slug === "string" && body.slug.trim() ? body.slug : (body.title as string)
  const slug = await uniqueSlug(toSlug(requested), (s) => slugIsTaken(s))

  const data = toPrismaData(body, { slug, sanitizedHtml }) as Parameters<typeof prisma.blogPost.create>[0]["data"]
  if (data.published === undefined) data.published = true // default "published" (§3)
  if (data.publishedAt === undefined) data.publishedAt = new Date()

  try {
    const post = await prisma.blogPost.create({ data })
    const payload = toAgentPostSummary(post)
    return NextResponse.json(
      warnings.length > 0 ? { ...payload, warnings } : payload,
      { status: 201, headers: NO_STORE },
    )
  } catch (err) {
    // Carrera: otro request creó el mismo slug o clientRequestId entre nuestra
    // comprobación y el insert. El índice único es la fuente de verdad.
    if ((err as { code?: string }).code === "P2002") {
      const target = String((err as { meta?: { target?: unknown } }).meta?.target ?? "")
      if (target.includes("clientRequestId") && clientRequestId) {
        const existing = await prisma.blogPost.findUnique({ where: { clientRequestId } })
        if (existing) {
          return NextResponse.json(
            { error: "Conflict", reason: "clientRequestId ya procesado", post: toAgentPostSummary(existing) },
            { status: 409, headers: NO_STORE },
          )
        }
      }
      return NextResponse.json(
        { error: "Conflict", reason: "slug ya existe", details: [target] },
        { status: 409, headers: NO_STORE },
      )
    }
    console.error("[agent/posts] POST falló:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: NO_STORE })
  }
}

/**
 * GET /api/agent/blog/posts?limit=20&status=published — listar (§4.3)
 *
 * Devuelve la forma mínima para que el agente evite repetir temas.
 */
export async function GET(request: Request) {
  const denied = requireAgentToken(request)
  if (denied) return denied

  const { searchParams } = new URL(request.url)

  const status = searchParams.get("status")
  if (status !== null && status !== "published" && status !== "draft" && status !== "all") {
    return NextResponse.json(
      { error: "Bad Request", details: [`'status' debe ser "published", "draft" o "all"`] },
      { status: 400, headers: NO_STORE },
    )
  }

  const rawLimit = Number.parseInt(searchParams.get("limit") ?? "", 10)
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(rawLimit, 1), LIST_MAX_LIMIT)
    : LIST_DEFAULT_LIMIT

  const where =
    status === "published" ? { published: true } : status === "draft" ? { published: false } : {}

  try {
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        select: { id: true, title: true, slug: true, published: true, publishedAt: true, createdAt: true },
      }),
      prisma.blogPost.count({ where }),
    ])

    return NextResponse.json(
      { total, limit, posts: posts.map(toAgentPostListItem) },
      { headers: NO_STORE },
    )
  } catch (err) {
    console.error("[agent/posts] GET falló:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: NO_STORE })
  }
}
