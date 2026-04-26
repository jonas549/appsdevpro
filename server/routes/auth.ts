import { Router } from "express"
import { prisma } from "../lib/prisma"
import { comparePassword, signToken, verifyToken } from "../lib/auth"

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

export default router
