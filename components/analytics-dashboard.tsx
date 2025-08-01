"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Clock, Target } from "lucide-react"

// Componente para mostrar métricas en tiempo real (solo para desarrollo/testing)
export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState({
    pageViews: 0,
    conversions: 0,
    avgTimeOnPage: 0,
    bounceRate: 0,
    topPages: [] as string[],
    recentEvents: [] as any[],
  })

  useEffect(() => {
    // Simular métricas para desarrollo
    if (process.env.NODE_ENV === "development") {
      const interval = setInterval(() => {
        setMetrics((prev) => ({
          ...prev,
          pageViews: prev.pageViews + Math.floor(Math.random() * 3),
          conversions: prev.conversions + (Math.random() > 0.8 ? 1 : 0),
          avgTimeOnPage: 120 + Math.floor(Math.random() * 180),
          bounceRate: 25 + Math.floor(Math.random() * 20),
        }))
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [])

  if (process.env.NODE_ENV !== "development") {
    return null // Solo mostrar en desarrollo
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 max-h-96 overflow-y-auto bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-4 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">📊 Analytics Live</h3>
        <Badge variant="outline" className="text-xs">
          DEV
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-xs text-gray-400">Vistas</p>
                <p className="text-lg font-bold text-white">{metrics.pageViews}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-xs text-gray-400">Conversiones</p>
                <p className="text-lg font-bold text-white">{metrics.conversions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-xs text-gray-400">Tiempo avg</p>
                <p className="text-sm font-bold text-white">{Math.floor(metrics.avgTimeOnPage / 60)}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <div>
                <p className="text-xs text-gray-400">Rebote</p>
                <p className="text-sm font-bold text-white">{metrics.bounceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-gray-400 text-center">🔄 Actualizando cada 5s</div>
    </div>
  )
}
