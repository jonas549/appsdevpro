import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import WordsPullUp from '../animations/WordsPullUp'
import { useContent, getSizeStyle } from '../../lib/ContentContext'

const DEFAULTS = [
  {
    num: '01',
    title: 'Reunión inicial de descubrimiento',
    desc: 'Una videollamada de 30 a 45 minutos donde entendemos tu problema real, los sistemas con los que ya trabajas (ERP, CRM, plataforma de email, gateway de pagos), los objetivos del proyecto y las restricciones técnicas o de negocio. No es una reunión comercial — es una sesión técnica donde hacemos las preguntas correctas para poder darte una propuesta seria. Sin compromiso de avanzar.',
  },
  {
    num: '02',
    title: 'Propuesta técnica detallada en 48 horas',
    desc: 'Te enviamos un documento de propuesta con: alcance funcional desglosado, arquitectura técnica recomendada, stack tecnológico justificado, plazo realista por fases, presupuesto cerrado, forma de pago, condiciones de soporte post-lanzamiento y supuestos del proyecto. Si algo no cuadra, lo iteramos antes de firmar. Nunca te enviamos una propuesta vaga de "depende del alcance".',
  },
  {
    num: '03',
    title: 'Desarrollo iterativo en sprints de 2 semanas',
    desc: 'Trabajamos en sprints de 2 semanas con demos frecuentes al final de cada sprint. Ves el progreso real desde el primer sprint, no al final del proyecto cuando ya es tarde para cambiar cosas. Tienes acceso al repositorio Git desde el día uno, acceso al ambiente de staging y un canal directo de comunicación para resolver dudas durante el desarrollo.',
  },
  {
    num: '04',
    title: 'QA, performance, seguridad y lanzamiento',
    desc: 'Antes del lanzamiento hacemos testing exhaustivo manual y automatizado, revisión de performance (tiempos de carga, queries optimizadas, manejo de cache), auditoría de seguridad y despliegue controlado primero en staging y luego en producción. Si la app va al Shopify App Store, gestionamos también todo el proceso de review con el equipo de Shopify.',
  },
  {
    num: '05',
    title: 'Soporte continuo y evolución del producto',
    desc: 'Post-lanzamiento te acompañamos con planes de mantenimiento mensual: monitoreo activo, actualizaciones a nuevas versiones de la API de Shopify (que se liberan cada trimestre), resolución de bugs, mejoras incrementales y reportes mensuales de uso y performance. El código fuente siempre es tuyo desde el día uno.',
  },
]

export default function Process() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const c = useContent('process')

  const heading    = c.heading    || 'Un proceso de desarrollo claro, sin sorpresas y con entregas verificables'
  const subheading = c.subheading || 'Desde la primera reunión hasta el lanzamiento en producción, sabes exactamente qué esperar en cada etapa, qué entregable recibes y en qué plazo.'
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
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4" style={headingStyle}>
            <WordsPullUp text={heading} wordClassName="text-[#0F172A]" stagger={0.06} />
          </h2>
          <p className="text-[#4B5563] text-sm md:text-base leading-relaxed" style={subheadingStyle}>{subheading}</p>
        </div>

        <div ref={ref} className="flex flex-col">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ x: -24, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: -24, opacity: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-[56px_1fr] gap-6 md:gap-10 py-8 border-b border-[#E5E7EB] last:border-b-0 group"
            >
              <div className="flex flex-col items-center pt-1">
                <motion.div
                  className="w-11 h-11 rounded-full border-2 border-[#E5E7EB] bg-white flex items-center justify-center flex-shrink-0 group-hover:border-[#4361EE] transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="font-mono text-xs font-semibold text-[#6B7280] group-hover:text-[#4361EE] transition-colors">
                    {step.num}
                  </span>
                </motion.div>
              </div>
              <div>
                <h3 className="font-semibold text-[#0F172A] text-base md:text-lg mb-2 group-hover:text-[#4361EE] transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-[#6B7280] text-sm md:text-base leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
