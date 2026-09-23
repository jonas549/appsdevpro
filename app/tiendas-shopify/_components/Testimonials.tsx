import Accent from "./Accent"
import { TESTIMONIALS } from "../content"
import { H2 } from "./type"

// Sin testimonios reales en content.ts, la sección no se pinta.
export default function Testimonials() {
  if (TESTIMONIALS.length === 0) return null
  return (
    <section className="px-[clamp(18px,4vw,56px)] py-[clamp(80px,10vw,140px)]">
      <div className="mx-auto max-w-[1240px]">
        <h2 data-reveal className={`${H2} mb-[clamp(36px,4vw,56px)] text-primary`}>
          Lo que <Accent>dicen</Accent> las marcas
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {TESTIMONIALS.map(t => (
            <figure
              key={t.name}
              data-reveal
              className="m-0 flex min-h-[260px] flex-col justify-between gap-10 rounded-3xl border border-white/[0.07] bg-[#0D1117] p-[30px] transition-[transform,border-color] duration-500 hover:-translate-y-1.5 hover:border-white/[0.18]"
            >
              <blockquote className="m-0 text-lg font-medium leading-relaxed text-primary">“{t.quote}”</blockquote>
              <figcaption>
                <div className="text-[15px] font-semibold text-primary">{t.name}</div>
                <div className="text-[13px] text-[#64748B]">{t.store} · {t.country}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
