import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, MessageSquare } from 'lucide-react'
import { useContent, getFieldStyle } from '../../lib/ContentContext'
import { safeHtml } from '../../lib/safe-html'

const DEFAULT_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260330_145725_08886141-ed95-4a8e-8d6d-b75eaadce638.mp4'

export default function CTABanner() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const c = useContent('ctabanner')

  const heading  = c.heading    || '¿Tu tienda Shopify necesita algo que no existe en el App Store?'
  const desc     = c.desc       || 'Si tienes un requerimiento que ninguna app del Shopify App Store cubre — hablemos. Sin compromiso, sin venta agresiva, sin formulario de 20 campos. En menos de 48 horas te enviamos una propuesta técnica detallada con arquitectura recomendada, stack técnico, plazo realista y presupuesto cerrado.'
  const cta1     = c.cta1_label || 'Escríbenos ahora'
  const cta1Href = c.cta1_href  || '#contacto'
  const cta2     = c.cta2_label || 'Agendar reunión'
  const cta2Href = c.cta2_href  || '#proceso'
  const video    = c.video_url  || DEFAULT_VIDEO

  const headingStyle  = getFieldStyle(c.heading_size,   c.heading_px,   c.heading_color)
  const descStyle     = getFieldStyle(c.desc_size,      c.desc_px,      c.desc_color)
  const cta1Style     = getFieldStyle(c.cta1_label_size, c.cta1_label_px, c.cta1_label_color)
  const cta2Style     = getFieldStyle(c.cta2_label_size, c.cta2_label_px, c.cta2_label_color)

  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <video
        src={video}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      <div className="noise-overlay opacity-[0.06] mix-blend-overlay pointer-events-none" />

      <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6 tracking-tight" style={headingStyle}>
            {heading}
          </h3>
          <p className="text-white/70 text-base leading-relaxed mb-10 max-w-xl mx-auto [&_strong]:font-semibold [&_strong]:text-inherit [&_em]:italic" style={descStyle} dangerouslySetInnerHTML={{ __html: safeHtml(desc) }} />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={cta1Href}
              style={cta1Style}
              className="flex items-center gap-2 bg-[#4361EE] hover:bg-[#3451D1] text-white font-semibold text-base px-7 py-3.5 rounded-full transition-colors duration-200 shadow-[0_0_30px_rgba(67,97,238,0.4)]"
            >
              <MessageSquare size={16} />
              {cta1}
            </a>
            <a
              href={cta2Href}
              style={cta2Style}
              className="flex items-center gap-2 border border-white/25 bg-white/[0.06] hover:bg-white/[0.12] text-white font-medium text-base px-7 py-3.5 rounded-full transition-all duration-200"
            >
              {cta2} <ArrowRight size={15} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
