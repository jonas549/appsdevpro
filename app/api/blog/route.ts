import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth, corsHeaders, optionsResponse } from "@/lib/auth"

export const dynamic = "force-dynamic"

export function OPTIONS() { return optionsResponse() }

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json(posts, { headers: corsHeaders })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: corsHeaders })
  }
}

export async function POST(request: Request) {
  const authResult = requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { title, slug, content, excerpt, published, featured_image, meta_title, meta_description, faq_data } =
      await request.json() as {
        title: string; slug: string; content: string; excerpt: string; published?: boolean
        featured_image?: string; meta_title?: string; meta_description?: string; faq_data?: string
      }
    if (!title || !slug || !excerpt) {
      return NextResponse.json({ error: "title, slug, excerpt required" }, { status: 400, headers: corsHeaders })
    }
    const post = await prisma.blogPost.create({
      data: {
        title, slug, content: content || "", excerpt,
        published: published === true || (published as unknown) === "true",
        featured_image: featured_image || null,
        meta_title: meta_title || null,
        meta_description: meta_description || null,
        faq_data: faq_data || null,
      },
    })
    return NextResponse.json(post, { status: 201, headers: corsHeaders })
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409, headers: corsHeaders })
    }
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: corsHeaders })
  }
}
