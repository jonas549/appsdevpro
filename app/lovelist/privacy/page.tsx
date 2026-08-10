/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'Política de Privacidad — Lovelist',
  description: 'Política de privacidad de Lovelist, app de listas de favoritos para Shopify desarrollada por Apps Developers Pro.',
  alternates: {
    canonical: 'https://appsdeveloperspro.com/lovelist/privacy',
  },
  openGraph: {
    title: 'Política de Privacidad — Lovelist',
    description: 'Política de privacidad de Lovelist, app de listas de favoritos para Shopify desarrollada por Apps Developers Pro.',
    url: 'https://appsdeveloperspro.com/lovelist/privacy',
    siteName: 'Apps Developers Pro',
    type: 'website',
  },
}

export default function LovelistPrivacyPage() {
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
            <div className="inline-flex items-center gap-2 bg-[#E11D62]/10 border border-[#E11D62]/30 text-[#FF6B9D] text-xs font-semibold px-3 py-1 rounded-full mb-5">
              Lovelist · App para Shopify
            </div>
            <h1 className="text-white text-3xl md:text-[2.5rem] font-bold tracking-tight leading-[1.15]">
              Política de Privacidad
            </h1>
            <p className="text-white/40 text-sm mt-3">Última actualización: 10 de agosto de 2026</p>
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
              color: #E11D62;
              margin-top: 2.75rem;
              margin-bottom: 0.75rem;
              padding-bottom: 0.5rem;
              border-bottom: 2px solid #fce7ef;
              line-height: 1.25;
            }

            .policy-body h3 {
              font-size: 1.05rem;
              font-weight: 600;
              color: #9F1239;
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
              color: #E11D62;
              text-decoration: underline;
              text-underline-offset: 3px;
            }
            .policy-body a:hover { color: #9F1239; }

            .policy-body code {
              background: #fff1f5;
              color: #9F1239;
              padding: 0.1rem 0.35rem;
              border-radius: 4px;
              font-size: 0.875em;
              font-family: monospace;
            }

            .policy-body .note-box {
              background: #fff1f5;
              border-left: 4px solid #E11D62;
              padding: 1rem 1.25rem;
              border-radius: 0 0.5rem 0.5rem 0;
              margin: 1.5rem 0;
            }
            .policy-body .note-box p { margin-bottom: 0; color: #4A1024; }
          `}</style>

          <div className="policy-body">
            {/* Intro */}
            <p>
              Esta Política de Privacidad describe cómo Lovelist ("la App", "nosotros") recopila, usa y protege la información
              de los comerciantes de Shopify que instalan y utilizan la aplicación, así como de los clientes finales de dichos comerciantes.
            </p>
            <p>
              Lovelist es desarrollada y operada por <strong>Apps Developers Pro</strong>.
            </p>
            <p>
              Contacto: <a href="mailto:contacto@appsdeveloperspro.com">contacto@appsdeveloperspro.com</a><br />
              Sitio web: <a href="https://appsdeveloperspro.com" target="_blank" rel="noopener noreferrer">https://appsdeveloperspro.com</a>
            </p>

            {/* 1 */}
            <h2>1. Información que recopilamos</h2>

            <h3>1.1 Información del comerciante (tienda Shopify)</h3>
            <p>
              Cuando instalas Lovelist, recopilamos automáticamente la siguiente información de tu tienda Shopify a través de la API oficial de Shopify:
            </p>
            <ul>
              <li>Dominio de la tienda (myshopify.com)</li>
              <li>Configuración de moneda</li>
              <li>Plan de suscripción activo de Lovelist</li>
              <li>Productos y variantes (para mostrar título, imagen, precio y disponibilidad en las listas de favoritos)</li>
            </ul>
            <div className="note-box">
              <p>
                <strong>No solicitamos</strong> el permiso <code>read_customers</code> ni el permiso <code>read_orders</code>.
                Lovelist no tiene acceso a tus pedidos ni a la base de datos de clientes de tu tienda.
              </p>
            </div>

            <h3>1.2 Información de clientes finales (Customer Data)</h3>
            <p>Para que un comprador pueda guardar y recuperar sus favoritos, almacenamos:</p>
            <ul>
              <li>
                <strong>Identificador de cliente de Shopify</strong>, únicamente cuando el comprador ha iniciado sesión en tu tienda.
                Este identificador nos lo proporciona Shopify de forma firmada a través del App Proxy; no accedemos a tu lista de clientes para obtenerlo.
              </li>
              <li>
                <strong>Identificador anónimo</strong>, cuando el comprador no ha iniciado sesión. Es un código aleatorio (UUID)
                generado en su navegador, sin relación con ninguna identidad real.
              </li>
              <li><strong>Identificadores de producto y variante</strong> que el comprador ha guardado como favoritos.</li>
              <li><strong>Fecha y hora</strong> en que se guardó cada favorito.</li>
              <li><strong>Token de compartición</strong>, generado únicamente cuando el comprador decide compartir su lista mediante un enlace.</li>
            </ul>
            <div className="note-box">
              <p>
                <strong>No recopilamos</strong> nombres, direcciones de correo electrónico, direcciones postales, números de teléfono
                ni información de pago de los clientes finales.
              </p>
            </div>
            <p>
              <strong>No almacenamos datos de tus productos.</strong> El título, la imagen, el precio y la disponibilidad se consultan
              a Shopify en el momento de mostrar cada lista, de modo que la información siempre esté actualizada y nunca quede una copia
              desactualizada en nuestros servidores.
            </p>

            <h3>1.3 Almacenamiento en el navegador del comprador</h3>
            <p>
              Lovelist guarda en el almacenamiento local (<code>localStorage</code>) del navegador del comprador un identificador anónimo (UUID)
              que permite recuperar sus favoritos entre visitas sin necesidad de crear una cuenta. Este identificador no contiene información
              personal y no se comparte con terceros.
            </p>
            <p>
              Si el comprador inicia sesión en la tienda, sus favoritos anónimos se transfieren a su cuenta y el identificador anónimo
              se elimina del navegador.
            </p>

            <h3>1.4 Información técnica</h3>
            <p>Registramos automáticamente:</p>
            <ul>
              <li>Logs de uso de la app (acciones realizadas, errores)</li>
              <li>Dirección IP y user agent (solo para seguridad, diagnóstico y prevención de abuso)</li>
            </ul>

            {/* 2 */}
            <h2>2. Cómo usamos la información</h2>
            <p>Usamos la información recopilada exclusivamente para:</p>
            <ul>
              <li>Operar y mantener la app</li>
              <li>Guardar, mostrar y gestionar las listas de favoritos de los compradores</li>
              <li>Permitir que un comprador comparta su lista mediante un enlace, cuando así lo decide</li>
              <li>Mostrar al comerciante estadísticas agregadas sobre qué productos son los más guardados en su tienda</li>
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
            <h2>3. Listas compartidas</h2>
            <p>
              Cuando un comprador decide compartir su lista de favoritos, generamos un enlace público que contiene un token aleatorio
              de al menos 32 caracteres. Ten en cuenta que:
            </p>
            <ul>
              <li>El enlace solo se genera cuando el comprador lo solicita explícitamente. Las listas no son accesibles públicamente por defecto.</li>
              <li>Cualquier persona que reciba el enlace puede ver los productos de esa lista y comprarlos, pero no puede modificarla ni eliminarla.</li>
              <li>La vista compartida no revela ninguna información sobre la identidad del propietario de la lista.</li>
              <li>Estas páginas incluyen la directiva <code>noindex</code>, por lo que no son indexadas por motores de búsqueda.</li>
            </ul>

            {/* 4 */}
            <h2>4. Compartir información con terceros</h2>
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

            {/* 5 */}
            <h2>5. Retención de datos</h2>
            <ul>
              <li>
                <strong>Mientras la app esté instalada:</strong> conservamos los datos necesarios para operar la app.
              </li>
              <li>
                <strong>Tras desinstalar la app:</strong> conservamos temporalmente las listas de favoritos, de modo que si el comerciante
                reinstala Lovelist, los compradores recuperan sus listas intactas. Si Shopify confirma la desinstalación definitiva mediante
                el webhook <code>shop/redact</code>, eliminamos todos los datos asociados a la tienda.
              </li>
              <li>
                <strong>Solicitudes de eliminación de un cliente:</strong> al recibir el webhook <code>customers/redact</code>,
                eliminamos todas las listas de favoritos asociadas a ese cliente en esa tienda.
              </li>
              <li>
                <strong>Logs técnicos:</strong> se conservan por un máximo de 90 días.
              </li>
            </ul>

            {/* 6 */}
            <h2>6. Derechos del comerciante y del cliente final</h2>
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
            <p>Lovelist implementa los tres webhooks obligatorios de Shopify:</p>
            <ul>
              <li><code>customers/data_request</code> — atendemos solicitudes de acceso de datos</li>
              <li><code>customers/redact</code> — eliminamos las listas de favoritos de un cliente específico</li>
              <li><code>shop/redact</code> — eliminamos todos los datos de una tienda tras la desinstalación</li>
            </ul>

            {/* 7 */}
            <h2>7. Seguridad</h2>
            <p>Implementamos medidas técnicas y organizativas para proteger la información:</p>
            <ul>
              <li>Conexiones cifradas con HTTPS/TLS</li>
              <li>Autenticación mediante OAuth 2.0 y tokens de sesión de Shopify</li>
              <li>Validación HMAC en todas las peticiones del App Proxy y en todos los webhooks</li>
              <li>Verificación de propiedad en cada operación: ningún comprador puede leer ni modificar la lista de otro</li>
              <li>Límites de escritura para prevenir abuso automatizado</li>
              <li>Acceso restringido a la base de datos</li>
            </ul>

            {/* 8 */}
            <h2>8. Cookies</h2>
            <p>
              Lovelist funciona como una app embebida dentro del admin de Shopify y utiliza cookies de sesión estrictamente
              necesarias para autenticación.
            </p>
            <p>
              En la tienda del comerciante, Lovelist no utiliza cookies. Emplea únicamente el almacenamiento local (<code>localStorage</code>)
              del navegador para guardar un identificador anónimo, según se describe en la sección 1.3. No usamos cookies de marketing
              ni de seguimiento de terceros.
            </p>

            {/* 9 */}
            <h2>9. Menores de edad</h2>
            <p>
              Lovelist está dirigida a comerciantes mayores de edad. No recopilamos conscientemente información de menores.
            </p>

            {/* 10 */}
            <h2>10. Cambios a esta política</h2>
            <p>
              Podemos actualizar esta política ocasionalmente. Notificaremos cambios significativos a través de la app o por correo
              electrónico al propietario de la tienda. La fecha de "Última actualización" en la parte superior indica cuándo se hizo el último cambio.
            </p>

            {/* 11 */}
            <h2>11. Contacto</h2>
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
              className="inline-flex items-center gap-2 text-[#E11D62] font-semibold hover:gap-3 transition-all text-sm"
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
