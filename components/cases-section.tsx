"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Users,
  Calendar,
  Euro,
  CheckCircle,
  ExternalLink,
  Linkedin,
  Mail,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
} from "lucide-react"
import { vercelAnalytics } from "@/lib/vercel-analytics"

interface CaseStudy {
  id: string
  title: string
  company: string
  industry: string
  employees: string
  period: string
  investment: string
  problem: {
    title: string
    description: string
    painPoints: string[]
    initialSituation: {
      timePerOrder: string
      errorRate: string
      customerSatisfaction: string
    }
  }
  solution: {
    title: string
    description: string
    components: string[]
    timeline: Array<{
      week: string
      milestone: string
    }>
  }
  results: {
    title: string
    metrics: Array<{
      metric: string
      before: string
      after: string
      improvement: string
    }>
  }
  client: {
    name: string
    position: string
    photo: string
    linkedin: string
    email: string
    verified: boolean
  }
  testimonial: string
  verificationLink: string
  tags: string[]
}

const caseStudy: CaseStudy = {
  id: "cristaleria-premium-valencia",
  title: "Sistema de Automatización Integral para Cristalería",
  company: "Cristalería Premium Valencia",
  industry: "Fabricación y Distribución",
  employees: "25-50 empleados",
  period: "Septiembre - Noviembre 2024",
  investment: "€2,400",
  problem: {
    title: "El Problema",
    description:
      "Cristalería Premium procesaba manualmente todos los pedidos, presupuestos y seguimiento de clientes. El equipo administrativo (3 personas) dedicaba 80% del tiempo a tareas repetitivas, generando errores y retrasos que afectaban la satisfacción del cliente.",
    painPoints: [
      "Presupuestos manuales consumían 2h por pedido",
      "Seguimiento de pedidos inconsistente → 25% clientes perdidos",
      "Errores en facturación → Pérdidas de €800/mes",
      "Imposible escalar sin contratar más personal administrativo",
    ],
    initialSituation: {
      timePerOrder: "2 horas",
      errorRate: "15%",
      customerSatisfaction: "72%",
    },
  },
  solution: {
    title: "La Solución",
    description:
      "Implementé un sistema completo que automatiza desde la generación de presupuestos hasta el seguimiento post-venta, integrando con sus proveedores y optimizando toda la cadena de valor.",
    components: [
      "Calculadora automática de presupuestos con precios actualizados",
      "Sistema de seguimiento de pedidos en tiempo real",
      "Integración ERP con proveedores principales",
      "Dashboard ejecutivo con métricas clave",
      "Automatización de facturación y recordatorios",
    ],
    timeline: [
      { week: "Semana 1-2", milestone: "Análisis procesos + mapeo flujos actuales" },
      { week: "Semana 3-4", milestone: "Desarrollo calculadora + integración precios" },
      { week: "Semana 5-6", milestone: "Sistema seguimiento + dashboard cliente" },
      { week: "Semana 7-8", milestone: "Integración ERP + automatización facturación" },
    ],
  },
  results: {
    title: "Los Resultados",
    metrics: [
      {
        metric: "Tiempo por pedido",
        before: "2 horas",
        after: "15 minutos",
        improvement: "87.5% reducción",
      },
      {
        metric: "Errores facturación",
        before: "15%",
        after: "2%",
        improvement: "86.7% reducción",
      },
      {
        metric: "Satisfacción cliente",
        before: "72%",
        after: "94%",
        improvement: "30.6% aumento",
      },
      {
        metric: "Ingresos mensuales",
        before: "€45,000",
        after: "€67,000",
        improvement: "48.9% aumento",
      },
    ],
  },
  client: {
    name: "María González",
    position: "Directora General",
    photo: "/placeholder.svg?height=80&width=80&text=MG",
    linkedin: "https://linkedin.com/in/maria-gonzalez-cristaleria",
    email: "maria@cristaleriapremium.com",
    verified: true,
  },
  testimonial:
    "Robert transformó completamente nuestro negocio. En 2 meses pasamos de estar saturados con trabajo manual a tener un sistema que funciona solo. Nuestros clientes están más satisfechos y hemos podido crecer 50% sin contratar más personal administrativo.",
  verificationLink: "https://cristaleriapremium.com/caso-exito-robert-software",
  tags: ["Automatización", "Gestión Pedidos", "Integración ERP", "Dashboard Ejecutivo"],
}

