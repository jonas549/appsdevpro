// Contenido de la landing /tiendas-shopify. Estático a propósito: la página no
// lee de la DB, así que se genera en build y se sirve desde la CDN.

export const WA_LINK = "https://wa.link/phjdep"

export const NAV_LINKS = [
  { id: "especialidad", label: "Especialidad" },
  { id: "portafolio", label: "Portafolio" },
  { id: "proceso", label: "Proceso" },
  { id: "faq", label: "Preguntas" },
]

// Estadísticas del hero. Vacío = la fila no se pinta.
// PENDIENTE (Jonas): cifras reales, p. ej. { value: "40+", label: "tiendas entregadas" }.
export const HERO_STATS: { value: string; label: string }[] = []

export const MARQUEE_ITEMS = [
  "Diseño a medida",
  "Shopify 2.0",
  "Apps propias en el App Store",
  "Descuentos por cantidad",
  "Pagos y envíos configurados",
  "Latinoamérica y España",
]

export interface Project {
  slug: string
  name: string
  url: string
  country: string
  sector: string
  line: string
  glow: string
  bg: string
}

// Datos sacados de cada tienda (título, descripción y moneda de Shopify).
// El texto de `line` es un borrador para revisar.
export const PROJECTS: Project[] = [
  {
    slug: "rocio-fernandez-cotta",
    name: "Rocío Fernández Cotta",
    url: "https://rociofernandezcotta.es/",
    country: "España",
    sector: "Moda infantil",
    line: "Moda infantil clásica para bebé, niña y niño, con conjuntos para hermanos.",
    bg: "#0D1117",
    glow: "rgba(67,97,238,.24)",
  },
  {
    slug: "carolina-flores-handmade",
    name: "Carolina Flores Handmade",
    url: "https://carolinafloreshandmade.cl/",
    country: "Chile",
    sector: "Bolsos de cuero",
    line: "Bolsos y carteras de cuero hechos a mano en Chile.",
    bg: "#110E10",
    glow: "rgba(190,70,110,.22)",
  },
  {
    slug: "greta-baby-kids",
    name: "Greta Baby Kids",
    url: "https://gretababykids.com/",
    country: "España",
    sector: "Moda infantil",
    line: "Ropa y accesorios para bebé, niña y niño, por temporadas.",
    bg: "#0C1212",
    glow: "rgba(60,220,200,.18)",
  },
  {
    slug: "nachin",
    name: "Nachin",
    url: "https://nachin.cl/",
    country: "Chile",
    sector: "Bebé y maternidad",
    line: "Pañales, ropa, juguetes y todo para mamá y bebé, con despacho el mismo día.",
    bg: "#100E14",
    glow: "rgba(170,120,230,.22)",
  },
  {
    slug: "lalquimista",
    name: "Parafarmacia Lalquimista",
    url: "https://lalquimistaparafarmacia.com/",
    country: "España",
    sector: "Parafarmacia",
    line: "Salud y belleza de las mejores marcas, con envíos en 24/48 h.",
    bg: "#0F0F10",
    glow: "rgba(255,255,255,.10)",
  },
  {
    slug: "copargo-control",
    name: "Copargo Control",
    url: "https://copargocontrol.cl/",
    country: "Chile",
    sector: "Control de plagas",
    line: "Insecticidas, trampas y equipos profesionales para empresas.",
    bg: "#0C0F16",
    glow: "rgba(110,140,230,.24)",
  },
]

export const PROCESS_STEPS = [
  { title: "Conversamos", text: "Nos cuentas qué vendes y a quién. Salimos con alcance y plazo claros." },
  { title: "Diseño", text: "Ves cómo se verá tu tienda antes de programar. Ajustamos contigo." },
  { title: "Desarrollo y carga", text: "Construimos, subimos tus productos y conectamos pagos, envíos y descuentos." },
  { title: "Lanzamiento", text: "Salimos al aire y te capacitamos para manejar tu tienda sin depender de nadie." },
]

export const INCLUDES = [
  { t: "Diseño a medida", s: "Con la identidad de tu marca.", d: "M4 20l12-12-4-4L2 14v6h2zM14 6l4 4" },
  { t: "Carga de productos", s: "Catálogo, variantes y fotos.", d: "M12 3l9 5v8l-9 5-9-5V8l9-5zM3 8l9 5 9-5M12 13v8" },
  { t: "Pasarelas de pago", s: "Las que usan tus clientes.", d: "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM2 10h20M6 15h4" },
  { t: "Envíos", s: "Zonas, tarifas y transportistas.", d: "M2 7h11v8H2zM13 10h5l3 3v2h-8zM6 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" },
  { t: "SEO básico", s: "Para que te encuentren en Google.", d: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM16.5 16.5L21 21" },
  { t: "Campañas de descuento listas", s: "Con DiscountFlow incluida: packs, por cantidad, compra X lleva Y y cupones.", d: "M20 12l-8 8-8-8V4h8l8 8zM8 9.3a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6z", hot: true },
  { t: "Capacitación", s: "Para que administres tu tienda.", d: "M21 6l-9-3-9 3 9 3 9-3zM6 9v5c0 2 3 3.5 6 3.5s6-1.5 6-3.5V9" },
]

// Vacío = la sección no se pinta. PENDIENTE (Jonas): testimonios reales, nunca inventados.
export const TESTIMONIALS: { quote: string; name: string; store: string; country: string }[] = []

// Horquilla de precios visible en el hero.
export const PRICES = [
  { label: "Tiendas desde", price: "500 €" },
  { label: "Proyectos con integraciones desde", price: "1.500 €" },
]

export const FAQS = [
  { q: "¿Cuánto cuesta?", a: "Las tiendas empiezan en 500 € y los proyectos con integraciones, en 1.500 €. El precio exacto depende de lo que necesites y te lo damos tras la primera conversación." },
  { q: "¿Cuánto tarda mi tienda?", a: "Una tienda estándar, entre 2 y 4 semanas desde que tenemos tu contenido." },
  { q: "¿Qué necesito tener antes de empezar?", a: "Tu logo, fotos de productos y la lista de precios. Si algo falta, te decimos cómo resolverlo y avanzamos igual." },
  { q: "¿Trabajan con tiendas que ya existen?", a: "Sí. Rediseñamos, optimizamos y migramos tiendas en marcha, y desarrollamos funciones nuevas sobre la que ya tienes." },
  { q: "¿En qué países trabajan?", a: "Trabajamos en remoto con marcas de Latinoamérica y España, en español e inglés. Hoy tenemos tiendas vendiendo en España y Chile." },
  { q: "¿Qué pasa después de la entrega?", a: "Te capacitamos para administrar la tienda y seguimos disponibles para soporte y mejoras." },
]
