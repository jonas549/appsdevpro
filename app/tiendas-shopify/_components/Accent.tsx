import { serif } from "../fonts"

const TONES = {
  accent: "text-accent",
  muted: "text-[#7B8DB0]",
  inherit: "",
}

/** Palabras en serif itálica: el acento tipográfico de la landing. */
export default function Accent({ children, tone = "accent" }: { children: React.ReactNode; tone?: keyof typeof TONES }) {
  return (
    <span className={`${serif.className} italic font-normal tracking-[-0.02em] ${TONES[tone]}`}>
      {children}
    </span>
  )
}
