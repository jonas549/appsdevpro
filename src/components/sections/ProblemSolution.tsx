import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Layers, Plug, ShoppingCart } from 'lucide-react'
import WordsPullUpMultiStyle from '../animations/WordsPullUpMultiStyle'
import AnimatedLetter from '../animations/AnimatedLetter'

const solutions = [
  {
    icon: <Layers size={18} />,
    title: 'Apps a medida para tu flujo',
    desc: 'Construimos exactamente lo que necesitas: desde lógica de negocio compleja hasta integraciones con sistemas externos.',
  },
  {
    icon: <Plug size={18} />,
    title: 'Integración con tus sistemas',
    desc: 'Conectamos Shopify con tu ERP, CRM, WMS o cualquier API externa de forma confiable y escalable.',
  },
  {
    icon: <ShoppingCart size={18} />,
    title: 'Publicadas en el App Store',
    desc: 'Tenemos experiencia publicando apps en el ecosistema de Shopify, cumpliendo todos los requisitos de la plataforma.',
  },
]

export default function ProblemSolution() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="servicios" className="bg-[#07090F] py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
          {/* Left — Problem */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#FF8080]">● El Problema</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-8">
              <WordsPullUpMultiStyle
                segments={[
                  { text: 'Las apps genéricas del marketplace no resuelven' },
                  { text: 'tu', className: 'text-accent' },
                  { text: 'problema específico' },
                ]}
                stagger={0.05}
              />
            </h2>

            <AnimatedLetter
              text="Cada tienda Shopify tiene sus propias reglas de negocio, integraciones con sistemas externos y flujos únicos. Las apps de $9/mes están diseñadas para el caso promedio — no para el tuyo."
              className="text-[#7B8DB0] text-sm md:text-base leading-[1.8]"
            />
          </div>

          {/* Right — Solution */}
          <div ref={ref}>
            <div className="flex items-center gap-2 mb-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-accent">● La Solución</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-8 text-primary">
              Construimos exactamente lo que tu tienda necesita
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
