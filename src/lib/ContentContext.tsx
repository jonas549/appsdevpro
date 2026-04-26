import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

type ContentMap = Record<string, Record<string, string>>

const ContentContext = createContext<ContentMap>({})

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentMap>({})

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data: { section: string; key: string; value: string }[]) => {
        const map: ContentMap = {}
        for (const { section, key, value } of data) {
          if (!map[section]) map[section] = {}
          map[section][key] = value
        }
        setContent(map)
      })
      .catch(() => {
        // API unavailable — components fall back to their hardcoded defaults
      })
  }, [])

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

export function useContent(section: string): Record<string, string> {
  return useContext(ContentContext)[section] ?? {}
}
