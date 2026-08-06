/**
 * Generación de slugs en el servidor.
 *
 * Refleja la lógica que ya usa el editor del admin
 * (app/admin/blog/[id]/page.tsx) pero con normalización Unicode, que cubre
 * cualquier acento en vez de una lista fija de caracteres.
 */

/** Tope de longitud recomendado por la especificación (§5). */
const MAX_SLUG_LENGTH = 70

/** Rango de marcas diacríticas combinantes que deja NFD (á -> a + U+0301). */
const COMBINING_MARKS = /[̀-ͯ]/g

export function toSlug(input: string): string {
  return input
    .normalize("NFD")
    .replace(COMBINING_MARKS, "") // á->a, ñ->n, ü->u
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, "") // el slice puede dejar un guión colgando
}

/**
 * Devuelve un slug libre. Si `base` ya está ocupado prueba `-2`, `-3`, etc.,
 * recortando la base para que el resultado nunca pase de MAX_SLUG_LENGTH.
 *
 * `isTaken` se inyecta para que esta función no dependa de Prisma y sea
 * testeable en aislamiento.
 */
export async function uniqueSlug(
  base: string,
  isTaken: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const root = base || "post"

  if (!(await isTaken(root))) return root

  for (let i = 2; i <= 100; i++) {
    const suffix = `-${i}`
    const candidate = root.slice(0, MAX_SLUG_LENGTH - suffix.length) + suffix
    if (!(await isTaken(candidate))) return candidate
  }

  throw new Error(`No se pudo generar un slug único a partir de "${root}"`)
}
