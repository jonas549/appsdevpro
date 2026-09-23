import Accent from "./Accent"
import ProjectCard from "./ProjectCard"
import StackedCards from "./StackedCards"
import { PROJECTS } from "../content"
import { BODY, H2, LIGHT_BG, LIGHT_TEXT, LIGHT_TITLE } from "./type"

// Sección clara (como Apps/Proceso en la home) con las tarjetas oscuras encima.
export default function Portfolio({ cta }: { cta: React.ReactNode }) {
  return (
    <section id="portafolio" className={`${LIGHT_BG} scroll-mt-24 px-[clamp(12px,3vw,40px)] py-[clamp(80px,10vw,140px)]`}>
      <div className="mx-auto max-w-[1320px]">
        <div data-reveal className="mb-[clamp(36px,4vw,56px)] flex flex-wrap items-end justify-between gap-6 px-[clamp(6px,1vw,16px)]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-accent">Portafolio</p>
            <h2 className={`${H2} m-0 max-w-[18ch] ${LIGHT_TITLE}`}>
              Tiendas que ya están <Accent>vendiendo</Accent>
            </h2>
          </div>
          <div className="flex max-w-[340px] flex-col items-start gap-2">
            <p className={`${BODY} m-0 ${LIGHT_TEXT}`}>
              Diseñadas y desarrolladas por nuestro equipo para marcas de Latinoamérica y España.
            </p>
            <div className="text-[13px] text-[#9CA3AF]">{String(PROJECTS.length).padStart(2, "0")} proyectos · desplázate</div>
          </div>
        </div>

        <StackedCards>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.slug} p={p} index={i} total={PROJECTS.length} />
          ))}
        </StackedCards>

        {cta}
      </div>
    </section>
  )
}

export function PortfolioCta() {
  return (
    <div data-reveal className="mt-[clamp(32px,4vw,48px)] flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-accent px-[clamp(22px,2.4vw,34px)] py-[clamp(22px,2.4vw,30px)] text-white">
      <div className="text-[clamp(1.25rem,2.2vw,1.75rem)] font-bold leading-tight tracking-[-0.025em]">
        ¿Quieres que la tuya sea la próxima?
      </div>
      <a
        href="#formulario"
        className="flex items-center gap-2.5 rounded-xl bg-white px-6 py-4 text-base font-semibold text-[#07090F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#EDF0FF]"
      >
        Quiero mi tienda <span aria-hidden="true">→</span>
      </a>
    </div>
  )
}
