import type { VercelRequest, VercelResponse } from "@vercel/node"
import { prisma } from "./_lib/prisma.js"
import { setCors, requireAuth } from "./_lib/auth.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (req.method === "OPTIONS") { res.status(204).end(); return }

  try {
    if (req.method === "GET") {
      const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } })
      res.json(posts)
      return
    }

    if (req.method === "POST") {
      if (!requireAuth(req, res)) return
      const { title, slug, content, excerpt, published } = req.body as {
        title: string; slug: string; content: string; excerpt: string; published?: boolean
      }
      if (!title || !slug || !content || !excerpt) {
        res.status(400).json({ error: "title, slug, content, excerpt required" })
        return
      }
      const post = await prisma.blogPost.create({
        data: { title, slug, content, excerpt, published: published ?? false },
      })
      res.status(201).json(post)
      return
    }

    res.status(405).json({ error: "Method not allowed" })
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2002") {
      res.status(409).json({ error: "Slug already exists" })
      return
    }
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}
