'use client'

import { createContext, useContext, useEffect, useState } from "react"
import type { CSSProperties, ReactNode } from "react"

type ContentMap = Record<string, Record<string, string>>

const ContentContext = createContext<ContentMap>({})

export function getSizeStyle(size?: string): CSSProperties {
  switch (size) {
    case 'h1':   return { fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1 }
    case 'h2':   return { fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, lineHeight: 1.2 }
    case 'h3':   return { fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', fontWeight: 600 }
    case 'h4':   return { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 }
    case 'h5':   return { fontSize: '1.125rem', fontWeight: 500, lineHeight: 1.4 }
    case 'p':    return { fontSize: '1rem', fontWeight: 400, lineHeight: 1.7 }
    case 'span': return {}
    default:     return {}
  }
}

export function getFieldStyle(size?: string, px?: string, color?: string): CSSProperties {
  const style: CSSProperties = { ...getSizeStyle(size) }
  const pxNum = parseInt(px || '')
  if (pxNum > 0) style.fontSize = `${pxNum}px`
  if (color) style.color = color
  return style
}

export function ContentProvider({ children, initialContent }: { children: ReactNode; initialContent?: ContentMap }) {
  const [content, setContent] = useState<ContentMap>(initialContent ?? {})

  function load() {
    fetch("/api/content", { cache: 'no-store' })
      .then(r => r.json())
      .then((data: { section: string; key: string; value: string }[]) => {
        const map: ContentMap = {}
        for (const { section, key, value } of data) {
          if (!map[section]) map[section] = {}
          map[section][key] = value
        }
        if (!initialContent) {
          const seoTitle = map['seo']?.['meta_title']
          const seoDesc  = map['seo']?.['meta_description']
          if (seoTitle) document.title = seoTitle
          if (seoDesc) {
            const metaEl = document.querySelector('meta[name="description"]')
            if (metaEl) metaEl.setAttribute('content', seoDesc)
          }
        }
        setContent(map)
      })
      .catch(() => {})
  }

  useEffect(() => {
    if (!initialContent) load()
    const onVisibility = () => { if (document.visibilityState === 'visible') load() }
    window.addEventListener('focus', load)
    window.addEventListener('content-updated', load)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('focus', load)
      window.removeEventListener('content-updated', load)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

export function useContent(section: string): Record<string, string> {
  return useContext(ContentContext)[section] ?? {}
}
