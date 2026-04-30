import { useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { motion, useScroll, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { ContentProvider } from './lib/ContentContext'
import Hero from './components/sections/Hero'
import MarqueeSection from './components/sections/Marquee'
import ProblemSolution from './components/sections/ProblemSolution'
import Services from './components/sections/Services'
import Apps from './components/sections/Apps'
import CTABanner from './components/sections/CTABanner'
import Process from './components/sections/Process'
import FAQ from './components/sections/FAQ'
import CTAFinal from './components/sections/CTAFinal'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/admin/ProtectedRoute'
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import ContentPage from './pages/admin/ContentPage'
import BlogPage from './pages/admin/BlogPage'
import BlogEditorPage from './pages/admin/BlogEditorPage'
import BlogListPage from './pages/BlogListPage'
import BlogPostPage from './pages/BlogPostPage'

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

function PublicSite() {
  return (
    <div className="min-h-screen bg-[#07090F]">
      <ScaleFadeOut><Hero /></ScaleFadeOut>
      <MarqueeSection />
      <ScaleFadeOut><ProblemSolution /></ScaleFadeOut>
      <Services />
      <Apps />
      <CTABanner />
      <Process />
      <FAQ />
      <CTAFinal />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site — wrapped in ContentProvider */}
        <Route path="/" element={<ContentProvider><PublicSite /></ContentProvider>} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />

        {/* Admin */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/admin/content" element={<ProtectedRoute><ContentPage /></ProtectedRoute>} />
        <Route path="/admin/blog" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
        <Route path="/admin/blog/:id" element={<ProtectedRoute><BlogEditorPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
