/**
 * Validación de imágenes subidas por el agente (/api/agent/uploads).
 *
 * El tipo declarado por el cliente (Content-Type del multipart, o el prefijo
 * "data:image/png;base64," de una data-URL) lo controla quien llama, así que no
 * sirve como validación: se comprueban los BYTES reales y se usa lo que digan
 * ellos. Lo declarado sólo se usa para avisar si no coincide.
 */

/** 10 MB — el límite de tamaño de imagen del plan gratuito de Cloudinary. */
export const MAX_BYTES = 10 * 1024 * 1024

export const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"] as const
export type AllowedMime = (typeof ALLOWED_MIME)[number]

export class UploadValidationError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 413 | 415,
  ) {
    super(message)
  }
}

function startsWith(buf: Buffer, bytes: number[], offset = 0): boolean {
  if (buf.length < offset + bytes.length) return false
  return bytes.every((b, i) => buf[offset + i] === b)
}

/**
 * Identifica el formato por su firma binaria. Devuelve null si no es ninguna de
 * las imágenes permitidas — incluido el caso de un SVG, que se rechaza a
 * propósito: es XML y puede llevar <script> dentro.
 */
export function sniffImageMime(buf: Buffer): AllowedMime | null {
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (startsWith(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png"
  // JPEG: FF D8 FF
  if (startsWith(buf, [0xff, 0xd8, 0xff])) return "image/jpeg"
  // GIF: "GIF8"
  if (startsWith(buf, [0x47, 0x49, 0x46, 0x38])) return "image/gif"
  // WEBP: "RIFF" .... "WEBP"
  if (
    startsWith(buf, [0x52, 0x49, 0x46, 0x46]) &&
    startsWith(buf, [0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return "image/webp"
  }
  // AVIF: caja ISOBMFF "ftyp" en el offset 4, con marca avif/avis en el 8.
  if (startsWith(buf, [0x66, 0x74, 0x79, 0x70], 4)) {
    const brand = buf.subarray(8, 12).toString("latin1")
    if (brand === "avif" || brand === "avis") return "image/avif"
  }
  return null
}

/**
 * Decodifica base64 o data-URL a Buffer, comprobando el tamaño ANTES de
 * reservar memoria: 4 caracteres base64 son 3 bytes, así que la longitud de la
 * cadena ya acota el resultado y evita materializar un payload enorme sólo para
 * rechazarlo después.
 */
export function decodeBase64Image(input: string): { buffer: Buffer; declaredMime: string | null } {
  const trimmed = input.trim()

  let declaredMime: string | null = null
  let payload = trimmed

  const dataUrl = /^data:([a-z0-9.+/-]+)?(;charset=[^;,]+)?(;base64)?,/i.exec(trimmed)
  if (dataUrl) {
    if (!dataUrl[3]) {
      throw new UploadValidationError("La data-URL debe estar codificada en base64", 400)
    }
    declaredMime = dataUrl[1]?.toLowerCase() ?? null
    payload = trimmed.slice(dataUrl[0].length)
  }

  payload = payload.replace(/\s/g, "")
  if (!payload) {
    throw new UploadValidationError("'data' no contiene ningún dato", 400)
  }
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(payload)) {
    throw new UploadValidationError("'data' no es base64 válido", 400)
  }
  if (Math.floor((payload.length * 3) / 4) > MAX_BYTES) {
    throw new UploadValidationError(
      `La imagen supera el máximo de ${MAX_BYTES / 1024 / 1024} MB`,
      413,
    )
  }

  return { buffer: Buffer.from(payload, "base64"), declaredMime }
}

/**
 * Comprueba bytes reales, tamaño y formato. Devuelve el MIME detectado y los
 * avisos (por ejemplo, que el tipo declarado no coincidía con el real).
 */
export function validateImageBuffer(
  buffer: Buffer,
  declaredMime: string | null,
): { mime: AllowedMime; warnings: string[] } {
  const warnings: string[] = []

  if (buffer.length === 0) {
    throw new UploadValidationError("El archivo está vacío", 400)
  }
  if (buffer.length > MAX_BYTES) {
    throw new UploadValidationError(
      `La imagen pesa ${(buffer.length / 1024 / 1024).toFixed(2)} MB y el máximo es ${MAX_BYTES / 1024 / 1024} MB`,
      413,
    )
  }

  const mime = sniffImageMime(buffer)
  if (!mime) {
    throw new UploadValidationError(
      `Formato no soportado. Permitidos: ${ALLOWED_MIME.join(", ")} (el tipo se determina por los bytes del archivo, no por lo declarado)`,
      415,
    )
  }

  const normalizedDeclared = declaredMime === "image/jpg" ? "image/jpeg" : declaredMime
  if (normalizedDeclared && normalizedDeclared !== mime) {
    warnings.push(
      `El tipo declarado era '${declaredMime}' pero el contenido real es '${mime}'; se usó el real`,
    )
  }

  return { mime, warnings }
}

/** Carpeta destino en Cloudinary. Se acota para que no se pueda escribir fuera. */
export function normalizeFolder(raw: unknown): string {
  if (typeof raw !== "string" || !raw.trim()) return "agent"
  const clean = raw.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "")
  if (!clean) {
    throw new UploadValidationError(
      "'folder' sólo admite letras, números, guion y guion bajo",
      400,
    )
  }
  return clean.slice(0, 40)
}
