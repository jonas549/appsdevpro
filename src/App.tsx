import { useRef } from 'react'
import { motion, useScroll, useMotionValue, useMotionValueEvent } from 'framer-motion'
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

// Maps a scroll progress value through a piecewise linear curve
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

// Wraps a section with a scale+fade effect as it exits the viewport (mirrors HTML GSAP version)
function ScaleFadeOut({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['end end', 'end start'],
  })

  // Standalone MotionValues — not scroll-linked, so framer-motion won't use WAAPI
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

export default function App() {
  return (
    <div className="min-h-screen bg-[#07090F]">
      <ScaleFadeOut>
        <Hero />
      </ScaleFadeOut>
      <MarqueeSection />
      <ScaleFadeOut>
        <ProblemSolution />
      </ScaleFadeOut>
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
