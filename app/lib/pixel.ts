export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    (window as Window & { fbq?: (...args: unknown[]) => void }).fbq?.('track', eventName, params)
  }
}
