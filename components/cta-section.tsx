"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Phone, Calendar, CheckCircle, Star, TrendingUp, Shield, Clock, Users } from "lucide-react"
import { track } from "@vercel/analytics"

export function CTASection() {
  const [isHovered, setIsHovered] = useState(false)

  const handleCTAClick = () => {
    // Track conversion event
    track("cta_clicked", {
      section: "main_cta",
      type: "consultation_booking",
    })

    window.open("https://calendly.com/robertsoftware/consulta-estrategica", "_blank")
  }

  const benefits = [
    {
      icon: TrendingUp,
      text: "ROI del 300%+ garantizado",
      color: "text-green-400",
    },
    {
      icon: Shield,
      text: "100% seguro y confidencial",
      color: "text-blue-400",
    },
    {
      icon: Clock,
      text: "Resultados en 30 días",
      color: "text-purple-400",
    },
    {
      icon: Users,
      text: "47 empresas transformadas",
      color: "text-orange-400",
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Badge className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border-purple-500/30 mb-6 px-4 py-2">
              ⚡ Transformación Garantizada
            </Badge>

            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              ¿Listo para Multiplicar tus Ingresos?
            </h2>

            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Reserva una <strong className="text-white">llamada estratégica gratuita</strong> y descubre cómo la IA
              puede transformar tu negocio en los próximos 30 días.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <benefit.icon className={`w-8 h-8 ${benefit.color} mb-3 mx-auto`} />
                <p className="text-white font-semibold text-sm">{benefit.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <motion.div
              className="relative inline-block"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <Button
                size="lg"
                className="btn-primary text-lg px-12 py-6 relative overflow-hidden group"
                onClick={handleCTAClick}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isHovered ? 1 : 0,
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  Reservar Llamada Gratuita
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>

            <p className="text-gray-400 mt-4 text-sm">
              ⏰ Solo 30 minutos • 💰 Completamente gratis • 🎯 Sin compromiso
            </p>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-center gap-8 text-gray-300"
          >
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="font-semibold">4.9/5</span>
              <span className="text-gray-400">(47 reseñas)</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Respuesta en menos de 2 horas</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>Agenda flexible 24/7</span>
            </div>
          </motion.div>

          {/* Urgency */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 p-6 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-xl border border-red-500/30"
          >
            <p className="text-orange-300 font-semibold mb-2">🔥 Solo acepto 3 nuevos clientes este mes</p>
            <p className="text-gray-300 text-sm">
              Mi agenda se llena rápido. Reserva tu llamada ahora antes de que sea demasiado tarde.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
