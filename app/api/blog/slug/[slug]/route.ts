import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { corsHeaders, optionsResponse } from "@/lib/auth"

export const dynamic = "force-dynamic"

export function OPTIONS() { return optionsResponse() }

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug } })
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404, headers: corsHeaders })
    return NextResponse.json(post, { headers: corsHeaders })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: corsHeaders })
  }
}
