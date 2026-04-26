import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus, Globe, FileText, Trash2, Loader2 } from "lucide-react"
import AdminLayout from "../../components/admin/AdminLayout"

interface Post { id: string; title: string; slug: string; excerpt: string; published: boolean; createdAt: string }

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
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

  async function togglePublish(post: Post) {
    const res = await fetch(`/api/blog/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ published: !post.published }),
    })
    const updated = await res.json() as Post
    setPosts(prev => prev.map(p => p.id === post.id ? updated : p))
  }

  return (
    <AdminLayout title="Blog">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[#7B8DB0]">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
        <button
          onClick={() => navigate("/admin/blog/new")}
          className="flex items-center gap-2 bg-[#4361EE] hover:bg-[#3451d1] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} /> Nuevo post
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[#7B8DB0] text-sm">
          <Loader2 size={16} className="animate-spin" /> Cargando...
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-[#7B8DB0]">
          <FileText size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No hay posts aún.</p>
          <button onClick={() => navigate("/admin/blog/new")} className="mt-4 text-[#4361EE] text-sm hover:underline">
            Crear el primero →
          </button>
        </div>
      ) : (
        <div className="bg-[#0C0F1A] border border-white/[0.06] rounded-xl overflow-hidden">
          {posts.map((post, i) => (
            <div
              key={post.id}
              className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t border-white/[0.04]" : ""}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${post.published ? "bg-[#10B981]" : "bg-[#7B8DB0]/40"}`} />
              <div className="flex-1 min-w-0">
                <Link to={`/admin/blog/${post.id}`} className="text-sm font-medium text-[#EDF0FF] hover:text-[#4361EE] transition-colors truncate block">
                  {post.title}
                </Link>
                <p className="text-xs text-[#7B8DB0] font-mono truncate">{post.slug}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => togglePublish(post)}
                  title={post.published ? "Despublicar" : "Publicar"}
                  className={`flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full transition-colors ${
                    post.published
                      ? "text-[#10B981] bg-[#10B981]/10 hover:bg-[#10B981]/20"
                      : "text-[#7B8DB0] bg-white/[0.04] hover:bg-white/[0.08]"
                  }`}
                >
                  <Globe size={11} />
                  {post.published ? "publicado" : "borrador"}
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  disabled={deleting === post.id}
                  className="p-1.5 text-[#7B8DB0] hover:text-red-400 transition-colors rounded-md hover:bg-red-400/[0.06]"
                >
                  {deleting === post.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
