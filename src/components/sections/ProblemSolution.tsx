import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Layers, Plug, ShoppingCart } from 'lucide-react'
import WordsPullUpMultiStyle from '../animations/WordsPullUpMultiStyle'
import AnimatedLetter from '../animations/AnimatedLetter'
import { useContent, getSizeStyle } from '../../lib/ContentContext'

const SOLUTION_ICONS = [<Layers size={18} />, <Plug size={18} />, <ShoppingCart size={18} />]

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4'

export default function ProblemSolution() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const p = useContent('problem')
  const s = useContent('solution')

  const solutionHeadingStyle = getSizeStyle(s.heading_size)

  const problemLabel   = p.label         || '● El Problema'
  const problemHeading = p.heading       || 'Las apps genéricas del marketplace no resuelven tu problema específico'
  const problemDesc1   = p.description   || 'Cada tienda Shopify tiene reglas de negocio propias, integraciones con sistemas internos y flujos operativos únicos que no encajan en una app de catálogo. Las apps de $9 al mes del Shopify App Store están diseñadas para el caso promedio: descuentos básicos, gestión simple de inventario, integraciones estándar de envío. El problema aparece cuando tu operación crece y empiezas a chocar con los límites de esas apps genéricas.'
  const problemDesc2   = p.description_2 || 'La consecuencia es siempre la misma. Tu equipo pierde horas operativas repitiendo procesos que deberían estar automatizados. Tu conversión se estanca porque el checkout no permite las validaciones que tu negocio requiere. Tu AOV no crece porque las apps de descuentos no soportan las reglas que necesitas para hacer cross-sell real.'
  const problemDesc3   = p.description_3 || 'Nosotros entramos justo en ese punto. Identificamos qué parte de tu operación está siendo limitada por software genérico, diseñamos una solución Shopify personalizada que se adapta a tu flujo real, y la construimos con tecnología que escala a la par de tu negocio.'

  const solutionLabel   = s.label   || '● La Solución'
  const solutionHeading = s.heading || 'Construimos exactamente lo que tu tienda Shopify necesita'

  const solutions = [1, 2, 3].map((n) => ({
    icon: SOLUTION_ICONS[n - 1],
    title: s[`item${n}_title`] || [
      'Apps Shopify a medida para tu flujo de negocio',
      'Integración de Shopify con tus sistemas internos',
      'Apps publicadas en el Shopify App Store',
    ][n - 1],
    desc: s[`item${n}_desc`] || [
      'Desarrollamos apps Shopify personalizadas desde cero, adaptadas a la lógica específica de tu operación. Trabajamos con el stack oficial recomendado por Shopify: Remix, TypeScript, PostgreSQL con Prisma y Polaris.',
      'Tu tienda Shopify tiene que conversar con tu ERP, CRM, WMS, sistemas de facturación electrónica y gateways de pago. Diseñamos integraciones robustas con webhooks confiables y reintentos automáticos. Hemos integrado Shopify con SAP, NetSuite, Holded, Odoo, Salesforce y HubSpot.',
      'Tenemos apps activas en el Shopify App Store con merchants reales pagando suscripción mensual. Ya pasamos por todo el proceso de publicación oficial: billing recurrente, OAuth flow validado y respuesta a reviewers.',
    ][n - 1],
  }))

  return (
    <section id="servicios" className="relative py-28 md:py-36 overflow-hidden">
      <video
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      <div className="noise-overlay opacity-[0.06] mix-blend-overlay pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
          {/* Left — El Problema */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#FF8080]">{problemLabel}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-8 text-[#EDF0FF]">
              <WordsPullUpMultiStyle segments={[{ text: problemHeading }]} stagger={0.05} />
            </h2>
            <div className="flex flex-col gap-5">
              <AnimatedLetter text={problemDesc1} className="text-[#9BA8BE] text-sm md:text-base leading-[1.8]" />
              <AnimatedLetter text={problemDesc2} className="text-[#9BA8BE] text-sm md:text-base leading-[1.8]" />
              <AnimatedLetter text={problemDesc3} className="text-[#7B8DB0] text-sm leading-[1.8]" />
            </div>
          </div>

          {/* Right — La Solución */}
          <div ref={ref}>
            <div className="flex items-center gap-2 mb-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#4361EE]">{solutionLabel}</span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-8 text-[#EDF0FF]"
              style={solutionHeadingStyle}
            >
              {solutionHeading}
            </h2>
            <div className="flex flex-col gap-4">
              {solutions.map((sol, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 40, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : { x: 40, opacity: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 4, borderColor: 'rgba(67,97,238,0.35)' }}
                  className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-xl p-5 flex gap-4 cursor-default transition-colors duration-200"
                >
                  <div className="text-[#4361EE] mt-0.5 flex-shrink-0">{sol.icon}</div>
                  <div>
                    <h3 className="font-semibold text-[#EDF0FF] text-sm mb-1.5">{sol.title}</h3>
                    <p className="text-[#7B8DB0] text-sm leading-relaxed">{sol.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
