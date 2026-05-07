/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next'
import GraciasClient from './GraciasClient'

export const metadata: Metadata = {
  title: 'Gracias | Apps Developers Pro',
  description: 'Hemos recibido tu mensaje. Te contactaremos con una propuesta técnica personalizada en menos de 48 horas.',
  robots: { index: false, follow: false },
}

export default function GraciasPage() {
  return <GraciasClient />
}
