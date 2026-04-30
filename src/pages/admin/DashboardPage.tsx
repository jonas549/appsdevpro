import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"

const SECTIONS_MAP: Record<string, { label: string; icon: string }> = {
  hero:     { label: "Hero Section",    icon: "view_quilt" },
  problem:  { label: "El Problema",     icon: "error_outline" },
  solution: { label: "La Solución",     icon: "check_circle" },
  services: { label: "Servicios",       icon: "layers" },
  apps:     { label: "Apps Gallery",    icon: "token" },
  ctabanner:{ label: "CTA Intermedio",  icon: "campaign" },
  process:  { label: "Proceso",         icon: "account_tree" },
  faq:      { label: "FAQ",             icon: "quiz" },
  ctafinal: { label: "CTA Final",       icon: "flag" },
  footer:   { label: "Footer",          icon: "bottom_navigation" },
  global:   { label: "Configuración",   icon: "settings" },
}

interface ContentEntry { id: string; section: string; key: string; value: string }
interface BlogPost { id: string; title: string; published: boolean; createdAt: string }

export default function DashboardPage() {
  const [content, setContent] = useState<ContentEntry[]>([])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    const headers = { Authorization: `Bearer ${token}` }
    fetch("/api/content", { headers }).then(r => r.json()).then(setContent).catch(() => {})
    fetch("/api/blog", { headers }).then(r => r.json()).then(setPosts).catch(() => {})
  }, [])

  const realContent = content.filter(c => !c.key.endsWith("_size"))
  const published = posts.filter(p => p.published).length
  const drafts = posts.length - published

  const uniqueSections = [...new Set(realContent.map(c => c.section))]

  const stats = [
    { label: "Total secciones editables", value: uniqueSections.length, icon: "schema", badge: { text: "Activo", cls: "text-emerald-600 bg-emerald-50" } },
    { label: "Total campos de contenido", value: realContent.length, icon: "edit_calendar", badge: { text: "CMS", cls: "text-blue-600 bg-blue-50" } },
    { label: "Posts publicados", value: published, icon: "send_and_archive", badge: null },
    { label: "Posts borrador", value: drafts, icon: "drafts", badge: null },
  ]

  return (
    <AdminLayout
      title="Dashboard"
      headerActions={
        <>
          <button onClick={() => navigate("/admin/blog/new")} className="px-4 py-2 text-slate-600 text-sm font-medium hover:text-slate-900 transition-colors">
            Nuevo post
          </button>
          <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed">
            Guardar cambios
          </button>
        </>
      }
    >
      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="material-symbols-outlined text-adm-primary bg-adm-primary/10 p-2 rounded-lg" style={{ fontSize: 22 }}>{s.icon}</span>
              {s.badge && <span className={`text-xs font-medium px-2 py-1 rounded ${s.badge.cls}`}>{s.badge.text}</span>}
            </div>
            <p className="text-slate-500 text-[12px] font-medium">{s.label}</p>
            <h3 className="text-[32px] font-semibold text-slate-900 mt-1 leading-none">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick access */}
        <div className="lg:col-span-2">
          <h4 className="text-[20px] font-semibold text-slate-900 mb-4">Acceso rápido</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {uniqueSections.slice(0, 4).map(section => {
              const meta = SECTIONS_MAP[section] ?? { label: section, icon: "web" }
              return (
                <Link
                  key={section}
                  to={`/admin/content?section=${section}`}
                  className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-adm-primary-container transition-all cursor-pointer"
                >
                  <div className="aspect-[16/6] bg-slate-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-300" style={{ fontSize: 48 }}>{meta.icon}</span>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-adm-primary" style={{ fontSize: 20 }}>{meta.icon}</span>
                      <span className="text-[15px] font-medium text-slate-900">{meta.label}</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-adm-primary group-hover:translate-x-1 transition-all" style={{ fontSize: 20 }}>chevron_right</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h4 className="text-[20px] font-semibold text-slate-900 mb-4">Posts recientes</h4>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Historial</span>
              <Link to="/admin/blog" className="text-adm-primary text-[12px] font-medium hover:underline">Ver todo</Link>
            </div>
            {posts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                <span className="material-symbols-outlined block mb-2" style={{ fontSize: 32 }}>article</span>
                Sin posts aún
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {posts.slice(0, 5).map(post => (
                  <li key={post.id}>
                    <Link to={`/admin/blog/${post.id}`} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3">
                      <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${post.published ? "bg-adm-primary-container" : "bg-slate-300"}`} />
                      <div>
                        <p className="text-[13px] text-slate-900 font-medium leading-snug">{post.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {post.published ? "Publicado" : "Borrador"} · {new Date(post.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
