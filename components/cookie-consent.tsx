"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Settings } from "lucide-react"
import Link from "next/link"

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setShowConsent(true)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "all")
    setShowConsent(false)
    // Aquí puedes activar todas las cookies/tracking
  }

  const acceptNecessary = () => {
    localStorage.setItem("cookie-consent", "necessary")
    setShowConsent(false)
    // Solo cookies necesarias
  }

  const rejectAll = () => {
    localStorage.setItem("cookie-consent", "rejected")
    setShowConsent(false)
    // Deshabilitar tracking
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="bg-gray-900 border-gray-700 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">🍪 Configuración de Cookies</h3>
              <p className="text-gray-300 text-sm mb-4">
                Utilizamos cookies para mejorar tu experiencia, analizar el tráfico y personalizar el contenido. Puedes
                gestionar tus preferencias en cualquier momento.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConsent(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={acceptAll} className="bg-purple-600 hover:bg-purple-700 text-white">
              Aceptar todas
            </Button>
            <Button
              onClick={acceptNecessary}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
            >
              Solo necesarias
            </Button>
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="ghost"
              className="text-gray-300 hover:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </div>

          {showSettings && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Cookies necesarias</span>
                  <span className="text-green-400">Siempre activas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Cookies analíticas</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Cookies de marketing</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 text-xs text-gray-400">
            <Link href="/legal/cookies" className="hover:text-purple-400 underline">
              Más información sobre cookies
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
