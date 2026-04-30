import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

interface Post {
  id: string; title: string; slug: string; excerpt: string
  published: boolean; createdAt: string; featured_image?: string
}

function readingTime(content: string) {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/blog")
      .then(r => r.json())
      .then((data: Post[]) => { setPosts(data.filter(p => p.published)); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#07090F] pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors">
            <span>←</span> Volver al inicio
          </Link>
          <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4">Blog</h1>
          <p className="text-white/60 text-lg">Ideas, casos de estudio y recursos sobre desarrollo Shopify.</p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="max-w-4xl mx-auto px-6 py-16">
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
          <div className="grid gap-10">
            {posts.map((post, i) => (
              <article key={post.id} className={`flex flex-col md:flex-row gap-8 ${i > 0 ? "pt-10 border-t border-slate-100" : ""}`}>
                {post.featured_image && (
                  <Link to={`/blog/${post.slug}`} className="flex-shrink-0 md:w-64">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-48 md:h-40 object-cover rounded-xl"
                    />
                  </Link>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <time className="text-slate-500 text-sm">{formatDate(post.createdAt)}</time>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500 text-sm">{readingTime(post.excerpt)} min de lectura</span>
                  </div>
                  <h2 className="text-slate-900 text-xl md:text-2xl font-bold mb-3 leading-snug">
                    <Link to={`/blog/${post.slug}`} className="hover:text-[#4361EE] transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-[#4361EE] font-semibold text-sm hover:gap-2.5 transition-all"
                  >
                    Leer artículo <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
