import Accent from "./Accent"
import { INCLUDES } from "../content"

export default function Includes() {
  return (
    <section className="bg-primary px-[clamp(18px,4vw,56px)] py-[clamp(80px,10vw,140px)] text-[#07090F]">
      <div className="mx-auto max-w-[1240px]">
        <div data-reveal className="mb-[clamp(36px,4vw,56px)] flex flex-wrap items-end justify-between gap-6">
          <h2 className="m-0 max-w-[14ch] text-[clamp(36px,5vw,68px)] font-medium leading-[.98] tracking-[-0.05em]">
            Todo listo para <Accent tone="inherit">vender.</Accent>
          </h2>
          <p className="m-0 max-w-[34ch] text-base leading-relaxed text-[#475569]">
            Entregamos la tienda funcionando, sin tareas pendientes de tu lado.
          </p>
        </div>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
          {INCLUDES.map(it => (
            <li
              key={it.t}
              data-reveal
              className={`flex min-h-[180px] flex-col justify-between gap-9 rounded-[22px] p-6 ${
                it.hot ? "bg-[#07090F] text-primary sm:col-span-2" : "border border-[#07090F]/[0.07] bg-white"
              }`}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={it.hot ? "text-accent" : ""}>
                <path d={it.d} />
              </svg>
              <div>
                <div className="mb-1 text-[19px] font-medium tracking-[-0.035em]">{it.t}</div>
                <div className="text-sm leading-normal opacity-65">{it.s}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
