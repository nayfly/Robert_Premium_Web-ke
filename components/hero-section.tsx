"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Phone, CheckCircle, Star, TrendingUp } from "lucide-react"

interface HeroSectionProps {
  dict: any
}

export function HeroSection({ dict }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Usar valores por defecto si no existen en el diccionario
  const heroData = dict?.hero || {}

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950">
      {/* Background Effects - Mejorados */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge - Mejorado para móvil */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 rounded-full px-3 sm:px-4 py-2 mb-6 sm:mb-8"
          >
            <Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400 fill-current" />
            <span className="text-xs sm:text-sm text-purple-200 font-medium">
              {heroData.badge || "Growth Partner Tecnológico"}
            </span>
          </motion.div>

          {/* Main Headline - Mejorado responsive */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight"
          >
            <span className="text-white block mb-2">{heroData.title || "Multiplico el valor de tu empresa con"}</span>
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600 bg-clip-text text-transparent block mb-2">
              {heroData.titleHighlight || "IA y Automatización"}
            </span>
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600 bg-clip-text text-transparent block">
              {heroData.titleEnd || "Estratégica"}
            </span>
          </motion.h1>

          {/* Subtitle - Mejorado responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-5xl mx-auto leading-relaxed px-2"
            dangerouslySetInnerHTML={{
              __html:
                heroData.subtitle ||
                "Para CEOs que buscan <strong>resultados reales</strong>, no promesas vacías. Transformo procesos, reduzco costes y <strong>garantizo ROI medible en 90 días</strong>.",
            }}
          />

          {/* Specialist line - Mejorado responsive */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-sm sm:text-base md:text-lg text-gray-400 mb-8 sm:mb-12 max-w-4xl mx-auto px-2"
          >
            Especialista en <strong className="text-purple-400">IA estratégica</strong>,{" "}
            <strong className="text-blue-400">automatización de procesos</strong> y{" "}
            <strong className="text-green-400">ciberseguridad empresarial</strong>. Trabajo exclusivamente con empresas
            que facturan +500K€ anuales.
          </motion.p>

          {/* Features - Mejorado responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-5xl mx-auto px-2"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">
                {heroData.feature1?.title || "ROI Medible"}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                {heroData.feature1?.description || "Resultados documentados desde el primer mes"}
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">
                {heroData.feature2?.title || "Implementación Rápida"}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                {heroData.feature2?.description || "Soluciones funcionando en 2-4 semanas"}
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:border-green-500/50 transition-all duration-300">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                <Star className="w-5 sm:w-6 h-5 sm:h-6 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">
                {heroData.feature3?.title || "Soporte Premium"}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                {heroData.feature3?.description || "Acceso directo durante todo el proyecto"}
              </p>
            </div>
          </motion.div>

          {/* CTA Buttons - Mejorado responsive */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-2"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 group"
              onClick={() => window.open("https://calendly.com/robertsoftware/consulta-estrategica", "_blank")}
            >
              <Phone className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3" />
              <span className="hidden sm:inline">{heroData.cta1 || "Consulta Estratégica Gratuita"}</span>
              <span className="sm:hidden">Consulta Gratis</span>
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-gray-600 text-white hover:bg-gray-800 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full transition-all duration-300 hover:border-purple-500 bg-transparent group"
              onClick={() => {
                const element = document.querySelector("#casos")
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              <Play className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3" />
              <span className="hidden sm:inline">{heroData.cta2 || "Ver Casos de Éxito"}</span>
              <span className="sm:hidden">Ver Casos</span>
            </Button>
          </motion.div>

          {/* Trust Indicators - Mejorado responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-8 text-gray-400 px-2"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm">+50 Empresas Transformadas</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm">€2.5M+ Ahorrados en Costes</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400 fill-current flex-shrink-0" />
              <span className="text-xs sm:text-sm">98% Satisfacción Cliente</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Mejorado */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
      >
        <div className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-gray-600 rounded-full flex justify-center">
          <div className="w-1 h-2 sm:h-3 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>
    </section>
  )
}
