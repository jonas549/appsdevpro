import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { useContent, getSizeStyle } from '../../lib/ContentContext'
import { renderRich } from '../../lib/renderRich'

const DEFAULT_FAQS = [
  {
    q: '¿Quiénes son Apps Developers Pro y por qué deberíamos contratarlos?',
    a: 'Apps Developers Pro es un equipo de desarrollo especializado al 100% en el ecosistema Shopify. No somos una agencia generalista — desarrollamos exclusivamente para Shopify, y esa especialización es lo que nos diferencia. Tenemos apps publicadas en el Shopify App Store con merchants reales pagando suscripción mensual, lo que significa que ya pasamos por el ciclo completo de desarrollo, review, lanzamiento, soporte y mantenimiento. Trabajamos en Latinoamérica y España, con atención en español e inglés.',
  },
  {
    q: '¿Cuánto cuesta desarrollar una app Shopify a medida?',
    a: 'Los rangos reales que manejamos: App privada simple: desde $2,000 USD. App privada con backend e integraciones externas: entre $4,000 y $8,000 USD. App pública para el Shopify App Store: desde $10,000 USD, con casos comunes entre $12,000 y $20,000 USD. El precio que te enviamos en la propuesta técnica es cerrado, no por hora, e incluye análisis funcional, diseño técnico, desarrollo, QA, despliegue y la primera fase de soporte post-lanzamiento.',
  },
  {
    q: '¿Cuánto tiempo toma desarrollar una app Shopify desde cero?',
    a: 'Apps privadas simples: 2 a 4 semanas. Apps privadas con integraciones a sistemas externos: 4 a 8 semanas. Apps públicas para el Shopify App Store: 8 a 12 semanas (más 1 a 3 semanas del proceso de review oficial de Shopify). Trabajamos en sprints de 2 semanas con demos al final de cada sprint, lo que significa que ves el avance real desde el principio.',
  },
  {
    q: '¿Qué tecnologías usan para desarrollar apps Shopify?',
    a: 'Usamos el stack oficial recomendado por Shopify: Remix como framework principal, TypeScript end-to-end, PostgreSQL con Prisma como ORM, Polaris para el frontend del admin, GraphQL Admin API y Storefront API para interactuar con Shopify, Shopify Functions API para descuentos y validaciones de checkout. Para hosting desplegamos en Vercel o Railway según los requisitos del proyecto.',
  },
  {
    q: '¿Publican apps en el Shopify App Store o solo desarrollan apps privadas?',
    a: 'Hacemos las dos cosas. Las apps privadas son más rápidas, no requieren review y son ideales cuando la funcionalidad es exclusiva para tu tienda. Las apps públicas tienen sentido cuando quieres monetizar la solución vendiéndosela a otros merchants. Cuando vamos por el App Store, gestionamos todo el proceso end-to-end: listing optimizado, screenshots, video demo, OAuth flow validado y respuesta a los reviewers de Shopify.',
  },
  {
    q: '¿Qué incluye el soporte post-lanzamiento?',
    a: 'Planes de mantenimiento mensual que incluyen: monitoreo activo con alertas automáticas, actualizaciones a nuevas versiones de la API de Shopify (cada trimestre), resolución de bugs, mejoras incrementales y reportes mensuales de uso y performance. El código fuente es siempre tuyo desde el día uno — no quedas atado a nosotros como proveedor único.',
  },
  {
    q: '¿Cómo es el proceso de pago?',
    a: 'Trabajamos con un esquema en tres tramos: 40% inicial al firmar la propuesta, 40% intermedio al entregar la versión beta funcional en staging, 20% restante al lanzamiento en producción. Aceptamos transferencia bancaria internacional, PayPal, Wise y Stripe. Facturamos en moneda local para clientes en Latinoamérica y España cuando la situación fiscal lo requiere.',
  },
  {
    q: '¿Trabajan con tiendas Shopify fuera de Latinoamérica?',
    a: 'Sí. Trabajamos con merchants en Latinoamérica, España, Estados Unidos y otros mercados internacionales. Toda la comunicación en español e inglés. Tenemos experiencia integrando Shopify con sistemas locales de distintos países: facturación electrónica chilena (SII), colombiana (DIAN), Holded en España, sistemas SAT en México, gateways de pago regionales (MercadoPago, Webpay, PSE, Wompi) y plataformas logísticas locales.',
  },
  {
    q: '¿Qué pasa si Shopify rechaza nuestra app durante el review?',
    a: 'Si después de nuestro desarrollo Shopify solicita cambios durante el review, los implementamos sin costo adicional y volvemos a enviar la app cuantas veces sea necesario hasta la aprobación final. Esto está incluido en el contrato. Los motivos típicos de rechazo incluyen problemas con la política de privacidad, scope de permisos incorrecto, performance insuficiente del listing, o errores en el OAuth flow — los conocemos bien y desarrollamos pensando en evitarlos desde el inicio.',
  },
  {
    q: '¿Pueden ayudarnos si ya tenemos una app desarrollada por otro equipo?',
    a: 'Sí. Tomamos proyectos heredados de otros desarrolladores. El primer paso es una auditoría técnica del código actual: calidad del código, arquitectura, estado de dependencias, versión de la API de Shopify, cobertura de tests y documentación disponible. Después de la auditoría, te decimos honestamente qué se puede aprovechar, qué hay que reescribir y cuánto costaría cada camino posible.',
  },
  {
    q: '¿Pueden desarrollar también la tienda Shopify completa?',
    a: 'Sí. Aunque nuestro foco principal son las apps Shopify, también desarrollamos tiendas completas: diseño y desarrollo del theme Shopify 2.0, configuración de productos, variantes, colecciones, mercados internacionales y políticas de envío. Trabajamos con themes Shopify 2.0 desde cero con arquitectura de secciones dinámicas, app blocks, JSON templates y performance optimizada para Core Web Vitals y SEO.',
  },
]

function FAQItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className="border-b border-white/[0.06]"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="text-[#EDF0FF] text-sm font-medium group-hover:text-white transition-colors leading-snug">
          {q}
        </span>
        <span className="text-[#7B8DB0] flex-shrink-0 transition-transform duration-200">
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-[#7B8DB0] text-sm leading-relaxed pb-5">{renderRich(a, 'font-semibold text-[#9BA8BE]')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const c = useContent('faq')

  const heading      = c.heading       || 'Preguntas frecuentes sobre desarrollo de apps y tiendas Shopify'
  const subheading   = c.subheading    || 'Las preguntas más comunes que recibimos de merchants antes de empezar un proyecto. Si la tuya no está acá, escríbenos directamente y te respondemos en menos de 24 horas hábiles.'
  const contactLabel = c.contact_label || 'Hacer una pregunta →'
  const contactHref  = c.contact_href  || 'mailto:hola@appsdevpro.com'
  const headingStyle    = getSizeStyle(c.heading_size)
  const subheadingStyle = getSizeStyle(c.subheading_size)

  const faqs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => ({
    q: c[`q${n}`] || DEFAULT_FAQS[n - 1]?.q || '',
    a: c[`a${n}`] || DEFAULT_FAQS[n - 1]?.a || '',
  })).filter(f => f.q)

  return (
    <section id="faq" className="bg-[#07090F] py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-4 md:sticky md:top-24 self-start">
            <h2 className="text-3xl font-bold text-[#EDF0FF] mb-4 leading-tight" style={headingStyle}>
              {heading}
            </h2>
            <p className="text-[#7B8DB0] text-sm leading-relaxed mb-8" style={subheadingStyle}>
              {subheading}
            </p>
            <a
              href={contactHref}
              className="inline-flex items-center gap-2 border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-[#EDF0FF] text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200"
            >
              {contactLabel}
            </a>
          </div>
          <div className="md:col-span-8">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
