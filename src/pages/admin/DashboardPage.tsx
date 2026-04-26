import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FileText, BookOpen, Globe, ArrowRight } from "lucide-react"
import AdminLayout from "../../components/admin/AdminLayout"

const SECTIONS = ["hero", "problem", "solution", "services", "apps", "process", "faq"]

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

  const published = posts.filter(p => p.published).length
  const bySection = SECTIONS.map(s => ({ section: s, count: content.filter(c => c.section === s).length }))

  return (
    <AdminLayout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Entradas de contenido", value: content.length, icon: FileText, color: "#4361EE" },
          { label: "Posts totales",          value: posts.length,   icon: BookOpen, color: "#10B981" },
          { label: "Posts publicados",       value: published,       icon: Globe,    color: "#F59E0B" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#0C0F1A] border border-white/[0.06] rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#EDF0FF]">{value}</p>
              <p className="text-xs text-[#7B8DB0]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sections grid */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#EDF0FF]">Secciones del sitio</h2>
        <Link to="/admin/content" className="text-xs text-[#4361EE] flex items-center gap-1 hover:underline">
          Ver todo <ArrowRight size={12} />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {bySection.map(({ section, count }) => (
          <Link
            key={section}
            to={`/admin/content?section=${section}`}
            className="bg-[#0C0F1A] border border-white/[0.06] rounded-xl p-4 hover:border-[#4361EE]/30 transition-colors group"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#4361EE] mb-2">{section}</p>
            <p className="text-xl font-bold text-[#EDF0FF]">{count}</p>
            <p className="text-xs text-[#7B8DB0]">entradas</p>
          </Link>
        ))}
      </div>

      {/* Recent posts */}
      {posts.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#EDF0FF]">Posts recientes</h2>
            <Link to="/admin/blog" className="text-xs text-[#4361EE] flex items-center gap-1 hover:underline">
              Ver blog <ArrowRight size={12} />
            </Link>
          </div>
          <div className="bg-[#0C0F1A] border border-white/[0.06] rounded-xl overflow-hidden">
            {posts.slice(0, 5).map((post, i) => (
              <Link
                key={post.id}
                to={`/admin/blog/${post.id}`}
                className={`flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors ${i > 0 ? "border-t border-white/[0.04]" : ""}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${post.published ? "bg-[#10B981]" : "bg-[#7B8DB0]"}`} />
                <span className="text-sm text-[#EDF0FF] flex-1 truncate">{post.title}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${post.published ? "text-[#10B981] bg-[#10B981]/10" : "text-[#7B8DB0] bg-white/[0.04]"}`}>
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
