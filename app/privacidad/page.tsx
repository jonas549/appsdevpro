/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/layout/Navbar'
import CookieSettingsButton from '@/app/components/CookieSettingsButton'

// Política de privacidad y de cookies del sitio (RGPD / LOPDGDD / LSSI).
// Estática como las de /discountflow/privacy y /lovelist/privacy: el texto
// vive aquí, no en el CMS.

const URL = 'https://appsdeveloperspro.com/privacidad'
const TITLE = 'Política de Privacidad y Cookies'
const DESCRIPTION = 'Cómo trata Apps Developers Pro los datos que nos envías por el formulario y qué cookies usa este sitio.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: `${TITLE} | Apps Developers Pro`, description: DESCRIPTION, url: URL, siteName: 'Apps Developers Pro', type: 'website' },
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="bg-[#07090F]">
        <Navbar />
        <div className="pt-28 pb-12 px-6">
          <div className="max-w-[800px] mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-8 transition-colors">
              ← Volver al inicio
            </Link>
            <h1 className="text-white text-3xl md:text-[2.5rem] font-bold tracking-tight leading-[1.15]">{TITLE}</h1>
            <p className="text-white/40 text-sm mt-3">Última actualización: 24 de septiembre de 2026</p>
          </div>
        </div>
      </div>

      <div className="bg-[#FAFBFC]">
        <div className="max-w-[800px] mx-auto px-6 py-14">
          <style>{`
            .policy-body { color: #1A1A1A; font-size: 1rem; line-height: 1.8; }
            .policy-body p { margin-bottom: 1.25rem; }
            .policy-body strong { font-weight: 700; color: #0F172A; }
            .policy-body h2 {
              font-size: 1.35rem; font-weight: 700; color: #4361EE;
              margin-top: 2.75rem; margin-bottom: 0.75rem; padding-bottom: 0.5rem;
              border-bottom: 2px solid #E6EBFD; line-height: 1.25; scroll-margin-top: 96px;
            }
            .policy-body ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
            .policy-body ul li { margin-bottom: 0.4rem; }
            .policy-body a { color: #4361EE; text-decoration: underline; text-underline-offset: 3px; }
            .policy-body a:hover { color: #2F47C4; }
            .policy-body .table-wrap { overflow-x: auto; margin-bottom: 1.25rem; }
            .policy-body table { width: 100%; border-collapse: collapse; font-size: 0.925rem; line-height: 1.5; }
            .policy-body th, .policy-body td { border: 1px solid #E2E8F0; padding: 0.6rem 0.75rem; text-align: left; vertical-align: top; }
            .policy-body th { background: #F1F4FE; font-weight: 600; color: #0F172A; }
            .policy-body .cookie-btn {
              display: inline-flex; min-height: 44px; align-items: center; border-radius: 0.75rem;
              background: #4361EE; color: #fff; font-weight: 600; padding: 0 1.25rem;
            }
            .policy-body .cookie-btn:hover { background: #5470F0; }
          `}</style>

          <div className="policy-body">
            <p>
              Aquí te explicamos qué datos recogemos cuando visitas appsdeveloperspro.com o nos escribes, para qué los usamos,
              con quién los compartimos y cómo puedes ejercer tus derechos. Lo redactamos conforme al Reglamento General de
              Protección de Datos (RGPD), la Ley Orgánica 3/2018 (LOPDGDD) y la Ley 34/2002 de servicios de la sociedad de la
              información (LSSI).
            </p>

            <h2 id="responsable">1. Quién es el responsable</h2>
            <ul>
              <li><strong>Titular del sitio y responsable del tratamiento:</strong> Jonas González, que opera como Apps Developers Pro</li>
              <li><strong>Cédula de identidad:</strong> V-24281309</li>
              <li><strong>Dirección postal:</strong> Calle 93 # 13-45, Oficina 302, Chicó Norte, Bogotá D.C., Colombia, 110221</li>
              <li><strong>Correo:</strong> <a href="mailto:contacto@appsdeveloperspro.com">contacto@appsdeveloperspro.com</a></li>
            </ul>

            <h2 id="datos">2. Qué datos recogemos</h2>
            <p><strong>Cuando nos envías el formulario:</strong> tu nombre, tu correo, tu número de WhatsApp con su prefijo, y lo que
              quieras contarnos de tu proyecto (cantidad aproximada de productos, si ya tienes tienda, su dirección web o tu idea).
              También guardamos la fecha y hora del envío.</p>
            <p><strong>Cuando nos escribes por WhatsApp o por correo:</strong> los datos que tú mismo nos envías en esa conversación.</p>
            <p><strong>Mientras navegas:</strong> solo si aceptas las cookies de analítica o de publicidad, datos de uso como las páginas
              que visitas, el dispositivo y el anuncio por el que llegaste. Lo detallamos en el <a href="#cookies">apartado de cookies</a>.</p>

            <h2 id="finalidades">3. Para qué los usamos y con qué base legal</h2>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Finalidad</th><th>Base legal</th></tr></thead>
                <tbody>
                  <tr><td>Responder a tu solicitud, hablar de tu proyecto y enviarte un presupuesto.</td><td>Aplicación de medidas precontractuales a petición tuya (art. 6.1.b RGPD).</td></tr>
                  <tr><td>Enviarte un correo automático confirmando que recibimos tu solicitud.</td><td>La misma: forma parte de atender lo que nos pides.</td></tr>
                  <tr><td>Si llegamos a trabajar juntos, gestionar el proyecto y la facturación.</td><td>Ejecución del contrato (art. 6.1.b) y obligaciones legales (art. 6.1.c).</td></tr>
                  <tr><td>Proteger el formulario frente a spam y abusos.</td><td>Interés legítimo en la seguridad del sitio (art. 6.1.f).</td></tr>
                  <tr><td>Medir las visitas (Google Analytics) y la eficacia de nuestros anuncios (Google Ads y Meta).</td><td>Tu consentimiento (art. 6.1.a RGPD y art. 22.2 LSSI), que puedes retirar cuando quieras.</td></tr>
                </tbody>
              </table>
            </div>
            <p>No te enviaremos publicidad por correo ni por WhatsApp sin pedirte permiso antes. No tomamos decisiones automatizadas
              sobre ti ni elaboramos perfiles con efectos jurídicos. No vendemos tus datos.</p>

            <h2 id="conservacion">4. Cuánto tiempo los guardamos</h2>
            <ul>
              <li>Si no llegamos a trabajar juntos, borramos los datos del formulario como máximo <strong>12 meses</strong> después de nuestro último contacto.</li>
              <li>Si trabajamos juntos, los conservamos mientras dure la relación y, después, durante los plazos que exige la ley (por ejemplo, 6 años para la documentación contable y de facturación).</li>
              <li>Los datos de las cookies se guardan durante los plazos que indica la <a href="#cookies">tabla de cookies</a>.</li>
            </ul>

            <h2 id="destinatarios">5. Con quién los compartimos</h2>
            <p>No cedemos tus datos a terceros salvo obligación legal. Para funcionar usamos proveedores que los tratan por nuestra cuenta,
              con contrato de encargo del tratamiento:</p>
            <ul>
              <li><strong>Vercel Inc.</strong> (alojamiento del sitio web).</li>
              <li><strong>Neon Inc.</strong> (base de datos donde se guarda tu solicitud).</li>
              <li><strong>Resend</strong> (envío de los correos de confirmación y aviso).</li>
              <li><strong>Google LLC / Google Ireland</strong> (Google Analytics y Google Ads), solo si aceptas esas cookies.</li>
              <li><strong>Meta Platforms Ireland</strong> (píxel de Meta), solo si aceptas las cookies de publicidad. WhatsApp, también de Meta, si decides escribirnos por ahí.</li>
            </ul>
            <p>Algunos de estos proveedores están en Estados Unidos. Las transferencias se amparan en el Marco de Privacidad de Datos
              UE-EE. UU. cuando el proveedor está adherido o, si no lo está, en las cláusulas contractuales tipo aprobadas por la
              Comisión Europea.</p>

            <h2 id="derechos">6. Tus derechos</h2>
            <p>Puedes pedirnos en cualquier momento <strong>acceder</strong> a tus datos, <strong>rectificarlos</strong>, <strong>suprimirlos</strong>,
              <strong> oponerte</strong> a su tratamiento, <strong>limitarlo</strong> o <strong>llevártelos</strong> a otro proveedor (portabilidad),
              y <strong>retirar tu consentimiento</strong> sin que eso afecte a lo que hicimos antes con él.</p>
            <p>Escríbenos a <a href="mailto:contacto@appsdeveloperspro.com">contacto@appsdeveloperspro.com</a> indicando qué derecho quieres
              ejercer. Te responderemos en un plazo máximo de un mes.</p>
            <p>Si crees que no hemos tratado bien tus datos, puedes reclamar ante la Agencia Española de Protección de Datos
              (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>).</p>

            <h2 id="cookies">7. Cookies</h2>
            <p>Una cookie es un pequeño archivo que el sitio guarda en tu navegador. Usamos las siguientes, y las de analítica y
              publicidad <strong>solo se activan si las aceptas</strong> en el aviso que ves al entrar. Si las rechazas, el sitio
              funciona igual.</p>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Nombre</th><th>Proveedor</th><th>Para qué</th><th>Duración</th></tr></thead>
                <tbody>
                  <tr><td><code>adp_consent</code> (almacenamiento local)</td><td>Propia</td><td>Técnica: recuerda si aceptaste o rechazaste las cookies.</td><td>Hasta que la borres</td></tr>
                  <tr><td><code>_ga</code>, <code>_ga_*</code></td><td>Google Analytics</td><td>Analítica: distinguir visitantes y medir qué páginas se ven.</td><td>2 años</td></tr>
                  <tr><td><code>_gcl_au</code> y similares</td><td>Google Ads</td><td>Publicidad: saber si llegaste desde un anuncio y si después nos escribiste.</td><td>90 días</td></tr>
                  <tr><td><code>_fbp</code>, <code>_fbc</code></td><td>Meta</td><td>Publicidad: medir los anuncios de Facebook e Instagram.</td><td>90 días</td></tr>
                </tbody>
              </table>
            </div>
            <p>Puedes cambiar tu elección cuando quieras:</p>
            <p><CookieSettingsButton className="cookie-btn" /></p>
            <p>También puedes borrar o bloquear las cookies desde la configuración de tu navegador.</p>

            <h2 id="menores">8. Menores</h2>
            <p>Este sitio está dirigido a profesionales y empresas. No recogemos a sabiendas datos de menores de 14 años.</p>

            <h2 id="cambios">9. Cambios en esta política</h2>
            <p>Si cambiamos algo importante, actualizaremos la fecha de arriba y, si hace falta, te pediremos de nuevo tu consentimiento.</p>
          </div>
        </div>
      </div>

      <footer className="bg-[#07090F] px-6 py-8 text-center text-sm text-white/40">
        © {new Date().getFullYear()} Apps Developers Pro ·{' '}
        <a href="mailto:contacto@appsdeveloperspro.com" className="text-white/60 hover:text-white">contacto@appsdeveloperspro.com</a>
      </footer>
    </div>
  )
}
