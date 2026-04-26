import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const siteContent = [
  // ── Hero ──────────────────────────────────────────────────────────────────
  { section: "hero", key: "heading",      value: "Desarrollo de Apps y Tiendas {{Shopify}}" },
  { section: "hero", key: "description",  value: "Construimos apps Shopify a medida, integraciones con sistemas externos y tiendas Shopify completas para merchants que necesitan más de lo que ofrece el App Store. Desde apps publicadas en el Shopify App Store hasta soluciones privadas conectadas a tu ERP o CRM, desarrollamos exactamente lo que tu operación requiere." },
  { section: "hero", key: "support_text", value: "Somos un equipo enfocado al 100% en el ecosistema Shopify. No hacemos WordPress, no hacemos apps móviles, no somos generalistas: desarrollamos apps Shopify, custom apps, checkout extensions, integraciones API y themes Shopify 2.0 con un stack moderno basado en Remix, TypeScript, Node.js y PostgreSQL. Ya tenemos apps en producción con merchants reales pagando suscripción mensual — no estamos aprendiendo con tu proyecto." },
  { section: "hero", key: "cta_label",    value: "Solicitar propuesta gratuita →" },
  { section: "hero", key: "cta_href",     value: "#contacto" },
  { section: "hero", key: "cta2_label",   value: "Ver apps publicadas" },
  { section: "hero", key: "microcopy",    value: "Respuesta técnica en 48 horas · Sin compromiso · Atención en español e inglés" },
  { section: "hero", key: "video_url",    value: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4" },

  // ── El Problema ───────────────────────────────────────────────────────────
  { section: "problem", key: "label",         value: "● El Problema" },
  { section: "problem", key: "heading",       value: "Las apps genéricas del marketplace no resuelven tu problema específico" },
  { section: "problem", key: "description",   value: "Cada tienda Shopify tiene reglas de negocio propias, integraciones con sistemas internos y flujos operativos únicos que no encajan en una app de catálogo. Las apps de $9 al mes del Shopify App Store están diseñadas para el caso promedio: descuentos básicos, gestión simple de inventario, integraciones estándar de envío. El problema aparece cuando tu operación crece y empiezas a chocar con los límites de esas apps genéricas: configuraciones que no se pueden personalizar, integraciones que no existen, lógica de negocio que tu equipo termina resolviendo manualmente con planillas de Excel." },
  { section: "problem", key: "description_2", value: "La consecuencia es siempre la misma. Tu equipo pierde horas operativas repitiendo procesos que deberían estar automatizados. Tu conversión se estanca porque el checkout no permite las validaciones que tu negocio requiere. Tu AOV no crece porque las apps de descuentos no soportan las reglas que necesitas para hacer cross-sell real. Y cuando intentas escalar a otro mercado, descubres que las apps que usas no soportan multi-store, multi-moneda o sincronización con tu ERP. Ahí es donde una app Shopify a medida deja de ser un lujo y se convierte en una decisión de negocio." },
  { section: "problem", key: "description_3", value: "Nosotros entramos justo en ese punto. Identificamos qué parte de tu operación está siendo limitada por software genérico, diseñamos una solución Shopify personalizada que se adapta a tu flujo real, y la construimos con tecnología que escala a la par de tu negocio. No vendemos plantillas ni proyectos enlatados — cada app que entregamos está hecha específicamente para el problema del cliente que la encarga." },

  // ── La Solución ───────────────────────────────────────────────────────────
  { section: "solution", key: "label",      value: "● La Solución" },
  { section: "solution", key: "heading",    value: "Construimos exactamente lo que tu tienda Shopify necesita" },
  { section: "solution", key: "item1_title", value: "Apps Shopify a medida para tu flujo de negocio" },
  { section: "solution", key: "item1_desc",  value: "Desarrollamos apps Shopify personalizadas desde cero, adaptadas a la lógica específica de tu operación. Cuando tu modelo de descuentos, tu sistema de envíos o tu flujo de checkout requiere reglas que ninguna app pública contempla, la construimos exactamente como la necesitas. Trabajamos con el stack oficial recomendado por Shopify: Remix, TypeScript, PostgreSQL con Prisma y Polaris." },
  { section: "solution", key: "item2_title", value: "Integración de Shopify con tus sistemas internos" },
  { section: "solution", key: "item2_desc",  value: "Tu tienda Shopify tiene que conversar con tu ERP, CRM, WMS, sistemas de facturación electrónica, gateways de pago locales y cualquier API externa que tu operación requiera. Diseñamos integraciones robustas con webhooks confiables con reintentos automáticos, sincronización en tiempo real y arquitectura preparada para escalar. Hemos integrado Shopify con SAP, NetSuite, Holded, Odoo, Salesforce, HubSpot y más." },
  { section: "solution", key: "item3_title", value: "Apps publicadas en el Shopify App Store" },
  { section: "solution", key: "item3_desc",  value: "Tenemos apps activas en el Shopify App Store con merchants reales pagando suscripción mensual. Ya pasamos por todo el proceso de publicación oficial: cumplimiento de requisitos técnicos, billing recurrente, OAuth flow validado y respuesta a reviewers. Conocemos los motivos de rechazo más comunes y desarrollamos pensando en pasar el review desde el primer envío." },

  // ── Servicios ─────────────────────────────────────────────────────────────
  { section: "services", key: "heading",      value: "Todo lo que necesitas para desarrollar y escalar en {{Shopify}}" },
  { section: "services", key: "subheading",   value: "Especialistas en el ecosistema Shopify. Sin generalistas, sin proyectos paralelos en otras plataformas." },
  { section: "services", key: "main_label",   value: "Servicio principal" },
  { section: "services", key: "main_title",   value: "Desarrollo de Apps Shopify" },
  { section: "services", key: "main_desc",    value: "Construimos tu app Shopify de principio a fin: arquitectura técnica, frontend con React y Polaris, backend con Node.js y Remix, base de datos PostgreSQL, autenticación OAuth, billing recurrente, webhooks y publicación en el App Store. Cada app incluye documentación técnica, repositorio Git, pipeline de CI/CD y tests automatizados." },
  { section: "services", key: "main_tags",    value: "Remix,React,Node.js,PostgreSQL,Polaris,GraphQL Admin API" },
  { section: "services", key: "card1_id",     value: "02" },
  { section: "services", key: "card1_title",  value: "Apps Privadas (Custom Apps)" },
  { section: "services", key: "card1_desc",   value: "Desarrollamos apps privadas para merchants que necesitan funcionalidad exclusiva sin pasar por el review del App Store. Ideales para integraciones internas con sistemas sensibles, automatizaciones específicas y lógica de negocio propietaria. Tiempos más cortos, scope completo disponible." },
  { section: "services", key: "card1_tag",    value: "Custom App · Sin marketplace" },
  { section: "services", key: "card2_id",     value: "03" },
  { section: "services", key: "card2_title",  value: "Integraciones, APIs y Webhooks" },
  { section: "services", key: "card2_desc",   value: "Conectamos Shopify con cualquier sistema externo mediante APIs robustas y webhooks confiables. Sincronización bidireccional con ERP, CRM, WMS, facturación electrónica latinoamericana y herramientas de BI. Implementamos idempotencia, reintentos exponenciales y logs auditables." },
  { section: "services", key: "card2_tag",    value: "ERP · CRM · Webhooks · REST" },
  { section: "services", key: "card3_id",     value: "04" },
  { section: "services", key: "card3_title",  value: "Checkout Extensions y Shopify Plus" },
  { section: "services", key: "card3_desc",   value: "Upsells en checkout, validaciones personalizadas, descuentos dinámicos y bloques en thank you page. Trabajamos con la nueva arquitectura de checkout extensibility, no con los Script Editor o Checkout.liquid deprecados." },
  { section: "services", key: "card3_tag",    value: "Shopify Plus · Checkout UI" },
  { section: "services", key: "card4_id",     value: "05" },
  { section: "services", key: "card4_title",  value: "Themes Shopify 2.0 + Consultoría Técnica" },
  { section: "services", key: "card4_desc",   value: "Themes desde cero con arquitectura de secciones dinámicas, app blocks y JSON templates. Optimizados para Core Web Vitals. También auditorías técnicas para evaluar el stack de apps actual y proponer una hoja de ruta realista." },
  { section: "services", key: "card4_tag",    value: "Liquid · Shopify 2.0 · Auditoría" },

  // ── Apps propias ──────────────────────────────────────────────────────────
  { section: "apps", key: "heading",       value: "Apps que ya están resolviendo problemas reales en producción" },
  { section: "apps", key: "subheading",    value: "Publicadas en el Shopify App Store, en producción y con merchants reales pagando suscripción mensual. No te pedimos que confíes — te mostramos lo que ya construimos y está funcionando." },
  { section: "apps", key: "app1_status",   value: "active" },
  { section: "apps", key: "app1_badge",    value: "Publicada en Shopify App Store · Activa en producción" },
  { section: "apps", key: "app1_title",    value: "Calendify Delivery — Gestión de entregas con calendario y rangos horarios" },
  { section: "apps", key: "app1_desc",     value: "Calendify Delivery es una app Shopify de gestión de entregas que permite a los merchants ofrecer al cliente la elección de fecha de entrega y rango horario directamente desde el carrito o el checkout. Diseñada para tiendas que venden productos perecederos, voluminosos o servicios con instalación a domicilio. Panel de administración completo, configuración por zona de reparto y código postal, límite de capacidad por día, bloqueo de fechas y feriados, notificaciones automáticas. Más de 50 tiendas activas." },
  { section: "apps", key: "app1_tags",     value: "Shopify,Remix,TypeScript,PostgreSQL,Prisma,Vercel" },
  { section: "apps", key: "app1_cta",      value: "Ver en App Store →" },
  { section: "apps", key: "app1_store_url", value: "https://apps.shopify.com/calendify-delivery" },
  { section: "apps", key: "app2_status",   value: "upcoming" },
  { section: "apps", key: "app2_badge",    value: "Próximamente en Shopify App Store · En desarrollo activo" },
  { section: "apps", key: "app2_title",    value: "Descuentify — Motor de descuentos avanzado para Shopify" },
  { section: "apps", key: "app2_desc",     value: "Descuentify es un motor de descuentos para Shopify que va más allá de las reglas nativas. Pensada para merchants que necesitan descuentos por volumen escalonado, combos entre variantes, bulk price editor masivo, campañas con condiciones combinadas y reglas Buy X Get Y avanzadas que el sistema nativo no soporta. El objetivo es subir el ticket promedio (AOV) sin canibalizar margen. Construida con la Shopify Functions API." },
  { section: "apps", key: "app2_tags",     value: "Shopify,Remix,TypeScript,PostgreSQL,Shopify Functions,GraphQL Admin API" },
  { section: "apps", key: "app2_cta",      value: "Ver más →" },
  { section: "apps", key: "app2_store_url", value: "" },

  // ── CTA Banner intermedio ─────────────────────────────────────────────────
  { section: "ctabanner", key: "heading",    value: "¿Tu tienda Shopify necesita algo que no existe en el App Store?" },
  { section: "ctabanner", key: "desc",       value: "Si tienes un requerimiento que ninguna app del Shopify App Store cubre — hablemos. Sin compromiso, sin venta agresiva, sin formulario de 20 campos. En menos de 48 horas te enviamos una propuesta técnica detallada con arquitectura recomendada, stack técnico, plazo realista y presupuesto cerrado. Si vemos que el proyecto no encaja con nuestro perfil, también te lo decimos directamente." },
  { section: "ctabanner", key: "cta1_label", value: "Escríbenos ahora" },
  { section: "ctabanner", key: "cta2_label", value: "Agendar reunión" },
  { section: "ctabanner", key: "video_url",  value: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260330_145725_08886141-ed95-4a8e-8d6d-b75eaadce638.mp4" },

  // ── Proceso ───────────────────────────────────────────────────────────────
  { section: "process", key: "heading",    value: "Un proceso de desarrollo claro, sin sorpresas y con entregas verificables" },
  { section: "process", key: "subheading", value: "Desde la primera reunión hasta el lanzamiento en producción, sabes exactamente qué esperar en cada etapa, qué entregable recibes y en qué plazo." },
  { section: "process", key: "step1_num",   value: "01" },
  { section: "process", key: "step1_title", value: "Reunión inicial de descubrimiento" },
  { section: "process", key: "step1_desc",  value: "Una videollamada de 30 a 45 minutos donde entendemos tu problema real, los sistemas con los que ya trabajas (ERP, CRM, plataforma de email, gateway de pagos), los objetivos del proyecto y las restricciones técnicas o de negocio que tengas. No es una reunión comercial — es una sesión técnica donde hacemos las preguntas correctas para poder darte una propuesta seria. Sin compromiso de avanzar." },
  { section: "process", key: "step2_num",   value: "02" },
  { section: "process", key: "step2_title", value: "Propuesta técnica detallada en 48 horas" },
  { section: "process", key: "step2_desc",  value: "Te enviamos un documento de propuesta con: alcance funcional desglosado, arquitectura técnica recomendada, stack tecnológico justificado, plazo realista por fases, presupuesto cerrado, forma de pago, condiciones de soporte post-lanzamiento y supuestos del proyecto. Si algo no cuadra, lo iteramos antes de firmar. Nunca te enviamos una propuesta vaga de \"depende del alcance\"." },
  { section: "process", key: "step3_num",   value: "03" },
  { section: "process", key: "step3_title", value: "Desarrollo iterativo en sprints de 2 semanas" },
  { section: "process", key: "step3_desc",  value: "Trabajamos en sprints de 2 semanas con demos frecuentes al final de cada sprint. Ves el progreso real desde el primer sprint, no al final del proyecto cuando ya es tarde para cambiar cosas. Tienes acceso al repositorio Git desde el día uno, acceso al ambiente de staging y un canal directo de comunicación para resolver dudas durante el desarrollo." },
  { section: "process", key: "step4_num",   value: "04" },
  { section: "process", key: "step4_title", value: "QA, performance, seguridad y lanzamiento" },
  { section: "process", key: "step4_desc",  value: "Antes del lanzamiento hacemos testing exhaustivo manual y automatizado, revisión de performance (tiempos de carga, queries optimizadas, manejo de cache), auditoría de seguridad y despliegue controlado primero en staging y luego en producción. Si la app va al Shopify App Store, gestionamos también todo el proceso de review con el equipo de Shopify." },
  { section: "process", key: "step5_num",   value: "05" },
  { section: "process", key: "step5_title", value: "Soporte continuo y evolución del producto" },
  { section: "process", key: "step5_desc",  value: "Post-lanzamiento te acompañamos con planes de mantenimiento mensual: monitoreo activo, actualizaciones a nuevas versiones de la API de Shopify (que se liberan cada trimestre), resolución de bugs, mejoras incrementales y reportes mensuales de uso y performance. El código fuente siempre es tuyo desde el día uno." },

  // ── FAQ ───────────────────────────────────────────────────────────────────
  { section: "faq", key: "heading",       value: "Preguntas frecuentes sobre desarrollo de apps y tiendas Shopify" },
  { section: "faq", key: "subheading",    value: "Las preguntas más comunes que recibimos de merchants antes de empezar un proyecto. Si la tuya no está acá, escríbenos directamente y te respondemos en menos de 24 horas hábiles." },
  { section: "faq", key: "contact_label", value: "Hacer una pregunta →" },
  { section: "faq", key: "contact_href",  value: "mailto:hola@appsdevpro.com" },
  { section: "faq", key: "q1",  value: "¿Quiénes son Apps Developers Pro y por qué deberíamos contratarlos?" },
  { section: "faq", key: "a1",  value: "Apps Developers Pro es un equipo de desarrollo especializado al 100% en el ecosistema Shopify. No somos una agencia generalista — desarrollamos exclusivamente para Shopify, y esa especialización es lo que nos diferencia. Tenemos apps publicadas en el Shopify App Store con merchants reales pagando suscripción mensual, lo que significa que ya pasamos por el ciclo completo de desarrollo, review, lanzamiento, soporte y mantenimiento. Trabajamos en Latinoamérica y España, con atención en español e inglés, y experiencia integrando Shopify con sistemas locales de cada país." },
  { section: "faq", key: "q2",  value: "¿Cuánto cuesta desarrollar una app Shopify a medida?" },
  { section: "faq", key: "a2",  value: "Los rangos reales que manejamos: App privada simple: desde $2,000 USD. App privada con backend e integraciones externas: entre $4,000 y $8,000 USD. App pública para el Shopify App Store: desde $10,000 USD, con casos comunes entre $12,000 y $20,000 USD. El precio que te enviamos en la propuesta técnica es cerrado, no por hora, e incluye análisis funcional, diseño técnico, desarrollo, QA, despliegue y la primera fase de soporte post-lanzamiento." },
  { section: "faq", key: "q3",  value: "¿Cuánto tiempo toma desarrollar una app Shopify desde cero?" },
  { section: "faq", key: "a3",  value: "Apps privadas simples: 2 a 4 semanas. Apps privadas con integraciones a sistemas externos: 4 a 8 semanas. Apps públicas para el Shopify App Store: 8 a 12 semanas (más 1 a 3 semanas del proceso de review oficial de Shopify). Trabajamos en sprints de 2 semanas con demos al final de cada sprint, lo que significa que ves el avance real desde el principio." },
  { section: "faq", key: "q4",  value: "¿Qué tecnologías usan para desarrollar apps Shopify?" },
  { section: "faq", key: "a4",  value: "Usamos el stack oficial recomendado por Shopify: Remix como framework principal, TypeScript end-to-end, PostgreSQL con Prisma como ORM, Polaris para el frontend del admin, GraphQL Admin API y Storefront API para interactuar con Shopify, Shopify Functions API para descuentos y validaciones de checkout. Para hosting desplegamos en Vercel o Railway según los requisitos del proyecto." },
  { section: "faq", key: "q5",  value: "¿Publican apps en el Shopify App Store o solo desarrollan apps privadas?" },
  { section: "faq", key: "a5",  value: "Hacemos las dos cosas. Las apps privadas son más rápidas, no requieren review y son ideales cuando la funcionalidad es exclusiva para tu tienda. Las apps públicas tienen sentido cuando quieres monetizar la solución vendiéndosela a otros merchants. Cuando vamos por el App Store, gestionamos todo el proceso end-to-end: listing optimizado, screenshots, video demo, OAuth flow validado y respuesta a los reviewers de Shopify." },
  { section: "faq", key: "q6",  value: "¿Qué incluye el soporte post-lanzamiento?" },
  { section: "faq", key: "a6",  value: "Planes de mantenimiento mensual que incluyen: monitoreo activo con alertas automáticas, actualizaciones a nuevas versiones de la API de Shopify (cada trimestre), resolución de bugs, mejoras incrementales y reportes mensuales de uso y performance. El código fuente es siempre tuyo desde el día uno — no quedas atado a nosotros como proveedor único." },
  { section: "faq", key: "q7",  value: "¿Cómo es el proceso de pago?" },
  { section: "faq", key: "a7",  value: "Trabajamos con un esquema en tres tramos: 40% inicial al firmar la propuesta, 40% intermedio al entregar la versión beta funcional en staging, 20% restante al lanzamiento en producción. Aceptamos transferencia bancaria internacional, PayPal, Wise y Stripe. Facturamos en moneda local para clientes en Latinoamérica y España cuando la situación fiscal lo requiere." },
  { section: "faq", key: "q8",  value: "¿Trabajan con tiendas Shopify fuera de Latinoamérica?" },
  { section: "faq", key: "a8",  value: "Sí. Trabajamos con merchants en Latinoamérica, España, Estados Unidos y otros mercados internacionales. Toda la comunicación en español e inglés. Tenemos experiencia integrando Shopify con sistemas locales de distintos países: facturación electrónica chilena (SII), colombiana (DIAN), Holded en España, sistemas SAT en México, gateways de pago regionales (MercadoPago, Webpay, PSE, Wompi) y plataformas logísticas locales." },
  { section: "faq", key: "q9",  value: "¿Qué pasa si Shopify rechaza nuestra app durante el review?" },
  { section: "faq", key: "a9",  value: "Si después de nuestro desarrollo Shopify solicita cambios durante el review, los implementamos sin costo adicional y volvemos a enviar la app cuantas veces sea necesario hasta la aprobación final. Esto está incluido en el contrato. Los motivos típicos de rechazo incluyen problemas con la política de privacidad, scope de permisos incorrecto, performance insuficiente del listing, o errores en el OAuth flow — los conocemos bien y desarrollamos pensando en evitarlos desde el inicio." },
  { section: "faq", key: "q10", value: "¿Pueden ayudarnos si ya tenemos una app desarrollada por otro equipo?" },
  { section: "faq", key: "a10", value: "Sí. Tomamos proyectos heredados de otros desarrolladores. El primer paso es una auditoría técnica del código actual: calidad del código, arquitectura, estado de dependencias, versión de la API de Shopify, cobertura de tests y documentación disponible. Después de la auditoría, te decimos honestamente qué se puede aprovechar, qué hay que reescribir y cuánto costaría cada camino posible." },
  { section: "faq", key: "q11", value: "¿Pueden desarrollar también la tienda Shopify completa?" },
  { section: "faq", key: "a11", value: "Sí. Aunque nuestro foco principal son las apps Shopify, también desarrollamos tiendas completas: diseño y desarrollo del theme Shopify 2.0, configuración de productos, variantes, colecciones, mercados internacionales y políticas de envío. Trabajamos con themes Shopify 2.0 desde cero con arquitectura de secciones dinámicas, app blocks, JSON templates y performance optimizada para Core Web Vitals y SEO." },

  // ── CTA Final ─────────────────────────────────────────────────────────────
  { section: "ctafinal", key: "label",      value: "¿Listo para empezar?" },
  { section: "ctafinal", key: "heading",    value: "¿Tienes un proyecto de desarrollo Shopify en mente?" },
  { section: "ctafinal", key: "desc",       value: "Cuéntanos qué necesitas. En menos de 48 horas te enviamos una propuesta técnica detallada y sin compromiso con arquitectura recomendada, stack técnico justificado, plazo realista por fases y presupuesto cerrado. Si vemos que el proyecto encaja con nuestro perfil, empezamos a construir. Si vemos que no encaja, también te lo decimos directamente y, cuando es posible, te referimos a alguien que pueda ayudarte mejor." },
  { section: "ctafinal", key: "cta1_label", value: "Solicitar propuesta gratuita →" },
  { section: "ctafinal", key: "cta2_label", value: "Hablar por WhatsApp" },
  { section: "ctafinal", key: "microcopy",  value: "O escríbenos directo a hola@appsdevpro.com · Atendemos en español e inglés · Respuesta en 24 horas hábiles" },

  // ── Footer ────────────────────────────────────────────────────────────────
  { section: "footer", key: "description", value: "Agencia especializada en desarrollo de aplicaciones para Shopify y Shopify Plus. Transformamos necesidades técnicas en soluciones reales." },
  { section: "footer", key: "email",       value: "hola@appsdevpro.com" },
  { section: "footer", key: "copyright",   value: "© 2025 Apps Developers Pro. Todos los derechos reservados." },
]

async function main() {
  console.log("Clearing existing site content...")
  await prisma.siteContent.deleteMany({})

  console.log("Seeding fresh site content...")
  await prisma.siteContent.createMany({ data: siteContent })

  console.log(`✓ Seeded ${siteContent.length} content entries.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
