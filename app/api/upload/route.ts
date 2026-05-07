import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { requireAuth, corsHeaders, optionsResponse } from "@/lib/auth"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export function OPTIONS() { return optionsResponse() }

export async function POST(request: Request) {
  const authResult = requireAuth(request)
  if (authResult instanceof NextResponse) return authResult

  try {
    const { data, folder = "blog" } = await request.json() as { data: string; folder?: string }
    if (!data) return NextResponse.json({ error: "data (base64 dataURI) required" }, { status: 400, headers: corsHeaders })

    const result = await cloudinary.uploader.upload(data, {
      folder: `appsdevpro/${folder}`,
      resource_type: "image",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    })
    return NextResponse.json({ url: result.secure_url, public_id: result.public_id }, { headers: corsHeaders })
  } catch (err) {
    console.error("Cloudinary upload error:", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500, headers: corsHeaders })
  }
}
