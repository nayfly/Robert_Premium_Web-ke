import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="pt-20">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                    Política de Cookies
                  </span>
                </h1>
                <p className="max-w-[700px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Información sobre el uso de cookies en este sitio web
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-4xl space-y-8">
              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/30">
                <h2 className="text-2xl font-bold text-purple-400">¿Qué son las cookies?</h2>
                <p className="text-gray-300">
                  Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio
                  web. Nos ayudan a mejorar tu experiencia de navegación, recordar tus preferencias y analizar cómo
                  utilizas nuestro sitio.
                </p>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Tipos de cookies que utilizamos</h2>

                <div className="space-y-4">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="text-lg font-semibold text-purple-400">Cookies técnicas (necesarias)</h3>
                    <p className="text-gray-300">
                      Son esenciales para el funcionamiento del sitio web. Permiten la navegación y el uso de diferentes
                      funciones. No requieren consentimiento ya que son imprescindibles para el servicio.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-semibold text-blue-400">Cookies de preferencias</h3>
                    <p className="text-gray-300">
                      Permiten recordar información que cambia la forma en que se comporta o ve el sitio web, como tu
                      idioma preferido o la región en la que te encuentras.
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-semibold text-green-400">Cookies analíticas</h3>
                    <p className="text-gray-300">
                      Nos ayudan a entender cómo interactúas con el sitio web proporcionando información sobre las
                      páginas visitadas, el tiempo de permanencia y otros datos estadísticos.
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="text-lg font-semibold text-orange-400">Cookies de marketing</h3>
                    <p className="text-gray-300">
                      Se utilizan para rastrear a los visitantes en los sitios web con la intención de mostrar anuncios
                      relevantes y atractivos para el usuario individual.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Cookies específicas utilizadas</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-2 text-purple-400">Nombre</th>
                        <th className="text-left p-2 text-purple-400">Propósito</th>
                        <th className="text-left p-2 text-purple-400">Duración</th>
                        <th className="text-left p-2 text-purple-400">Tipo</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      <tr className="border-b border-gray-800">
                        <td className="p-2">_session</td>
                        <td className="p-2">Mantiene la sesión del usuario</td>
                        <td className="p-2">Sesión</td>
                        <td className="p-2">Técnica</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="p-2">preferences</td>
                        <td className="p-2">Guarda preferencias del usuario</td>
                        <td className="p-2">1 año</td>
                        <td className="p-2">Preferencias</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="p-2">_analytics</td>
                        <td className="p-2">Análisis de uso del sitio</td>
                        <td className="p-2">2 años</td>
                        <td className="p-2">Analítica</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Gestión de cookies</h2>
                <p className="text-gray-300 mb-4">Puedes controlar y gestionar las cookies de varias maneras:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>
                    <strong className="text-white">Configuración del navegador:</strong> La mayoría de navegadores
                    permiten controlar las cookies a través de sus configuraciones.
                  </li>
                  <li>
                    <strong className="text-white">Panel de preferencias:</strong> Puedes cambiar tus preferencias de
                    cookies en cualquier momento desde nuestro panel.
                  </li>
                  <li>
                    <strong className="text-white">Eliminar cookies:</strong> Puedes eliminar las cookies ya almacenadas
                    en tu dispositivo en cualquier momento.
                  </li>
                </ul>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Configuración por navegador</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-2">Chrome</h3>
                    <p className="text-gray-300 text-sm">
                      Configuración → Privacidad y seguridad → Cookies y otros datos de sitios
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-2">Firefox</h3>
                    <p className="text-gray-300 text-sm">
                      Opciones → Privacidad y seguridad → Cookies y datos del sitio
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-2">Safari</h3>
                    <p className="text-gray-300 text-sm">Preferencias → Privacidad → Gestionar datos de sitios web</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-2">Edge</h3>
                    <p className="text-gray-300 text-sm">Configuración → Privacidad, búsqueda y servicios → Cookies</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Consecuencias de deshabilitar cookies</h2>
                <p className="text-gray-300">
                  Si decides deshabilitar las cookies, algunas funcionalidades del sitio web pueden verse afectadas:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 mt-4">
                  <li>Es posible que no puedas acceder a ciertas áreas del sitio web.</li>
                  <li>Algunas funciones pueden no funcionar correctamente.</li>
                  <li>Tu experiencia de usuario puede verse reducida.</li>
                  <li>Es posible que tengas que reintroducir información repetidamente.</li>
                </ul>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Actualizaciones de esta política</h2>
                <p className="text-gray-300">
                  Esta política de cookies puede actualizarse periódicamente para reflejar cambios en nuestras prácticas
                  o por otros motivos operativos, legales o reglamentarios. Te recomendamos revisar esta página
                  regularmente.
                </p>
                <p className="text-gray-300 mt-4">
                  <strong className="text-white">Última actualización:</strong> {new Date().toLocaleDateString("es-ES")}
                </p>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Contacto</h2>
                <p className="text-gray-300">
                  Si tienes preguntas sobre nuestra política de cookies, puedes contactarnos en:
                </p>
                <p className="text-purple-400 mt-2">
                  <strong>Email:</strong> hola@robertsoftware.com
                </p>
              </div>

              <div className="flex justify-center mt-12">
                <Link href="/">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al inicio
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
