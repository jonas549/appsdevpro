import { useEffect, useState, useRef, useCallback, type FormEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"
import RichTextEditor from "../../components/admin/RichTextEditor"

interface PostForm {
  title: string; slug: string; excerpt: string; content: string; published: boolean
  featured_image: string; meta_title: string; meta_description: string
}

function toSlug(s: string) {
  return s.toLowerCase()
    .replace(/[áàä]/g, "a").replace(/[éèë]/g, "e").replace(/[íìï]/g, "i")
    .replace(/[óòö]/g, "o").replace(/[úùü]/g, "u").replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

function charCount(val: string, max: number) {
  const n = val.length
  const cls = n > max ? "text-red-500" : n > max * 0.85 ? "text-amber-500" : "text-slate-400"
  return <span className={`text-[11px] ${cls}`}>{n}/{max}</span>
}

export default function BlogEditorPage() {
  const { id } = useParams()
  const isNew = id === "new"
  const navigate = useNavigate()
  const token = localStorage.getItem("admin_token") || ""

  const empty: PostForm = { title: "", slug: "", excerpt: "", content: "", published: false, featured_image: "", meta_title: "", meta_description: "" }
  const [form, setForm] = useState<PostForm>(empty)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [slugManual, setSlugManual] = useState(false)
  const [slugConflict, setSlugConflict] = useState(false)
  const [uploadingFeatured, setUploadingFeatured] = useState(false)
  const featuredInputRef = useRef<HTMLInputElement>(null)

  const checkSlug = useCallback((slug: string, currentId: string | undefined) => {
    if (!slug || slug.length < 2) { setSlugConflict(false); return }
    fetch(`/api/blog/slug/${encodeURIComponent(slug)}`)
      .then(r => {
        if (!r.ok) { setSlugConflict(false); return }
        return r.json()
      })
      .then((data?: { id?: string }) => {
        if (!data) return
        // Conflict if the found post is a DIFFERENT post
        setSlugConflict(!!data.id && data.id !== currentId)
      })
      .catch(() => setSlugConflict(false))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => checkSlug(form.slug, isNew ? undefined : id), 500)
    return () => clearTimeout(timer)
  }, [form.slug, id, isNew, checkSlug])

  useEffect(() => {
    if (isNew) return
    fetch(`/api/blog/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setForm({ ...empty, ...data, featured_image: data.featured_image ?? "", meta_title: data.meta_title ?? "", meta_description: data.meta_description ?? "" })
        setLoading(false)
        setSlugManual(true)
      })
      .catch(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew, token])

  function set<K extends keyof PostForm>(key: K, value: PostForm[K]) {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === "title" && !slugManual) next.slug = toSlug(value as string)
      return next
    })
  }

  async function uploadFeaturedImage(file: File) {
    setUploadingFeatured(true)
    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result as string
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ data: base64, folder: "blog/featured" }),
      })
      const json = await res.json() as { url?: string }
      if (json.url) set("featured_image", json.url)
      setUploadingFeatured(false)
    }
    reader.readAsDataURL(file)
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
      <AdminLayout title="Editar post">
        <div className="flex items-center gap-3 text-slate-400 py-20 justify-center">
          <span className="material-symbols-outlined animate-spin" style={{ fontSize: 24 }}>progress_activity</span>
          <span className="text-sm">Cargando post...</span>
        </div>
      </AdminLayout>
    )
  }

  const publishToggle = (
    <div className="flex items-center gap-3">
      <span className="text-[13px] font-medium text-slate-600">Publicar</span>
      <button
        type="button"
        onClick={() => set("published", !form.published)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${form.published ? "bg-adm-primary-container" : "bg-slate-300"}`}
      >
        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-sm ${form.published ? "translate-x-5" : "translate-x-1"}`} />
      </button>
    </div>
  )

  return (
    <AdminLayout
      title={isNew ? "Nuevo post" : "Editar post"}
      headerActions={
        <>
          {publishToggle}
          <button
            type="button"
            onClick={() => navigate("/admin/blog")}
            className="px-4 py-1.5 text-slate-900 bg-white border border-slate-200 rounded-lg text-[13px] font-medium hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="post-form"
            disabled={saving}
            className="px-4 py-1.5 text-white bg-adm-primary rounded-lg text-[13px] font-medium shadow-sm hover:brightness-90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <span className="material-symbols-outlined animate-spin" style={{ fontSize: 14 }}>progress_activity</span>}
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </>
      }
    >
      <form id="post-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-12 gap-8">
          {/* Left — editor */}
          <div className="col-span-8 space-y-8">
            {/* Title + slug */}
            <section className="space-y-4">
              <input
                value={form.title}
                onChange={e => set("title", e.target.value)}
                required
                className="w-full text-[32px] font-bold tracking-tight bg-transparent border-none focus:ring-0 outline-none placeholder:text-slate-300 p-0 text-slate-900"
                placeholder="Título de la publicación"
              />
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border max-w-fit ${slugConflict ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                <span className="material-symbols-outlined text-slate-400" style={{ fontSize: 18 }}>link</span>
                <span className="text-[12px] text-slate-500 font-medium">appsdevpro.com/blog/</span>
                <input
                  value={form.slug}
                  onChange={e => { setSlugManual(true); set("slug", e.target.value) }}
                  required
                  className="bg-transparent border-none focus:ring-0 outline-none p-0 text-[12px] font-medium text-adm-primary w-auto min-w-[200px]"
                  placeholder="mi-post"
                />
              </div>
              {slugConflict && (
                <p className="text-[12px] text-red-600 flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>warning</span>
                  Este slug ya está en uso en otro post — cámbialo antes de guardar.
                </p>
              )}
            </section>

            {/* Rich text editor */}
            <RichTextEditor
              value={form.content}
              onChange={v => set("content", v)}
              placeholder="Escribe el contenido del post aquí..."
              minHeight={500}
              token={token}
            />

            {/* SEO */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-6" style={{ border: '1px solid #CBD5E1' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-[20px] font-bold" style={{ color: '#1E293B' }}>Configuración SEO</h3>
                {form.meta_title && form.meta_description && (
                  <span className="text-xs text-adm-primary bg-blue-50 px-2 py-0.5 rounded font-medium">Optimizado</span>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#334155' }}>Meta Título</label>
                    {charCount(form.meta_title, 60)}
                  </div>
                  <input
                    value={form.meta_title}
                    onChange={e => set("meta_title", e.target.value)}
                    className="w-full bg-white rounded-lg px-4 py-2.5 text-sm focus:ring-4 focus:ring-adm-primary-container/10 outline-none transition-all"
                    style={{ border: '1px solid #94A3B8', color: '#0F172A' }}
                    placeholder={form.title || "Título para buscadores..."}
                  />
                  <p className="text-[11px] text-slate-400">Recomendado: 60 caracteres</p>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#334155' }}>Meta Descripción</label>
                    {charCount(form.meta_description, 160)}
                  </div>
                  <textarea
                    value={form.meta_description}
                    onChange={e => set("meta_description", e.target.value)}
                    rows={3}
                    className="w-full bg-white rounded-lg px-4 py-2.5 text-sm focus:ring-4 focus:ring-adm-primary-container/10 outline-none transition-all resize-none"
                    style={{ border: '1px solid #94A3B8', color: '#0F172A' }}
                    placeholder={form.excerpt || "Descripción para buscadores..."}
                  />
                  <p className="text-[11px] text-slate-400">Recomendado: 160 caracteres</p>
                </div>
                {/* Excerpt */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#334155' }}>Extracto (listado del blog)</label>
                  <textarea
                    value={form.excerpt}
                    onChange={e => set("excerpt", e.target.value)}
                    required
                    rows={2}
                    className="w-full bg-white rounded-lg px-4 py-2.5 text-sm focus:ring-4 focus:ring-adm-primary-container/10 outline-none transition-all resize-none"
                    style={{ border: '1px solid #94A3B8', color: '#0F172A' }}
                    placeholder="Breve descripción visible en la lista de posts..."
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>
            )}
          </div>

          {/* Right — sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Featured image */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm" style={{ border: '1px solid #CBD5E1' }}>
              <div className="px-4 py-3 border-b" style={{ background: '#E2E8F0', borderBottomColor: '#CBD5E1' }}>
                <h3 className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#1E293B' }}>Imagen Destacada</h3>
              </div>
              <div className="p-4">
                {form.featured_image ? (
                  <div className="relative group rounded-lg overflow-hidden border border-slate-200">
                    <img src={form.featured_image} alt="Featured" className="w-full aspect-square object-cover" />
                    <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => featuredInputRef.current?.click()}
                        className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-md"
                      >
                        Cambiar
                      </button>
                      <button
                        type="button"
                        onClick={() => set("featured_image", "")}
                        className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-md text-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => featuredInputRef.current?.click()}
                    disabled={uploadingFeatured}
                    className="w-full aspect-square bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:border-adm-primary transition-colors disabled:opacity-50"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-adm-primary mb-4 group-hover:scale-110 transition-transform">
                      {uploadingFeatured
                        ? <span className="material-symbols-outlined animate-spin" style={{ fontSize: 24 }}>progress_activity</span>
                        : <span className="material-symbols-outlined" style={{ fontSize: 24 }}>upload_file</span>}
                    </div>
                    <p className="text-[13px] font-semibold text-slate-900">{uploadingFeatured ? "Subiendo..." : "Subir imagen"}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Recomendado: 1200×630px (JPG, PNG)</p>
                  </button>
                )}
                <input
                  ref={featuredInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadFeaturedImage(f); e.target.value = "" }}
                />
              </div>
            </div>

            {/* Publish status info */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4" style={{ border: '1px solid #CBD5E1' }}>
              <h3 className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#334155' }}>Estado de publicación</h3>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${form.published ? "bg-emerald-50 border border-emerald-100" : "bg-slate-50 border border-slate-200"}`}>
                <span className={`material-symbols-outlined ${form.published ? "text-emerald-600" : "text-slate-400"}`} style={{ fontSize: 20 }}>
                  {form.published ? "public" : "draft"}
                </span>
                <div>
                  <p className={`text-[13px] font-semibold ${form.published ? "text-emerald-700" : "text-slate-700"}`}>
                    {form.published ? "Publicado" : "Borrador"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {form.published ? "Visible para los visitantes" : "Solo visible en el admin"}
                  </p>
                </div>
              </div>
              <div className="pt-2">
                {publishToggle}
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
