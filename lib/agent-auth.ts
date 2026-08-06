import { NextResponse } from "next/server"
import { createHash, timingSafeEqual } from "node:crypto"

/**
 * Autenticación para los endpoints de máquina (/api/agent/*).
 *
 * A diferencia de lib/auth.ts, que valida un JWT de sesión humana con caducidad
 * de 7 días, aquí se compara un token estático de servicio guardado en la
 * variable de entorno AGENT_API_TOKEN.
 *
 * Deliberadamente NO se emiten cabeceras CORS: un agente servidor-a-servidor no
 * las necesita, y CORS sólo relaja restricciones de navegador.
 */

const NO_STORE = { "Cache-Control": "no-store" }

/** Longitud mínima aceptada para el token, para no arrancar con un secreto débil. */
const MIN_TOKEN_LENGTH = 32

/**
 * Comparación en tiempo constante.
 *
 * Se hashean ambos lados antes de comparar por dos razones: timingSafeEqual
 * lanza si los buffers tienen distinta longitud, y comparar longitudes crudas
 * filtraría la longitud del token real. Con SHA-256 ambos son siempre 32 bytes.
 */
function constantTimeEquals(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a, "utf8").digest()
  const hb = createHash("sha256").update(b, "utf8").digest()
  return timingSafeEqual(ha, hb)
}

/**
 * Devuelve una NextResponse de error si la petición no está autorizada, o null
 * si el token es válido. Uso:
 *
 *   const denied = requireAgentToken(request)
 *   if (denied) return denied
 */
export function requireAgentToken(request: Request): NextResponse | null {
  const expected = process.env.AGENT_API_TOKEN

  if (!expected || expected.length < MIN_TOKEN_LENGTH) {
    // Fallo de configuración del servidor, no del cliente: no es un 401.
    console.error(
      "[agent-auth] AGENT_API_TOKEN ausente o más corto de " +
        `${MIN_TOKEN_LENGTH} caracteres — endpoints de agente deshabilitados`,
    )
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500, headers: NO_STORE },
    )
  }

  const header = request.headers.get("authorization")
  if (!header?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: NO_STORE },
    )
  }

  if (!constantTimeEquals(header.slice("Bearer ".length).trim(), expected)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: NO_STORE },
    )
  }

  return null
}

export { NO_STORE }
