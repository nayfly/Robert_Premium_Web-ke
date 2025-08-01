import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Robert Software - Desarrollo Premium",
  description:
    "Soluciones de software premium para empresas. Desarrollo web, aplicaciones móviles y consultoría tecnológica.",
  keywords: "desarrollo software, aplicaciones web, desarrollo móvil, consultoría tecnológica",
  authors: [{ name: "Robert Software" }],
  creator: "Robert Software",
  publisher: "Robert Software",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "Robert Software - Desarrollo Premium",
    description: "Soluciones de software premium para empresas",
    siteName: "Robert Software",
  },
  twitter: {
    card: "summary_large_image",
    title: "Robert Software - Desarrollo Premium",
    description: "Soluciones de software premium para empresas",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Suspense fallback={<div>Loading...</div>}>
          <AnalyticsProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </AnalyticsProvider>
        </Suspense>
      </body>
    </html>
  )
}
