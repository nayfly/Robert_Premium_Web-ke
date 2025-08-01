"use client"

import { Badge } from "@/components/ui/badge"
import { analytics } from "@/lib/analytics"
import { vercelAnalytics } from "@/lib/vercel-analytics"
import { motion } from "framer-motion"
import { ProductCard } from "@/components/ui/product-card"

interface DigitalProductSectionProps {
  dict: any
}

export function DigitalProductSection({ dict }: DigitalProductSectionProps) {
  const handleDownloadClick = () => {
    analytics.trackProductDownload("Plantilla de Presupuestos Inteligente", 97)
    vercelAnalytics.trackProductPurchased("Plantilla de Presupuestos Inteligente", 97, "direct")
    vercelAnalytics.trackFunnelStep("product_purchase_funnel", 2, "download_clicked")

    // Abrir Gumroad o sistema de pago
    window.open("https://gumroad.com/l/plantilla-presupuestos-robert", "_blank")
  }

  const handleDemoClick = () => {
    analytics.trackCustomEvent("demo_view", {
      product_name: "Plantilla de Presupuestos",
      event_category: "engagement",
    })
    vercelAnalytics.trackDemoRequested("Plantilla de Presupuestos Inteligente", "web_button")

    // Abrir demo en nueva pestaña
    window.open("https://demo.robertsoftware.com/plantilla-presupuestos", "_blank")
  }

  // Fallback data
  const productData = dict?.digitalProduct || {
    title: "Producto Digital",
    titleHighlight: "Premium",
    subtitle: "La herramienta que necesitas para optimizar tu negocio",
    template: {
      title: "Plantilla de Presupuestos Inteligente",
      description: "Sistema completo para generar presupuestos profesionales",
      price: "€97",
      originalPrice: "€297",
      discount: "-67%",
      launchPrice: "Precio de lanzamiento",
      immediateAccess: "Acceso inmediato tras el pago",
      guarantee: "Garantía de satisfacción de 30 días o te devolvemos el dinero",
      includes: "Qué incluye:",
      results: "Resultados esperados:",
      downloadNow: "Descargar Ahora",
      viewDemo: "Ver Demo",
      features: [
        "Plantilla Excel/Google Sheets optimizada",
        "Calculadora automática de márgenes",
        "Base de datos de precios actualizable",
        "Generador de PDFs profesionales",
        "Video-tutoriales paso a paso",
        "Soporte por email incluido",
      ],
      expectedResults: [
        "Ahorra 5+ horas por presupuesto",
        "Aumenta precisión en un 95%",
        "Mejora imagen profesional",
        "Reduce errores de cálculo",
        "Acelera proceso de ventas",
      ],
    },
  }

  return (
    <section id="productos" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900/5 to-purple-800/5">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-4">
            <Badge className="bg-green-600/20 text-green-400 border-green-500/30 px-4 py-2">
              🚀 PRODUCTO DESTACADO
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="text-white">{productData.title}</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
              {productData.titleHighlight}
            </span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
            {productData.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <ProductCard
            title={productData.template.title}
            description={productData.template.description}
            price={productData.template.price}
            originalPrice={productData.template.originalPrice}
            discount={productData.template.discount}
            launchPrice={productData.template.launchPrice}
            immediateAccess={productData.template.immediateAccess}
            guarantee={productData.template.guarantee}
            features={productData.template.features}
            expectedResults={productData.template.expectedResults}
            includesLabel={productData.template.includes}
            resultsLabel={productData.template.results}
            downloadNow={productData.template.downloadNow}
            viewDemo={productData.template.viewDemo}
            onDownload={handleDownloadClick}
            onDemo={handleDemoClick}
          />
        </motion.div>
      </div>
    </section>
  )
}
