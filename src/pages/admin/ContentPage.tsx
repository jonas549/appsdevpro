import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { Check, Loader2, ChevronDown, ChevronRight } from "lucide-react"
import AdminLayout from "../../components/admin/AdminLayout"

interface Entry { id: string; section: string; key: string; value: string }

const SECTION_NAMES: Record<string, string> = {
  hero: 'Hero',
  problem: 'Problema',
  solution: 'Solución',
  services: 'Servicios',
  apps: 'Apps',
  process: 'Proceso',
  faq: 'FAQ',
}

const LABELS: Record<string, Record<string, string>> = {
  hero: {
    heading_line1: 'Título — Línea 1',
    heading_line2: 'Título — Línea 2',
    description: 'Descripción',
    cta_label: 'Botón — Texto',
    cta_href: 'Botón — Enlace',
    video_url: 'URL del video',
  },
  problem: {
    label: 'Etiqueta de sección',
    heading: 'Título',
    description: 'Descripción',
  },
  solution: {
    label: 'Etiqueta de sección',
    heading: 'Título',
    item1_title: 'Item 1 — Título', item1_desc: 'Item 1 — Descripción',
    item2_title: 'Item 2 — Título', item2_desc: 'Item 2 — Descripción',
    item3_title: 'Item 3 — Título', item3_desc: 'Item 3 — Descripción',
  },
  services: {
    heading: 'Título', subheading: 'Subtítulo',
    main_label: 'Principal — Etiqueta',
    main_title: 'Principal — Título',
    main_desc: 'Principal — Descripción',
    main_tags: 'Principal — Tags',
    card1_id: 'Tarjeta 1 — ID', card1_title: 'Tarjeta 1 — Título', card1_desc: 'Tarjeta 1 — Descripción', card1_tag: 'Tarjeta 1 — Tag',
    card2_id: 'Tarjeta 2 — ID', card2_title: 'Tarjeta 2 — Título', card2_desc: 'Tarjeta 2 — Descripción', card2_tag: 'Tarjeta 2 — Tag',
    card3_id: 'Tarjeta 3 — ID', card3_title: 'Tarjeta 3 — Título', card3_desc: 'Tarjeta 3 — Descripción', card3_tag: 'Tarjeta 3 — Tag',
    card4_id: 'Tarjeta 4 — ID', card4_title: 'Tarjeta 4 — Título', card4_desc: 'Tarjeta 4 — Descripción', card4_tag: 'Tarjeta 4 — Tag',
  },
  apps: {
    heading: 'Título', subheading: 'Subtítulo',
    app1_badge: 'App 1 — Badge', app1_title: 'App 1 — Título', app1_desc: 'App 1 — Descripción', app1_tags: 'App 1 — Tags',
    app2_badge: 'App 2 — Badge', app2_title: 'App 2 — Título', app2_desc: 'App 2 — Descripción', app2_tags: 'App 2 — Tags',
  },
  process: {
    heading: 'Título', subheading: 'Subtítulo',
    step1_num: 'Paso 1 — Número', step1_title: 'Paso 1 — Título', step1_desc: 'Paso 1 — Descripción',
    step2_num: 'Paso 2 — Número', step2_title: 'Paso 2 — Título', step2_desc: 'Paso 2 — Descripción',
    step3_num: 'Paso 3 — Número', step3_title: 'Paso 3 — Título', step3_desc: 'Paso 3 — Descripción',
    step4_num: 'Paso 4 — Número', step4_title: 'Paso 4 — Título', step4_desc: 'Paso 4 — Descripción',
    step5_num: 'Paso 5 — Número', step5_title: 'Paso 5 — Título', step5_desc: 'Paso 5 — Descripción',
  },
  faq: {
    heading: 'Título', subheading: 'Subtítulo',
    contact_label: 'Contacto — Texto',
    contact_href: 'Contacto — Enlace',
    q1: 'Pregunta 1', a1: 'Respuesta 1',
    q2: 'Pregunta 2', a2: 'Respuesta 2',
    q3: 'Pregunta 3', a3: 'Respuesta 3',
    q4: 'Pregunta 4', a4: 'Respuesta 4',
    q5: 'Pregunta 5', a5: 'Respuesta 5',
    q6: 'Pregunta 6', a6: 'Respuesta 6',
  },
}

