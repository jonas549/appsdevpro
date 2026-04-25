import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Navbar from '../layout/Navbar'
import WordsPullUp from '../animations/WordsPullUp'

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4'

export default function Hero() {
  return (
    <section className="h-screen p-4 md:p-6">
      <div className="relative h-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-[#07090F]">

        {/* Background video */}
        <video
          src={HERO_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Noise overlay */}
        <div className="noise-overlay opacity-[0.07] mix-blend-overlay pointer-events-none z-10" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10 pointer-events-none" />

        {/* Navbar */}
        <Navbar />

        {/* Hero content — bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-8 pb-6 md:pb-10">
          <div className="grid grid-cols-12 gap-4 items-end">

            {/* Heading — 8 cols */}
            <div className="col-span-12 md:col-span-8">
              <h1 className="select-none" style={{ fontSize: '70px', fontWeight: 800, lineHeight: '0.9', letterSpacing: '-0.04em' }}>
                <WordsPullUp
                  text="Desarrollo de Apps y tiendas"
                  wordClassName="text-[#EDF0FF]"
                  stagger={0.08}
                />
                <br />
                <WordsPullUp
                  text="Shopify"
                  wordClassName="text-[#4361EE]"
                  stagger={0.08}
                  delay={0.18}
                />
              </h1>
            </div>

            {/* Right column — 4 cols */}
            <div className="col-span-12 md:col-span-4 flex flex-col gap-4 md:pb-2">
              <motion.p
                className="text-xs sm:text-sm md:text-base"
                style={{ lineHeight: 1.2, color: '#FFFFFF' }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                Desde apps publicadas en el App Store hasta integraciones a medida con tu ERP o CRM.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <a
                  href="#contacto"
                  className="group inline-flex items-center gap-2 hover:gap-3 transition-all duration-300 bg-[#4361EE] rounded-full pl-5 pr-1.5 py-1.5"
                >
                  <span className="text-white font-medium text-sm sm:text-base whitespace-nowrap">
                    Solicitar propuesta
                  </span>
                  <span className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <ArrowRight size={16} style={{ color: '#EDF0FF' }} />
                  </span>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
