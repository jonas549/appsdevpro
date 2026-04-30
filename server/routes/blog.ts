import { Router } from "express"
import { prisma } from "../lib/prisma"
import { requireAuth } from "../lib/auth"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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

router.get("/slug/:slug", async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } })
    if (!post) { res.status(404).json({ error: "Not found" }); return }
    res.json(post)
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
    const { title, slug, content, excerpt, published, featured_image, meta_title, meta_description } = req.body as {
      title: string; slug: string; content: string; excerpt: string; published?: boolean
      featured_image?: string; meta_title?: string; meta_description?: string
    }
    if (!title || !slug || !excerpt) {
      res.status(400).json({ error: "title, slug, excerpt required" }); return
    }
    const post = await prisma.blogPost.create({
      data: {
        title, slug, content: content || "", excerpt,
        published: published ?? false,
        featured_image: featured_image || null,
        meta_title: meta_title || null,
        meta_description: meta_description || null,
      },
    })
    res.status(201).json(post)
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2002") { res.status(409).json({ error: "Slug already exists" }); return }
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { title, slug, content, excerpt, published, featured_image, meta_title, meta_description } = req.body as {
      title?: string; slug?: string; content?: string; excerpt?: string; published?: boolean
      featured_image?: string; meta_title?: string; meta_description?: string
    }
    const post = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: {
        ...(title             !== undefined && { title }),
        ...(slug              !== undefined && { slug }),
        ...(content           !== undefined && { content }),
        ...(excerpt           !== undefined && { excerpt }),
        ...(published         !== undefined && { published }),
        ...(featured_image    !== undefined && { featured_image: featured_image || null }),
        ...(meta_title        !== undefined && { meta_title: meta_title || null }),
        ...(meta_description  !== undefined && { meta_description: meta_description || null }),
      },
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

// Image upload endpoint (local dev)
router.post("/upload", requireAuth, async (req, res) => {
  try {
    const { data, folder = "blog" } = req.body as { data: string; folder?: string }
    if (!data) { res.status(400).json({ error: "data required" }); return }
    const result = await cloudinary.uploader.upload(data, {
      folder: `appsdevpro/${folder}`,
      resource_type: "image",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    })
    res.json({ url: result.secure_url, public_id: result.public_id })
  } catch (err) {
    console.error("Cloudinary upload error:", err)
    res.status(500).json({ error: "Upload failed" })
  }
})

export default router
