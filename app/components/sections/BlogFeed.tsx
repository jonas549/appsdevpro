'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { useContent, getFieldStyle } from "@/src/lib/ContentContext"
import { safeHtml } from "@/src/lib/safe-html"

interface Post {
  id: string; title: string; slug: string; excerpt: string
  published: boolean; createdAt: string; featured_image?: string
}

export default function BlogFeed() {
  const c = useContent('blog_feed')
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    fetch("/api/blog")
      .then(r => r.json())
      .then((data: Post[]) => {
        setPosts(data.filter(p => p.published).slice(0, 3))
      })
      .catch(() => {})
  }, [])

  if (posts.length === 0) return null

  const heading    = c.heading    || "Últimas del blog"
  const subheading = c.subheading || ""
  const videoUrl   = c.video_url  || ""

  const headingStyle    = getFieldStyle(c.heading_size,    c.heading_px,    c.heading_color)
  const subheadingStyle = getFieldStyle(c.subheading_size, c.subheading_px, c.subheading_color)

  return (
    <section id="blog" className="py-24 bg-[#07090F] relative overflow-hidden">
      {videoUrl && (
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
          src={videoUrl}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-white text-3xl md:text-4xl font-bold" style={headingStyle}>
            {heading}
          </h2>
          <Link href="/blog" className="text-white hover:text-white/70 text-sm font-medium transition-colors flex-shrink-0 ml-8">
            Ver todos →
          </Link>
        </div>

        {subheading && (
          <p
            className="text-white/70 text-lg mb-10 [&_strong]:text-white [&_strong]:font-semibold"
            style={subheadingStyle}
            dangerouslySetInnerHTML={{ __html: safeHtml(subheading) }}
          />
        )}
        {!subheading && <div className="mb-10" />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-white/[0.04] border border-white/[0.15] rounded-2xl overflow-hidden group hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/40 transition-all duration-200"
            >
              {post.featured_image ? (
                <img src={post.featured_image} alt={post.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-white/5 flex items-center justify-center">
                  <span className="text-white/20 text-5xl font-bold">{post.title.charAt(0)}</span>
                </div>
              )}
              <div className="p-6">
                <p className="text-white/50 text-xs mb-2">
                  {new Date(post.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <h3 className="text-white font-bold text-lg mb-3 leading-snug line-clamp-2 group-hover:text-[#4361EE] transition-colors">{post.title}</h3>
                <p className="text-white/[0.85] text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                <span className="text-white text-sm font-semibold group-hover:text-[#4361EE] transition-colors">Leer más →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
