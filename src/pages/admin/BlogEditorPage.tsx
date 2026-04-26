import { useEffect, useState, type FormEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Loader2, Globe, FileText } from "lucide-react"
import AdminLayout from "../../components/admin/AdminLayout"

interface PostForm { title: string; slug: string; excerpt: string; content: string; published: boolean }

function toSlug(s: string) {
  return s.toLowerCase().replace(/[áàä]/g,"a").replace(/[éèë]/g,"e").replace(/[íìï]/g,"i").replace(/[óòö]/g,"o").replace(/[úùü]/g,"u").replace(/ñ/g,"n").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")
}

export default function BlogEditorPage() {
  const { id } = useParams()
  const isNew = id === "new"
  const navigate = useNavigate()
  const token = localStorage.getItem("admin_token") || ""

  const [form, setForm] = useState<PostForm>({ title: "", slug: "", excerpt: "", content: "", published: false })
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [slugManual, setSlugManual] = useState(false)

  useEffect(() => {
    if (isNew) return
    fetch(`/api/blog/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setForm(data); setLoading(false); setSlugManual(true) })
      .catch(() => setLoading(false))
  }, [id, isNew, token])

  function set<K extends keyof PostForm>(key: K, value: PostForm[K]) {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === "title" && !slugManual) next.slug = toSlug(value as string)
      return next
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      const url = isNew ? "/api/blog" : `/api/blog/${id}`
      const method = isNew ? "POST" : "PUT"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json() as { id?: string; error?: string }
      if (!res.ok) { setError(data.error || "Error al guardar"); return }
      navigate("/admin/blog")
    } catch {
      setError("Error de conexión")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Editor de post">
        <div className="flex items-center gap-2 text-[#7B8DB0] text-sm">
          <Loader2 size={16} className="animate-spin" /> Cargando post...
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={isNew ? "Nuevo post" : "Editar post"}>
      <button onClick={() => navigate("/admin/blog")} className="flex items-center gap-1.5 text-sm text-[#7B8DB0] hover:text-[#EDF0FF] mb-6 transition-colors">
        <ArrowLeft size={14} /> Volver al blog
      </button>

      <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-[#7B8DB0] mb-1.5">Título *</label>
          <input
            value={form.title}
            onChange={e => set("title", e.target.value)}
            required
            className="w-full bg-[#0C0F1A] border border-white/[0.08] rounded-lg px-4 py-2.5 text-[#EDF0FF] focus:outline-none focus:border-[#4361EE] transition-colors"
            placeholder="Título del post"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-medium text-[#7B8DB0] mb-1.5">Slug *</label>
          <input
            value={form.slug}
            onChange={e => { setSlugManual(true); set("slug", e.target.value) }}
            required
            className="w-full bg-[#0C0F1A] border border-white/[0.08] rounded-lg px-4 py-2.5 text-[#EDF0FF] font-mono text-sm focus:outline-none focus:border-[#4361EE] transition-colors"
            placeholder="mi-post"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-medium text-[#7B8DB0] mb-1.5">Extracto *</label>
          <textarea
            value={form.excerpt}
            onChange={e => set("excerpt", e.target.value)}
            required
            rows={2}
            className="w-full bg-[#0C0F1A] border border-white/[0.08] rounded-lg px-4 py-2.5 text-[#EDF0FF] focus:outline-none focus:border-[#4361EE] transition-colors resize-y"
            placeholder="Breve descripción para SEO y listado"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-medium text-[#7B8DB0] mb-1.5">Contenido *</label>
          <textarea
            value={form.content}
            onChange={e => set("content", e.target.value)}
            required
            rows={16}
            className="w-full bg-[#0C0F1A] border border-white/[0.08] rounded-lg px-4 py-3 text-[#EDF0FF] text-sm font-mono leading-relaxed focus:outline-none focus:border-[#4361EE] transition-colors resize-y"
            placeholder="Escribe el contenido del post aquí (Markdown soportado)..."
          />
        </div>

        {/* Published toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={form.published} onChange={e => set("published", e.target.checked)} />
            <div className={`w-10 h-5 rounded-full transition-colors ${form.published ? "bg-[#4361EE]" : "bg-white/[0.1]"}`} />
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.published ? "translate-x-5" : ""}`} />
          </div>
          <span className="flex items-center gap-1.5 text-sm text-[#7B8DB0]">
            {form.published ? <Globe size={14} className="text-[#10B981]" /> : <FileText size={14} />}
            {form.published ? "Publicado" : "Borrador"}
          </span>
        </label>

        {error && <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-[#4361EE] hover:bg-[#3451d1] disabled:opacity-50 text-white font-medium text-sm rounded-lg py-2.5 transition-colors flex items-center justify-center gap-2"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? "Guardando..." : isNew ? "Crear post" : "Guardar cambios"}
        </button>
      </form>
    </AdminLayout>
  )
}
