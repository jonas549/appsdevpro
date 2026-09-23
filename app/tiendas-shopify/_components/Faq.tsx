import Accent from "./Accent"
import { FAQS } from "../content"

export default function Faq({ list }: { list: React.ReactNode }) {
  return (
    <section id="faq" className="scroll-mt-24 border-t border-white/[0.06] px-[clamp(18px,4vw,56px)] py-[clamp(60px,8vw,120px)]">
      <div className="mx-auto flex max-w-[1240px] flex-wrap gap-[clamp(32px,5vw,80px)]">
        <h2 data-reveal className="m-0 flex-[1_1_280px] text-[clamp(36px,5vw,68px)] font-medium leading-[.98] tracking-[-0.05em] text-primary">
          Preguntas <Accent tone="muted">frecuentes</Accent>
        </h2>
        <div data-reveal className="min-w-0 flex-[1.6_1_440px]">{list}</div>
      </div>
    </section>
  )
}

/** Versión sin JS: todas las respuestas visibles. */
export function FaqStaticList() {
  return (
    <dl>
      {FAQS.map(f => (
        <div key={f.q} className="border-b border-white/10 py-[26px]">
          <dt className="mb-3 text-[clamp(18px,1.7vw,22px)] font-medium tracking-[-0.035em] text-primary">{f.q}</dt>
          <dd className="m-0 max-w-[62ch] text-base leading-[1.65] text-[#7B8DB0]">{f.a}</dd>
        </div>
      ))}
    </dl>
  )
}
