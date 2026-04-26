import { useEffect, useState } from "react"
import { Check, Loader2, ChevronDown, ChevronRight, Save } from "lucide-react"
import AdminLayout from "../../components/admin/AdminLayout"

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

const SIZE_OPTS = [
  { value: '',   label: '— tamaño —' },
  { value: 'h1', label: 'H1 — Grande' },
  { value: 'h2', label: 'H2 — Mediano' },
  { value: 'h3', label: 'H3 — Subtítulo' },
  { value: 'p',  label: 'Párrafo' },
]

const SECTIONS: SectionDef[] = [
  // ── Hero ──────────────────────────────────────────────────────────────────
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
        label: 'Título principal (H1)',
        fields: [
          { section: 'hero', key: 'heading', label: 'Título (usa {{palabra}} para el color acento)', type: 'input', withSize: true },
        ],
      },
      {
        label: 'Subtítulo destacado',
        fields: [
          { section: 'hero', key: 'description', label: 'Párrafo principal', type: 'textarea', withSize: true },
        ],
      },
      {
        label: 'Párrafo de apoyo',
        fields: [
          { section: 'hero', key: 'support_text', label: 'Texto secundario (más pequeño)', type: 'textarea' },
        ],
      },
      {
        label: 'Botón primario',
        fields: [
          { section: 'hero', key: 'cta_label', label: 'Texto del botón', type: 'input' },
          { section: 'hero', key: 'cta_href',  label: 'Enlace (href)', type: 'url' },
        ],
      },
      {
        label: 'Botón secundario',
        fields: [
          { section: 'hero', key: 'cta2_label', label: 'Texto del enlace secundario', type: 'input' },
        ],
      },
      {
        label: 'Microcopy',
        fields: [
          { section: 'hero', key: 'microcopy', label: 'Línea de confianza bajo los botones', type: 'input' },
        ],
      },
    ],
  },

  // ── Problema / Solución ───────────────────────────────────────────────────
  {
    id: 'problem_solution',
    label: 'Problema / Solución',
    groups: [
      {
        label: 'El Problema — Encabezado',
        fields: [
          { section: 'problem', key: 'label',   label: 'Etiqueta', type: 'input' },
          { section: 'problem', key: 'heading', label: 'Título', type: 'input', withSize: true },
        ],
      },
      {
        label: 'El Problema — Párrafo 1',
        fields: [
          { section: 'problem', key: 'description', label: 'Primer párrafo', type: 'textarea' },
        ],
      },
      {
        label: 'El Problema — Párrafo 2',
        fields: [
          { section: 'problem', key: 'description_2', label: 'Segundo párrafo (consecuencias)', type: 'textarea' },
        ],
      },
      {
        label: 'El Problema — Párrafo 3',
        fields: [
          { section: 'problem', key: 'description_3', label: 'Tercer párrafo (dónde entramos)', type: 'textarea' },
        ],
      },
      {
        label: 'La Solución — Encabezado',
        fields: [
          { section: 'solution', key: 'label',   label: 'Etiqueta', type: 'input' },
          { section: 'solution', key: 'heading', label: 'Título', type: 'input', withSize: true },
        ],
      },
      {
        label: 'Pilar 1',
        fields: [
          { section: 'solution', key: 'item1_title', label: 'Título', type: 'input' },
          { section: 'solution', key: 'item1_desc',  label: 'Descripción', type: 'textarea' },
        ],
      },
      {
        label: 'Pilar 2',
        fields: [
          { section: 'solution', key: 'item2_title', label: 'Título', type: 'input' },
          { section: 'solution', key: 'item2_desc',  label: 'Descripción', type: 'textarea' },
        ],
      },
      {
        label: 'Pilar 3',
        fields: [
          { section: 'solution', key: 'item3_title', label: 'Título', type: 'input' },
          { section: 'solution', key: 'item3_desc',  label: 'Descripción', type: 'textarea' },
        ],
      },
    ],
  },

  // ── Servicios ─────────────────────────────────────────────────────────────
  {
    id: 'services',
    label: 'Servicios',
    groups: [
      {
        label: 'Encabezado de sección',
        fields: [
          { section: 'services', key: 'heading',    label: 'Título (usa {{Shopify}} para el acento)', type: 'input', withSize: true },
          { section: 'services', key: 'subheading', label: 'Subtítulo', type: 'input' },
        ],
      },
      {
        label: 'Servicio 01 — Desarrollo de Apps (tarjeta destacada)',
        fields: [
          { section: 'services', key: 'main_label', label: 'Etiqueta', type: 'input' },
          { section: 'services', key: 'main_title', label: 'Título', type: 'input', withSize: true },
          { section: 'services', key: 'main_desc',  label: 'Descripción', type: 'textarea' },
          { section: 'services', key: 'main_tags',  label: 'Tags (separados por coma)', type: 'input' },
        ],
      },
      {
        label: 'Servicio 02 — Apps Privadas',
        fields: [
          { section: 'services', key: 'card1_title', label: 'Título', type: 'input' },
          { section: 'services', key: 'card1_desc',  label: 'Descripción', type: 'textarea' },
          { section: 'services', key: 'card1_tag',   label: 'Tag', type: 'input' },
        ],
      },
      {
        label: 'Servicio 03 — Integraciones y APIs',
        fields: [
          { section: 'services', key: 'card2_title', label: 'Título', type: 'input' },
          { section: 'services', key: 'card2_desc',  label: 'Descripción', type: 'textarea' },
          { section: 'services', key: 'card2_tag',   label: 'Tag', type: 'input' },
        ],
      },
      {
        label: 'Servicio 04 — Checkout Extensions',
        fields: [
          { section: 'services', key: 'card3_title', label: 'Título', type: 'input' },
          { section: 'services', key: 'card3_desc',  label: 'Descripción', type: 'textarea' },
          { section: 'services', key: 'card3_tag',   label: 'Tag', type: 'input' },
        ],
      },
      {
        label: 'Servicio 05 — Themes + Consultoría',
        fields: [
          { section: 'services', key: 'card4_title', label: 'Título', type: 'input' },
          { section: 'services', key: 'card4_desc',  label: 'Descripción', type: 'textarea' },
          { section: 'services', key: 'card4_tag',   label: 'Tag', type: 'input' },
        ],
      },
    ],
  },

  // ── Apps propias ──────────────────────────────────────────────────────────
  {
    id: 'apps',
    label: 'Apps propias',
    groups: [
      {
        label: 'Encabezado de sección',
        fields: [
          { section: 'apps', key: 'heading',    label: 'Título', type: 'input', withSize: true },
          { section: 'apps', key: 'subheading', label: 'Subtítulo', type: 'textarea' },
        ],
      },
      {
        label: 'App 1 — Calendify Delivery (activa)',
        fields: [
          { section: 'apps', key: 'app1_status',    label: 'Estado (active / upcoming)', type: 'input' },
          { section: 'apps', key: 'app1_badge',     label: 'Texto del badge', type: 'input' },
          { section: 'apps', key: 'app1_title',     label: 'Título', type: 'input' },
          { section: 'apps', key: 'app1_desc',      label: 'Descripción', type: 'textarea' },
          { section: 'apps', key: 'app1_tags',      label: 'Tags (separados por coma)', type: 'input' },
          { section: 'apps', key: 'app1_cta',       label: 'Texto del CTA', type: 'input' },
          { section: 'apps', key: 'app1_store_url', label: 'URL App Store', type: 'url' },
        ],
      },
      {
        label: 'App 2 — Descuentify (próximamente)',
        fields: [
          { section: 'apps', key: 'app2_status',    label: 'Estado (active / upcoming)', type: 'input' },
          { section: 'apps', key: 'app2_badge',     label: 'Texto del badge', type: 'input' },
          { section: 'apps', key: 'app2_title',     label: 'Título', type: 'input' },
          { section: 'apps', key: 'app2_desc',      label: 'Descripción', type: 'textarea' },
          { section: 'apps', key: 'app2_tags',      label: 'Tags (separados por coma)', type: 'input' },
          { section: 'apps', key: 'app2_cta',       label: 'Texto del CTA', type: 'input' },
          { section: 'apps', key: 'app2_store_url', label: 'URL App Store (dejar vacío si no hay)', type: 'url' },
        ],
      },
    ],
  },

  // ── CTA Banner intermedio ─────────────────────────────────────────────────
  {
    id: 'ctabanner',
    label: 'CTA Intermedio (entre Apps y Proceso)',
    groups: [
      {
        label: 'Video de fondo',
        fields: [
          { section: 'ctabanner', key: 'video_url', label: 'URL del video', type: 'url' },
        ],
      },
      {
        label: 'Contenido',
        fields: [
          { section: 'ctabanner', key: 'heading',    label: 'Título (H3)', type: 'input' },
          { section: 'ctabanner', key: 'desc',       label: 'Párrafo', type: 'textarea' },
          { section: 'ctabanner', key: 'cta1_label', label: 'Botón primario', type: 'input' },
          { section: 'ctabanner', key: 'cta2_label', label: 'Botón secundario', type: 'input' },
        ],
      },
    ],
  },

  // ── Proceso ───────────────────────────────────────────────────────────────
  {
    id: 'process',
    label: 'Proceso',
    groups: [
      {
        label: 'Encabezado',
        fields: [
          { section: 'process', key: 'heading',    label: 'Título', type: 'input', withSize: true },
          { section: 'process', key: 'subheading', label: 'Subtítulo', type: 'textarea' },
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

  // ── FAQ ───────────────────────────────────────────────────────────────────
  {
    id: 'faq',
    label: 'FAQ (11 preguntas)',
    groups: [
      {
        label: 'Encabezado',
        fields: [
          { section: 'faq', key: 'heading',       label: 'Título',                    type: 'input',    withSize: true },
          { section: 'faq', key: 'subheading',    label: 'Subtítulo',                 type: 'textarea' },
          { section: 'faq', key: 'contact_label', label: 'Texto del enlace contacto', type: 'input' },
          { section: 'faq', key: 'contact_href',  label: 'Enlace contacto (href)',    type: 'url' },
        ],
      },
      ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => ({
        label: `Pregunta ${n}`,
        fields: [
          { section: 'faq', key: `q${n}`, label: 'Pregunta',  type: 'input'    as FieldType },
          { section: 'faq', key: `a${n}`, label: 'Respuesta', type: 'textarea' as FieldType },
        ],
      })),
    ],
  },

  // ── CTA Final ─────────────────────────────────────────────────────────────
  {
    id: 'ctafinal',
    label: 'CTA Final',
    groups: [
      {
        label: 'Contenido',
        fields: [
          { section: 'ctafinal', key: 'label',      label: 'Etiqueta (pill superior)', type: 'input' },
          { section: 'ctafinal', key: 'heading',    label: 'Título (H2)',              type: 'input' },
          { section: 'ctafinal', key: 'desc',       label: 'Párrafo',                 type: 'textarea' },
          { section: 'ctafinal', key: 'cta1_label', label: 'Botón primario',          type: 'input' },
          { section: 'ctafinal', key: 'cta2_label', label: 'Botón secundario',        type: 'input' },
          { section: 'ctafinal', key: 'microcopy',  label: 'Microcopy inferior',      type: 'input' },
        ],
      },
    ],
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  {
    id: 'footer',
    label: 'Footer',
    groups: [
      {
        label: 'Información de marca',
        fields: [
          { section: 'footer', key: 'description', label: 'Descripción de la empresa', type: 'textarea' },
          { section: 'footer', key: 'email',       label: 'Email de contacto',          type: 'input' },
          { section: 'footer', key: 'copyright',   label: 'Texto de copyright',         type: 'input' },
        ],
      },
    ],
  },
]

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
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <button onClick={() => setOpen(o => !o)} className="flex items-center gap-3 flex-1 text-left">
          {open
            ? <ChevronDown size={15} className="text-[#4361EE]" />
            : <ChevronRight size={15} className="text-[#7B8DB0]" />}
          <span className="text-[17px] font-semibold text-white">{cfg.label}</span>
        </button>
        <SaveBtn />
      </div>

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
          <div className="flex pt-2 border-t border-white/[0.04]">
            <SaveBtn bottom />
          </div>
        </div>
      )}
    </div>
  )
}

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
          rows={4}
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
