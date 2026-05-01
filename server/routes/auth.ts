import { Router } from "express"
import { prisma } from "../lib/prisma"
import { comparePassword, hashPassword, signToken, verifyToken } from "../lib/auth"

const router = Router()

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string }
    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" })
      return
    }
    const user = await prisma.adminUser.findUnique({ where: { email } })
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" })
      return
    }
    const valid = await comparePassword(password, user.password)
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" })
      return
    }
    const token = signToken({ id: user.id, email: user.email })
    res.json({ token, email: user.email })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

router.get("/me", (req, res) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }
  try {
    const payload = verifyToken(auth.slice(7))
    res.json({ id: payload.id, email: payload.email })
  } catch {
    res.status(401).json({ error: "Invalid token" })
  }
})

router.put("/update-credentials", async (req, res) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }
  let user: { id: string; email: string }
  try {
    user = verifyToken(auth.slice(7))
  } catch {
    res.status(401).json({ error: "Invalid token" })
    return
  }

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
})

export default router
