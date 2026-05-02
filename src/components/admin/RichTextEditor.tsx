import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Youtube from "@tiptap/extension-youtube"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import { Node, mergeAttributes } from "@tiptap/core"
import { useEffect, useRef, useState, useCallback } from "react"

function getBlockType(ed: { isActive: (name: string, attrs?: object) => boolean }): string {
  if (ed.isActive("heading", { level: 1 })) return "h1"
  if (ed.isActive("heading", { level: 2 })) return "h2"
  if (ed.isActive("heading", { level: 3 })) return "h3"
  if (ed.isActive("heading", { level: 4 })) return "h4"
  return "p"
}

// TikTok embed extension
const TikTok = Node.create({
  name: "tiktok",
  group: "block",
  atom: true,
  addAttributes() {
    return { url: { default: null } }
  },
  parseHTML() {
    return [{ tag: "div[data-tiktok]" }]
  },
  renderHTML({ HTMLAttributes }) {
    const url = HTMLAttributes.url ?? ""
    const videoId = url.split("/video/")[1]?.split("?")[0] ?? ""
    return ["div", mergeAttributes({ "data-tiktok": "" }, HTMLAttributes), [
      "blockquote",
      {
        class: "tiktok-embed",
        cite: url,
        "data-video-id": videoId,
        style: "max-width:605px;min-width:325px;",
      },
    ]]
  },
})

function ToolbarButton({
  onClick, active, title, children,
}: { onClick: () => void; active?: boolean; title?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick() }}
      title={title}
      className={`p-1.5 rounded transition-all text-slate-600 hover:bg-white hover:shadow-sm ${
        active ? "bg-white shadow-sm text-adm-primary-container" : ""
      }`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-4 bg-slate-200 mx-0.5" />
}

function Icon({ name }: { name: string }) {
  return <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{name}</span>
}

interface LinkPopoverProps {
  onConfirm: (url: string, newTab: boolean) => void
  onClose: () => void
}

function LinkPopover({ onConfirm, onClose }: LinkPopoverProps) {
  const [url, setUrl] = useState("https://")
  const [newTab, setNewTab] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { inputRef.current?.focus() }, [])
  return (
    <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-lg p-4 w-80">
      <p className="text-xs font-semibold text-slate-700 mb-2">Insertar enlace</p>
      <input
        ref={inputRef}
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); onConfirm(url, newTab) } if (e.key === "Escape") onClose() }}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-adm-primary-container mb-2"
        placeholder="https://..."
      />
      <label className="flex items-center gap-2 text-sm text-slate-600 mb-3 cursor-pointer select-none">
        <input type="checkbox" checked={newTab} onChange={e => setNewTab(e.target.checked)} className="rounded" />
        Abrir en nueva pestaña
      </label>
      <div className="flex gap-2">
        <button type="button" onClick={() => onConfirm(url, newTab)} className="flex-1 bg-adm-primary-container text-white rounded-lg py-1.5 text-sm font-medium hover:opacity-90 transition-opacity">
          Aplicar
        </button>
        <button type="button" onClick={onClose} className="flex-1 border border-slate-200 rounded-lg py-1.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  )
}

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
  token?: string
}

