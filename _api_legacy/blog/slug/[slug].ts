import type { VercelRequest, VercelResponse } from "@vercel/node"
import { prisma } from "../../_lib/prisma.js"
import { setCors } from "../../_lib/auth.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (req.method === "OPTIONS") { res.status(204).end(); return }
  if (req.method !== "GET") { res.status(405).json({ error: "Method not allowed" }); return }

  const slug = req.query.slug as string
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug } })
    if (!post) { res.status(404).json({ error: "Not found" }); return }
    res.json(post)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}
