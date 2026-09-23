'use client'

import { useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { serif } from "../fonts"
import type { Project } from "../content"

type View = "desktop" | "mobile"
const EASE = [0.2, 0.8, 0.2, 1] as const

export default function ProjectCard({ p, index, total }: { p: Project; index: number; total: number }) {
  const [view, setView] = useState<View>("desktop")
  const [hover, setHover] = useState(false)
  const reduce = useReducedMotion()
  const num = String(index + 1).padStart(2, "0")

  const seg = (active: boolean) =>
    `rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200 ${active ? "bg-primary text-[#07090F]" : "text-[#7B8DB0] hover:text-primary"}`

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative flex flex-wrap gap-3 overflow-hidden rounded-[32px] border p-[clamp(18px,2.4vw,32px)] transition-colors duration-500 min-[860px]:min-h-[min(78vh,720px)] ${hover ? "border-white/[0.16]" : "border-white/[0.07]"}`}
      style={{ background: p.bg }}
    >
      <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(70% 90% at 80% 60%, ${p.glow} 0%, transparent 70%)` }} />

      <div className="relative flex min-w-0 flex-[1_1_300px] flex-col justify-between gap-10 p-[clamp(8px,1vw,16px)]">
        <div className="flex items-center justify-between gap-4">
          <div className={`${serif.className} text-[clamp(48px,5vw,72px)] italic leading-[.8] text-primary`}>{num}</div>
          <div className={`rounded-full px-3.5 py-2 text-[13px] transition-colors duration-500 ${hover ? "bg-primary text-[#07090F]" : "bg-white/[0.06] text-[#7B8DB0]"}`}>
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
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div role="tablist" aria-label={`Vista de ${p.name}`} className="flex gap-1 rounded-full border border-white/10 bg-black/30 p-1">
              {([["desktop", "Escritorio"], ["mobile", "Móvil"]] as const).map(([v, l]) => (
                <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => setView(v)} className={seg(view === v)}>
                  {l}
                </button>
              ))}
            </div>
            <a href={p.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-sm text-[#A9B6D3] transition-colors hover:text-primary">
              Ver tienda <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>

      <div className="relative flex min-h-[340px] min-w-0 flex-[1.7_1_380px] items-center justify-center px-[clamp(4px,3vw,40px)] py-[clamp(12px,3vw,40px)]">
        <AnimatePresence mode="wait" initial={false}>
          {view === "desktop" ? (
            <motion.div
              key="desktop"
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1, y: hover && !reduce ? -10 : 0 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="relative w-full max-w-[640px]"
            >
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
            </motion.div>
          ) : (
            <motion.div
              key="mobile"
              initial={reduce ? false : { opacity: 0, y: 24, rotate: 0 }}
              animate={{ opacity: 1, y: hover && !reduce ? -10 : 0, rotate: hover && !reduce ? -2 : 0 }}
              exit={reduce ? undefined : { opacity: 0, y: 24 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="w-[min(62vw,260px)] rounded-[34px] border border-white/[0.14] bg-[#1B1B1B] p-[7px] shadow-[0_30px_60px_rgba(0,0,0,.6)]"
            >
              <div className="relative aspect-[390/844] overflow-hidden rounded-[28px] bg-[#0D0D0D]">
                <Image
                  src={`/portfolio/${p.slug}-mobile.webp`}
                  alt={`Tienda ${p.name} en móvil`}
                  fill
                  sizes="260px"
                  className="object-cover object-top"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  )
}
