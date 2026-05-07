import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth, corsHeaders, optionsResponse } from "@/lib/auth"

export const dynamic = "force-dynamic"

export function OPTIONS() { return optionsResponse() }

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  const { id } = await params
  try {
    const { status } = await request.json() as { status?: string }
    const lead = await prisma.lead.update({
      where: { id },
      data: { ...(status !== undefined && { status }) },
    })
    return NextResponse.json(lead, { headers: corsHeaders })
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
    await prisma.lead.delete({ where: { id } })
    return new Response(null, { status: 204, headers: corsHeaders })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: corsHeaders })
  }
}
