import { redirect } from "next/navigation"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ProblemsSection } from "@/components/problems-section"
import { CasesSection } from "@/components/cases-section"
import { DigitalProductSection } from "@/components/digital-product-section"
import { CTASection } from "@/components/cta-section"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function RootPage() {
  // Redirigir a la página principal en español
  redirect("/es")

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProblemsSection />
        <CasesSection />
        <DigitalProductSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
