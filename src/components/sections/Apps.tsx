import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ExternalLink } from 'lucide-react'
import WordsPullUp from '../animations/WordsPullUp'
import { useContent } from '../../lib/ContentContext'

function CalendifyMockup() {
  return (
    <div className="bg-[#F8FAFF] rounded-xl p-5 h-44 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[#374151] font-semibold text-sm">Panel de Entregas</span>
        <span className="text-xs text-[#6B7280] font-mono">Hoy</span>
      </div>
      {[
        { label: 'Entregas completadas', pct: 82, color: '#4361EE' },
        { label: 'Satisfacción del cliente', pct: 96, color: '#10B981' },
        { label: 'Rango de horario seleccionado', pct: 74, color: '#F59E0B' },
      ].map((bar) => (
        <div key={bar.label} className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-[#6B7280]">{bar.label}</span>
            <span className="text-[10px] font-mono font-medium" style={{ color: bar.color }}>{bar.pct}%</span>
          </div>
          <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ backgroundColor: bar.color }} initial={{ width: 0 }} whileInView={{ width: `${bar.pct}%` }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function DescuentifyMockup() {
  return (
    <div className="bg-[#F8FAFF] rounded-xl p-5 h-44 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[#374151] font-semibold text-sm">Métricas del mes</span>
        <span className="text-xs font-mono text-[#10B981] bg-[#D1FAE5] px-2 py-0.5 rounded-full">En vivo</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Conversión', value: '+34%', sub: 'vs mes anterior', color: '#4361EE' },
          { label: 'Ticket medio', value: '+28%', sub: 'con descuentos', color: '#10B981' },
          { label: 'Carritos recuperados', value: '1.2k', sub: 'este mes', color: '#F59E0B' },
          { label: 'Revenue adicional', value: '$48k', sub: 'atribuido', color: '#8B5CF6' },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-lg p-2.5 border border-[#E5E7EB]">
            <div className="font-bold text-lg" style={{ color: m.color }}>{m.value}</div>
            <div className="text-[10px] text-[#6B7280] leading-tight">{m.label}</div>
            <div className="text-[9px] text-[#9CA3AF] mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const MOCKUPS = [<CalendifyMockup />, <DescuentifyMockup />]
const APP_DEFAULTS = [
  { id: 'calendify',  badge: 'Publicada en Shopify App Store', title: 'Calendify Delivery', desc: 'App de gestión de entregas con selección de rangos horarios, notificaciones automáticas y panel de control para merchants. Más de 50 tiendas activas.', tags: 'Shopify,Remix,PostgreSQL,Vercel' },
  { id: 'descuentify',badge: 'Publicada en Shopify App Store', title: 'Descuentify',         desc: 'Motor de descuentos avanzado para Shopify con reglas complejas, descuentos por volumen, combos y campañas personalizadas. Aumenta el AOV de tu tienda.',  tags: 'Shopify,Node.js,React,GraphQL' },
]

export default function Apps() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const c = useContent('apps')

  const heading    = c.heading    || 'Apps que ya están resolviendo problemas reales'
  const subheading = c.subheading || 'Publicadas en el Shopify App Store, en producción, con merchants reales.'

  const apps = [1, 2].map((n, i) => ({
    mockup: MOCKUPS[i],
    badge: c[`app${n}_badge`] || APP_DEFAULTS[i].badge,
    title: c[`app${n}_title`] || APP_DEFAULTS[i].title,
    desc:  c[`app${n}_desc`]  || APP_DEFAULTS[i].desc,
    tags:  (c[`app${n}_tags`] || APP_DEFAULTS[i].tags).split(','),
    dir:   i === 0 ? -1 : 1,
  }))

  return (
    <section id="apps" className="bg-[#F2F5FB] py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
            <WordsPullUp text={heading} wordClassName="text-[#0F172A]" stagger={0.05} />
          </h2>
          <p className="text-[#4B5563] text-sm md:text-base max-w-xl mx-auto">{subheading}</p>
        </div>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {apps.map((app, i) => (
            <motion.div
              key={i}
              initial={{ x: app.dir * 60, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: app.dir * 60, opacity: 0 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-5 pb-2 bg-[#F8FAFF] border-b border-[#E5E7EB]">{app.mockup}</div>
              <div className="p-6">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium px-2.5 py-1 rounded-full mb-4" style={{ color: '#10B981', backgroundColor: '#10B98115' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />{app.badge}
                </span>
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">{app.title}</h3>
                <p className="text-[#4B5563] text-sm leading-relaxed mb-5">{app.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {app.tags.map((t) => (
                    <span key={t} className="font-mono text-[11px] text-[#4361EE] border border-[#4361EE]/20 bg-[#4361EE]/5 px-2.5 py-1 rounded-full">{t}</span>
                  ))}
                </div>
                <a href="#contacto" className="flex items-center gap-1.5 text-accent font-semibold text-sm hover:gap-2.5 transition-all duration-200 w-fit">
                  Ver en App Store <ExternalLink size={13} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
