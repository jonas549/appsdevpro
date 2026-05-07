import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth, corsHeaders, optionsResponse } from "@/lib/auth"

export const dynamic = "force-dynamic"

export function OPTIONS() { return optionsResponse() }

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404, headers: corsHeaders })
    return NextResponse.json(post, { headers: corsHeaders })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: corsHeaders })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  const { id } = await params
  try {
    const { title, slug, content, excerpt, published, featured_image, meta_title, meta_description, faq_data } =
      await request.json() as {
        title?: string; slug?: string; content?: string; excerpt?: string; published?: boolean
        featured_image?: string; meta_title?: string; meta_description?: string; faq_data?: string | null
      }
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(content !== undefined && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(published !== undefined && { published: published === true || (published as unknown) === "true" }),
        ...(featured_image !== undefined && { featured_image: featured_image || null }),
        ...(meta_title !== undefined && { meta_title: meta_title || null }),
        ...(meta_description !== undefined && { meta_description: meta_description || null }),
        ...(faq_data !== undefined && { faq_data: faq_data || null }),
      },
    })
    return NextResponse.json(post, { headers: corsHeaders })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: corsHeaders })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  const { id } = await params
  try {
    await prisma.blogPost.delete({ where: { id } })
    return NextResponse.json({ success: true }, { headers: corsHeaders })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: corsHeaders })
  }
}
