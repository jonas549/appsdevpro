import Image from "next/image"
import type { Project } from "../content"
import { SMALL } from "./type"

const EASE = "ease-[cubic-bezier(.2,.8,.2,1)]"

// Portátil con la captura de escritorio y, superpuesto en la esquina inferior
// derecha, el móvil con la captura móvil: las dos versiones se ven a la vez.
// El hueco a la derecha y abajo (mr/mb del portátil) es donde asoma el móvil,
// así en pantallas pequeñas no se sale de la tarjeta ni tapa la cabecera de la tienda.
export default function ProjectCard({ p, index, total }: { p: Project; index: number; total: number }) {
  const num = String(index + 1).padStart(2, "0")
  return (
    <article
      className="group relative flex flex-wrap gap-3 overflow-hidden rounded-[32px] border border-white/[0.07] p-[clamp(18px,2.4vw,32px)] transition-colors duration-500 hover:border-white/[0.16] min-[860px]:min-h-[min(78vh,720px)]"
      style={{ background: p.bg }}
    >
      <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(70% 90% at 80% 60%, ${p.glow} 0%, transparent 70%)` }} />

      <div className="relative flex min-w-0 flex-[1_1_300px] flex-col justify-between gap-8 p-[clamp(8px,1vw,16px)]">
        <div className="flex items-center justify-between gap-4">
          <div className="text-4xl font-extrabold leading-none tracking-[-0.04em] text-primary md:text-5xl">{num}</div>
          <div className="rounded-full bg-white/[0.06] px-3.5 py-2 text-[13px] text-[#7B8DB0] transition-colors duration-500 group-hover:bg-primary group-hover:text-[#07090F]">
            Proyecto {num} / {String(total).padStart(2, "0")}
          </div>
        </div>
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            {[p.country, p.sector].map(t => (
              <span key={t} className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-[7px] text-[13px] text-[#C6D0E6]">{t}</span>
            ))}
          </div>
          <h3 className="mb-3 text-2xl font-bold leading-tight tracking-[-0.03em] text-primary md:text-[32px]">{p.name}</h3>
          <p className={`${SMALL} m-0 max-w-[36ch] text-[#7B8DB0] md:text-base`}>{p.line}</p>
          <a href={p.url} target="_blank" rel="noopener" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#A9B6D3] transition-colors hover:text-primary">
            Ver tienda <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className="relative flex min-w-0 flex-[1.7_1_380px] items-center justify-center px-[clamp(4px,2vw,32px)] py-[clamp(12px,3vw,40px)]">
        <div className="relative w-full max-w-[640px]">
          <div className={`mb-[14%] mr-[7%] transition-transform duration-700 ${EASE} group-hover:-translate-y-2.5 group-hover:scale-[1.02]`}>
            <div className="rounded-b-[4px] rounded-t-[14px] border border-white/[0.12] bg-[#1B1B1B] px-[2%] pb-[2.2%] pt-[2%]">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[5px] bg-[#0D0D0D]">
                <Image
                  src={`/portfolio/${p.slug}-desktop.webp`}
                  alt={`Tienda ${p.name} en escritorio`}
                  fill
                  sizes="(max-width: 860px) 85vw, 600px"
                  className="object-cover object-top"
                />
              </div>
            </div>
            <div className="mx-[-5%] h-[9px] rounded-b-2xl md:h-[13px] rounded-t-sm bg-[linear-gradient(180deg,#2E2E2E,#141414)] shadow-[0_30px_50px_rgba(0,0,0,.5)]" />
          </div>

          <div
            className={`absolute bottom-0 right-0 w-[24%] rounded-[clamp(12px,2.2vw,24px)] border border-white/[0.14] bg-[#1B1B1B] p-[1.1%] shadow-[0_30px_60px_rgba(0,0,0,.6)] transition-transform duration-700 ${EASE} group-hover:-translate-x-3.5 group-hover:-translate-y-6 group-hover:-rotate-3`}
          >
            <div className="relative aspect-[390/844] overflow-hidden rounded-[clamp(9px,1.8vw,18px)] bg-[#0D0D0D]">
              <Image
                src={`/portfolio/${p.slug}-mobile.webp`}
                alt={`Tienda ${p.name} en móvil`}
                fill
                sizes="(max-width: 860px) 25vw, 160px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
