'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/app/components/admin/AdminLayout'
import ProtectedRoute from '@/app/components/admin/ProtectedRoute'

interface Lead {
  id: string
  name: string
  email: string
  phone_code: string
  phone: string
  company: string | null
  budget: string | null
  message: string
  status: string
  createdAt: string
}

const PAGE_SIZE = 15

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    unread:    { label: 'Sin leer',   cls: 'bg-blue-50 text-blue-700 border-blue-100' },
    read:      { label: 'Leído',      cls: 'bg-slate-100 text-slate-600 border-slate-200' },
    contacted: { label: 'Contactado', cls: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    closed:    { label: 'Cerrado',    cls: 'bg-slate-50 text-slate-400 border-slate-100' },
  }
  const s = map[status] ?? { label: status, cls: 'bg-slate-100 text-slate-500 border-slate-200' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${s.cls}`}>
      {s.label}
    </span>
  )
}

function LeadsContent() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Lead | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'contacted' | 'closed'>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [updating, setUpdating] = useState(false)
  const [loadError, setLoadError] = useState('')
  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : ''

  useEffect(() => {
    let cancelled = false

    async function loadLeads() {
      try {
        const res = await fetch('/api/leads', { headers: { Authorization: `Bearer ${token}` } })

        // Sesión caducada o inválida: el token guardado ya no sirve, al login.
        if (res.status === 401) {
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_email')
          router.replace('/admin/login')
          return
        }

        if (!res.ok) throw new Error(`El servidor respondió ${res.status}`)

        // El endpoint devuelve { error: "..." } en los fallos, no una lista:
        // sin esta guarda, un objeto acabaría en el estado y `leads.filter`
        // reventaría el render.
        const data: unknown = await res.json()
        if (!Array.isArray(data)) throw new Error('Respuesta inesperada del servidor')

        if (!cancelled) { setLeads(data as Lead[]); setLoading(false) }
      } catch (err) {
        console.error('[leads] No se pudieron cargar los leads:', err)
        if (!cancelled) {
          setLeads([])
          setLoadError(err instanceof Error ? err.message : 'Error de conexión')
          setLoading(false)
        }
      }
    }

    loadLeads()
    return () => { cancelled = true }
  }, [token, router])

  async function markAs(lead: Lead, status: string) {
    setUpdating(true)
    await fetch(`/api/leads/${lead.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    })
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status } : l))
    if (selected?.id === lead.id) setSelected({ ...lead, status })
    setUpdating(false)
  }

  function openModal(lead: Lead) {
    setSelected(lead)
    if (lead.status === 'unread') {
      markAs(lead, 'read').catch(() => {})
    }
  }

  async function deleteLead(lead: Lead) {
    setDeleting(true)
    await fetch(`/api/leads/${lead.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setLeads(prev => prev.filter(l => l.id !== lead.id))
    if (selected?.id === lead.id) setSelected(null)
    setDeleteTarget(null)
    setDeleting(false)
  }

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.company || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || l.status === filter
    return matchSearch && matchFilter
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const unreadCount = leads.filter(l => l.status === 'unread').length

  const tabCls = (active: boolean) =>
    `text-sm transition-colors ${active ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-adm-primary'}`

  return (
    <AdminLayout title="Leads">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total leads', value: leads.length, icon: 'contacts' },
          { label: 'Sin leer',    value: unreadCount,  icon: 'mark_email_unread', highlight: unreadCount > 0 },
          { label: 'Contactados', value: leads.filter(l => l.status === 'contacted').length, icon: 'phone_in_talk' },
          { label: 'Cerrados',    value: leads.filter(l => l.status === 'closed').length,    icon: 'check_circle' },
        ].map(s => (
          <div key={s.label} className="bg-white p-5 rounded-xl shadow-sm" style={{ border: '1px solid #CBD5E1' }}>
            <div className="flex items-center justify-between mb-3">
              <span
                className="material-symbols-outlined p-2 rounded-lg"
                style={{ fontSize: 20, color: s.highlight ? '#4361EE' : '#64748B', background: s.highlight ? 'rgba(67,97,238,0.1)' : '#F1F5F9' }}
              >
                {s.icon}
              </span>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#334155' }}>{s.label}</p>
            <h3 className="text-[28px] font-bold leading-none mt-1" style={{ color: s.highlight ? '#4361EE' : '#0F172A' }}>{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <div className="relative w-full md:w-80 group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-adm-primary transition-colors" style={{ fontSize: 20 }}>search</span>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg text-sm focus:ring-2 focus:ring-adm-primary-container/20 transition-all outline-none"
            style={{ border: '1px solid #94A3B8', color: '#0F172A' }}
            placeholder="Buscar por nombre, email, empresa..."
          />
        </div>
        <nav className="flex items-center gap-5 border-l pl-5" style={{ borderLeftColor: '#CBD5E1' }}>
          {(['all', 'unread', 'read', 'contacted', 'closed'] as const).map(f => (
            <button key={f} onClick={() => { setFilter(f); setPage(1) }} className={tabCls(filter === f)}>
              {f === 'all' ? 'Todos' : f === 'unread' ? 'Sin leer' : f === 'read' ? 'Leídos' : f === 'contacted' ? 'Contactados' : 'Cerrados'}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1px solid #CBD5E1' }}>
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-slate-400">
            <span className="material-symbols-outlined animate-spin" style={{ fontSize: 24 }}>progress_activity</span>
            <span className="text-sm">Cargando leads...</span>
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
            <span className="material-symbols-outlined text-red-400" style={{ fontSize: 40 }}>error_outline</span>
            <p className="text-sm text-slate-600 font-medium">No se pudieron cargar los leads.</p>
            <p className="text-xs text-slate-400">{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-1 px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-all active:scale-[0.98]"
              style={{ background: '#4361EE' }}
            >
              Reintentar
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
            <span className="material-symbols-outlined" style={{ fontSize: 40 }}>contacts</span>
            <p className="text-sm">{search ? 'No hay resultados.' : 'No hay leads todavía.'}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ background: '#E2E8F0', borderBottom: '1px solid #CBD5E1' }}>
                    {['Nombre', 'Email', 'Empresa', 'Presupuesto', 'Estado', 'Fecha', '', ''].map((h, i) => (
                      <th key={i} className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#334155' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {paginated.map(lead => (
                    <tr
                      key={lead.id}
                      onClick={() => openModal(lead)}
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${lead.status === 'unread' ? 'bg-blue-50/40' : ''}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {lead.status === 'unread' && <span className="w-2 h-2 rounded-full bg-[#4361EE] flex-shrink-0" />}
                          <span className="text-[14px] font-semibold text-slate-900">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[13px] text-slate-600">{lead.email}</td>
                      <td className="px-5 py-4 text-[13px] text-slate-500">{lead.company || '—'}</td>
                      <td className="px-5 py-4 text-[13px] text-slate-500">{lead.budget || '—'}</td>
                      <td className="px-5 py-4">{statusBadge(lead.status)}</td>
                      <td className="px-5 py-4 text-[13px] text-slate-500">{formatDate(lead.createdAt)}</td>
                      <td className="px-5 py-4">
                        <span className="material-symbols-outlined text-slate-300" style={{ fontSize: 18 }}>chevron_right</span>
                      </td>
                      <td className="px-3 py-4">
                        <button
                          onClick={e => { e.stopPropagation(); setDeleteTarget(lead) }}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#F1F5F9', borderTop: '1px solid #CBD5E1' }}>
              <p className="text-xs text-slate-500 font-medium">
                {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length} leads
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_left</span>
                </button>
                <span className="text-xs font-bold text-slate-900">{page}</span>
                <span className="text-xs text-slate-400">/ {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_right</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" style={{ border: '1px solid #CBD5E1' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#FEF2F2' }}>
                <span className="material-symbols-outlined text-red-500" style={{ fontSize: 20 }}>delete_forever</span>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">Eliminar lead</h3>
                <p className="text-[13px] text-slate-500">{deleteTarget.name}</p>
              </div>
            </div>
            <p className="text-[14px] text-slate-600 mb-6">¿Estás seguro? Esta acción no se puede deshacer.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-slate-600 transition-all active:scale-[0.98]"
                style={{ background: '#F1F5F9', border: '1px solid #CBD5E1' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteLead(deleteTarget)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-60"
                style={{ background: '#EF4444' }}
              >
                {deleting ? 'Eliminando…' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
            style={{ border: '1px solid #CBD5E1' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: '#E2E8F0', borderBottom: '1px solid #CBD5E1' }}>
              <div>
                <h2 className="text-[16px] font-bold text-slate-900">{selected.name}</h2>
                <p className="text-[12px] text-slate-500">{formatDate(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Email', value: selected.email, icon: 'email' },
                  { label: 'Teléfono', value: `${selected.phone_code} ${selected.phone}`, icon: 'phone' },
                  { label: 'Empresa', value: selected.company || '—', icon: 'business' },
                  { label: 'Presupuesto', value: selected.budget || '—', icon: 'payments' },
                ].map(field => (
                  <div key={field.label}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>{field.label}</p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400" style={{ fontSize: 14 }}>{field.icon}</span>
                      <span className="text-[13px] text-slate-900 font-medium">{field.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748B' }}>Mensaje</p>
                <div className="rounded-xl p-4 text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  {selected.message}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748B' }}>Estado actual</p>
                {statusBadge(selected.status)}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <a
                  href={`https://wa.me/${selected.phone_code.replace('+', '')}${selected.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-all active:scale-[0.98]"
                  style={{ background: '#25D366' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all active:scale-[0.98]"
                  style={{ background: '#EEF2FF', color: '#4361EE', border: '1px solid rgba(67,97,238,0.2)' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>email</span>
                  Email
                </a>
                {selected.status !== 'contacted' && (
                  <button
                    disabled={updating}
                    onClick={() => markAs(selected, 'contacted')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50"
                    style={{ background: '#4361EE' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>phone_in_talk</span>
                    Marcar contactado
                  </button>
                )}
                {selected.status !== 'closed' && (
                  <button
                    disabled={updating}
                    onClick={() => markAs(selected, 'closed')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-slate-600 transition-all active:scale-[0.98] disabled:opacity-50"
                    style={{ background: '#F1F5F9', border: '1px solid #CBD5E1' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
                    Cerrar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default function LeadsPage() {
  return <ProtectedRoute><LeadsContent /></ProtectedRoute>
}
