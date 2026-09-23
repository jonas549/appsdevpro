'use client'

import { useId, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { trackEvent } from "@/app/lib/pixel"
import { WhatsAppIcon } from "./icons"
import { WA_LINK } from "../content"

const COUNTRY_CODES = [
  ["+52", "🇲🇽 +52"], ["+34", "🇪🇸 +34"], ["+57", "🇨🇴 +57"], ["+54", "🇦🇷 +54"], ["+56", "🇨🇱 +56"],
  ["+51", "🇵🇪 +51"], ["+593", "🇪🇨 +593"], ["+58", "🇻🇪 +58"], ["+591", "🇧🇴 +591"], ["+595", "🇵🇾 +595"],
  ["+598", "🇺🇾 +598"], ["+502", "🇬🇹 +502"], ["+503", "🇸🇻 +503"], ["+504", "🇭🇳 +504"], ["+505", "🇳🇮 +505"],
  ["+506", "🇨🇷 +506"], ["+507", "🇵🇦 +507"], ["+1809", "🇩🇴 +1"], ["+1", "🇺🇸 +1"],
]

const PRODUCT_OPTIONS = [
  ["menos-50", "Menos de 50"], ["50-500", "50 a 500"], ["500-2000", "500 a 2.000"], ["mas-2000", "Más de 2.000"],
]

type Field = "name" | "phone" | "email" | "storeUrl" | "products" | "phone_code" | "hasStore"

const input =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[15px] text-primary placeholder:text-[#64748B] transition-[border-color,box-shadow] focus:border-accent/70 focus:outline-none focus:ring-4 focus:ring-accent/15"
const invalid = "border-[#F87171]/70"

export default function LeadForm({ heading }: { heading: string }) {
  const uid = useId()
  const [f, setF] = useState({ name: "", phone_code: "+52", phone: "", email: "", products: "", hasStore: "", storeUrl: "", idea: "", website: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState<{ msg: string; field?: Field } | null>(null)

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setF(prev => ({ ...prev, [k]: e.target.value }))
    if (error?.field === k) setError(null)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (status === "sending") return
    setError(null)
    setStatus("sending")
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "tiendas-shopify", ...f }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string; field?: Field }
        setError({ msg: data.error || "No pudimos enviar tu solicitud. Intenta de nuevo.", field: data.field })
        setStatus("idle")
        return
      }
      window.gtag?.("event", "generate_lead", { currency: "USD", value: 1, lead_source: "tiendas-shopify" })
      trackEvent("Lead", { content_name: "tiendas-shopify" })
      setStatus("sent")
    } catch {
      setError({ msg: "Error de conexión. Intenta de nuevo." })
      setStatus("idle")
    }
  }

  const firstName = f.name.trim().split(/\s+/)[0] || "gracias"
  const seg = (active: boolean) =>
    `rounded-[7px] px-4 py-2 text-sm font-medium transition-colors duration-200 ${active ? "bg-primary text-[#07090F]" : "text-[#7B8DB0] hover:text-primary"}`
  const errFor = (k: Field) => (error?.field === k ? invalid : "")

  return (
    <div className="relative rounded-3xl border border-white/10 bg-[#0D1117]/[0.86] p-[clamp(22px,2.4vw,30px)] text-primary shadow-[0_40px_100px_rgba(0,0,0,.55),inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-xl">
      <AnimatePresence mode="wait" initial={false}>
        {status !== "sent" ? (
          <motion.form
            key="form"
            onSubmit={submit}
            noValidate
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-3.5 flex items-center gap-2 text-xs text-[#7B8DB0]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3BD18A] shadow-[0_0_0_4px_rgba(59,209,138,.15)]" />
              Te respondemos por WhatsApp
            </div>
            <div className="mb-[22px] text-[clamp(22px,2vw,26px)] font-semibold leading-[1.1] tracking-[-0.035em]">{heading}</div>

            <div className="grid gap-3">
              <input aria-label="Nombre" autoComplete="name" required value={f.name} onChange={set("name")} placeholder="Nombre" className={`${input} ${errFor("name")}`} />
              <div className="flex gap-2">
                <select aria-label="Prefijo del país" value={f.phone_code} onChange={set("phone_code")} className={`${input} w-[118px] shrink-0 bg-[#111722] px-2.5`}>
                  {COUNTRY_CODES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <input aria-label="WhatsApp" type="tel" inputMode="tel" autoComplete="tel-national" required value={f.phone} onChange={set("phone")} placeholder="WhatsApp" className={`${input} min-w-0 flex-1 ${errFor("phone")}`} />
              </div>
              <input aria-label="Correo" type="email" inputMode="email" autoComplete="email" required value={f.email} onChange={set("email")} placeholder="Correo" className={`${input} ${errFor("email")}`} />
              <select aria-label="Cantidad aproximada de productos" value={f.products} onChange={set("products")} className={`${input} bg-[#111722] ${f.products ? "" : "text-[#7B8DB0]"}`}>
                <option value="">Cantidad aproximada de productos</option>
                {PRODUCT_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>

              <div role="radiogroup" aria-labelledby={`${uid}-store`} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] py-1.5 pl-4 pr-1.5">
                <span id={`${uid}-store`} className="text-[15px] text-[#A9B6D3]">¿Ya tienes tienda?</span>
                <div className="flex gap-1 rounded-[9px] bg-black/35 p-[3px]">
                  {([["si", "Sí"], ["no", "No"]] as const).map(([v, l]) => (
                    <button key={v} type="button" role="radio" aria-checked={f.hasStore === v} onClick={() => setF(p => ({ ...p, hasStore: v }))} className={seg(f.hasStore === v)}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence initial={false}>
                {f.hasStore && (
                  <motion.div
                    key={f.hasStore}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    {f.hasStore === "si" ? (
                      <input aria-label="Enlace de tu tienda" type="url" inputMode="url" value={f.storeUrl} onChange={set("storeUrl")} placeholder="Enlace de tu tienda" className={`${input} border-accent/40 bg-accent/[0.06] ${errFor("storeUrl")}`} />
                    ) : (
                      <textarea aria-label="Cuéntanos tu idea" rows={2} value={f.idea} onChange={set("idea")} placeholder="Cuéntanos tu idea" className={`${input} resize-y border-accent/40 bg-accent/[0.06]`} />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Honeypot: invisible para personas, los bots lo rellenan. */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={set("website")} className="absolute -left-[9999px] h-px w-px opacity-0" />

              {error && (
                <p role="alert" className="m-0 rounded-lg border border-[#F87171]/30 bg-[#F87171]/10 px-3.5 py-2.5 text-sm text-[#FCA5A5]">{error.msg}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-1 flex w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-5 py-[17px] text-[17px] font-semibold tracking-[-0.02em] text-white shadow-[0_8px_24px_rgba(67,97,238,.35),inset_0_1px_0_rgba(255,255,255,.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5470F0] hover:shadow-[0_16px_40px_rgba(67,97,238,.45)] active:scale-[.98] disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {status === "sending" ? "Enviando…" : "Quiero mi tienda"}
                {status !== "sending" && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                )}
              </button>
              <div className="text-center text-xs text-[#64748B]">Solo usamos tus datos para contactarte por tu proyecto.</div>
            </div>
          </motion.form>
        ) : (
          <motion.div key="sent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} role="status">
            <div className="mb-[18px] flex items-center gap-2 text-xs text-[#3BD18A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3BD18A] shadow-[0_0_0_4px_rgba(59,209,138,.18)]" />
              Solicitud recibida · {firstName}
            </div>
            <div className="mb-3 text-[clamp(26px,2.6vw,32px)] font-semibold leading-[1.05] tracking-[-0.04em]">Ya estamos revisando tu proyecto.</div>
            <p className="mb-6 text-[15px] leading-relaxed text-[#94A3B8]">
              Te enviamos un correo de confirmación. Si quieres, escríbenos ahora por WhatsApp y empezamos la conversación en minutos.
            </p>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-5 py-[17px] text-base font-semibold tracking-[-0.02em] text-[#07090F] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="h-5 w-5 fill-current" />
              Escríbenos por WhatsApp ahora
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
