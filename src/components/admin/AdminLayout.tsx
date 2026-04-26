import { NavLink, useNavigate } from "react-router-dom"
import { LayoutDashboard, FileText, BookOpen, LogOut, Zap } from "lucide-react"
import type { ReactNode } from "react"

const nav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/content",   label: "Contenido",  icon: FileText },
  { to: "/admin/blog",      label: "Blog",        icon: BookOpen },
]

export default function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const navigate = useNavigate()
  const email = localStorage.getItem("admin_email") || ""

  function logout() {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_email")
    navigate("/admin/login")
  }

  return (
    <div className="flex h-screen bg-[#07090F] text-[#EDF0FF] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col border-r border-white/[0.06] bg-[#0C0F1A]">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/[0.06]">
          <div className="w-7 h-7 rounded-lg bg-[#4361EE] flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight">AppsDevPro</span>
          <span className="ml-auto text-[10px] font-mono text-[#4361EE] bg-[#4361EE]/10 px-2 py-0.5 rounded-full">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-[#4361EE]/15 text-[#4361EE]"
                    : "text-[#7B8DB0] hover:bg-white/[0.04] hover:text-[#EDF0FF]"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <div className="px-3 py-2 mb-1">
            <p className="text-[11px] text-[#7B8DB0] truncate">{email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#7B8DB0] hover:text-red-400 hover:bg-red-400/[0.06] transition-all duration-150"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-8 py-5 border-b border-white/[0.06] flex items-center">
          <h1 className="text-lg font-semibold">{title}</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
