import { getDictionary } from "./dictionaries"
import { HeroSection } from "@/components/hero-section"
import { ProblemsSection } from "@/components/problems-section"
import { ServicesSection } from "@/components/services-section"
import { SuccessCaseSection } from "@/components/success-case-section"
import { AuthoritySection } from "@/components/authority-section"
import { FinalCTASection } from "@/components/final-cta-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { DigitalProductSection } from "@/components/digital-product-section"
import { CTASection } from "@/components/cta-section"
import { generateSEOData } from "@/lib/seo-utils"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const seoData = generateSEOData("home", params.lang)

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    canonical: seoData.canonical,
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      url: seoData.canonical,
      siteName: "Robert Software",
      images: [
        {
          url: seoData.ogImage || "/images/og-default.jpg",
          width: 1200,
          height: 630,
          alt: seoData.title,
        },
      ],
      locale: params.lang === "es" ? "es_ES" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoData.title,
      description: seoData.description,
      images: [seoData.ogImage || "/images/og-default.jpg"],
    },
    alternates: {
      canonical: seoData.canonical,
      languages: {
        es: "/es",
        en: "/en",
      },
    },
  }
}

export default async function HomePage({ params }: { params: { lang: string } }) {
  // Asegurar que tenemos un idioma válido
  const lang = params.lang || "es"

  try {
    const dict = await getDictionary(lang as "es" | "en")

    // Verificar que el diccionario se cargó correctamente
    if (!dict) {
      console.error("Dictionary not loaded for language:", lang)
      // Cargar diccionario por defecto
      const defaultDict = await getDictionary("es")
      return (
        <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
          <HeroSection dict={defaultDict} />
          <ProblemsSection dict={defaultDict} />
          <ServicesSection dict={defaultDict} />
          <SuccessCaseSection dict={defaultDict} />
          <AuthoritySection dict={defaultDict} />
          <FinalCTASection dict={defaultDict} />
          <TestimonialsSection dict={defaultDict} />
          <DigitalProductSection dict={defaultDict} />
          <CTASection dict={defaultDict} />
        </main>
      )
    }

    return (
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
        <HeroSection dict={dict} />
        <ProblemsSection dict={dict} />
        <ServicesSection dict={dict} />
        <SuccessCaseSection dict={dict} />
        <AuthoritySection dict={dict} />
        <FinalCTASection dict={dict} />
        <TestimonialsSection dict={dict} />
        <DigitalProductSection dict={dict} />
        <CTASection dict={dict} />
      </main>
    )
  } catch (error) {
    console.error("Error loading dictionary:", error)
    // Fallback a diccionario español
    const fallbackDict = await getDictionary("es")

    return (
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
        <HeroSection dict={fallbackDict} />
        <ProblemsSection dict={fallbackDict} />
        <ServicesSection dict={fallbackDict} />
        <SuccessCaseSection dict={fallbackDict} />
        <AuthoritySection dict={fallbackDict} />
        <FinalCTASection dict={fallbackDict} />
        <TestimonialsSection dict={fallbackDict} />
        <DigitalProductSection dict={fallbackDict} />
        <CTASection dict={fallbackDict} />
      </main>
    )
  }
}
