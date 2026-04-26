import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import type { Request, Response, NextFunction } from "express"

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-please-change-in-production"

export const hashPassword = (password: string) => bcrypt.hash(password, 12)
export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash)

export const signToken = (payload: { id: string; email: string }) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })

export const verifyToken = (token: string): { id: string; email: string } =>
  jwt.verify(token, JWT_SECRET) as { id: string; email: string }

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }
  try {
    const payload = verifyToken(auth.slice(7))
    ;(req as Request & { user: typeof payload }).user = payload
    next()
  } catch {
    res.status(401).json({ error: "Invalid token" })
  }
}
