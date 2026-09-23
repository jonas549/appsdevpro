import Accent from "./Accent"
import { BODY, H2, H3 } from "./type"

const STORE_POINTS = [
  "Diseño propio, no plantilla suelta",
  "Catálogo, pagos y envíos configurados",
  "Rediseño y migración de tiendas existentes",
]

const DISCOUNT_TYPES = [
  { t: "Packs", s: "Precio fijo promocional" },
  { t: "Por cantidad", s: "Descuentos escalonados" },
  { t: "Compra X lleva Y", s: "Buy X Get Y" },
  { t: "Cupones", s: "Campañas con código" },
]

const card = "flex min-w-0 flex-col justify-between rounded-[28px] p-[clamp(26px,3vw,40px)] transition-[border-color,transform] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-1"

export default function Specialty() {
  return (
    <section id="especialidad" className="scroll-mt-24 px-[clamp(18px,4vw,56px)] py-[clamp(80px,10vw,150px)]">
      <div className="mx-auto max-w-[1240px]">
        <div data-reveal className="mb-[clamp(40px,5vw,72px)] flex flex-wrap items-end justify-between gap-6">
          <h2 className={`${H2} m-0 max-w-[20ch] text-primary`}>
            No solo armamos tiendas. <Accent>Construimos las apps.</Accent>
          </h2>
          <p className={`${BODY} m-0 max-w-[40ch] text-[#7B8DB0]`}>
            Trabajamos Shopify desde los dos lados: la tienda que ve tu cliente y el código que la extiende.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div data-reveal className={`${card} flex-[1_1_380px] gap-12 border border-white/[0.07] bg-[#0D1117] hover:border-white/[0.18]`}>
            <div>
              <div className="mb-[18px] text-[13px] text-[#64748B]">01 — Tiendas</div>
              <h3 className={`${H3} mb-3 text-primary`}>Desarrollo de tiendas Shopify</h3>
              <p className={`${BODY} m-0 max-w-[44ch] text-[#7B8DB0]`}>
                Tiendas hechas a medida de tu marca y de cómo compran tus clientes. Rápidas, claras y pensadas primero para móvil.
              </p>
            </div>
            <ul className="border-t border-white/[0.07]">
              {STORE_POINTS.map(p => (
                <li key={p} className="flex justify-between gap-4 border-b border-white/[0.07] py-3.5 text-[15px] text-primary">
                  <span>{p}</span><span className="text-[#64748B]">→</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            data-reveal
            className={`${card} relative flex-[1.15_1_420px] gap-10 overflow-hidden border border-[#008060]/35 bg-[radial-gradient(120%_90%_at_100%_0%,rgba(0,128,96,.28)_0%,#0D1117_55%)] hover:border-[#008060]/70`}
          >
            <div>
              <div className="mb-[18px] text-[13px] text-[#64748B]">02 — Apps</div>
              <h3 className={`${H3} mb-3 text-primary`}>Desarrollo de apps para Shopify</h3>
              <p className={`${BODY} m-0 max-w-[48ch] text-[#94A3B8]`}>
                Somos creadores de <a href="https://apps.shopify.com/discountflow" target="_blank" rel="noopener" className="text-primary underline decoration-white/20 underline-offset-4 hover:decoration-white/60">DiscountFlow</a>, publicada en el Shopify App Store. Todas las tiendas que armamos la incluyen para tus campañas de descuento.
              </p>
            </div>
            <div className="rounded-[18px] border border-white/[0.08] bg-[#07090F]/70 p-4">
              <div className="mb-3 flex items-center justify-between gap-3 px-1">
                <div className="text-sm font-medium text-primary">DiscountFlow</div>
                <div className="flex items-center gap-1.5 text-xs text-[#3BD18A]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3BD18A]" />Activa en producción
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DISCOUNT_TYPES.map(d => (
                  <div key={d.t} className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-3.5 transition-colors duration-200 hover:bg-[#008060]/[0.18]">
                    <div className="text-sm font-medium text-primary">{d.t}</div>
                    <div className="mt-[3px] text-xs text-[#64748B]">{d.s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
