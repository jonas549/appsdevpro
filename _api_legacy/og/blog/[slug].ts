import type { VercelRequest, VercelResponse } from "@vercel/node"
import { prisma } from "../../_lib/prisma.js"

const SITE_URL = "https://appsdeveloperspro.com"
const SITE_NAME = "Apps Developers Pro"
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query
  if (typeof slug !== "string") { res.status(400).end(); return }

  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: {
        title: true, excerpt: true, featured_image: true,
        meta_title: true, meta_description: true,
        published: true, createdAt: true,
      },
    })

    if (!post || !post.published) { res.status(404).end(); return }

    const title    = esc(post.meta_title || post.title)
    const desc     = esc(post.meta_description || post.excerpt)
    const image    = esc(post.featured_image || DEFAULT_OG_IMAGE)
    const url      = `${SITE_URL}/blog/${slug}`
    const fullTitle = `${title} | ${esc(SITE_NAME)}`
    const published = post.createdAt.toISOString()

    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600")
    res.status(200).send(
      `<!DOCTYPE html><html lang="es"><head>` +
      `<meta charset="UTF-8">` +
      `<title>${fullTitle}</title>` +
      `<meta name="description" content="${desc}">` +
      `<link rel="canonical" href="${url}">` +
      `<meta property="og:type" content="article">` +
      `<meta property="og:site_name" content="${esc(SITE_NAME)}">` +
      `<meta property="og:locale" content="es_ES">` +
      `<meta property="og:title" content="${fullTitle}">` +
      `<meta property="og:description" content="${desc}">` +
      `<meta property="og:url" content="${url}">` +
      `<meta property="og:image" content="${image}">` +
      `<meta property="og:image:width" content="1200">` +
      `<meta property="og:image:height" content="630">` +
      `<meta property="article:published_time" content="${published}">` +
      `<meta name="twitter:card" content="summary_large_image">` +
      `<meta name="twitter:title" content="${fullTitle}">` +
      `<meta name="twitter:description" content="${desc}">` +
      `<meta name="twitter:image" content="${image}">` +
      `<meta http-equiv="refresh" content="0;url=${url}">` +
      `</head><body><p>Redirigiendo a <a href="${url}">${title}</a>…</p></body></html>`
    )
  } catch (err) {
    console.error("[og/blog] Error:", err)
    res.status(500).end()
  }
}
