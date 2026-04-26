import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Layers, Plug, ShoppingCart } from 'lucide-react'
import WordsPullUpMultiStyle from '../animations/WordsPullUpMultiStyle'
import AnimatedLetter from '../animations/AnimatedLetter'
import { useContent, getSizeStyle } from '../../lib/ContentContext'

const SOLUTION_ICONS = [<Layers size={18} />, <Plug size={18} />, <ShoppingCart size={18} />]

export default function ProblemSolution() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const p = useContent('problem')
  const s = useContent('solution')

  const solutionHeadingStyle = getSizeStyle(s.heading_size)
  const problemDescStyle     = getSizeStyle(p.description_size)

  const problemLabel   = p.label       || 'El Problema'
  const problemHeading = p.heading     || 'Las apps genéricas del marketplace no resuelven tu problema específico'
  const problemDesc    = p.description || 'Cada tienda Shopify tiene sus propias reglas de negocio, integraciones con sistemas externos y flujos únicos. Las apps de $9/mes están diseñadas para el caso promedio — no para el tuyo.'

  const solutionLabel   = s.label   || 'La Solución'
  const solutionHeading = s.heading || 'Construimos exactamente lo que tu tienda necesita'

  const solutions = [1, 2, 3].map((n) => ({
    icon: SOLUTION_ICONS[n - 1],
    title: s[`item${n}_title`] || ['Apps a medida para tu flujo', 'Integración con tus sistemas', 'Publicadas en el App Store'][n - 1],
    desc:  s[`item${n}_desc`]  || ['Construimos exactamente lo que necesitas: desde lógica de negocio compleja hasta integraciones con sistemas externos.', 'Conectamos Shopify con tu ERP, CRM, WMS o cualquier API externa de forma confiable y escalable.', 'Tenemos experiencia publicando apps en el ecosistema de Shopify, cumpliendo todos los requisitos de la plataforma.'][n - 1],
  }))

  return (
    <section id="servicios" className="bg-[#07090F] py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#FF8080]">● {problemLabel}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-8">
              <WordsPullUpMultiStyle
                segments={[{ text: problemHeading }]}
                stagger={0.05}
              />
            </h2>
            <div style={problemDescStyle}>
              <AnimatedLetter text={problemDesc} className="text-[#7B8DB0] text-sm md:text-base leading-[1.8]" />
            </div>
          </div>
          <div ref={ref}>
            <div className="flex items-center gap-2 mb-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-accent">● {solutionLabel}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-8 text-primary" style={solutionHeadingStyle}>
              {solutionHeading}
            </h2>
            <div className="flex flex-col gap-4">
              {solutions.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 40, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : { x: 40, opacity: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 4, borderColor: 'rgba(67,97,238,0.3)' }}
                  className="bg-[#10141F] border border-white/[0.06] rounded-xl p-5 flex gap-4 cursor-default transition-colors duration-200"
                >
                  <div className="text-accent mt-0.5 flex-shrink-0">{s.icon}</div>
                  <div>
                    <h3 className="font-semibold text-primary text-sm mb-1.5">{s.title}</h3>
                    <p className="text-[#7B8DB0] text-sm leading-relaxed">{s.desc}</p>
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
