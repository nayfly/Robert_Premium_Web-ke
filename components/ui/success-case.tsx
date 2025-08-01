"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ExternalLink, Linkedin, Mail, CheckCircle, ArrowRight, TrendingUp, Calendar, Building2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface SuccessCaseProps {
  icon: LucideIcon
  company: string
  sector: string
  size: string
  timeline: string
  investment: string
  client: {
    name: string
    role: string
    linkedin: string
    email: string
    verified: boolean
  }
  challenge: {
    title: string
    description: string
    painPoints: string[]
    metrics: Record<string, string>
  }
  solution: {
    title: string
    description: string
    components: string[]
    timeline: Array<{ week: string; task: string; status: string }>
  }
  results: {
    timeframe: string
    roi: string
    totalSavings: string
    metrics: Array<{
      metric: string
      before: string
      after: string
      improvement: string
      color: string
    }>
    businessImpact: string[]
  }
  testimonial: {
    quote: string
    fullTestimonial: string
    date: string
    rating: number
  }
  verification: {
    linkedinPost?: string
    caseStudyPdf?: string
    videoTestimonial?: string
    metrics?: string
  }
  tags: string[]
  gradient: string
  iconColor: string
  iconBg: string
  onView: () => void
  onContactClient: (name: string, method: string) => void
}

export function SuccessCase({
  icon: Icon,
  company,
  sector,
  size,
  timeline,
  investment,
  client,
  challenge,
  solution,
  results,
  testimonial,
  verification,
  tags,
  gradient,
  iconColor,
  iconBg,
  onView,
  onContactClient,
}: SuccessCaseProps) {
  return (
    <motion.div whileHover={{ y: -4 }} className="h-full">
      <Card
        className={`h-full bg-gradient-to-br ${gradient} backdrop-blur-sm border-gray-800 hover:border-purple-500/50 transition-all duration-500 group cursor-pointer overflow-hidden`}
        onClick={onView}
        role="button"
        tabIndex={0}
        aria-label={`Ver caso de éxito de ${company}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onView()
          }
        }}
      >
        {/* Header Section */}
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`p-4 ${iconBg} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-7 h-7 ${iconColor}`} aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-white text-xl mb-1">{company}</CardTitle>
                <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-800/50 text-xs">
                  {sector}
                </Badge>
              </div>
            </div>
            {client.verified && (
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-400 font-medium">Verificado</span>
              </div>
            )}
          </div>

          {/* Company Details */}
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-400 mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-3 h-3" />
              <span>{size}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>{timeline}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3" />
              <span>{investment}</span>
            </div>
          </div>

          {/* ROI Highlight */}
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400">{results.roi}</div>
                <div className="text-xs text-gray-400">ROI en {results.timeframe}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">{results.totalSavings}</div>
                <div className="text-xs text-gray-400">Ahorro total</div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Challenge */}
          <div className="mb-6">
            <h4 className="text-red-400 font-bold text-sm mb-2 flex items-center gap-2">🚨 Desafío:</h4>
            <CardDescription className="text-gray-300 text-sm leading-relaxed mb-3">
              <strong className="text-white">{challenge.title}</strong>
            </CardDescription>
            <p className="text-gray-400 text-xs leading-relaxed">{challenge.description}</p>
          </div>

          {/* Solution */}
          <div className="mb-6">
            <h4 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2">🔧 Solución:</h4>
            <CardDescription className="text-gray-300 text-sm leading-relaxed mb-3">
              <strong className="text-white">{solution.title}</strong>
            </CardDescription>
            <p className="text-gray-400 text-xs leading-relaxed">{solution.description}</p>
          </div>

          {/* Key Results */}
          <div className="mb-6">
            <h4 className="text-green-400 font-bold text-sm mb-3 flex items-center gap-2">📈 Resultados clave:</h4>
            <div className="grid grid-cols-1 gap-3">
              {results.metrics.slice(0, 2).map((metric, idx) => (
                <div key={idx} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium text-xs">{metric.metric}</span>
                    <span className={`font-bold text-xs ${metric.color}`}>{metric.improvement}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-red-300">{metric.before}</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    <span className="text-green-300">{metric.after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Testimonial */}
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
              {[...Array(testimonial.rating)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xs">
                  ⭐
                </span>
              ))}
              <span className="text-xs text-gray-400">{testimonial.date}</span>
            </div>
            <blockquote className="text-gray-300 italic text-xs leading-relaxed mb-3">"{testimonial.quote}"</blockquote>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-semibold text-xs">{client.name}</div>
                <div className="text-gray-400 text-xs">{client.role}</div>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent text-xs px-2 py-1 h-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    onContactClient(client.name, "linkedin")
                    window.open(client.linkedin, "_blank")
                  }}
                >
                  <Linkedin className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent text-xs px-2 py-1 h-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    onContactClient(client.name, "email")
                    window.open(`mailto:${client.email}`, "_blank")
                  }}
                >
                  <Mail className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} className="bg-purple-600/20 text-purple-300 border-purple-500/30 text-xs px-2 py-1">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Verification Links */}
          <div className="flex gap-2">
            {verification.caseStudyPdf && (
              <Button
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent text-xs px-3 py-2 flex-1"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(verification.caseStudyPdf, "_blank")
                }}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Caso completo
              </Button>
            )}
            {verification.linkedinPost && (
              <Button
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent text-xs px-3 py-2 flex-1"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(verification.linkedinPost, "_blank")
                }}
              >
                <Linkedin className="w-3 h-3 mr-1" />
                Ver post
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
