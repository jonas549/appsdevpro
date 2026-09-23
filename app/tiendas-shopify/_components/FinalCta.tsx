import Link from "next/link"
import styles from "../landing.module.css"
import Accent from "./Accent"
import { WhatsAppIcon } from "./icons"
import { WA_LINK } from "../content"

export default function FinalCta({ form }: { form: React.ReactNode }) {
  return (
    <footer
      id="contacto"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[radial-gradient(80%_60%_at_20%_30%,rgba(67,97,238,.16)_0%,transparent_70%),#07090F] px-[clamp(18px,4vw,56px)] pt-[clamp(80px,10vw,140px)]"
    >
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-[clamp(40px,5vw,80px)]">
        <div data-reveal className="min-w-0 flex-[1.2_1_400px]">
          <h2 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight text-primary md:text-5xl">
            Tu tienda puede estar <Accent>vendiendo</Accent> este mes.
          </h2>
          <p className="mb-8 max-w-[42ch] text-base leading-[1.7] text-white/70 md:text-lg">
            Déjanos tus datos y te escribimos con un plan concreto para tu marca. Si prefieres, hablemos directo.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-3 rounded-xl border border-white/[0.16] px-[22px] py-4 text-base font-semibold tracking-[-0.02em] text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-[#25D366] hover:bg-[#25D366]/[0.08]"
          >
            <WhatsAppIcon className="h-5 w-5 fill-[#25D366]" />
            Hablar por WhatsApp
          </a>
        </div>
        <div data-reveal className="min-w-0 max-w-[460px] flex-[1_1_360px]">{form}</div>
      </div>

      <div className="mx-auto mt-[clamp(64px,8vw,110px)] flex max-w-[1240px] flex-wrap justify-between gap-3 border-t border-white/[0.08] py-5 text-[13px] text-[#64748B]">
        <span>© {new Date().getFullYear()} Apps Developers Pro · <Link href="/" className="text-[#64748B] hover:text-primary">appsdeveloperspro.com</Link></span>
        <a href="mailto:contacto@appsdeveloperspro.com" className="text-[#64748B] hover:text-primary">contacto@appsdeveloperspro.com</a>
      </div>
      <div aria-hidden="true" className={`${styles.outline} -mb-[.12em] select-none whitespace-nowrap text-center text-[clamp(56px,14.5vw,230px)] font-semibold leading-[.8] tracking-[-0.07em]`}>
        AppsDevPro
      </div>
    </footer>
  )
}
