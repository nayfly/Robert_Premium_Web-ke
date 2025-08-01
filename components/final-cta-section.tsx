"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Users, Calendar, Phone, MessageCircle, AlertTriangle, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"

interface FinalCTASectionProps {
  dict: any
}

export function FinalCTASection({ dict }: FinalCTASectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  })

  // Countdown timer (resets weekly)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const nextFriday = new Date()
      nextFriday.setDate(now.getDate() + ((5 - now.getDay() + 7) % 7))
      nextFriday.setHours(23, 59, 59, 999)

      const difference = nextFriday.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000)

    return () => clearInterval(timer)
  }, [])

  const urgencyReasons = [
    {
      icon: Users,
      title: "Solo 2 Clientes Nuevos/Mes",
      description: "Diciembre ya tiene 1 plaza ocupada. Quedan 1 plaza disponible.",
      color: "text-red-400",
      bg: "bg-red-400/20",
    },
    {
      icon: TrendingUp,
      title: "Cada Día Sin Actuar = Dinero Perdido",
      description: "Si tu empresa pierde €500/día por ineficiencias, en 30 días son €15,000.",
      color: "text-orange-400",
      bg: "bg-orange-400/20",
    },
    {
      icon: Calendar,
      title: "Implementación Antes de 2025",
      description: "Empezar ahora significa sistemas funcionando para el Q1 2025.",
      color: "text-blue-400",
      bg: "bg-blue-400/20",
    },
  ]

  const gradualOptions = [
    {
      title: "Opción 1: Empezar Pequeño",
      subtitle: "Auditoría Estratégica Express",
      price: "€490",
      description: "Perfecto si quieres claridad antes de invertir en grande",
      benefits: [
        "Análisis completo en 48h",
        "Plan de acción específico",
        "ROI estimado para cada oportunidad",
        "30 min de consulta incluida",
      ],
      cta: "Empezar con Auditoría",
      popular: false,
      gradient: "from-green-500/10 to-green-600/10",
      borderColor: "border-green-500/30",
      textColor: "text-green-400",
    },
    {
      title: "Opción 2: Transformación Completa",
      subtitle: "Implementación IA + Automatización",
      price: "€2,500",
      description: "Para empresas listas para multiplicar resultados ya",
      benefits: [
        "3 sistemas IA implementados",
        "Automatización de procesos críticos",
        "6 meses de soporte premium",
        "ROI garantizado 3x o reembolso",
      ],
      cta: "Transformar Mi Empresa",
      popular: true,
      gradient: "from-purple-500/10 to-purple-600/10",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400",
    },
    {
      title: "Opción 3: Partnership Estratégico",
      subtitle: "Growth Partner Tecnológico",
      price: "€3,500/mes",
      description: "Tu CTO externo para escalar sin límites",
      benefits: [
        "CTO dedicado 20h/semana",
        "Estrategia tecnológica completa",
        "Acceso directo 24/7",
        "Escalabilidad sin problemas técnicos",
      ],
      cta: "Ser Mi Growth Partner",
      popular: false,
      gradient: "from-blue-500/10 to-blue-600/10",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
    },
  ]

  const noCommitmentOffer = {
    title: "Oferta Sin Compromiso",
    subtitle: "Llamada Estratégica Gratuita de 30 Minutos",
    benefits: [
      "Análisis gratuito de tu situación actual",
      "Identificación de 3-5 oportunidades de mejora",
      "Estimación de ROI para cada oportunidad",
      "Plan de acción específico para tu empresa",
      "Sin compromiso de compra",
    ],
    guarantee: "Si no aporta valor, no te vendo nada",
  }

  return (
    <section className="section-padding bg-gradient-to-b from-gray-950/40 to-black/60">
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
            <Badge className="bg-red-600/20 text-red-400 border-red-500/30 px-6 py-2 text-sm font-bold animate-pulse">
              🚨 ACCIÓN REQUERIDA
            </Badge>
          </div>

          <h2 className="text-h2 mb-8 leading-tight">
            <span className="text-white">Es Hora de </span>
            <span className="text-gradient-primary">Decidir</span>
          </h2>

          <div className="content-width">
            <p className="text-body-lg text-gray-300 mb-8 leading-relaxed">
              Has visto los casos reales, las garantías y el track record. Ahora tienes{" "}
              <strong className="text-white">3 opciones</strong>: seguir como hasta ahora, intentarlo por tu cuenta, o{" "}
              <strong className="text-green-400">trabajar conmigo para obtener resultados garantizados</strong>.
            </p>
          </div>
        </motion.div>

        {/* Urgency Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="card-premium bg-gradient-to-r from-red-900/20 to-orange-900/20 backdrop-blur-sm border border-red-500/30 max-w-5xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-h3 text-white mb-4 flex items-center justify-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                  ¿Por Qué Actuar Ahora?
                </h3>
                <p className="text-gray-300">Cada día que pasa sin optimizar es dinero que se va por el desagüe</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {urgencyReasons.map((reason, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="card-glass p-6 text-center">
                      <div className={`inline-flex p-4 ${reason.bg} rounded-xl mb-4`}>
                        <reason.icon className={`w-8 h-8 ${reason.color}`} />
                      </div>
                      <h4 className="text-white font-bold mb-3">{reason.title}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{reason.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Countdown Timer */}
              <div className="text-center">
                <div className="bg-black/30 rounded-xl p-6 border border-red-500/30 max-w-md mx-auto">
                  <h4 className="text-red-400 font-bold mb-4">⏰ Plazas disponibles esta semana:</h4>
                  <div className="flex justify-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{timeLeft.days}</div>
                      <div className="text-xs text-gray-400">días</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{timeLeft.hours}</div>
                      <div className="text-xs text-gray-400">horas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{timeLeft.minutes}</div>
                      <div className="text-xs text-gray-400">min</div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">Para reservar tu plaza de diciembre</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* No Commitment Offer */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="card-premium bg-gradient-to-r from-green-900/20 to-emerald-900/20 backdrop-blur-sm border border-green-500/30 max-w-4xl mx-auto">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <Phone className="w-8 h-8 text-green-400" />
                  <h3 className="text-h3 text-white">{noCommitmentOffer.title}</h3>
                </div>
                <p className="text-xl text-green-400 font-semibold mb-6">{noCommitmentOffer.subtitle}</p>
                <p className="text-gray-300 leading-relaxed">
                  Si no estás 100% seguro, empecemos con una llamada gratuita. Te analizo la situación, identifico
                  oportunidades y te doy un plan específico. <strong className="text-white">Sin compromiso</strong>.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-white font-bold mb-4">📋 Qué analizamos en la llamada:</h4>
                  <ul className="space-y-3">
                    {noCommitmentOffer.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20">
                  <h4 className="text-green-400 font-bold mb-4">🎯 Mi compromiso contigo:</h4>
                  <p className="text-gray-300 text-sm mb-4">
                    Si al final de la llamada no has obtenido al menos 3 ideas específicas que puedas implementar para
                    mejorar tu negocio, te regalo una auditoría completa gratis.
                  </p>
                  <div className="bg-green-400/20 rounded-lg p-3 border border-green-400/30">
                    <p className="text-green-300 font-semibold text-sm">{noCommitmentOffer.guarantee}</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  className="btn-primary text-xl px-12 py-6 mb-4"
                  onClick={() => window.open("https://calendly.com/robertsoftware/consulta-estrategica", "_blank")}
                >
                  <Calendar className="mr-3 w-6 h-6" />
                  Reservar Llamada Gratuita Ahora
                </Button>
                <p className="text-xs text-gray-400">📞 30 minutos • Sin compromiso • Valor real desde el minuto 1</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gradual Options */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-h3 text-white mb-4">O Si Prefieres Empezar Ya...</h3>
            <p className="text-body-lg text-gray-300">Elige la opción que mejor se adapte a tu situación actual</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {gradualOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`card-premium h-full bg-gradient-to-br ${option.gradient} backdrop-blur-sm border ${
                    option.borderColor
                  } ${
                    option.popular ? "ring-2 ring-purple-500/50 hover:ring-purple-400/70" : "hover:border-purple-500/50"
                  } transition-all duration-500 relative`}
                >
                  {option.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-600 text-white px-4 py-1 text-xs font-bold">MÁS POPULAR</Badge>
                    </div>
                  )}

                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-white mb-2">{option.title}</h4>
                      <p className={`font-semibold mb-4 ${option.textColor}`}>{option.subtitle}</p>
                      <div className="text-3xl font-bold text-white mb-2">{option.price}</div>
                      <p className="text-gray-300 text-sm leading-relaxed">{option.description}</p>
                    </div>

                    <div className="mb-8">
                      <h5 className="text-white font-semibold mb-4">✅ Incluye:</h5>
                      <ul className="space-y-2">
                        {option.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300 text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className={`w-full py-4 text-base font-semibold ${
                        option.popular ? "btn-primary" : "btn-ghost"
                      } transition-all duration-300`}
                      onClick={() => window.open("https://calendly.com/robertsoftware/consulta-estrategica", "_blank")}
                    >
                      {option.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final Push */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="card-premium bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-500/30 max-w-4xl mx-auto p-8 sm:p-12">
            <h3 className="text-h3 text-white mb-6">
              La Decisión es <span className="text-purple-400">Tuya</span>
            </h3>
            <p className="text-body-lg text-gray-300 mb-8 leading-relaxed">
              Puedes seguir perdiendo dinero cada día por procesos ineficientes, o puedes{" "}
              <strong className="text-white">actuar ahora</strong> y empezar a ver resultados en las próximas semanas.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
                <h4 className="text-red-400 font-bold mb-4">❌ Si no haces nada:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Sigues perdiendo €500-2000/día en ineficiencias</li>
                  <li>• Tu competencia se adelanta con IA y automatización</li>
                  <li>• Los problemas se hacen más caros de resolver</li>
                  <li>• Pierdes oportunidades de crecimiento</li>
                </ul>
              </div>
              <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20">
                <h4 className="text-green-400 font-bold mb-4">✅ Si actúas ahora:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Sistemas funcionando antes de 2025</li>
                  <li>• ROI del 300%+ en los primeros 90 días</li>
                  <li>• Ventaja competitiva sostenible</li>
                  <li>• Escalabilidad sin límites</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Button
                className="btn-primary text-xl px-12 py-6"
                onClick={() => window.open("https://calendly.com/robertsoftware/consulta-estrategica", "_blank")}
              >
                <MessageCircle className="mr-3 w-6 h-6" />
                Hablar Conmigo Ahora
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-400 mb-2">
                📞 Respuesta en menos de 2 horas • WhatsApp directo disponible
              </p>
              <p className="text-xs text-gray-500">
                O escríbeme directamente a{" "}
                <a href="https://wa.me/34600000000" className="text-green-400 hover:text-green-300">
                  WhatsApp
                </a>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
