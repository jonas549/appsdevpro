'use client'

import { Children, useEffect, useRef } from "react"

const STICK_TOP = 84
const STEP = 14

// Tarjetas apiladas: cada una se queda fija arriba y, cuando la siguiente la
// tapa, se encoge y oscurece. Sólo en escritorio y sin reduced-motion; en
// móvil una tarjeta puede ser más alta que la pantalla y el sticky la cortaría.
export default function StackedCards({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const mq = window.matchMedia("(min-width: 860px) and (prefers-reduced-motion: no-preference)")
    let raf = 0

    const update = () => {
      raf = 0
      const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-stack]"))
      const h = window.innerHeight
      cards.forEach((card, i) => {
        const inner = card.firstElementChild as HTMLElement | null
        if (!inner) return
        const next = cards[i + 1]
        let p = 0
        if (next && mq.matches) {
          const top = next.getBoundingClientRect().top
          const stickTop = STICK_TOP + (i + 1) * STEP
          p = Math.min(1, Math.max(0, (h - top) / (h - stickTop)))
        }
        inner.style.transform = p ? `scale(${(1 - p * 0.06).toFixed(4)})` : ""
        inner.style.filter = p ? `brightness(${(1 - p * 0.45).toFixed(3)})` : ""
      })
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update) }

    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    mq.addEventListener("change", schedule)
    update()
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      mq.removeEventListener("change", schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} className="flex flex-col gap-[clamp(20px,3vw,32px)]">
      {Children.toArray(children).map((child, i) => (
        <div key={i} data-stack className="min-[860px]:sticky" style={{ top: STICK_TOP + i * STEP }}>
          <div className="origin-top will-change-transform">{child}</div>
        </div>
      ))}
    </div>
  )
}
