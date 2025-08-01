"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Star, Zap, TrendingUp, Clock, Euro } from "lucide-react"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  subtitle?: string
  description: string
  price: string
  originalPrice?: string
  timeframe: string
  roi: string
  roiTimeframe: string
  savings: string
  features: string[]
  results: string[]
  useCases: string[]
  testimonial?: {
    text: string
    author: string
    company: string
  }
  badge?: string
  badgeColor?: string
  popular?: boolean
  gradient: string
  borderGlow?: string
  limited?: string
  onInquiry: () => void
  moreInfoText?: string
}

export function ServiceCard({
  icon: Icon,
  title,
  subtitle,
  description,
  price,
  originalPrice,
  timeframe,
  roi,
  roiTimeframe,
  savings,
  features,
  results,
  useCases,
  testimonial,
  badge,
  badgeColor = "bg-purple-600",
  popular = false,
  gradient,
  borderGlow = "hover:shadow-purple-500/20",
  limited,
  onInquiry,
  moreInfoText = "Consulta Estratégica Gratuita",
}: ServiceCardProps) {
  return (
    <motion.div whileHover={{ y: -8 }} className="h-full">
      <Card
        className={`relative h-full bg-gradient-to-br ${gradient} backdrop-blur-sm border-gray-800 hover:border-purple-500/50 transition-all duration-500 group cursor-pointer overflow-hidden ${borderGlow} ${
          popular ? "ring-2 ring-purple-500/50 scale-[1.02]" : ""
        }`}
        onClick={onInquiry}
        role="button"
        tabIndex={0}
        aria-label={`Más información sobre ${title}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onInquiry()
          }
        }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge superior */}
        {badge && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
            <Badge className={`${badgeColor} text-white px-4 py-1 text-xs font-bold shadow-lg`}>{badge}</Badge>
          </div>
        )}

        {/* Limited availability */}
        {limited && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-red-600/20 text-red-400 border-red-500/30 px-3 py-1 text-xs font-bold animate-pulse">
              {limited}
            </Badge>
          </div>
        )}

        <CardHeader className="pt-10 pb-6">
          {/* Header con icono y precio */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-600/20 rounded-xl group-hover:bg-purple-600/30 transition-colors duration-300">
                <Icon className="w-7 h-7 text-purple-400" aria-hidden="true" />
              </div>
              {popular && (
                <div className="flex items-center gap-1" aria-label="5 estrellas">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  ))}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold text-white">{price}</span>
                {originalPrice && <span className="text-sm text-gray-400 line-through">{originalPrice}</span>}
              </div>
              <div className="text-xs text-gray-400 font-medium">{timeframe}</div>
            </div>
          </div>

          <CardTitle className="text-white text-xl mb-2 leading-tight">{title}</CardTitle>
          {subtitle && <p className="text-purple-400 font-medium text-sm mb-3">{subtitle}</p>}
          <CardDescription className="text-gray-300 text-sm leading-relaxed">{description}</CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          {/* ROI Metrics destacados */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-bold text-lg">{roi}%</span>
              </div>
              <div className="text-xs text-gray-400">ROI en {roiTimeframe}</div>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Euro className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-bold text-sm">{savings}</span>
              </div>
              <div className="text-xs text-gray-400">Ahorro anual</div>
            </div>
          </div>

          {/* Resultados clave */}
          <div className="mb-6">
            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Resultados garantizados:
            </h4>
            <ul className="space-y-2">
              {results.slice(0, 3).map((result: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                  <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{result}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Casos de uso */}
          <div className="mb-6">
            <h4 className="text-white font-semibold text-sm mb-3">💡 Casos de uso típicos:</h4>
            <div className="flex flex-wrap gap-2">
              {useCases.slice(0, 3).map((useCase: string, idx: number) => (
                <Badge
                  key={idx}
                  className="bg-gray-800/50 text-gray-300 border-gray-600/50 text-xs px-2 py-1 hover:bg-gray-700/50 transition-colors"
                >
                  {useCase}
                </Badge>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          {testimonial && (
            <div className="mb-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <p className="text-xs text-gray-300 italic mb-2">"{testimonial.text}"</p>
              <div className="text-xs text-gray-400">
                <strong>{testimonial.author}</strong> - {testimonial.company}
              </div>
            </div>
          )}

          {/* Trust signals */}
          <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-400" aria-hidden="true" />
                ROI garantizado
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-400" aria-hidden="true" />
                Respuesta 24h
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-400" aria-hidden="true" />
                Implementación rápida
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-purple-400" aria-hidden="true" />
                Soporte incluido
              </span>
            </div>
          </div>

          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white group/btn transition-all duration-300 py-6 text-base font-semibold shadow-lg hover:shadow-xl"
            onClick={(e) => {
              e.stopPropagation()
              onInquiry()
            }}
          >
            {moreInfoText}
            <ArrowRight
              className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300"
              aria-hidden="true"
            />
          </Button>

          {/* Urgencia sutil */}
          <p className="text-center text-xs text-gray-500 mt-3">📞 Respuesta garantizada en menos de 24 horas</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
