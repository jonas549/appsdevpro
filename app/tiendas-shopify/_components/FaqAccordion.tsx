'use client'

import { useId, useState } from "react"
import { FAQS } from "../content"

// Las respuestas están siempre en el DOM (plegadas con grid-rows), así que se
// indexan igual aunque estén cerradas.
export default function FaqAccordion() {
  const [open, setOpen] = useState(0)
  const uid = useId()

  return (
    <div>
      {FAQS.map((f, i) => {
        const on = open === i
        const panelId = `${uid}-p${i}`
        return (
          <div key={f.q} className="border-b border-white/10">
            <h3 className="m-0">
              <button
                type="button"
                aria-expanded={on}
                aria-controls={panelId}
                onClick={() => setOpen(on ? -1 : i)}
                className="flex w-full items-center justify-between gap-5 py-[26px] text-left text-[clamp(18px,1.7vw,22px)] font-medium tracking-[-0.035em] text-primary transition-colors duration-200 hover:text-accent"
              >
                {f.q}
                <span
                  className={`grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full transition-[transform,background-color,color] duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
                    on ? "rotate-45 bg-accent text-white" : "bg-white/[0.06] text-primary"
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M7 1v12M1 7h12" /></svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="m-0 max-w-[62ch] pb-[26px] text-base leading-[1.65] text-[#7B8DB0]">{f.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
