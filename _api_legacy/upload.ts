import type { VercelRequest, VercelResponse } from "@vercel/node"
import { v2 as cloudinary } from "cloudinary"
import { setCors, requireAuth } from "./_lib/auth.js"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (req.method === "OPTIONS") { res.status(204).end(); return }
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return }
  if (!requireAuth(req, res)) return

  try {
    const { data, folder = "blog" } = req.body as { data: string; folder?: string }
    if (!data) { res.status(400).json({ error: "data (base64 dataURI) required" }); return }

    const result = await cloudinary.uploader.upload(data, {
      folder: `appsdevpro/${folder}`,
      resource_type: "image",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    })

    res.json({ url: result.secure_url, public_id: result.public_id })
  } catch (err) {
    console.error("Cloudinary upload error:", err)
    res.status(500).json({ error: "Upload failed" })
  }
}
