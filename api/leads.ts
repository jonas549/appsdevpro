import type { VercelRequest, VercelResponse } from "@vercel/node"
import { prisma } from "./_lib/prisma.js"
import { setCors, requireAuth } from "./_lib/auth.js"

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
      // TODO: Resend — send email notification to contacto@appsdeveloperspro.com
      res.status(201).json({ ok: true, id: lead.id })
      return
    }

    res.status(405).json({ error: "Method not allowed" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
}
