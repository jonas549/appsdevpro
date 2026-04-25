import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, MessageSquare } from 'lucide-react'

export default function CTABanner() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="bg-[#07090F] py-16 px-4 md:px-6">
      <motion.div
        ref={ref}
        initial={{ y: 30, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-6xl mx-auto bg-[#1F2937] rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[280px]"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
      >
        {/* Glows */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(119,117,214,0.35) 0%, transparent 70%)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 100% 50%, rgba(67,97,238,0.18) 0%, transparent 70%)' }} />

        {/* Left — text */}
        <div className="relative z-10 p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            ¿Tu tienda Shopify necesita una solución a medida?
          </h2>
          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-8">
            Si tienes un requerimiento que ninguna app cubre — hablemos. Sin compromiso. Propuesta técnica en 48 horas.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#contacto"
              className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors duration-200"
            >
              <MessageSquare size={15} />
              Escríbenos ahora
            </a>
            <a
              href="#proceso"
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              Agendar reunión <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Right — screenshot */}
        <div className="relative hidden md:block overflow-hidden">
          <img
            src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
            alt="App screenshot"
            className="absolute inset-0 w-full h-full object-cover object-left-top rounded-tl-xl opacity-90"
          />
        </div>
      </motion.div>
    </section>
  )
}
