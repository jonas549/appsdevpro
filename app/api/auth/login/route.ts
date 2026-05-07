import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { comparePassword, signToken, corsHeaders, optionsResponse } from "@/lib/auth"

export function OPTIONS() { return optionsResponse() }

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json() as { email: string; password: string }
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400, headers: corsHeaders })
    }
    const user = await prisma.adminUser.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401, headers: corsHeaders })
    }
    const valid = await comparePassword(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401, headers: corsHeaders })
    }
    const token = signToken({ id: user.id, email: user.email })
    return NextResponse.json({ token, email: user.email }, { headers: corsHeaders })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: corsHeaders })
  }
}
