/**
 * Datos estructurados schema.org (§14.2 y §14.3).
 *
 * Todo vive en un módulo compartido porque el `publisher` de cada BlogPosting
 * tiene que ser LA MISMA entidad que la Organization que emite el layout raíz.
 * Si cada fichero se inventara su propio bloque, Google vería dos organizaciones
 * distintas con el mismo nombre en la misma página.
 */

export const SITE_URL = "https://appsdeveloperspro.com"
export const ORG_NAME = "Apps Developers Pro"

/** @id estables: son las anclas que enlazan los nodos entre bloques. */
export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`
const LOGO_ID = `${SITE_URL}/#logo`

/** El logo real del sitio (public/logo-header.png), en URL absoluta. */
const LOGO = {
  "@type": "ImageObject",
  "@id": LOGO_ID,
  url: `${SITE_URL}/logo-header.png`,
  contentUrl: `${SITE_URL}/logo-header.png`,
  width: 1308,
  height: 191,
  caption: ORG_NAME,
} as const

const SITE_DESCRIPTION =
  "Agencia especializada en desarrollo de aplicaciones Shopify. Apps publicadas en el App Store, integraciones y soluciones a medida."

/** Imagen por defecto cuando un post no tiene portada. */
const FALLBACK_IMAGE = `${SITE_URL}/og-image.png`

/**
 * Serializa a JSON escapando lo que podría cerrar el <script> que lo contiene.
 *
 * No es paranoia: en la plantilla del post los valores salen de la base de
 * datos (título, excerpt, preguntas del FAQ) y desde que existe /api/agent/*
 * los escribe un agente automático. Un título que contuviera "</script>"
 * rompería la etiqueta e inyectaría HTML en la página.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
}

/**
 * Organization + WebSite, para el layout raíz (presente en todas las páginas).
 *
 * Van en un mismo @graph en vez de dos <script> sueltos para poder enlazar
 * WebSite.publisher → Organization por @id sin repetir los datos.
 */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: ORG_NAME,
        url: SITE_URL,
        logo: LOGO,
        image: { "@id": LOGO_ID },
        description: SITE_DESCRIPTION,
        // Sin perfiles públicos confirmados todavía. Se deja el array vacío a
        // propósito: poner URLs inventadas sería peor que no declarar nada.
        sameAs: [] as string[],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: ORG_NAME,
        description: SITE_DESCRIPTION,
        publisher: { "@id": ORG_ID },
        inLanguage: "es-ES",
      },
    ],
  }
}

/** Referencia autocontenida a la Organization, para los bloques del post. */
function orgRef() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: ORG_NAME,
    url: SITE_URL,
  }
}

/** Google recomienda no pasar de 110 caracteres en `headline`. */
const MAX_HEADLINE = 110

export interface BlogPostingInput {
  title: string
  slug: string
  description: string
  image: string | null
  datePublished: Date
  dateModified: Date
  tags?: string[]
}

export function blogPostingSchema(post: BlogPostingInput) {
  const url = `${SITE_URL}/blog/${post.slug}`
  const headline =
    post.title.length > MAX_HEADLINE ? `${post.title.slice(0, MAX_HEADLINE - 1).trimEnd()}…` : post.title

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline,
    name: post.title,
    description: post.description,
    image: [post.image || FALLBACK_IMAGE],
    datePublished: post.datePublished.toISOString(),
    dateModified: post.dateModified.toISOString(),
    author: orgRef(),
    publisher: { ...orgRef(), logo: LOGO },
    inLanguage: "es-ES",
    ...(post.tags && post.tags.length > 0 ? { keywords: post.tags.join(", ") } : {}),
  }
}

/**
 * Inicio › Blog › <título del post>.
 *
 * El último escalón va sin `item`: es la página actual y Google documenta
 * omitir la URL en ese caso.
 */
export function blogBreadcrumbSchema(post: { title: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/blog/${post.slug}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title },
    ],
  }
}
