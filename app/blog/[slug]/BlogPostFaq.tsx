'use client'

import { useState } from 'react'

interface FaqItem { q: string; a: string }

export default function BlogPostFaq({ items, heading }: { items: FaqItem[]; heading?: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="mt-16 pt-12 border-t border-slate-200">
      <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.5rem' }}>
        {heading || 'Preguntas frecuentes'}
      </h2>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
            >
              <span className="font-semibold text-slate-900 pr-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.q}</span>
              <span className={`text-slate-400 transition-transform duration-200 flex-shrink-0 text-lg ${openFaq === i ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {openFaq === i && (
              <div className="px-6 pb-5 text-slate-600 leading-relaxed bg-slate-50 text-[17px]">{item.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
