import type { VercelRequest, VercelResponse } from "@vercel/node"
import { prisma } from "../_lib/prisma.js"
import { setCors, requireAuth } from "../_lib/auth.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (req.method === "OPTIONS") { res.status(204).end(); return }
  const id = req.query.id as string

  try {
    if (req.method === "PUT") {
      if (!requireAuth(req, res)) return
      const { status } = req.body as { status?: string }
      const lead = await prisma.lead.update({
        where: { id },
        data: { ...(status !== undefined && { status }) },
      })
      res.json(lead)
      return
    }

    if (req.method === "DELETE") {
      if (!requireAuth(req, res)) return
      await prisma.lead.delete({ where: { id } })
      res.status(204).end()
      return
    }

    res.status(405).json({ error: "Method not allowed" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}
