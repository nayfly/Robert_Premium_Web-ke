"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Calculator, CheckCircle, Star, Clock, Users, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  title: string
  description: string
  price: string
  originalPrice: string
  discount: string
  launchPrice: string
  immediateAccess: string
  guarantee: string
  features: string[]
  expectedResults: string[]
  includesLabel: string
  resultsLabel: string
  downloadNow: string
  viewDemo: string
  onDownload: () => void
  onDemo: () => void
}

export function ProductCard({
  title,
  description,
  price,
  originalPrice,
  discount,
  launchPrice,
  immediateAccess,
  guarantee,
  features,
  expectedResults,
  includesLabel,
  resultsLabel,
  downloadNow,
  viewDemo,
  onDownload,
  onDemo,
}: ProductCardProps) {
  const router = useRouter()

  const handlePurchase = () => {
    // Redirigir al checkout con el ID del producto
    router.push("/checkout?product=plantilla-presupuestos")
  }

  const handleDemo = () => {
    // Abrir demo en nueva ventana
    window.open("/demo/plantilla-presupuestos", "_blank")
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-green-600/20 rounded-3xl blur-xl"></div>

        <Card className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-2 border-purple-500/50 overflow-hidden backdrop-blur-sm">
          {/* Header con stats */}
          <div className="bg-gradient-to-r from-purple-600/10 to-green-600/10 p-6 border-b border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-600/20 rounded-xl">
                  <Calculator className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{title}</h3>
                  <p className="text-gray-300">{description}</p>
                </div>
              </div>

              {/* Social proof */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-300 ml-2">4.9/5 (127 reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>+500 empresas lo usan</span>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Features */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  {includesLabel}
                </h4>
                <ul className="space-y-4">
                  {features.map((feature: string, idx: number) => (
                    <motion.li
                      key={idx}
                      className="flex items-start gap-3 text-gray-300"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-base">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  {resultsLabel}
                </h4>
                <ul className="space-y-4">
                  {expectedResults.map((result: string, idx: number) => (
                    <motion.li
                      key={idx}
                      className="flex items-start gap-3 text-gray-300"
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      </div>
                      <span className="text-base font-medium">{result}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Pricing destacado */}
            <motion.div
              className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl p-8 mb-8 border border-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-5xl font-bold text-white">{price}</span>
                    <div className="flex flex-col">
                      <span className="text-gray-400 line-through text-xl">{originalPrice}</span>
                      <Badge className="bg-red-500 text-white px-3 py-1">{discount}</Badge>
                    </div>
                  </div>
                  <p className="text-purple-400 font-semibold">{launchPrice}</p>
                  <p className="text-green-400 text-sm">{immediateAccess}</p>
                </div>

                {/* Urgencia */}
                <motion.div
                  className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-center"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="flex items-center justify-center gap-2 text-orange-400 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-bold">OFERTA LIMITADA</span>
                  </div>
                  <p className="text-sm text-gray-300">Solo hasta fin de mes</p>
                  <p className="text-xs text-orange-300">Quedan 23 licencias</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Garantía */}
            <motion.div
              className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-blue-300 text-center font-medium">{guarantee}</p>
            </motion.div>

            {/* CTAs mejorados */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-12 py-6 text-xl font-semibold shadow-lg shadow-purple-500/25 hover:scale-105 transition-all duration-300"
                onClick={handlePurchase}
              >
                <ShoppingCart className="mr-3 w-6 h-6" />
                Comprar ahora - {price}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-500 text-white hover:bg-gray-800 px-12 py-6 text-xl bg-transparent hover:scale-105 transition-all duration-300"
                onClick={handleDemo}
              >
                <FileText className="mr-3 w-6 h-6" />
                {viewDemo}
              </Button>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              className="mt-8 pt-6 border-t border-gray-700"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Pago 100% seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Descarga inmediata</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Soporte incluido</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Garantía 30 días</span>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
