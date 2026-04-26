import type { VercelRequest, VercelResponse } from "@vercel/node"
import { setCors, requireAuth } from "../_lib/auth.js"

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (req.method === "OPTIONS") { res.status(204).end(); return }
  if (req.method !== "GET") { res.status(405).json({ error: "Method not allowed" }); return }

  const user = requireAuth(req, res)
  if (!user) return
  res.json({ id: user.id, email: user.email })
}
