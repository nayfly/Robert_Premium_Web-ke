"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, FileText, Settings, LogOut } from "lucide-react"

export default function DashboardPage({ params }: { params: { lang: string } }) {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // Redirigir según el rol
      switch (user.role) {
        case "admin":
          router.push(`/${params.lang}/dashboard/admin`)
          break
        case "empleado":
          router.push(`/${params.lang}/dashboard/empleado`)
          break
        case "cliente":
          router.push(`/${params.lang}/dashboard/cliente`)
          break
      }
    }
  }, [user, router, params.lang])

  const handleLogout = async () => {
    await logout()
    router.push(`/${params.lang}`)
  }

  if (!user) return null

  const dashboardItems = [
    {
      title: "Estadísticas",
      description: "Ver métricas y análisis",
      icon: BarChart3,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Usuarios",
      description: "Gestionar usuarios del sistema",
      icon: Users,
      color: "text-green-600 bg-green-50",
    },
    {
      title: "Proyectos",
      description: "Administrar proyectos activos",
      icon: FileText,
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "Configuración",
      description: "Ajustes del sistema",
      icon: Settings,
      color: "text-gray-600 bg-gray-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Panel de Control</h2>
          <p className="text-gray-600">Gestiona tu cuenta y proyectos</p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardItems.map((item, index) => {
          const IconComponent = item.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Rol:</strong> {user.role}
            </p>
            <p>
              <strong>ID:</strong> {user.id}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
