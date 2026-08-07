import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { requireAgentToken, NO_STORE } from "@/lib/agent-auth"
import { stripAllHtml } from "@/lib/sanitize"
import {
  MAX_BYTES,
  UploadValidationError,
  decodeBase64Image,
  normalizeFolder,
  validateImageBuffer,
} from "@/lib/agent-uploads"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Misma configuración que app/api/upload/route.ts, que es la que ya usa el
// admin. Se reutilizan las tres variables de entorno existentes en Vercel.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

/** Alt opcional: sólo texto, y acotado. Viaja como metadato en Cloudinary. */
const MAX_ALT = 300

interface ParsedUpload {
  buffer: Buffer
  declaredMime: string | null
  alt: string
  folder: string
}

/** multipart/form-data con el fichero en el campo `file`. */
async function parseMultipart(request: Request): Promise<ParsedUpload> {
  const form = await request.formData()
  const file = form.get("file")

  if (!file || typeof file === "string") {
    throw new UploadValidationError("Falta el campo 'file' con la imagen", 400)
  }
  // El tamaño se comprueba aquí además de en validateImageBuffer para no leer
  // en memoria un fichero que ya sabemos que sobra por la cabecera.
  if (file.size > MAX_BYTES) {
    throw new UploadValidationError(
      `La imagen pesa ${(file.size / 1024 / 1024).toFixed(2)} MB y el máximo es ${MAX_BYTES / 1024 / 1024} MB`,
      413,
    )
  }

  return {
    buffer: Buffer.from(await file.arrayBuffer()),
    declaredMime: file.type ? file.type.toLowerCase() : null,
    alt: readAlt(form.get("alt")),
    folder: normalizeFolder(form.get("folder")),
  }
}

/** JSON con base64 o data-URL en el campo `data`. */
async function parseJson(request: Request): Promise<ParsedUpload> {
  let body: { data?: unknown; alt?: unknown; folder?: unknown }
  try {
    body = (await request.json()) as typeof body
  } catch {
    throw new UploadValidationError("El cuerpo debe ser JSON válido", 400)
  }

  if (typeof body.data !== "string" || !body.data.trim()) {
    throw new UploadValidationError(
      "Falta 'data' con la imagen en base64 o data-URL",
      400,
    )
  }

  const { buffer, declaredMime } = decodeBase64Image(body.data)
  return {
    buffer,
    declaredMime,
    alt: readAlt(body.alt),
    folder: normalizeFolder(body.folder),
  }
}

function readAlt(raw: unknown): string {
  if (typeof raw !== "string") return ""
  return stripAllHtml(raw).slice(0, MAX_ALT)
}

/**
 * POST /api/agent/uploads — subir una imagen a Cloudinary
 *
 * Acepta multipart/form-data (campo `file`) o JSON (campo `data` en base64 o
 * data-URL). En ambos casos admite `alt` y `folder` opcionales.
 *
 * Devuelve { url } con la URL https servida por Cloudinary, lista para usarse
 * como `coverImageUrl` en /api/agent/blog/posts.
 */
export async function POST(request: Request) {
  const denied = requireAgentToken(request)
  if (denied) return denied

  const contentType = request.headers.get("content-type") ?? ""

  let parsed: ParsedUpload
  try {
    parsed = contentType.includes("multipart/form-data")
      ? await parseMultipart(request)
      : await parseJson(request)
  } catch (err) {
    if (err instanceof UploadValidationError) {
      return NextResponse.json(
        { error: err.status === 413 ? "Payload Too Large" : err.status === 415 ? "Unsupported Media Type" : "Bad Request", details: [err.message] },
        { status: err.status, headers: NO_STORE },
      )
    }
    console.error("[agent/uploads] no se pudo leer el cuerpo:", err)
    return NextResponse.json(
      { error: "Bad Request", details: ["No se pudo leer el cuerpo de la petición"] },
      { status: 400, headers: NO_STORE },
    )
  }

  let mime: string
  let warnings: string[]
  try {
    const checked = validateImageBuffer(parsed.buffer, parsed.declaredMime)
    mime = checked.mime
    warnings = checked.warnings
  } catch (err) {
    if (err instanceof UploadValidationError) {
      return NextResponse.json(
        { error: err.status === 413 ? "Payload Too Large" : err.status === 415 ? "Unsupported Media Type" : "Bad Request", details: [err.message] },
        { status: err.status, headers: NO_STORE },
      )
    }
    throw err
  }

  if (!parsed.alt) {
    warnings.push("Sin 'alt': recuerda pasar coverImageAlt al crear el post")
  }

  try {
    const dataUri = `data:${mime};base64,${parsed.buffer.toString("base64")}`
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `appsdevpro/${parsed.folder}`,
      resource_type: "image",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
      context: parsed.alt ? { alt: parsed.alt } : undefined,
    })

    return NextResponse.json(
      {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        alt: parsed.alt || null,
        ...(warnings.length > 0 ? { warnings } : {}),
      },
      { status: 201, headers: NO_STORE },
    )
  } catch (err) {
    console.error("[agent/uploads] Cloudinary falló:", err)
    return NextResponse.json(
      { error: "Server error", details: ["La subida a Cloudinary falló"] },
      { status: 500, headers: NO_STORE },
    )
  }
}
