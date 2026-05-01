import { useEffect, useState } from "react"
import AdminLayout from "../../components/admin/AdminLayout"
import RichTextEditor from "../../components/admin/RichTextEditor"

type FieldType = 'input' | 'textarea' | 'url'

interface FieldDef {
  section: string
  key: string
  label: string
  type: FieldType
  withSize?: boolean
  placeholder?: string
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

const TAG_OPTS = [
  { value: '',      label: '— etiqueta —' },
  { value: 'h1',   label: 'H1' },
  { value: 'h2',   label: 'H2' },
  { value: 'h3',   label: 'H3' },
  { value: 'h4',   label: 'H4' },
  { value: 'h5',   label: 'H5' },
  { value: 'p',    label: 'P — Párrafo' },
  { value: 'span', label: 'Span' },
]

const VIDEO_PH_PROBLEM  = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4'
const VIDEO_PH_SERVICES = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_143803_f635b644-d959-4f16-9d29-cedaeb5c6de0.mp4'

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
        label: 'Video de fondo',
        fields: [
          { section: 'problem', key: 'video_url', label: 'URL del video de fondo', type: 'url', placeholder: VIDEO_PH_PROBLEM },
        ],
      },
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
        label: 'Video de fondo',
        fields: [
          { section: 'services', key: 'video_url', label: 'URL del video de fondo', type: 'url', placeholder: VIDEO_PH_SERVICES },
        ],
      },
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
          { section: 'services', key: 'main_label',     label: 'Etiqueta', type: 'input' },
          { section: 'services', key: 'main_title',     label: 'Título', type: 'input', withSize: true },
          { section: 'services', key: 'main_desc',      label: 'Descripción', type: 'textarea' },
          { section: 'services', key: 'main_tags',      label: 'Tags (separados por coma)', type: 'input' },
          { section: 'services', key: 'main_btn_label', label: 'Texto del botón', type: 'input' },
          { section: 'services', key: 'main_btn_href',  label: 'Enlace del botón', type: 'url' },
        ],
      },
      {
        label: 'Servicio 02 — Apps Privadas',
        fields: [
          { section: 'services', key: 'card1_title',     label: 'Título', type: 'input' },
          { section: 'services', key: 'card1_desc',      label: 'Descripción', type: 'textarea' },
          { section: 'services', key: 'card1_tag',       label: 'Tag', type: 'input' },
          { section: 'services', key: 'card1_btn_label', label: 'Texto del botón', type: 'input' },
          { section: 'services', key: 'card1_btn_href',  label: 'Enlace del botón', type: 'url' },
        ],
      },
      {
        label: 'Servicio 03 — Integraciones y APIs',
        fields: [
          { section: 'services', key: 'card2_title',     label: 'Título', type: 'input' },
          { section: 'services', key: 'card2_desc',      label: 'Descripción', type: 'textarea' },
          { section: 'services', key: 'card2_tag',       label: 'Tag', type: 'input' },
          { section: 'services', key: 'card2_btn_label', label: 'Texto del botón', type: 'input' },
          { section: 'services', key: 'card2_btn_href',  label: 'Enlace del botón', type: 'url' },
        ],
      },
      {
        label: 'Servicio 04 — Checkout Extensions',
        fields: [
          { section: 'services', key: 'card3_title',     label: 'Título', type: 'input' },
          { section: 'services', key: 'card3_desc',      label: 'Descripción', type: 'textarea' },
          { section: 'services', key: 'card3_tag',       label: 'Tag', type: 'input' },
          { section: 'services', key: 'card3_btn_label', label: 'Texto del botón', type: 'input' },
          { section: 'services', key: 'card3_btn_href',  label: 'Enlace del botón', type: 'url' },
        ],
      },
      {
        label: 'Servicio 05 — Themes + Consultoría',
        fields: [
          { section: 'services', key: 'card4_title',     label: 'Título', type: 'input' },
          { section: 'services', key: 'card4_desc',      label: 'Descripción', type: 'textarea' },
          { section: 'services', key: 'card4_tag',       label: 'Tag', type: 'input' },
          { section: 'services', key: 'card4_btn_label', label: 'Texto del botón', type: 'input' },
          { section: 'services', key: 'card4_btn_href',  label: 'Enlace del botón', type: 'url' },
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
          { section: 'apps', key: 'app1_subtitle',  label: 'Subtítulo', type: 'input' },
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
          { section: 'apps', key: 'app2_subtitle',  label: 'Subtítulo', type: 'input' },
          { section: 'apps', key: 'app2_desc',      label: 'Descripción', type: 'textarea' },
          { section: 'apps', key: 'app2_tags',      label: 'Tags (separados por coma)', type: 'input' },
          { section: 'apps', key: 'app2_cta',       label: 'Texto del CTA', type: 'input' },
          { section: 'apps', key: 'app2_store_url', label: 'URL App Store (dejar vacío si no hay)', type: 'url' },
        ],
      },
      {
        label: 'App 3 — Custom Apps Privadas (NDA)',
        fields: [
          { section: 'apps', key: 'app3_status',    label: 'Estado (active / upcoming / nda)', type: 'input' },
          { section: 'apps', key: 'app3_badge',     label: 'Texto del badge', type: 'input' },
          { section: 'apps', key: 'app3_title',     label: 'Título', type: 'input' },
          { section: 'apps', key: 'app3_subtitle',  label: 'Subtítulo', type: 'input' },
          { section: 'apps', key: 'app3_desc',      label: 'Descripción', type: 'textarea' },
          { section: 'apps', key: 'app3_tags',      label: 'Tags (separados por coma)', type: 'input' },
          { section: 'apps', key: 'app3_cta',       label: 'Texto del CTA', type: 'input' },
          { section: 'apps', key: 'app3_store_url', label: 'URL App Store (dejar vacío si no hay)', type: 'url' },
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
          { section: 'ctabanner', key: 'cta1_label', label: 'Botón primario — texto', type: 'input' },
          { section: 'ctabanner', key: 'cta1_href',  label: 'Botón primario — enlace', type: 'url' },
          { section: 'ctabanner', key: 'cta2_label', label: 'Botón secundario — texto', type: 'input' },
          { section: 'ctabanner', key: 'cta2_href',  label: 'Botón secundario — enlace', type: 'url' },
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

  // ── Formulario de contacto ────────────────────────────────────────────────
  {
    id: 'contactform',
    label: 'Formulario de Contacto',
    groups: [
      {
        label: 'Textos del formulario',
        fields: [
          { section: 'contactform', key: 'heading',    label: 'Título de la sección', type: 'input', withSize: true },
          { section: 'contactform', key: 'subheading', label: 'Subtítulo / descripción', type: 'textarea', withSize: true },
          { section: 'contactform', key: 'btn_label',  label: 'Texto del botón de envío', type: 'input' },
        ],
      },
    ],
  },

  // ── CTA Final ─────────────────────────────────────────────────────────────
  {
    id: 'ctafinal',
    label: 'CTA Final',
    groups: [
      {
        label: 'Video de fondo',
        fields: [
          { section: 'ctafinal', key: 'video_url', label: 'URL del video de fondo (MP4, reemplaza el video por defecto)', type: 'url' },
        ],
      },
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

  // ── Configuración global ───────────────────────────────────────────────────
  {
    id: 'global',
    label: 'Configuración Global',
    groups: [
      {
        label: 'Contacto y redes sociales',
        fields: [
          { section: 'ctafinal', key: 'email_contact',   label: 'Email de contacto (mailto en CTA Final)', type: 'input' },
          { section: 'ctafinal', key: 'whatsapp_number', label: 'Número de WhatsApp (solo dígitos, ej: 5491134567890)', type: 'input' },
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
      // Controles de tipografía para todos los campos de texto (no URLs)
      if (f.type !== 'url') {
        result.push({ section: f.section, key: f.key + '_size' })
        result.push({ section: f.section, key: f.key + '_px' })
        result.push({ section: f.section, key: f.key + '_color' })
      }
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
    const responses = await Promise.all(dirty.map(({ section, key }) =>
      fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ section, key, value: values[fk(section, key)] ?? "" }),
      })
    ))
    const allOk = responses.every(r => r.ok)
    if (!allOk) {
      setSavingId(null)
      alert("Error al guardar. Por favor recarga la página e intenta de nuevo.")
      return
    }
    setSavedValues(prev => {
      const next = { ...prev }
      dirty.forEach(({ section, key }) => { next[fk(section, key)] = values[fk(section, key)] ?? "" })
      return next
    })
    setSavingId(null)
    setSavedId(cfg.id)
    // Notifica al ContentProvider del sitio público para refrescar datos
    window.dispatchEvent(new Event('content-updated'))
    setTimeout(() => setSavedId(id => id === cfg.id ? null : id), 2500)
  }

  if (loading) {
    return (
      <AdminLayout title="Contenido del sitio">
        <div className="flex items-center gap-3 text-slate-400 py-20 justify-center">
          <span className="material-symbols-outlined animate-spin" style={{ fontSize: 24 }}>progress_activity</span>
          <span className="text-sm">Cargando contenido…</span>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Contenido del sitio">
      <div className="flex flex-col gap-6">
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
            token={token}
          />
        ))}
      </div>
    </AdminLayout>
  )
}

