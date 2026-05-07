/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/src/components/layout/Footer'
import BlogPostFaq from '@/app/blog/[slug]/BlogPostFaq'

const SITE_URL = 'https://appsdeveloperspro.com'

function readingTime(content: string) {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function stripDangerous(html: string) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { title: true, excerpt: true, meta_title: true, meta_description: true, featured_image: true, createdAt: true, published: true },
    })
    if (!post || !post.published) return { robots: { index: false } }

    const title = post.meta_title || post.title
    const description = post.meta_description || post.excerpt
    const canonicalUrl = `${SITE_URL}/blog/${slug}`

    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        type: 'article',
        title: post.meta_title || post.title,
        description,
        url: canonicalUrl,
        publishedTime: post.createdAt.toISOString(),
        siteName: 'Apps Developers Pro',
        images: post.featured_image ? [{ url: post.featured_image, width: 1200, height: 630 }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.meta_title || post.title,
        description,
        images: post.featured_image ? [post.featured_image] : [],
      },
    }
  } catch {
    return {}
  }
}

export const dynamic = 'force-dynamic'

interface FaqItem { q: string; a: string }
interface FaqData { heading?: string; items: FaqItem[] }

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  let post: {
    id: string; title: string; slug: string; content: string; excerpt: string
    published: boolean; createdAt: Date; featured_image: string | null
    meta_title: string | null; meta_description: string | null; faq_data: string | null
  } | null = null

  try {
    post = await prisma.blogPost.findUnique({ where: { slug } })
  } catch {
    notFound()
  }

  if (!post || !post.published) notFound()

  let faqData: FaqData | null = null
  try {
    if (post.faq_data) faqData = JSON.parse(post.faq_data) as FaqData
  } catch { /* ignore */ }
  const faqItems = faqData?.items?.filter(f => f.q && f.a) ?? []

  const safeContent = stripDangerous(post.content)
  const createdIso = post.createdAt.toISOString()
  const dateStr = post.createdAt.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  const mins = readingTime(post.content)

  return (
    <div className="min-h-screen bg-white">
      {/* Dark header */}
      <div className="bg-[#07090F]">
        <Navbar />
        <div className="pt-28 pb-14 px-6">
          <div className="max-w-[720px] mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-8 transition-colors">
              <span>←</span> Blog
            </Link>
            <div className="flex items-center gap-3 mb-5">
              <time dateTime={createdIso} className="text-white/40 text-sm">{dateStr}</time>
              <span className="text-white/20">·</span>
              <span className="text-white/40 text-sm">{mins} min de lectura</span>
            </div>
            <h1 className="text-white text-3xl md:text-[2.75rem] font-bold tracking-tight leading-[1.15] mb-5">{post.title}</h1>
            <p className="text-white/60 text-lg leading-relaxed">{post.excerpt}</p>
          </div>
        </div>
      </div>

      {/* Light content */}
      <div className="bg-[#FAFBFC]">
        {post.featured_image && (
          <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
            <img src={post.featured_image} alt={post.title} className="w-full max-h-[480px] object-cover rounded-2xl shadow-2xl" />
          </div>
        )}

        <div className="max-w-[720px] mx-auto px-6 py-16">
          <style>{`
            .blog-body { font-family: Georgia, 'Times New Roman', serif; font-size: 19px; line-height: 1.78; color: #1A1A1A; }
            .blog-body h1,.blog-body h2,.blog-body h3,.blog-body h4 { font-family: 'DM Sans', sans-serif; color: #0F172A; margin-top: 2.25rem; margin-bottom: 0.875rem; line-height: 1.2; font-weight: 700; }
            .blog-body h1 { font-size: 2rem; } .blog-body h2 { font-size: 1.6rem; } .blog-body h3 { font-size: 1.3rem; } .blog-body h4 { font-size: 1.1rem; font-weight: 600; }
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

          <article className="blog-body" dangerouslySetInnerHTML={{ __html: safeContent }} />

          {faqItems.length > 0 && (
            <BlogPostFaq items={faqItems} heading={faqData?.heading} />
          )}

          <div className="mt-16 pt-8 border-t border-slate-200">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[#4361EE] font-semibold hover:gap-3 transition-all" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <span>←</span> Volver al blog
            </Link>
          </div>
        </div>
      </div>

      <Footer />

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
