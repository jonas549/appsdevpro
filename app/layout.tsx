import type { Metadata } from 'next'
import { DM_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import { Suspense } from 'react'
import './globals.css'
import AnalyticsPageTracker from './components/AnalyticsPageTracker'
import MetaPixelClient from './components/MetaPixelClient'
import { serializeJsonLd, siteGraph } from '@/lib/json-ld'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const GA_ID = 'G-8J3B6TQM9Q'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  metadataBase: new URL('https://appsdeveloperspro.com'),
  title: {
    default: 'Apps Developers Pro — Desarrollo de Apps Shopify',
    template: '%s | Apps Developers Pro',
  },
  description: 'Agencia especializada en desarrollo de aplicaciones Shopify. Apps publicadas en el App Store, integraciones y soluciones a medida.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  verification: {
    google: 'aTvy1tYSctVhnkgetb5H_W4EO8RWvvbDe8Mi0YQ6gNA',
  },
  openGraph: {
    siteName: 'Apps Developers Pro',
    locale: 'es_ES',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${dmSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {/* Organization + WebSite (§14.2) — en el layout, así va en todas las páginas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteGraph()) }}
        />

        {children}

        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>

        {/* GA4 page view tracker + Meta Pixel (client components need Suspense for useSearchParams) */}
        <Suspense fallback={null}>
          <AnalyticsPageTracker />
          <MetaPixelClient />
        </Suspense>
      </body>
    </html>
  )
}
