import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useState, useRef } from 'react'
import WordsPullUp from '../animations/WordsPullUp'
import { useContent, getSizeStyle } from '../../lib/ContentContext'
import { renderRich } from '../../lib/renderRich'

const DEFAULTS = [
  {
    num: '01',
    title: 'Reunión inicial de descubrimiento',
    desc: 'Una videollamada de **30 a 45 minutos** donde entendemos tu problema real, los **sistemas con los que ya trabajas** (ERP, CRM, plataforma de email, gateway de pagos), los **objetivos del proyecto** y las **restricciones técnicas o de negocio** que tengas. No es una reunión comercial — es una sesión técnica donde hacemos las preguntas correctas para poder darte una propuesta seria. Sin compromiso de avanzar.',
  },
  {
    num: '02',
    title: 'Propuesta técnica detallada en 48 horas',
    desc: 'Te enviamos un **documento de propuesta** con: alcance funcional desglosado, **arquitectura técnica recomendada**, stack tecnológico justificado, **plazo realista por fases**, presupuesto cerrado, **forma de pago, condiciones de soporte post-lanzamiento** y supuestos del proyecto. Si algo no cuadra, lo iteramos antes de firmar. Nunca te enviamos una propuesta vaga de "depende del alcance".',
  },
  {
    num: '03',
    title: 'Desarrollo iterativo en sprints de 2 semanas',
    desc: 'Trabajamos en **sprints de 2 semanas** con **demos frecuentes** al final de cada sprint. Ves el progreso real desde el primer sprint, no al final del proyecto cuando ya es tarde para cambiar cosas. Tienes **acceso al repositorio Git desde el día uno**, **acceso al ambiente de staging** para probar funcionalidades a medida que se entregan, y un canal directo de comunicación (Slack, WhatsApp o el que prefieras) para resolver dudas durante el desarrollo.',
  },
  {
    num: '04',
    title: 'QA, performance, seguridad y lanzamiento',
    desc: 'Antes del lanzamiento hacemos **testing exhaustivo manual y automatizado**, **revisión de performance** (tiempos de carga, queries optimizadas, manejo de cache), **auditoría de seguridad** (validación de webhooks, manejo correcto de tokens OAuth, protección contra ataques comunes) y **despliegue controlado** primero en staging y luego en producción. Si la app va al **Shopify App Store**, gestionamos también todo el proceso de review con el equipo de Shopify.',
  },
  {
    num: '05',
    title: 'Soporte continuo y evolución del producto',
    desc: 'Post-lanzamiento te acompañamos con **planes de mantenimiento mensual** que incluyen: **monitoreo activo de la app**, **actualizaciones a las nuevas versiones de la API de Shopify** (que se liberan cada trimestre), **resolución de bugs reportados por usuarios**, **mejoras incrementales según feedback real de los merchants** y **reportes mensuales de uso y performance**. El **código fuente siempre es tuyo desde el día uno** — si en algún momento decides cambiar de equipo, te entregamos repositorio, documentación técnica y handover sin fricción.',
  },
]

export default function Process() {
  const [active, setActive] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const c = useContent('process')

  const heading       = c.heading    || 'Un proceso de desarrollo claro, sin sorpresas y con entregas verificables'
  const subheading    = c.subheading || 'Desde la primera reunión hasta el lanzamiento en producción, sabes exactamente qué esperar en cada etapa, qué entregable recibes y en qué plazo.'
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
        <div className="max-w-3xl mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4" style={headingStyle}>
            <WordsPullUp text={heading} wordClassName="text-[#0F172A]" stagger={0.06} />
          </h2>
          <p className="text-[#4B5563] text-sm md:text-base leading-relaxed" style={subheadingStyle}>
            {subheading}
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 lg:gap-8 items-start">

          {/* Left — step list */}
          <div className="flex flex-col gap-2">
            {steps.map((step, i) => (
              <motion.button
                key={step.num}
                initial={{ x: -20, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setActive(i)}
                className={`group flex items-center gap-4 text-left px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  active === i
                    ? 'bg-white shadow-sm border border-[#E5E7EB]'
                    : 'border border-transparent hover:bg-white/70 hover:border-[#E5E7EB]'
                }`}
              >
                <span
                  className={`font-mono text-[11px] font-bold w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    active === i
                      ? 'bg-[#4361EE] text-white'
                      : 'bg-[#E5E7EB] text-[#6B7280] group-hover:bg-[#4361EE]/10 group-hover:text-[#4361EE]'
                  }`}
                >
                  {step.num}
                </span>
                <span
                  className={`text-sm font-medium leading-snug transition-colors duration-200 ${
                    active === i ? 'text-[#0F172A]' : 'text-[#6B7280] group-hover:text-[#0F172A]'
                  }`}
                >
                  {step.title}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Right — content panel */}
          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ x: 16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -16, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-2xl p-8 lg:p-10 border border-[#E5E7EB] shadow-sm"
              >
                <div className="flex items-start gap-5 mb-5">
                  <span className="font-mono text-7xl font-bold text-[#4361EE]/10 leading-none select-none flex-shrink-0 -mt-1">
                    {steps[active].num}
                  </span>
                  <h3 className="text-xl font-bold text-[#0F172A] leading-snug mt-2">
                    {steps[active].title}
                  </h3>
                </div>
                <p className="text-[#4B5563] text-sm md:text-base leading-relaxed">
                  {renderRich(steps[active].desc, 'font-semibold text-[#1E293B]')}
                </p>

                {/* Dot progress */}
                <div className="flex items-center gap-2 mt-8">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === active
                          ? 'bg-[#4361EE] w-7'
                          : 'bg-[#E5E7EB] w-2 hover:bg-[#4361EE]/30'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}
