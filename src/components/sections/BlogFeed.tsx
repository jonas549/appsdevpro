import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useContent, getFieldStyle } from "../../lib/ContentContext"

interface Post {
  id: string; title: string; slug: string; excerpt: string
  published: boolean; createdAt: string; featured_image?: string
}

export default function BlogFeed() {
  const c = useContent('blog_feed')
  const [posts, setPosts] = useState<Post[]>([])
  const dragRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

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

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    startX.current = e.pageX - (dragRef.current?.offsetLeft ?? 0)
    scrollLeft.current = dragRef.current?.scrollLeft ?? 0
    if (dragRef.current) dragRef.current.style.cursor = "grabbing"
  }
  const stopDrag = () => {
    isDragging.current = false
    if (dragRef.current) dragRef.current.style.cursor = "grab"
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !dragRef.current) return
    e.preventDefault()
    const x = e.pageX - dragRef.current.offsetLeft
    dragRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.5
  }

  return (
    <section id="blog" className="py-24 bg-[#07090F] relative overflow-hidden">
      {/* Optional video background */}
      {videoUrl && (
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
          src={videoUrl}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-4">
          <h2
            className="text-white text-3xl md:text-4xl font-bold"
            style={headingStyle}
          >
            {heading}
          </h2>
          <Link
            to="/blog"
            className="text-white/60 hover:text-white text-sm font-medium transition-colors flex-shrink-0 ml-8"
          >
            Ver todos →
          </Link>
        </div>

        {subheading && (
          <p className="text-white/60 text-lg mb-10" style={subheadingStyle}>{subheading}</p>
        )}

        {!subheading && <div className="mb-10" />}

        <div
          ref={dragRef}
          className="flex gap-6 overflow-x-auto pb-4 select-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", cursor: "grab" }}
          onMouseDown={onMouseDown}
          onMouseLeave={stopDrag}
          onMouseUp={stopDrag}
          onMouseMove={onMouseMove}
        >
          {posts.map(post => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              draggable={false}
              className="flex-shrink-0 w-80 bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden group hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/40 transition-all duration-200"
              onClick={e => {
                if (isDragging.current && Math.abs((dragRef.current?.scrollLeft ?? 0) - scrollLeft.current) > 5) e.preventDefault()
              }}
            >
              {post.featured_image ? (
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-48 bg-white/5 flex items-center justify-center">
                  <span className="text-white/20 text-5xl font-bold">{post.title.charAt(0)}</span>
                </div>
              )}
              <div className="p-6">
                <p className="text-white/40 text-xs mb-2">
                  {new Date(post.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <h3 className="text-white font-bold text-lg mb-3 leading-snug line-clamp-2 group-hover:text-[#4361EE] transition-colors">{post.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                <span className="text-[#4361EE] text-sm font-semibold group-hover:underline">Leer más →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
