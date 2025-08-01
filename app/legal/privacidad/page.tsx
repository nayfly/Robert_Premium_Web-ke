import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacidadPage() {
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
                    Política de Privacidad
                  </span>
                </h1>
                <p className="max-w-[700px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Información sobre el tratamiento de tus datos personales
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-4xl space-y-8">
              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/30">
                <h2 className="text-2xl font-bold text-purple-400">Responsable del tratamiento</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>
                    <strong className="text-white">Nombre:</strong> Robert Software
                  </li>
                  <li>
                    <strong className="text-white">Correo electrónico:</strong> hola@robertsoftware.com
                  </li>
                  <li>
                    <strong className="text-white">Sitio web:</strong> www.robertsoftware.com
                  </li>
                </ul>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Finalidad del tratamiento</h2>
                <p className="text-gray-300 mb-4">
                  Los datos personales recogidos a través del formulario de contacto, consultas o por otros medios se
                  utilizan para:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>Atender solicitudes de consultoría y servicios profesionales.</li>
                  <li>Gestionar el panel de clientes y proyectos en curso.</li>
                  <li>
                    Enviar información comercial relacionada con servicios de IA, automatización y ciberseguridad.
                  </li>
                  <li>Mejorar la experiencia del usuario en el sitio web.</li>
                  <li>Cumplir con obligaciones contractuales y legales.</li>
                </ul>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Legitimación</h2>
                <p className="text-gray-300">
                  El tratamiento se basa en el consentimiento del interesado al enviar sus datos mediante formularios,
                  el interés legítimo para el envío de comunicaciones comerciales, y la ejecución de contratos de
                  servicios profesionales.
                </p>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Conservación de los datos</h2>
                <p className="text-gray-300">
                  Los datos se conservarán durante el tiempo necesario para cumplir con la finalidad para la que se
                  recabaron, mientras exista un interés mutuo, o durante el tiempo necesario para cumplir con
                  obligaciones legales. Los datos de clientes se conservarán durante la duración del contrato y
                  posteriormente según la legislación aplicable.
                </p>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Destinatarios</h2>
                <p className="text-gray-300">
                  Los datos no se comunicarán a terceros, salvo obligación legal o si fuera necesario para prestar el
                  servicio solicitado (proveedores de servicios tecnológicos, plataformas de pago, etc.). En caso de
                  utilizar proveedores externos, se garantiza que cumplan con el RGPD.
                </p>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Derechos del usuario</h2>
                <p className="text-gray-300 mb-4">Cualquier persona tiene derecho a:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>Acceder a sus datos personales y obtener información sobre su tratamiento.</li>
                  <li>Rectificar los datos inexactos o incompletos.</li>
                  <li>Solicitar la supresión de sus datos cuando ya no sean necesarios.</li>
                  <li>Oponerse al tratamiento de sus datos.</li>
                  <li>Solicitar la limitación del tratamiento.</li>
                  <li>Solicitar la portabilidad de sus datos.</li>
                  <li>Presentar una reclamación ante la Agencia Española de Protección de Datos.</li>
                </ul>
                <p className="text-gray-300 mt-4">
                  <strong className="text-white">Para ejercer estos derechos:</strong> Envía un correo electrónico a
                  hola@robertsoftware.com indicando claramente el derecho que deseas ejercer y adjuntando copia de tu
                  documento de identidad.
                </p>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Medidas de seguridad</h2>
                <p className="text-gray-300">
                  Se han adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de los
                  datos de carácter personal y evitar su alteración, pérdida, tratamiento o acceso no autorizado.
                  Utilizamos cifrado SSL, sistemas de backup seguros y acceso restringido a los datos.
                </p>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Transferencias internacionales</h2>
                <p className="text-gray-300">
                  En caso de realizar transferencias internacionales de datos, se garantiza que se realizan a países con
                  nivel de protección adecuado o mediante las garantías apropiadas establecidas en el RGPD.
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
