'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ContentProvider, useContent } from '@/src/lib/ContentContext'
import Navbar from '@/app/components/layout/Navbar'
import Hero from '@/src/components/sections/Hero'
import MarqueeSection from '@/src/components/sections/Marquee'
import ProblemSolution from '@/src/components/sections/ProblemSolution'
import Services from '@/src/components/sections/Services'
import Apps from '@/src/components/sections/Apps'
import CTABanner from '@/src/components/sections/CTABanner'
import Process from '@/src/components/sections/Process'
import BlogFeed from '@/app/components/sections/BlogFeed'
import FAQ from '@/src/components/sections/FAQ'
import ContactForm from '@/app/components/sections/ContactForm'
import CTAFinal from '@/src/components/sections/CTAFinal'
import Footer from '@/src/components/layout/Footer'
import WhatsAppButton from '@/src/components/WhatsAppButton'

type ContentMap = Record<string, Record<string, string>>

function mapRange(inputRange: number[], outputRange: number[], v: number): number {
  if (v <= inputRange[0]) return outputRange[0]
  if (v >= inputRange[inputRange.length - 1]) return outputRange[outputRange.length - 1]
  for (let i = 0; i < inputRange.length - 1; i++) {
    if (v >= inputRange[i] && v <= inputRange[i + 1]) {
      const t = (v - inputRange[i]) / (inputRange[i + 1] - inputRange[i])
      return outputRange[i] + t * (outputRange[i + 1] - outputRange[i])
    }
  }
  return outputRange[outputRange.length - 1]
}

function ScaleFadeOut({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['end end', 'end start'] })
  const scale = useMotionValue(1)
  const opacity = useMotionValue(1)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    scale.set(mapRange([0, 1], [1, 0.9], v))
    opacity.set(mapRange([0, 0.7, 1], [1, 0.3, 0], v))
  })
  return (
    <div ref={ref}>
      <motion.div style={{ scale, opacity, transformOrigin: 'center top' }}>
        {children}
      </motion.div>
    </div>
  )
}

function HashScroller() {
  const pathname = usePathname()
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    const id = hash.slice(1)
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 150)
    return () => clearTimeout(timer)
  }, [pathname])
  return null
}

const DEFAULT_ORDER = ['problem_solution', 'services', 'apps', 'ctabanner', 'process', 'blog_feed', 'faq', 'contactform', 'ctafinal']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  problem_solution: ProblemSolution,
  services: Services,
  apps: Apps,
  ctabanner: CTABanner,
  process: Process,
  blog_feed: BlogFeed,
  faq: FAQ,
  contactform: ContactForm,
  ctafinal: CTAFinal,
}

function DynamicSections() {
  const globalContent = useContent('global')
  const order = (() => {
    try {
      const parsed = JSON.parse(globalContent.section_order || '') as string[]
      const valid = parsed.filter(id => id in SECTION_COMPONENTS)
      if (valid.length === 0) return DEFAULT_ORDER
      return [...valid, ...DEFAULT_ORDER.filter(id => !valid.includes(id))]
    } catch { return DEFAULT_ORDER }
  })()

  return (
    <>
      {order.map(id => {
        const Comp = SECTION_COMPONENTS[id]
        if (!Comp) return null
        if (id === 'problem_solution') return <ScaleFadeOut key={id}><Comp /></ScaleFadeOut>
        return <Comp key={id} />
      })}
    </>
  )
}

function PublicSite() {
  return (
    <div className="min-h-screen bg-[#07090F]">
      <HashScroller />
      <Navbar />
      <ScaleFadeOut><Hero /></ScaleFadeOut>
      <MarqueeSection />
      <DynamicSections />
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default function SiteShell({ initialContent }: { initialContent?: ContentMap }) {
  return (
    <ContentProvider initialContent={initialContent}>
      <PublicSite />
    </ContentProvider>
  )
}
