import Accent from "./Accent"
import FaqAccordion from "./FaqAccordion"

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 border-t border-white/[0.06] px-[clamp(18px,4vw,56px)] py-[clamp(60px,8vw,120px)]">
      <div className="mx-auto flex max-w-[1240px] flex-wrap gap-[clamp(32px,5vw,80px)]">
        <h2 data-reveal className="m-0 flex-[1_1_280px] text-[clamp(36px,5vw,68px)] font-medium leading-[.98] tracking-[-0.05em] text-primary">
          Preguntas <Accent tone="muted">frecuentes</Accent>
        </h2>
        <div data-reveal className="min-w-0 flex-[1.6_1_440px]"><FaqAccordion /></div>
      </div>
    </section>
  )
}
