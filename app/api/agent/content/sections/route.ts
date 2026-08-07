import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAgentToken, NO_STORE } from "@/lib/agent-auth"
import {
  ALLOWED_SECTIONS,
  fieldsOf,
  isAllowedSection,
  typeOfKey,
  validateUpdates,
  type AllowedSection,
} from "@/lib/agent-sections"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Sección por defecto mientras §13 sólo cubra 'apps'. */
const DEFAULT_SECTION: AllowedSection = "apps"

function badSection(value: string | null) {
  return NextResponse.json(
    {
      error: "Bad Request",
      details: [
        `'section' inválida: ${JSON.stringify(value)}. Permitidas: ${ALLOWED_SECTIONS.join(", ")}`,
      ],
    },
    { status: 400, headers: NO_STORE },
  )
}

/**
 * GET /api/agent/content/sections?section=apps — leer los campos actuales (§13)
 *
 * Devuelve las claves REALES de SiteContent, con el tipo de cada una, para que
 * el agente sepa qué puede escribir y en qué formato antes de mandar el PATCH.
 */
export async function GET(request: Request) {
  const denied = requireAgentToken(request)
  if (denied) return denied

  const { searchParams } = new URL(request.url)
  const raw = searchParams.get("section")
  const section = raw ?? DEFAULT_SECTION
  if (!isAllowedSection(section)) return badSection(raw)

  try {
    const rows = await prisma.siteContent.findMany({
      where: { section },
      orderBy: { key: "asc" },
      select: { key: true, value: true, updatedAt: true },
    })

    const schema = fieldsOf(section)
    const stored = new Map(rows.map((r) => [r.key, r]))

    // Se recorre el esquema, no la tabla: así el agente ve también las claves
    // que la plantilla soporta pero que aún no tienen fila (value: null), en vez
    // de tener que adivinar que existen.
    const fields = Object.keys(schema)
      .sort()
      .map((key) => {
        const row = stored.get(key)
        return {
          key,
          type: schema[key],
          value: row?.value ?? null,
          updatedAt: row?.updatedAt.toISOString() ?? null,
        }
      })

    // Claves presentes en la tabla pero fuera del esquema: se reportan como
    // solo-lectura en vez de ocultarlas, para que un desajuste sea visible.
    const unknown = rows
      .filter((r) => !schema[r.key])
      .map((r) => ({ key: r.key, type: "unknown" as const, value: r.value, updatedAt: r.updatedAt.toISOString() }))

    return NextResponse.json(
      {
        section,
        count: fields.length,
        editableKeys: Object.keys(schema).sort(),
        fields,
        ...(unknown.length > 0 ? { unmanagedFields: unknown } : {}),
      },
      { headers: NO_STORE },
    )
  } catch (err) {
    console.error("[agent/sections] GET falló:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: NO_STORE })
  }
}

/**
 * PATCH /api/agent/content/sections — actualizar campos por clave (§13)
 *
 * Body: { section?: "apps", updates: [{ key, value }] }
 *
 * Todo o nada: si una sola clave falla la validación no se escribe ninguna, y
 * las escrituras van dentro de una transacción para no dejar la ficha a medias.
 */
export async function PATCH(request: Request) {
  const denied = requireAgentToken(request)
  if (denied) return denied

  let body: { section?: unknown; updates?: unknown }
  try {
    body = (await request.json()) as { section?: unknown; updates?: unknown }
  } catch {
    return NextResponse.json(
      { error: "Bad Request", details: ["El cuerpo debe ser JSON válido"] },
      { status: 400, headers: NO_STORE },
    )
  }

  const section = body.section === undefined ? DEFAULT_SECTION : body.section
  if (!isAllowedSection(section)) {
    return badSection(typeof body.section === "string" ? body.section : null)
  }

  const { normalized, errors } = validateUpdates(section, body.updates)
  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Bad Request", details: errors, editableKeys: Object.keys(fieldsOf(section)).sort() },
      { status: 400, headers: NO_STORE },
    )
  }

  // Avisos no bloqueantes: el valor se guarda igual, pero el agente se entera de
  // que la sanitización le cambió lo que mandó.
  const warnings: string[] = []
  for (const u of normalized) {
    if (u.value.trim() === "" && typeOfKey(section, u.key) !== "url") {
      warnings.push(`'${u.key}' queda vacío: la plantilla usará su valor por defecto`)
    }
  }

  try {
    const written = await prisma.$transaction(
      normalized.map((u) =>
        prisma.siteContent.upsert({
          where: { section_key: { section, key: u.key } },
          update: { value: u.value },
          create: { section, key: u.key, value: u.value },
          select: { key: true, value: true, updatedAt: true },
        }),
      ),
    )

    return NextResponse.json(
      {
        section,
        updated: written.length,
        fields: written.map((r) => ({
          key: r.key,
          type: typeOfKey(section, r.key),
          value: r.value,
          updatedAt: r.updatedAt.toISOString(),
        })),
        ...(warnings.length > 0 ? { warnings } : {}),
      },
      { headers: NO_STORE },
    )
  } catch (err) {
    console.error("[agent/sections] PATCH falló:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: NO_STORE })
  }
}
