'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Post {
  id: string; title: string; slug: string; excerpt: string
  published: boolean; createdAt: string; featured_image: string | null
}

const PAGE_SIZE = 9

export default function BlogListClient({ posts }: { posts: Post[] }) {
  const [page, setPage] = useState(1)

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
  }

  const totalPages = Math.ceil(posts.length / PAGE_SIZE)
  const paginated = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400 max-w-7xl mx-auto px-6">
        <p className="text-lg">No hay artículos publicados todavía.</p>
        <Link href="/" className="mt-4 inline-block text-[#4361EE] hover:underline">Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginated.map(post => (
          <article key={post.id} className="flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {post.featured_image ? (
              <Link href={`/blog/${post.slug}`} className="flex-shrink-0">
                <img src={post.featured_image} alt={post.title} className="w-full h-52 object-cover" />
              </Link>
            ) : (
              <div className="w-full h-52 bg-slate-100 flex items-center justify-center flex-shrink-0">
                <span className="text-slate-300 text-4xl font-bold">{post.title.charAt(0)}</span>
              </div>
            )}
            <div className="flex-1 flex flex-col p-6">
              <time className="text-slate-400 text-xs mb-2">{formatDate(post.createdAt)}</time>
              <h2 className="text-slate-900 text-lg font-bold mb-3 leading-snug line-clamp-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-[#4361EE] transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1.5 text-[#4361EE] font-semibold text-sm hover:gap-2.5 transition-all mt-auto"
              >
                Leer artículo <span>→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-16">
          <button
            onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${n === page ? "bg-[#4361EE] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
