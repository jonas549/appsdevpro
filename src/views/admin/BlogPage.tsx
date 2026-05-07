import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"

interface Post {
  id: string; title: string; slug: string; excerpt: string
  published: boolean; createdAt: string; featured_image?: string
}

const PAGE_SIZE = 10

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all")
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const token = localStorage.getItem("admin_token") || ""

  useEffect(() => {
    fetch("/api/blog", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token])

  async function deletePost(id: string) {
    if (!confirm("¿Eliminar este post?")) return
    setDeleting(id)
    await fetch(`/api/blog/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
    setPosts(prev => prev.filter(p => p.id !== id))
    setDeleting(null)
  }

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || (filter === "published" ? p.published : !p.published)
    return matchSearch && matchFilter
  })
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
  }

  const tabCls = (active: boolean) =>
    `text-sm transition-colors ${active ? "text-slate-900 font-semibold" : "text-slate-500 hover:text-adm-primary"}`

  return (
    <AdminLayout
      title="Blog"
      headerActions={
        <>
          <button className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-all">
            Guardar cambios
          </button>
          <button
            onClick={() => navigate("/admin/blog/new")}
            className="px-4 py-2 bg-adm-primary-container text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            Nuevo post
          </button>
        </>
      }
    >
      {/* Filters & search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-adm-primary transition-colors" style={{ fontSize: 20 }}>search</span>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg text-sm focus:ring-2 focus:ring-adm-primary-container/20 transition-all outline-none"
            style={{ border: '1px solid #94A3B8', color: '#0F172A' }}
            placeholder="Buscar publicaciones..."
          />
        </div>
        <nav className="flex items-center gap-6 border-l pl-6" style={{ borderLeftColor: '#CBD5E1' }}>
          {(["all", "published", "draft"] as const).map(f => (
            <button key={f} onClick={() => { setFilter(f); setPage(1) }} className={tabCls(filter === f)}>
              {f === "all" ? "Todos" : f === "published" ? "Publicados" : "Borradores"}
            </button>
          ))}
        </nav>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1px solid #CBD5E1' }}>
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-slate-400">
            <span className="material-symbols-outlined animate-spin" style={{ fontSize: 24 }}>progress_activity</span>
            <span className="text-sm">Cargando...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
            <span className="material-symbols-outlined" style={{ fontSize: 40 }}>article</span>
            <p className="text-sm">{search ? "No hay resultados para tu búsqueda." : "No hay posts todavía."}</p>
            <button onClick={() => navigate("/admin/blog/new")} className="text-adm-primary text-sm font-medium hover:underline">Crear el primero →</button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ background: '#E2E8F0', borderBottom: '1px solid #CBD5E1' }}>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#334155' }}>Título</th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#334155' }}>Estado</th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#334155' }}>Fecha</th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: '#334155' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {paginated.map(post => (
                    <tr key={post.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {post.featured_image
                              ? <img src={post.featured_image} alt="" className="w-full h-full object-cover" />
                              : <span className="material-symbols-outlined text-slate-400" style={{ fontSize: 20 }}>image</span>}
                          </div>
                          <Link to={`/admin/blog/${post.id}`} className="text-[14px] font-medium text-slate-900 hover:text-adm-primary transition-colors line-clamp-2">
                            {post.title}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {post.published
                          ? <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Publicado</span>
                          : <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">Borrador</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(post.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-[#4361EE] transition-colors"
                            title={post.published ? "Ver post publicado" : "Vista previa del borrador"}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>visibility</span>
                          </a>
                          <Link to={`/admin/blog/${post.id}`} className="p-2 text-slate-400 hover:text-adm-primary transition-colors">
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                          </Link>
                          <button
                            onClick={() => deletePost(post.id)}
                            disabled={deleting === post.id}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            {deleting === post.id
                              ? <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>progress_activity</span>
                              : <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: '#F1F5F9', borderTop: '1px solid #CBD5E1' }}>
              <p className="text-xs text-slate-500 font-medium">
                Mostrando {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length} publicaciones
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_left</span>
                </button>
                <span className="text-xs font-bold text-slate-900">{page}</span>
                <span className="text-xs text-slate-400">/</span>
                <span className="text-xs text-slate-400">{totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_right</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom stats */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: "visibility", color: "blue", label: "Vistas Totales", value: "—", sub: "Conecta analytics para ver datos" },
          { icon: "timer", color: "emerald", label: "Tiempo de Lectura", value: "—", sub: "Basado en posts publicados" },
          { icon: "chat_bubble", color: "purple", label: "Posts Totales", value: posts.length.toString(), sub: `${posts.filter(p => p.published).length} publicados · ${posts.filter(p => !p.published).length} borradores` },
        ].map(s => (
          <div key={s.label} className="bg-white p-6 rounded-xl shadow-sm" style={{ border: '1px solid #CBD5E1' }}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full bg-${s.color}-50 flex items-center justify-center text-${s.color}-600`}>
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{s.icon}</span>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#334155' }}>{s.label}</p>
                <h3 className="text-2xl font-bold" style={{ color: '#0F172A' }}>{s.value}</h3>
              </div>
            </div>
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid #E2E8F0' }}>
              <p className="text-xs" style={{ color: '#64748B' }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
