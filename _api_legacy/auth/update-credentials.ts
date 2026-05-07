import type { VercelRequest, VercelResponse } from "@vercel/node"
import { prisma } from "../_lib/prisma.js"
import { comparePassword, hashPassword, requireAuth, setCors } from "../_lib/auth.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (req.method === "OPTIONS") { res.status(204).end(); return }
  if (req.method !== "PUT") { res.status(405).json({ error: "Method not allowed" }); return }

  const user = requireAuth(req, res)
  if (!user) return

  try {
    const { currentPassword, newEmail, newPassword } = req.body as {
      currentPassword: string
      newEmail?: string
      newPassword?: string
    }

    if (!currentPassword) {
      res.status(400).json({ error: "La contraseña actual es requerida" })
      return
    }
    if (!newEmail && !newPassword) {
      res.status(400).json({ error: "Debes proporcionar un nuevo email o una nueva contraseña" })
      return
    }

    const adminUser = await prisma.adminUser.findUnique({ where: { id: user.id } })
    if (!adminUser) {
      res.status(404).json({ error: "Usuario no encontrado" })
      return
    }

    const valid = await comparePassword(currentPassword, adminUser.password)
    if (!valid) {
      res.status(401).json({ error: "La contraseña actual es incorrecta" })
      return
    }

    const updateData: { email?: string; password?: string } = {}
    if (newEmail && newEmail !== adminUser.email) updateData.email = newEmail
    if (newPassword) updateData.password = await hashPassword(newPassword)

    if (Object.keys(updateData).length === 0) {
      res.json({ ok: true, message: "Sin cambios" })
      return
    }

    await prisma.adminUser.update({ where: { id: user.id }, data: updateData })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}
