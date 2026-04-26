import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const siteContent = [
  // ── Hero ──────────────────────────────────────────────────────────────────
  { section: "hero", key: "heading_line1", value: "Desarrollo de Apps y tiendas" },
  { section: "hero", key: "heading_line2", value: "Shopify" },
  { section: "hero", key: "description", value: "Desde apps publicadas en el App Store hasta integraciones a medida con tu ERP o CRM." },
  { section: "hero", key: "cta_label", value: "Solicitar propuesta" },
  { section: "hero", key: "cta_href", value: "#contacto" },
  { section: "hero", key: "video_url", value: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4" },

  // ── Problem / Solution ────────────────────────────────────────────────────
  { section: "problem", key: "label", value: "El Problema" },
  { section: "problem", key: "heading", value: "Las apps genéricas del marketplace no resuelven tu problema específico" },
  { section: "problem", key: "description", value: "Cada tienda Shopify tiene sus propias reglas de negocio, integraciones con sistemas externos y flujos únicos. Las apps de $9/mes están diseñadas para el caso promedio — no para el tuyo." },
  { section: "solution", key: "label", value: "La Solución" },
  { section: "solution", key: "heading", value: "Construimos exactamente lo que tu tienda necesita" },
  { section: "solution", key: "item1_title", value: "Apps a medida para tu flujo" },
  { section: "solution", key: "item1_desc", value: "Construimos exactamente lo que necesitas: desde lógica de negocio compleja hasta integraciones con sistemas externos." },
  { section: "solution", key: "item2_title", value: "Integración con tus sistemas" },
  { section: "solution", key: "item2_desc", value: "Conectamos Shopify con tu ERP, CRM, WMS o cualquier API externa de forma confiable y escalable." },
  { section: "solution", key: "item3_title", value: "Publicadas en el App Store" },
  { section: "solution", key: "item3_desc", value: "Tenemos experiencia publicando apps en el ecosistema de Shopify, cumpliendo todos los requisitos de la plataforma." },

  // ── Services ──────────────────────────────────────────────────────────────
  { section: "services", key: "heading", value: "Todo lo que necesitas para desarrollar en Shopify" },
  { section: "services", key: "subheading", value: "Especialistas en el ecosistema Shopify. Sin generalistas." },
  { section: "services", key: "main_id", value: "01" },
  { section: "services", key: "main_label", value: "Servicio principal" },
  { section: "services", key: "main_title", value: "Desarrollo de Apps Shopify" },
  { section: "services", key: "main_desc", value: "Construimos tu app Shopify de principio a fin: arquitectura, frontend, backend, base de datos y publicación en el App Store. Apps que escalan con tu negocio." },
  { section: "services", key: "main_tags", value: "Remix,React,Node.js,PostgreSQL" },
  { section: "services", key: "card1_id", value: "02" },
  { section: "services", key: "card1_title", value: "Apps Privadas" },
  { section: "services", key: "card1_desc", value: "Soluciones exclusivas para tu tienda, sin necesidad de pasar por el App Store. Funcionalidades totalmente personalizadas." },
  { section: "services", key: "card1_tag", value: "Shopify Private Apps" },
  { section: "services", key: "card2_id", value: "03" },
  { section: "services", key: "card2_title", value: "Integraciones" },
  { section: "services", key: "card2_desc", value: "Conectamos Shopify con tu ERP, CRM, WMS o cualquier sistema interno. APIs robustas y sincronización en tiempo real." },
  { section: "services", key: "card2_tag", value: "API & Webhooks" },
  { section: "services", key: "card3_id", value: "04" },
  { section: "services", key: "card3_title", value: "Checkout Extensions" },
  { section: "services", key: "card3_desc", value: "Upsells, validaciones y personalización avanzada del proceso de pago con las Checkout Extensions de Shopify." },
  { section: "services", key: "card3_tag", value: "Checkout UI" },
  { section: "services", key: "card4_id", value: "05" },
  { section: "services", key: "card4_title", value: "Themes + Consultoría" },
  { section: "services", key: "card4_desc", value: "Desarrollamos themes Shopify 2.0 y brindamos consultoría técnica para optimizar tu stack de comercio electrónico." },
  { section: "services", key: "card4_tag", value: "Theme Development" },

  // ── Apps ──────────────────────────────────────────────────────────────────
  { section: "apps", key: "heading", value: "Apps que ya están resolviendo problemas reales" },
  { section: "apps", key: "subheading", value: "Publicadas en el Shopify App Store, en producción, con merchants reales." },
  { section: "apps", key: "app1_id", value: "calendify" },
  { section: "apps", key: "app1_badge", value: "Publicada en Shopify App Store" },
  { section: "apps", key: "app1_title", value: "Calendify Delivery" },
  { section: "apps", key: "app1_desc", value: "App de gestión de entregas con selección de rangos horarios, notificaciones automáticas y panel de control para merchants. Más de 50 tiendas activas." },
  { section: "apps", key: "app1_tags", value: "Shopify,Remix,PostgreSQL,Vercel" },
  { section: "apps", key: "app2_id", value: "descuentify" },
  { section: "apps", key: "app2_badge", value: "Publicada en Shopify App Store" },
  { section: "apps", key: "app2_title", value: "Descuentify" },
  { section: "apps", key: "app2_desc", value: "Motor de descuentos avanzado para Shopify con reglas complejas, descuentos por volumen, combos y campañas personalizadas. Aumenta el AOV de tu tienda." },
  { section: "apps", key: "app2_tags", value: "Shopify,Node.js,React,GraphQL" },

  // ── Process ───────────────────────────────────────────────────────────────
  { section: "process", key: "heading", value: "Un proceso claro, sin sorpresas" },
  { section: "process", key: "subheading", value: "Desde la primera reunión hasta el lanzamiento, sabes exactamente qué esperar." },
  { section: "process", key: "step1_num", value: "01" },
  { section: "process", key: "step1_title", value: "Reunión inicial" },
  { section: "process", key: "step1_desc", value: "Entendemos tu problema, tus sistemas actuales y el objetivo del proyecto. Sin compromiso." },
  { section: "process", key: "step2_num", value: "02" },
  { section: "process", key: "step2_title", value: "Propuesta técnica" },
  { section: "process", key: "step2_desc", value: "En 48hs te enviamos una propuesta detallada: arquitectura, tecnologías, plazo y presupuesto." },
  { section: "process", key: "step3_num", value: "03" },
  { section: "process", key: "step3_title", value: "Desarrollo iterativo" },
  { section: "process", key: "step3_desc", value: "Sprints de 2 semanas con demos frecuentes. Tú ves el progreso real desde el primer sprint." },
  { section: "process", key: "step4_num", value: "04" },
  { section: "process", key: "step4_title", value: "QA y lanzamiento" },
  { section: "process", key: "step4_desc", value: "Testing exhaustivo, review de performance y despliegue controlado en tu tienda o en el App Store." },
  { section: "process", key: "step5_num", value: "05" },
  { section: "process", key: "step5_title", value: "Soporte continuo" },
  { section: "process", key: "step5_desc", value: "Post-lanzamiento con soporte activo, monitoreo y mejoras incrementales según el feedback." },

  // ── FAQ ───────────────────────────────────────────────────────────────────
  { section: "faq", key: "heading", value: "Preguntas frecuentes" },
  { section: "faq", key: "subheading", value: "Respondemos las dudas más comunes. Si tienes una pregunta específica, escríbenos directamente." },
  { section: "faq", key: "contact_label", value: "Hacer una pregunta →" },
  { section: "faq", key: "contact_href", value: "mailto:hola@appsdevpro.com" },
  { section: "faq", key: "q1", value: "¿Cuánto cuesta desarrollar una app Shopify?" },
  { section: "faq", key: "a1", value: "Desde $2,000 USD para apps privadas simples hasta $15,000+ para apps públicas con backend completo. El precio depende del alcance y la complejidad. Te damos presupuesto en 48hs." },
  { section: "faq", key: "q2", value: "¿Cuánto tiempo tarda el desarrollo?" },
  { section: "faq", key: "a2", value: "Las apps privadas pueden estar listas en 2-4 semanas. Las apps públicas para el App Store suelen tomar entre 6 y 12 semanas, incluyendo el proceso de revisión de Shopify." },
  { section: "faq", key: "q3", value: "¿Publican las apps en el Shopify App Store?" },
  { section: "faq", key: "a3", value: "Sí. Tenemos experiencia con todo el proceso de publicación: cumplimiento de requirements técnicos, listing, screenshots y proceso de review. Gestionamos todo." },
  { section: "faq", key: "q4", value: "¿Solo trabajan con Shopify?" },
  { section: "faq", key: "a4", value: "Nuestro foco es 100% Shopify. Esto nos permite ser mejores en lo que hacemos. No somos una agencia generalista — somos especialistas en el ecosistema Shopify." },
  { section: "faq", key: "q5", value: "¿Qué pasa después del lanzamiento?" },
  { section: "faq", key: "a5", value: "Ofrecemos planes de mantenimiento y soporte mensual. Monitoreamos la app, aplicamos actualizaciones de la API de Shopify y resolvemos bugs. El código fuente es tuyo." },
  { section: "faq", key: "q6", value: "¿Cómo es el proceso de pago?" },
  { section: "faq", key: "a6", value: "40% al inicio del proyecto, 40% en el hito de entrega de la versión beta, y 20% restante al lanzamiento. Aceptamos transferencia bancaria y PayPal." },
]

async function main() {
  console.log("Seeding database...")

  for (const item of siteContent) {
    await prisma.siteContent.upsert({
      where: { section_key: { section: item.section, key: item.key } },
      update: { value: item.value },
      create: item,
    })
  }

  console.log(`Seeded ${siteContent.length} content entries.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
