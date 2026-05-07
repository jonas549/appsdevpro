import type { VercelRequest, VercelResponse } from "@vercel/node"
import { Resend } from "resend"
import { prisma } from "./_lib/prisma.js"
import { setCors, requireAuth } from "./_lib/auth.js"

function buildEmailHtml(data: {
  name: string; email: string; phone_code: string; phone: string
  company: string | null; budget: string | null; message: string
}) {
  const waNumber = data.phone_code.replace('+', '') + data.phone.replace(/\D/g, '')
  const dateStr = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#07090F;font-family:'DM Sans',system-ui,-apple-system,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#07090F;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0D1117;border-radius:16px;overflow:hidden;border:1px solid #1E293B">

        <!-- Header -->
        <tr><td style="background:#4361EE;padding:28px 40px">
          <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.02em">Apps<span style="opacity:0.7">Developers</span>Pro</p>
          <p style="margin:6px 0 0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.65);text-transform:uppercase;letter-spacing:0.1em">Nuevo lead recibido</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 40px">

          <!-- Nombre -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:0">
            <tr><td style="padding-bottom:24px;border-bottom:1px solid #1E293B">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#64748B">Nombre</p>
              <p style="margin:0;font-size:20px;font-weight:700;color:#EDF0FF">${esc(data.name)}</p>
            </td></tr>
          </table>

          <!-- Email + Teléfono -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:0">
            <tr><td style="padding:24px 0;border-bottom:1px solid #1E293B">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td width="50%" style="padding-right:20px">
                  <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#64748B">Email</p>
                  <a href="mailto:${esc(data.email)}" style="font-size:14px;font-weight:500;color:#7B8DB0;text-decoration:none">${esc(data.email)}</a>
                </td>
                <td width="50%">
                  <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#64748B">Teléfono</p>
                  <p style="margin:0;font-size:14px;color:#EDF0FF">${esc(data.phone_code)} ${esc(data.phone)}</p>
                </td>
              </tr></table>
            </td></tr>
          </table>

          <!-- Empresa + Presupuesto -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:0">
            <tr><td style="padding:24px 0;border-bottom:1px solid #1E293B">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td width="50%" style="padding-right:20px">
                  <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#64748B">Empresa</p>
                  <p style="margin:0;font-size:14px;color:#EDF0FF">${data.company ? esc(data.company) : '—'}</p>
                </td>
                <td width="50%">
                  <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#64748B">Presupuesto</p>
                  <p style="margin:0;font-size:14px;color:#EDF0FF">${data.budget ? esc(data.budget) : '—'}</p>
                </td>
              </tr></table>
            </td></tr>
          </table>

          <!-- Mensaje -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;margin-bottom:32px">
            <tr><td>
              <p style="margin:0 0 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#64748B">Mensaje</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#141B25;border:1px solid #1E293B;border-radius:10px">
                <tr><td style="padding:16px 20px">
                  <p style="margin:0;font-size:14px;line-height:1.75;color:#CBD5E1;white-space:pre-wrap">${esc(data.message)}</p>
                </td></tr>
              </table>
            </td></tr>
          </table>

          <!-- Action buttons -->
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:12px">
              <a href="mailto:${esc(data.email)}" style="display:inline-block;background:#4361EE;color:#ffffff;font-size:13px;font-weight:700;padding:13px 22px;border-radius:10px;text-decoration:none;letter-spacing:0.01em">Responder por email</a>
            </td>
            <td>
              <a href="https://wa.me/${waNumber}" style="display:inline-block;background:#25D366;color:#ffffff;font-size:13px;font-weight:700;padding:13px 22px;border-radius:10px;text-decoration:none;letter-spacing:0.01em">Escribir por WhatsApp</a>
            </td>
          </tr></table>

        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#0A0F18;border-top:1px solid #1E293B;padding:18px 40px">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td><p style="margin:0;font-size:12px;color:#475569;text-transform:capitalize">${dateStr}</p></td>
            <td align="right"><p style="margin:0;font-size:12px;color:#475569;font-weight:500">appsdeveloperspro.com</p></td>
          </tr></table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function esc(s: string | null | undefined): string {
  return (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

async function sendLeadEmail(data: {
  name: string; email: string; phone_code: string; phone: string
  company: string | null; budget: string | null; message: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  console.log("[resend] API key present:", !!apiKey, "| prefix:", apiKey?.slice(0, 8) ?? "undefined")

  if (!apiKey) {
    console.error("[resend] RESEND_API_KEY is not set — skipping email")
    return
  }

  const resend = new Resend(apiKey)
  const payload = {
    from: "noreply@appsdeveloperspro.com",
    to: "contacto@appsdeveloperspro.com",
    subject: `Nuevo lead: ${data.name}`,
    html: buildEmailHtml(data),
  }

  console.log("[resend] Sending to:", payload.to, "| subject:", payload.subject)

  const result = await resend.emails.send(payload)

  if (result.error) {
    console.error("[resend] API returned error:", JSON.stringify(result.error))
  } else {
    console.log("[resend] Email sent OK | id:", result.data?.id)
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (req.method === "OPTIONS") { res.status(204).end(); return }

  try {
    if (req.method === "GET") {
      if (!requireAuth(req, res)) return
      const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } })
      res.json(leads)
      return
    }

    if (req.method === "POST") {
      const { name, email, phone_code, phone, company, budget, message } = req.body as {
        name: string; email: string; phone_code?: string; phone: string
        company?: string; budget?: string; message: string
      }
      if (!name || !email || !phone || !message) {
        res.status(400).json({ error: "name, email, phone, message required" })
        return
      }

      // Guardar lead siempre, independiente del email
      const lead = await prisma.lead.create({
        data: {
          name, email,
          phone_code: phone_code || "+52",
          phone,
          company: company || null,
          budget: budget || null,
          message,
          status: "unread",
        },
      })
      console.log("[leads] Lead saved:", lead.id)

      // Email como efecto secundario con logging explícito
      try {
        await sendLeadEmail({
          name, email,
          phone_code: phone_code || "+52",
          phone,
          company: company || null,
          budget: budget || null,
          message,
        })
      } catch (emailErr) {
        const msg = emailErr instanceof Error ? emailErr.message : String(emailErr)
        const stack = emailErr instanceof Error ? emailErr.stack : ""
        console.error("[resend] Unhandled exception:", msg)
        console.error("[resend] Stack:", stack)
      }

      res.status(201).json({ ok: true, id: lead.id })
      return
    }

    res.status(405).json({ error: "Method not allowed" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}
