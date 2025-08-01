import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { CookieConsent } from "@/components/cookie-consent"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnalyticsWrapper } from "@/components/analytics-wrapper"
import { AccessibilityImprovements } from "@/components/accessibility-improvements"
import { PremiumAnimations } from "@/components/premium-animations"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { AuthProvider } from "@/lib/auth-context"
import { VercelAnalyticsTracker } from "@/components/vercel-analytics-tracker"
import "../globals.css"
import { Suspense } from "react"
import { getDictionary } from "./dictionaries"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
})

interface RootLayoutProps {
  children: React.ReactNode
  params: { lang: string }
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang)

  return {
    title: "Robert Software - Experto en IA, Automatización y Ciberseguridad",
    description:
      "Transformo negocios con IA estratégica, automatización de procesos y ciberseguridad. ROI garantizado para CEOs y founders que buscan resultados reales.",
    keywords:
      "IA, automatización, ciberseguridad, consultoría tecnológica, transformación digital, ROI, growth partner",
    authors: [{ name: "Robert Software" }],
    creator: "Robert Software",
    publisher: "Robert Software",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://robertsoftware.com"),
    alternates: {
      canonical: `/${params.lang}`,
      languages: {
        es: "/es",
        en: "/en",
      },
    },
    openGraph: {
      title: "Robert Software - Experto en IA, Automatización y Ciberseguridad",
      description:
        "Transformo negocios con IA estratégica, automatización de procesos y ciberseguridad. ROI garantizado.",
      url: `https://robertsoftware.com/${params.lang}`,
      siteName: "Robert Software",
      locale: params.lang === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: "/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Robert Software - Experto en IA y Automatización",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Robert Software - Experto en IA, Automatización y Ciberseguridad",
      description:
        "Transformo negocios con IA estratégica, automatización de procesos y ciberseguridad. ROI garantizado.",
      images: ["/images/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: { children: React.ReactNode; params: { lang: string } }) {
  const dict = await getDictionary(params.lang)

  return (
    <html lang={params.lang} className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body
        className={`${inter.className} bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white antialiased`}
      >
        <AuthProvider>
          <AnalyticsProvider>
            <div className="min-h-screen flex flex-col">
              <Header lang={params.lang} />

              <main id="main-content" className="flex-1 pt-20 relative">
                {children}
              </main>

              <Footer lang={params.lang} />
            </div>

            {/* Accessibility Improvements */}
            <AccessibilityImprovements />

            {/* Premium Animations */}
            <PremiumAnimations />

            {/* Analytics and Tracking */}
            <Suspense fallback={null}>
              <AnalyticsWrapper />
            </Suspense>

            {/* Cookie Consent */}
            <CookieConsent />

            {/* Vercel Analytics */}
            <VercelAnalyticsTracker />
            <Analytics />
            <SpeedInsights />
          </AnalyticsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
