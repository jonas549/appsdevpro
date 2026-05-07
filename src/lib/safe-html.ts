import DOMPurify from 'dompurify'

export function safeHtml(text: string): string {
  if (!text) return ''
  let html = text
  html = html.replace(/\*\*(.+?)\*\*/gs, '<strong>$1</strong>')
  html = html.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>')

  if (typeof window === 'undefined') return html

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['strong', 'em', 'b', 'i', 'a', 'br', 'span', 'p', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  })
}
