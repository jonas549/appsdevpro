import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import type { VercelRequest, VercelResponse } from "@vercel/node"

const SECRET = process.env.JWT_SECRET!

export const hashPassword = (p: string) => bcrypt.hash(p, 12)
export const comparePassword = (p: string, hash: string) => bcrypt.compare(p, hash)

export const signToken = (payload: { id: string; email: string }) =>
  jwt.sign(payload, SECRET, { expiresIn: "7d" })

export const verifyToken = (token: string): { id: string; email: string } =>
  jwt.verify(token, SECRET) as { id: string; email: string }

export function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization")
}

export function requireAuth(
  req: VercelRequest,
  res: VercelResponse,
): { id: string; email: string } | null {
  const auth = req.headers.authorization
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" })
    return null
  }
  try {
    return verifyToken(auth.slice(7))
  } catch {
    res.status(401).json({ error: "Invalid token" })
    return null
  }
}
