import sanitizeHtml from "sanitize-html"

/**
 * Sanitización de HTML en el servidor para el contenido que llega por API.
 *
 * El proyecto ya tenía src/lib/safe-html.ts, pero es DOMPurify y sólo corre en
 * el navegador. Y app/blog/[slug]/page.tsx:17 tiene un stripDangerous() por
 * regex que sólo borra <script> y <style> — eso no para onerror=, javascript:
 * ni <iframe>. Cuando el HTML lo escribe un agente automático en vez de una
 * persona desde el admin, hace falta sanitización de verdad.
 *
 * Allowlist según §6 de la especificación.
 */

const SITE_HOSTS = new Set(["appsdeveloperspro.com", "www.appsdeveloperspro.com"])

export class HtmlValidationError extends Error {}

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "h2", "h3", "h4",
    "ul", "ol", "li",
    "a", "strong", "em", "blockquote",
    "img", "figure", "figcaption",
    "br",
    "table", "thead", "tbody", "tr", "td", "th",
  ],
  allowedAttributes: {
    a: ["href", "title", "rel", "target"],
    img: ["src", "alt", "title", "width", "height", "loading"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  // Descarta el contenido de las etiquetas peligrosas en vez de dejar el texto suelto.
  nonTextTags: ["style", "script", "textarea", "option", "noscript"],
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href ?? ""
      let external: boolean
      try {
        // Sólo las URLs absolutas pueden ser externas; las relativas son nuestras.
        const url = new URL(href, "https://appsdeveloperspro.com")
        external = !SITE_HOSTS.has(url.hostname)
      } catch {
        external = false
      }
      return {
        tagName,
        attribs: external
          ? { ...attribs, rel: "nofollow noopener noreferrer", target: "_blank" }
          : attribs,
      }
    },
    img: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, loading: attribs.loading ?? "lazy" },
    }),
  },
}

/**
 * Sanitiza el cuerpo del artículo.
 *
 * Lanza HtmlValidationError (que los route handlers traducen a 422) si tras
 * limpiar no queda contenido, o si alguna imagen viene sin alt — §6 lo exige y
 * es un requisito de accesibilidad que no queremos que el agente se salte.
 */
export function sanitizeBodyHtml(raw: string): string {
  const clean = sanitizeHtml(raw, OPTIONS)

  if (!clean.replace(/<[^>]*>/g, "").trim() && !clean.includes("<img")) {
    throw new HtmlValidationError(
      "bodyHtml quedó vacío tras sanitizar: no contiene ninguna etiqueta permitida",
    )
  }

  const imgsSinAlt = (clean.match(/<img\b[^>]*>/gi) ?? []).filter(
    (tag) => !/\balt\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i.test(tag),
  )
  if (imgsSinAlt.length > 0) {
    throw new HtmlValidationError(
      `bodyHtml tiene ${imgsSinAlt.length} imagen(es) sin atributo alt`,
    )
  }

  return clean
}

/** Sanitización para campos cortos de texto enriquecido (§13). */
export function sanitizeInlineHtml(raw: string): string {
  return sanitizeHtml(raw, {
    allowedTags: ["strong", "em", "br", "a", "span"],
    allowedAttributes: { a: ["href", "title", "rel", "target"] },
    allowedSchemes: ["http", "https", "mailto"],
  })
}

/**
 * Quita todo el marcado y deja sólo el texto.
 *
 * Para los campos del CMS que la plantilla pinta como texto plano (títulos,
 * badges, textos de botón): si alguien mete HTML ahí, el componente lo
 * escaparía y el usuario vería las etiquetas en pantalla. Mejor limpiarlo al
 * entrar que guardar basura.
 */
export function stripAllHtml(raw: string): string {
  return sanitizeHtml(raw, { allowedTags: [], allowedAttributes: {} }).trim()
}
