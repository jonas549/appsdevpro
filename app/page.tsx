/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import SiteShell from '@/app/components/SiteShell'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://appsdeveloperspro.com'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const rows = await prisma.content.findMany({ where: { section: 'seo' } })
    const seo = Object.fromEntries(rows.map(r => [r.key, r.value]))
    return {
      title: seo.meta_title || 'Apps Developers Pro — Desarrollo de Apps Shopify',
      description: seo.meta_description || 'Agencia especializada en desarrollo de aplicaciones Shopify. Apps publicadas en el App Store, integraciones y soluciones a medida.',
      alternates: { canonical: SITE_URL },
    }
  } catch {
    return {}
  }
}

export default async function HomePage() {
  let contentMap: Record<string, Record<string, string>> | undefined
  try {
    const rows = await prisma.content.findMany()
    contentMap = {}
    for (const { section, key, value } of rows) {
      if (!contentMap[section]) contentMap[section] = {}
      contentMap[section][key] = value
    }
  } catch { /* DB unavailable — render with client-side fallback */ }
  return <SiteShell initialContent={contentMap} />
}
