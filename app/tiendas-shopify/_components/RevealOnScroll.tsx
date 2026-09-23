'use client'

import { useEffect } from "react"

// Aparición al entrar en pantalla para los elementos con [data-reveal].
// Sólo oculta lo que está por debajo del primer pantallazo y sólo después de
// hidratar: el HTML del servidor sale visible (SEO, sin JS, y sin penalizar el LCP).
export default function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!("IntersectionObserver" in window)) return

    const vh = window.innerHeight
    const pending = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))
      .filter(el => el.getBoundingClientRect().top > vh * 0.92)
    pending.forEach(el => { el.style.opacity = "0" })

    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const el = e.target as HTMLElement
        el.style.opacity = ""
        el.animate(
          [{ opacity: 0, filter: "blur(8px)", transform: "translateY(36px)" }, { opacity: 1, filter: "blur(0)", transform: "none" }],
          { duration: 1000, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" },
        )
        io.unobserve(el)
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 })
    pending.forEach(el => io.observe(el))

    return () => {
      io.disconnect()
      pending.forEach(el => { el.style.opacity = "" })
    }
  }, [])

  return null
}
