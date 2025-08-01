"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accessibility, Eye, Type, Zap, Volume2 } from "lucide-react"

// Skip Links Component
function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Saltar al contenido principal
      </a>
      <a
        href="#navigation"
        className="fixed top-4 left-32 z-50 bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Ir a navegación
      </a>
    </div>
  )
}

// Accessibility Panel Component
function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
  })

  useEffect(() => {
    // Apply accessibility settings to document
    if (settings.highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    if (settings.largeText) {
      document.documentElement.classList.add("large-text")
    } else {
      document.documentElement.classList.remove("large-text")
    }

    if (settings.reducedMotion) {
      document.documentElement.classList.add("reduced-motion")
    } else {
      document.documentElement.classList.remove("reduced-motion")
    }
  }, [settings])

  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  return (
    <>
      {/* Accessibility Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        aria-label="Abrir panel de accesibilidad"
      >
        <Accessibility className="w-6 h-6" />
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 z-50 w-80 bg-white shadow-xl border-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Accessibility className="w-5 h-5" />
              Opciones de Accesibilidad
            </h3>

            <div className="space-y-4">
              <Button
                variant={settings.highContrast ? "default" : "outline"}
                onClick={() => toggleSetting("highContrast")}
                className="w-full justify-start"
              >
                <Eye className="w-4 h-4 mr-2" />
                Alto Contraste
              </Button>

              <Button
                variant={settings.largeText ? "default" : "outline"}
                onClick={() => toggleSetting("largeText")}
                className="w-full justify-start"
              >
                <Type className="w-4 h-4 mr-2" />
                Texto Grande
              </Button>

              <Button
                variant={settings.reducedMotion ? "default" : "outline"}
                onClick={() => toggleSetting("reducedMotion")}
                className="w-full justify-start"
              >
                <Zap className="w-4 h-4 mr-2" />
                Reducir Movimiento
              </Button>

              <Button
                variant={settings.screenReader ? "default" : "outline"}
                onClick={() => toggleSetting("screenReader")}
                className="w-full justify-start"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Lector de Pantalla
              </Button>
            </div>

            <Button variant="ghost" onClick={() => setIsOpen(false)} className="w-full mt-4">
              Cerrar
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  )
}

// Main Accessibility Component
export function AccessibilityImprovements() {
  return (
    <>
      <SkipLinks />
      <AccessibilityPanel />
    </>
  )
}
