import type { VercelRequest, VercelResponse } from "@vercel/node"
import { prisma } from "./_lib/prisma"
import { setCors, requireAuth } from "./_lib/auth"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (req.method === "OPTIONS") { res.status(204).end(); return }

  try {
    if (req.method === "GET") {
      const content = await prisma.siteContent.findMany({
        orderBy: [{ section: "asc" }, { key: "asc" }],
      })
      res.json(content)
      return
    }

    if (req.method === "PUT") {
      if (!requireAuth(req, res)) return
      const { section, key, value } = req.body as { section: string; key: string; value: string }
      if (!section || !key || value === undefined) {
        res.status(400).json({ error: "section, key and value required" })
        return
      }
      const entry = await prisma.siteContent.upsert({
        where: { section_key: { section, key } },
        update: { value },
        create: { section, key, value },
      })
      res.json(entry)
      return
    }

    res.status(405).json({ error: "Method not allowed" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}
