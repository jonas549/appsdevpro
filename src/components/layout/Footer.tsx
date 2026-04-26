import { useContent } from '../../lib/ContentContext'

export default function Footer() {
  const year = new Date().getFullYear()
  const c = useContent('footer')

  const desc      = c.description || 'Agencia especializada en desarrollo de aplicaciones para Shopify y Shopify Plus. Transformamos necesidades técnicas en soluciones reales.'
  const email     = c.email       || 'hola@appsdevpro.com'
  const copyright = c.copyright   || `© ${year} Apps Developers Pro. Todos los derechos reservados.`

  const services = [
    { label: 'Desarrollo de Apps Shopify',   href: '#servicios' },
    { label: 'Apps Privadas Personalizadas', href: '#servicios' },
    { label: 'Integraciones y APIs',         href: '#servicios' },
    { label: 'Checkout Extensions',          href: '#servicios' },
    { label: 'Themes Shopify 2.0',           href: '#servicios' },
  ]

  const apps = [
    { label: 'Calendify Delivery', href: 'https://apps.shopify.com/calendify-delivery' },
    { label: 'Descuentify',        href: '#apps' },
    { label: 'Ver todas las apps', href: '#apps' },
  ]

  const legal = [
    { label: 'Política de privacidad', href: '#' },
    { label: 'Aviso legal',            href: '#' },
    { label: 'Términos de servicio',   href: '#' },
  ]

  return (
    <footer className="bg-[#0C0F1A] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Marca */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4361EE] to-[#3451D1] flex items-center justify-center text-white font-bold text-xs">
                AP
              </div>
              <span className="font-bold text-[#EDF0FF] text-sm">
                Apps<span className="text-[#4361EE]">Dev</span>Pro
              </span>
            </div>
            <p className="text-[#7B8DB0] text-sm leading-relaxed mb-4">{desc}</p>
            <a
              href={`mailto:${email}`}
              className="text-[#4361EE] text-sm hover:underline underline-offset-2"
            >
              {email}
            </a>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-[#EDF0FF] font-semibold text-sm mb-4">Servicios</h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="text-[#7B8DB0] text-sm hover:text-[#EDF0FF] transition-colors">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Apps */}
          <div>
            <h4 className="text-[#EDF0FF] font-semibold text-sm mb-4">Apps</h4>
            <ul className="space-y-2.5">
              {apps.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="text-[#7B8DB0] text-sm hover:text-[#EDF0FF] transition-colors">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[#EDF0FF] font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {legal.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="text-[#7B8DB0] text-sm hover:text-[#EDF0FF] transition-colors">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#7B8DB0] text-xs font-mono">{copyright}</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[#7B8DB0] text-xs hover:text-[#EDF0FF] transition-colors">Privacidad</a>
            <a href="#" className="text-[#7B8DB0] text-xs hover:text-[#EDF0FF] transition-colors">Términos</a>
            <a href={`mailto:${email}`} className="text-[#7B8DB0] text-xs hover:text-[#EDF0FF] transition-colors">
              {email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
