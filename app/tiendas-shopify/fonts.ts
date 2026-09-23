import { Instrument_Serif } from "next/font/google"

// Serif sólo para las palabras de acento de la landing. Se carga únicamente en
// esta ruta. Como className (no variable) para ganar al `* { font-family }`
// de globals.css, que aplica DM Sans a cada elemento.
export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
  display: "swap",
})
