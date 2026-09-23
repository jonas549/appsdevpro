import Accent from "./Accent"
import { INCLUDES } from "../content"
import { BODY, H2, LIGHT_BG, LIGHT_TEXT, LIGHT_TITLE } from "./type"

// Sección clara, como Apps/Proceso en la home.
export default function Includes() {
  return (
    <section className={`${LIGHT_BG} px-[clamp(18px,4vw,56px)] py-[clamp(80px,10vw,140px)]`}>
      <div className="mx-auto max-w-[1240px]">
        <div data-reveal className="mb-[clamp(36px,4vw,56px)] flex flex-wrap items-end justify-between gap-6">
          <h2 className={`${H2} m-0 max-w-[16ch] ${LIGHT_TITLE}`}>
            Todo listo para <Accent>vender</Accent>
          </h2>
          <p className={`${BODY} m-0 max-w-[36ch] ${LIGHT_TEXT}`}>
            Entregamos la tienda funcionando, sin tareas pendientes de tu lado.
          </p>
        </div>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
          {INCLUDES.map(it => (
            <li
              key={it.t}
              data-reveal
              className={`flex min-h-[180px] flex-col justify-between gap-9 rounded-[22px] p-6 ${
                it.hot ? "bg-accent text-white sm:col-span-2" : `border border-[#E5E7EB] bg-white ${LIGHT_TITLE}`
              }`}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={it.hot ? "" : "text-accent"}>
                <path d={it.d} />
              </svg>
              <div>
                <div className="mb-1 text-lg font-semibold leading-snug">{it.t}</div>
                <div className={`text-sm leading-normal ${it.hot ? "text-white/80" : LIGHT_TEXT}`}>{it.s}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
