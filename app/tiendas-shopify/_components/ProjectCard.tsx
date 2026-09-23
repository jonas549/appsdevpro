import Image from "next/image"
import { serif } from "../fonts"
import type { Project } from "../content"

export default function ProjectCard({ p, index, total }: { p: Project; index: number; total: number }) {
  const num = String(index + 1).padStart(2, "0")
  return (
    <article
      className="relative flex flex-wrap min-[860px]:min-h-[min(78vh,720px)] gap-3 overflow-hidden rounded-[32px] border border-white/[0.07] p-[clamp(18px,2.4vw,32px)]"
      style={{ background: p.bg }}
    >
      <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(70% 90% at 80% 60%, ${p.glow} 0%, transparent 70%)` }} />

      <div className="relative flex min-w-0 flex-[1_1_300px] flex-col justify-between gap-10 p-[clamp(8px,1vw,16px)]">
        <div className="flex items-center justify-between gap-4">
          <div className={`${serif.className} text-[clamp(48px,5vw,72px)] italic leading-[.8] text-primary`}>{num}</div>
          <div className="rounded-full bg-white/[0.06] px-3.5 py-2 text-[13px] text-[#7B8DB0]">
            Proyecto {num} / {String(total).padStart(2, "0")}
          </div>
        </div>
        <div>
          <div className="mb-[18px] flex flex-wrap gap-2">
            {[p.country, p.sector].map(t => (
              <span key={t} className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-[7px] text-[13px] text-[#C6D0E6]">{t}</span>
            ))}
          </div>
          <h3 className="mb-3.5 text-[clamp(30px,3.4vw,52px)] font-medium leading-none tracking-[-0.05em] text-primary">{p.name}</h3>
          <p className="m-0 max-w-[36ch] text-[15px] leading-relaxed text-[#7B8DB0]">{p.line}</p>
          <a href={p.url} target="_blank" rel="noopener" className="mt-5 inline-flex items-center gap-1.5 text-sm text-[#A9B6D3] transition-colors hover:text-primary">
            Ver tienda <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className="relative flex min-w-0 flex-[1.7_1_380px] items-center justify-center px-[clamp(4px,3vw,40px)] py-[clamp(12px,3vw,40px)]">
        <div className="relative w-full max-w-[640px]">
          <div className="rounded-t-[14px] rounded-b-[4px] border border-white/[0.12] bg-[#1B1B1B] px-[9px] pb-[11px] pt-[9px]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[5px] bg-[#0D0D0D]">
              <Image
                src={`/portfolio/${p.slug}-desktop.webp`}
                alt={`Tienda ${p.name} en escritorio`}
                fill
                sizes="(max-width: 860px) 90vw, 640px"
                className="object-cover object-top"
              />
            </div>
          </div>
          <div className="mx-[-5%] h-[13px] rounded-b-2xl rounded-t-sm bg-[linear-gradient(180deg,#2E2E2E,#141414)] shadow-[0_30px_50px_rgba(0,0,0,.5)]" />
        </div>
      </div>
    </article>
  )
}
