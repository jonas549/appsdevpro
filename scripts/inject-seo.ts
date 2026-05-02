import "dotenv/config"
import fs from "fs"
import path from "path"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client"

const DIST_HTML   = path.resolve("dist", "index.html")
const SITE_URL    = "https://appsdeveloperspro.com"
const DEFAULT_TITLE = "Apps Developers Pro — Desarrollo de Apps Shopify"
const DEFAULT_DESC  = "Agencia especializada en desarrollo de aplicaciones Shopify. Apps publicadas en el App Store, integraciones y soluciones a medida."
const DEFAULT_IMG   = `${SITE_URL}/og-image.png`

function esc(s: string) {
  return s.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

async function main() {
  let title = DEFAULT_TITLE
  let desc  = DEFAULT_DESC
  let img   = DEFAULT_IMG

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  })

  try {
    const rows = await prisma.siteContent.findMany({
      where: { section: "seo" },
      select: { key: true, value: true },
    })
    const seo: Record<string, string> = {}
    for (const { key, value } of rows) seo[key] = value

    if (seo.meta_title)       title = seo.meta_title
    if (seo.meta_description) desc  = seo.meta_description
    if (seo.og_image)         img   = seo.og_image
  } catch (err) {
    console.warn("[inject-seo] DB unavailable, using static defaults:", (err as Error).message)
  } finally {
    await prisma.$disconnect().catch(() => {})
  }

  if (!fs.existsSync(DIST_HTML)) {
    console.warn("[inject-seo] dist/index.html not found — skipping")
    return
  }

  let html = fs.readFileSync(DIST_HTML, "utf-8")

  // 1. Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)

  // 2. Replace <meta name="description">
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${esc(desc)}"`
  )

  // 3. Inject canonical + OG + Twitter tags before </head>
  const tags = [
    `<link rel="canonical" href="${SITE_URL}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Apps Developers Pro">`,
    `<meta property="og:locale" content="es_ES">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${SITE_URL}">`,
    `<meta property="og:image" content="${esc(img)}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(desc)}">`,
    `<meta name="twitter:image" content="${esc(img)}">`,
  ].join("\n  ")

  html = html.replace("</head>", `  ${tags}\n</head>`)

  fs.writeFileSync(DIST_HTML, html, "utf-8")

  console.log("[inject-seo] ✅ dist/index.html actualizado")
  console.log(`  title: ${title}`)
  console.log(`  desc : ${desc.slice(0, 70)}…`)
  console.log(`  image: ${img}`)
}

main().catch(err => {
  // Fallo silencioso: el build no se rompe, el HTML queda con los valores estáticos
  console.error("[inject-seo] Error (build continúa con defaults):", err)
  process.exit(0)
})
