import type { VercelRequest, VercelResponse } from "@vercel/node"
import { prisma } from "../_lib/prisma"
import { comparePassword, signToken, setCors } from "../_lib/auth"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (req.method === "OPTIONS") { res.status(204).end(); return }
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return }

  try {
    const { email, password } = req.body as { email: string; password: string }
    if (!email || !password) { res.status(400).json({ error: "Email and password required" }); return }

    const user = await prisma.adminUser.findUnique({ where: { email } })
    if (!user) { res.status(401).json({ error: "Invalid credentials" }); return }

    const valid = await comparePassword(password, user.password)
    if (!valid) { res.status(401).json({ error: "Invalid credentials" }); return }

    const token = signToken({ id: user.id, email: user.email })
    res.json({ token, email: user.email })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}
