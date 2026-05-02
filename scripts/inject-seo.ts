import "dotenv/config"
import fs from "fs"
import path from "path"

const DIST_HTML = path.resolve("dist", "index.html")
const SITE_URL  = "https://appsdeveloperspro.com"

// ─── Defaults ────────────────────────────────────────────────────────────────

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
    { title: "Apps Shopify a medida",            desc: "Desarrollamos apps Shopify personalizadas desde cero, con arquitectura técnica, OAuth y publicación en el App Store." },
    { title: "Integración con sistemas internos", desc: "Conectamos Shopify con tu ERP, CRM, sistemas de facturación y cualquier API externa mediante webhooks robustos." },
    { title: "Apps en el Shopify App Store",      desc: "Tenemos apps activas en el Shopify App Store con merchants reales pagando suscripción mensual." },
  ],
  servH2:  "Todo lo que necesitas para desarrollar y escalar en Shopify",
  servSub: "Especialistas en el ecosistema Shopify. Sin generalistas, sin proyectos paralelos en otras plataformas.",
  servItems: [
    { title: "Desarrollo de Apps Shopify",         desc: "Construimos tu app Shopify de principio a fin: arquitectura, React, Node.js, OAuth, billing recurrente y App Store." },
    { title: "Apps Privadas (Custom Apps)",         desc: "Apps privadas para merchants con funcionalidad exclusiva sin pasar por el review del App Store." },
    { title: "Integraciones, APIs y Webhooks",      desc: "Conectamos Shopify con cualquier sistema externo mediante APIs robustas y webhooks confiables." },
    { title: "Checkout Extensions y Shopify Plus",  desc: "Upsells, cross-sells y validaciones personalizadas en el checkout de Shopify Plus." },
    { title: "Themes Shopify 2.0",                 desc: "Themes desde cero con secciones dinámicas, app blocks y JSON templates optimizados para Core Web Vitals." },
  ],
  appsH2:  "Apps publicadas en el Shopify App Store",
  appsSub: "Apps con merchants reales pagando suscripción mensual.",
  procH2:  "Proceso de desarrollo",
  procSub: "Sprints de 2 semanas con demos al final de cada uno. Entregas verificables en cada etapa.",
  faqH2:   "Preguntas frecuentes sobre desarrollo de apps y tiendas Shopify",
  faqs: [
    { q: "¿Quiénes son Apps Developers Pro y por qué deberíamos contratarlos?",          a: "Apps Developers Pro es un equipo especializado al 100% en Shopify. No somos una agencia generalista. Tenemos apps publicadas en el Shopify App Store con merchants reales pagando suscripción mensual." },
    { q: "¿Cuánto cuesta desarrollar una app Shopify a medida?",                          a: "App privada simple: desde $2,000 USD. App con backend e integraciones: $4,000–$8,000 USD. App pública para el App Store: desde $10,000 USD. Precio cerrado, no por hora." },
    { q: "¿Cuánto tiempo toma desarrollar una app Shopify desde cero?",                   a: "Apps privadas simples: 2–4 semanas. Con integraciones: 4–8 semanas. Apps públicas para el App Store: 8–12 semanas más el review oficial de Shopify." },
    { q: "¿Qué tecnologías usan para desarrollar apps Shopify?",                          a: "Stack oficial de Shopify: Remix, TypeScript, PostgreSQL con Prisma, Polaris, GraphQL Admin API y Storefront API. Hosting en Vercel o Railway." },
    { q: "¿Publican apps en el Shopify App Store o solo desarrollan apps privadas?",      a: "Hacemos las dos cosas. Gestionamos todo el proceso end-to-end: listing, screenshots, video demo, OAuth flow validado y respuesta a reviewers." },
    { q: "¿Qué incluye el soporte post-lanzamiento?",                                     a: "Monitoreo activo, actualizaciones a nuevas versiones de la API de Shopify, resolución de bugs y mejoras incrementales. El código fuente es siempre tuyo." },
    { q: "¿Cómo es el proceso de pago?",                                                  a: "40% al firmar, 40% al entregar la beta funcional, 20% al lanzamiento. Aceptamos transferencia, PayPal, Wise y Stripe." },
    { q: "¿Trabajan con tiendas Shopify fuera de Latinoamérica?",                         a: "Sí. Latinoamérica, España, Estados Unidos y más. Comunicación en español e inglés." },
    { q: "¿Qué pasa si Shopify rechaza nuestra app durante el review?",                   a: "Implementamos los cambios solicitados sin costo adicional y reenviamos hasta la aprobación final. Incluido en el contrato." },
    { q: "¿Pueden ayudarnos si ya tenemos una app desarrollada por otro equipo?",         a: "Sí. Tomamos proyectos heredados. Hacemos una auditoría técnica y te decimos honestamente qué se puede aprovechar y qué hay que reescribir." },
    { q: "¿Pueden desarrollar también la tienda Shopify completa?",                       a: "Sí. Themes Shopify 2.0 desde cero con secciones dinámicas, app blocks, JSON templates y performance optimizada para Core Web Vitals." },
  ],
  ctaH2:    "¿Tu tienda Shopify necesita algo que no existe en el App Store?",
  ctaDesc:  "En menos de 48 horas te enviamos una propuesta técnica detallada con arquitectura, stack, plazo y presupuesto cerrado.",
  finalH2:  "¿Tienes un proyecto de desarrollo Shopify en mente?",
  finalDesc: "Solicita una propuesta técnica gratuita. Respuesta en menos de 48 horas.",
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function plain(s: string): string {
  return s.replace(/\{\{(.+?)\}\}/g, "$1").replace(/<[^>]*>/g, "").trim()
}

