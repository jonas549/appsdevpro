import { useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { motion, useScroll, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { ContentProvider, useContent } from './lib/ContentContext'
import SEOHead from './components/SEOHead'
import WhatsAppButton from './components/WhatsAppButton'
import Hero from './components/sections/Hero'
import MarqueeSection from './components/sections/Marquee'
import ProblemSolution from './components/sections/ProblemSolution'
import Services from './components/sections/Services'
import Apps from './components/sections/Apps'
import CTABanner from './components/sections/CTABanner'
import Process from './components/sections/Process'
import BlogFeed from './components/sections/BlogFeed'
import FAQ from './components/sections/FAQ'
import CTAFinal from './components/sections/CTAFinal'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/admin/ProtectedRoute'
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import ContentPage from './pages/admin/ContentPage'
import SettingsPage from './pages/admin/SettingsPage'
import BlogPage from './pages/admin/BlogPage'
import BlogEditorPage from './pages/admin/BlogEditorPage'
import BlogListPage from './pages/BlogListPage'
import BlogPostPage from './pages/BlogPostPage'
import GraciasPage from './pages/GraciasPage'
import ContactForm from './components/sections/ContactForm'
import LeadsPage from './pages/admin/LeadsPage'

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

function HomeSEO() {
  const seo = useContent('seo')
  const title = seo.meta_title || 'Apps Developers Pro — Desarrollo de Apps Shopify'
  const description = seo.meta_description || 'Agencia especializada en desarrollo de aplicaciones Shopify. Apps publicadas en el App Store, integraciones y soluciones a medida.'
  return <SEOHead title={title} description={description} canonical="/" />
}

function PublicSite() {
  return (
    <div className="min-h-screen bg-[#07090F]">
      <HomeSEO />
      <ScaleFadeOut><Hero /></ScaleFadeOut>
      <MarqueeSection />
      <DynamicSections />
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site — wrapped in ContentProvider */}
        <Route path="/" element={<ContentProvider><PublicSite /></ContentProvider>} />
        <Route path="/gracias" element={<GraciasPage />} />
        <Route path="/blog" element={<ContentProvider><BlogListPage /><WhatsAppButton /></ContentProvider>} />
        <Route path="/blog/:slug" element={<ContentProvider><BlogPostPage /><WhatsAppButton /></ContentProvider>} />

        {/* Admin */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/admin/content" element={<ProtectedRoute><ContentPage /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/admin/blog" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
        <Route path="/admin/blog/:id" element={<ProtectedRoute><BlogEditorPage /></ProtectedRoute>} />
        <Route path="/admin/leads" element={<ProtectedRoute><LeadsPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
