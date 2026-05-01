import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useContent, getFieldStyle } from '../../lib/ContentContext'
import { safeHtml } from '../../lib/safe-html'

const PHONE_CODES = [
  { code: '+52', flag: '🇲🇽', label: 'MX' },
  { code: '+1',  flag: '🇺🇸', label: 'US' },
  { code: '+54', flag: '🇦🇷', label: 'AR' },
  { code: '+57', flag: '🇨🇴', label: 'CO' },
  { code: '+51', flag: '🇵🇪', label: 'PE' },
  { code: '+56', flag: '🇨🇱', label: 'CL' },
  { code: '+34', flag: '🇪🇸', label: 'ES' },
]

const BUDGET_OPTIONS = [
  'Menos de $5,000 USD',
  '$5,000 – $15,000 USD',
  '$15,000 – $30,000 USD',
  'Más de $30,000 USD',
  'Aún no lo sé',
]

type Status = 'idle' | 'sending' | 'error'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } }),
}

export default function ContactForm() {
  const c = useContent('contactform')
  const navigate = useNavigate()

  const heading    = c.heading    || 'Cuéntanos tu proyecto'
  const subheading = c.subheading || 'Respondemos en menos de 48 horas con una propuesta técnica personalizada.'
  const btnLabel   = c.btn_label  || 'Enviar solicitud'

  const headingStyle    = getFieldStyle(c.heading_size,    c.heading_px,    c.heading_color)
  const subheadingStyle = getFieldStyle(c.subheading_size, c.subheading_px, c.subheading_color)

  const [form, setForm] = useState({
    name: '', email: '', phone_code: '+52', phone: '', company: '', budget: '', message: '',
  })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function set(key: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    setStatus('sending')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        setErrorMsg(data.error || 'Error al enviar')
        setStatus('error')
        return
      }
      navigate('/gracias', { state: { name: form.name } })
    } catch {
      setErrorMsg('Error de conexión. Intenta de nuevo.')
      setStatus('error')
    }
  }

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-[#EDF0FF] placeholder:text-[#7B8DB0] focus:outline-none focus:border-[#4361EE] focus:bg-white/10 transition-all"
  const labelCls = "block text-[11px] font-semibold uppercase tracking-wider text-[#7B8DB0] mb-1.5"

  return (
    <section id="contacto" className="relative py-24 overflow-hidden" style={{ background: '#07090F' }}>
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#EDF0FF 1px, transparent 1px), linear-gradient(90deg, #EDF0FF 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — copy */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="lg:sticky lg:top-28"
          >
            <motion.div custom={0} variants={fadeUp}>
              <span className="inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-[#4361EE] mb-4">
                Contacto
              </span>
            </motion.div>
            <motion.h2
              custom={1}
              variants={fadeUp}
              className="font-bold leading-tight mb-4"
              style={headingStyle}
              dangerouslySetInnerHTML={safeHtml(heading)}
            />
            <motion.p
              custom={2}
              variants={fadeUp}
              className="leading-relaxed mb-8"
              style={subheadingStyle}
              dangerouslySetInnerHTML={safeHtml(subheading)}
            />

            {/* Trust signals */}
            <motion.div custom={3} variants={fadeUp} className="space-y-3">
              {[
                { icon: 'bolt', text: 'Respuesta técnica en menos de 48 h' },
                { icon: 'verified',  text: 'Propuesta gratuita sin compromiso' },
                { icon: 'language',  text: 'Atención en español e inglés' },
              ].map(item => (
                <div key={item.icon} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(67,97,238,0.12)' }}>
                    <span className="material-symbols-outlined text-[#4361EE]" style={{ fontSize: 16 }}>{item.icon}</span>
                  </div>
                  <span className="text-[13px] text-[#7B8DB0]">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Nombre *</label>
                    <input
                      required
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder="Tu nombre"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="tu@empresa.com"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className={labelCls}>Teléfono *</label>
                  <div className="flex gap-2">
                    <select
                      value={form.phone_code}
                      onChange={e => set('phone_code', e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-[13px] text-[#EDF0FF] focus:outline-none focus:border-[#4361EE] transition-all cursor-pointer flex-shrink-0"
                    >
                      {PHONE_CODES.map(p => (
                        <option key={p.code} value={p.code} style={{ background: '#0F1117' }}>
                          {p.flag} {p.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                      placeholder="55 1234 5678"
                      className={`${inputCls} flex-1`}
                    />
                  </div>
                </div>

                {/* Company + Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Empresa</label>
                    <input
                      value={form.company}
                      onChange={e => set('company', e.target.value)}
                      placeholder="Nombre de tu empresa"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Presupuesto aproximado</label>
                    <select
                      value={form.budget}
                      onChange={e => set('budget', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-[#EDF0FF] focus:outline-none focus:border-[#4361EE] transition-all cursor-pointer appearance-none"
                    >
                      <option value="" style={{ background: '#0F1117' }}>Seleccionar...</option>
                      {BUDGET_OPTIONS.map(o => (
                        <option key={o} value={o} style={{ background: '#0F1117' }}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className={labelCls}>Cuéntanos tu proyecto *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    placeholder="¿Qué necesitas construir? ¿Tienes una Shopify store? ¿Integraciones con ERP, WMS...?"
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {errorMsg && (
                  <p className="text-red-400 text-[13px] flex items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-3.5 rounded-xl text-[14px] font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: '#4361EE', boxShadow: '0 4px 24px rgba(67,97,238,0.35)' }}
                >
                  {status === 'sending' ? (
                    <>
                      <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>progress_activity</span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
                      {btnLabel}
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-[#7B8DB0]">
                  Al enviar aceptas que guardemos tu información para responderte.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
