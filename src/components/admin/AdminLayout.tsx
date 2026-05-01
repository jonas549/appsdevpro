import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState, type ReactNode } from "react"

const nav = [
  { to: "/admin/dashboard", label: "Dashboard",    icon: "dashboard" },
  { to: "/admin/content",   label: "Contenido",    icon: "inventory_2" },
  { to: "/admin/blog",      label: "Blog",         icon: "article" },
  { to: "/admin/leads",     label: "Leads",        icon: "contacts" },
  { to: "/admin/settings",  label: "Configuración",icon: "settings" },
]

interface AdminLayoutProps {
  children: ReactNode
  title: string
  headerActions?: ReactNode
}

export default function AdminLayout({ children, title, headerActions }: AdminLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [unreadLeads, setUnreadLeads] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    fetch("/api/leads", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then((data: { status: string }[]) => setUnreadLeads(data.filter(l => l.status === "unread").length))
      .catch(() => {})
  }, [location.pathname])

  function logout() {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_email")
    navigate("/admin/login")
  }

  // Breadcrumb
  const breadcrumb = location.pathname.startsWith("/admin/blog/")
    ? [{ label: "Blog", href: "/admin/blog" }, { label: title }]
    : [{ label: title }]

  return (
    <div className="flex min-h-screen font-sans text-adm-on-surface antialiased" style={{ background: '#F1F5F9' }}>
      {/* Sidebar */}
      <aside className="w-[260px] h-screen fixed left-0 top-0 border-r border-slate-200 bg-white shadow-sm flex flex-col py-6 z-50">
        {/* Brand */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-adm-primary-container rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-white" style={{ fontSize: 18 }}>developer_mode_tv</span>
          </div>
          <div>
            <h1 className="text-[15px] font-bold tracking-tight text-slate-900 leading-tight">AppsDevPro</h1>
            <p className="text-[11px] text-slate-500">Admin Dashboard</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {nav.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-all"
                  : "flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-all duration-200 active:scale-[0.98]"
              }
              style={({ isActive }) => isActive ? { background: '#4361EE', color: '#ffffff' } : {}}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
              <span className="text-[13px] flex-1">{label}</span>
              {to === "/admin/leads" && unreadLeads > 0 && (
                <span className="text-[10px] font-bold bg-[#4361EE] text-white rounded-full px-1.5 py-0.5 leading-none min-w-[18px] text-center" style={{ background: '#EF4444' }}>
                  {unreadLeads}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="mt-auto px-3 border-t border-slate-100 pt-4 space-y-0.5">
          <a className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50 transition-all duration-200 active:scale-[0.98]" href="#">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>account_circle</span>
            <span className="text-[13px]">Perfil</span>
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
            <span className="text-[13px]">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-[260px] flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="fixed top-0 right-0 left-[260px] h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 flex items-center justify-between px-8">
          <div className="flex items-center gap-2">
            {breadcrumb.length > 1 ? (
              <>
                <NavLink to={breadcrumb[0].href!} className="text-slate-500 text-[14px] hover:text-adm-primary transition-colors">
                  {breadcrumb[0].label}
                </NavLink>
                <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
                <span className="text-slate-900 text-[14px] font-semibold">{breadcrumb[1].label}</span>
              </>
            ) : (
              <span className="text-slate-900 text-[20px] font-semibold tracking-tight">{title}</span>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center gap-3">{headerActions}</div>
          )}
        </header>

        {/* Page content */}
        <main className="pt-16 flex-1">
          <div className="max-w-[1440px] mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
