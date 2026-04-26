import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Zap, Lock, Link, ShoppingCart, Layout, ArrowRight } from 'lucide-react'
import { useContent, getSizeStyle } from '../../lib/ContentContext'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_143803_f635b644-d959-4f16-9d29-cedaeb5c6de0.mp4'

function parseAccent(raw: string): { text: string; accent: boolean }[] {
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

const CARD_ICONS = [<Lock size={18} />, <Link size={18} />, <ShoppingCart size={18} />, <Layout size={18} />]

const CARD_DEFAULTS = [
  {
    id: '02',
    title: 'Apps Privadas (Custom Apps)',
    desc: 'Desarrollamos apps privadas para merchants que necesitan funcionalidad exclusiva sin pasar por el review del App Store. Sin marketplace, instalación directa, scope completo disponible y tiempos más cortos.',
    tag: 'Custom App · Sin marketplace',
  },
  {
    id: '03',
    title: 'Integraciones, APIs y Webhooks',
    desc: 'Conectamos Shopify con cualquier sistema externo mediante APIs robustas y webhooks confiables. Sincronización bidireccional con ERP, CRM, WMS, facturación electrónica latinoamericana y herramientas de BI.',
    tag: 'ERP · CRM · Webhooks · REST',
  },
  {
    id: '04',
    title: 'Checkout Extensions y Shopify Plus',
    desc: 'Upsells en checkout, validaciones personalizadas, descuentos dinámicos y bloques en thank you page. Trabajamos con la nueva arquitectura de checkout extensibility, no con Script Editor deprecado.',
    tag: 'Shopify Plus · Checkout UI',
  },
  {
    id: '05',
    title: 'Themes Shopify 2.0 + Consultoría',
    desc: 'Themes desde cero con secciones dinámicas, app blocks y JSON templates optimizados para Core Web Vitals. Auditorías técnicas para evaluar el stack de apps actual y proponer una hoja de ruta realista.',
    tag: 'Liquid · Shopify 2.0 · Auditoría',
  },
]

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const c = useContent('services')

  const headingRaw = c.heading    || 'Todo lo que necesitas para desarrollar y escalar en {{Shopify}}'
  const subheading = c.subheading || 'Especialistas en el ecosistema Shopify. Sin generalistas, sin proyectos paralelos en otras plataformas.'
  const mainLabel  = c.main_label || 'Servicio principal'
  const mainTitle  = c.main_title || 'Desarrollo de Apps Shopify'
  const mainDesc   = c.main_desc  || 'Construimos tu app Shopify de principio a fin: arquitectura técnica, frontend con React y Polaris, backend con Remix y Node.js, base de datos PostgreSQL, autenticación OAuth, billing recurrente, webhooks y publicación en el App Store. Cada app incluye documentación técnica, repositorio Git, pipeline de CI/CD y tests automatizados.'
  const mainTags   = (c.main_tags || 'Remix,React,Node.js,PostgreSQL,Polaris,GraphQL Admin API').split(',')

  const headingStyle    = getSizeStyle(c.heading_size)
  const subheadingStyle = getSizeStyle(c.subheading_size)
  const mainTitleStyle  = getSizeStyle(c.main_title_size)
  const mainDescStyle   = getSizeStyle(c.main_desc_size)

  const headingParts = parseAccent(headingRaw)

  const cards = [1, 2, 3, 4].map((n, i) => ({
    id:    c[`card${n}_id`]    || CARD_DEFAULTS[i].id,
    icon:  CARD_ICONS[i],
    title: c[`card${n}_title`] || CARD_DEFAULTS[i].title,
    desc:  c[`card${n}_desc`]  || CARD_DEFAULTS[i].desc,
    tag:   c[`card${n}_tag`]   || CARD_DEFAULTS[i].tag,
  }))

  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <video
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      <div className="noise-overlay opacity-[0.06] mix-blend-overlay pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#EDF0FF] mb-3 leading-tight" style={headingStyle}>
            {headingParts.map((part, i) => (
              <span key={i} style={part.accent ? { color: '#4361EE' } : {}}>
                {i > 0 ? ' ' : ''}{part.text}
              </span>
            ))}
          </h2>
          <p className="text-[#9BA8BE] text-sm md:text-base max-w-2xl" style={subheadingStyle}>{subheading}</p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Featured card — Servicio 01 */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-white/[0.05] backdrop-blur-md border border-[#4361EE]/30 rounded-2xl p-7 lg:row-span-2 flex flex-col justify-between overflow-hidden group"
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'radial-gradient(600px circle at 50% 0%, rgba(67,97,238,0.1), transparent 60%)' }}
            />
            <span className="absolute bottom-4 right-6 font-mono text-8xl font-bold text-white opacity-[0.04] pointer-events-none select-none">01</span>
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[#4361EE]"><Zap size={22} /></span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#4361EE]">{mainLabel}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4" style={mainTitleStyle}>{mainTitle}</h3>
              <p className="text-[#9BA8BE] text-sm leading-relaxed mb-6" style={mainDescStyle}>{mainDesc}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {mainTags.map((t) => (
                  <span key={t} className="font-mono text-[11px] text-[#4361EE] border border-[#4361EE]/30 bg-[#4361EE]/5 px-3 py-1 rounded-full">
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>
            <a href="#contacto" className="flex items-center gap-2 text-[#4361EE] text-sm font-semibold hover:gap-3 transition-all duration-200 w-fit">
              Contactar ahora <ArrowRight size={14} />
            </a>
          </motion.div>

          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.6, delay: (i + 1) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between overflow-hidden cursor-default transition-all duration-300 hover:border-[#4361EE]/30 hover:bg-white/[0.06]"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(90deg, #4361EE, transparent)' }}
              />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#4361EE]">{card.icon}</span>
                  <span className="font-mono text-[10px] text-[#7B8DB0] opacity-40">{card.id}</span>
                </div>
                <h3 className="font-bold text-[#EDF0FF] text-base mb-2">{card.title}</h3>
                <p className="text-[#7B8DB0] text-sm leading-relaxed mb-4">{card.desc}</p>
                <span className="font-mono text-[11px] text-[#4361EE] bg-[#4361EE]/5 border border-[#4361EE]/20 px-2.5 py-1 rounded-full">
                  {card.tag}
                </span>
              </div>
              <a href="#contacto" className="flex items-center gap-1.5 text-[#4361EE] text-sm font-semibold mt-5 hover:gap-2.5 transition-all duration-200 w-fit">
                Contactar ahora <ArrowRight size={13} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