function getLabel(section: string, key: string): string {
  return LABELS[section]?.[key]
    ?? key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const SIZE_OPTS = [
  { value: '', label: '— tamaño —' },
  { value: 'h1', label: 'H1 — Título grande' },
  { value: 'h2', label: 'H2 — Título mediano' },
  { value: 'h3', label: 'H3 — Subtítulo' },
  { value: 'p',  label: 'Párrafo' },
]

const NO_SIZE_FRAGMENTS = ['url', 'href', 'tags', 'num', 'id', 'badge']
const showSizeControl = (key: string) =>
  !NO_SIZE_FRAGMENTS.some(f => key.toLowerCase().includes(f))

const LONG_KEYS = ['description', 'desc', 'content', 'excerpt', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6']
const isLong = (key: string) => LONG_KEYS.some(k => key.toLowerCase().includes(k))

function EntryRow({
  entry, token, onSaved, sizeValue, onSizeSaved,
}: {
  entry: Entry; token: string; onSaved: (id: string, v: string) => void
  sizeValue: string; onSizeSaved: (sizeKey: string, size: string) => void
}) {
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

  async function saveSize(size: string) {
    const sizeKey = entry.key + '_size'
    await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ section: entry.section, key: sizeKey, value: size }),
    })
    onSizeSaved(sizeKey, size)
  }

  return (
    <div className="flex flex-col gap-2 py-4 border-b border-white/[0.04] last:border-0">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[16px] font-medium text-white">{getLabel(entry.section, entry.key)}</span>
        <div className="flex items-center gap-2">
          {showSizeControl(entry.key) && (
            <select
              value={sizeValue}
              onChange={e => saveSize(e.target.value)}
              className="bg-[#07090F] border border-white/[0.08] rounded-lg px-2 py-1 text-[14px] text-[#A5B0CC] focus:outline-none focus:border-[#4361EE] transition-colors cursor-pointer"
            >
              {SIZE_OPTS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}
          {(dirty || saved) && (
            <button
              onClick={save}
              disabled={saving || !dirty}
              className={`flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-full transition-all ${
                saved
                  ? "bg-[#10B981]/15 text-[#10B981]"
                  : "bg-[#4361EE]/15 text-[#4361EE] hover:bg-[#4361EE]/25"
              }`}
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : saved ? <Check size={12} /> : null}
              {saving ? "Guardando…" : saved ? "Guardado" : "Guardar"}
            </button>
          )}
        </div>
      </div>
      {isLong(entry.key) ? (
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          rows={3}
          className="w-full bg-[#07090F] border border-white/[0.08] rounded-lg px-3 py-2 text-[16px] text-white focus:outline-none focus:border-[#4361EE] transition-colors resize-y font-sans leading-relaxed"
        />
      ) : (
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-full bg-[#07090F] border border-white/[0.08] rounded-lg px-3 py-2 text-[16px] text-white focus:outline-none focus:border-[#4361EE] transition-colors"
        />
      )}
    </div>
  )
}

function SectionCard({
  section, entries, token, onSaved, defaultOpen,
}: {
  section: string; entries: Entry[]; token: string
  onSaved: (id: string, v: string) => void; defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  const [sizeMap, setSizeMap] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      entries.filter(e => e.key.endsWith('_size')).map(e => [e.key, e.value])
    )
  )

  const displayEntries = entries.filter(e => !e.key.endsWith('_size'))
  const sectionName = SECTION_NAMES[section] ?? (section.charAt(0).toUpperCase() + section.slice(1))

  return (
    <div className="bg-[#0C0F1A] border border-white/[0.06] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          {open
            ? <ChevronDown size={15} className="text-[#4361EE]" />
            : <ChevronRight size={15} className="text-[#7B8DB0]" />}
          <span className="text-[17px] font-semibold text-white">{sectionName}</span>
          <span className="text-[14px] text-[#A5B0CC]">{displayEntries.length} campos</span>
        </div>
      </button>
      {open && (
        <div className="px-5 pb-2 border-t border-white/[0.04]">
          {displayEntries.map(e => (
            <EntryRow
              key={e.id}
              entry={e}
              token={token}
              onSaved={onSaved}
              sizeValue={sizeMap[e.key + '_size'] ?? ''}
              onSizeSaved={(sizeKey, size) =>
                setSizeMap(prev => ({ ...prev, [sizeKey]: size }))
              }
            />
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
        <div className="flex items-center gap-2 text-white text-base">
          <Loader2 size={18} className="animate-spin" /> Cargando…
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filterSection && (
            <p className="text-[15px] text-[#A5B0CC] mb-2">
              Sección:{" "}
              <span className="text-[#4361EE] font-semibold">
                {SECTION_NAMES[filterSection] ?? filterSection}
              </span>
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
          {sections.length === 0 && (
            <p className="text-[#A5B0CC] text-[15px]">No hay contenido en la base de datos todavía.</p>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
