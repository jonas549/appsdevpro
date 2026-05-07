/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/src/components/layout/Footer'
import BlogListClient from '@/app/blog/BlogListClient'

export const metadata: Metadata = {
  title: 'Blog | Apps Developers Pro',
  description: 'Ideas, casos de estudio y recursos sobre desarrollo de apps y tiendas Shopify.',
  alternates: { canonical: 'https://appsdeveloperspro.com/blog' },
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  let posts: { id: string; title: string; slug: string; excerpt: string; published: boolean; createdAt: Date; featured_image: string | null }[] = []
  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, excerpt: true, published: true, createdAt: true, featured_image: true },
    })
  } catch { /* DB unavailable — show empty state */ }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#07090F]">
        <Navbar />
        <div className="pt-28 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors">
              <span>←</span> Volver al inicio
            </Link>
            <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4">Blog</h1>
            <p className="text-white/60 text-lg">Ideas, casos de estudio y recursos sobre desarrollo Shopify.</p>
          </div>
        </div>
      </div>
      <BlogListClient posts={posts.map(p => ({ ...p, createdAt: p.createdAt.toISOString() }))} />
      <Footer />
    </div>
  )
}
