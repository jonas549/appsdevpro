/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from "next"
import { ORG_ID, SITE_URL, serializeJsonLd } from "@/lib/json-ld"
import { FAQS } from "./content"
import LandingNav from "./_components/LandingNav"
import Hero from "./_components/Hero"
import Marquee from "./_components/Marquee"
import Specialty from "./_components/Specialty"
import Portfolio, { PortfolioCta } from "./_components/Portfolio"
import Process from "./_components/Process"
import Includes from "./_components/Includes"
import Testimonials from "./_components/Testimonials"
import Faq from "./_components/Faq"
import FinalCta from "./_components/FinalCta"
import FloatingCtas from "./_components/FloatingCtas"
import LeadForm from "./_components/LeadForm"
import RevealOnScroll from "./_components/RevealOnScroll"

// Landing de creación de tiendas Shopify. Sin DB: se genera en build (○ Static).

const URL = `${SITE_URL}/tiendas-shopify`
const TITLE = "Tiendas Shopify que venden de verdad"
const DESCRIPTION =
  "Diseñamos y lanzamos tu tienda Shopify a medida: catálogo, pagos, envíos y campañas de descuento listas. Hecha por los creadores de DiscountFlow y Calendify Delivery."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  // noindex hasta que el contenido pendiente (cifras, testimonios) sea real.
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    url: URL,
    title: `${TITLE} | Apps Developers Pro`,
    description: DESCRIPTION,
    siteName: "Apps Developers Pro",
    locale: "es_ES",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | Apps Developers Pro`,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${URL}#service`,
      name: "Desarrollo de tiendas Shopify",
      serviceType: "Diseño y desarrollo de tiendas Shopify",
      description: DESCRIPTION,
      url: URL,
      provider: { "@id": ORG_ID },
      areaServed: ["Latinoamérica", "España"],
      availableLanguage: ["es", "en"],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Tiendas Shopify", item: URL },
      ],
    },
  ],
}

export default function TiendasShopifyPage() {
  return (
    <div className="max-w-full overflow-x-clip bg-[#07090F] pb-24 text-primary min-[860px]:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <LandingNav />
      <main>
        <Hero form={<LeadForm heading="Cuéntanos de tu tienda" />} />
        <Marquee />
        <Specialty />
        <Portfolio cta={<PortfolioCta />} />
        <Process />
        <Includes />
        <Testimonials />
        <Faq />
      </main>
      <FinalCta form={<LeadForm heading="Empecemos tu tienda" />} />
      <FloatingCtas />
      <RevealOnScroll />
    </div>
  )
}
