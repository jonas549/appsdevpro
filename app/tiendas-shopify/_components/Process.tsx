import Accent from "./Accent"
import { PROCESS_STEPS } from "../content"

export default function Process() {
  const last = PROCESS_STEPS.length - 1
  return (
    <section id="proceso" className="scroll-mt-24 border-t border-white/[0.06] px-[clamp(18px,4vw,56px)] py-[clamp(80px,10vw,140px)]">
      <div className="mx-auto max-w-[1240px]">
        <h2 data-reveal className="mb-[clamp(40px,5vw,72px)] max-w-[18ch] text-[clamp(36px,5vw,68px)] font-medium leading-[.98] tracking-[-0.05em] text-primary">
          Del primer mensaje a la tienda <Accent>vendiendo.</Accent>
        </h2>
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] border-t border-white/10">
          {PROCESS_STEPS.map((s, i) => (
            <li key={s.title} data-reveal className="border-white/[0.06] py-7 pr-6 max-[999px]:[&:not(:last-child)]:border-b min-[1000px]:[&:not(:first-child)]:pl-6 min-[1000px]:[&:not(:last-child)]:border-r">
              <div className="mb-10 flex items-center gap-2.5">
                <span
                  className={`h-[9px] w-[9px] rounded-full ${
                    i === 0 ? "bg-accent" : i === last ? "bg-[#008060]" : "border-[1.5px] border-accent"
                  }`}
                />
                <span className="text-[13px] text-[#64748B]">Paso {String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mb-2.5 text-2xl font-medium tracking-[-0.04em] text-primary">{s.title}</h3>
              <p className="m-0 text-[15px] leading-relaxed text-[#7B8DB0]">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
