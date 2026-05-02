import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: (...args: unknown[]) => void
  }
}

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  window.fbq?.('track', eventName, params)
}

export default function MetaPixel() {
  const { pathname, search } = useLocation()

  // Initialize the Meta Pixel base code once on mount
  useEffect(() => {
    if (window.fbq) return
    const script = document.createElement('script')
    // Exact standard base code from Meta — must stay as string to preserve the fbq object shape
    script.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');`
    document.head.appendChild(script)
  }, [])

  // Fire PageView on every route change (including initial load)
  useEffect(() => {
    window.fbq?.('track', 'PageView')
  }, [pathname, search])

  return null
}
