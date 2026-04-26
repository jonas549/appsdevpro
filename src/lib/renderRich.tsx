import React from 'react'

/**
 * Renders **bold** markers as <strong> and cleans HTML entities.
 * Usage: {renderRich(text)}
 */
export function renderRich(text: string, boldClass = 'font-semibold text-white'): React.ReactNode {
  if (!text) return null
  const clean = text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

  const parts = clean.split(/\*\*(.+?)\*\*/g)
  if (parts.length === 1) return clean

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <strong key={i} className={boldClass}>{part}</strong>
          : part
      )}
    </>
  )
}
