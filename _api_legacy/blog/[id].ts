import type { VercelRequest, VercelResponse } from "@vercel/node"
import { prisma } from "../_lib/prisma.js"
import { setCors, requireAuth } from "../_lib/auth.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (req.method === "OPTIONS") { res.status(204).end(); return }
  const id = req.query.id as string

  try {
    if (req.method === "GET") {
      const post = await prisma.blogPost.findUnique({ where: { id } })
      if (!post) { res.status(404).json({ error: "Not found" }); return }
      res.json(post)
      return
    }

    if (req.method === "PUT") {
      if (!requireAuth(req, res)) return
      const { title, slug, content, excerpt, published, featured_image, meta_title, meta_description, faq_data } = req.body as {
        title?: string; slug?: string; content?: string; excerpt?: string; published?: boolean
        featured_image?: string; meta_title?: string; meta_description?: string; faq_data?: string | null
      }
      const post = await prisma.blogPost.update({
        where: { id },
        data: {
          ...(title             !== undefined && { title }),
          ...(slug              !== undefined && { slug }),
          ...(content           !== undefined && { content }),
          ...(excerpt           !== undefined && { excerpt }),
          ...(published         !== undefined && { published: published === true || (published as unknown) === 'true' }),
          ...(featured_image    !== undefined && { featured_image: featured_image || null }),
          ...(meta_title        !== undefined && { meta_title: meta_title || null }),
          ...(meta_description  !== undefined && { meta_description: meta_description || null }),
          ...(faq_data          !== undefined && { faq_data: faq_data || null }),
        },
      })
      res.json(post)
      return
    }

    if (req.method === "DELETE") {
      if (!requireAuth(req, res)) return
      await prisma.blogPost.delete({ where: { id } })
      res.json({ success: true })
      return
    }

    res.status(405).json({ error: "Method not allowed" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}
