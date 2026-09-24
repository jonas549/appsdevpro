import { Resend } from "resend"
import { PRODUCT_RANGES, hasStoreLabel, type LandingLead } from "@/lib/landing-leads"

// Emails del lead de la landing: aviso interno + respuesta automática al cliente.
// Mismo diseño oscuro que el aviso del formulario de la home (app/api/leads/route.ts).

const FROM = "Apps Developers Pro <noreply@appsdeveloperspro.com>"
const TEAM_INBOX = "contacto@appsdeveloperspro.com"
// Copia visible del aviso de lead nuevo: el buzón de contacto no avisa en el móvil.
const TEAM_CC = "jonasoko82@gmail.com"
const WA_LINK = "https://wa.link/phjdep"
const LANDING_URL = "https://appsdeveloperspro.com/tiendas-shopify"

// Zona horaria en la que se muestra la hora del lead en el aviso interno.
export const LEAD_TIMEZONE = "America/Caracas"

function esc(s: string | null | undefined): string {
  return (s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name
}

export function formatLeadDate(date: Date): string {
  const s = date.toLocaleString("es-MX", {
    timeZone: LEAD_TIMEZONE,
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  })
  return `${s.charAt(0).toUpperCase()}${s.slice(1)} (hora de Venezuela)`
}

const label = (t: string) =>
  `<p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#64748B">${t}</p>`

function row(cells: string[]): string {
  const w = Math.floor(100 / cells.length)
  return `<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:24px 0;border-bottom:1px solid #1E293B">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>${cells
      .map((c, i) => `<td width="${w}%" valign="top"${i < cells.length - 1 ? ' style="padding-right:20px"' : ""}>${c}</td>`)
      .join("")}</tr></table>
  </td></tr></table>`
}

function shell(kicker: string, body: string, footerLeft: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#07090F;font-family:'DM Sans',system-ui,-apple-system,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#07090F;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0D1117;border-radius:16px;overflow:hidden;border:1px solid #1E293B">
        <tr><td style="background:#4361EE;padding:28px 40px">
          <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.02em">Apps<span style="opacity:0.7">Developers</span>Pro</p>
          <p style="margin:6px 0 0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.65);text-transform:uppercase;letter-spacing:0.1em">${kicker}</p>
        </td></tr>
        <tr><td style="padding:32px 40px">${body}</td></tr>
        <tr><td style="background:#0A0F18;border-top:1px solid #1E293B;padding:18px 40px">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td><p style="margin:0;font-size:12px;color:#475569">${footerLeft}</p></td>
            <td align="right"><p style="margin:0;font-size:12px;color:#475569;font-weight:500">appsdeveloperspro.com</p></td>
          </tr></table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function buildLandingTeamEmail(lead: LandingLead, receivedAt: Date): string {
  const waNumber = lead.phone_code.replace("+", "") + lead.phone.replace(/\D/g, "")
  const products = lead.products ? PRODUCT_RANGES[lead.products] : "—"
  const store =
    lead.hasStore === "si" && lead.storeUrl
      ? `<p style="margin:0;font-size:14px;color:#EDF0FF">Sí</p><a href="${esc(lead.storeUrl)}" style="font-size:13px;color:#7B8DB0;text-decoration:none;word-break:break-all">${esc(lead.storeUrl)}</a>`
      : `<p style="margin:0;font-size:14px;color:#EDF0FF">${esc(hasStoreLabel(lead))}</p>`

  const body = `
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding-bottom:24px;border-bottom:1px solid #1E293B">
      <p style="margin:0 0 14px"><span style="display:inline-block;background:rgba(67,97,238,0.15);border:1px solid rgba(67,97,238,0.4);color:#AFC0FF;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:5px 10px;border-radius:999px">Origen: Landing Tiendas Shopify</span></p>
      ${label("Nombre")}
      <p style="margin:0;font-size:20px;font-weight:700;color:#EDF0FF">${esc(lead.name)}</p>
    </td></tr></table>
    ${row([
      `${label("Email")}<a href="mailto:${esc(lead.email)}" style="font-size:14px;font-weight:500;color:#7B8DB0;text-decoration:none">${esc(lead.email)}</a>`,
      `${label("WhatsApp")}<p style="margin:0;font-size:14px;color:#EDF0FF">${esc(lead.phone_code)} ${esc(lead.phone)}</p>`,
    ])}
    ${row([
      `${label("Productos")}<p style="margin:0;font-size:14px;color:#EDF0FF">${esc(products)}</p>`,
      `${label("¿Tiene tienda?")}${store}`,
    ])}
    ${row([`${label("Recibido")}<p style="margin:0;font-size:14px;color:#EDF0FF">${esc(formatLeadDate(receivedAt))}</p>`])}
    ${
      lead.idea
        ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px"><tr><td>
      ${label("Idea")}
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#141B25;border:1px solid #1E293B;border-radius:10px">
        <tr><td style="padding:16px 20px"><p style="margin:0;font-size:14px;line-height:1.75;color:#CBD5E1;white-space:pre-wrap">${esc(lead.idea)}</p></td></tr>
      </table>
    </td></tr></table>`
        : ""
    }
    <table cellpadding="0" cellspacing="0" style="margin-top:32px"><tr>
      <td style="padding-right:12px">
        <a href="https://wa.me/${waNumber}" style="display:inline-block;background:#25D366;color:#ffffff;font-size:13px;font-weight:700;padding:13px 22px;border-radius:10px;text-decoration:none">Escribir por WhatsApp</a>
      </td>
      <td>
        <a href="mailto:${esc(lead.email)}" style="display:inline-block;background:#4361EE;color:#ffffff;font-size:13px;font-weight:700;padding:13px 22px;border-radius:10px;text-decoration:none">Responder por email</a>
      </td>
    </tr></table>`

  return shell("Nuevo lead · Tiendas Shopify", body, "Formulario de /tiendas-shopify")
}

export function buildLandingAutoreplyEmail(lead: LandingLead): string {
  const summary: string[] = [`${esc(lead.phone_code)} ${esc(lead.phone)} (WhatsApp)`]
  if (lead.products) summary.push(`${esc(PRODUCT_RANGES[lead.products])} productos`)
  if (lead.hasStore === "si") summary.push(lead.storeUrl ? `Tienda actual: ${esc(lead.storeUrl)}` : "Ya tienes tienda")
  if (lead.hasStore === "no") summary.push("Todavía no tienes tienda")

  // Dos versiones según "¿Ya tienes tienda?". Si no respondió, la de "no":
  // habla de lo que nos contó sin dar por hecho que hay una tienda que revisar.
  const hasStore = lead.hasStore === "si"
  const intro = hasStore
    ? "Gracias por escribirnos. Ya estamos revisando tu tienda para proponerte un plan concreto."
    : "Gracias por escribirnos. Ya estamos viendo lo que nos contaste para proponerte un plan concreto."
  const [step1Title, step1Text] = hasStore
    ? ["Revisamos tu tienda", "Vemos tu catálogo, tu diseño actual y qué se puede mejorar."]
    : ["Revisamos tu proyecto", "Vemos qué vendes y qué necesita tu tienda para arrancar."]

  const step = (n: string, title: string, text: string) => `
    <tr><td style="padding:0 0 18px">
      <table cellpadding="0" cellspacing="0"><tr>
        <td valign="top" style="padding-right:14px"><div style="width:28px;height:28px;border-radius:50%;background:rgba(67,97,238,0.15);border:1px solid rgba(67,97,238,0.4);color:#AFC0FF;font-size:13px;font-weight:700;line-height:28px;text-align:center">${n}</div></td>
        <td valign="top"><p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#EDF0FF">${title}</p><p style="margin:0;font-size:14px;line-height:1.6;color:#94A3B8">${text}</p></td>
      </tr></table>
    </td></tr>`

  const body = `
    <p style="margin:0 0 10px;font-size:24px;font-weight:800;color:#EDF0FF;letter-spacing:-0.02em">Hola ${esc(firstName(lead.name))}, recibimos tu solicitud.</p>
    <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#94A3B8">${intro}</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;border-top:1px solid #1E293B;padding-top:24px">
      ${step("1", step1Title, step1Text)}
      ${step("2", "Te escribimos por WhatsApp", "Al número que nos dejaste, para conversar y resolver dudas.")}
      ${step("3", "Te proponemos alcance y plazo", "Con una fecha concreta de entrega, sin letra pequeña.")}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#141B25;border:1px solid #1E293B;border-radius:10px;margin-bottom:28px">
      <tr><td style="padding:16px 20px">
        ${label("Lo que nos enviaste")}
        <p style="margin:0;font-size:14px;line-height:1.8;color:#CBD5E1;word-break:break-word">${summary.join("<br>")}</p>
      </td></tr>
    </table>

    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#94A3B8">¿Prefieres no esperar? Escríbenos ahora y empezamos la conversación.</p>
    <a href="${WA_LINK}" style="display:inline-block;background:#25D366;color:#ffffff;font-size:14px;font-weight:700;padding:14px 24px;border-radius:10px;text-decoration:none">Escríbenos por WhatsApp</a>

    <p style="margin:28px 0 0;font-size:12px;line-height:1.6;color:#475569">Recibes este correo porque completaste el formulario en <a href="${LANDING_URL}" style="color:#7B8DB0">appsdeveloperspro.com/tiendas-shopify</a>. Si no fuiste tú, puedes ignorarlo. Si respondes a este correo, nos llega directamente.</p>`

  return shell("Solicitud recibida", body, "Apps Developers Pro")
}

/**
 * Envía el aviso interno y, si procede, la respuesta automática, en una sola
 * llamada a Resend. Nunca lanza: el lead ya está guardado y un fallo de email
 * sólo se registra.
 */
export async function sendLandingLeadEmails(
  lead: LandingLead,
  opts: { receivedAt: Date; autoreply: boolean },
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) { console.error("[resend] RESEND_API_KEY not set — skipping landing emails"); return }

  const emails: Parameters<Resend["batch"]["send"]>[0] = [
    {
      from: FROM,
      to: TEAM_INBOX,
      cc: TEAM_CC,
      replyTo: lead.email,
      subject: `Nuevo lead [Tiendas Shopify]: ${lead.name}`,
      html: buildLandingTeamEmail(lead, opts.receivedAt),
    },
  ]
  if (opts.autoreply) {
    emails.push({
      from: FROM,
      to: lead.email,
      replyTo: TEAM_INBOX,
      subject: "Recibimos tu solicitud — Apps Developers Pro",
      html: buildLandingAutoreplyEmail(lead),
    })
  }

  try {
    const result = await new Resend(apiKey).batch.send(emails)
    if (result.error) console.error("[resend] landing batch error:", JSON.stringify(result.error))
    else console.log("[resend] landing emails sent:", emails.length, "autoreply:", opts.autoreply)
  } catch (err) {
    console.error("[resend] landing batch exception:", err instanceof Error ? err.message : String(err))
  }
}
