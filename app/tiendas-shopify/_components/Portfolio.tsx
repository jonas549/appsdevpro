import Accent from "./Accent"
import ProjectCard from "./ProjectCard"
import { PROJECTS } from "../content"

export default function Portfolio({ cta }: { cta: React.ReactNode }) {
  return (
    <section id="portafolio" className="scroll-mt-24 px-[clamp(12px,3vw,40px)] pb-[clamp(80px,10vw,140px)] pt-[clamp(40px,6vw,80px)]">
      <div className="mx-auto max-w-[1320px]">
        <div data-reveal className="mb-[clamp(36px,4vw,56px)] flex flex-wrap items-end justify-between gap-6 px-[clamp(6px,1vw,16px)]">
          <h2 className="m-0 text-[clamp(56px,10vw,160px)] font-medium leading-[.85] tracking-[-0.065em] text-primary">
            Porta<Accent>folio</Accent>
          </h2>
          <div className="flex max-w-[320px] flex-col items-start gap-3.5">
            <p className="m-0 text-base leading-[1.55] text-[#7B8DB0]">
              Tiendas diseñadas y desarrolladas por nuestro equipo, ya vendiendo en Latinoamérica y España.
            </p>
            <div className="text-[13px] text-[#64748B]">{String(PROJECTS.length).padStart(2, "0")} proyectos · desplázate</div>
          </div>
        </div>

        <div className="flex flex-col gap-[clamp(20px,3vw,32px)]">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.slug} p={p} index={i} total={PROJECTS.length} />
          ))}
        </div>

        {cta}
      </div>
    </section>
  )
}

export function PortfolioCta() {
  return (
    <div data-reveal className="mt-[clamp(32px,4vw,48px)] flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-primary px-[clamp(22px,2.4vw,34px)] py-[clamp(22px,2.4vw,30px)] text-[#07090F]">
      <div className="text-[clamp(22px,2.4vw,32px)] font-medium leading-[1.05] tracking-[-0.045em]">
        ¿Quieres que la tuya sea <Accent tone="inherit">la próxima</Accent>?
      </div>
      <a
        href="#formulario"
        className="flex items-center gap-2.5 rounded-xl bg-[#07090F] px-6 py-4 text-base font-semibold tracking-[-0.02em] text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-white"
      >
        Quiero mi tienda <span aria-hidden="true">→</span>
      </a>
    </div>
  )
}
