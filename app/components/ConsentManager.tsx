'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ADS_ID, CONSENT_CHANGE_EVENT, CONSENT_OPEN_EVENT, GA_ID,
  readConsent, saveConsent, type Consent,
} from '@/app/lib/consent'

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

// Lo que ya se ha cargado en esta página (sobrevive a la navegación cliente).
const loaded = { gtag: false, ga: false, ads: false, pixel: false }

function ensureGtag() {
  if (loaded.gtag) return
  loaded.gtag = true
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // gtag.js exige el objeto `arguments`, no un array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  // Consent Mode v2: todo denegado por defecto, luego se concede lo aceptado.
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
  window.gtag('js', new Date())
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(s)
}

function loadPixel() {
  if (loaded.pixel || !PIXEL_ID) return
  loaded.pixel = true
  const script = document.createElement('script')
  script.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`
  document.head.appendChild(script)
}

function apply(c: Consent) {
  if (!c.analytics && !c.ads) return
  ensureGtag()
  const g = (v: boolean) => (v ? 'granted' : 'denied')
  window.gtag!('consent', 'update', {
    analytics_storage: g(c.analytics),
    ad_storage: g(c.ads),
    ad_user_data: g(c.ads),
    ad_personalization: g(c.ads),
  })
  if (c.analytics && !loaded.ga) { loaded.ga = true; window.gtag!('config', GA_ID) }
  if (c.ads && !loaded.ads) { loaded.ads = true; window.gtag!('config', ADS_ID) }
  if (c.ads) loadPixel()
}

// Al retirar un consentimiento: borrar las cookies de terceros y recargar,
// porque un script ya cargado no se puede descargar.
function revoke() {
  // Primero se deniega: si no, gtag vuelve a escribir _ga_* al descargar la página.
  window.gtag?.('consent', 'update', {
    analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  })
  window.fbq?.('consent', 'revoke')
  const host = location.hostname
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]
  for (const name of document.cookie.split(';').map(c => c.split('=')[0].trim())) {
    if (!/^(_ga|_gid|_gcl|_fbp|_fbc)/.test(name)) continue
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`
  }
  location.reload()
}

const BTN = 'min-h-[44px] rounded-xl px-5 text-[15px] font-semibold transition-colors duration-200'

export default function ConsentManager() {
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [ads, setAds] = useState(false)

  useEffect(() => {
    const c = readConsent()
    if (c) apply(c)
    // localStorage sólo existe en el cliente: el aviso no puede decidirse en el render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else setOpen(true)

    const onOpen = () => {
      const cur = readConsent()
      setAnalytics(cur?.analytics ?? false)
      setAds(cur?.ads ?? false)
      setPrefs(true)
      setOpen(true)
    }
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen)
  }, [])

  function choose(a: boolean, d: boolean) {
    const prev = readConsent()
    saveConsent(a, d) // el listener de CONSENT_CHANGE_EVENT aplica la elección
    setOpen(false)
    setPrefs(false)
    if ((prev?.analytics && !a) || (prev?.ads && !d)) revoke()
  }

  useEffect(() => {
    // Aplica cada elección guardada (desde este banner o cualquier otro sitio).
    const onChange = (e: Event) => apply((e as CustomEvent<Consent>).detail)
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange)
  }, [])

  if (!open) return null

  const shell = 'fixed z-[90] overflow-y-auto border border-white/10 bg-[#0D1117]/95 text-sm leading-snug text-[#CBD5E1] shadow-[0_24px_60px_rgba(0,0,0,.55)] backdrop-blur-xl'
  const text = (
    <>
      <strong className="font-semibold text-white">Cookies.</strong> Usamos cookies de Google y Meta para medir las visitas y saber qué anuncios
      funcionan. Solo se activan si las aceptas.{' '}
      <Link href="/privacidad#cookies" className="text-white underline underline-offset-2">Más información</Link>
    </>
  )
  const reject = (
    <button type="button" onClick={() => choose(false, false)} className={`${BTN} border border-white/20 bg-white/[0.06] text-white hover:bg-white/[0.12]`}>
      Rechazar
    </button>
  )
  const accept = (
    <button type="button" onClick={() => choose(true, true)} className={`${BTN} border border-white/20 bg-white/[0.06] text-white hover:bg-white/[0.12]`}>
      Aceptar
    </button>
  )

  // Primera capa: compacta. En móvil, tarjeta abajo; en escritorio, una barra
  // fina que no tapa el hero (precios y formulario quedan a la vista).
  if (!prefs) {
    return (
      <div
        role="dialog"
        aria-label="Preferencias de cookies"
        className={`${shell} inset-x-3 bottom-3 max-h-[calc(100dvh-24px)] rounded-2xl p-4 min-[860px]:inset-x-6 min-[860px]:bottom-4 min-[860px]:flex min-[860px]:items-center min-[860px]:gap-6 min-[860px]:px-6 min-[860px]:py-3`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <p className="mb-3 min-[860px]:mb-0 min-[860px]:flex-1">{text}</p>
        <div className="grid grid-cols-2 gap-2 min-[860px]:flex min-[860px]:shrink-0 min-[860px]:items-center">
          <button type="button" onClick={() => setPrefs(true)} className="order-last col-span-2 min-h-[40px] px-3 text-[#94A3B8] underline underline-offset-2 hover:text-white min-[860px]:order-first min-[860px]:min-h-[44px]">
            Elegir cuáles
          </button>
          {reject}
          {accept}
        </div>
      </div>
    )
  }

  return (
    <div
      role="dialog"
      aria-label="Preferencias de cookies"
      className={`${shell} inset-x-3 bottom-3 max-h-[calc(100dvh-24px)] rounded-2xl p-5 min-[860px]:left-6 min-[860px]:right-auto min-[860px]:bottom-6 min-[860px]:w-[480px]`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <p className="mb-4">{text}</p>
      <div className="mb-4 grid gap-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold text-white">Necesarias</span>
            <span className="text-[13px] text-[#64748B]">Siempre activas</span>
          </div>
          <p className="mt-1 text-[13px] text-[#94A3B8]">Guardan esta elección. No usan cookies de terceros.</p>
        </div>
        {([
          ['Analítica', 'Google Analytics: cuántas personas visitan y qué páginas ven.', analytics, setAnalytics],
          ['Publicidad', 'Google Ads y Meta: medir qué anuncios traen contactos.', ads, setAds],
        ] as const).map(([t, d, v, set]) => (
          <label key={t} className="block cursor-pointer rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="flex items-center justify-between gap-3">
              <span className="font-semibold text-white">{t}</span>
              <input type="checkbox" checked={v} onChange={e => set(e.target.checked)} className="h-5 w-5 accent-[#4361EE]" />
            </span>
            <span className="mt-1 block text-[13px] text-[#94A3B8]">{d}</span>
          </label>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {reject}
        {accept}
        <button type="button" onClick={() => choose(analytics, ads)} className={`${BTN} col-span-2 bg-[#4361EE] text-white hover:bg-[#5470F0]`}>
          Guardar mi selección
        </button>
      </div>
    </div>
  )
}
