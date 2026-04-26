import { useEffect, useState } from "react"
import { Check, Loader2, ChevronDown, ChevronRight, Save } from "lucide-react"
import AdminLayout from "../../components/admin/AdminLayout"

// ── Types ─────────────────────────────────────────────────────────────────────

type FieldType = 'input' | 'textarea' | 'url'

interface FieldDef {
  section: string
  key: string
  label: string
  type: FieldType
  withSize?: boolean
}

interface GroupDef {
  label: string
  fields: FieldDef[]
}

interface SectionDef {
  id: string
  label: string
  groups: GroupDef[]
}

type Values = Record<string, string>

// ── Section configuration ─────────────────────────────────────────────────────

const SIZE_OPTS = [
  { value: '',   label: '— tamaño —' },
  { value: 'h1', label: 'H1 — Grande' },
  { value: 'h2', label: 'H2 — Mediano' },
  { value: 'h3', label: 'H3 — Subtítulo' },
  { value: 'p',  label: 'Párrafo' },
]

const SECTIONS: SectionDef[] = [
  {
    id: 'hero',
    label: 'Hero',
    groups: [
      {
        label: 'Video de fondo',
        fields: [
          { section: 'hero', key: 'video_url', label: 'URL del video', type: 'url' },
        ],
      },
      {
        label: 'Título principal',
        fields: [
          { section: 'hero', key: 'heading_line1', label: 'Línea 1', type: 'input', withSize: true },
          { section: 'hero', key: 'heading_line2', label: 'Línea 2 (acento azul)', type: 'input', withSize: true },
        ],
      },
      {
        label: 'Descripción',
        fields: [
          { section: 'hero', key: 'description', label: 'Texto', type: 'textarea', withSize: true },
        ],
      },
      {
        label: 'Botón CTA',
        fields: [
          { section: 'hero', key: 'cta_label', label: 'Texto del botón', type: 'input' },
          { section: 'hero', key: 'cta_href', label: 'Enlace (href)', type: 'url' },
        ],
      },
    ],
  },
  {
    id: 'problem_solution',
    label: 'Problema / Solución',
    groups: [
      {
        label: 'Columna izquierda — El Problema',
        fields: [
          { section: 'problem', key: 'label', label: 'Etiqueta', type: 'input' },
          { section: 'problem', key: 'heading', label: 'Título', type: 'input', withSize: true },
          { section: 'problem', key: 'description', label: 'Párrafo', type: 'textarea' },
        ],
      },
      {
        label: 'Columna derecha — La Solución',
        fields: [
          { section: 'solution', key: 'label', label: 'Etiqueta', type: 'input' },
          { section: 'solution', key: 'heading', label: 'Título', type: 'input', withSize: true },
        ],
      },
      {
        label: 'Card 1',
        fields: [
          { section: 'solution', key: 'item1_title', label: 'Título', type: 'input' },
          { section: 'solution', key: 'item1_desc', label: 'Descripción', type: 'textarea' },
        ],
      },
      {
        label: 'Card 2',
        fields: [
          { section: 'solution', key: 'item2_title', label: 'Título', type: 'input' },
          { section: 'solution', key: 'item2_desc', label: 'Descripción', type: 'textarea' },
        ],
      },
      {
        label: 'Card 3',
        fields: [
          { section: 'solution', key: 'item3_title', label: 'Título', type: 'input' },
          { section: 'solution', key: 'item3_desc', label: 'Descripción', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'services',
    label: 'Servicios',
    groups: [
      {
        label: 'Encabezado de sección',
        fields: [
          { section: 'services', key: 'heading', label: 'Título', type: 'input', withSize: true },
          { section: 'services', key: 'subheading', label: 'Subtítulo', type: 'input' },
        ],
      },
      {
        label: 'Servicio principal — Desarrollo de Apps',
        fields: [
          { section: 'services', key: 'main_label', label: 'Etiqueta', type: 'input' },
          { section: 'services', key: 'main_title', label: 'Título', type: 'input', withSize: true },
          { section: 'services', key: 'main_desc', label: 'Descripción', type: 'textarea' },
          { section: 'services', key: 'main_tags', label: 'Tags (separados por coma)', type: 'input' },
        ],
      },
      {
        label: 'Tarjeta 1 — Apps Privadas',
        fields: [
          { section: 'services', key: 'card1_title', label: 'Título', type: 'input' },
          { section: 'services', key: 'card1_desc', label: 'Descripción', type: 'textarea' },
          { section: 'services', key: 'card1_tag', label: 'Tag', type: 'input' },
        ],
      },
      {
        label: 'Tarjeta 2 — Integraciones',
        fields: [
          { section: 'services', key: 'card2_title', label: 'Título', type: 'input' },
          { section: 'services', key: 'card2_desc', label: 'Descripción', type: 'textarea' },
          { section: 'services', key: 'card2_tag', label: 'Tag', type: 'input' },
        ],
      },
      {
        label: 'Tarjeta 3 — Checkout Extensions',
        fields: [
          { section: 'services', key: 'card3_title', label: 'Título', type: 'input' },
          { section: 'services', key: 'card3_desc', label: 'Descripción', type: 'textarea' },
          { section: 'services', key: 'card3_tag', label: 'Tag', type: 'input' },
        ],
      },
      {
        label: 'Tarjeta 4 — Themes + Consultoría',
        fields: [
          { section: 'services', key: 'card4_title', label: 'Título', type: 'input' },
          { section: 'services', key: 'card4_desc', label: 'Descripción', type: 'textarea' },
          { section: 'services', key: 'card4_tag', label: 'Tag', type: 'input' },
        ],
      },
    ],
  },
  {
    id: 'apps',
    label: 'Apps',
    groups: [
      {
        label: 'Encabezado de sección',
        fields: [
          { section: 'apps', key: 'heading', label: 'Título', type: 'input', withSize: true },
          { section: 'apps', key: 'subheading', label: 'Subtítulo', type: 'input' },
        ],
      },
      {
        label: 'App 1 — Calendify Delivery',
        fields: [
          { section: 'apps', key: 'app1_badge', label: 'Badge', type: 'input' },
          { section: 'apps', key: 'app1_title', label: 'Título', type: 'input' },
          { section: 'apps', key: 'app1_desc', label: 'Descripción', type: 'textarea' },
          { section: 'apps', key: 'app1_tags', label: 'Tags (separados por coma)', type: 'input' },
        ],
      },
      {
        label: 'App 2 — Descuentify',
        fields: [
          { section: 'apps', key: 'app2_badge', label: 'Badge', type: 'input' },
          { section: 'apps', key: 'app2_title', label: 'Título', type: 'input' },
          { section: 'apps', key: 'app2_desc', label: 'Descripción', type: 'textarea' },
          { section: 'apps', key: 'app2_tags', label: 'Tags (separados por coma)', type: 'input' },
        ],
      },
    ],
  },
  {
    id: 'process',
    label: 'Proceso',
    groups: [
      {
        label: 'Encabezado',
        fields: [
          { section: 'process', key: 'heading', label: 'Título', type: 'input', withSize: true },
          { section: 'process', key: 'subheading', label: 'Subtítulo', type: 'input' },
        ],
      },
      ...[1, 2, 3, 4, 5].map(n => ({
        label: `Paso ${n}`,
        fields: [
          { section: 'process', key: `step${n}_num`,   label: 'Número',      type: 'input'    as FieldType },
          { section: 'process', key: `step${n}_title`, label: 'Título',      type: 'input'    as FieldType },
          { section: 'process', key: `step${n}_desc`,  label: 'Descripción', type: 'textarea' as FieldType },
        ],
      })),
    ],
  },
  {
    id: 'faq',
    label: 'FAQ',
    groups: [
      {
        label: 'Encabezado',
        fields: [
          { section: 'faq', key: 'heading',       label: 'Título',                     type: 'input',    withSize: true },
          { section: 'faq', key: 'subheading',    label: 'Subtítulo',                  type: 'textarea' },
          { section: 'faq', key: 'contact_label', label: 'Texto del enlace contacto',  type: 'input' },
          { section: 'faq', key: 'contact_href',  label: 'Enlace contacto (href)',      type: 'url' },
        ],
      },
      ...[1, 2, 3, 4, 5, 6].map(n => ({
        label: `Pregunta ${n}`,
        fields: [
          { section: 'faq', key: `q${n}`, label: 'Pregunta',  type: 'input'    as FieldType },
          { section: 'faq', key: `a${n}`, label: 'Respuesta', type: 'textarea' as FieldType },
        ],
      })),
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function fk(section: string, key: string) {
  return `${section}/${key}`
}

function getAllKeys(cfg: SectionDef): { section: string; key: string }[] {
  const result: { section: string; key: string }[] = []
  for (const g of cfg.groups) {
    for (const f of g.fields) {
      result.push({ section: f.section, key: f.key })
      if (f.withSize) result.push({ section: f.section, key: f.key + '_size' })
    }
  }
  return result
}

// ── ContentPage ───────────────────────────────────────────────────────────────

export default function ContentPage() {
  const [values, setValues]           = useState<Values>({})
  const [savedValues, setSavedValues] = useState<Values>({})
  const [loading, setLoading]         = useState(true)
  const [savingId, setSavingId]       = useState<string | null>(null)
  const [savedId, setSavedId]         = useState<string | null>(null)
  const token = localStorage.getItem("admin_token") || ""

  useEffect(() => {
    fetch("/api/content", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then((data: { section: string; key: string; value: string }[]) => {
        const map: Values = {}
        for (const { section, key, value } of data) map[fk(section, key)] = value
        setValues(map)
        setSavedValues(map)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [token])

  function update(section: string, key: string, value: string) {
    setValues(prev => ({ ...prev, [fk(section, key)]: value }))
  }

  function isDirty(cfg: SectionDef) {
    return getAllKeys(cfg).some(({ section, key }) => values[fk(section, key)] !== savedValues[fk(section, key)])
  }

  async function save(cfg: SectionDef) {
    setSavingId(cfg.id)
    const dirty = getAllKeys(cfg).filter(({ section, key }) =>
      values[fk(section, key)] !== savedValues[fk(section, key)]
    )
    await Promise.all(dirty.map(({ section, key }) =>
      fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ section, key, value: values[fk(section, key)] ?? "" }),
      })
    ))
    setSavedValues(prev => {
      const next = { ...prev }
      dirty.forEach(({ section, key }) => { next[fk(section, key)] = values[fk(section, key)] ?? "" })
      return next
    })
    setSavingId(null)
    setSavedId(cfg.id)
    setTimeout(() => setSavedId(id => id === cfg.id ? null : id), 2500)
  }

  if (loading) {
    return (
      <AdminLayout title="Contenido del sitio">
        <div className="flex items-center gap-2 text-white text-base">
          <Loader2 size={18} className="animate-spin" /> Cargando…
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Contenido del sitio">
      <div className="flex flex-col gap-4">
        {SECTIONS.map(cfg => (
          <SectionBlock
            key={cfg.id}
            cfg={cfg}
            values={values}
            update={update}
            dirty={isDirty(cfg)}
            saving={savingId === cfg.id}
            justSaved={savedId === cfg.id}
            onSave={() => save(cfg)}
          />
        ))}
      </div>
    </AdminLayout>
  )
}

// ── SectionBlock ──────────────────────────────────────────────────────────────

function SectionBlock({
  cfg, values, update, dirty, saving, justSaved, onSave,
}: {
  cfg: SectionDef
  values: Values
  update: (section: string, key: string, v: string) => void
  dirty: boolean
  saving: boolean
  justSaved: boolean
  onSave: () => void
}) {
  const [open, setOpen] = useState(true)

  const SaveBtn = ({ bottom }: { bottom?: boolean }) => (
    <button
      onClick={onSave}
      disabled={saving || !dirty}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-semibold transition-all ${
        justSaved
          ? "bg-[#10B981]/15 text-[#10B981]"
          : dirty
          ? "bg-[#4361EE] text-white hover:bg-[#3451d1]"
          : "bg-white/[0.04] text-[#7B8DB0] cursor-not-allowed"
      } ${bottom ? "ml-auto" : ""}`}
    >
      {saving
        ? <Loader2 size={14} className="animate-spin" />
        : justSaved
        ? <Check size={14} />
        : <Save size={14} />}
      {saving ? "Guardando…" : justSaved ? "Guardado" : dirty ? "Guardar cambios" : "Sin cambios"}
    </button>
  )

  return (
    <div className="bg-[#0C0F1A] border border-white/[0.06] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <button onClick={() => setOpen(o => !o)} className="flex items-center gap-3 flex-1 text-left">
          {open
            ? <ChevronDown size={15} className="text-[#4361EE]" />
            : <ChevronRight size={15} className="text-[#7B8DB0]" />}
          <span className="text-[17px] font-semibold text-white">{cfg.label}</span>
        </button>
        <SaveBtn />
      </div>

      {/* Body */}
      {open && (
        <div className="px-5 py-5 flex flex-col gap-7">
          {cfg.groups.map(group => (
            <div key={group.label}>
              <p className="text-[12px] font-semibold text-[#4361EE] uppercase tracking-widest mb-3">
                {group.label}
              </p>
              <div className="flex flex-col gap-4">
                {group.fields.map(field => (
                  <FieldRow
                    key={fk(field.section, field.key)}
                    field={field}
                    value={values[fk(field.section, field.key)] ?? ""}
                    sizeValue={values[fk(field.section, field.key + "_size")] ?? ""}
                    onChange={v => update(field.section, field.key, v)}
                    onSizeChange={v => update(field.section, field.key + "_size", v)}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Bottom save */}
          <div className="flex pt-2 border-t border-white/[0.04]">
            <SaveBtn bottom />
          </div>
        </div>
      )}
    </div>
  )
}

// ── FieldRow ──────────────────────────────────────────────────────────────────

function FieldRow({
  field, value, sizeValue, onChange, onSizeChange,
}: {
  field: FieldDef
  value: string
  sizeValue: string
  onChange: (v: string) => void
  onSizeChange: (v: string) => void
}) {
  const base = "w-full bg-[#07090F] border border-white/[0.08] rounded-lg px-3 py-2.5 text-[16px] text-white focus:outline-none focus:border-[#4361EE] transition-colors"

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="text-[15px] font-medium text-white">{field.label}</label>
        {field.withSize && (
          <select
            value={sizeValue}
            onChange={e => onSizeChange(e.target.value)}
            className="bg-[#07090F] border border-white/[0.08] rounded-lg px-2 py-1 text-[13px] text-[#A5B0CC] focus:outline-none focus:border-[#4361EE] transition-colors cursor-pointer"
          >
            {SIZE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        )}
      </div>
      {field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={3}
          className={`${base} resize-y leading-relaxed`}
        />
      ) : (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={field.type === "url" ? "https://…" : ""}
          className={base}
        />
      )}
    </div>
  )
}
