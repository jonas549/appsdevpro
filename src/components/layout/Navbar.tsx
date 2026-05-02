import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const navItems = ['Inicio', 'Servicios', 'Apps', 'Proceso', 'Blog', 'FAQ']

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleAnchorClick(e: React.MouseEvent, section: string, onDone?: () => void) {
    e.preventDefault()
    if (location.pathname === '/') {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/#${section}`)
    }
    onDone?.()
  }

  const glassClass = scrolled
    ? 'bg-[rgba(7,9,15,0.85)] backdrop-blur-[12px] border-b border-white/[0.05]'
    : 'bg-transparent'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${glassClass}`}>
      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img src="/logo-header.png" alt="Apps Developers Pro" className="h-7 md:h-8 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          {navItems.map(item => {
            const cls = "text-sm text-white hover:text-primary transition-colors duration-200"
            if (item === 'Inicio') return <Link key={item} to="/" className={cls}>{item}</Link>
            if (item === 'Blog')   return <Link key={item} to="/blog" className={cls}>{item}</Link>
            return (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={e => handleAnchorClick(e, item.toLowerCase())}
                className={cls}
              >
                {item}
              </a>
            )
          })}
        </nav>

        {/* Desktop CTA */}
        <a
          href="https://wa.link/phjdep"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors duration-200 flex-shrink-0"
        >
          Hablemos
          <ArrowRight size={14} />
        </a>

        {/* Mobile hamburger */}
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
      </div>

      {/* Mobile CTA row — hidden when dropdown is open */}
      {!open && (
        <div className="md:hidden flex justify-center pb-2 px-4">
          <a
            href="https://wa.link/phjdep"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors duration-200"
          >
            Hablemos
            <ArrowRight size={14} />
          </a>
        </div>
      )}

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden mx-4 mb-2 bg-[#07090F] border border-white/[0.06] rounded-2xl overflow-hidden">
          <nav className="flex flex-col">
            {navItems.map(item => {
              const cls = "block px-6 py-3.5 text-sm text-white/80 hover:text-white hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-0"
              if (item === 'Inicio') return <Link key={item} to="/" onClick={() => setOpen(false)} className={cls}>{item}</Link>
              if (item === 'Blog')   return <Link key={item} to="/blog" onClick={() => setOpen(false)} className={cls}>{item}</Link>
              return (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={e => handleAnchorClick(e, item.toLowerCase(), () => setOpen(false))}
                  className={cls}
                >
                  {item}
                </a>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
