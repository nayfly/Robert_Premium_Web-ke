export interface SEOData {
  title: string
  description: string
  keywords: string[]
  canonical: string
  ogImage?: string
}

export function generateSEOData(page: string, lang: string): SEOData {
  const baseUrl = "https://robertsoftware.com"
  const isSpanish = lang === "es"

  const seoData: Record<string, SEOData> = {
    home: {
      title: isSpanish
        ? "Robert Software - Growth Partner Tecnológico Premium | ROI Garantizado 300%+"
        : "Robert Software - Premium Technology Growth Partner | 300%+ ROI Guaranteed",
      description: isSpanish
        ? "Transformo empresas con IA, automatización y ciberseguridad. ROI garantizado del 300%+ en 90 días. Casos reales verificables. Solo 2 clientes/mes."
        : "I transform businesses with AI, automation and cybersecurity. 300%+ ROI guaranteed in 90 days. Verifiable real cases. Only 2 clients/month.",
      keywords: isSpanish
        ? [
            "consultor IA España",
            "automatización procesos empresariales",
            "auditoría ciberseguridad",
            "growth partner tecnológico",
            "ROI garantizado",
            "transformación digital",
            "CTO externo",
            "consultoría estratégica",
          ]
        : [
            "AI consultant Spain",
            "business process automation",
            "cybersecurity audit",
            "technology growth partner",
            "guaranteed ROI",
            "digital transformation",
            "external CTO",
            "strategic consulting",
          ],
      canonical: `${baseUrl}/${lang}`,
      ogImage: "/images/og-home-premium.jpg",
    },
  }

  return seoData[page] || seoData.home
}

export function generateStructuredData(type: string, data: any, lang: string) {
  const baseUrl = "https://robertsoftware.com"
  const isSpanish = lang === "es"

  switch (type) {
    case "service":
      return {
        "@type": "Service",
        name: data.name,
        description: data.description,
        provider: {
          "@type": "Organization",
          name: "Robert Software",
          url: baseUrl,
        },
        serviceType: data.serviceType,
        offers: {
          "@type": "Offer",
          price: data.price,
          priceCurrency: "EUR",
        },
      }

    case "faq":
      return {
        "@type": "FAQPage",
        mainEntity: data.questions.map((q: any) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer,
          },
        })),
      }

    default:
      return {}
  }
}
