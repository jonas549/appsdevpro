import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth, corsHeaders, optionsResponse } from "@/lib/auth"

export const dynamic = "force-dynamic"

export function OPTIONS() { return optionsResponse() }

export async function GET() {
  try {
    const content = await prisma.siteContent.findMany({
      orderBy: [{ section: "asc" }, { key: "asc" }],
    })
    return NextResponse.json(content, {
      headers: { ...corsHeaders, "Cache-Control": "no-store" },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: corsHeaders })
  }
}

export async function PUT(request: Request) {
  const authResult = requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { section, key, value } = await request.json() as { section: string; key: string; value: string }
    if (!section || !key || value === undefined) {
      return NextResponse.json({ error: "section, key and value required" }, { status: 400, headers: corsHeaders })
    }
    const entry = await prisma.siteContent.upsert({
      where: { section_key: { section, key } },
      update: { value },
      create: { section, key, value },
    })
    return NextResponse.json(entry, { headers: corsHeaders })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: corsHeaders })
  }
}
