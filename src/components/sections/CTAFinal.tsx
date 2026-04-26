import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { useContent } from '../../lib/ContentContext'

const HLS_SRC = 'https://stream.mux.com/01yW6GoUz01OTXk5w1Rt1MHkJWlCGIwj46SUONJZ4DJUE.m3u8'

function GalaxyVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let destroy: (() => void) | undefined

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = HLS_SRC
    } else {
      import('hls.js').then(({ default: Hls }) => {
        if (!Hls.isSupported() || !videoRef.current) return
        const hls = new Hls({ enableWorker: false })
        hls.loadSource(HLS_SRC)
        hls.attachMedia(videoRef.current)
        destroy = () => hls.destroy()
      })
    }

    return () => destroy?.()
  }, [])

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    />
  )
}

export default function CTAFinal() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const c = useContent('ctafinal')

  const label     = c.label     || '¿Listo para empezar?'
  const heading   = c.heading   || '¿Tienes un proyecto de desarrollo Shopify en mente?'
  const desc      = c.desc      || 'Cuéntanos qué necesitas. En menos de 48 horas te enviamos una propuesta técnica detallada y sin compromiso con arquitectura recomendada, stack técnico justificado, plazo realista por fases y presupuesto cerrado. Si vemos que el proyecto encaja con nuestro perfil, empezamos a construir. Si vemos que no encaja, también te lo decimos directamente.'
  const cta1      = c.cta1_label || 'Solicitar propuesta gratuita'
  const cta2      = c.cta2_label || 'Hablar por WhatsApp'
  const microcopy = c.microcopy  || 'O escríbenos directo a hola@appsdevpro.com · Atendemos en español e inglés · Respuesta en 24 horas hábiles'

  return (
    <section id="contacto" className="relative overflow-hidden">
      <GalaxyVideo />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      <div className="noise-overlay opacity-[0.05] mix-blend-overlay" />

      <div className="relative z-10 py-36">
        <div ref={ref} className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block font-mono text-[11px] uppercase tracking-widest text-[#4361EE] border border-[#4361EE]/25 bg-[#4361EE]/5 px-3 py-1.5 rounded-full mb-8">
              {label}
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
              {heading}
            </h2>

            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              {desc}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <a
                href="mailto:hola@appsdevpro.com"
                className="flex items-center gap-2.5 bg-[#4361EE] hover:bg-[#3451D1] text-white font-semibold text-base px-7 py-3.5 rounded-full transition-colors duration-200 shadow-[0_0_30px_rgba(67,97,238,0.4)]"
              >
                <ArrowRight size={16} />
                {cta1}
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 border border-white/25 bg-white/[0.06] hover:bg-white/[0.12] text-white font-medium text-base px-7 py-3.5 rounded-full transition-all duration-200"
              >
                <MessageCircle size={16} />
                {cta2}
              </a>
            </div>

            <p className="text-white/45 text-sm font-mono">
              {microcopy}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
