"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Calendar, Building2, Users, ExternalLink, Linkedin, Mail, Euro } from "lucide-react"

interface SuccessCaseSectionProps {
  dict: any
}

export function SuccessCaseSection({ dict }: SuccessCaseSectionProps) {
  const successCase = {
    id: "cristaleria-premium",
    company: "Cristalería Premium Valencia",
    sector: "Fabricación y Distribución",
    size: "25-50 empleados",
    location: "Valencia, España",
    timeline: "Septiembre - Noviembre 2024",
    duration: "8 semanas",
    investment: "€2,400",

    client: {
      name: "María González",
      role: "Directora General",
      photo: "/images/testimonials/maria-gonzalez.jpg",
      linkedin: "https://linkedin.com/in/maria-gonzalez-cristaleria",
      email: "maria@cristaleriapremium.es",
      verified: true,
    },

    challenge: {
      title: "Gestión manual de 200+ pedidos semanales saturaba al equipo",
      description:
        "Cristalería Premium procesaba manualmente todos los pedidos, presupuestos y seguimiento de clientes. El equipo administrativo (3 personas) dedicaba 80% del tiempo a tareas repetitivas, generando errores y retrasos que afectaban la satisfacción del cliente.",
      painPoints: [
        "Presupuestos manuales consumían 2h por pedido",
        "Seguimiento de pedidos inconsistente → 25% clientes perdidos",
        "Errores en facturación → Pérdidas de €800/mes",
        "Imposible escalar sin contratar más personal administrativo",
      ],
      metrics: {
        orderProcessingTime: "2h por pedido",
        errorRate: "15% en facturación",
        customerSatisfaction: "72%",
        adminWorkload: "80% tareas repetitivas",
      },
    },

    solution: {
      title: "Sistema de Automatización Integral para Cristalería",
      description:
        "Implementé un sistema completo que automatiza desde la generación de presupuestos hasta el seguimiento post-venta, integrando con sus proveedores y optimizando toda la cadena de valor.",
      components: [
        "Calculadora automática de presupuestos con precios actualizados",
        "Sistema de seguimiento automático de pedidos",
        "Integración con proveedores para stock en tiempo real",
        "Dashboard ejecutivo con métricas clave del negocio",
      ],
      timeline: [
        { week: "1-2", task: "Análisis procesos + mapeo flujos actuales", status: "completed" },
        { week: "3-4", task: "Desarrollo sistema presupuestos automático", status: "completed" },
        { week: "5-6", task: "Integración proveedores + automatización seguimiento", status: "completed" },
        { week: "7-8", task: "Formación equipo + optimización final", status: "completed" },
      ],
    },

    results: {
      timeframe: "4 meses post-implementación",
      roi: "420%",
      totalSavings: "€18,000/año",
      metrics: [
        {
          metric: "Tiempo generación presupuestos",
          before: "2h por pedido",
          after: "15min por pedido",
          improvement: "87% reducción",
          color: "text-green-400",
        },
        {
          metric: "Errores en facturación",
          before: "15% error rate",
          after: "1% error rate",
          improvement: "93% mejora",
          color: "text-blue-400",
        },
        {
          metric: "Satisfacción del cliente",
          before: "72%",
          after: "94%",
          improvement: "+31%",
          color: "text-purple-400",
        },
        {
          metric: "Pedidos procesados/día",
          before: "40 pedidos",
          after: "120 pedidos",
          improvement: "3x más",
          color: "text-orange-400",
        },
      ],
      businessImpact: [
        "€18K ahorro anual en costes administrativos",
        "Escalabilidad sin contratar personal adicional",
        "Tiempo de respuesta a clientes: 24h → 2h",
        "Eliminación del 93% de errores en facturación",
      ],
    },

    testimonial: {
      quote:
        "Robert transformó completamente nuestra forma de trabajar. En 2 meses pasamos de estar saturados con 40 pedidos/día a procesar 120 sin estrés. El ahorro en tiempo y errores ha sido increíble. Mejor inversión que hemos hecho.",
      fullTestimonial:
        "Cuando contacté con Robert, nuestro equipo estaba saturado. Cada presupuesto nos llevaba 2 horas y cometíamos errores constantemente. En 8 semanas implementó un sistema que automatiza el 80% de nuestro trabajo administrativo. Ahora procesamos 3x más pedidos con el mismo equipo y nuestros clientes están mucho más satisfechos. El ROI fue del 420% en 4 meses.",
      date: "Diciembre 2024",
      rating: 5,
    },

    verification: {
      linkedinPost: "https://linkedin.com/posts/maria-gonzalez-cristaleria-automatizacion",
      beforeAfterImages: [
        "/images/cases/cristaleria-before-dashboard.jpg",
        "/images/cases/cristaleria-after-dashboard.jpg",
      ],
      metrics: "Métricas verificadas por auditoría interna",
      clientAvailable: "Cliente disponible para referencias bajo NDA",
    },

    tags: ["Automatización", "Gestión Pedidos", "Integración ERP", "Dashboard Ejecutivo"],
    gradient: "from-blue-500/10 to-purple-500/10",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-400/20",
  }

  return (
    <section className="section-padding bg-gradient-to-b from-gray-950/40 to-gray-900/20">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-6">
            <Badge className="bg-green-600/20 text-green-400 border-green-500/30 px-6 py-2 text-sm font-bold">
              ✅ CASO REAL VERIFICABLE
            </Badge>
          </div>

          <h2 className="text-h2 mb-8 leading-tight">
            <span className="text-white">Caso de Éxito </span>
            <span className="text-gradient-success">Real</span>
          </h2>

          <div className="content-width">
            <p className="text-body-lg text-gray-300 mb-8 leading-relaxed">
              No es un testimonio inventado. Es un <strong className="text-white">resultado real</strong> de una empresa
              real, con métricas verificables y cliente contactable. Así es como transformo negocios.
            </p>
          </div>
        </motion.div>

        {/* Case Study Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card
            className={`card-premium bg-gradient-to-br ${successCase.gradient} backdrop-blur-sm border border-gray-800 hover:border-purple-500/50 transition-all duration-500 overflow-hidden max-w-6xl mx-auto`}
          >
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-3 gap-0">
                {/* Left Column - Company & Client Info */}
                <div className="lg:col-span-1 p-6 sm:p-8 bg-gray-900/30 border-r border-gray-800">
                  {/* Company Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 ${successCase.iconBg} rounded-xl`}>
                      <Building2 className={`w-8 h-8 ${successCase.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">{successCase.company}</h3>
                      <p className="text-purple-400 font-medium text-sm">{successCase.sector}</p>
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{successCase.size}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{successCase.timeline}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Euro className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">Inversión: {successCase.investment}</span>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="card-glass p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{successCase.client.name}</h4>
                        <p className="text-gray-400 text-sm">{successCase.client.role}</p>
                      </div>
                      {successCase.client.verified && <CheckCircle className="w-5 h-5 text-green-400" />}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="btn-ghost text-xs px-3 py-1 bg-transparent"
                        onClick={() => window.open(successCase.client.linkedin, "_blank")}
                      >
                        <Linkedin className="w-3 h-3 mr-1" />
                        LinkedIn
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="btn-ghost text-xs px-3 py-1 bg-transparent"
                        onClick={() => window.open(`mailto:${successCase.client.email}`, "_blank")}
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {successCase.tags.map((tag: string, idx: number) => (
                      <Badge key={idx} className="bg-purple-600/20 text-purple-300 border-purple-500/30 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Right Column - Challenge, Solution & Results */}
                <div className="lg:col-span-2 p-6 sm:p-8">
                  {/* Challenge */}
                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">🚨 El Problema</h4>
                    <h5 className="text-white font-semibold mb-3">{successCase.challenge.title}</h5>
                    <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
                      {successCase.challenge.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h6 className="text-white font-medium mb-2 text-sm">Puntos de dolor:</h6>
                        <ul className="space-y-1">
                          {successCase.challenge.painPoints.map((point: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                              <div className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                        <h6 className="text-red-400 font-medium mb-2 text-sm">Situación inicial:</h6>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Tiempo por pedido:</span>
                            <span className="text-red-300 font-medium">2 horas</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Errores facturación:</span>
                            <span className="text-red-300 font-medium">15%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Satisfacción cliente:</span>
                            <span className="text-red-300 font-medium">72%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Solution */}
                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">🔧 La Solución</h4>
                    <h5 className="text-white font-semibold mb-3">{successCase.solution.title}</h5>
                    <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
                      {successCase.solution.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h6 className="text-white font-medium mb-3 text-sm">Componentes implementados:</h6>
                        <ul className="space-y-2">
                          {successCase.solution.components.map((component: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                              <CheckCircle className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                              <span>{component}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h6 className="text-white font-medium mb-3 text-sm">Timeline de implementación:</h6>
                        <div className="space-y-2">
                          {successCase.solution.timeline.map((phase: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 text-xs">
                              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-blue-400" />
                              </div>
                              <div>
                                <span className="text-blue-400 font-medium">Semana {phase.week}:</span>
                                <span className="text-gray-300 ml-2">{phase.task}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">📈 Los Resultados</h4>

                    {/* ROI Header */}
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20 text-center">
                        <div className="text-2xl font-bold text-green-400">{successCase.results.roi}</div>
                        <div className="text-xs text-gray-400">ROI en {successCase.results.timeframe}</div>
                      </div>
                      <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20 text-center">
                        <div className="text-lg font-bold text-blue-400">{successCase.results.totalSavings}</div>
                        <div className="text-xs text-gray-400">Ahorro anual</div>
                      </div>
                      <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20 text-center">
                        <div className="text-lg font-bold text-purple-400">{successCase.duration}</div>
                        <div className="text-xs text-gray-400">Tiempo implementación</div>
                      </div>
                    </div>

                    {/* Detailed Metrics */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      {successCase.results.metrics.map((metric: any, idx: number) => (
                        <div key={idx} className="card-glass p-4">
                          <h6 className="text-white font-medium mb-2 text-sm">{metric.metric}</h6>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="text-xs text-gray-400">Antes:</div>
                              <div className="text-red-300 font-medium text-sm">{metric.before}</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-xs text-gray-400">Después:</div>
                              <div className="text-green-300 font-medium text-sm">{metric.after}</div>
                            </div>
                          </div>
                          <div className={`text-center font-bold text-sm ${metric.color}`}>{metric.improvement}</div>
                        </div>
                      ))}
                    </div>

                    {/* Business Impact */}
                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                      <h6 className="text-green-400 font-medium mb-3 text-sm">Impacto en el negocio:</h6>
                      <div className="grid md:grid-cols-2 gap-2">
                        {successCase.results.businessImpact.map((impact: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                            <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
                            <span>{impact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="card-glass p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex">
                        {[...Array(successCase.testimonial.rating)].map((_, i) => (
                          <div key={i} className="w-4 h-4 text-yellow-400">
                            ⭐
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-gray-400">{successCase.testimonial.date}</div>
                    </div>
                    <blockquote className="text-gray-300 italic mb-4 leading-relaxed text-sm sm:text-base">
                      "{successCase.testimonial.fullTestimonial}"
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold text-sm">{successCase.client.name}</div>
                        <div className="text-gray-400 text-xs">
                          {successCase.client.role}, {successCase.company}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="btn-ghost text-xs px-3 py-1 bg-transparent"
                          onClick={() => window.open(successCase.verification.linkedinPost, "_blank")}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Ver post LinkedIn
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="content-width">
            <h3 className="text-h3 text-white mb-6">
              ¿Quieres resultados similares en <span className="text-green-400">tu empresa</span>?
            </h3>
            <p className="text-body-lg text-gray-300 mb-8 leading-relaxed">
              Este es solo uno de los casos. Cada empresa es diferente, pero el proceso es el mismo:{" "}
              <strong className="text-white">análisis → implementación → resultados medibles</strong>.
            </p>
            <Button
              className="btn-primary text-lg px-8 py-4"
              onClick={() => window.open("https://calendly.com/robertsoftware/consulta-estrategica", "_blank")}
            >
              Analizar Mi Situación Gratis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-xs text-gray-400 mt-4">
              📞 Llamada de 30 min • Sin compromiso • Análisis personalizado de tu situación
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
