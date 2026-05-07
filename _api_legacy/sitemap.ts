import type { VercelRequest, VercelResponse } from "@vercel/node"
import { prisma } from "./_lib/prisma.js"

const SITE_URL = "https://appsdeveloperspro.com"

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    })

    const now = new Date().toISOString()

    const staticUrls = [
      { loc: `${SITE_URL}/`,     lastmod: now, changefreq: "weekly",  priority: "1.0" },
      { loc: `${SITE_URL}/blog`, lastmod: now, changefreq: "daily",   priority: "0.8" },
    ]

    const postUrls = posts.map(p => ({
      loc:        `${SITE_URL}/blog/${p.slug}`,
      lastmod:    p.updatedAt.toISOString(),
      changefreq: "monthly",
      priority:   "0.7",
    }))

    const toTag = ({ loc, lastmod, changefreq, priority }: typeof staticUrls[0]) =>
      `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      [...staticUrls, ...postUrls].map(toTag).join("\n") +
      `\n</urlset>`

    res.setHeader("Content-Type", "application/xml; charset=utf-8")
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600")
    res.status(200).send(xml)
  } catch (err) {
    console.error("[sitemap] Error:", err)
    res.status(500).send("Error generating sitemap")
  }
}
