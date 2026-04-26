import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Navbar from '../layout/Navbar'
import WordsPullUp from '../animations/WordsPullUp'
import { useContent, getSizeStyle } from '../../lib/ContentContext'
import { renderRich } from '../../lib/renderRich'

function parseHeading(raw: string): { text: string; accent: boolean }[] {
  const parts: { text: string; accent: boolean }[] = []
  const re = /\{\{(.+?)\}\}/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(raw)) !== null) {
    if (m.index > last) {
      const t = raw.slice(last, m.index).replace(/\s+$/, '')
      if (t) parts.push({ text: t, accent: false })
    }
    parts.push({ text: m[1], accent: true })
    last = re.lastIndex
  }
  const tail = raw.slice(last).replace(/^\s+/, '')
  if (tail) parts.push({ text: tail, accent: false })
  return parts.length ? parts : [{ text: raw, accent: false }]
}

export default function Hero() {
  const c = useContent('hero')
  const heading     = c.heading      || 'Desarrollo de Apps y Tiendas {{Shopify}}'
  const desc        = c.description  || 'Construimos **apps Shopify a medida**, **integraciones con sistemas externos** y **tiendas Shopify completas** para merchants que necesitan más de lo que ofrece el App Store. Desde **apps publicadas en el Shopify App Store** hasta **soluciones privadas conectadas a tu ERP o CRM**, desarrollamos exactamente lo que tu operación requiere.'
  const supportText = c.support_text || 'Somos un equipo enfocado al 100% en el **ecosistema Shopify**. No hacemos WordPress, no hacemos apps móviles, no somos generalistas: desarrollamos **apps Shopify**, **custom apps**, **checkout extensions**, **integraciones API** y **themes Shopify 2.0** con un stack moderno basado en **Remix, TypeScript, Node.js y PostgreSQL**. Ya tenemos apps en producción con merchants reales pagando suscripción mensual — no estamos aprendiendo con tu proyecto.'
  const cta         = c.cta_label    || 'Solicitar propuesta gratuita'
  const href        = c.cta_href     || '#contacto'
  const cta2        = c.cta2_label   || 'Ver apps publicadas'
  const microcopy   = c.microcopy    || 'Respuesta técnica en 48 horas · Sin compromiso · Atención en español e inglés'
  const video       = c.video_url    || 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4'

  const headingStyle = getSizeStyle(c.heading_size)

  const parts = parseHeading(heading)
  let cumulativeDelay = 0
  const timedParts = parts.map(p => {
    const delay = cumulativeDelay
    cumulativeDelay += p.text.split(/\s+/).filter(Boolean).length * 0.08
    return { ...p, delay }
  })

  return (
    <section className="h-screen p-4 md:p-6">
      <div className="relative h-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-[#07090F]">
        <video src={video} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
        <div className="noise-overlay opacity-[0.07] mix-blend-overlay pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10 pointer-events-none" />
        <Navbar />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-8 pb-6 md:pb-10">
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 md:col-span-7">
              <h1
                className="select-none"
                style={{ fontSize: 'clamp(44px, 5.5vw, 76px)', fontWeight: 800, lineHeight: '0.92', letterSpacing: '-0.04em', ...headingStyle }}
              >
                {timedParts.map((p, i) => (
                  <span key={i}>
                    {i > 0 && ' '}
                    <WordsPullUp
                      text={p.text}
                      wordClassName={p.accent ? 'text-[#4361EE]' : 'text-[#EDF0FF]'}
                      stagger={0.08}
                      delay={p.delay}
                    />
                  </span>
                ))}
              </h1>
            </div>
            <div className="col-span-12 md:col-span-5 flex flex-col gap-3 md:pb-2">
              <motion.p
                className="text-sm md:text-base leading-[1.5] text-white/90"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {renderRich(desc, 'font-semibold text-white')}
              </motion.p>
              <motion.p
                className="text-xs md:text-sm leading-relaxed text-white/50"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                {renderRich(supportText, 'font-semibold text-white/70')}
              </motion.p>
              <motion.div
                className="flex flex-wrap items-center gap-3 pt-1"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <a
                  href={href}
                  className="group inline-flex items-center gap-2 hover:gap-3 transition-all duration-300 bg-[#4361EE] rounded-full pl-5 pr-1.5 py-1.5"
                >
                  <span className="text-white font-medium text-sm whitespace-nowrap">{cta}</span>
                  <span className="bg-black rounded-full w-9 h-9 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <ArrowRight size={16} style={{ color: '#EDF0FF' }} />
                  </span>
                </a>
                <a
                  href="#apps"
                  className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                >
                  {cta2}
                </a>
              </motion.div>
              <motion.p
                className="text-[11px] font-mono text-white/35"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
              >
                {microcopy}
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
