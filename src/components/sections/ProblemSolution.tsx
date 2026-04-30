import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Layers, Plug, ShoppingCart } from 'lucide-react'
import WordsPullUpMultiStyle from '../animations/WordsPullUpMultiStyle'
import { useContent, getSizeStyle } from '../../lib/ContentContext'
import { safeHtml } from '../../lib/safe-html'

const SOLUTION_ICONS = [<Layers size={18} />, <Plug size={18} />, <ShoppingCart size={18} />]

const FALLBACK_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4'

export default function ProblemSolution() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const p = useContent('problem')
  const s = useContent('solution')

  const VIDEO_URL = p.video_url || FALLBACK_VIDEO

  const solutionHeadingStyle = getSizeStyle(s.heading_size)

  const problemLabel   = p.label         || '● El Problema'
  const problemHeading = p.heading       || 'Las apps genéricas del marketplace no resuelven tu problema específico'
  const problemDesc1   = p.description   || 'Cada <strong>tienda Shopify</strong> tiene reglas de negocio propias, integraciones con sistemas internos y flujos operativos únicos que no encajan en una app de catálogo. Las <strong>apps de $9 al mes</strong> del Shopify App Store están diseñadas para el caso promedio: descuentos básicos, gestión simple de inventario, integraciones estándar de envío. El problema aparece cuando tu operación crece y empiezas a chocar con los límites de esas apps genéricas: configuraciones que no se pueden personalizar, integraciones que no existen, lógica de negocio que tu equipo termina resolviendo manualmente con planillas de Excel.'
  const problemDesc2   = p.description_2 || 'La consecuencia es siempre la misma. Tu equipo pierde <strong>horas operativas</strong> repitiendo procesos que deberían estar automatizados. Tu <strong>conversión</strong> se estanca porque el checkout no permite las validaciones que tu negocio requiere. Tu <strong>AOV (ticket promedio)</strong> no crece porque las apps de descuentos no soportan las reglas que necesitas para hacer cross-sell real. Y cuando intentas escalar a otro mercado, descubres que las apps que usas no soportan multi-store, multi-moneda o sincronización con tu ERP. Ahí es donde una <strong>app Shopify a medida</strong> deja de ser un lujo y se convierte en una decisión de negocio.'
  const problemDesc3   = p.description_3 || 'Nosotros entramos justo en ese punto. Identificamos qué parte de tu operación está siendo limitada por software genérico, diseñamos una <strong>solución Shopify personalizada</strong> que se adapta a tu flujo real, y la construimos con tecnología que escala a la par de tu negocio. No vendemos plantillas ni proyectos enlatados — cada app que entregamos está hecha específicamente para el problema del cliente que la encarga.'

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
      'Desarrollamos <strong>apps Shopify personalizadas</strong> desde cero, adaptadas a la lógica específica de tu operación. Trabajamos con el <strong>stack oficial recomendado por Shopify</strong>: <strong>Remix</strong>, <strong>TypeScript</strong>, <strong>PostgreSQL</strong> con Prisma y <strong>Polaris</strong> para que el panel de tu app se vea exactamente como una app nativa de Shopify.',
      'Tu <strong>tienda Shopify</strong> tiene que conversar con tu <strong>ERP, CRM, WMS, sistemas de facturación electrónica, gateways de pago locales</strong> y cualquier API externa que tu operación requiera. Diseñamos <strong>integraciones robustas</strong> con <strong>webhooks confiables con reintentos automáticos</strong> y arquitectura preparada para escalar.',
      'Tenemos <strong>apps activas en el Shopify App Store</strong> con merchants reales pagando suscripción mensual. Ya pasamos por todo el proceso de publicación oficial: <strong>billing recurrente</strong>, <strong>OAuth flow validado</strong>, <strong>scope de permisos correcto</strong> y <strong>respuesta a reviewers</strong> durante la aprobación.',
    ][n - 1],
  }))

  return (
    <section id="servicios" className="relative py-28 md:py-36 overflow-hidden">
      <video
        src={VIDEO_URL}
        autoPlay loop muted playsInline
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
              {[problemDesc1, problemDesc2, problemDesc3].map((txt, i) => (
                <p
                  key={i}
                  className={`text-sm md:text-base leading-[1.8] [&_strong]:font-semibold [&_strong]:text-[#CBD5E8] [&_em]:italic ${i < 2 ? 'text-[#9BA8BE]' : 'text-[#7B8DB0]'}`}
                  dangerouslySetInnerHTML={{ __html: safeHtml(txt) }}
                />
              ))}
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
                    <p
                      className="text-[#7B8DB0] text-sm leading-relaxed [&_strong]:font-semibold [&_strong]:text-[#9BA8BE] [&_em]:italic"
                      dangerouslySetInnerHTML={{ __html: safeHtml(sol.desc) }}
                    />
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
