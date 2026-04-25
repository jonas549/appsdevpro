export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0C0F1A] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Logo + description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-[#3451D1] flex items-center justify-center text-white font-bold text-xs">
                AP
              </div>
              <span className="font-bold text-primary text-sm">
                Apps<span className="text-accent">Dev</span>Pro
              </span>
            </div>
            <p className="text-[#7B8DB0] text-sm leading-relaxed">
              Agencia especializada en desarrollo de aplicaciones Shopify. Apps publicadas, integraciones y soluciones a medida.
            </p>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-primary font-semibold text-sm mb-4">Servicios</h4>
            <ul className="space-y-2.5">
              {['Desarrollo de Apps', 'Apps Privadas', 'Integraciones', 'Checkout Extensions', 'Consultoría Shopify'].map((s) => (
                <li key={s}>
                  <a href="#servicios" className="text-[#7B8DB0] text-sm hover:text-primary transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Apps */}
          <div>
            <h4 className="text-primary font-semibold text-sm mb-4">Apps</h4>
            <ul className="space-y-2.5">
              {['Calendify Delivery', 'Descuentify', 'Ver App Store →'].map((s) => (
                <li key={s}>
                  <a href="#apps" className="text-[#7B8DB0] text-sm hover:text-primary transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-primary font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {['Política de Privacidad', 'Términos de Servicio', 'Contacto'].map((s) => (
                <li key={s}>
                  <a href="#" className="text-[#7B8DB0] text-sm hover:text-primary transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#7B8DB0] text-xs font-mono">
            © {year} Apps Developers Pro. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[#7B8DB0] text-xs hover:text-primary transition-colors">Privacidad</a>
            <a href="#" className="text-[#7B8DB0] text-xs hover:text-primary transition-colors">Términos</a>
            <a href="mailto:hola@appsdevpro.com" className="text-[#7B8DB0] text-xs hover:text-primary transition-colors">hola@appsdevpro.com</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
