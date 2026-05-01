import { Router } from "express"
import { prisma } from "../lib/prisma"
import { requireAuth } from "../lib/auth"

const router = Router()

router.get("/", async (_req, res) => {
  try {
    const content = await prisma.siteContent.findMany({ orderBy: [{ section: "asc" }, { key: "asc" }] })
    res.setHeader("Cache-Control", "no-store")
    res.json(content)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

router.put("/", requireAuth, async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

export default router
