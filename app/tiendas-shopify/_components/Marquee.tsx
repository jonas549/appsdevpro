import styles from "../landing.module.css"
import { MARQUEE_ITEMS } from "../content"

export default function Marquee() {
  // Dos copias seguidas: la animación desplaza -50% y el bucle no se nota.
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className={`${styles.marqueeMask} relative overflow-hidden border-y border-white/[0.06] py-[22px]`} aria-hidden="true">
      <div className={`${styles.marqueeTrack} gap-14 whitespace-nowrap text-lg tracking-[-0.02em] text-[#64748B]`}>
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-14">
            <span>{t}</span>
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
