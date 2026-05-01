import type { VercelRequest, VercelResponse } from "@vercel/node"
import { prisma } from "./_lib/prisma.js"
import { setCors, requireAuth } from "./_lib/auth.js"

function buildEmailHtml(data: {
  name: string; email: string; phone_code: string; phone: string
  company: string | null; budget: string | null; message: string
}) {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#F1F5F9">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

        <tr><td style="background:#4361EE;padding:32px 40px">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700">Nuevo lead recibido</h1>
          <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:14px">Apps Developers Pro — Formulario de contacto</p>
        </td></tr>

        <tr><td style="padding:32px 40px">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding-bottom:24px;border-bottom:1px solid #E2E8F0">
              <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#64748B">Nombre</p>
              <p style="margin:0;font-size:18px;font-weight:700;color:#0F172A">${esc(data.name)}</p>
            </td></tr>

            <tr><td style="padding:20px 0;border-bottom:1px solid #E2E8F0">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td width="50%" style="padding-right:16px">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#64748B">Email</p>
                  <a href="mailto:${esc(data.email)}" style="color:#4361EE;font-size:14px;font-weight:500;text-decoration:none">${esc(data.email)}</a>
                </td>
                <td width="50%">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#64748B">Teléfono</p>
                  <p style="margin:0;font-size:14px;color:#334155">${esc(data.phone_code)} ${esc(data.phone)}</p>
                </td>
              </tr></table>
            </td></tr>

            ${data.company || data.budget ? `
            <tr><td style="padding:20px 0;border-bottom:1px solid #E2E8F0">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                ${data.company ? `<td width="50%" style="padding-right:16px">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#64748B">Empresa</p>
                  <p style="margin:0;font-size:14px;color:#334155">${esc(data.company)}</p>
                </td>` : '<td width="50%"></td>'}
                ${data.budget ? `<td width="50%">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#64748B">Presupuesto</p>
                  <p style="margin:0;font-size:14px;color:#334155">${esc(data.budget)}</p>
                </td>` : '<td width="50%"></td>'}
              </tr></table>
            </td></tr>` : ''}

            <tr><td style="padding:20px 0">
              <p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#64748B">Mensaje</p>
              <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:16px">
                <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;white-space:pre-wrap">${esc(data.message)}</p>
              </div>
            </td></tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px"><tr>
            <td style="padding-right:8px">
              <a href="mailto:${esc(data.email)}" style="display:inline-block;background:#4361EE;color:#ffffff;font-size:13px;font-weight:600;padding:12px 20px;border-radius:8px;text-decoration:none">Responder por email</a>
            </td>
            <td>
              <a href="https://wa.me/${data.phone_code.replace('+', '')}${data.phone.replace(/\D/g, '')}" style="display:inline-block;background:#25D366;color:#ffffff;font-size:13px;font-weight:600;padding:12px 20px;border-radius:8px;text-decoration:none">WhatsApp</a>
            </td>
          </tr></table>
        </td></tr>

        <tr><td style="background:#F8FAFC;border-top:1px solid #E2E8F0;padding:20px 40px;text-align:center">
          <p style="margin:0;font-size:12px;color:#94A3B8">Email automático desde el formulario de <strong>appsdeveloperspro.com</strong></p>
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

      // Guardar lead primero — siempre, independiente del email
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

      // Enviar email como efecto secundario — no bloquea ni falla el request
      try {
        const { Resend } = await import("resend")
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: "noreply@appsdeveloperspro.com",
          to: "jonasoko82@gmail.com",
          subject: `Nuevo lead: ${name}`,
          html: buildEmailHtml({
            name, email,
            phone_code: phone_code || "+52",
            phone,
            company: company || null,
            budget: budget || null,
            message,
          }),
        })
      } catch (emailErr) {
        // Log pero no falla el request — el lead ya fue guardado
        console.error("[leads] Email send failed:", emailErr)
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
