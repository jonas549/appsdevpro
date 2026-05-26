/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'Política de Privacidad — DiscountFlow',
  description: 'Política de privacidad de DiscountFlow, app de descuentos para Shopify desarrollada por Apps Developers Pro.',
  alternates: {
    canonical: 'https://appsdeveloperspro.com/discountflow/privacy',
  },
  openGraph: {
    title: 'Política de Privacidad — DiscountFlow',
    description: 'Política de privacidad de DiscountFlow, app de descuentos para Shopify desarrollada por Apps Developers Pro.',
    url: 'https://appsdeveloperspro.com/discountflow/privacy',
    siteName: 'Apps Developers Pro',
    type: 'website',
  },
}

export default function DiscountFlowPrivacyPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* ─── Dark header ─────────────────────────────── */}
      <div className="bg-[#07090F]">
        <Navbar />
        <div className="pt-28 pb-12 px-6">
          <div className="max-w-[800px] mx-auto">
            <Link
              href="https://appsdeveloperspro.com"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-8 transition-colors"
            >
              ← Volver al inicio
            </Link>
            <div className="inline-flex items-center gap-2 bg-[#008060]/10 border border-[#008060]/30 text-[#00c88a] text-xs font-semibold px-3 py-1 rounded-full mb-5">
              DiscountFlow · App para Shopify
            </div>
            <h1 className="text-white text-3xl md:text-[2.5rem] font-bold tracking-tight leading-[1.15]">
              Política de Privacidad
            </h1>
            <p className="text-white/40 text-sm mt-3">Última actualización: 26 de mayo de 2026</p>
          </div>
        </div>
      </div>

      {/* ─── Content ─────────────────────────────────── */}
      <div className="bg-[#FAFBFC]">
        <div className="max-w-[800px] mx-auto px-6 py-14">

          <style>{`
            .policy-body { color: #1A1A1A; font-size: 1rem; line-height: 1.8; }

            .policy-body p  { margin-bottom: 1.25rem; }
            .policy-body strong { font-weight: 700; color: #0F172A; }

            .policy-body h2 {
              font-size: 1.35rem;
              font-weight: 700;
              color: #008060;
              margin-top: 2.75rem;
              margin-bottom: 0.75rem;
              padding-bottom: 0.5rem;
              border-bottom: 2px solid #e6f4f0;
              line-height: 1.25;
            }

            .policy-body h3 {
              font-size: 1.05rem;
              font-weight: 600;
              color: #005c46;
              margin-top: 1.75rem;
              margin-bottom: 0.5rem;
              line-height: 1.3;
            }

            .policy-body ul {
              list-style: disc;
              padding-left: 1.5rem;
              margin-bottom: 1.25rem;
            }

            .policy-body ul li { margin-bottom: 0.4rem; }

            .policy-body a {
              color: #008060;
              text-decoration: underline;
              text-underline-offset: 3px;
            }
            .policy-body a:hover { color: #005c46; }

            .policy-body .note-box {
              background: #f0faf6;
              border-left: 4px solid #008060;
              padding: 1rem 1.25rem;
              border-radius: 0 0.5rem 0.5rem 0;
              margin: 1.5rem 0;
            }
            .policy-body .note-box p { margin-bottom: 0; color: #1A3D30; }
          `}</style>

          <div className="policy-body">
            {/* Intro */}
            <p>
              Esta Política de Privacidad describe cómo DiscountFlow ("la App", "nosotros") recopila, usa y protege la información
              de los comerciantes de Shopify que instalan y utilizan la aplicación, así como de los clientes finales de dichos comerciantes.
            </p>
            <p>
              DiscountFlow es desarrollada y operada por <strong>Apps Developers Pro</strong>.
            </p>
            <p>
              Contacto: <a href="mailto:contacto@appsdeveloperspro.com">contacto@appsdeveloperspro.com</a><br />
              Sitio web: <a href="https://appsdeveloperspro.com" target="_blank" rel="noopener noreferrer">https://appsdeveloperspro.com</a>
            </p>

            {/* 1 */}
            <h2>1. Información que recopilamos</h2>

            <h3>1.1 Información del comerciante (tienda Shopify)</h3>
            <p>
              Cuando instalas DiscountFlow, recopilamos automáticamente la siguiente información de tu tienda Shopify a través de la API oficial de Shopify:
            </p>
            <ul>
              <li>Nombre de la tienda y dominio (myshopify.com)</li>
              <li>Correo electrónico del propietario de la tienda</li>
              <li>Configuración de moneda y zona horaria</li>
              <li>Plan de Shopify activo</li>
              <li>Productos, colecciones, tags y variantes (para configurar campañas)</li>
              <li>Órdenes y datos de descuentos aplicados (para análisis de ROI)</li>
            </ul>

            <h3>1.2 Información de clientes finales (Customer Data)</h3>
            <p>
              Para calcular el rendimiento de las campañas de descuento, accedemos a información limitada de las órdenes:
            </p>
            <ul>
              <li>ID de orden y fecha</li>
              <li>Monto total y descuentos aplicados</li>
              <li>Productos comprados</li>
            </ul>
            <div className="note-box">
              <p>
                <strong>No recopilamos</strong> nombres, direcciones, correos electrónicos, ni información de pago de los clientes finales.
              </p>
            </div>

            <h3>1.3 Información técnica</h3>
            <p>Registramos automáticamente:</p>
            <ul>
              <li>Logs de uso de la app (acciones realizadas, errores)</li>
              <li>Dirección IP y user agent (solo para seguridad y diagnóstico)</li>
            </ul>

            {/* 2 */}
            <h2>2. Cómo usamos la información</h2>
            <p>Usamos la información recopilada exclusivamente para:</p>
            <ul>
              <li>Operar y mantener la app</li>
              <li>Crear, gestionar y aplicar campañas de descuento en tu tienda</li>
              <li>Calcular métricas de rendimiento (ROI, ventas atribuidas)</li>
              <li>Brindar soporte técnico cuando lo solicites</li>
              <li>Cumplir con obligaciones legales y de Shopify</li>
              <li>Mejorar la app y desarrollar nuevas funcionalidades</li>
            </ul>
            <div className="note-box">
              <p>
                <strong>No vendemos, alquilamos ni compartimos</strong> tu información con terceros con fines comerciales.
              </p>
            </div>

            {/* 3 */}
            <h2>3. Compartir información con terceros</h2>
            <p>
              Solo compartimos información con los siguientes proveedores de servicios, estrictamente necesarios para operar la app:
            </p>
            <ul>
              <li><strong>Shopify Inc.</strong> — plataforma de la tienda</li>
              <li><strong>Vercel</strong> — hosting de la aplicación</li>
              <li><strong>Neon</strong> — base de datos PostgreSQL</li>
            </ul>
            <p>
              Todos estos proveedores cumplen con estándares internacionales de seguridad y privacidad (GDPR, CCPA).
            </p>

            {/* 4 */}
            <h2>4. Retención de datos</h2>
            <ul>
              <li>
                <strong>Mientras la app esté instalada:</strong> conservamos los datos necesarios para operar la app.
              </li>
              <li>
                <strong>Tras desinstalar la app:</strong> eliminamos todos los datos asociados a tu tienda en un plazo máximo de 48 horas,
                salvo obligaciones legales que requieran retención mayor.
              </li>
              <li>
                <strong>Logs técnicos:</strong> se conservan por un máximo de 90 días.
              </li>
            </ul>

            {/* 5 */}
            <h2>5. Derechos del comerciante y del cliente final</h2>
            <p>
              De acuerdo con el GDPR, CCPA y otras leyes de protección de datos, tienes derecho a:
            </p>
            <ul>
              <li>Acceder a los datos que tenemos sobre tu tienda</li>
              <li>Solicitar la corrección de datos inexactos</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Solicitar la portabilidad de tus datos</li>
              <li>Oponerte al procesamiento de tus datos</li>
            </ul>
            <p>
              Para ejercer estos derechos, escríbenos a{' '}
              <a href="mailto:contacto@appsdeveloperspro.com"><strong>contacto@appsdeveloperspro.com</strong></a>.
            </p>

            <h3>Webhooks GDPR de Shopify</h3>
            <p>DiscountFlow implementa los tres webhooks obligatorios de Shopify:</p>
            <ul>
              <li>
                <code style={{ background: '#f0faf6', color: '#005c46', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.875em', fontFamily: 'monospace' }}>
                  customers/data_request
                </code>{' '}
                — atendemos solicitudes de acceso de datos
              </li>
              <li>
                <code style={{ background: '#f0faf6', color: '#005c46', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.875em', fontFamily: 'monospace' }}>
                  customers/redact
                </code>{' '}
                — eliminamos datos de un cliente específico
              </li>
              <li>
                <code style={{ background: '#f0faf6', color: '#005c46', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.875em', fontFamily: 'monospace' }}>
                  shop/redact
                </code>{' '}
                — eliminamos todos los datos de una tienda tras la desinstalación
              </li>
            </ul>

            {/* 6 */}
            <h2>6. Seguridad</h2>
            <p>Implementamos medidas técnicas y organizativas para proteger la información:</p>
            <ul>
              <li>Conexiones cifradas con HTTPS/TLS</li>
              <li>Autenticación mediante OAuth 2.0 de Shopify</li>
              <li>Validación HMAC en todos los webhooks</li>
              <li>Acceso restringido a la base de datos</li>
              <li>Logs de auditoría de accesos administrativos</li>
            </ul>

            {/* 7 */}
            <h2>7. Cookies</h2>
            <p>
              DiscountFlow funciona como una app embebida dentro del admin de Shopify y utiliza cookies de sesión estrictamente
              necesarias para autenticación. No usamos cookies de marketing ni de seguimiento de terceros.
            </p>

            {/* 8 */}
            <h2>8. Menores de edad</h2>
            <p>
              DiscountFlow está dirigida exclusivamente a comerciantes mayores de edad. No recopilamos conscientemente información de menores.
            </p>

            {/* 9 */}
            <h2>9. Cambios a esta política</h2>
            <p>
              Podemos actualizar esta política ocasionalmente. Notificaremos cambios significativos a través de la app o por correo
              electrónico al propietario de la tienda. La fecha de "Última actualización" en la parte superior indica cuándo se hizo el último cambio.
            </p>

            {/* 10 */}
            <h2>10. Contacto</h2>
            <p>Si tienes preguntas sobre esta política o sobre el tratamiento de tus datos, contáctanos:</p>
            <p>
              <strong>Apps Developers Pro</strong><br />
              Correo:{' '}
              <a href="mailto:contacto@appsdeveloperspro.com">contacto@appsdeveloperspro.com</a><br />
              Sitio web:{' '}
              <a href="https://appsdeveloperspro.com" target="_blank" rel="noopener noreferrer">https://appsdeveloperspro.com</a>
            </p>
          </div>

          {/* Back link */}
          <div className="mt-14 pt-8 border-t border-slate-200">
            <Link
              href="https://appsdeveloperspro.com"
              className="inline-flex items-center gap-2 text-[#008060] font-semibold hover:gap-3 transition-all text-sm"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Footer ──────────────────────────────────── */}
      <footer className="bg-[#0C0F1A] border-t border-white/[0.06]">
        <div className="max-w-[800px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#7B8DB0] text-xs font-mono">© 2026 Apps Developers Pro</p>
          <a
            href="https://appsdeveloperspro.com"
            className="text-[#7B8DB0] text-xs hover:text-[#EDF0FF] transition-colors"
          >
            appsdeveloperspro.com
          </a>
        </div>
      </footer>
    </div>
  )
}
