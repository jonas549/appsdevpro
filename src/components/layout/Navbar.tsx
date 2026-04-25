import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const navItems = ['Servicios', 'Apps', 'Proceso', 'Blog', 'FAQ']

export default function Navbar() {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex justify-center">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 sm:gap-6 md:gap-10 bg-[#07090F] border border-white/[0.06] rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8 md:py-3"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-[34px] h-[34px] rounded-lg bg-gradient-to-br from-accent to-[#3451D1] flex items-center justify-center text-white font-bold text-sm">
            AP
          </div>
          <span className="font-bold text-primary text-sm hidden sm:block">
            Apps<span className="text-accent">Dev</span>Pro
          </span>
        </div>

        {/* Nav items — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-xs md:text-sm text-[#7B8DB0] hover:text-primary transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#contacto"
          className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-colors duration-200 flex-shrink-0"
        >
          Hablemos
          <ArrowRight size={14} />
        </a>
      </motion.div>
    </div>
  )
}