const SECTION_ICONS: Record<string, string> = {
  hero: "web", problem_solution: "compare", services: "category", apps: "token",
  ctabanner: "campaign", process: "account_tree", faq: "quiz", contactform: "contact_mail",
  ctafinal: "flag", footer: "bottom_navigation", global: "settings",
}

function SectionBlock({
  cfg, values, update, dirty, saving, justSaved, onSave, token,
}: {
  cfg: SectionDef
  values: Values
  update: (section: string, key: string, v: string) => void
  dirty: boolean
  saving: boolean
  justSaved: boolean
  onSave: () => void
  token: string
}) {
  const [open, setOpen] = useState(false)

  const SaveBtn = ({ bottom }: { bottom?: boolean }) => (
    <button
      onClick={onSave}
      disabled={saving || !dirty}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all active:scale-[0.98] ${
        justSaved
          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
          : dirty
          ? "bg-adm-primary-container text-white hover:opacity-90 shadow-sm"
          : "bg-slate-100 text-slate-400 cursor-not-allowed"
      } ${bottom ? "ml-auto" : ""}`}
    >
      {saving
        ? <span className="material-symbols-outlined animate-spin" style={{ fontSize: 14 }}>progress_activity</span>
        : justSaved
        ? <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span>
        : <span className="material-symbols-outlined" style={{ fontSize: 14 }}>save</span>}
      {saving ? "Guardando…" : justSaved ? "Guardado" : dirty ? "Guardar cambios" : "Sin cambios"}
    </button>
  )

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm" style={{ border: '1px solid #CBD5E1' }}>
      {/* Section header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ background: '#E2E8F0', borderBottomColor: '#E2E8F0' }}
      >
        <button onClick={() => setOpen(o => !o)} className="flex items-center gap-3 flex-1 text-left">
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#64748B' }}>
            {SECTION_ICONS[cfg.id] ?? "web"}
          </span>
          <span className="text-[20px] font-bold" style={{ color: '#1E293B' }}>{cfg.label}</span>
        </button>
        <div className="flex items-center gap-4">
          {justSaved && (
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider">
              Guardado
            </span>
          )}
          {dirty && !justSaved && !saving && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider">
              Sin guardar
            </span>
          )}
          <SaveBtn />
          <span
            className="material-symbols-outlined cursor-pointer transition-transform"
            style={{ fontSize: 20, color: '#64748B', transform: open ? "rotate(180deg)" : "none" }}
            onClick={() => setOpen(o => !o)}
          >expand_more</span>
        </div>
      </div>

      {open && (
        <div className="p-6 space-y-8">
          {cfg.groups.map((group, gi) => (
            <div key={group.label}>
              {gi > 0 && <div className="mb-6" style={{ borderTop: '2px solid #E2E8F0' }} />}
              <p className="text-[11px] font-semibold text-adm-primary uppercase tracking-widest mb-3">
                {group.label}
              </p>
              <div className="flex flex-col gap-5">
                {group.fields.map(field => (
                  <FieldRow
                    key={fk(field.section, field.key)}
                    field={field}
                    value={values[fk(field.section, field.key)] ?? ""}
                    sizeValue={values[fk(field.section, field.key + "_size")] ?? ""}
                    pxValue={values[fk(field.section, field.key + "_px")] ?? ""}
                    colorValue={values[fk(field.section, field.key + "_color")] ?? ""}
                    token={token}
                    onChange={v => update(field.section, field.key, v)}
                    onSizeChange={v => update(field.section, field.key + "_size", v)}
                    onPxChange={v => update(field.section, field.key + "_px", v)}
                    onColorChange={v => update(field.section, field.key + "_color", v)}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className="flex pt-4" style={{ borderTop: '2px solid #E2E8F0' }}>
            <SaveBtn bottom />
          </div>
        </div>
      )}
    </div>
  )
}

function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const displayColor = value || "#0F172A"
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <div className="relative">
        <input
          type="color"
          value={displayColor}
          onChange={e => onChange(e.target.value)}
          className="w-7 h-7 rounded cursor-pointer border-0 p-0.5 bg-transparent"
          title="Color del texto"
          style={{ WebkitAppearance: 'none' }}
        />
      </div>
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-[10px] font-mono text-slate-400 hover:text-slate-600 leading-none"
          title="Quitar color"
        >
          ✕
        </button>
      )}
      {!value && (
        <span className="text-[10px] text-slate-400 leading-none">sin color</span>
      )}
    </div>
  )
}

function FieldRow({
  field, value, sizeValue, pxValue, colorValue, token,
  onChange, onSizeChange, onPxChange, onColorChange,
}: {
  field: FieldDef
  value: string
  sizeValue: string
  pxValue: string
  colorValue: string
  token: string
  onChange: (v: string) => void
  onSizeChange: (v: string) => void
  onPxChange: (v: string) => void
  onColorChange: (v: string) => void
}) {
  const inputBase = [
    "w-full bg-white rounded-lg px-4 py-2.5 text-[14px]",
    "focus:outline-none focus:ring-4 focus:ring-adm-primary-container/10 transition-all",
  ].join(" ")
  const inputStyle = { border: '1px solid #94A3B8', color: '#0F172A' }
  const inputFocusClass = "focus:border-adm-primary-container"

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label row */}
      <div className="flex items-center justify-between gap-2 flex-wrap min-h-[28px]">
        <label className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: '#334155' }}>
          {field.label}
        </label>
        {/* Controles de tipografía — todos los campos de texto (no URLs) */}
        {field.type !== 'url' && (
          <div className="flex items-center gap-2 flex-wrap">
            <ColorPicker value={colorValue} onChange={onColorChange} />
            <select
              value={sizeValue}
              onChange={e => onSizeChange(e.target.value)}
              className="rounded-lg px-2 py-1 text-[12px] focus:outline-none focus:border-adm-primary-container transition-colors cursor-pointer"
              style={{ border: '1px solid #94A3B8', color: '#334155', background: '#fff' }}
              title="Etiqueta HTML"
            >
              {TAG_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <input
              type="number"
              value={pxValue}
              onChange={e => onPxChange(e.target.value)}
              placeholder="px"
              min={10}
              max={200}
              className="w-[60px] rounded-lg px-2 py-1 text-[12px] text-center focus:outline-none focus:border-adm-primary-container transition-colors"
              style={{ border: '1px solid #94A3B8', color: '#334155', background: '#fff' }}
              title="Tamaño en píxeles"
            />
          </div>
        )}
      </div>

      {/* Field input */}
      {field.type === "textarea" ? (
        <RichTextEditor
          value={value}
          onChange={onChange}
          minHeight={150}
          token={token}
        />
      ) : (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder ?? (field.type === "url" ? "https://…" : "")}
          className={`${inputBase} ${inputFocusClass}`}
          style={inputStyle}
        />
      )}
    </div>
  )
}
