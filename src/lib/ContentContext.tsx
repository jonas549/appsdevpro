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

/**
 * Combina tag semántico (_size), tamaño en px (_px) y color (_color)
 * en un único objeto CSSProperties listo para usar como style prop.
 */
export function getFieldStyle(size?: string, px?: string, color?: string): CSSProperties {
  const style: CSSProperties = { ...getSizeStyle(size) }
  const pxNum = parseInt(px || '')
  if (pxNum > 0) style.fontSize = `${pxNum}px`
  if (color) style.color = color
  return style
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentMap>({})

  function load() {
    fetch("/api/content", { cache: 'no-store' })
      .then(r => r.json())
      .then((data: { section: string; key: string; value: string }[]) => {
        const map: ContentMap = {}
        for (const { section, key, value } of data) {
          if (!map[section]) map[section] = {}
          map[section][key] = value
        }
        setContent(map)
      })
      .catch(() => {})
  }

  useEffect(() => {
    load()
    const onVisibility = () => { if (document.visibilityState === 'visible') load() }
    window.addEventListener('focus', load)
    window.addEventListener('content-updated', load)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('focus', load)
      window.removeEventListener('content-updated', load)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

export function useContent(section: string): Record<string, string> {
  return useContext(ContentContext)[section] ?? {}
}
