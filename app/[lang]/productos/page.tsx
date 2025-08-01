import { getDictionary } from "../dictionaries"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DigitalProductSection } from "@/components/digital-product-section"
import { CTASection } from "@/components/cta-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { generateSEOData } from "@/lib/seo-utils"
import { PremiumSectionReveal } from "@/components/premium-animations"

interface ProductsPageProps {
  params: Promise<{ lang: "es" | "en" }>
}

export async function generateMetadata({ params }: ProductsPageProps) {
  const { lang } = await params
  const seoData = generateSEOData("products", lang, {
    title:
      lang === "es"
        ? "Productos Digitales Premium - Plantillas y Herramientas IA"
        : "Premium Digital Products - AI Templates and Tools",
    description:
      lang === "es"
        ? "Descarga herramientas profesionales listas para usar. Plantillas de presupuestos, sistemas de automatización y más. Resultados inmediatos garantizados."
        : "Download professional ready-to-use tools. Budget templates, automation systems and more. Immediate results guaranteed.",
  })

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords.join(", "),
    alternates: {
      canonical: seoData.canonical,
    },
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      url: seoData.canonical,
      images: [seoData.ogImage],
    },
  }
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header lang={lang} dict={dict} />

      <main id="main-content" className="pt-20">
        <PremiumSectionReveal>
          <DigitalProductSection dict={dict} />
        </PremiumSectionReveal>

        <PremiumSectionReveal delay={0.2}>
          <TestimonialsSection dict={dict} />
        </PremiumSectionReveal>

        <PremiumSectionReveal delay={0.4}>
          <CTASection dict={dict} />
        </PremiumSectionReveal>
      </main>

      <Footer dict={dict} />
    </div>
  )
}
