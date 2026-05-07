import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { comparePassword, hashPassword, requireAuth, corsHeaders, optionsResponse } from "@/lib/auth"

export function OPTIONS() { return optionsResponse() }

export async function PUT(request: Request) {
  const authResult = requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { currentPassword, newEmail, newPassword } = await request.json() as {
      currentPassword: string; newEmail?: string; newPassword?: string
    }
    if (!currentPassword) {
      return NextResponse.json({ error: "La contraseña actual es requerida" }, { status: 400, headers: corsHeaders })
    }
    if (!newEmail && !newPassword) {
      return NextResponse.json({ error: "Debes proporcionar un nuevo email o una nueva contraseña" }, { status: 400, headers: corsHeaders })
    }
    const adminUser = await prisma.adminUser.findUnique({ where: { id: authResult.id } })
    if (!adminUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404, headers: corsHeaders })
    }
    const valid = await comparePassword(currentPassword, adminUser.password)
    if (!valid) {
      return NextResponse.json({ error: "La contraseña actual es incorrecta" }, { status: 401, headers: corsHeaders })
    }
    const updateData: { email?: string; password?: string } = {}
    if (newEmail && newEmail !== adminUser.email) updateData.email = newEmail
    if (newPassword) updateData.password = await hashPassword(newPassword)

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ ok: true, message: "Sin cambios" }, { headers: corsHeaders })
    }
    await prisma.adminUser.update({ where: { id: authResult.id }, data: updateData })
    return NextResponse.json({ ok: true }, { headers: corsHeaders })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: corsHeaders })
  }
}
