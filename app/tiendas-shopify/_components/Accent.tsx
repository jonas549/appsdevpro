const TONES = {
  accent: "text-accent",
  muted: "text-[#7B8DB0]",
  inherit: "",
}

/** Palabras resaltadas en color, como en el hero de la home: misma fuente y peso. */
export default function Accent({ children, tone = "accent" }: { children: React.ReactNode; tone?: keyof typeof TONES }) {
  return <span className={TONES[tone]}>{children}</span>
}
