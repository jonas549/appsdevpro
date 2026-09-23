import Accent from "./Accent"
import FaqAccordion from "./FaqAccordion"
import { H2, LIGHT_BG, LIGHT_TITLE } from "./type"

// Sección clara para romper la secuencia de fondos oscuros.
export default function Faq() {
  return (
    <section id="faq" className={`${LIGHT_BG} scroll-mt-24 px-[clamp(18px,4vw,56px)] py-[clamp(80px,10vw,140px)]`}>
      <div className="mx-auto flex max-w-[1240px] flex-wrap gap-[clamp(32px,5vw,80px)]">
        <div data-reveal className="flex-[1_1_280px]">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-accent">FAQ</p>
          <h2 className={`${H2} m-0 ${LIGHT_TITLE}`}>
            Preguntas <Accent>frecuentes</Accent>
          </h2>
        </div>
        <div data-reveal className="min-w-0 flex-[1.6_1_440px]"><FaqAccordion /></div>
      </div>
    </section>
  )
}
