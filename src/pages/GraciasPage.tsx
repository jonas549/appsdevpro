import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEOHead from '../components/SEOHead'

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4'

export default function GraciasPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as { name?: string } | null

  useEffect(() => {
    if (!state?.name) {
      navigate('/', { replace: true })
    }
  }, [state, navigate])

  if (!state?.name) return null

  const firstName = state.name.trim().split(' ')[0]

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#07090F]">
      <SEOHead
        title="Gracias | Apps Developers Pro"
        description="Hemos recibido tu mensaje. Te contactaremos con una propuesta técnica personalizada en menos de 48 horas."
        canonical="/gracias"
        noIndex={true}
      />
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        src={VIDEO_URL}
      />

      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(7,9,15,0.6) 0%, rgba(7,9,15,0.85) 100%)' }} />

      {/* Content */}
      <div className="relative z-10 text-center max-w-xl mx-auto px-6">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
          className="mx-auto mb-8 w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(67,97,238,0.15)', border: '2px solid rgba(67,97,238,0.4)' }}
        >
          <motion.span
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="material-symbols-outlined text-[#4361EE]"
            style={{ fontSize: 40 }}
          >
            check_circle
          </motion.span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-[13px] font-semibold tracking-[0.2em] uppercase text-[#4361EE] mb-3">
            Solicitud recibida
          </p>
          <h1 className="text-[36px] sm:text-[48px] font-bold leading-tight text-[#EDF0FF] mb-4">
            ¡Gracias, {firstName}!
          </h1>
          <p className="text-[16px] text-[#7B8DB0] leading-relaxed mb-8">
            Recibimos tu mensaje. Nuestro equipo lo revisará y te contactará con una propuesta técnica personalizada en menos de 48 horas.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.link/phjdep"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold text-white transition-all active:scale-[0.98]"
              style={{ background: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.3)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Escríbenos por WhatsApp
            </a>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold text-[#EDF0FF] border border-white/10 hover:bg-white/5 transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
              Volver al inicio
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
