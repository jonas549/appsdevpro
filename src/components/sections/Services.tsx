import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Zap, Lock, Link, ShoppingCart, Layout, ArrowRight } from 'lucide-react'
import WordsPullUp from '../animations/WordsPullUp'
import { useContent, getSizeStyle } from '../../lib/ContentContext'

const CARD_ICONS = [<Lock size={18} />, <Link size={18} />, <ShoppingCart size={18} />, <Layout size={18} />]
const CARD_DEFAULTS = [
  { id: '02', title: 'Apps Privadas',        desc: 'Soluciones exclusivas para tu tienda, sin necesidad de pasar por el App Store. Funcionalidades totalmente personalizadas.', tag: 'Shopify Private Apps' },
  { id: '03', title: 'Integraciones',        desc: 'Conectamos Shopify con tu ERP, CRM, WMS o cualquier sistema interno. APIs robustas y sincronización en tiempo real.',       tag: 'API & Webhooks' },
  { id: '04', title: 'Checkout Extensions', desc: 'Upsells, validaciones y personalización avanzada del proceso de pago con las Checkout Extensions de Shopify.',              tag: 'Checkout UI' },
  { id: '05', title: 'Themes + Consultoría',desc: 'Desarrollamos themes Shopify 2.0 y brindamos consultoría técnica para optimizar tu stack de comercio electrónico.',          tag: 'Theme Development' },
]

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const c = useContent('services')

  const heading    = c.heading    || 'Todo lo que necesitas para desarrollar en Shopify'
  const subheading = c.subheading || 'Especialistas en el ecosistema Shopify. Sin generalistas.'
  const mainLabel  = c.main_label || 'Servicio principal'
  const mainTitle  = c.main_title || 'Desarrollo de Apps Shopify'
  const mainDesc   = c.main_desc  || 'Construimos tu app Shopify de principio a fin: arquitectura, frontend, backend, base de datos y publicación en el App Store. Apps que escalan con tu negocio.'
  const mainTags   = (c.main_tags || 'Remix,React,Node.js,PostgreSQL').split(',')

  const headingStyle    = getSizeStyle(c.heading_size)
  const subheadingStyle = getSizeStyle(c.subheading_size)
  const mainTitleStyle  = getSizeStyle(c.main_title_size)
  const mainDescStyle   = getSizeStyle(c.main_desc_size)

  const cards = [1, 2, 3, 4].map((n, i) => ({
    id:    c[`card${n}_id`]    || CARD_DEFAULTS[i].id,
    icon:  CARD_ICONS[i],
    title: c[`card${n}_title`] || CARD_DEFAULTS[i].title,
    desc:  c[`card${n}_desc`]  || CARD_DEFAULTS[i].desc,
    tag:   c[`card${n}_tag`]   || CARD_DEFAULTS[i].tag,
  }))

  return (
    <section className="relative bg-[#0C0F1A] py-28 md:py-36 overflow-hidden">
      <div className="noise-overlay" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3" style={headingStyle}>
            <WordsPullUp text={heading} stagger={0.05} />
          </h2>
          <p className="text-[#7B8DB0] text-sm md:text-base" style={subheadingStyle}>{subheading}</p>
        </div>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Featured card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-gradient-to-br from-[#111827] to-[#0D1526] border border-accent/25 rounded-2xl p-7 lg:row-span-2 flex flex-col justify-between overflow-hidden group"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(600px circle at 50% 0%, rgba(67,97,238,0.08), transparent 60%)' }} />
            <span className="absolute bottom-4 right-6 font-mono text-8xl font-bold text-white opacity-[0.04] pointer-events-none select-none">01</span>
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-accent"><Zap size={22} /></span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">{mainLabel}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4" style={mainTitleStyle}>{mainTitle}</h3>
              <p className="text-[#7B8DB0] text-sm leading-relaxed mb-6" style={mainDescStyle}>{mainDesc}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {mainTags.map((t) => (
                  <span key={t} className="font-mono text-[11px] text-accent border border-accent/30 bg-accent/5 px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </div>
            <a href="#contacto" className="flex items-center gap-2 text-accent text-sm font-semibold hover:gap-3 transition-all duration-200 w-fit">
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
              className="group relative bg-[#10141F] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between overflow-hidden cursor-default transition-all duration-300 hover:border-accent/25 hover:shadow-[0_0_30px_rgba(67,97,238,0.08)]"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, #4361EE, transparent)' }} />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-accent">{card.icon}</span>
                  <span className="font-mono text-[10px] text-[#7B8DB0] opacity-40">{card.id}</span>
                </div>
                <h3 className="font-bold text-primary text-base mb-2">{card.title}</h3>
                <p className="text-[#7B8DB0] text-sm leading-relaxed mb-4">{card.desc}</p>
                <span className="font-mono text-[11px] text-accent bg-accent/5 border border-accent/20 px-2.5 py-1 rounded-full">{card.tag}</span>
              </div>
              <a href="#contacto" className="flex items-center gap-1.5 text-accent text-sm font-semibold mt-5 hover:gap-2.5 transition-all duration-200 w-fit">
                Contactar ahora <ArrowRight size={13} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
