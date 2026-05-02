import { useEffect, useState } from "react"
import { useParams, Link, Navigate } from "react-router-dom"
import DOMPurify from "dompurify"
import SEOHead from "../components/SEOHead"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"

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
      <div className="min-h-screen bg-[#07090F] flex items-center justify-center text-white/40">
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

      {/* Dark header zone */}
      <div className="bg-[#07090F]">
        <Navbar />
        <div className="pt-24 pb-14 px-6">
          <div className="max-w-[720px] mx-auto">
            <Link to="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-8 transition-colors">
              <span>←</span> Blog
            </Link>
            <div className="flex items-center gap-3 mb-5">
              <time className="text-white/40 text-sm">
                {new Date(post.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
              </time>
              <span className="text-white/20">·</span>
              <span className="text-white/40 text-sm">{readingTime(post.content)} min de lectura</span>
            </div>
            <h1 className="text-white text-3xl md:text-[2.75rem] font-bold tracking-tight leading-[1.15] mb-5">{post.title}</h1>
            <p className="text-white/60 text-lg leading-relaxed">{post.excerpt}</p>
          </div>
        </div>
      </div>

      {/* Light content zone */}
      <div className="bg-[#FAFBFC]">
        {/* Featured image — bridges dark→light */}
        {post.featured_image && (
          <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full max-h-[480px] object-cover rounded-2xl shadow-2xl"
            />
          </div>
        )}

        <div className="max-w-[720px] mx-auto px-6 py-16">
          {/* Editorial body styles */}
          <style>{`
            .blog-body { font-family: Georgia, 'Times New Roman', serif; font-size: 19px; line-height: 1.78; color: #1A1A1A; }
            .blog-body h1,.blog-body h2,.blog-body h3,.blog-body h4 { font-family: 'DM Sans', sans-serif; color: #0F172A; margin-top: 2.25rem; margin-bottom: 0.875rem; line-height: 1.2; font-weight: 700; }
            .blog-body h1 { font-size: 2rem; }
            .blog-body h2 { font-size: 1.6rem; }
            .blog-body h3 { font-size: 1.3rem; }
            .blog-body h4 { font-size: 1.1rem; font-weight: 600; }
            .blog-body p { margin-bottom: 1.5rem; }
            .blog-body a { color: #4361EE; text-decoration: underline; text-underline-offset: 3px; }
            .blog-body a:hover { color: #3451D1; }
            .blog-body strong { font-weight: 700; color: #0F172A; }
            .blog-body ul { list-style: disc; padding-left: 1.75rem; margin-bottom: 1.5rem; }
            .blog-body ol { list-style: decimal; padding-left: 1.75rem; margin-bottom: 1.5rem; }
            .blog-body li { margin-bottom: 0.5rem; }
            .blog-body blockquote { border-left: 4px solid #4361EE; background: #EEF1FF; padding: 1rem 1.5rem; margin: 2rem 0; border-radius: 0 0.5rem 0.5rem 0; }
            .blog-body blockquote p { color: #334155; font-style: italic; margin-bottom: 0; }
            .blog-body code { background: #F1F5F9; color: #334155; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.875em; font-family: 'JetBrains Mono', monospace; }
            .blog-body pre { background: #0F172A; color: #E2E8F0; padding: 1.5rem; border-radius: 0.75rem; overflow-x: auto; margin: 2rem 0; line-height: 1.6; }
            .blog-body pre code { background: none; color: inherit; padding: 0; font-size: 0.875rem; }
            .blog-body img { border-radius: 0.75rem; max-width: 100%; margin: 2rem 0; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
            .blog-body iframe { width: 100%; border-radius: 0.75rem; margin: 1.5rem 0; }
            .blog-body hr { border: none; border-top: 1px solid #E2E8F0; margin: 2.5rem 0; }
          `}</style>

          <article
            className="blog-body"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />

          {/* FAQ accordion */}
          {faqItems.length > 0 && (
            <div className="mt-16 pt-12 border-t border-slate-200">
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "#0F172A", marginBottom: "1.5rem" }}>
                {faqData?.heading || "Preguntas frecuentes"}
              </h2>
              <div className="space-y-2">
                {faqItems.map((item, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-semibold text-slate-900 pr-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.q}</span>
                      <span className={`text-slate-400 transition-transform duration-200 flex-shrink-0 text-lg ${openFaq === i ? "rotate-180" : ""}`}>▾</span>
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-5 text-slate-600 leading-relaxed bg-slate-50 text-[17px]">{item.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-slate-200">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[#4361EE] font-semibold hover:gap-3 transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <span>←</span> Volver al blog
            </Link>
          </div>
        </div>
      </div>

      <Footer />

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
