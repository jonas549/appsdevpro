import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import WordsPullUp from '../animations/WordsPullUp'
import { useContent, getSizeStyle } from '../../lib/ContentContext'

const DEFAULTS = [
  { num: '01', title: 'Reunión inicial',     desc: 'Entendemos tu problema, tus sistemas actuales y el objetivo del proyecto. Sin compromiso.' },
  { num: '02', title: 'Propuesta técnica',   desc: 'En 48hs te enviamos una propuesta detallada: arquitectura, tecnologías, plazo y presupuesto.' },
  { num: '03', title: 'Desarrollo iterativo',desc: 'Sprints de 2 semanas con demos frecuentes. Tú ves el progreso real desde el primer sprint.' },
  { num: '04', title: 'QA y lanzamiento',    desc: 'Testing exhaustivo, review de performance y despliegue controlado en tu tienda o en el App Store.' },
  { num: '05', title: 'Soporte continuo',    desc: 'Post-lanzamiento con soporte activo, monitoreo y mejoras incrementales según el feedback.' },
]

export default function Process() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const c = useContent('process')

  const heading    = c.heading    || 'Un proceso claro, sin sorpresas'
  const subheading = c.subheading || 'Desde la primera reunión hasta el lanzamiento, sabes exactamente qué esperar.'
  const headingStyle    = getSizeStyle(c.heading_size)
  const subheadingStyle = getSizeStyle(c.subheading_size)

  const steps = [1, 2, 3, 4, 5].map((n, i) => ({
    num:   c[`step${n}_num`]   || DEFAULTS[i].num,
    title: c[`step${n}_title`] || DEFAULTS[i].title,
    desc:  c[`step${n}_desc`]  || DEFAULTS[i].desc,
  }))

  return (
    <section id="proceso" className="bg-[#F2F5FB] py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4" style={headingStyle}>
            <WordsPullUp text={heading} wordClassName="text-[#0F172A]" stagger={0.06} />
          </h2>
          <p className="text-[#4B5563] text-sm md:text-base" style={subheadingStyle}>{subheading}</p>
        </div>
        <div ref={ref} className="relative">
          <div className="hidden md:block absolute top-[2.1rem] left-0 right-0 h-px bg-[#E5E7EB]" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col items-start md:items-center"
              >
                {i < steps.length - 1 && (
                  <div className="md:hidden absolute left-5 top-14 bottom-0 w-px bg-[#E5E7EB] h-full z-0" />
                )}
                <motion.div
                  className="group relative z-10 w-11 h-11 rounded-full border-2 border-[#E5E7EB] bg-white flex items-center justify-center mb-5 cursor-default transition-colors duration-200 hover:border-accent"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="font-mono text-xs font-medium text-[#6B7280] group-hover:text-accent transition-colors">{step.num}</span>
                </motion.div>
                <div className="md:text-center px-1">
                  <h3 className="font-semibold text-[#0F172A] text-sm mb-2">{step.title}</h3>
                  <p className="text-[#6B7280] text-xs md:text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
