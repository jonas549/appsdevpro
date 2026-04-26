import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const siteContent = [
  // ── Hero ──────────────────────────────────────────────────────────────────
  { section: "hero", key: "heading",      value: "Desarrollo de Apps y Tiendas {{Shopify}}" },
  { section: "hero", key: "description",  value: "Construimos **apps Shopify a medida**, **integraciones con sistemas externos** y **tiendas Shopify completas** para merchants que necesitan más de lo que ofrece el App Store. Desde **apps publicadas en el Shopify App Store** hasta **soluciones privadas conectadas a tu ERP o CRM**, desarrollamos exactamente lo que tu operación requiere." },
  { section: "hero", key: "support_text", value: "Somos un equipo enfocado al 100% en el **ecosistema Shopify**. No hacemos WordPress, no hacemos apps móviles, no somos generalistas: desarrollamos **apps Shopify**, **custom apps**, **checkout extensions**, **integraciones API** y **themes Shopify 2.0** con un stack moderno basado en **Remix, TypeScript, Node.js y PostgreSQL**. Ya tenemos apps en producción con merchants reales pagando suscripción mensual — no estamos aprendiendo con tu proyecto." },
  { section: "hero", key: "cta_label",    value: "Solicitar propuesta gratuita" },
  { section: "hero", key: "cta_href",     value: "#contacto" },
  { section: "hero", key: "cta2_label",   value: "Ver apps publicadas" },
  { section: "hero", key: "microcopy",    value: "Respuesta técnica en 48 horas · Sin compromiso · Atención en español e inglés" },
  { section: "hero", key: "video_url",    value: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4" },

  // ── El Problema ───────────────────────────────────────────────────────────
  { section: "problem", key: "label",         value: "● El Problema" },
  { section: "problem", key: "heading",       value: "Las apps genéricas del marketplace no resuelven tu problema específico" },
  { section: "problem", key: "description",   value: "Cada **tienda Shopify** tiene reglas de negocio propias, integraciones con sistemas internos y flujos operativos únicos que no encajan en una app de catálogo. Las **apps de $9 al mes** del Shopify App Store están diseñadas para el caso promedio: descuentos básicos, gestión simple de inventario, integraciones estándar de envío. El problema aparece cuando tu operación crece y empiezas a chocar con los límites de esas apps genéricas: configuraciones que no se pueden personalizar, integraciones que no existen, lógica de negocio que tu equipo termina resolviendo manualmente con planillas de Excel." },
  { section: "problem", key: "description_2", value: "La consecuencia es siempre la misma. Tu equipo pierde **horas operativas** repitiendo procesos que deberían estar automatizados. Tu **conversión** se estanca porque el checkout no permite las validaciones que tu negocio requiere. Tu **AOV (ticket promedio)** no crece porque las apps de descuentos no soportan las reglas que necesitas para hacer cross-sell real. Y cuando intentas escalar a otro mercado o agregar un nuevo canal, descubres que las apps que usas no soportan multi-store, multi-moneda o sincronización con tu ERP. Ahí es donde una **app Shopify a medida** deja de ser un lujo y se convierte en una decisión de negocio." },
  { section: "problem", key: "description_3", value: "Nosotros entramos justo en ese punto. Identificamos qué parte de tu operación está siendo limitada por software genérico, diseñamos una **solución Shopify personalizada** que se adapta a tu flujo real, y la construimos con tecnología que escala a la par de tu negocio. No vendemos plantillas ni proyectos enlatados — cada app que entregamos está hecha específicamente para el problema del cliente que la encarga." },

  // ── La Solución ───────────────────────────────────────────────────────────
  { section: "solution", key: "label",       value: "● La Solución" },
  { section: "solution", key: "heading",     value: "Construimos exactamente lo que tu tienda Shopify necesita" },
  { section: "solution", key: "item1_title", value: "Apps Shopify a medida para tu flujo de negocio" },
  { section: "solution", key: "item1_desc",  value: "Desarrollamos **apps Shopify personalizadas** desde cero, adaptadas a la lógica específica de tu operación. Cuando tu modelo de descuentos, tu sistema de envíos o tu flujo de checkout requiere reglas que ninguna app pública contempla, la construimos exactamente como la necesitas. Trabajamos con el **stack oficial recomendado por Shopify**: **Remix** como framework principal, **TypeScript** end-to-end para garantizar mantenibilidad, **PostgreSQL** con **Prisma** como ORM, y **Polaris** (la librería oficial de Shopify) para que el panel de administración de tu app se vea y funcione exactamente como una app nativa de Shopify. El resultado son **aplicaciones rápidas, escalables y compatibles con futuras actualizaciones de la API de Shopify**." },
  { section: "solution", key: "item2_title", value: "Integración de Shopify con tus sistemas internos" },
  { section: "solution", key: "item2_desc",  value: "Tu **tienda Shopify** no vive aislada: tiene que conversar con tu **ERP, CRM, WMS, sistemas de facturación electrónica, gateways de pago locales, plataformas de email marketing como Klaviyo, sistemas de logística regionales** y cualquier API externa que tu operación requiera. Diseñamos **integraciones robustas** con manejo correcto de errores, **webhooks confiables con reintentos automáticos**, sincronización en tiempo real cuando el negocio lo necesita, y arquitectura preparada para escalar al volumen de pedidos que tu tienda maneje. Hemos integrado Shopify con sistemas SAP, NetSuite, Holded, Odoo, Salesforce, HubSpot, sistemas propios de gestión y APIs de proveedores logísticos en distintos países de Latinoamérica y Europa." },
  { section: "solution", key: "item3_title", value: "Apps publicadas en el Shopify App Store" },
  { section: "solution", key: "item3_desc",  value: "Tenemos **apps activas en el Shopify App Store** con merchants reales pagando suscripción mensual. Eso significa que ya pasamos por **todo el proceso de publicación oficial de Shopify**: cumplimiento de los requisitos técnicos, configuración del **billing recurrente**, **scope de permisos correctamente justificado**, **política de privacidad y términos de servicio**, **screenshots optimizados**, **video demo del listing**, **OAuth flow validado** y **respuesta a los reviewers de Shopify** durante el proceso de aprobación. Conocemos los **motivos de rechazo más comunes** y desarrollamos pensando en pasar el review desde el primer envío, no después de tres iteraciones perdidas." },

  // ── Servicios ─────────────────────────────────────────────────────────────
  { section: "services", key: "heading",      value: "Todo lo que necesitas para desarrollar y escalar en {{Shopify}}" },
  { section: "services", key: "subheading",   value: "**Especialistas en el ecosistema Shopify**. Sin generalistas, sin proyectos paralelos en otras plataformas, sin \"también hacemos WordPress\"." },
  { section: "services", key: "main_label",   value: "Servicio principal" },
  { section: "services", key: "main_title",   value: "Desarrollo de Apps Shopify" },
  { section: "services", key: "main_desc",    value: "Construimos tu **app Shopify** de principio a fin: **arquitectura técnica, frontend con React y Polaris, backend con Node.js y Remix, base de datos PostgreSQL, autenticación OAuth con Shopify, billing recurrente, webhooks, jobs en background y publicación final en el App Store**. Apps que escalan con tu negocio, actualizadas al ritmo de las versiones trimestrales de la API de Shopify y preparadas para manejar miles de tiendas instaladas. Cada app incluye documentación técnica, repositorio Git, pipeline de CI/CD y tests automatizados." },
  { section: "services", key: "main_tags",    value: "Remix,React,Node.js,PostgreSQL,Polaris,GraphQL Admin API" },
  { section: "services", key: "card1_id",     value: "02" },
  { section: "services", key: "card1_title",  value: "Apps Privadas (Custom Apps)" },
  { section: "services", key: "card1_desc",   value: "Desarrollamos **apps privadas Shopify** —también llamadas **custom apps**— para merchants que necesitan funcionalidad exclusiva sin pasar por el review del App Store. Ideales para **integraciones internas con sistemas sensibles**, **automatizaciones específicas de tu operación**, **paneles de administración interna** o **lógica de negocio propietaria**. Sin proceso de review, scope completo de permisos disponible y tiempos más cortos." },
  { section: "services", key: "card1_tag",    value: "Custom App · Sin marketplace" },
  { section: "services", key: "card2_id",     value: "03" },
  { section: "services", key: "card2_title",  value: "Integraciones, APIs y Webhooks" },
  { section: "services", key: "card2_desc",   value: "Conectamos **Shopify con cualquier sistema externo** mediante APIs robustas y webhooks confiables. Sincronización bidireccional con **ERP, CRM, WMS, facturación electrónica latinoamericana** y herramientas de BI. Implementamos los patrones correctos: **idempotencia, reintentos exponenciales, dead letter queues, logs auditables y alertas en tiempo real**." },
  { section: "services", key: "card2_tag",    value: "ERP · CRM · Webhooks · REST" },
  { section: "services", key: "card3_id",     value: "04" },
  { section: "services", key: "card3_title",  value: "Checkout Extensions y Shopify Plus" },
  { section: "services", key: "card3_desc",   value: "Desarrollamos **Checkout Extensions** para Shopify Plus: **upsells y cross-sells en el checkout**, **validaciones personalizadas**, **descuentos dinámicos**, **bloques personalizados** en thank you page y order status page. Trabajamos con la **nueva arquitectura de checkout extensibility**, no con los Script Editor o Checkout.liquid deprecados." },
  { section: "services", key: "card3_tag",    value: "Shopify Plus · Checkout UI" },
  { section: "services", key: "card4_id",     value: "05" },
  { section: "services", key: "card4_title",  value: "Themes Shopify 2.0 + Consultoría Técnica" },
  { section: "services", key: "card4_desc",   value: "Desarrollamos **themes Shopify 2.0** desde cero con **secciones dinámicas, app blocks compatibles y JSON templates** optimizados para **Core Web Vitals**. También damos **consultoría técnica Shopify** para auditar tiendas existentes, identificar cuellos de botella y proponer una hoja de ruta técnica realista." },
  { section: "services", key: "card4_tag",    value: "Liquid · Shopify 2.0 · Auditoría" },

  // ── Apps propias ──────────────────────────────────────────────────────────
  { section: "apps", key: "heading",    value: "Apps que ya están resolviendo problemas reales en producción" },
  { section: "apps", key: "subheading", value: "**Publicadas en el Shopify App Store**, en **producción** y con **merchants reales pagando suscripción mensual**. No te pedimos que confíes — te mostramos lo que ya construimos y está funcionando." },

  { section: "apps", key: "app1_status",    value: "active" },
  { section: "apps", key: "app1_badge",     value: "Publicada en Shopify App Store · Activa en producción" },
  { section: "apps", key: "app1_title",     value: "Calendify Delivery" },
  { section: "apps", key: "app1_subtitle",  value: "Gestión de entregas con calendario y rangos horarios" },
  { section: "apps", key: "app1_desc",      value: "**Calendify Delivery** es una **app Shopify de gestión de entregas** que permite a los merchants ofrecer al cliente la elección de **fecha de entrega y rango horario** directamente desde el carrito o el checkout. Está diseñada para tiendas que venden productos perecederos, productos voluminosos, servicios con instalación a domicilio, o cualquier categoría donde la coordinación logística con el cliente final sea crítica para evitar entregas fallidas.\n\nLa app incluye **panel de administración completo** para el merchant, **configuración por zona de reparto y código postal**, **límite de capacidad por día** (para no aceptar más pedidos de los que la operación puede entregar), **bloqueo de fechas y feriados**, **notificaciones automáticas al cliente** y al equipo logístico, e **integración con los datos del pedido en Shopify** para que la información de entrega aparezca correctamente en el admin. Más de **50 tiendas activas** la usan hoy en producción." },
  { section: "apps", key: "app1_tags",      value: "Shopify,Remix,TypeScript,PostgreSQL,Prisma,Vercel" },
  { section: "apps", key: "app1_cta",       value: "Ver en App Store →" },
  { section: "apps", key: "app1_store_url", value: "https://apps.shopify.com/calendify-delivery" },

  { section: "apps", key: "app2_status",    value: "upcoming" },
  { section: "apps", key: "app2_badge",     value: "Próximamente en Shopify App Store · En desarrollo activo" },
  { section: "apps", key: "app2_title",     value: "Descuentify" },
  { section: "apps", key: "app2_subtitle",  value: "Motor de descuentos avanzado para Shopify" },
  { section: "apps", key: "app2_desc",      value: "**Descuentify** es un **motor de descuentos para Shopify** que va más allá de las reglas nativas que la plataforma soporta. Está pensada para merchants que necesitan implementar **descuentos por volumen escalonado**, **combos entre variantes específicas**, **bulk price editor masivo** para actualizar precios de cientos de productos a la vez, **campañas con condiciones combinadas**, **reglas de Buy X Get Y avanzadas** y otras estrategias promocionales que el sistema nativo de descuentos de Shopify no permite configurar.\n\nEl objetivo de Descuentify es claro: **subir el ticket promedio (AOV) sin canibalizar margen**, dándole al merchant control real sobre la mecánica de cada promoción. Está construida con la **Shopify Functions API** para garantizar que los descuentos se apliquen correctamente al pricing del checkout, y con un panel de administración que cualquier persona del equipo de marketing puede usar sin necesidad de pasar por desarrollo cada vez que se lanza una campaña." },
  { section: "apps", key: "app2_tags",      value: "Shopify,Remix,TypeScript,PostgreSQL,Shopify Functions,GraphQL Admin API" },
  { section: "apps", key: "app2_cta",       value: "Ver más →" },
  { section: "apps", key: "app2_store_url", value: "" },

  { section: "apps", key: "app3_status",    value: "nda" },
  { section: "apps", key: "app3_badge",     value: "Custom Apps Privadas · Bajo NDA" },
  { section: "apps", key: "app3_title",     value: "Apps Privadas para Clientes" },
  { section: "apps", key: "app3_subtitle",  value: "Integraciones, automatizaciones y paneles internos" },
  { section: "apps", key: "app3_desc",      value: "También desarrollamos **apps privadas para clientes** que prefieren mantener sus integraciones fuera del App Store: **integraciones con ERPs propios**, **herramientas de operación logística específica**, **paneles internos de gestión**, **automatizaciones B2B** y **conectores con sistemas legacy**. No podemos mostrar capturas ni nombres por **NDA**, pero podemos contarte casos de uso similares al tuyo si tu proyecto encaja en este perfil durante la reunión inicial." },
  { section: "apps", key: "app3_tags",      value: "ERP,CRM,WMS,Integración,Automatización,B2B" },
  { section: "apps", key: "app3_cta",       value: "Hablemos →" },
  { section: "apps", key: "app3_store_url", value: "" },

  // ── CTA Banner intermedio ─────────────────────────────────────────────────
  { section: "ctabanner", key: "heading",    value: "¿Tu tienda Shopify necesita algo que no existe en el App Store?" },
  { section: "ctabanner", key: "desc",       value: "Si tienes un requerimiento que ninguna **app del Shopify App Store** cubre — hablemos. **Sin compromiso, sin venta agresiva, sin formulario de 20 campos**. En menos de **48 horas** te enviamos una **propuesta técnica detallada** con arquitectura recomendada, stack técnico, plazo realista y presupuesto cerrado. Si vemos que el proyecto no encaja con nuestro perfil, también te lo decimos directamente." },
  { section: "ctabanner", key: "cta1_label", value: "Escríbenos ahora" },
  { section: "ctabanner", key: "cta2_label", value: "Agendar reunión" },
  { section: "ctabanner", key: "video_url",  value: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260330_145725_08886141-ed95-4a8e-8d6d-b75eaadce638.mp4" },

  // ── Proceso ───────────────────────────────────────────────────────────────
  { section: "process", key: "heading",    value: "Un proceso de desarrollo claro, sin sorpresas y con entregas verificables" },
  { section: "process", key: "subheading", value: "Desde la primera reunión hasta el lanzamiento en producción, sabes exactamente qué esperar en cada etapa, qué entregable recibes y en qué plazo." },
  { section: "process", key: "step1_num",   value: "01" },
  { section: "process", key: "step1_title", value: "Reunión inicial de descubrimiento" },
  { section: "process", key: "step1_desc",  value: "Una videollamada de **30 a 45 minutos** donde entendemos tu problema real, los **sistemas con los que ya trabajas** (ERP, CRM, plataforma de email, gateway de pagos), los **objetivos del proyecto** y las **restricciones técnicas o de negocio** que tengas. No es una reunión comercial — es una sesión técnica donde hacemos las preguntas correctas para poder darte una propuesta seria. Sin compromiso de avanzar." },
  { section: "process", key: "step2_num",   value: "02" },
  { section: "process", key: "step2_title", value: "Propuesta técnica detallada en 48 horas" },
  { section: "process", key: "step2_desc",  value: "Te enviamos un **documento de propuesta** con: alcance funcional desglosado, **arquitectura técnica recomendada**, stack tecnológico justificado, **plazo realista por fases**, presupuesto cerrado, **forma de pago, condiciones de soporte post-lanzamiento** y supuestos del proyecto. Si algo no cuadra, lo iteramos antes de firmar. Nunca te enviamos una propuesta vaga de \"depende del alcance\"." },
  { section: "process", key: "step3_num",   value: "03" },
  { section: "process", key: "step3_title", value: "Desarrollo iterativo en sprints de 2 semanas" },
  { section: "process", key: "step3_desc",  value: "Trabajamos en **sprints de 2 semanas** con **demos frecuentes** al final de cada sprint. Ves el progreso real desde el primer sprint, no al final del proyecto cuando ya es tarde para cambiar cosas. Tienes **acceso al repositorio Git desde el día uno**, **acceso al ambiente de staging** para probar funcionalidades a medida que se entregan, y un canal directo de comunicación (Slack, WhatsApp o el que prefieras) para resolver dudas durante el desarrollo." },
  { section: "process", key: "step4_num",   value: "04" },
  { section: "process", key: "step4_title", value: "QA, performance, seguridad y lanzamiento" },
  { section: "process", key: "step4_desc",  value: "Antes del lanzamiento hacemos **testing exhaustivo manual y automatizado**, **revisión de performance** (tiempos de carga, queries optimizadas, manejo de cache), **auditoría de seguridad** (validación de webhooks, manejo correcto de tokens OAuth, protección contra ataques comunes) y **despliegue controlado** primero en staging y luego en producción. Si la app va al **Shopify App Store**, gestionamos también todo el proceso de review con el equipo de Shopify." },
  { section: "process", key: "step5_num",   value: "05" },
  { section: "process", key: "step5_title", value: "Soporte continuo y evolución del producto" },
  { section: "process", key: "step5_desc",  value: "Post-lanzamiento te acompañamos con **planes de mantenimiento mensual** que incluyen: **monitoreo activo de la app**, **actualizaciones a las nuevas versiones de la API de Shopify** (que se liberan cada trimestre), **resolución de bugs reportados por usuarios**, **mejoras incrementales según feedback real de los merchants** y **reportes mensuales de uso y performance**. El **código fuente siempre es tuyo desde el día uno** — si en algún momento decides cambiar de equipo, te entregamos repositorio, documentación técnica y handover sin fricción." },

  // ── FAQ ───────────────────────────────────────────────────────────────────
  { section: "faq", key: "heading",       value: "Preguntas frecuentes sobre desarrollo de apps y tiendas Shopify" },
  { section: "faq", key: "subheading",    value: "Las preguntas más comunes que recibimos de merchants antes de empezar un proyecto. Si la tuya no está acá, escríbenos directamente y te respondemos en menos de 24 horas hábiles." },
  { section: "faq", key: "contact_label", value: "Hacer una pregunta →" },
  { section: "faq", key: "contact_href",  value: "mailto:hola@appsdevpro.com" },

  { section: "faq", key: "q1", value: "¿Quiénes son Apps Developers Pro y por qué deberíamos contratarlos para desarrollar nuestra app Shopify?" },
  { section: "faq", key: "a1", value: "Apps Developers Pro es un equipo de desarrollo especializado al **100% en el ecosistema Shopify**. No somos una agencia generalista que también hace WordPress, apps móviles nativas, branding o marketing digital — desarrollamos exclusivamente para Shopify, y esa especialización es justamente lo que nos diferencia. Conocemos la plataforma a profundidad: las particularidades de la **GraphQL Admin API**, los **límites de rate limiting** y cómo gestionarlos correctamente en producción, los **requisitos del Shopify App Store**, el funcionamiento del **checkout extensibility**, las **diferencias entre Shopify Basic, Advanced, Plus y Commerce Components**, y cómo cada feature de la plataforma se comporta cuando se enfrenta a tráfico real.\n\nTenemos **apps publicadas en el Shopify App Store con merchants reales pagando suscripción mensual**, lo que significa que ya pasamos por el ciclo completo de desarrollo, review, lanzamiento, soporte y mantenimiento. Cuando nos contratas, no estamos aprendiendo con tu proyecto — ya pasamos por las dificultades técnicas, comerciales y operativas que tu app va a enfrentar.\n\nAdemás, **trabajamos en Latinoamérica y España**, con **atención en español e inglés**, horarios compatibles con ambas regiones, y experiencia integrando Shopify con **sistemas locales de cada país** (facturación electrónica, gateways de pago regionales, plataformas logísticas específicas de cada mercado)." },

  { section: "faq", key: "q2", value: "¿Cuánto cuesta desarrollar una app Shopify a medida?" },
  { section: "faq", key: "a2", value: "El **costo de desarrollar una app Shopify** depende del alcance funcional, la complejidad de las integraciones y si la app es privada o pública. Los rangos reales que manejamos: Una **app privada simple** parte desde **2,000 USD**. Una **app privada con backend completo e integraciones externas** se ubica típicamente entre **4,000 y 8,000 USD**. Una **app pública para el Shopify App Store** —con panel multi-tenant, billing recurrente y OAuth completo— parte desde **10,000 USD**, con casos comunes entre **12,000 y 20,000 USD**.\n\nEl precio que te enviamos en la propuesta técnica es **cerrado, no por hora**, e **incluye análisis funcional, diseño técnico, desarrollo, QA, despliegue y la primera fase de soporte post-lanzamiento**. Recibes el presupuesto detallado en menos de **48 horas** después de la reunión inicial." },

  { section: "faq", key: "q3", value: "¿Cuánto tiempo toma desarrollar una app Shopify desde cero?" },
  { section: "faq", key: "a3", value: "Los **tiempos de desarrollo de una app Shopify** varían según el tipo de app. Las **apps privadas simples** se entregan en **2 a 4 semanas**. Las **apps privadas con integraciones a sistemas externos** toman entre **4 y 8 semanas**. Las **apps públicas para el Shopify App Store** se entregan en **8 a 12 semanas**, más **1 a 3 semanas adicionales** del proceso de review oficial de Shopify.\n\nTrabajamos en **sprints de 2 semanas** con **demos al final de cada sprint**, lo que significa que ves el avance real desde el principio y puedes hacer ajustes en cada entrega." },

  { section: "faq", key: "q4", value: "¿Qué tecnologías y stack técnico usan para desarrollar apps Shopify?" },
  { section: "faq", key: "a4", value: "Usamos el **stack oficial recomendado por Shopify** y que mejor escala en producción. Como **framework principal** usamos **Remix**, el framework recomendado por Shopify desde 2023. El **lenguaje base es TypeScript** end-to-end — no escribimos JavaScript plano en proyectos de producción. Para **base de datos** usamos **PostgreSQL** con **Prisma** como ORM. Para **frontend del admin** usamos **Polaris**, la **librería oficial de componentes de Shopify**. Para **APIs de Shopify** trabajamos principalmente con la **GraphQL Admin API**, la **Storefront API** y la **Shopify Functions API**. Para **hosting** desplegamos en **Vercel** o **Railway** según los requisitos del proyecto." },

  { section: "faq", key: "q5", value: "¿Publican las apps directamente en el Shopify App Store o solo desarrollan apps privadas?" },
  { section: "faq", key: "a5", value: "Hacemos **las dos cosas** y te ayudamos a decidir cuál te conviene. Las **apps privadas** —también llamadas **custom apps**— son **más rápidas de desarrollar**, **no requieren proceso de review oficial** y son la opción ideal cuando la funcionalidad es solo para tu tienda. Las **apps públicas** tienen sentido cuando quieres **monetizar la solución vendiéndosela a otros merchants** vía suscripción mensual o cuando tu marca se beneficia de aparecer en el **marketplace oficial de Shopify**.\n\nCuando vamos por el **Shopify App Store**, gestionamos todo el proceso end-to-end: listing optimizado, screenshots, video demo, **OAuth flow validado** y **respuesta directa a los reviewers de Shopify**. Conocemos los motivos de rechazo más comunes y desarrollamos pensando en pasar el review desde el primer envío." },

  { section: "faq", key: "q6", value: "¿Qué incluye exactamente el soporte post-lanzamiento de la app Shopify?" },
  { section: "faq", key: "a6", value: "Ofrecemos **planes de mantenimiento mensual** porque una app Shopify en producción **no es un proyecto que termina el día del despliegue**. Los planes incluyen **monitoreo activo** con alertas automáticas, **actualizaciones cuando Shopify libera nuevas versiones de su API** (cada 3 meses), **resolución de bugs**, **mejoras incrementales** según feedback real de los merchants, y **reportes mensuales de uso y performance**.\n\nAlgo importante: el **código fuente de la app es siempre tuyo desde el día uno**. No quedas atado a nosotros. Si decides cambiar de equipo, te entregamos el **repositorio Git completo, la documentación técnica y un handover técnico estructurado** para que la transición sea limpia." },

  { section: "faq", key: "q7", value: "¿Cómo es el proceso de pago y qué formas de pago aceptan?" },
  { section: "faq", key: "a7", value: "Trabajamos con un **esquema de pago en tres tramos**: El **40% inicial** se paga después de firmar la propuesta técnica y antes de empezar el desarrollo. El **40% intermedio** se paga al momento de la **entrega de la versión beta funcional** en staging. El **20% restante** se paga al **lanzamiento oficial** en producción.\n\nAceptamos **transferencia bancaria internacional, PayPal, Wise y Stripe**. Para clientes en Latinoamérica y España también facturamos en **moneda local** cuando la situación fiscal lo requiere." },

  { section: "faq", key: "q8", value: "¿Trabajan con tiendas Shopify fuera de Latinoamérica?" },
  { section: "faq", key: "a8", value: "Sí, trabajamos con **merchants en Latinoamérica, España, Estados Unidos, México y otros mercados internacionales**. La mayoría de nuestros proyectos se manejan **100% remoto** con reuniones por videollamada y canales de comunicación asíncrona. Toda la comunicación en **español e inglés** indistintamente.\n\nTenemos experiencia integrando Shopify con **sistemas locales de distintos países**: facturación electrónica chilena (SII), colombiana (DIAN), Holded en España, sistemas SAT en México, gateways de pago regionales (**MercadoPago, Webpay, PSE, Khipu, Wompi**) y plataformas logísticas locales." },

  { section: "faq", key: "q9", value: "¿Qué pasa si Shopify rechaza nuestra app durante el proceso de review del App Store?" },
  { section: "faq", key: "a9", value: "Pasa, incluso a equipos con experiencia. Los **rechazos durante el review de Shopify** son parte normal del proceso, especialmente la primera vez. Nosotros ya conocemos los **motivos de rechazo más comunes**: problemas con la **política de privacidad o los términos de servicio**, **manejo del scope de permisos**, **performance insuficiente del listing**, **validaciones del billing** y **OAuth flow con errores** en casos borde.\n\nSi después de nuestro desarrollo Shopify aún solicita cambios, **los implementamos sin costo adicional** y **volvemos a enviar la app cuantas veces sea necesario hasta la aprobación final**. Esto está incluido en el contrato." },

  { section: "faq", key: "q10", value: "¿Pueden ayudarnos si ya tenemos una app Shopify desarrollada por otro equipo?" },
  { section: "faq", key: "a10", value: "Sí. Tomamos **proyectos heredados de otros desarrolladores** cuando el cliente quiere migrar el mantenimiento, mejorar performance, agregar funcionalidades o cambiar de proveedor. El primer paso es una **auditoría técnica del código actual**, donde revisamos: la **calidad del código**, la **arquitectura**, el **estado de las dependencias**, la **versión de la API de Shopify**, la **cobertura de tests** y la **documentación disponible**.\n\nDespués de la auditoría, te decimos honestamente qué se puede aprovechar, qué hay que reescribir y cuánto costaría cada camino posible. Nuestro compromiso es darte la **recomendación honesta basada en el estado real del código**, no la que más nos conviene comercialmente." },

  { section: "faq", key: "q11", value: "¿Pueden desarrollar también la tienda Shopify completa, no solo la app?" },
  { section: "faq", key: "a11", value: "Sí. Aunque nuestro foco principal son las **apps Shopify**, también desarrollamos **tiendas Shopify completas**: diseño y desarrollo del **theme Shopify 2.0**, configuración de productos, variantes, colecciones, mercados internacionales y políticas de envío.\n\nTrabajamos con **temas Shopify 2.0** desde cero —no usamos plantillas pre-armadas para proyectos serios— con **arquitectura de secciones dinámicas, app blocks compatibles, JSON templates y performance optimizada para Core Web Vitals**. También damos **consultoría técnica** para tiendas existentes que necesitan optimización, migración a **Shopify Plus** o auditoría completa del stack actual." },

  // ── CTA Final ─────────────────────────────────────────────────────────────
  { section: "ctafinal", key: "label",      value: "¿Listo para empezar?" },
  { section: "ctafinal", key: "heading",    value: "¿Tienes un proyecto de desarrollo Shopify en mente?" },
  { section: "ctafinal", key: "desc",       value: "Cuéntanos qué necesitas. En menos de **48 horas** te enviamos una **propuesta técnica detallada y sin compromiso** con arquitectura recomendada, **stack técnico justificado**, plazo realista por fases y presupuesto cerrado. Si vemos que el proyecto encaja con nuestro perfil, empezamos a construir. Si vemos que no encaja —porque queda fuera de nuestra especialización o porque hay un camino más simple para tu caso—, también te lo decimos directamente y, cuando es posible, te referimos a alguien que pueda ayudarte mejor. **Tu tiempo y nuestro tiempo son demasiado valiosos para perderlos en proyectos que no van a funcionar bien.**" },
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
