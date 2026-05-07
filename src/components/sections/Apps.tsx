'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ExternalLink, ArrowRight } from 'lucide-react'
import WordsPullUp from '../animations/WordsPullUp'
import { useContent, getFieldStyle } from '../../lib/ContentContext'
import { safeHtml } from '../../lib/safe-html'

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

const APP_DEFAULTS = [
  {
    status: 'active',
    badge: 'Publicada en Shopify App Store · Activa en producción',
    title: 'Calendify Delivery',
    subtitle: 'Gestión de entregas con calendario y rangos horarios',
    desc: '<strong>Calendify Delivery</strong> es una <strong>app Shopify de gestión de entregas</strong> que permite a los merchants ofrecer al cliente la elección de <strong>fecha de entrega y rango horario</strong> directamente desde el carrito o el checkout. Diseñada para tiendas que venden productos perecederos, voluminosos o servicios con instalación a domicilio.\n\nIncluye <strong>panel de administración completo</strong>, <strong>configuración por zona de reparto y código postal</strong>, <strong>límite de capacidad por día</strong>, <strong>bloqueo de fechas y feriados</strong>, <strong>notificaciones automáticas</strong> e integración con los datos del pedido en Shopify. Más de <strong>50 tiendas activas</strong> la usan hoy en producción.',
    tags: 'Shopify,Remix,TypeScript,PostgreSQL,Prisma,Vercel',
    cta: 'Ver en App Store →',
    store_url: 'https://apps.shopify.com/calendify-delivery',
  },
  {
    status: 'upcoming',
    badge: 'Próximamente en Shopify App Store · En desarrollo activo',
    title: 'Descuentify',
    subtitle: 'Motor de descuentos avanzado para Shopify',
    desc: '<strong>Descuentify</strong> es un <strong>motor de descuentos para Shopify</strong> que va más allá de las reglas nativas. Para merchants que necesitan <strong>descuentos por volumen escalonado</strong>, <strong>combos entre variantes específicas</strong>, <strong>bulk price editor masivo</strong>, <strong>campañas con condiciones combinadas</strong> y <strong>reglas Buy X Get Y avanzadas</strong>.\n\nEl objetivo es claro: <strong>subir el ticket promedio (AOV) sin canibalizar margen</strong>. Construida con la <strong>Shopify Functions API</strong> para que los descuentos se apliquen correctamente al pricing del checkout, con un panel que cualquier persona del equipo de marketing puede usar sin pasar por desarrollo.',
    tags: 'Shopify,Remix,TypeScript,PostgreSQL,Shopify Functions,GraphQL Admin API',
    cta: 'Ver más →',
    store_url: '',
  },
  {
    status: 'nda',
    badge: 'Custom Apps Privadas · Bajo NDA',
    title: 'Apps Privadas para Clientes',
    subtitle: 'Integraciones, automatizaciones y paneles internos',
    desc: 'También desarrollamos <strong>apps privadas para clientes</strong> que prefieren mantener sus integraciones fuera del App Store: <strong>integraciones con ERPs propios</strong>, <strong>herramientas de operación logística específica</strong>, <strong>paneles internos de gestión</strong>, <strong>automatizaciones B2B</strong> y <strong>conectores con sistemas legacy</strong>.\n\nNo podemos mostrar capturas ni nombres por <strong>NDA</strong>, pero podemos contarte casos de uso similares al tuyo si tu proyecto encaja en este perfil durante la reunión inicial.',
    tags: 'ERP,CRM,WMS,Integración,Automatización,B2B',
    cta: 'Hablemos →',
    store_url: '',
  },
]

const MOCKUPS = [
  <CalendifyMockup />,
  <DescuentifyMockup />,
  <img src="/app-privada.jpg" alt="Apps Privadas para Clientes" className="w-full h-44 object-cover rounded-xl" />,
]

export default function Apps() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const c = useContent('apps')

  const heading    = c.heading    || 'Apps que ya están resolviendo problemas reales en producción'
  const subheading = c.subheading || '<strong>Publicadas en el Shopify App Store</strong>, en <strong>producción</strong> y con <strong>merchants reales pagando suscripción mensual</strong>. No te pedimos que confíes — te mostramos lo que ya construimos y está funcionando.'
  const headingStyle    = getFieldStyle(c.heading_size,    c.heading_px,    c.heading_color)
  const subheadingStyle = getFieldStyle(c.subheading_size, c.subheading_px, c.subheading_color)

  const apps = [1, 2, 3].map((n, i) => ({
    mockup:       MOCKUPS[i],
    status:       c[`app${n}_status`]    || APP_DEFAULTS[i].status,
    badge:        c[`app${n}_badge`]     || APP_DEFAULTS[i].badge,
    title:        c[`app${n}_title`]     || APP_DEFAULTS[i].title,
    subtitle:     c[`app${n}_subtitle`]  || APP_DEFAULTS[i].subtitle,
    desc:         c[`app${n}_desc`]      || APP_DEFAULTS[i].desc,
    tags:         (c[`app${n}_tags`]     || APP_DEFAULTS[i].tags).split(','),
    cta:          c[`app${n}_cta`]       || APP_DEFAULTS[i].cta,
    store_url:    c[`app${n}_store_url`] || APP_DEFAULTS[i].store_url,
    titleStyle:   getFieldStyle(c[`app${n}_title_size`],    c[`app${n}_title_px`],    c[`app${n}_title_color`]),
    subtitleStyle:getFieldStyle(c[`app${n}_subtitle_size`], c[`app${n}_subtitle_px`], c[`app${n}_subtitle_color`]),
    descStyle:    getFieldStyle(c[`app${n}_desc_size`],     c[`app${n}_desc_px`],     c[`app${n}_desc_color`]),
    ctaStyle:     getFieldStyle(c[`app${n}_cta_size`],      c[`app${n}_cta_px`],      c[`app${n}_cta_color`]),
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
          <p
            className="text-[#4B5563] text-sm md:text-base max-w-2xl mx-auto [&_strong]:font-semibold [&_strong]:text-inherit [&_em]:italic"
            style={subheadingStyle}
            dangerouslySetInnerHTML={{ __html: safeHtml(subheading) }}
          />
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
                <div className="p-5 pb-2 border-b" style={{ borderColor }}>
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
                  <h3 className="text-lg font-bold text-[#0F172A] mb-0.5" style={app.titleStyle}>{app.title}</h3>
                  <p className="text-[#6B7280] text-xs mb-3" style={app.subtitleStyle}>{app.subtitle}</p>
                  <div className="text-[#4B5563] text-sm leading-relaxed mb-5 flex-1" style={app.descStyle}>
                    {app.desc.split('\n\n').map((para, pi) => (
                      <p
                        key={pi}
                        className={`[&_strong]:font-semibold [&_strong]:text-inherit [&_em]:italic ${pi > 0 ? 'mt-3' : ''}`}
                        dangerouslySetInnerHTML={{ __html: safeHtml(para) }}
                      />
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
                      style={app.ctaStyle}
                      className="flex items-center gap-1.5 font-semibold text-sm hover:gap-2.5 transition-all duration-200 w-fit text-[#4361EE]"
                    >
                      {app.cta} <ExternalLink size={13} />
                    </a>
                  ) : (
                    <a
                      href="#contacto"
                      style={{ color: app.status === 'upcoming' ? '#D97706' : '#818CF8', ...app.ctaStyle }}
                      className="flex items-center gap-1.5 font-semibold text-sm hover:gap-2.5 transition-all duration-200 w-fit"
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
