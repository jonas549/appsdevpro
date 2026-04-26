import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FileText, BookOpen, Globe, ArrowRight } from "lucide-react"
import AdminLayout from "../../components/admin/AdminLayout"

const SECTION_NAMES: Record<string, string> = {
  hero: 'Hero',
  problem: 'Problema',
  solution: 'Solución',
  services: 'Servicios',
  apps: 'Apps',
  process: 'Proceso',
  faq: 'FAQ',
}

interface ContentEntry { id: string; section: string; key: string; value: string }
interface BlogPost { id: string; title: string; published: boolean }

export default function DashboardPage() {
  const [content, setContent] = useState<ContentEntry[]>([])
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    const headers = { Authorization: `Bearer ${token}` }
    fetch("/api/content", { headers }).then(r => r.json()).then(setContent).catch(() => {})
    fetch("/api/blog", { headers }).then(r => r.json()).then(setPosts).catch(() => {})
  }, [])

  // Exclude _size meta-entries from real content counts
  const realContent = content.filter(c => !c.key.endsWith('_size'))
  const published = posts.filter(p => p.published).length

  // Derive sections dynamically from actual DB data
  const bySection = Object.entries(
    realContent.reduce<Record<string, number>>((acc, c) => {
      acc[c.section] = (acc[c.section] ?? 0) + 1
      return acc
    }, {})
  )
    .map(([section, count]) => ({ section, count }))
    .sort((a, b) => a.section.localeCompare(b.section))

  return (
    <AdminLayout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Campos de contenido", value: realContent.length, icon: FileText, color: "#4361EE" },
          { label: "Posts totales",        value: posts.length,       icon: BookOpen, color: "#10B981" },
          { label: "Posts publicados",     value: published,          icon: Globe,    color: "#F59E0B" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#0C0F1A] border border-white/[0.06] rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-[14px] text-[#A5B0CC]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sections grid */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-white">Secciones del sitio</h2>
        <Link to="/admin/content" className="text-[14px] text-[#4361EE] flex items-center gap-1 hover:underline">
          Ver todo <ArrowRight size={13} />
        </Link>
      </div>

      {bySection.length === 0 ? (
        <p className="text-[#A5B0CC] text-[15px] mb-8">
          No hay contenido en la base de datos.{" "}
          <Link to="/admin/content" className="text-[#4361EE] hover:underline">Ir a Contenido →</Link>
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {bySection.map(({ section, count }) => (
            <Link
              key={section}
              to={`/admin/content?section=${section}`}
              className="bg-[#0C0F1A] border border-white/[0.06] rounded-xl p-4 hover:border-[#4361EE]/30 transition-colors group"
            >
              <p className="text-[14px] font-semibold text-[#4361EE] mb-2">
                {SECTION_NAMES[section] ?? section}
              </p>
              <p className="text-xl font-bold text-white">{count}</p>
              <p className="text-[13px] text-[#A5B0CC]">campos</p>
            </Link>
          ))}
        </div>
      )}

      {/* Recent posts */}
      {posts.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-white">Posts recientes</h2>
            <Link to="/admin/blog" className="text-[14px] text-[#4361EE] flex items-center gap-1 hover:underline">
              Ver blog <ArrowRight size={13} />
            </Link>
          </div>
          <div className="bg-[#0C0F1A] border border-white/[0.06] rounded-xl overflow-hidden">
            {posts.slice(0, 5).map((post, i) => (
              <Link
                key={post.id}
                to={`/admin/blog/${post.id}`}
                className={`flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors ${i > 0 ? "border-t border-white/[0.04]" : ""}`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${post.published ? "bg-[#10B981]" : "bg-[#7B8DB0]"}`} />
                <span className="text-[16px] text-white flex-1 truncate">{post.title}</span>
                <span className={`text-[12px] font-mono px-2 py-0.5 rounded-full ${post.published ? "text-[#10B981] bg-[#10B981]/10" : "text-[#A5B0CC] bg-white/[0.04]"}`}>
                  {post.published ? "publicado" : "borrador"}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  )
}
