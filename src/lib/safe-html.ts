import DOMPurify from 'dompurify'

/**
 * Convierte **markdown** a HTML y sanitiza.
 * - Si el texto ya contiene etiquetas HTML (<strong>, <em>, etc.) las respeta.
 * - Si tiene markdown **bold** o *italic* los convierte a <strong>/<em>.
 * - Siempre pasa por DOMPurify para prevenir XSS.
 */
export function safeHtml(text: string): string {
  if (!text) return ''
  let html = text
  // Convertir **texto** → <strong>texto</strong> (para fallbacks con markdown)
  html = html.replace(/\*\*(.+?)\*\*/gs, '<strong>$1</strong>')
  // Convertir *texto* → <em>texto</em> (single star, no parte de **)
  html = html.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>')
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['strong', 'em', 'b', 'i', 'a', 'br', 'span', 'p', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  })
}
