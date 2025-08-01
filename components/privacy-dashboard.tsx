"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Trash2, EyeOff, Database, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import toast from "react-hot-toast"

interface PrivacyStats {
  totalLogs: number
  anonymizedLogs: number
  oldestLog: string | null
  criticalLogs: number
}

export function PrivacyDashboard() {
  const [stats, setStats] = useState<PrivacyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [cleanupLoading, setCleanupLoading] = useState(false)
  const { userProfile } = useAuth()

  useEffect(() => {
    if (userProfile?.role === "admin") {
      fetchPrivacyStats()
    }
  }, [userProfile])

  const fetchPrivacyStats = async () => {
    try {
      const response = await fetch("/api/admin/privacy-cleanup")
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error)
      toast.error("Error cargando estadísticas de privacidad")
    } finally {
      setLoading(false)
    }
  }

  const runCleanup = async () => {
    setCleanupLoading(true)
    try {
      const response = await fetch("/api/admin/privacy-cleanup", {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(data.message)
        await fetchPrivacyStats() // Actualizar estadísticas
      } else {
        const error = await response.json()
        toast.error(error.error || "Error en la limpieza")
      }
    } catch (error) {
      console.error("Error ejecutando limpieza:", error)
      toast.error("Error ejecutando limpieza de privacidad")
    } finally {
      setCleanupLoading(false)
    }
  }

  if (userProfile?.role !== "admin") {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No tienes permisos para ver el panel de privacidad</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando estadísticas de privacidad...</p>
        </CardContent>
      </Card>
    )
  }

  const anonymizationRate = stats ? (stats.anonymizedLogs / stats.totalLogs) * 100 : 0
  const criticalRate = stats ? (stats.criticalLogs / stats.totalLogs) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Panel de Privacidad y Cumplimiento
          </CardTitle>
          <CardDescription className="text-gray-400">
            Gestión ética de logs y protección de datos de usuarios
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total de Logs</CardTitle>
            <Database className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.totalLogs || 0}</div>
            <p className="text-xs text-gray-400">Registros de auditoría</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">IPs Anonimizadas</CardTitle>
            <EyeOff className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.anonymizedLogs || 0}</div>
            <p className="text-xs text-green-400">{anonymizationRate.toFixed(1)}% del total</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Logs Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.criticalLogs || 0}</div>
            <p className="text-xs text-yellow-400">Preservados permanentemente</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Log Más Antiguo</CardTitle>
            <Clock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-white">
              {stats?.oldestLog
                ? formatDistanceToNow(new Date(stats.oldestLog), { addSuffix: true, locale: es })
                : "N/A"}
            </div>
            <p className="text-xs text-gray-400">Registro más antiguo</p>
          </CardContent>
        </Card>
      </div>

      {/* Progreso de anonimización */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Estado de Anonimización</CardTitle>
          <CardDescription className="text-gray-400">
            Progreso de protección de privacidad en logs históricos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">IPs Anonimizadas</span>
              <span className="text-green-400">{anonymizationRate.toFixed(1)}%</span>
            </div>
            <Progress value={anonymizationRate} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Logs Críticos Preservados</span>
              <span className="text-yellow-400">{criticalRate.toFixed(1)}%</span>
            </div>
            <Progress value={criticalRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Acciones de limpieza */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Acciones de Privacidad</CardTitle>
          <CardDescription className="text-gray-400">
            Herramientas para mantener el cumplimiento de privacidad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <EyeOff className="w-5 h-5 text-green-400" />
                <h3 className="font-medium text-white">Anonimización Automática</h3>
              </div>
              <p className="text-sm text-gray-400 mb-3">Anonimiza IPs y user agents de logs con más de 90 días</p>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Activo</Badge>
            </div>

            <div className="p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Trash2 className="w-5 h-5 text-blue-400" />
                <h3 className="font-medium text-white">Limpieza Automática</h3>
              </div>
              <p className="text-sm text-gray-400 mb-3">Elimina logs no críticos con más de 1 año</p>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Activo</Badge>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <Button
              onClick={runCleanup}
              disabled={cleanupLoading}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {cleanupLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Ejecutando Limpieza...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Ejecutar Limpieza Manual
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-2">Ejecuta la anonimización y limpieza de logs inmediatamente</p>
          </div>
        </CardContent>
      </Card>

      {/* Información legal */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Cumplimiento Legal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <strong>GDPR Compliant:</strong> Los logs se usan únicamente para seguridad y auditoría
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Minimización de Datos:</strong> Solo registramos información esencial
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Retención Limitada:</strong> Anonimización automática y eliminación programada
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Transparencia:</strong> Los usuarios conocen el propósito de los logs
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
