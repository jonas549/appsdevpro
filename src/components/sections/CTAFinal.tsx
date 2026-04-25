import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, MessageCircle } from 'lucide-react'

const CTA_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260330_145725_08886141-ed95-4a8e-8d6d-b75eaadce638.mp4'

export default function CTAFinal() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="contacto" className="relative overflow-hidden">
      {/* Video background */}
      <video
        src={CTA_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Noise overlay */}
      <div className="noise-overlay opacity-[0.05] mix-blend-overlay" />

      {/* Content */}
      <div className="relative z-10 py-36">
        <div ref={ref} className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block font-mono text-[11px] uppercase tracking-widest text-accent border border-accent/25 bg-accent/5 px-3 py-1.5 rounded-full mb-8">
              ¿Listo para empezar?
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
              ¿Tienes un proyecto<br />en mente?
            </h2>

            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Cuéntanos qué necesitas. En menos de 48 horas te enviamos una propuesta técnica detallada sin compromiso.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <a
                href="mailto:hola@appsdevpro.com"
                className="flex items-center gap-2.5 bg-accent hover:bg-accent-hover text-white font-semibold text-base px-7 py-3.5 rounded-full transition-colors duration-200 shadow-[0_0_30px_rgba(67,97,238,0.4)]"
              >
                <ArrowRight size={16} />
                Solicitar propuesta gratuita
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 border border-white/25 bg-white/[0.06] hover:bg-white/[0.12] text-white font-medium text-base px-7 py-3.5 rounded-full transition-all duration-200"
              >
                <MessageCircle size={16} />
                WhatsApp →
              </a>
            </div>

            <p className="text-white/50 text-sm">
              O escríbenos a{' '}
              <a href="mailto:hola@appsdevpro.com" className="text-accent hover:underline underline-offset-2">
                hola@appsdevpro.com
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
