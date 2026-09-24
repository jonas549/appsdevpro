'use client'

import { ADS_WHATSAPP_SEND_TO, ADS_WHATSAPP_VALUE, trackAdsConversion } from "@/app/lib/consent"
import { WA_LINK } from "../content"

// Enlace a WhatsApp que cuenta como conversión de Google Ads. Se abre en otra
// pestaña, así que la página sigue viva y el evento sale sin prisas.
export default function WhatsAppLink(props: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel">) {
  return (
    <a
      {...props}
      href={WA_LINK}
      target="_blank"
      rel="noopener"
      onClick={e => {
        window.gtag?.("event", "contact", { method: "whatsapp", lead_source: "tiendas-shopify" })
        trackAdsConversion(ADS_WHATSAPP_SEND_TO, ADS_WHATSAPP_VALUE)
        props.onClick?.(e)
      }}
    />
  )
}
