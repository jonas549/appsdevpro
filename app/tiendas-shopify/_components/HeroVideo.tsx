'use client'

import { useEffect, useRef, useState } from "react"

// El vídeo del hero es decorativo (va al 42 % de opacidad bajo dos degradados),
// así que nunca compite con el contenido: se monta cuando la página ya cargó,
// sólo en escritorio, y nunca con reduced-motion o ahorro de datos. Hasta
// entonces se ve el poster, que llega en el HTML.
export default function HeroVideo() {
  const [mount, setMount] = useState(false)
  const [playing, setPlaying] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
    const ok =
      window.matchMedia("(min-width: 860px) and (prefers-reduced-motion: no-preference)").matches &&
      !nav.connection?.saveData
    if (!ok) return
    const start = () => setMount(true)
    if (document.readyState === "complete") start()
    else window.addEventListener("load", start, { once: true })
    return () => window.removeEventListener("load", start)
  }, [])

  useEffect(() => {
    if (mount) ref.current?.play().catch(() => {})
  }, [mount])

  if (!mount) return null
  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden="true"
      onPlaying={() => setPlaying(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing ? "opacity-[.42]" : "opacity-0"}`}
    >
      <source src="/landing/hero.webm" type="video/webm" />
      <source src="/landing/hero.mp4" type="video/mp4" />
    </video>
  )
}
