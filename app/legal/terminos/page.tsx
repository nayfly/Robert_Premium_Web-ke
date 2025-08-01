import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TerminosPage() {
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
                    Términos y Condiciones
                  </span>
                </h1>
                <p className="max-w-[700px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Condiciones generales de contratación de servicios
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-4xl space-y-8">
              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/30">
                <h2 className="text-2xl font-bold text-purple-400">Información general</h2>
                <p className="text-gray-300">
                  Los presentes términos y condiciones regulan la contratación de servicios profesionales ofrecidos por
                  Robert Software, incluyendo consultoría en inteligencia artificial, automatización, auditorías de
                  ciberseguridad y desarrollo de soluciones tecnológicas personalizadas.
                </p>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Servicios ofrecidos</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>
                    <strong className="text-white">Consultoría en IA Estratégica:</strong> Análisis, diseño e
                    implementación de soluciones de inteligencia artificial.
                  </li>
                  <li>
                    <strong className="text-white">Auditorías de Ciberseguridad:</strong> Evaluación de vulnerabilidades
                    y planes de remediación.
                  </li>
                  <li>
                    <strong className="text-white">Automatización de Procesos:</strong> Desarrollo de sistemas
                    automatizados personalizados.
                  </li>
                  <li>
                    <strong className="text-white">Growth Partner:</strong> Servicios de CTO externo y asesoramiento
                    tecnológico continuo.
                  </li>
                  <li>
                    <strong className="text-white">Agentes IA Personalizados:</strong> Desarrollo de agentes
                    inteligentes específicos para cada negocio.
                  </li>
                </ul>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Proceso de contratación</h2>
                <ol className="list-decimal pl-6 space-y-2 text-gray-300">
                  <li>Consulta inicial gratuita de 45 minutos para evaluar necesidades.</li>
                  <li>Propuesta personalizada con alcance, plazos y presupuesto detallado.</li>
                  <li>Firma de contrato específico para cada proyecto.</li>
                  <li>Pago inicial según condiciones acordadas (generalmente 50% al inicio).</li>
                  <li>Desarrollo del proyecto con seguimiento regular.</li>
                  <li>Entrega final y liquidación del proyecto.</li>
                </ol>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Condiciones económicas</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>Los precios se establecen según la complejidad y alcance de cada proyecto.</li>
                  <li>Los pagos se realizarán según el calendario acordado en cada contrato.</li>
                  <li>Los precios no incluyen IVA, que se añadirá según la legislación vigente.</li>
                  <li>
                    Los gastos adicionales (desplazamientos, herramientas específicas) se facturarán por separado.
                  </li>
                  <li>Los retrasos en el pago pueden conllevar la suspensión temporal del servicio.</li>
                </ul>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Obligaciones del cliente</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>Proporcionar información veraz y completa sobre sus necesidades y sistemas.</li>
                  <li>Facilitar el acceso necesario a sistemas, datos y personal para la ejecución del proyecto.</li>
                  <li>Designar un interlocutor responsable para la comunicación del proyecto.</li>
                  <li>Realizar los pagos en los plazos acordados.</li>
                  <li>Colaborar activamente en las fases de implementación y testing.</li>
                </ul>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Confidencialidad</h2>
                <p className="text-gray-300">
                  Robert Software se compromete a mantener la más estricta confidencialidad sobre toda la información a
                  la que tenga acceso durante la prestación de servicios. Esta obligación se mantendrá incluso después
                  de la finalización del contrato. Se podrá firmar un acuerdo de confidencialidad específico si el
                  cliente lo requiere.
                </p>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Propiedad intelectual</h2>
                <p className="text-gray-300">
                  Las soluciones desarrolladas específicamente para el cliente serán de su propiedad una vez completado
                  el pago total del proyecto. Las metodologías, frameworks y conocimientos generales utilizados
                  permanecen como propiedad de Robert Software. Se respetarán las licencias de software de terceros
                  utilizadas.
                </p>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Garantías y responsabilidades</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>Se garantiza la calidad profesional de todos los servicios prestados.</li>
                  <li>Se ofrece soporte post-implementación según lo acordado en cada contrato.</li>
                  <li>La responsabilidad se limita al importe del contrato específico.</li>
                  <li>No se garantizan resultados específicos de negocio, sino la correcta implementación técnica.</li>
                  <li>El cliente es responsable del uso adecuado de las soluciones implementadas.</li>
                </ul>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Modificaciones y cancelaciones</h2>
                <p className="text-gray-300">
                  Las modificaciones del alcance del proyecto requerirán un acuerdo por escrito y pueden implicar
                  ajustes en precio y plazos. Las cancelaciones se regirán por lo establecido en cada contrato
                  específico. Robert Software se reserva el derecho de modificar estos términos con notificación previa
                  de 30 días.
                </p>
              </div>

              <div className="space-y-4 p-6 border border-gray-800 rounded-xl bg-gray-900/20 hover:bg-gray-900/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white">Resolución de conflictos</h2>
                <p className="text-gray-300">
                  En caso de discrepancias, se intentará llegar a una solución amistosa mediante negociación directa. Si
                  no fuera posible, las controversias se someterán a los tribunales competentes según la legislación
                  española. Se aplicará la legislación española vigente.
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
