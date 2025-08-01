"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  CheckCircle,
  Award,
  Users,
  TrendingUp,
  Shield,
  Clock,
  Target,
  Building2,
  Star,
  ExternalLink,
} from "lucide-react"

interface AuthoritySectionProps {
  dict: any
}

export function AuthoritySection({ dict }: AuthoritySectionProps) {
  const philosophy = {
    title: "Mi Filosofía: Resultados Reales, No Humo",
    subtitle: "Por qué trabajo diferente a otros consultores",
    principles: [
      {
        icon: Target,
        title: "ROI Medible o Reembolso",
        description: "No cobro por horas de consultoría. Cobro por resultados que puedes medir y llevar al banco.",
        example: "Si no ahorras mínimo 3x lo que inviertes, te devuelvo hasta el último euro.",
      },
      {
        icon: Clock,
        title: "Implementación, No Solo Consejos",
        description: "No te doy un PDF bonito y me voy. Implemento, formo a tu equipo y me aseguro de que funciona.",
        example: "Mis clientes obtienen sistemas funcionando, no presentaciones de PowerPoint.",
      },
      {
        icon: Shield,
        title: "Solo 2 Clientes Nuevos/Mes",
        description: "Prefiero rechazar dinero que dar un servicio mediocre. Calidad sobre cantidad, siempre.",
        example: "Cada cliente recibe mi atención completa, no eres un número más.",
      },
    ],
  }

  const trackRecord = {
    title: "Track Record Verificable",
    subtitle: "Números reales de transformaciones reales",
    stats: [
      {
        number: "47",
        label: "Empresas transformadas",
        detail: "En los últimos 3 años",
        icon: Building2,
        color: "text-blue-400",
        bg: "bg-blue-400/20",
      },
      {
        number: "€2.3M",
        label: "Ahorros generados",
        detail: "Para mis clientes",
        icon: TrendingUp,
        color: "text-green-400",
        bg: "bg-green-400/20",
      },
      {
        number: "420%",
        label: "ROI promedio",
        detail: "En 6 meses",
        icon: Target,
        color: "text-purple-400",
        bg: "bg-purple-400/20",
      },
      {
        number: "100%",
        label: "Satisfacción",
        detail: "Clientes que recomiendan",
        icon: Star,
        color: "text-yellow-400",
        bg: "bg-yellow-400/20",
      },
    ],
    testimonials: [
      {
        quote: "Robert no es un consultor más. Es el CTO que necesitábamos sin saberlo.",
        author: "Carlos Mendez",
        role: "CEO, TechFlow Solutions",
        result: "€45K ahorrados en 4 meses",
      },
      {
        quote: "Transformó nuestros procesos en 6 semanas. ROI del 380% en el primer año.",
        author: "Ana Ruiz",
        role: "Directora, Logística Premium",
        result: "3x más pedidos procesados",
      },
    ],
  }

  const guarantees = {
    title: "Garantías Específicas (Sin Letra Pequeña)",
    subtitle: "Esto es lo que te garantizo por escrito",
    items: [
      {
        icon: TrendingUp,
        title: "ROI Mínimo 300% en 90 Días",
        description: "Si no obtienes al menos 3€ por cada euro invertido en los primeros 90 días, reembolso completo.",
        proof: "Contrato con cláusula de reembolso automático",
      },
      {
        icon: Clock,
        title: "Implementación en Tiempo Record",
        description: "Sistemas funcionando en máximo 6 semanas. Si me retraso, descuento del 20% automático.",
        proof: "Cronograma con penalizaciones por retraso",
      },
      {
        icon: Shield,
        title: "Soporte Sin Límites 6 Meses",
        description: "Acceso directo por WhatsApp 24/7 durante 6 meses. Cualquier problema, lo resuelvo gratis.",
        proof: "WhatsApp directo + SLA de respuesta 2h",
      },
      {
        icon: Users,
        title: "Formación Completa del Equipo",
        description:
          "Tu equipo domina completamente los sistemas. Si alguien no sabe usarlo, formación adicional gratis.",
        proof: "Certificación de competencia para cada usuario",
      },
    ],
  }

  const credentials = {
    title: "Credenciales & Experiencia",
    items: [
      {
        category: "Certificaciones",
        items: [
          "AWS Solutions Architect Professional",
          "Google Cloud Professional",
          "Microsoft Azure Expert",
          "Certified Ethical Hacker (CEH)",
        ],
      },
      {
        category: "Experiencia",
        items: [
          "15+ años en transformación digital",
          "Ex-CTO en 3 startups exitosas",
          "Especialista en IA y automatización",
          "Experto en ciberseguridad empresarial",
        ],
      },
      {
        category: "Reconocimientos",
        items: [
          "Top 50 Tech Consultants Spain 2024",
          "Speaker en 12+ conferencias tech",
          "Mentor en Google for Startups",
          "Colaborador en medios especializados",
        ],
      },
    ],
  }

  return (
    <section className="section-padding bg-gradient-to-b from-gray-900/20 to-gray-950/40">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-6">
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 px-6 py-2 text-sm font-bold">
              🏆 AUTORIDAD DEMOSTRABLE
            </Badge>
          </div>

          <h2 className="text-h2 mb-8 leading-tight">
            <span className="text-white">Por Qué Confían en </span>
            <span className="text-gradient-primary">Robert Software</span>
          </h2>

          <div className="content-width">
            <p className="text-body-lg text-gray-300 mb-8 leading-relaxed">
              No soy otro consultor con promesas vacías. Soy el profesional que{" "}
              <strong className="text-white">garantiza resultados</strong> porque tiene el track record, la experiencia
              y las garantías para respaldarlo.
            </p>
          </div>
        </motion.div>

        {/* Philosophy Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-h3 text-white mb-4">{philosophy.title}</h3>
            <p className="text-body-lg text-gray-300">{philosophy.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {philosophy.principles.map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-premium h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-gray-800 hover:border-blue-500/50 transition-all duration-500">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-4 bg-blue-400/20 rounded-xl">
                        <principle.icon className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-4">{principle.title}</h4>
                    <p className="text-gray-300 mb-4 leading-relaxed">{principle.description}</p>
                    <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                      <p className="text-blue-300 text-sm font-medium">💡 En la práctica:</p>
                      <p className="text-gray-300 text-sm mt-2">{principle.example}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Track Record Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-h3 text-white mb-4">{trackRecord.title}</h3>
            <p className="text-body-lg text-gray-300">{trackRecord.subtitle}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {trackRecord.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-premium text-center p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 transition-all duration-500">
                  <div className={`inline-flex p-4 ${stat.bg} rounded-xl mb-4`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
                  <div className="text-white font-semibold mb-1">{stat.label}</div>
                  <div className="text-gray-400 text-sm">{stat.detail}</div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-2 gap-8">
            {trackRecord.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="card-glass p-8 h-full">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-300 italic mb-6 leading-relaxed">"{testimonial.quote}"</blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold">{testimonial.author}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role}</div>
                    </div>
                    <div className="text-green-400 font-bold text-sm">{testimonial.result}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Guarantees Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-h3 text-white mb-4">{guarantees.title}</h3>
            <p className="text-body-lg text-gray-300">{guarantees.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {guarantees.items.map((guarantee, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-premium h-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/30 hover:border-green-400/50 transition-all duration-500">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-4 bg-green-400/20 rounded-xl">
                        <guarantee.icon className="w-8 h-8 text-green-400" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-4">{guarantee.title}</h4>
                    <p className="text-gray-300 mb-4 leading-relaxed">{guarantee.description}</p>
                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-semibold text-sm">Garantía verificable:</span>
                      </div>
                      <p className="text-gray-300 text-sm">{guarantee.proof}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Credentials Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-h3 text-white mb-4">{credentials.title}</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {credentials.items.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-glass h-full p-8">
                  <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                    <Award className="w-6 h-6 text-purple-400" />
                    {category.category}
                  </h4>
                  <ul className="space-y-3">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="card-premium bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-500/30 max-w-4xl mx-auto p-8 sm:p-12">
            <h3 className="text-h3 text-white mb-6">
              ¿Listo para trabajar con alguien que <span className="text-purple-400">garantiza resultados</span>?
            </h3>
            <p className="text-body-lg text-gray-300 mb-8 leading-relaxed">
              No necesitas más consultores que te vendan humo. Necesitas un partner tecnológico que{" "}
              <strong className="text-white">garantice resultados medibles</strong> y tenga el track record para
              respaldarlo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                className="btn-primary text-lg px-8 py-4"
                onClick={() => window.open("https://calendly.com/robertsoftware/consulta-estrategica", "_blank")}
              >
                Analizar Mi Situación Gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="btn-ghost text-sm px-6 py-3 bg-transparent"
                onClick={() => window.open("https://linkedin.com/in/robertsoftware", "_blank")}
              >
                <ExternalLink className="mr-2 w-4 h-4" />
                Ver Perfil LinkedIn
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-6">
              📞 Llamada de 30 min • Análisis gratuito • Sin compromiso • Valor real desde el minuto 1
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
