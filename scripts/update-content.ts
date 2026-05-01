import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// Only upserts changed values — does NOT delete existing content
const updates = [
  // Tarea 2: CTAs → WhatsApp
  { section: "hero",      key: "cta_href",         value: "https://wa.link/phjdep" },
  { section: "ctabanner", key: "cta1_href",         value: "https://wa.link/phjdep" },
  { section: "ctabanner", key: "cta2_href",         value: "https://wa.link/phjdep" },
  { section: "ctafinal",  key: "cta1_href",         value: "https://wa.link/phjdep" },
  { section: "ctafinal",  key: "cta2_href",         value: "https://wa.link/phjdep" },
  { section: "faq",       key: "contact_href",      value: "https://wa.link/phjdep" },
  // Tarea 3: Email
  { section: "footer",    key: "email",             value: "contacto@appsdeveloperspro.com" },
  { section: "ctafinal",  key: "email_contact",     value: "contacto@appsdeveloperspro.com" },
  { section: "ctafinal",  key: "microcopy",         value: "O escríbenos directo a contacto@appsdeveloperspro.com · Atendemos en español e inglés · Respuesta en 24 horas hábiles" },
  // Tarea 4: SEO global
  { section: "seo",       key: "meta_title",        value: "Apps Developers Pro — Desarrollo de Apps Shopify" },
  { section: "seo",       key: "meta_description",  value: "Agencia especializada en desarrollo de aplicaciones Shopify. Apps publicadas en el App Store, integraciones y soluciones a medida." },
]

async function main() {
  console.log("Actualizando contenido en DB...")
  for (const { section, key, value } of updates) {
    await prisma.siteContent.upsert({
      where: { section_key: { section, key } },
      update: { value },
      create: { section, key, value },
    })
    console.log(`  ✓ ${section}/${key}`)
  }
  console.log(`\n✓ ${updates.length} entradas actualizadas.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
