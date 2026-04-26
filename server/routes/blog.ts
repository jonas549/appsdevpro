import { Router } from "express"
import { prisma } from "../lib/prisma"
import { requireAuth } from "../lib/auth"

const router = Router()

router.get("/", async (_req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } })
    res.json(posts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({ where: { id: req.params.id } })
    if (!post) { res.status(404).json({ error: "Not found" }); return }
    res.json(post)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, slug, content, excerpt, published } = req.body as {
      title: string; slug: string; content: string; excerpt: string; published?: boolean
    }
    if (!title || !slug || !content || !excerpt) {
      res.status(400).json({ error: "title, slug, content, excerpt required" }); return
    }
    const post = await prisma.blogPost.create({ data: { title, slug, content, excerpt, published: published ?? false } })
    res.status(201).json(post)
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2002") { res.status(409).json({ error: "Slug already exists" }); return }
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { title, slug, content, excerpt, published } = req.body as {
      title?: string; slug?: string; content?: string; excerpt?: string; published?: boolean
    }
    const post = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: { ...(title && { title }), ...(slug && { slug }), ...(content && { content }), ...(excerpt && { excerpt }), ...(published !== undefined && { published }) },
    })
    res.json(post)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

export default router
