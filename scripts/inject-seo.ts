import "dotenv/config"
import fs from "fs"
import path from "path"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client"

const DIST_HTML = path.resolve("dist", "index.html")
const SITE_URL  = "https://appsdeveloperspro.com"

// ─── Defaults (fallbacks si la DB no tiene los valores) ─────────────────────

const D = {
  title:    "Apps Developers Pro — Desarrollo de Apps Shopify",
  desc:     "Agencia especializada en desarrollo de aplicaciones Shopify. Apps publicadas en el App Store, integraciones y soluciones a medida.",
  ogImage:  `${SITE_URL}/og-image.png`,
  heroH1:   "Desarrollo de Apps y Tiendas Shopify",
  heroDesc: "Construimos apps Shopify a medida, integraciones con sistemas externos y tiendas Shopify completas para merchants que necesitan más de lo que ofrece el App Store.",
  heroSup:  "Somos un equipo enfocado al 100% en el ecosistema Shopify. Desarrollamos apps Shopify, checkout extensions, integraciones API y themes Shopify 2.0.",
  probH2:   "Las apps genéricas del marketplace no resuelven tu problema específico",
  probDesc: "Cada tienda Shopify tiene reglas de negocio propias, integraciones con sistemas internos y flujos operativos únicos que no encajan en una app de catálogo.",
  solH2:    "Construimos exactamente lo que tu tienda Shopify necesita",
  solItems: [
    { title: "Apps Shopify a medida",             desc: "Desarrollamos apps Shopify personalizadas desde cero, con arquitectura técnica, OAuth y publicación en el App Store." },
    { title: "Integración con sistemas internos",  desc: "Conectamos Shopify con tu ERP, CRM, sistemas de facturación y cualquier API externa mediante webhooks robustos." },
    { title: "Apps en el Shopify App Store",       desc: "Tenemos apps activas en el Shopify App Store con merchants reales pagando suscripción mensual." },
  ],
  servH2:   "Todo lo que necesitas para desarrollar y escalar en Shopify",
  servSub:  "Especialistas en el ecosistema Shopify. Sin generalistas, sin proyectos paralelos en otras plataformas.",
  servItems: [
    { title: "Desarrollo de Apps Shopify",          desc: "Construimos tu app Shopify de principio a fin: arquitectura, React, Node.js, OAuth, billing recurrente y App Store." },
    { title: "Apps Privadas (Custom Apps)",          desc: "Apps privadas para merchants con funcionalidad exclusiva sin pasar por el review del App Store." },
    { title: "Integraciones, APIs y Webhooks",       desc: "Conectamos Shopify con cualquier sistema externo mediante APIs robustas y webhooks confiables." },
    { title: "Checkout Extensions y Shopify Plus",   desc: "Upsells, cross-sells y validaciones personalizadas en el checkout de Shopify Plus." },
    { title: "Themes Shopify 2.0",                  desc: "Themes desde cero con secciones dinámicas, app blocks y JSON templates optimizados para Core Web Vitals." },
  ],
  appsH2:  "Apps publicadas en el Shopify App Store",
  appsSub: "Apps con merchants reales pagando suscripción mensual.",
  procH2:  "Proceso de desarrollo",
  faqH2:   "Preguntas frecuentes sobre desarrollo de apps y tiendas Shopify",
  faqs: [
    { q: "¿Quiénes son Apps Developers Pro y por qué deberíamos contratarlos?", a: "Apps Developers Pro es un equipo de desarrollo especializado al 100% en el ecosistema Shopify. No somos una agencia generalista — desarrollamos exclusivamente para Shopify, y esa especialización es lo que nos diferencia. Tenemos apps publicadas en el Shopify App Store con merchants reales pagando suscripción mensual." },
    { q: "¿Cuánto cuesta desarrollar una app Shopify a medida?", a: "App privada simple: desde $2,000 USD. App privada con backend e integraciones: entre $4,000 y $8,000 USD. App pública para el Shopify App Store: desde $10,000 USD. El precio es cerrado, no por hora, e incluye análisis funcional, diseño técnico, desarrollo, QA y despliegue." },
    { q: "¿Cuánto tiempo toma desarrollar una app Shopify desde cero?", a: "Apps privadas simples: 2 a 4 semanas. Apps con integraciones: 4 a 8 semanas. Apps públicas para el App Store: 8 a 12 semanas más el review oficial de Shopify. Trabajamos en sprints de 2 semanas con demos al final de cada sprint." },
    { q: "¿Qué tecnologías usan para desarrollar apps Shopify?", a: "Stack oficial de Shopify: Remix, TypeScript, PostgreSQL con Prisma, Polaris para el admin, GraphQL Admin API y Storefront API. Para hosting desplegamos en Vercel o Railway." },
    { q: "¿Publican apps en el Shopify App Store o solo desarrollan apps privadas?", a: "Hacemos las dos cosas. Cuando vamos por el App Store, gestionamos todo el proceso end-to-end: listing optimizado, screenshots, video demo, OAuth flow y respuesta a reviewers." },
    { q: "¿Qué incluye el soporte post-lanzamiento?", a: "Planes de mantenimiento mensual: monitoreo activo, actualizaciones a nuevas versiones de la API de Shopify, resolución de bugs, mejoras incrementales y reportes mensuales. El código fuente es siempre tuyo." },
    { q: "¿Cómo es el proceso de pago?", a: "40% inicial al firmar, 40% al entregar la versión beta funcional, 20% restante al lanzamiento. Aceptamos transferencia bancaria, PayPal, Wise y Stripe." },
    { q: "¿Trabajan con tiendas Shopify fuera de Latinoamérica?", a: "Sí. Trabajamos con merchants en Latinoamérica, España, Estados Unidos y otros mercados internacionales. Comunicación en español e inglés." },
  ],
  ctaH2:  "¿Tu tienda Shopify necesita algo que no existe en el App Store?",
  ctaDesc: "Sin compromiso, sin venta agresiva. En menos de 48 horas te enviamos una propuesta técnica detallada con arquitectura, stack técnico, plazo y presupuesto cerrado.",
  finalH2:  "¿Listo para empezar tu proyecto Shopify?",
  finalDesc: "Solicita una propuesta técnica gratuita. Respuesta en menos de 48 horas.",
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/** Strip {{accent}} markers and HTML tags */
function plain(s: string): string {
  return s.replace(/\{\{(.+?)\}\}/g, "$1").replace(/<[^>]*>/g, "").trim()
}

function get(cms: Record<string, Record<string, string>>, section: string, key: string, fallback: string): string {
  return plain(cms[section]?.[key] || fallback)
}

// ─── Build the static body content visible to crawlers ──────────────────────

function buildRoot(cms: Record<string, Record<string, string>>): string {
  const seo      = cms["seo"]      || {}
  const hero     = cms["hero"]     || {}
  const problem  = cms["problem"]  || {}
  const solution = cms["solution"] || {}
  const services = cms["services"] || {}
  const apps     = cms["apps"]     || {}
  const process  = cms["process"]  || {}
  const faq      = cms["faq"]      || {}
  const ctabanner = cms["ctabanner"] || {}
  const ctafinal  = cms["ctafinal"]  || {}

  const h1 = get(cms, "hero", "heading",
    get(cms, "seo", "meta_title", D.heroH1))

  // Hero
  const heroDesc = get(cms, "hero", "description", D.heroDesc)
  const heroSup  = get(cms, "hero", "support_text", D.heroSup)
  const heroCta  = get(cms, "hero", "cta_label",  "Solicitar propuesta gratuita")
  const heroHref = (hero.cta_href || "https://wa.link/phjdep").replace(/"/g, "&quot;")

  // Problem / Solution
  const probH2   = get(cms, "problem",  "heading",   D.probH2)
  const probDesc = get(cms, "problem",  "description", D.probDesc)
  const solH2    = get(cms, "solution", "heading",   D.solH2)
  const solItems = D.solItems.map((def, i) => ({
    title: get(cms, "solution", `item${i + 1}_title`, def.title),
    desc:  get(cms, "solution", `item${i + 1}_desc`,  def.desc),
  }))

  // Services
  const servH2  = get(cms, "services", "heading",  D.servH2)
  const servSub = get(cms, "services", "subheading", D.servSub)
  const mainTitle = get(cms, "services", "main_title", D.servItems[0].title)
  const mainDesc  = get(cms, "services", "main_desc",  D.servItems[0].desc)
  const cardItems = D.servItems.slice(1).map((def, i) => ({
    title: get(cms, "services", `card${i + 1}_title`, def.title),
    desc:  get(cms, "services", `card${i + 1}_desc`,  def.desc),
  }))

  // Apps
  const appsH2  = get(cms, "apps", "heading",    D.appsH2)
  const appsSub = get(cms, "apps", "subheading", D.appsSub)

  // Process
  const procH2  = get(cms, "process", "heading",    D.procH2)
  const procSub = get(cms, "process", "subheading", "Sprints de 2 semanas con demos al final de cada uno.")

  // FAQ
  const faqH2 = get(cms, "faq", "heading", D.faqH2)
  const faqItems = Array.from({ length: 11 }, (_, i) => ({
    q: plain(faq[`q${i + 1}`] || D.faqs[i]?.q || ""),
    a: plain(faq[`a${i + 1}`] || D.faqs[i]?.a || ""),
  })).filter(f => f.q && f.a)

  // CTA Banner
  const ctaH2  = get(cms, "ctabanner", "heading", D.ctaH2)
  const ctaDesc = get(cms, "ctabanner", "desc",   D.ctaDesc)

  // CTA Final
  const finalH2   = get(cms, "ctafinal", "heading",    D.finalH2)
  const finalDesc = get(cms, "ctafinal", "subheading", D.finalDesc)
  const finalHref = (ctafinal.cta_href || "https://wa.link/phjdep").replace(/"/g, "&quot;")
  const finalCta  = get(cms, "ctafinal", "cta_label", "Solicitar propuesta gratuita")

  // ── Assemble HTML ──────────────────────────────────────────────────────────
  const solItemsHtml = solItems.map(it =>
    `      <article>\n        <h3>${esc(it.title)}</h3>\n        <p>${esc(it.desc)}</p>\n      </article>`
  ).join("\n")

  const servCardsHtml = cardItems.map(it =>
    `      <article>\n        <h3>${esc(it.title)}</h3>\n        <p>${esc(it.desc)}</p>\n      </article>`
  ).join("\n")

  const faqHtml = faqItems.map(f =>
    `      <div>\n        <h3>${esc(f.q)}</h3>\n        <p>${esc(f.a)}</p>\n      </div>`
  ).join("\n")

  return `<div id="root">
  <header>
    <nav><a href="${SITE_URL}">Apps Developers Pro</a> | <a href="${SITE_URL}/blog">Blog</a></nav>
  </header>
  <main>
    <section aria-label="Inicio">
      <h1>${esc(h1)}</h1>
      <p>${esc(heroDesc)}</p>
      <p>${esc(heroSup)}</p>
      <a href="${heroHref}">${esc(heroCta)}</a>
    </section>

    <section aria-label="El Problema y la Solución">
      <h2>${esc(probH2)}</h2>
      <p>${esc(probDesc)}</p>
      <h2>${esc(solH2)}</h2>
${solItemsHtml}
    </section>

    <section aria-label="Servicios">
      <h2>${esc(servH2)}</h2>
      <p>${esc(servSub)}</p>
      <article>
        <h3>${esc(mainTitle)}</h3>
        <p>${esc(mainDesc)}</p>
      </article>
${servCardsHtml}
    </section>

    <section aria-label="Apps publicadas">
      <h2>${esc(appsH2)}</h2>
      <p>${esc(appsSub)}</p>
    </section>

    <section aria-label="Proceso de desarrollo">
      <h2>${esc(procH2)}</h2>
      <p>${esc(procSub)}</p>
    </section>

    <section aria-label="¿Necesitas una solución personalizada?">
      <h2>${esc(ctaH2)}</h2>
      <p>${esc(ctaDesc)}</p>
    </section>

    <section aria-label="Preguntas frecuentes" id="faq">
      <h2>${esc(faqH2)}</h2>
${faqHtml}
    </section>

    <section aria-label="Contacto">
      <h2>${esc(finalH2)}</h2>
      <p>${esc(finalDesc)}</p>
      <a href="${finalHref}">${esc(finalCta)}</a>
    </section>
  </main>
</div>`
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(DIST_HTML)) {
    console.warn("[inject-seo] dist/index.html not found — skipping")
    return
  }

  let title = D.title
  let desc  = D.desc
  let img   = D.ogImage
  const cms: Record<string, Record<string, string>> = {}

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  })

  try {
    const rows = await prisma.siteContent.findMany({
      select: { section: true, key: true, value: true },
    })
    for (const { section, key, value } of rows) {
      if (!cms[section]) cms[section] = {}
      cms[section][key] = value
    }

    const seo = cms["seo"] || {}
    if (seo.meta_title)       title = seo.meta_title
    if (seo.meta_description) desc  = seo.meta_description
    if (seo.og_image)         img   = seo.og_image
  } catch (err) {
    console.warn("[inject-seo] DB unavailable, usando defaults:", (err as Error).message)
  } finally {
    await prisma.$disconnect().catch(() => {})
  }

  let html = fs.readFileSync(DIST_HTML, "utf-8")

  // 1. Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)

  // 2. Replace <meta name="description">
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${esc(desc)}"`
  )

  // 3. Inject OG + Twitter + canonical before </head>
  const headTags = [
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
  ].map(t => `  ${t}`).join("\n")

  html = html.replace("</head>", `${headTags}\n</head>`)

  // 4. Replace <div id="root"></div> with full pre-rendered content
  html = html.replace(
    /<div id="root"><\/div>/,
    buildRoot(cms)
  )

  fs.writeFileSync(DIST_HTML, html, "utf-8")

  const faqCount = (cms["faq"] ? Object.keys(cms["faq"]).filter(k => /^q\d+$/.test(k)).length : 0)
  console.log("[inject-seo] ✅ dist/index.html actualizado")
  console.log(`  title   : ${title}`)
  console.log(`  desc    : ${desc.slice(0, 70)}…`)
  console.log(`  image   : ${img}`)
  console.log(`  secciones inyectadas: hero, problem/solution, services, apps, process, faq (${faqCount} preguntas del CMS), cta, contacto`)
}

main().catch(err => {
  console.error("[inject-seo] Error (build continúa con defaults):", err)
  process.exit(0)
})
