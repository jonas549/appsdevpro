import styles from "../landing.module.css"
import { serif } from "../fonts"
import { HERO_STATS } from "../content"
import HeroVideo from "./HeroVideo"

// Cada palabra entra con su propio retraso. Animación CSS pura: arranca con el
// primer pintado, sin esperar a la hidratación (el H1 es el candidato a LCP).
const WORDS: { w: string; tone?: "accent" | "muted" }[] = [
  { w: "Tiendas" }, { w: "Shopify" }, { w: "que" },
  { w: "venden", tone: "accent" }, { w: "de verdad.", tone: "accent" },
  { w: "Hechas", tone: "muted" }, { w: "por", tone: "muted" }, { w: "quienes", tone: "muted" },
  { w: "construyen", tone: "muted" }, { w: "las", tone: "muted" }, { w: "apps.", tone: "muted" },
]

export default function Hero({ form }: { form: React.ReactNode }) {
  let rise = 0
  const riseDelay = () => ({ animationDelay: `${500 + rise++ * 120}ms` })

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden px-[clamp(18px,4vw,56px)] pb-[clamp(48px,6vw,80px)] pt-[clamp(110px,12vw,150px)]"
    >
      <img
        src="/landing/hero-poster.webp"
        alt=""
        aria-hidden="true"
        width={1280}
        height={716}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover opacity-[.42]"
      />
      <HeroVideo />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,15,.55)_0%,rgba(7,9,15,.35)_40%,#07090F_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,15,.85)_0%,rgba(7,9,15,.2)_70%)]" />

      <div className="relative mx-auto flex max-w-[1240px] flex-wrap items-center gap-[clamp(32px,4vw,64px)]">
        <div className="min-w-0 flex-[1.25_1_420px]">
          <div
            className={`${styles.rise} mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] py-1.5 pl-1.5 pr-3 text-[13px] text-[#A9B6D3]`}
            style={riseDelay()}
          >
            <span className="rounded-full bg-[#008060] px-2.5 py-[3px] text-xs font-medium text-white">Shopify</span>
            Creadores de DiscountFlow y Calendify Delivery
          </div>

          <h1 className="mb-6 text-balance text-[clamp(44px,6.4vw,92px)] font-medium leading-[.95] tracking-[-0.055em] text-primary">
            {WORDS.map(({ w, tone }, i) => (
              <span key={i}>
                <span
                  className={`${styles.word} ${
                    tone === "accent" ? `${serif.className} italic font-normal tracking-[-0.02em] text-accent`
                    : tone === "muted" ? "text-[#6B7A99]" : ""
                  }`}
                  style={{ animationDelay: `${120 + i * 55}ms` }}
                >
                  {w}
                </span>{" "}
              </span>
            ))}
          </h1>

          <p
            className={`${styles.rise} mb-10 max-w-[48ch] text-pretty text-[clamp(17px,1.4vw,19px)] leading-[1.55] text-[#A9B6D3]`}
            style={riseDelay()}
          >
            Diseñamos y lanzamos tu tienda. Cuando necesitas algo que Shopify no trae de fábrica, lo programamos nosotros.
          </p>

          {HERO_STATS.length > 0 && (
            <div className={`${styles.rise} flex max-w-[560px] flex-wrap border-t border-white/10`} style={riseDelay()}>
              {HERO_STATS.map(s => (
                <div key={s.label} className="flex-[1_1_140px] pr-5 pt-[18px]">
                  <div className="text-[28px] font-medium tracking-[-0.04em] text-primary">{s.value}</div>
                  <div className="mt-0.5 text-[13px] text-[#7B8DB0]">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div id="formulario" className={`${styles.rise} min-w-0 max-w-[460px] flex-[1_1_360px] scroll-mt-24`} style={{ animationDelay: "620ms" }}>
          {form}
        </div>
      </div>
    </section>
  )
}
