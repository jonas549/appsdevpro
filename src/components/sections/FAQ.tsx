import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: '¿Cuánto cuesta desarrollar una app Shopify?',
    a: 'Desde $2,000 USD para apps privadas simples hasta $15,000+ para apps públicas con backend completo. El precio depende del alcance y la complejidad. Te damos presupuesto en 48hs.',
  },
  {
    q: '¿Cuánto tiempo tarda el desarrollo?',
    a: 'Las apps privadas pueden estar listas en 2-4 semanas. Las apps públicas para el App Store suelen tomar entre 6 y 12 semanas, incluyendo el proceso de revisión de Shopify.',
  },
  {
    q: '¿Publican las apps en el Shopify App Store?',
    a: 'Sí. Tenemos experiencia con todo el proceso de publicación: cumplimiento de requirements técnicos, listing, screenshots y proceso de review. Gestionamos todo.',
  },
  {
    q: '¿Solo trabajan con Shopify?',
    a: 'Nuestro foco es 100% Shopify. Esto nos permite ser mejores en lo que hacemos. No somos una agencia generalista — somos especialistas en el ecosistema Shopify.',
  },
  {
    q: '¿Qué pasa después del lanzamiento?',
    a: 'Ofrecemos planes de mantenimiento y soporte mensual. Monitoreamos la app, aplicamos actualizaciones de la API de Shopify y resolvemos bugs. El código fuente es tuyo.',
  },
  {
    q: '¿Cómo es el proceso de pago?',
    a: '40% al inicio del proyecto, 40% en el hito de entrega de la versión beta, y 20% restante al lanzamiento. Aceptamos transferencia bancaria y PayPal.',
  },
]

function FAQItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className="border-b border-white/[0.06]"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="text-primary text-sm font-medium group-hover:text-white transition-colors">{q}</span>
        <span className="text-[#7B8DB0] flex-shrink-0">
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
            <p className="text-[#7B8DB0] text-sm leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="bg-[#07090F] py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          {/* Sidebar */}
          <div className="md:col-span-4 md:sticky md:top-24 self-start">
            <h2 className="text-3xl font-bold text-primary mb-4 leading-tight">Preguntas frecuentes</h2>
            <p className="text-[#7B8DB0] text-sm leading-relaxed mb-8">
              Respondemos las dudas más comunes. Si tienes una pregunta específica, escríbenos directamente.
            </p>
            <a
              href="mailto:hola@appsdevpro.com"
              className="inline-flex items-center gap-2 border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-primary text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200"
            >
              Hacer una pregunta →
            </a>
          </div>

          {/* Accordion */}
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
