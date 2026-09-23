import Accent from "./Accent"
import { PROCESS_STEPS } from "../content"
import { BODY, H2 } from "./type"

export default function Process() {
  const last = PROCESS_STEPS.length - 1
  return (
    <section id="proceso" className="scroll-mt-24 px-[clamp(18px,4vw,56px)] py-[clamp(80px,10vw,140px)]">
      <div className="mx-auto max-w-[1240px]">
        <div data-reveal className="mb-[clamp(40px,5vw,64px)]">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-accent">Proceso</p>
          <h2 className={`${H2} m-0 max-w-[22ch] text-primary`}>
            Del primer mensaje a la tienda <Accent>vendiendo</Accent>
          </h2>
        </div>
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
          {PROCESS_STEPS.map((s, i) => (
            <li key={s.title} data-reveal className="rounded-2xl border border-white/[0.07] bg-[#0D1117] p-7">
              <div className="mb-8 flex items-center gap-2.5">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold text-white ${i === last ? "bg-[#008060]" : "bg-accent"}`}
                >
                  {i + 1}
                </span>
                <span className="text-[13px] font-medium text-[#64748B]">Paso {String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mb-2 text-xl font-bold leading-snug text-primary">{s.title}</h3>
              <p className={`${BODY} m-0 text-[15px] text-[#7B8DB0]`}>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
