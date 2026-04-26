import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Navbar from '../layout/Navbar'
import WordsPullUp from '../animations/WordsPullUp'
import { useContent } from '../../lib/ContentContext'

export default function Hero() {
  const c = useContent('hero')
  const line1 = c.heading_line1 || 'Desarrollo de Apps y tiendas'
  const line2 = c.heading_line2 || 'Shopify'
  const desc  = c.description  || 'Desde apps publicadas en el App Store hasta integraciones a medida con tu ERP o CRM.'
  const cta   = c.cta_label    || 'Solicitar propuesta'
  const href  = c.cta_href     || '#contacto'
  const video = c.video_url    || 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4'

  return (
    <section className="h-screen p-4 md:p-6">
      <div className="relative h-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-[#07090F]">
        <video src={video} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
        <div className="noise-overlay opacity-[0.07] mix-blend-overlay pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10 pointer-events-none" />
        <Navbar />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-8 pb-6 md:pb-10">
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 md:col-span-8">
              <h1 className="select-none" style={{ fontSize: '70px', fontWeight: 800, lineHeight: '0.9', letterSpacing: '-0.04em' }}>
                <WordsPullUp text={line1} wordClassName="text-[#EDF0FF]" stagger={0.08} />
                <br />
                <WordsPullUp text={line2} wordClassName="text-[#4361EE]" stagger={0.08} delay={0.18} />
              </h1>
            </div>
            <div className="col-span-12 md:col-span-4 flex flex-col gap-4 md:pb-2">
              <motion.p
                className="text-xs sm:text-sm md:text-base"
                style={{ lineHeight: 1.2, color: '#FFFFFF' }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {desc}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <a
                  href={href}
                  className="group inline-flex items-center gap-2 hover:gap-3 transition-all duration-300 bg-[#4361EE] rounded-full pl-5 pr-1.5 py-1.5"
                >
                  <span className="text-white font-medium text-sm sm:text-base whitespace-nowrap">{cta}</span>
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
