import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { Check, Loader2, ChevronDown, ChevronRight } from "lucide-react"
import AdminLayout from "../../components/admin/AdminLayout"

interface Entry { id: string; section: string; key: string; value: string }

const LONG_KEYS = ["description", "desc", "content", "excerpt", "value", "a1","a2","a3","a4","a5","a6"]
const isLong = (key: string) => LONG_KEYS.some(k => key.toLowerCase().includes(k))

function EntryRow({ entry, token, onSaved }: { entry: Entry; token: string; onSaved: (id: string, v: string) => void }) {
  const [value, setValue] = useState(entry.value)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const dirty = value !== entry.value

  async function save() {
    setSaving(true)
    try {
      await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ section: entry.section, key: entry.key, value }),
      })
      onSaved(entry.id, value)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-1.5 py-3 border-b border-white/[0.04] last:border-0">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-[#7B8DB0]">{entry.key}</span>
        {(dirty || saved) && (
          <button
            onClick={save}
            disabled={saving || !dirty}
            className={`flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-full transition-all ${
              saved ? "bg-[#10B981]/15 text-[#10B981]" : "bg-[#4361EE]/15 text-[#4361EE] hover:bg-[#4361EE]/25"
            }`}
          >
            {saving ? <Loader2 size={11} className="animate-spin" /> : saved ? <Check size={11} /> : null}
            {saving ? "Guardando" : saved ? "Guardado" : "Guardar"}
          </button>
        )}
      </div>
      {isLong(entry.key) ? (
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          rows={3}
          className="w-full bg-[#07090F] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[#EDF0FF] focus:outline-none focus:border-[#4361EE] transition-colors resize-y font-sans leading-relaxed"
        />
      ) : (
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-full bg-[#07090F] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[#EDF0FF] focus:outline-none focus:border-[#4361EE] transition-colors"
        />
      )}
    </div>
  )
}

function SectionCard({
  section, entries, token, onSaved, defaultOpen,
}: {
  section: string; entries: Entry[]; token: string; onSaved: (id: string, v: string) => void; defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-[#0C0F1A] border border-white/[0.06] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          {open ? <ChevronDown size={14} className="text-[#4361EE]" /> : <ChevronRight size={14} className="text-[#7B8DB0]" />}
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#4361EE]">{section}</span>
          <span className="text-xs text-[#7B8DB0]">{entries.length} entradas</span>
        </div>
      </button>
      {open && (
        <div className="px-5 pb-2 border-t border-white/[0.04]">
          {entries.map(e => (
            <EntryRow key={e.id} entry={e} token={token} onSaved={onSaved} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ContentPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [params] = useSearchParams()
  const filterSection = params.get("section")
  const token = localStorage.getItem("admin_token") || ""

  useEffect(() => {
    fetch("/api/content", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setEntries(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token])

  const handleSaved = useCallback((id: string, value: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, value } : e))
  }, [])

  const grouped = entries.reduce<Record<string, Entry[]>>((acc, e) => {
    if (!acc[e.section]) acc[e.section] = []
    acc[e.section].push(e)
    return acc
  }, {})

  const sections = filterSection
    ? Object.keys(grouped).filter(s => s === filterSection)
    : Object.keys(grouped)

  return (
    <AdminLayout title="Contenido del sitio">
      {loading ? (
        <div className="flex items-center gap-2 text-[#7B8DB0] text-sm">
          <Loader2 size={16} className="animate-spin" /> Cargando...
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filterSection && (
            <p className="text-xs text-[#7B8DB0] mb-2">
              Mostrando sección: <span className="text-[#4361EE] font-mono">{filterSection}</span>
            </p>
          )}
          {sections.map((section, i) => (
            <SectionCard
              key={section}
              section={section}
              entries={grouped[section]}
              token={token}
              onSaved={handleSaved}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
