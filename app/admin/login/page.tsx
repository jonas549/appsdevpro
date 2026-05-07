'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json() as { token?: string; email?: string; error?: string }
      if (!res.ok || !data.token) {
        setError(data.error || 'Credenciales incorrectas')
        return
      }
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_email', data.email || email)
      router.replace('/admin/dashboard')
    } catch {
      setError('Error de conexión. ¿Está el servidor corriendo?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-9 h-9 bg-adm-primary-container rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-white" style={{ fontSize: 20 }}>developer_mode_tv</span>
          </div>
          <div>
            <span className="text-slate-900 font-bold text-lg leading-tight block">AppsDevPro</span>
            <span className="text-slate-500 text-xs">Admin Dashboard</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <h2 className="text-slate-900 text-xl font-semibold mb-1">Iniciar sesión</h2>
          <p className="text-slate-500 text-sm mb-6">Ingresa con tu cuenta de administrador.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-adm-primary-container focus:ring-4 focus:ring-adm-primary-container/10 transition-all"
                placeholder="admin@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-adm-primary-container focus:ring-4 focus:ring-adm-primary-container/10 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-600 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 bg-adm-primary-container hover:opacity-90 disabled:opacity-50 text-white font-semibold text-sm rounded-lg py-2.5 transition-all active:scale-[0.98]"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
