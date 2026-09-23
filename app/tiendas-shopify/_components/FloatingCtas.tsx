import { WhatsAppIcon } from "./icons"
import { WA_LINK } from "../content"

// Botón fijo de WhatsApp + barra inferior en móvil. Todo por CSS (breakpoint
// 860px, el del diseño), sin detectar el ancho en JS.
export default function FloatingCtas() {
  return (
    <>
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener"
        aria-label="Escríbenos por WhatsApp"
        className="fixed bottom-[90px] right-[18px] z-[66] grid h-14 w-14 place-items-center rounded-full bg-[#25D366] shadow-[0_12px_30px_rgba(37,211,102,.4)] transition-transform duration-200 hover:scale-[1.08] min-[860px]:bottom-6"
      >
        <WhatsAppIcon className="h-7 w-7 fill-white" />
      </a>
      <div className="fixed inset-x-0 bottom-0 z-[65] border-t border-white/[0.08] bg-[#07090F]/85 px-3.5 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-lg min-[860px]:hidden">
        <a
          href="#formulario"
          className="block w-full rounded-xl bg-accent p-4 text-center text-[17px] font-semibold tracking-[-0.02em] text-white"
        >
          Quiero mi tienda
        </a>
      </div>
    </>
  )
}
