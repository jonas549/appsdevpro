import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../components/admin/AdminLayout"

type Status = 'idle' | 'saving' | 'success' | 'error'

export default function SettingsPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem("admin_token") || ""
  const currentEmail = localStorage.getItem("admin_email") || ""

  const [emailForm, setEmailForm] = useState({ newEmail: "", currentPassword: "" })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [emailStatus, setEmailStatus]     = useState<Status>('idle')
  const [passwordStatus, setPasswordStatus] = useState<Status>('idle')
  const [emailError, setEmailError]         = useState("")
  const [passwordError, setPasswordError]   = useState("")

  // SEO
  const [seoForm, setSeoForm] = useState({ meta_title: "", meta_description: "" })
  const [seoStatus, setSeoStatus] = useState<Status>('idle')
  const [seoError, setSeoError] = useState("")

  useEffect(() => {
    fetch("/api/content")
      .then(r => r.json())
      .then((data: { section: string; key: string; value: string }[]) => {
        const seo = data.filter(e => e.section === "seo")
        setSeoForm({
          meta_title:       seo.find(e => e.key === "meta_title")?.value       ?? "",
          meta_description: seo.find(e => e.key === "meta_description")?.value ?? "",
        })
      })
      .catch(() => {})
  }, [])

  async function handleSeoSave(e: React.FormEvent) {
    e.preventDefault()
    setSeoError("")
    setSeoStatus('saving')
    try {
      for (const key of ["meta_title", "meta_description"] as const) {
        const r = await fetch("/api/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ section: "seo", key, value: seoForm[key] }),
        })
        if (!r.ok) { setSeoError("Error al guardar"); setSeoStatus('error'); return }
      }
      setSeoStatus('success')
      window.dispatchEvent(new Event('content-updated'))
      setTimeout(() => setSeoStatus('idle'), 2500)
    } catch {
      setSeoError("Error de red"); setSeoStatus('error')
    }
  }

  async function handleEmailSave(e: React.FormEvent) {
    e.preventDefault()
    setEmailError("")
    if (!emailForm.newEmail) { setEmailError("Ingresa el nuevo email"); return }
    if (!emailForm.currentPassword) { setEmailError("Ingresa tu contraseña actual"); return }
    setEmailStatus('saving')
    try {
      const r = await fetch("/api/auth/update-credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: emailForm.currentPassword, newEmail: emailForm.newEmail }),
      })
      const data = await r.json()
      if (!r.ok) { setEmailError(data.error || "Error al guardar"); setEmailStatus('error'); return }
      setEmailStatus('success')
      localStorage.removeItem("admin_token")
      localStorage.removeItem("admin_email")
      setTimeout(() => navigate("/admin/login"), 1500)
    } catch {
      setEmailError("Error de red"); setEmailStatus('error')
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError("")
    if (!passwordForm.currentPassword) { setPasswordError("Ingresa tu contraseña actual"); return }
    if (!passwordForm.newPassword) { setPasswordError("Ingresa la nueva contraseña"); return }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden"); return
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres"); return
    }
    setPasswordStatus('saving')
    try {
      const r = await fetch("/api/auth/update-credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
      })
      const data = await r.json()
      if (!r.ok) { setPasswordError(data.error || "Error al guardar"); setPasswordStatus('error'); return }
      setPasswordStatus('success')
      localStorage.removeItem("admin_token")
      localStorage.removeItem("admin_email")
      setTimeout(() => navigate("/admin/login"), 1500)
    } catch {
      setPasswordError("Error de red"); setPasswordStatus('error')
    }
  }

  const inputBase = "w-full bg-white rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
  const inputStyle = { border: '1px solid #94A3B8', color: '#0F172A' }

  return (
    <AdminLayout title="Configuración">
      <div className="max-w-xl flex flex-col gap-6">

        {/* SEO global */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1px solid #CBD5E1' }}>
          <div className="px-6 py-4 border-b" style={{ background: '#E2E8F0', borderBottomColor: '#E2E8F0' }}>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#64748B' }}>search</span>
              <span className="text-[18px] font-bold text-slate-800">SEO del sitio</span>
            </div>
          </div>
          <form onSubmit={handleSeoSave} className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">Meta título del sitio</label>
              <input
                value={seoForm.meta_title}
                onChange={e => setSeoForm(f => ({ ...f, meta_title: e.target.value }))}
                placeholder="Apps Developers Pro — Desarrollo de Apps Shopify"
                className={inputBase}
                style={inputStyle}
              />
              <p className="text-[11px] text-slate-400">Aparece en la pestaña del navegador y en Google. Recomendado: 60 caracteres. Actual: {seoForm.meta_title.length}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">Meta descripción del sitio</label>
              <textarea
                value={seoForm.meta_description}
                onChange={e => setSeoForm(f => ({ ...f, meta_description: e.target.value }))}
                rows={3}
                placeholder="Agencia especializada en desarrollo de aplicaciones Shopify..."
                className={`${inputBase} resize-none`}
                style={inputStyle}
              />
              <p className="text-[11px] text-slate-400">Aparece en los resultados de Google. Recomendado: 160 caracteres. Actual: {seoForm.meta_description.length}</p>
            </div>
            {seoError && <p className="text-red-600 text-[13px]">{seoError}</p>}
            {seoStatus === 'success' && (
              <p className="text-emerald-600 text-[13px] font-semibold">SEO actualizado correctamente.</p>
            )}
            <button
              type="submit"
              disabled={seoStatus === 'saving'}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed w-fit"
              style={{ background: '#4361EE' }}
            >
              {seoStatus === 'saving'
                ? <><span className="material-symbols-outlined animate-spin" style={{ fontSize: 14 }}>progress_activity</span> Guardando…</>
                : <><span className="material-symbols-outlined" style={{ fontSize: 14 }}>save</span> Guardar SEO</>
              }
            </button>
          </form>
        </div>

        {/* Cambiar email */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1px solid #CBD5E1' }}>
          <div className="px-6 py-4 border-b" style={{ background: '#E2E8F0', borderBottomColor: '#E2E8F0' }}>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#64748B' }}>alternate_email</span>
              <span className="text-[18px] font-bold text-slate-800">Cambiar email</span>
            </div>
          </div>
          <form onSubmit={handleEmailSave} className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">Email actual</label>
              <input value={currentEmail} readOnly className={`${inputBase} bg-slate-50 text-slate-400 cursor-not-allowed`} style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">Nuevo email</label>
              <input
                type="email"
                value={emailForm.newEmail}
                onChange={e => setEmailForm(f => ({ ...f, newEmail: e.target.value }))}
                placeholder="nuevo@email.com"
                className={inputBase}
                style={inputStyle}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">Contraseña actual (para confirmar)</label>
              <input
                type="password"
                value={emailForm.currentPassword}
                onChange={e => setEmailForm(f => ({ ...f, currentPassword: e.target.value }))}
                placeholder="••••••••"
                className={inputBase}
                style={inputStyle}
              />
            </div>
            {emailError && <p className="text-red-600 text-[13px]">{emailError}</p>}
            {emailStatus === 'success' && (
              <p className="text-emerald-600 text-[13px] font-semibold">Email actualizado. Cerrando sesión…</p>
            )}
            <button
              type="submit"
              disabled={emailStatus === 'saving' || emailStatus === 'success'}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed w-fit"
              style={{ background: '#4361EE' }}
            >
              {emailStatus === 'saving'
                ? <><span className="material-symbols-outlined animate-spin" style={{ fontSize: 14 }}>progress_activity</span> Guardando…</>
                : <><span className="material-symbols-outlined" style={{ fontSize: 14 }}>save</span> Guardar email</>
              }
            </button>
          </form>
        </div>

        {/* Cambiar contraseña */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1px solid #CBD5E1' }}>
          <div className="px-6 py-4 border-b" style={{ background: '#E2E8F0', borderBottomColor: '#E2E8F0' }}>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#64748B' }}>lock</span>
              <span className="text-[18px] font-bold text-slate-800">Cambiar contraseña</span>
            </div>
          </div>
          <form onSubmit={handlePasswordSave} className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">Contraseña actual</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
                placeholder="••••••••"
                className={inputBase}
                style={inputStyle}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">Nueva contraseña</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                placeholder="••••••••"
                className={inputBase}
                style={inputStyle}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">Confirmar nueva contraseña</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                placeholder="••••••••"
                className={inputBase}
                style={inputStyle}
              />
            </div>
            {passwordError && <p className="text-red-600 text-[13px]">{passwordError}</p>}
            {passwordStatus === 'success' && (
              <p className="text-emerald-600 text-[13px] font-semibold">Contraseña actualizada. Cerrando sesión…</p>
            )}
            <button
              type="submit"
              disabled={passwordStatus === 'saving' || passwordStatus === 'success'}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed w-fit"
              style={{ background: '#4361EE' }}
            >
              {passwordStatus === 'saving'
                ? <><span className="material-symbols-outlined animate-spin" style={{ fontSize: 14 }}>progress_activity</span> Guardando…</>
                : <><span className="material-symbols-outlined" style={{ fontSize: 14 }}>save</span> Guardar contraseña</>
              }
            </button>
          </form>
        </div>

      </div>
    </AdminLayout>
  )
}
