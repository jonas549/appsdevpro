import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const navItems = ['Servicios', 'Apps', 'Proceso', 'Blog', 'FAQ']

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex flex-col items-center">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 sm:gap-6 md:gap-10 bg-[#07090F] border border-white/[0.06] rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8 md:py-3"
      >
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <img
            src="/logo-header.png"
            alt="Apps Developers Pro"
            className="h-7 md:h-8 w-auto"
          />
        </div>

        {/* Nav items — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-xs md:text-sm text-white hover:text-primary transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Hamburger — mobile only */}
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="md:hidden flex flex-col justify-center gap-[5px] p-1 flex-shrink-0"
        >
          <span className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-200 origin-center ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-200 ${open ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-5 h-[2px] bg-white rounded-full transition-all duration-200 origin-center ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>

        {/* CTA */}
        <a
          href="https://wa.link/phjdep"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-colors duration-200 flex-shrink-0"
        >
          Hablemos
          <ArrowRight size={14} />
        </a>
      </motion.div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden w-[calc(100%-2rem)] max-w-sm mt-2 bg-[#07090F] border border-white/[0.06] rounded-2xl overflow-hidden">
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="px-6 py-3.5 text-sm text-white/80 hover:text-white hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-0"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
