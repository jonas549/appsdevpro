'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Layers, Plug, ShoppingCart } from 'lucide-react'
import WordsPullUpMultiStyle from '../animations/WordsPullUpMultiStyle'
import { useContent, getFieldStyle } from '../../lib/ContentContext'
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

  const problemLabel   = p.label         || '● El Problema'
  const problemHeading = p.heading       || 'Las apps genéricas del marketplace no resuelven tu problema específico'
  const problemDesc1   = p.description   || 'Cada <strong>tienda Shopify</strong> tiene reglas de negocio propias, integraciones con sistemas internos y flujos operativos únicos que no encajan en una app de catálogo.'
  const problemDesc2   = p.description_2 || 'La consecuencia es siempre la misma. Tu equipo pierde <strong>horas operativas</strong> repitiendo procesos que deberían estar automatizados.'
  const problemDesc3   = p.description_3 || 'Nosotros entramos justo en ese punto. Diseñamos una <strong>solución Shopify personalizada</strong> que se adapta a tu flujo real.'

  const solutionLabel   = s.label   || '● La Solución'
  const solutionHeading = s.heading || 'Construimos exactamente lo que tu tienda Shopify necesita'

  const solutions = [1, 2, 3].map((n) => ({
    icon: SOLUTION_ICONS[n - 1],
    title: s[`item${n}_title`] || ['Apps Shopify a medida', 'Integración con sistemas internos', 'Apps en el Shopify App Store'][n - 1],
    desc:  s[`item${n}_desc`]  || ['Desarrollamos <strong>apps Shopify personalizadas</strong> desde cero.', 'Conectamos <strong>Shopify con tu ERP, CRM y sistemas externos</strong>.', 'Tenemos <strong>apps activas en el Shopify App Store</strong>.'][n - 1],
  }))

  // Estilos por campo desde DB
  const problemLabelStyle   = getFieldStyle(p.label_size,         p.label_px,         p.label_color)
  const problemHeadingStyle = getFieldStyle(p.heading_size,       p.heading_px,       p.heading_color)
  const desc1Style          = getFieldStyle(p.description_size,   p.description_px,   p.description_color)
  const desc2Style          = getFieldStyle(p.description_2_size, p.description_2_px, p.description_2_color)
  const desc3Style          = getFieldStyle(p.description_3_size, p.description_3_px, p.description_3_color)
  const solutionLabelStyle   = getFieldStyle(s.label_size,   s.label_px,   s.label_color)
  const solutionHeadingStyle = getFieldStyle(s.heading_size, s.heading_px, s.heading_color)

  const itemStyles = [1, 2, 3].map(n => ({
    title: getFieldStyle(s[`item${n}_title_size`], s[`item${n}_title_px`], s[`item${n}_title_color`]),
    desc:  getFieldStyle(s[`item${n}_desc_size`],  s[`item${n}_desc_px`],  s[`item${n}_desc_color`]),
  }))

  const descStyles = [desc1Style, desc2Style, desc3Style]

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
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#FF8080]" style={problemLabelStyle}>
                {problemLabel}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-8 text-[#EDF0FF]" style={problemHeadingStyle}>
              <WordsPullUpMultiStyle segments={[{ text: problemHeading }]} stagger={0.05} />
            </h2>
            <div className="flex flex-col gap-5">
              {[problemDesc1, problemDesc2, problemDesc3].map((txt, i) => (
                <p
                  key={i}
                  className={`text-sm md:text-base leading-[1.8] [&_strong]:font-semibold [&_strong]:text-inherit [&_em]:italic ${i < 2 ? 'text-[#9BA8BE]' : 'text-[#7B8DB0]'}`}
                  style={descStyles[i]}
                  dangerouslySetInnerHTML={{ __html: safeHtml(txt) }}
                />
              ))}
            </div>
          </div>

          {/* Right — La Solución */}
          <div ref={ref}>
            <div className="flex items-center gap-2 mb-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#4361EE]" style={solutionLabelStyle}>
                {solutionLabel}
              </span>
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
                    <h3 className="font-semibold text-[#EDF0FF] text-sm mb-1.5" style={itemStyles[i].title}>{sol.title}</h3>
                    <p
                      className="text-[#7B8DB0] text-sm leading-relaxed [&_strong]:font-semibold [&_strong]:text-inherit [&_em]:italic"
                      style={itemStyles[i].desc}
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
