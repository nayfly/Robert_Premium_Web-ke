"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

interface TestimonialsSectionProps {
  dict: any
}

export function TestimonialsSection({ dict }: TestimonialsSectionProps) {
  const testimonials = [
    {
      name: "Carlos Mendoza",
      role: "CEO",
      company: "TechFlow Solutions",
      industry: "SaaS",
      content:
        "Robert transformó completamente nuestros procesos. En 3 meses automatizamos el 80% de nuestras tareas repetitivas. El ROI fue del 340% en el primer año.",
      rating: 5,
      result: "340% ROI",
      timeframe: "3 meses",
      avatar: "CM",
    },
    {
      name: "Ana Rodríguez",
      role: "CTO",
      company: "FinanceCore",
      industry: "Fintech",
      content:
        "La auditoría de ciberseguridad nos salvó de un desastre. Detectó 23 vulnerabilidades críticas que ni sabíamos que existían. Ahora dormimos tranquilos.",
      rating: 5,
      result: "23 vulnerabilidades resueltas",
      timeframe: "2 semanas",
      avatar: "AR",
    },
    {
      name: "Miguel Torres",
      role: "Fundador",
      company: "LegalTech Pro",
      industry: "LegalTech",
      content:
        "El agente IA que desarrolló para nosotros analiza contratos 10x más rápido que nuestro equipo legal. Increíble nivel técnico y visión estratégica.",
      rating: 5,
      result: "10x más rápido",
      timeframe: "6 semanas",
      avatar: "MT",
    },
  ]

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-gray-900/30 to-gray-800/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge className="bg-green-600/20 text-green-400 border-green-500/30 px-4 py-2 mb-4">
            ⭐ TESTIMONIOS REALES
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Lo que dicen <span className="text-purple-400">mis clientes</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Resultados reales de CEOs y CTOs que han transformado sus empresas
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300 group"
            >
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                      <span className="text-purple-400 font-bold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      <p className="text-purple-400 text-sm font-medium">{testimonial.company}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                    {testimonial.industry}
                  </Badge>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <Quote className="w-6 h-6 text-purple-400/50 absolute -top-2 -left-2" />
                  <p className="text-gray-300 italic pl-4">"{testimonial.content}"</p>
                </div>

                {/* Results */}
                <div className="bg-gradient-to-r from-green-900/20 to-green-800/20 rounded-lg p-4 border border-green-500/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-green-400 font-bold text-lg">{testimonial.result}</p>
                      <p className="text-gray-400 text-sm">Resultado obtenido</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{testimonial.timeframe}</p>
                      <p className="text-gray-400 text-sm">Tiempo implementación</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-700">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
                <p className="text-gray-300 text-sm">Proyectos completados</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">98%</div>
                <p className="text-gray-300 text-sm">Clientes satisfechos</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">€2.3M</div>
                <p className="text-gray-300 text-sm">Ahorros generados</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">24h</div>
                <p className="text-gray-300 text-sm">Tiempo de respuesta</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