export function CasesSection() {
  const [showFullCase, setShowFullCase] = useState(false)

  const handleViewCase = () => {
    setShowFullCase(true)
    vercelAnalytics.trackCaseView(caseStudy.id, caseStudy.company)
  }

  const handleContactClient = (method: "linkedin" | "email") => {
    vercelAnalytics.trackClientContact(caseStudy.id, method)
    if (method === "linkedin") {
      window.open(caseStudy.client.linkedin, "_blank")
    } else {
      window.location.href = `mailto:${caseStudy.client.email}`
    }
  }

  return (
    <section
      className="py-20 px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #581c87 35%, #1e293b 100%)",
      }}
    >
      {/* Efectos de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">✅ CASO REAL VERIFICABLE</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Caso de Éxito <span className="text-green-400">Real</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            No es un testimonio inventado. Es un <strong className="text-white">resultado real</strong> de una empresa
            real, con métricas verificables y cliente contactable. Así es como transformo negocios.
          </p>
        </div>

        {/* Caso de Éxito */}
        <div className="max-w-6xl mx-auto">
          <Card
            className="overflow-hidden border-0 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-5 gap-0">
                {/* Información del Cliente */}
                <div
                  className="lg:col-span-2 p-8"
                  style={{
                    background: "linear-gradient(135deg, rgba(88, 28, 135, 0.3) 0%, rgba(15, 23, 42, 0.8) 100%)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Building2 className="h-8 w-8 text-purple-400" />
                    <div>
                      <h3 className="text-2xl font-bold text-white">{caseStudy.company}</h3>
                      <p className="text-purple-300">{caseStudy.industry}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Users className="h-5 w-5 text-blue-400" />
                      <span>{caseStudy.employees}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <Calendar className="h-5 w-5 text-green-400" />
                      <span>{caseStudy.period}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <Euro className="h-5 w-5 text-yellow-400" />
                      <span>Inversión: {caseStudy.investment}</span>
                    </div>
                  </div>

                  {/* Cliente */}
                  <div
                    className="p-6 rounded-xl border border-gray-700/50"
                    style={{
                      background: "rgba(15, 23, 42, 0.6)",
                    }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={caseStudy.client.photo || "/placeholder.svg"}
                        alt={caseStudy.client.name}
                        className="w-16 h-16 rounded-full border-2 border-purple-400"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-semibold text-white">{caseStudy.client.name}</h4>
                          {caseStudy.client.verified && <CheckCircle className="h-5 w-5 text-green-400" />}
                        </div>
                        <p className="text-gray-400">{caseStudy.client.position}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleContactClient("linkedin")}
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                      >
                        <Linkedin className="h-4 w-4 mr-1" />
                        LinkedIn
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleContactClient("email")}
                        className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-6">
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Detalles del Caso */}
                <div className="lg:col-span-3 p-8">
                  {/* Problema */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertTriangle className="h-6 w-6 text-red-400" />
                      <h3 className="text-xl font-bold text-red-400">{caseStudy.problem.title}</h3>
                    </div>
                    <p className="text-gray-300 mb-4">{caseStudy.problem.description}</p>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div
                        className="p-4 rounded-lg border border-red-500/30"
                        style={{ background: "rgba(239, 68, 68, 0.1)" }}
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-400 mb-1">
                            {caseStudy.problem.initialSituation.timePerOrder}
                          </div>
                          <div className="text-sm text-gray-400">Tiempo por pedido</div>
                        </div>
                      </div>
                      <div
                        className="p-4 rounded-lg border border-red-500/30"
                        style={{ background: "rgba(239, 68, 68, 0.1)" }}
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-400 mb-1">
                            {caseStudy.problem.initialSituation.errorRate}
                          </div>
                          <div className="text-sm text-gray-400">Errores facturación</div>
                        </div>
                      </div>
                      <div
                        className="p-4 rounded-lg border border-red-500/30"
                        style={{ background: "rgba(239, 68, 68, 0.1)" }}
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-400 mb-1">
                            {caseStudy.problem.initialSituation.customerSatisfaction}
                          </div>
                          <div className="text-sm text-gray-400">Satisfacción cliente</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-400 mb-2">Puntos de dolor:</p>
                      {caseStudy.problem.painPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-2 text-gray-300">
                          <span className="text-red-400 mt-1">•</span>
                          <span className="text-sm">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Solución */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Lightbulb className="h-6 w-6 text-blue-400" />
                      <h3 className="text-xl font-bold text-blue-400">{caseStudy.solution.title}</h3>
                    </div>
                    <p className="text-gray-300 mb-4">{caseStudy.solution.description}</p>

                    <div className="space-y-2 mb-6">
                      <p className="text-sm font-medium text-gray-400 mb-2">Componentes implementados:</p>
                      {caseStudy.solution.components.map((component, index) => (
                        <div key={index} className="flex items-start gap-2 text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{component}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      {caseStudy.solution.timeline.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg border border-blue-500/30"
                          style={{ background: "rgba(59, 130, 246, 0.1)" }}
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-blue-400 font-medium text-sm">{item.week}</div>
                            <div className="text-gray-300 text-sm">{item.milestone}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resultados */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="h-6 w-6 text-green-400" />
                      <h3 className="text-xl font-bold text-green-400">{caseStudy.results.title}</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {caseStudy.results.metrics.map((metric, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg border border-green-500/30"
                          style={{ background: "rgba(34, 197, 94, 0.1)" }}
                        >
                          <div className="text-sm text-gray-400 mb-1">{metric.metric}:</div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-red-400 text-sm">{metric.before}</span>
                            <span className="text-gray-500">→</span>
                            <span className="text-green-400 font-bold">{metric.after}</span>
                          </div>
                          <div className="text-center">
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                              {metric.improvement}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div
                className="p-8 border-t border-gray-700/50"
                style={{
                  background: "linear-gradient(135deg, rgba(88, 28, 135, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)",
                }}
              >
                <blockquote className="text-lg text-gray-300 italic text-center mb-6">
                  "{caseStudy.testimonial}"
                </blockquote>
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => window.open(caseStudy.verificationLink, "_blank")}
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Verificar Caso Real
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-white mb-4">¿Quieres resultados similares en tu negocio?</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Este es solo uno de los casos. Cada negocio es único, pero los resultados son consistentes: más eficiencia,
            menos errores, mayor crecimiento.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold"
            onClick={() => {
              vercelAnalytics.trackCTAClick("cases-section", "consultation-request")
              window.location.href = "#contact"
            }}
          >
            Solicitar Consulta Estratégica
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CasesSection