export default function RichTextEditor({ value, onChange, placeholder = "Escribe aquí...", minHeight = 300, token }: RichTextEditorProps) {
  const [blockType, setBlockType] = useState("p")
  const [showLinkPopover, setShowLinkPopover] = useState(false)
  const [showYouTubeInput, setShowYouTubeInput] = useState(false)
  const [showTikTokInput, setShowTikTokInput] = useState(false)
  const [embedUrl, setEmbedUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-blue-600 underline" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg max-w-full my-4" } }),
      Youtube.configure({ controls: true, HTMLAttributes: { class: "w-full aspect-video rounded-lg my-4" } }),
      TikTok,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => { onChange(editor.getHTML()); setBlockType(getBlockType(editor)) },
    onSelectionUpdate: ({ editor }) => { setBlockType(getBlockType(editor)) },
  })

  // Sync external value changes (e.g. initial load from DB)
  useEffect(() => {
    if (!editor) return
    if (editor.getHTML() !== value && value !== editor.getHTML()) {
      editor.commands.setContent(value || "")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor])

  const wordCount = editor ? editor.getText().trim().split(/\s+/).filter(Boolean).length : 0

  const insertLink = useCallback((url: string, newTab: boolean) => {
    if (!editor) return
    editor.chain().focus().setLink({ href: url, target: newTab ? "_blank" : "_self" }).run()
    setShowLinkPopover(false)
  }, [editor])

  const insertYouTube = useCallback(() => {
    if (!editor || !embedUrl) return
    editor.chain().focus().setYoutubeVideo({ src: embedUrl }).run()
    setEmbedUrl("")
    setShowYouTubeInput(false)
  }, [editor, embedUrl])

  const insertTikTok = useCallback(() => {
    if (!editor || !embedUrl) return
    editor.chain().focus().insertContent({ type: "tiktok", attrs: { url: embedUrl } }).run()
    setEmbedUrl("")
    setShowTikTokInput(false)
  }, [editor, embedUrl])

  const handleImageUpload = useCallback(async (file: File) => {
    if (!token) return
    setUploading(true)
    try {
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = reader.result as string
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ data: base64, folder: "blog/content" }),
        })
        const json = await res.json() as { url?: string; error?: string }
        if (json.url && editor) {
          editor.chain().focus().setImage({ src: json.url }).run()
        }
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch {
      setUploading(false)
    }
  }, [editor, token])

  if (!editor) return null

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div ref={toolbarRef} className="relative flex flex-wrap items-center gap-0.5 p-2 border-b border-slate-100 bg-slate-50/50">
        {/* Heading dropdown */}
        <select
          value={blockType}
          onChange={e => {
            const v = e.target.value
            if (v === "p") editor.chain().focus().setParagraph().run()
            else editor.chain().focus().toggleHeading({ level: parseInt(v[1]) as 1|2|3|4 }).run()
          }}
          className="text-xs bg-white border border-slate-200 rounded px-2 py-1.5 text-slate-600 focus:outline-none focus:border-adm-primary-container mr-1"
        >
          <option value="p">Párrafo</option>
          <option value="h1">Encabezado 1</option>
          <option value="h2">Encabezado 2</option>
          <option value="h3">Encabezado 3</option>
          <option value="h4">Encabezado 4</option>
        </select>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Negrita">
          <Icon name="format_bold" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Itálica">
          <Icon name="format_italic" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Subrayado">
          <Icon name="format_underlined" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Tachado">
          <Icon name="strikethrough_s" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Alinear izquierda">
          <Icon name="format_align_left" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Centrar">
          <Icon name="format_align_center" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Alinear derecha">
          <Icon name="format_align_right" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justificar">
          <Icon name="format_align_justify" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Lista sin orden">
          <Icon name="format_list_bulleted" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Lista ordenada">
          <Icon name="format_list_numbered" />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <div className="relative">
          <ToolbarButton onClick={() => { setShowLinkPopover(s => !s); setShowYouTubeInput(false); setShowTikTokInput(false) }} active={editor.isActive("link") || showLinkPopover} title="Insertar enlace">
            <Icon name="link" />
          </ToolbarButton>
          {showLinkPopover && (
            <LinkPopover
              onConfirm={insertLink}
              onClose={() => setShowLinkPopover(false)}
            />
          )}
        </div>

        {/* Image upload */}
        <ToolbarButton onClick={() => fileInputRef.current?.click()} title={uploading ? "Subiendo..." : "Insertar imagen"}>
          {uploading
            ? <span className="material-symbols-outlined animate-spin" style={{ fontSize: 20 }}>progress_activity</span>
            : <Icon name="image" />}
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = "" }}
        />

        {/* YouTube */}
        <div className="relative">
          <ToolbarButton onClick={() => { setShowYouTubeInput(s => !s); setShowLinkPopover(false); setShowTikTokInput(false); setEmbedUrl("") }} title="Insertar video de YouTube">
            <Icon name="smart_display" />
          </ToolbarButton>
          {showYouTubeInput && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-lg p-4 w-80">
              <p className="text-xs font-semibold text-slate-700 mb-2">URL de YouTube</p>
              <input
                autoFocus
                value={embedUrl}
                onChange={e => setEmbedUrl(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); insertYouTube() } if (e.key === "Escape") setShowYouTubeInput(false) }}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-adm-primary-container mb-2"
                placeholder="https://youtube.com/watch?v=..."
              />
              <button type="button" onClick={insertYouTube} className="w-full bg-adm-primary-container text-white rounded-lg py-1.5 text-sm font-medium hover:opacity-90 transition-opacity">
                Insertar
              </button>
            </div>
          )}
        </div>

        {/* TikTok */}
        <div className="relative">
          <ToolbarButton onClick={() => { setShowTikTokInput(s => !s); setShowLinkPopover(false); setShowYouTubeInput(false); setEmbedUrl("") }} title="Insertar video de TikTok">
            <span className="text-xs font-bold px-1 text-slate-600">TK</span>
          </ToolbarButton>
          {showTikTokInput && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-lg p-4 w-80">
              <p className="text-xs font-semibold text-slate-700 mb-2">URL de TikTok</p>
              <input
                autoFocus
                value={embedUrl}
                onChange={e => setEmbedUrl(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); insertTikTok() } if (e.key === "Escape") setShowTikTokInput(false) }}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-adm-primary-container mb-2"
                placeholder="https://tiktok.com/@user/video/..."
              />
              <button type="button" onClick={insertTikTok} className="w-full bg-adm-primary-container text-white rounded-lg py-1.5 text-sm font-medium hover:opacity-90 transition-opacity">
                Insertar
              </button>
            </div>
          )}
        </div>

        <div className="ml-auto text-xs text-slate-400 font-medium px-2">
          {wordCount} palabras
        </div>
      </div>

      {/* Editor canvas */}
      <style>{`
        .tiptap-editor { outline: none; min-height: inherit; }
        .tiptap-editor .ProseMirror { min-height: inherit; outline: none; }
        .tiptap-editor p { margin-bottom: 0.875rem; }
        .tiptap-editor h1 { font-size: 1.875rem; font-weight: 700; margin-bottom: 1rem; line-height: 1.2; }
        .tiptap-editor h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.875rem; line-height: 1.3; }
        .tiptap-editor h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; }
        .tiptap-editor h4 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; }
        .tiptap-editor ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 0.875rem; }
        .tiptap-editor ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 0.875rem; }
        .tiptap-editor li { margin-bottom: 0.25rem; }
        .tiptap-editor a { color: #2346d5; text-decoration: underline; }
        .tiptap-editor blockquote { border-left: 3px solid #e2e8f0; padding-left: 1rem; color: #64748b; margin: 1rem 0; }
        .tiptap-editor img { border-radius: 0.5rem; max-width: 100%; margin: 1rem 0; }
        .tiptap-editor iframe { width: 100%; border-radius: 0.5rem; margin: 1rem 0; }
        .tiptap-editor .tiptap-placeholder::before { color: #94a3b8; content: attr(data-placeholder); float: left; pointer-events: none; height: 0; }
      `}</style>
      <div
        onClick={() => editor.commands.focus()}
        style={{ minHeight }}
        className="cursor-text"
      >
        <EditorContent
          editor={editor}
          className="tiptap-editor p-8 text-slate-700 leading-relaxed text-base"
        />
      </div>
    </div>
  )
}
