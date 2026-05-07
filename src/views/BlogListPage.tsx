import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import SEOHead from "../components/SEOHead"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"

interface Post {
  id: string; title: string; slug: string; excerpt: string
  published: boolean; createdAt: string; featured_image?: string
}

const PAGE_SIZE = 9

export default function BlogListPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch("/api/blog")
      .then(r => r.json())
      .then((data: Post[]) => { setPosts(data.filter(p => p.published)); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
  }

  const totalPages = Math.ceil(posts.length / PAGE_SIZE)
  const paginated = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Blog | Apps Developers Pro"
        description="Ideas, casos de estudio y recursos sobre desarrollo de apps y tiendas Shopify."
        canonical="/blog"
      />
      {/* Header */}
      <div className="bg-[#07090F]">
        <Navbar />
        <div className="pt-28 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors">
              <span>←</span> Volver al inicio
            </Link>
            <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4">Blog</h1>
            <p className="text-white/60 text-lg">Ideas, casos de estudio y recursos sobre desarrollo Shopify.</p>
          </div>
        </div>
      </div>

      {/* Posts grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex justify-center py-20 text-slate-400">
            <span>Cargando...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">No hay artículos publicados todavía.</p>
            <Link to="/" className="mt-4 inline-block text-[#4361EE] hover:underline">Volver al inicio</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginated.map(post => (
                <article key={post.id} className="flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  {post.featured_image ? (
                    <Link to={`/blog/${post.slug}`} className="flex-shrink-0">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-52 object-cover"
                      />
                    </Link>
                  ) : (
                    <div className="w-full h-52 bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-slate-300 text-4xl font-bold">{post.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1 flex flex-col p-6">
                    <time className="text-slate-400 text-xs mb-2">{formatDate(post.createdAt)}</time>
                    <h2 className="text-slate-900 text-lg font-bold mb-3 leading-snug line-clamp-2">
                      <Link to={`/blog/${post.slug}`} className="hover:text-[#4361EE] transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-[#4361EE] font-semibold text-sm hover:gap-2.5 transition-all mt-auto"
                    >
                      Leer artículo <span>→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
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
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      n === page
                        ? "bg-[#4361EE] text-white"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
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
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