function get(cms: Record<string, Record<string, string>>, section: string, key: string, fallback: string): string {
  return plain(cms[section]?.[key] || fallback)
}

// ─── Build full static HTML for AI crawlers ──────────────────────────────────

function buildAiHtml(cms: Record<string, Record<string, string>>, title: string, desc: string, img: string): string {
  const seo      = cms["seo"]      || {}
  const faq      = cms["faq"]      || {}
  const apps     = cms["apps"]     || {}
  const ctafinal = cms["ctafinal"] || {}

  const h1        = get(cms, "hero",      "heading",      D.heroH1)
  const heroDesc  = get(cms, "hero",      "description",  D.heroDesc)
  const heroSup   = get(cms, "hero",      "support_text", D.heroSup)
  const heroCta   = get(cms, "hero",      "cta_label",    "Solicitar propuesta gratuita")
  const heroHref  = plain(cms["hero"]?.cta_href || "https://wa.link/phjdep")

  const probH2    = get(cms, "problem",   "heading",      D.probH2)
  const probDesc  = get(cms, "problem",   "description",  D.probDesc)
  const solH2     = get(cms, "solution",  "heading",      D.solH2)
  const solItems  = D.solItems.map((def, i) => ({
    title: get(cms, "solution", `item${i + 1}_title`, def.title),
    desc:  get(cms, "solution", `item${i + 1}_desc`,  def.desc),
  }))

  const servH2    = get(cms, "services",  "heading",      D.servH2)
  const servSub   = get(cms, "services",  "subheading",   D.servSub)
  const servMain  = {
    title: get(cms, "services", "main_title", D.servItems[0].title),
    desc:  get(cms, "services", "main_desc",  D.servItems[0].desc),
  }
  const servCards = D.servItems.slice(1).map((def, i) => ({
    title: get(cms, "services", `card${i + 1}_title`, def.title),
    desc:  get(cms, "services", `card${i + 1}_desc`,  def.desc),
  }))

  const appsH2   = get(cms, "apps", "heading",    "Apps que ya están resolviendo problemas reales en producción")
  const appsSub  = get(cms, "apps", "subheading", "Publicadas en el Shopify App Store, en producción y con merchants reales pagando suscripción mensual.")
  const APP_DEFS = [
    { title: "Calendify Delivery",         subtitle: "Gestión de entregas con calendario y rangos horarios",         desc: "Calendify Delivery es una app Shopify de gestión de entregas que permite a los merchants ofrecer al cliente la elección de fecha de entrega y rango horario directamente desde el carrito o el checkout. Diseñada para tiendas que venden productos perecederos, voluminosos o servicios con instalación a domicilio. Incluye panel de administración completo, configuración por zona de reparto y código postal, límite de capacidad por día, bloqueo de fechas y feriados, notificaciones automáticas e integración con los datos del pedido en Shopify. Más de 50 tiendas activas la usan hoy en producción.", badge: "Publicada en Shopify App Store · Activa en producción", tags: "Shopify, Remix, TypeScript, PostgreSQL, Prisma, Vercel", cta: "Ver en App Store", store_url: "https://apps.shopify.com/calendify-delivery" },
    { title: "Descuentify",                subtitle: "Motor de descuentos avanzado para Shopify",                    desc: "Descuentify es un motor de descuentos para Shopify que va más allá de las reglas nativas. Para merchants que necesitan descuentos por volumen escalonado, combos entre variantes específicas, bulk price editor masivo, campañas con condiciones combinadas y reglas Buy X Get Y avanzadas. El objetivo es subir el ticket promedio (AOV) sin canibalizar margen.", badge: "Próximamente en Shopify App Store · En desarrollo activo", tags: "Shopify, Remix, TypeScript, PostgreSQL, Shopify Functions, GraphQL Admin API", cta: "Ver más", store_url: "" },
    { title: "Apps Privadas para Clientes", subtitle: "Integraciones, automatizaciones y paneles internos",          desc: "También desarrollamos apps privadas para clientes que prefieren mantener sus integraciones fuera del App Store: integraciones con ERPs propios, herramientas de operación logística específica, paneles internos de gestión, automatizaciones B2B y conectores con sistemas legacy.", badge: "Custom Apps Privadas · Bajo NDA", tags: "ERP, CRM, WMS, Integración, Automatización, B2B", cta: "Hablemos", store_url: "" },
  ]
  const appItems = APP_DEFS.map((def, i) => ({
    title:     plain(apps[`app${i + 1}_title`]     || def.title),
    subtitle:  plain(apps[`app${i + 1}_subtitle`]  || def.subtitle),
    desc:      plain(apps[`app${i + 1}_desc`]      || def.desc),
    badge:     plain(apps[`app${i + 1}_badge`]     || def.badge),
    tags:      plain(apps[`app${i + 1}_tags`]      || def.tags),
    cta:       plain(apps[`app${i + 1}_cta`]       || def.cta),
    store_url: plain(apps[`app${i + 1}_store_url`] || def.store_url),
  }))

  const procH2    = get(cms, "process", "heading",    D.procH2)
  const procSub   = get(cms, "process", "subheading", D.procSub)
  const PROC_DEFS = [
    { num: "01", title: "Reunión inicial de descubrimiento",           desc: "Una videollamada de 30 a 45 minutos donde entendemos tu problema real, los sistemas con los que ya trabajas y los objetivos del proyecto. No es una reunión comercial — es una sesión técnica." },
    { num: "02", title: "Propuesta técnica detallada en 48 horas",     desc: "Te enviamos un documento con alcance funcional desglosado, arquitectura técnica recomendada, stack tecnológico justificado, plazo realista por fases y presupuesto cerrado." },
    { num: "03", title: "Desarrollo iterativo en sprints de 2 semanas", desc: "Trabajamos en sprints de 2 semanas con demos al final de cada uno. Ves el progreso real desde el primer sprint, con acceso al repositorio Git y al ambiente de staging desde el día uno." },
    { num: "04", title: "QA, performance, seguridad y lanzamiento",    desc: "Antes del lanzamiento hacemos testing exhaustivo, revisión de performance, auditoría de seguridad y despliegue controlado. Si la app va al App Store, gestionamos todo el proceso de review." },
    { num: "05", title: "Soporte continuo y evolución del producto",   desc: "Post-lanzamiento te acompañamos con monitoreo activo, actualizaciones a las nuevas versiones de la API de Shopify, resolución de bugs y mejoras incrementales. El código fuente siempre es tuyo." },
  ]
  const procSteps = PROC_DEFS.map((def, i) => ({
    num:   plain(cms["process"]?.[`step${i + 1}_num`]   || def.num),
    title: get(cms, "process", `step${i + 1}_title`, def.title),
    desc:  get(cms, "process", `step${i + 1}_desc`,  def.desc),
  }))

  const ctaH2     = get(cms, "ctabanner", "heading",    D.ctaH2)
  const ctaDesc   = get(cms, "ctabanner", "desc",       D.ctaDesc)
  const finalH2   = get(cms, "ctafinal",  "heading",    D.finalH2)
  const finalDesc = get(cms, "ctafinal",  "subheading", D.finalDesc)
  const finalHref = plain(ctafinal.cta_href || "https://wa.link/phjdep")
  const finalCta  = get(cms, "ctafinal",  "cta_label",  "Solicitar propuesta gratuita")

  const faqH2    = get(cms, "faq", "heading", D.faqH2)
  const faqItems = Array.from({ length: 11 }, (_, i) => ({
    q: plain(faq[`q${i + 1}`] || D.faqs[i]?.q || ""),
    a: plain(faq[`a${i + 1}`] || D.faqs[i]?.a || ""),
  })).filter(f => f.q && f.a)

  const canonical = plain(seo.canonical || SITE_URL)

  const head = [
    `  <meta charset="UTF-8">`,
    `  <meta name="viewport" content="width=device-width, initial-scale=1.0">`,
    `  <title>${esc(title)}</title>`,
    `  <meta name="description" content="${esc(desc)}">`,
    `  <link rel="canonical" href="${esc(canonical)}">`,
    `  <meta property="og:type" content="website">`,
    `  <meta property="og:site_name" content="Apps Developers Pro">`,
    `  <meta property="og:locale" content="es_ES">`,
    `  <meta property="og:title" content="${esc(title)}">`,
    `  <meta property="og:description" content="${esc(desc)}">`,
    `  <meta property="og:url" content="${esc(canonical)}">`,
    `  <meta property="og:image" content="${esc(img)}">`,
    `  <meta property="og:image:width" content="1200">`,
    `  <meta property="og:image:height" content="630">`,
    `  <meta name="twitter:card" content="summary_large_image">`,
    `  <meta name="twitter:title" content="${esc(title)}">`,
    `  <meta name="twitter:description" content="${esc(desc)}">`,
    `  <meta name="twitter:image" content="${esc(img)}">`,
  ].join("\n")

  const body = [
    `<header><nav><a href="${SITE_URL}">Apps Developers Pro</a> | <a href="${SITE_URL}/blog">Blog</a></nav></header>`,
    `<main>`,
    `  <section aria-label="Inicio"><h1>${esc(h1)}</h1>${heroDesc ? `<p>${esc(heroDesc)}</p>` : ""}${heroSup ? `<p>${esc(heroSup)}</p>` : ""}<a href="${esc(heroHref)}">${esc(heroCta)}</a></section>`,
    `  <section aria-label="El problema"><h2>${esc(probH2)}</h2>${probDesc ? `<p>${esc(probDesc)}</p>` : ""}</section>`,
    `  <section aria-label="La solución"><h2>${esc(solH2)}</h2>${solItems.map(it => `<article><h3>${esc(it.title)}</h3><p>${esc(it.desc)}</p></article>`).join("")}</section>`,
    `  <section aria-label="Servicios"><h2>${esc(servH2)}</h2>${servSub ? `<p>${esc(servSub)}</p>` : ""}<article><h3>${esc(servMain.title)}</h3><p>${esc(servMain.desc)}</p></article>${servCards.map(it => `<article><h3>${esc(it.title)}</h3><p>${esc(it.desc)}</p></article>`).join("")}</section>`,
    `  <section aria-label="Apps publicadas" id="apps"><h2>${esc(appsH2)}</h2>${appsSub ? `<p>${esc(appsSub)}</p>` : ""}${appItems.map(app => `<article><h3>${esc(app.title)}</h3><p>${esc(app.subtitle)}</p><p>${esc(app.badge)}</p><p>${esc(app.desc)}</p><p>Tecnologías: ${esc(app.tags)}</p>${app.store_url ? `<a href="${esc(app.store_url)}">${esc(app.cta)}</a>` : `<span>${esc(app.cta)}</span>`}</article>`).join("")}</section>`,
    `  <section aria-label="Proceso" id="proceso"><h2>${esc(procH2)}</h2>${procSub ? `<p>${esc(procSub)}</p>` : ""}${procSteps.map(s => `<article><h3>${esc(s.num)}. ${esc(s.title)}</h3><p>${esc(s.desc)}</p></article>`).join("")}</section>`,
    `  <section aria-label="CTA"><h2>${esc(ctaH2)}</h2>${ctaDesc ? `<p>${esc(ctaDesc)}</p>` : ""}</section>`,
    `  <section aria-label="FAQ" id="faq"><h2>${esc(faqH2)}</h2>${faqItems.map(f => `<div><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join("")}</section>`,
    `  <section aria-label="Contacto"><h2>${esc(finalH2)}</h2>${finalDesc ? `<p>${esc(finalDesc)}</p>` : ""}<a href="${esc(finalHref)}">${esc(finalCta)}</a></section>`,
    `</main>`,
    `<footer><p>Apps Developers Pro — <a href="mailto:contacto@appsdeveloperspro.com">contacto@appsdeveloperspro.com</a></p></footer>`,
  ].filter(Boolean).join("\n")

  return `<!doctype html>\n<html lang="es">\n<head>\n${head}\n</head>\n<body>\n${body}\n</body>\n</html>`
}

// ─── Build SEO content for <noscript> ────────────────────────────────────────

function buildNoscriptContent(cms: Record<string, Record<string, string>>): string {
  const hero      = cms["hero"]      || {}
  const problem   = cms["problem"]   || {}
  const solution  = cms["solution"]  || {}
  const services  = cms["services"]  || {}
  const apps      = cms["apps"]      || {}
  const process   = cms["process"]   || {}
  const faq       = cms["faq"]       || {}
  const ctabanner = cms["ctabanner"] || {}
  const ctafinal  = cms["ctafinal"]  || {}

  const h1       = plain(hero.heading || D.heroH1)
  const heroDesc = plain(hero.description || D.heroDesc)
  const heroSup  = plain(hero.support_text || D.heroSup)
  const heroCta  = plain(hero.cta_label || "Solicitar propuesta gratuita")
  const heroHref = hero.cta_href || "https://wa.link/phjdep"

  const probH2   = get(cms, "problem",  "heading",   D.probH2)
  const probDesc = get(cms, "problem",  "description", D.probDesc)
  const solH2    = get(cms, "solution", "heading",   D.solH2)
  const solItems = D.solItems.map((def, i) => ({
    title: get(cms, "solution", `item${i + 1}_title`, def.title),
    desc:  get(cms, "solution", `item${i + 1}_desc`,  def.desc),
  }))

  const servH2    = get(cms, "services", "heading",    D.servH2)
  const servSub   = get(cms, "services", "subheading", D.servSub)
  const mainTitle = get(cms, "services", "main_title", D.servItems[0].title)
  const mainDesc  = get(cms, "services", "main_desc",  D.servItems[0].desc)
  const cardItems = D.servItems.slice(1).map((def, i) => ({
    title: get(cms, "services", `card${i + 1}_title`, def.title),
    desc:  get(cms, "services", `card${i + 1}_desc`,  def.desc),
  }))

  const appsH2  = get(cms, "apps",    "heading",    D.appsH2)
  const appsSub = get(cms, "apps",    "subheading", D.appsSub)
  const procH2  = get(cms, "process", "heading",    D.procH2)
  const procSub = get(cms, "process", "subheading", D.procSub)
  const faqH2   = get(cms, "faq",     "heading",    D.faqH2)

  const ctaH2   = get(cms, "ctabanner", "heading", D.ctaH2)
  const ctaDesc = get(cms, "ctabanner", "desc",    D.ctaDesc)
  const finalH2   = get(cms, "ctafinal", "heading",    D.finalH2)
  const finalDesc = get(cms, "ctafinal", "subheading", D.finalDesc)
  const finalHref = ctafinal.cta_href || "https://wa.link/phjdep"
  const finalCta  = get(cms, "ctafinal", "cta_label", "Solicitar propuesta gratuita")

  const faqItems = Array.from({ length: 11 }, (_, i) => ({
    q: plain(faq[`q${i + 1}`] || D.faqs[i]?.q || ""),
    a: plain(faq[`a${i + 1}`] || D.faqs[i]?.a || ""),
  })).filter(f => f.q && f.a)

  return [
    `<header>`,
    `  <nav><a href="${SITE_URL}">Apps Developers Pro</a> | <a href="${SITE_URL}/blog">Blog</a></nav>`,
    `</header>`,
    `<main>`,
    `  <section aria-label="Inicio">`,
    `    <h1>${esc(h1)}</h1>`,
    heroDesc ? `    <p>${esc(heroDesc)}</p>` : "",
    heroSup  ? `    <p>${esc(heroSup)}</p>`  : "",
    `    <a href="${esc(heroHref)}">${esc(heroCta)}</a>`,
    `  </section>`,
    `  <section aria-label="El Problema y la Solución">`,
    `    <h2>${esc(probH2)}</h2>`,
    probDesc ? `    <p>${esc(probDesc)}</p>` : "",
    `    <h2>${esc(solH2)}</h2>`,
    ...solItems.map(it => [
      `    <article>`,
      `      <h3>${esc(it.title)}</h3>`,
      `      <p>${esc(it.desc)}</p>`,
      `    </article>`,
    ].join("\n")),
    `  </section>`,
    `  <section aria-label="Servicios">`,
    `    <h2>${esc(servH2)}</h2>`,
    servSub ? `    <p>${esc(servSub)}</p>` : "",
    `    <article>`,
    `      <h3>${esc(mainTitle)}</h3>`,
    `      <p>${esc(mainDesc)}</p>`,
    `    </article>`,
    ...cardItems.map(it => [
      `    <article>`,
      `      <h3>${esc(it.title)}</h3>`,
      `      <p>${esc(it.desc)}</p>`,
      `    </article>`,
    ].join("\n")),
    `  </section>`,
    `  <section aria-label="Apps publicadas">`,
    `    <h2>${esc(appsH2)}</h2>`,
    appsSub ? `    <p>${esc(appsSub)}</p>` : "",
    `  </section>`,
    `  <section aria-label="Proceso de desarrollo">`,
    `    <h2>${esc(procH2)}</h2>`,
    procSub ? `    <p>${esc(procSub)}</p>` : "",
    `  </section>`,
    `  <section aria-label="Contacto CTA">`,
    `    <h2>${esc(ctaH2)}</h2>`,
    ctaDesc ? `    <p>${esc(ctaDesc)}</p>` : "",
    `  </section>`,
    `  <section aria-label="Preguntas frecuentes" id="faq">`,
    `    <h2>${esc(faqH2)}</h2>`,
    ...faqItems.map(f => [
      `    <div>`,
      `      <h3>${esc(f.q)}</h3>`,
      `      <p>${esc(f.a)}</p>`,
      `    </div>`,
    ].join("\n")),
    `  </section>`,
    `  <section aria-label="Contacto">`,
    `    <h2>${esc(finalH2)}</h2>`,
    finalDesc ? `    <p>${esc(finalDesc)}</p>` : "",
    `    <a href="${esc(finalHref)}">${esc(finalCta)}</a>`,
    `  </section>`,
    `</main>`,
  ].filter(Boolean).join("\n")
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(DIST_HTML)) {
    console.warn("[inject-seo] dist/index.html not found — skipping")
    return
  }

  let title = D.title
  let desc  = D.desc
  let img   = D.ogImage
  const cms: Record<string, Record<string, string>> = {}

  // PrismaClient INSIDE try/catch — garantiza que el HTML siempre se escribe
  try {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set")

    const { PrismaPg }    = await import("@prisma/adapter-pg")
    const { PrismaClient } = await import("../src/generated/prisma/client.js")

    const prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
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
    } finally {
      await prisma.$disconnect().catch(() => {})
    }
  } catch (err) {
    console.warn("[inject-seo] DB no disponible, usando defaults:", (err as Error).message)
  }

  // ── A partir de aquí SIEMPRE se ejecuta ────────────────────────────────────
  let html = fs.readFileSync(DIST_HTML, "utf-8")

  // 1. <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)

  // 2. <meta name="description">
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${esc(desc)}"`
  )

  // 3. OG + Twitter + canonical antes de </head>
  // Evita duplicar si ya existen (en redeploys sin cambio de hash de assets)
  if (!html.includes('property="og:title"')) {
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
  }

  // 4. Contenido SEO en <noscript> ANTES de <div id="root">
  //    - Navegadores con JS: <noscript> no se renderiza → cero flash visual
  //    - Crawlers sin JS (Anthropic, OpenAI, Perplexity, etc.): ven el HTML completo
  const noscriptContent = buildNoscriptContent(cms)
  const rootTag = '<div id="root"></div>'
  if (html.includes(rootTag)) {
    html = html.replace(
      rootTag,
      `<noscript>\n${noscriptContent}\n</noscript>\n  ${rootTag}`
    )
  } else {
    console.warn("[inject-seo] ⚠️  No se encontró <div id=\"root\"></div> — body sin cambios")
  }

  fs.writeFileSync(DIST_HTML, html, "utf-8")

  // Generar ai-render.html para crawlers de IA que descartan <noscript>
  const aiHtml = buildAiHtml(cms, title, desc, img)
  fs.writeFileSync(path.resolve("dist", "ai-render.html"), aiHtml, "utf-8")

  const faqCount = Object.keys(cms["faq"] || {}).filter(k => /^q\d+$/.test(k)).length
  console.log("[inject-seo] ✅ dist/index.html actualizado")
  console.log(`  title : ${title}`)
  console.log(`  desc  : ${desc.slice(0, 70)}…`)
  console.log(`  image : ${img}`)
  console.log(`  faqs  : ${faqCount} del CMS (${faqCount === 0 ? "usando defaults" : "reales"})`)
  console.log(`  método: <noscript> — invisible para usuarios con JS, visible para crawlers`)
}

main().catch(err => {
  console.error("[inject-seo] Error fatal (build continúa):", err)
  process.exit(0)
})
