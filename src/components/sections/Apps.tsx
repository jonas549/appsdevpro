import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ExternalLink, ArrowRight, Lock } from 'lucide-react'
import WordsPullUp from '../animations/WordsPullUp'
import { useContent, getSizeStyle } from '../../lib/ContentContext'
import { renderRich } from '../../lib/renderRich'

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
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: bar.color }}
              initial={{ width: 0 }}
              whileInView={{ width: `${bar.pct}%` }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function DescuentifyMockup() {
  return (
    <div className="bg-[#FFFBF0] rounded-xl p-5 h-44 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[#374151] font-semibold text-sm">Motor de Descuentos</span>
        <span className="text-xs font-mono text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full">En desarrollo</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'AOV esperado', value: '+28%', color: '#F59E0B' },
          { label: 'Descuentos vol.', value: 'N tiers', color: '#F97316' },
          { label: 'Campañas activas', value: 'Multi', color: '#EAB308' },
          { label: 'Buy X Get Y', value: 'Avanzado', color: '#D97706' },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-lg p-2.5 border border-[#FDE68A]">
            <div className="font-bold text-base" style={{ color: m.color }}>{m.value}</div>
            <div className="text-[10px] text-[#6B7280] leading-tight">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NDAMockup() {
  return (
    <div className="bg-[#0F1422] rounded-xl p-5 h-44 flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center">
        <Lock size={20} className="text-[#7B8DB0]" />
      </div>
      <p className="text-[#7B8DB0] text-xs text-center leading-snug max-w-[180px]">
        Capturas bajo NDA · Disponible previa reunión
      </p>
    </div>
  )
}

const APP_DEFAULTS = [
  {
    status: 'active',
    badge: 'Publicada en Shopify App Store · Activa en producción',
    title: 'Calendify Delivery',
    subtitle: 'Gestión de entregas con calendario y rangos horarios',
    desc: '**Calendify Delivery** es una **app Shopify de gestión de entregas** que permite a los merchants ofrecer al cliente la elección de **fecha de entrega y rango horario** directamente desde el carrito o el checkout. Diseñada para tiendas que venden productos perecederos, voluminosos o servicios con instalación a domicilio.\n\nIncluye **panel de administración completo**, **configuración por zona de reparto y código postal**, **límite de capacidad por día**, **bloqueo de fechas y feriados**, **notificaciones automáticas** e integración con los datos del pedido en Shopify. Más de **50 tiendas activas** la usan hoy en producción.',
    tags: 'Shopify,Remix,TypeScript,PostgreSQL,Prisma,Vercel',
    cta: 'Ver en App Store →',
    store_url: 'https://apps.shopify.com/calendify-delivery',
  },
  {
    status: 'upcoming',
    badge: 'Próximamente en Shopify App Store · En desarrollo activo',
    title: 'Descuentify',
    subtitle: 'Motor de descuentos avanzado para Shopify',
    desc: '**Descuentify** es un **motor de descuentos para Shopify** que va más allá de las reglas nativas. Para merchants que necesitan **descuentos por volumen escalonado**, **combos entre variantes específicas**, **bulk price editor masivo**, **campañas con condiciones combinadas** y **reglas Buy X Get Y avanzadas**.\n\nEl objetivo es claro: **subir el ticket promedio (AOV) sin canibalizar margen**. Construida con la **Shopify Functions API** para que los descuentos se apliquen correctamente al pricing del checkout, con un panel que cualquier persona del equipo de marketing puede usar sin pasar por desarrollo.',
    tags: 'Shopify,Remix,TypeScript,PostgreSQL,Shopify Functions,GraphQL Admin API',
    cta: 'Ver más →',
    store_url: '',
  },
  {
    status: 'nda',
    badge: 'Custom Apps Privadas · Bajo NDA',
    title: 'Apps Privadas para Clientes',
    subtitle: 'Integraciones, automatizaciones y paneles internos',
    desc: 'También desarrollamos **apps privadas para clientes** que prefieren mantener sus integraciones fuera del App Store: **integraciones con ERPs propios**, **herramientas de operación logística específica**, **paneles internos de gestión**, **automatizaciones B2B** y **conectores con sistemas legacy**.\n\nNo podemos mostrar capturas ni nombres por **NDA**, pero podemos contarte casos de uso similares al tuyo si tu proyecto encaja en este perfil durante la reunión inicial.',
    tags: 'ERP,CRM,WMS,Integración,Automatización,B2B',
    cta: 'Hablemos →',
    store_url: '',
  },
]

const MOCKUPS = [<CalendifyMockup />, <DescuentifyMockup />, <NDAMockup />]

export default function Apps() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const c = useContent('apps')

  const heading    = c.heading    || 'Apps que ya están resolviendo problemas reales en producción'
  const subheading = c.subheading || '**Publicadas en el Shopify App Store**, en **producción** y con **merchants reales pagando suscripción mensual**. No te pedimos que confíes — te mostramos lo que ya construimos y está funcionando.'
  const headingStyle    = getSizeStyle(c.heading_size)
  const subheadingStyle = getSizeStyle(c.subheading_size)

  const apps = [1, 2, 3].map((n, i) => ({
    mockup:    MOCKUPS[i],
    status:    c[`app${n}_status`]    || APP_DEFAULTS[i].status,
    badge:     c[`app${n}_badge`]     || APP_DEFAULTS[i].badge,
    title:     c[`app${n}_title`]     || APP_DEFAULTS[i].title,
    subtitle:  c[`app${n}_subtitle`]  || APP_DEFAULTS[i].subtitle,
    desc:      c[`app${n}_desc`]      || APP_DEFAULTS[i].desc,
    tags:      (c[`app${n}_tags`]     || APP_DEFAULTS[i].tags).split(','),
    cta:       c[`app${n}_cta`]       || APP_DEFAULTS[i].cta,
    store_url: c[`app${n}_store_url`] || APP_DEFAULTS[i].store_url,
  }))

  function getBadgeStyle(status: string) {
    if (status === 'active')   return { color: '#10B981', bg: '#10B98112', dot: '#10B981' }
    if (status === 'upcoming') return { color: '#D97706', bg: '#F59E0B12', dot: '#F59E0B' }
    return { color: '#818CF8', bg: '#818CF812', dot: '#818CF8' }
  }

  return (
    <section id="apps" className="bg-[#F2F5FB] py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4" style={headingStyle}>
            <WordsPullUp text={heading} wordClassName="text-[#0F172A]" stagger={0.05} />
          </h2>
          <p className="text-[#4B5563] text-sm md:text-base max-w-2xl mx-auto" style={subheadingStyle}>
            {renderRich(subheading, 'font-semibold text-[#1E293B]')}
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app, i) => {
            const badge = getBadgeStyle(app.status)
            const isNDA = app.status === 'nda'
            const borderColor = isNDA ? '#E0E4F0' : (app.status === 'active' ? '#E5E7EB' : '#FDE68A')

            return (
              <motion.div
                key={i}
                initial={{ y: 40, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
                style={{ border: `1px solid ${borderColor}` }}
              >
                <div className="p-5 pb-2 border-b" style={{ borderColor, backgroundColor: isNDA ? '#07090F' : undefined }}>
                  {app.mockup}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium px-2.5 py-1 rounded-full mb-3 self-start"
                    style={{ color: badge.color, backgroundColor: badge.bg }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: badge.dot }} />
                    {app.badge}
                  </span>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-0.5">{app.title}</h3>
                  <p className="text-[#6B7280] text-xs mb-3">{app.subtitle}</p>
                  <div className="text-[#4B5563] text-sm leading-relaxed mb-5 flex-1">
                    {app.desc.split('\n\n').map((para, pi) => (
                      <p key={pi} className={pi > 0 ? 'mt-3' : ''}>
                        {renderRich(para, 'font-semibold text-[#1E293B]')}
                      </p>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {app.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] border px-2 py-0.5 rounded-full"
                        style={{
                          color: app.status === 'active' ? '#4361EE' : app.status === 'upcoming' ? '#D97706' : '#818CF8',
                          borderColor: app.status === 'active' ? 'rgba(67,97,238,0.2)' : app.status === 'upcoming' ? 'rgba(217,119,6,0.25)' : 'rgba(129,140,248,0.25)',
                          backgroundColor: app.status === 'active' ? 'rgba(67,97,238,0.05)' : app.status === 'upcoming' ? 'rgba(245,158,11,0.05)' : 'rgba(129,140,248,0.05)',
                        }}
                      >
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                  {app.store_url ? (
                    <a
                      href={app.store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-semibold text-sm hover:gap-2.5 transition-all duration-200 w-fit text-[#4361EE]"
                    >
                      {app.cta} <ExternalLink size={13} />
                    </a>
                  ) : (
                    <a
                      href="#contacto"
                      className="flex items-center gap-1.5 font-semibold text-sm hover:gap-2.5 transition-all duration-200 w-fit"
                      style={{ color: app.status === 'upcoming' ? '#D97706' : '#818CF8' }}
                    >
                      {app.cta} <ArrowRight size={13} />
                    </a>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
