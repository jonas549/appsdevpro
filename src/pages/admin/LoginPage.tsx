import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Zap } from "lucide-react"

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json() as { token?: string; email?: string; error?: string }
      if (!res.ok || !data.token) {
        setError(data.error || "Credenciales incorrectas")
        return
      }
      localStorage.setItem("admin_token", data.token)
      localStorage.setItem("admin_email", data.email || email)
      navigate("/admin/dashboard")
    } catch {
      setError("Error de conexión. ¿Está el servidor corriendo?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#07090F] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#4361EE] flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-[#EDF0FF] font-bold text-lg">AppsDevPro</span>
        </div>

        {/* Card */}
        <div className="bg-[#0C0F1A] border border-white/[0.06] rounded-2xl p-8">
          <h2 className="text-[#EDF0FF] text-xl font-semibold mb-1">Panel de administración</h2>
          <p className="text-[#7B8DB0] text-sm mb-6">Ingresa con tu cuenta de administrador.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-[#7B8DB0] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full bg-[#07090F] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-[#EDF0FF] placeholder-[#4B5563] focus:outline-none focus:border-[#4361EE] transition-colors"
                placeholder="admin@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#7B8DB0] mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#07090F] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-[#EDF0FF] placeholder-[#4B5563] focus:outline-none focus:border-[#4361EE] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 bg-[#4361EE] hover:bg-[#3451d1] disabled:opacity-50 text-white font-medium text-sm rounded-lg py-2.5 transition-colors"
            >
              {loading ? "Iniciando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
