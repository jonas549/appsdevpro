import { useEffect, useState } from "react"
import { useParams, Link, Navigate } from "react-router-dom"
import DOMPurify from "dompurify"
import SEOHead from "../components/SEOHead"

interface Post {
  id: string; title: string; slug: string; content: string; excerpt: string
  published: boolean; createdAt: string; featured_image?: string
  meta_title?: string; meta_description?: string; faq_data?: string
}

interface FaqItem { q: string; a: string }
interface FaqData { heading?: string; items: FaqItem[] }

function readingTime(content: string) {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/blog/slug/${slug}`)
      .then(r => { if (!r.ok) throw new Error("not found"); return r.json() })
      .then((data: Post) => { if (!data.published) { setNotFound(true); return } setPost(data); setLoading(false) })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [slug])

  if (notFound) return <Navigate to="/blog" replace />

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-400">
        <span>Cargando...</span>
      </div>
    )
  }

  if (!post) return null

  let faqData: FaqData | null = null
  try {
    if (post.faq_data) faqData = JSON.parse(post.faq_data) as FaqData
  } catch { /* ignore */ }
  const faqItems = faqData?.items?.filter(f => f.q && f.a) ?? []

  const safeContent = DOMPurify.sanitize(post.content, {
    ADD_TAGS: ["iframe", "blockquote"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling", "data-video-id", "cite", "class", "style"],
  })

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`${post.meta_title || post.title} | Apps Developers Pro`}
        description={post.meta_description || post.excerpt}
        canonical={`/blog/${post.slug}`}
        ogImage={post.featured_image}
        ogType="article"
        publishedTime={post.createdAt}
      />
      {/* Hero */}
      <div className="bg-[#07090F] pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors">
            <span>←</span> Volver al blog
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <time className="text-white/50 text-sm">
              {new Date(post.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
            </time>
            <span className="text-white/30">·</span>
            <span className="text-white/50 text-sm">{readingTime(post.content)} min de lectura</span>
          </div>
          <h1 className="text-white text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-6">{post.title}</h1>
          <p className="text-white/70 text-lg leading-relaxed">{post.excerpt}</p>
        </div>
      </div>

      {/* Featured image */}
      {post.featured_image && (
        <div className="max-w-4xl mx-auto px-6 -mt-8">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full max-h-[480px] object-cover rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div
          className="prose prose-slate prose-lg max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
            prose-a:text-[#4361EE] prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-md
            prose-blockquote:border-l-4 prose-blockquote:border-slate-200 prose-blockquote:text-slate-500"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />

        {/* FAQ accordion */}
        {faqItems.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">{faqData?.heading || "Preguntas frecuentes"}</h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-900 pr-4">{item.q}</span>
                    <span className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${openFaq === i ? "rotate-180" : ""}`}>▾</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-slate-600 leading-relaxed bg-slate-50">{item.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-slate-100">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#4361EE] font-semibold hover:gap-3 transition-all"
          >
            <span>←</span> Volver al blog
          </Link>
        </div>
      </div>

      {/* FAQPage structured data */}
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map(f => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": { "@type": "Answer", "text": f.a },
            })),
          }) }}
        />
      )}
    </div>
  )
}
