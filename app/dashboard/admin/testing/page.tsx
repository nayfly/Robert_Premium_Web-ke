"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PaymentFlowTester from "@/components/testing/payment-flow-tester"
import { Database, CreditCard, Mail, Settings, AlertTriangle, Info } from "lucide-react"
import EmailConfigDashboard from "@/components/email-config-dashboard"

export default function TestingPage() {
  const [systemStatus, setSystemStatus] = useState<"checking" | "healthy" | "issues" | "error">("checking")

  const quickTests = [
    {
      id: "database",
      name: "Base de Datos",
      description: "Verificar conexión y tablas",
      icon: Database,
      endpoint: "/api/test/database",
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Configuración de pagos",
      icon: CreditCard,
      endpoint: "/api/test/stripe",
    },
    {
      id: "email",
      name: "Sistema de Email",
      description: "Envío de notificaciones",
      icon: Mail,
      endpoint: "/api/test/email",
    },
  ]

  const runQuickTest = async (test: (typeof quickTests)[0]) => {
    try {
      const method = test.id === "email" ? "POST" : "GET"
      const response = await fetch(test.endpoint, { method })
      const data = await response.json()

      return {
        success: data.success,
        message: data.message || (data.success ? "Test exitoso" : "Test fallido"),
        details: data.details,
      }
    } catch (error) {
      return {
        success: false,
        message: "Error de conexión",
        details: error,
      }
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Panel de Pruebas</h1>
        <p className="text-muted-foreground">Herramientas para probar y verificar el funcionamiento del sistema</p>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {quickTests.map((test) => {
          const IconComponent = test.icon
          return (
            <Card key={test.id} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <IconComponent className="w-6 h-6 text-blue-400" />
                  <Badge variant="outline" className="border-gray-600 text-gray-400">
                    Listo
                  </Badge>
                </div>
                <CardTitle className="text-white text-lg">{test.name}</CardTitle>
                <CardDescription className="text-gray-400">{test.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  onClick={() => runQuickTest(test)}
                >
                  Probar Ahora
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Testing Interface */}
      <Tabs defaultValue="flow-testing" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="flow-testing" className="data-[state=active]:bg-gray-700">
            Testing de Flujo Completo
          </TabsTrigger>
          <TabsTrigger value="unit-tests" className="data-[state=active]:bg-gray-700">
            Tests Unitarios
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-gray-700">
            Rendimiento
          </TabsTrigger>
          <TabsTrigger value="email-config" className="data-[state=active]:bg-gray-700">
            Configuración Email
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flow-testing">
          <PaymentFlowTester />
        </TabsContent>

        <TabsContent value="unit-tests">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Tests Unitarios</CardTitle>
              <CardDescription className="text-gray-400">
                Pruebas individuales de componentes del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Tests unitarios en desarrollo</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Tests de Rendimiento</CardTitle>
              <CardDescription className="text-gray-400">
                Análisis de velocidad y optimización del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Tests de rendimiento en desarrollo</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email-config">
          <EmailConfigDashboard />
        </TabsContent>
      </Tabs>

      {/* System Information */}
      <Card className="bg-gray-800 border-gray-700 mt-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Info className="w-5 h-5" />
            Información del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Entorno</p>
              <p className="text-white font-medium">
                {process.env.NODE_ENV === "development" ? "Desarrollo" : "Producción"}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Base de Datos</p>
              <p className="text-white font-medium">Supabase PostgreSQL</p>
            </div>
            <div>
              <p className="text-gray-400">Pagos</p>
              <p className="text-white font-medium">Stripe</p>
            </div>
            <div>
              <p className="text-gray-400">Emails</p>
              <p className="text-white font-medium">Sistema Interno</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
