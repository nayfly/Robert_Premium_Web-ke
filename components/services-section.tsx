"use client"

import { Brain, Shield, Zap, Users, TrendingUp, ArrowRight, CheckCircle, Clock, X, Calculator } from "lucide-react"
import { analytics } from "@/lib/analytics"
import { useEffect, useState } from "react"
import { vercelAnalytics } from "@/lib/vercel-analytics"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ServicesSectionProps {
  dict: any
}

export function ServicesSection({ dict }: ServicesSectionProps) {
  const [visibleServices, setVisibleServices] = useState<number[]>([])
  const [selectedService, setSelectedService] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            analytics.trackPricingView("services_section")
            const serviceNames = services.map((s) => s.name)
            vercelAnalytics.trackPricingViewed("services_section", serviceNames)
          }
        })
      },
      { threshold: 0.3 },
    )

    const section = document.getElementById("servicios")
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  const handleServiceClick = (service: any) => {
    setSelectedService(service)
    setIsModalOpen(true)
    analytics.trackServiceInquiry(service.name, service.price)
    vercelAnalytics.trackServiceViewed(service.name, service.price)
  }

  const handleBookConsultation = (serviceName: string) => {
    analytics.trackConsultationRequest(`service_${serviceName}`)
    vercelAnalytics.trackFunnelStep("service_inquiry_funnel", 2, "consultation_clicked", serviceName)
    setIsModalOpen(false)
    window.open("https://calendly.com/robertsoftware/consulta-estrategica", "_blank")
  }

  const services = [
    {
      icon: Calculator,
      name: "Strategic_Audit",
      title: "Auditoría Estratégica Express",
      subtitle: "Tu roadmap tecnológico en 48h",
      description: "Análisis completo de tu situación actual y plan de acción específico para multiplicar resultados.",
      detailedDescription:
        "Una auditoría profunda que identifica exactamente dónde están las oportunidades de crecimiento en tu negocio y cómo aprovecharlas.",
      price: "€490",
      originalPrice: "€890",
      timeframe: "48 horas",
      roi: "500",
      roiTimeframe: "30 días",
      savings: "€5K-15K/año",
      badge: "PUNTO DE ENTRADA",
      badgeColor: "bg-green-600",
      gradient: "from-green-500/10 to-green-600/10",
      borderGlow: "hover:shadow-green-500/20",
      realBenefits: [
        "Identificas exactamente qué automatizar para ahorrar 20h/semana",
        "Descubres vulnerabilidades que podrían costarte €10K+",
        "Obtienes un plan paso a paso para los próximos 90 días",
        "Evitas invertir en tecnología que no necesitas",
      ],
      whatYouGet: [
        "Documento de 25+ páginas con análisis completo",
        "Roadmap priorizado por impacto/esfuerzo",
        "Estimación de ROI para cada oportunidad",
        "Lista de herramientas específicas recomendadas",
        "30 min de llamada para resolver dudas",
        "Garantía: Si no encuentras valor, reembolso 100%",
      ],
      perfectFor: "Empresas que quieren claridad antes de invertir en grande",
    },
    {
      icon: Brain,
      name: "AI_Strategy_Implementation",
      title: "Estrategia IA + Implementación",
      subtitle: "De 0 a IA productiva en 30 días",
      description: "Identifico, diseño e implemento soluciones IA que generan resultados medibles desde el primer mes.",
      detailedDescription:
        "Un proceso completo que transforma tu empresa con inteligencia artificial estratégica. No es solo consultoría, es implementación real con resultados medibles.",
      price: "€2,500",
      originalPrice: "€4,200",
      timeframe: "4-6 semanas",
      roi: "450",
      roiTimeframe: "6 meses",
      savings: "€25K-80K/año",
      badge: "MÁS POPULAR",
      badgeColor: "bg-purple-600",
      popular: true,
      gradient: "from-purple-500/10 to-purple-600/10",
      borderGlow: "hover:shadow-purple-500/20",
      realBenefits: [
        "Automatizas el 70% de consultas repetitivas → Ahorras 30h/semana",
        "IA que cualifica leads 24/7 → +40% conversión sin contratar",
        "Análisis predictivo → Reduces stock muerto en 60%",
        "Chatbot que vende mientras duermes → +€3K/mes pasivos",
      ],
      whatYouGet: [
        "3 casos de uso IA implementados y funcionando",
        "Dashboard de métricas en tiempo real",
        "Formación completa para tu equipo",
        "6 meses de soporte premium incluido",
        "Garantía: ROI 3x o reembolso completo",
        "Código fuente y documentación técnica",
      ],
      perfectFor: "Empresas que procesan >100 consultas/mes o quieren escalar ventas",
    },
    {
      icon: Shield,
      name: "Cybersecurity_Audit_Plus",
      title: "Blindaje Ciberseguridad Total",
      subtitle: "Protección empresarial en 2 semanas",
      description:
        "Análisis exhaustivo + implementación que protege tu empresa de amenazas que podrían costarte miles.",
      detailedDescription:
        "Una auditoría completa que no solo identifica vulnerabilidades, sino que las resuelve. Incluye implementación de protocolos de seguridad de grado empresarial.",
      price: "€1,800",
      originalPrice: "€3,200",
      timeframe: "2-3 semanas",
      roi: "1,200",
      roiTimeframe: "12 meses",
      savings: "€10K-50K evitados",
      badge: "PROTECCIÓN CRÍTICA",
      badgeColor: "bg-red-600",
      gradient: "from-red-500/10 to-red-600/10",
      borderGlow: "hover:shadow-red-500/20",
      realBenefits: [
        "Evitas multas RGPD de hasta €20M → Tranquilidad total",
        "Proteges datos de clientes → Mantienes reputación intacta",
        "Blindaje contra ransomware → Evitas parar negocio 15 días",
        "Cumplimiento automático → Sin auditorías sorpresa",
      ],
      whatYouGet: [
        "Informe ejecutivo de vulnerabilidades críticas",
        "Implementación de protocolos de seguridad",
        "Sistema de monitoreo 24/7 durante 3 meses",
        "Certificación de cumplimiento RGPD",
        "Plan de respuesta a incidentes",
        "Formación del equipo en ciberseguridad",
      ],
      perfectFor: "Empresas que manejan datos sensibles o facturan >€500K/año",
    },
    {
      icon: Zap,
      name: "Process_Automation_Suite",
      title: "Automatización de Procesos",
      subtitle: "Elimina el 80% del trabajo manual",
      description:
        "Automatizo tus procesos críticos para que tu equipo se enfoque en lo que realmente genera ingresos.",
      detailedDescription:
        "Automatización de procesos críticos que elimina tareas repetitivas y reduce errores humanos a cero.",
      price: "€1,900",
      originalPrice: "€3,500",
      timeframe: "3-4 semanas",
      roi: "380",
      roiTimeframe: "4 meses",
      savings: "€15K-40K/año",
      badge: "AHORRO INMEDIATO",
      badgeColor: "bg-orange-600",
      gradient: "from-orange-500/10 to-orange-600/10",
      borderGlow: "hover:shadow-orange-500/20",
      realBenefits: [
        "Facturas automáticas → Ahorras 15h/semana en administración",
        "Seguimiento de leads automático → 0% leads perdidos",
        "Inventario que se gestiona solo → Reduces stock en 40%",
        "Reportes automáticos → Decisiones basadas en datos reales",
      ],
      whatYouGet: [
        "3-5 procesos completamente automatizados",
        "Dashboard de métricas en tiempo real",
        "Integración con tus herramientas actuales",
        "Optimización continua durante 6 meses",
        "Formación del equipo incluida",
        "Escalabilidad para crecimiento futuro",
      ],
      perfectFor: "Empresas con procesos manuales que consumen >20h/semana",
    },
    {
      icon: Users,
      name: "Growth_Partner_Premium",
      title: "Growth Partner Tecnológico",
      subtitle: "Tu CTO externo de confianza",
      description: "Me convierto en tu brazo derecho tecnológico para escalar sin límites ni dolores de cabeza.",
      detailedDescription:
        "Asesoramiento y gestión tecnológica completa. Como tener un CTO senior sin el coste de €120K/año.",
      price: "€3,500/mes",
      originalPrice: "€6,000/mes",
      timeframe: "Compromiso 6 meses",
      roi: "520",
      roiTimeframe: "12 meses",
      savings: "€50K-150K/año",
      badge: "EXCLUSIVO",
      badgeColor: "bg-blue-600",
      gradient: "from-blue-500/10 to-blue-600/10",
      borderGlow: "hover:shadow-blue-500/20",
      realBenefits: [
        "CTO senior por 1/3 del coste → Ahorras €80K/año en salario",
        "Decisiones técnicas correctas → Evitas errores de €50K+",
        "Escalabilidad sin límites → Creces sin problemas técnicos",
        "Acceso directo 24/7 → Resuelves urgencias al instante",
      ],
      whatYouGet: [
        "CTO externo dedicado 20h/semana",
        "Estrategia tecnológica trimestral",
        "Supervisión de todos los desarrollos",
        "Decisiones arquitecturales críticas",
        "Acceso directo por WhatsApp 24/7",
        "Roadmap tecnológico personalizado",
      ],
      perfectFor: "Startups/empresas que facturan >€1M y quieren escalar rápido",
      limited: "Solo 2 clientes nuevos/mes",
    },
  ]

  return (
    <section id="servicios" className="section-padding bg-gradient-to-b from-gray-950/40 to-gray-900/20">
      <div className="container-custom">
        {/* Header - Mejorado responsive */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-4 sm:mb-6">
            <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30 px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold">
              💰 RESULTADOS REALES, NO PROMESAS VACÍAS
            </Badge>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
            <span className="text-white">Servicios que </span>
            <span className="text-gradient-primary">Multiplican Ingresos</span>
          </h2>

          <div className="content-width">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 leading-relaxed px-4">
              No vendo horas de consultoría. Vendo <strong className="text-white">resultados medibles</strong> que
              puedes tocar, medir y llevar al banco. Cada euro invertido te devuelve mínimo{" "}
              <strong className="text-green-400">3 euros en 90 días</strong>.
            </p>
          </div>
        </motion.div>

        {/* ROI Real Section - Mejorado responsive */}
        <motion.div
          className="mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-800/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-green-500/30 max-w-6xl mx-auto">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 text-center">
              👉 ¿Qué ROI puedes esperar <span className="text-green-400">realmente</span>?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="card-glass p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400" />
                  <h4 className="text-white font-semibold text-sm sm:text-base">Automatización</h4>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm mb-3">Te ahorra 20-40h/semana en tareas manuales</p>
                <div className="text-green-400 font-bold text-base sm:text-lg">Valor: €2,000-4,000/mes</div>
                <div className="text-xs text-gray-400 mt-1">En productividad recuperada</div>
              </div>

              <div className="card-glass p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400" />
                  <h4 className="text-white font-semibold text-sm sm:text-base">Optimización</h4>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm mb-3">Mejora conversión web en 15-30%</p>
                <div className="text-green-400 font-bold text-base sm:text-lg">Valor: €3,000-8,000/mes</div>
                <div className="text-xs text-gray-400 mt-1">En ventas adicionales</div>
              </div>

              <div className="card-glass p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 sm:w-6 h-5 sm:h-6 text-red-400" />
                  <h4 className="text-white font-semibold text-sm sm:text-base">Protección</h4>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm mb-3">Evita pérdidas por ciberataques</p>
                <div className="text-green-400 font-bold text-base sm:text-lg">Valor: €10,000-50,000</div>
                <div className="text-xs text-gray-400 mt-1">En pérdidas evitadas</div>
              </div>
            </div>

            <div className="text-center mt-6 sm:mt-8">
              <p className="text-gray-300 text-sm">
                <strong className="text-white">Esto es ROI real.</strong> Cifras que puedes medir, no humo de colores.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Comparison Table - Mejorado responsive */}
        <motion.div
          className="mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="card-premium max-w-7xl mx-auto">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 text-center">
              ¿Por qué no hacer esto <span className="text-red-400">por tu cuenta</span>?
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 sm:py-4 px-2 text-gray-400 font-medium">Opción</th>
                    <th className="text-center py-3 sm:py-4 px-2 text-gray-400 font-medium">Tiempo</th>
                    <th className="text-center py-3 sm:py-4 px-2 text-gray-400 font-medium">Coste Real</th>
                    <th className="text-center py-3 sm:py-4 px-2 text-gray-400 font-medium">Riesgo</th>
                    <th className="text-center py-3 sm:py-4 px-2 text-gray-400 font-medium">Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 sm:py-4 px-2 text-white font-medium">Hacerlo tú mismo</td>
                    <td className="py-3 sm:py-4 px-2 text-center text-red-400">6-12 meses</td>
                    <td className="py-3 sm:py-4 px-2 text-center text-red-400">€15K-30K</td>
                    <td className="py-3 sm:py-4 px-2 text-center text-red-400">Alto</td>
                    <td className="py-3 sm:py-4 px-2 text-center text-red-400">Incierto</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3 sm:py-4 px-2 text-white font-medium">Contratar agencia</td>
                    <td className="py-3 sm:py-4 px-2 text-center text-orange-400">3-6 meses</td>
                    <td className="py-3 sm:py-4 px-2 text-center text-orange-400">€8K-20K</td>
                    <td className="py-3 sm:py-4 px-2 text-center text-orange-400">Medio</td>
                    <td className="py-3 sm:py-4 px-2 text-center text-orange-400">Variable</td>
                  </tr>
                  <tr className="bg-green-500/10 border border-green-500/30 rounded-lg">
                    <td className="py-3 sm:py-4 px-2 text-white font-bold">Trabajar conmigo</td>
                    <td className="py-3 sm:py-4 px-2 text-center text-green-400 font-bold">2-6 semanas</td>
                    <td className="py-3 sm:py-4 px-2 text-center text-green-400 font-bold">€490-3,500</td>
                    <td className="py-3 sm:py-4 px-2 text-center text-green-400 font-bold">Cero</td>
                    <td className="py-3 sm:py-4 px-2 text-center text-green-400 font-bold">Garantizado</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-center mt-4 sm:mt-6">
              <p className="text-gray-300 text-xs sm:text-sm">
                <strong className="text-white">La diferencia es clara:</strong> Resultados rápidos, coste predecible,
                riesgo cero.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Services Grid - Mejorado responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onViewportEnter={() => {
                if (!visibleServices.includes(index)) {
                  setVisibleServices((prev) => [...prev, index])
                }
              }}
            >
              <ServiceCardPremium service={service} onInquiry={() => handleServiceClick(service)} />
            </motion.div>
          ))}
        </div>

        {/* Service Detail Modal */}
        <ServiceDetailModal
          service={selectedService}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onBookConsultation={handleBookConsultation}
        />

        {/* Guarantee Section - Mejorado responsive */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-800/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-green-500/30 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <CheckCircle className="w-6 sm:w-8 h-6 sm:h-8 text-green-400" />
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Garantía Sin Letra Pequeña</h3>
            </div>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-4 sm:mb-6 leading-relaxed">
              Si no obtienes <strong className="text-green-400">resultados medibles</strong> en los primeros{" "}
              <strong className="text-white">90 días</strong>, te devuelvo hasta el último euro. Sin preguntas.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-400" />
                <span>Reembolso completo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-400" />
                <span>Sin preguntas incómodas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-400" />
                <span>90 días para evaluar</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Componente ServiceCardPremium - Mejorado responsive
function ServiceCardPremium({ service, onInquiry }: { service: any; onInquiry: () => void }) {
  return (
    <div
      className={`card-premium relative h-full bg-gradient-to-br ${service.gradient} backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden transition-all duration-500 hover:border-purple-500/50 ${service.borderGlow} hover:-translate-y-2 group cursor-pointer`}
      onClick={onInquiry}
    >
      {/* Badge */}
      {service.badge && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
          <Badge
            className={`${service.badgeColor} text-white px-2 sm:px-3 py-1 text-xs font-bold shadow-lg rounded-full`}
          >
            {service.badge}
          </Badge>
        </div>
      )}

      {/* Limited Badge */}
      {service.limited && (
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
          <Badge className="bg-red-600/20 text-red-400 border-red-500/30 px-2 sm:px-3 py-1 text-xs font-bold">
            {service.limited}
          </Badge>
        </div>
      )}

      <div className="p-4 sm:p-6 md:p-8 pt-10 sm:pt-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="p-2 sm:p-3 md:p-4 bg-purple-600/20 rounded-xl group-hover:bg-purple-600/30 transition-colors duration-300">
              <service.icon className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 text-purple-400" />
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">{service.price}</span>
              {service.originalPrice && (
                <span className="text-xs sm:text-sm text-gray-400 line-through">{service.originalPrice}</span>
              )}
            </div>
            <div className="text-xs text-gray-400">{service.timeframe}</div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2">{service.title}</h3>
          <p className="text-xs sm:text-sm font-medium text-purple-400 mb-2 sm:mb-3">{service.subtitle}</p>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{service.description}</p>
        </div>

        {/* Perfect For */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
            <div className="text-blue-400 font-semibold text-xs mb-2">💡 Perfecto para:</div>
            <div className="text-gray-300 text-xs">{service.perfectFor}</div>
          </div>
        </div>

        {/* Real Benefits */}
        <div className="mb-4 sm:mb-6">
          <h4 className="text-white font-semibold text-xs sm:text-sm mb-2 sm:mb-3">🎯 Beneficios reales:</h4>
          <ul className="space-y-1 sm:space-y-2">
            {service.realBenefits.slice(0, 2).map((benefit: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ROI Metrics */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          <div className="bg-green-500/10 rounded-lg p-2 sm:p-3 border border-green-500/20">
            <div className="text-green-400 font-bold text-sm sm:text-base md:text-lg">{service.roi}%</div>
            <div className="text-xs text-gray-400">ROI típico</div>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-2 sm:p-3 border border-blue-500/20">
            <div className="text-blue-400 font-bold text-xs sm:text-sm md:text-base">{service.savings}</div>
            <div className="text-xs text-gray-400">Ahorro anual</div>
          </div>
        </div>

        {/* CTA */}
        <Button className="btn-primary w-full py-2 sm:py-3 md:py-4 text-xs sm:text-sm font-semibold transition-all duration-300 group/btn">
          Ver Detalles Completos
          <ArrowRight className="ml-2 w-3 sm:w-4 h-3 sm:h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </Button>

        {/* Trust Signals */}
        <div className="mt-3 sm:mt-4 flex justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span className="hidden sm:inline">Garantía total</span>
            <span className="sm:hidden">Garantía</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-400" />
            <span className="hidden sm:inline">Respuesta 24h</span>
            <span className="sm:hidden">24h</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// Modal de detalles del servicio - Mejorado responsive
function ServiceDetailModal({
  service,
  isOpen,
  onClose,
  onBookConsultation,
}: {
  service: any
  isOpen: boolean
  onClose: () => void
  onBookConsultation: (serviceName: string) => void
}) {
  if (!service) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-purple-600/20 rounded-xl">
                <service.icon className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-purple-400" />
              </div>
              <span className="text-sm sm:text-base md:text-xl">{service.title}</span>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Header con precio y ROI */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-purple-500/10 rounded-xl p-3 sm:p-4 md:p-6 border border-purple-500/20 text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{service.price}</div>
              <div className="text-purple-400 font-medium text-xs sm:text-sm">{service.timeframe}</div>
              {service.originalPrice && (
                <div className="text-xs sm:text-sm text-gray-400 line-through mt-1">{service.originalPrice}</div>
              )}
            </div>
            <div className="bg-green-500/10 rounded-xl p-3 sm:p-4 md:p-6 border border-green-500/20 text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400 mb-2">{service.roi}%</div>
              <div className="text-gray-300 text-xs sm:text-sm">ROI típico</div>
            </div>
            <div className="bg-blue-500/10 rounded-xl p-3 sm:p-4 md:p-6 border border-blue-500/20 text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400 mb-2">{service.savings}</div>
              <div className="text-gray-300 text-xs sm:text-sm">Ahorro anual</div>
            </div>
          </div>

          {/* Perfect For */}
          <div className="bg-blue-500/10 rounded-xl p-4 sm:p-6 border border-blue-500/20">
            <h3 className="text-base sm:text-lg font-bold text-blue-400 mb-3">💡 Perfecto para:</h3>
            <p className="text-gray-300 text-sm sm:text-base">{service.perfectFor}</p>
          </div>

          {/* Real Benefits */}
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">
              🎯 Beneficios reales que obtienes:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {service.realBenefits?.map((benefit: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 sm:gap-3 bg-gray-800/30 rounded-lg p-3 sm:p-4">
                  <CheckCircle className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-xs sm:text-sm md:text-base">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Qué obtienes */}
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">
              📦 Qué obtienes exactamente:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {service.whatYouGet?.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-xs sm:text-sm md:text-base">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 sm:pt-6 border-t border-gray-700">
            <Button
              className="btn-primary flex-1 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold"
              onClick={() => onBookConsultation(service.name)}
            >
              <span className="hidden sm:inline">Reservar Llamada Estratégica Gratuita</span>
              <span className="sm:hidden">Reservar Llamada Gratuita</span>
              <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
            </Button>
          </div>

          {/* Trust signals */}
          <div className="text-center text-xs sm:text-sm text-gray-400 pt-3 sm:pt-4 border-t border-gray-800">
            📞 Si no te aporta valor, no te vendo nada • Sin compromiso • Valor real desde la primera llamada
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
