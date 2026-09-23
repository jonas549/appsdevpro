import Link from "next/link"
import { NAV_LINKS } from "../content"

// Nav propia de la landing: sus enlaces son anclas de esta página, no de la
// home (la Navbar del sitio hace router.push('/#...')). Sin JS: el scroll suave
// lo da `scroll-behavior: smooth` de globals.css y el desfase, `scroll-mt-*`.
export default function LandingNav() {
  return (
    <nav
      aria-label="Secciones"
      className="fixed left-1/2 top-3.5 z-[70] flex w-[min(1100px,calc(100%-24px))] -translate-x-1/2 items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#07090F]/70 py-2 pl-4 pr-2 backdrop-blur-xl"
    >
      <Link href="/" aria-label="Apps Developers Pro — inicio" className="flex shrink-0 items-center">
        <img src="/logo-header.png" alt="Apps Developers Pro" width={1308} height={191} className="h-6 w-auto sm:h-7" />
      </Link>
      <div className="hidden gap-0.5 min-[860px]:flex">
        {NAV_LINKS.map(l => (
          <a
            key={l.id}
            href={`#${l.id}`}
            className="rounded-[10px] px-3.5 py-2 text-sm text-[#7B8DB0] transition-colors duration-200 hover:bg-white/[0.06] hover:text-primary"
          >
            {l.label}
          </a>
        ))}
      </div>
      <a
        href="#formulario"
        className="shrink-0 rounded-[10px] bg-primary px-[18px] py-[11px] text-sm font-semibold tracking-[-0.02em] text-[#07090F] transition-all duration-200 hover:-translate-y-px hover:bg-accent hover:text-white"
      >
        Quiero mi tienda
      </a>
    </nav>
  )
}
