import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AvisoLegalPage() {
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
                    Aviso Legal
                  </span>
                </h1>
                <p className="max-w-[700px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Información legal sobre el uso de este sitio web
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-4xl space-y-8">
              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/30">
                <h2 className="text-2xl font-bold text-purple-400">Titular del sitio web</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>
                    <strong className="text-white">Nombre:</strong> Robert Software (Nombre comercial)
                  </li>
                  <li>
                    <strong className="text-white">Actividad:</strong> Servicios de consultoría en inteligencia
                    artificial, automatización avanzada, auditorías de ciberseguridad y soluciones tecnológicas
                    estratégicas para empresas.
                  </li>
                  <li>
                    <strong className="text-white">Correo electrónico de contacto:</strong> hola@robertsoftware.com
                  </li>
                  <li>
                    <strong className="text-white">Sitio web:</strong> www.robertsoftware.com
                  </li>
                </ul>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Objeto</h2>
                <p className="text-gray-300">
                  El presente aviso legal regula el uso del sitio web www.robertsoftware.com (en adelante, el "Sitio
                  Web"), propiedad de Robert Software (en adelante, el "Titular").
                </p>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Usuarios</h2>
                <p className="text-gray-300">
                  El acceso y/o uso de este sitio web atribuye la condición de USUARIO, que acepta, desde dicho acceso
                  y/o uso, las condiciones aquí reflejadas.
                </p>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Uso del sitio web</h2>
                <p className="text-gray-300 mb-4">
                  El USUARIO se compromete a hacer un uso adecuado de los contenidos y servicios que el Titular ofrece y
                  a no emplearlos para:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>Realizar actividades ilícitas o contrarias a la buena fe y al orden público.</li>
                  <li>
                    Difundir contenidos o propaganda de carácter racista, xenófobo, pornográfico, ilegal o apología del
                    terrorismo.
                  </li>
                  <li>
                    Provocar daños en los sistemas físicos y lógicos del Titular, de sus proveedores o de terceras
                    personas.
                  </li>
                  <li>Intentar acceder de forma no autorizada a sistemas o datos del Titular.</li>
                </ul>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Propiedad Intelectual e Industrial</h2>
                <p className="text-gray-300">
                  Todos los contenidos del sitio web (textos, imágenes, logos, software, metodologías, etc.) son
                  propiedad del Titular o dispone de licencia para su uso, y están protegidos por la normativa de
                  propiedad intelectual e industrial. Queda prohibida su reproducción, distribución o modificación sin
                  autorización expresa.
                </p>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Responsabilidad</h2>
                <p className="text-gray-300">
                  El Titular no se hace responsable del mal uso que se realice de los contenidos del Sitio Web, siendo
                  exclusiva responsabilidad del USUARIO que accede a ellos o los utiliza. El Titular se reserva el
                  derecho de suspender temporalmente el acceso al sitio web por motivos de mantenimiento, actualización
                  o mejoras.
                </p>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Modificaciones</h2>
                <p className="text-gray-300">
                  El Titular se reserva el derecho de efectuar sin previo aviso las modificaciones que considere
                  oportunas en su sitio web, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios como
                  la forma en la que éstos aparezcan presentados o localizados.
                </p>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Legislación aplicable y jurisdicción</h2>
                <p className="text-gray-300">
                  La relación entre el Titular y el USUARIO se regirá por la normativa española vigente y cualquier
                  controversia se someterá a los Juzgados y tribunales de España, salvo que la Ley disponga lo
                  contrario.
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
