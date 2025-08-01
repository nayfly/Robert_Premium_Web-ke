"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  CreditCard,
  Mail,
  Download,
  FileText,
  Settings,
  AlertTriangle,
  Loader2,
} from "lucide-react"

interface TestResult {
  id: string
  name: string
  status: "pending" | "running" | "success" | "error" | "skipped"
  message?: string
  details?: any
  duration?: number
  error?: string
}

interface TestStep {
  id: string
  name: string
  description: string
  icon: any
  endpoint?: string
  method?: "GET" | "POST"
  payload?: any
  dependencies?: string[]
}

const testSteps: TestStep[] = [
  {
    id: "database",
    name: "Conexión Base de Datos",
    description: "Verificar conexión a Supabase y tablas requeridas",
    icon: Database,
    endpoint: "/api/test/database",
    method: "GET",
  },
  {
    id: "stripe",
    name: "Configuración Stripe",
    description: "Validar claves de API y conexión con Stripe",
    icon: CreditCard,
    endpoint: "/api/test/stripe",
    method: "GET",
  },
  {
    id: "payment-intent",
    name: "Crear Payment Intent",
    description: "Crear intención de pago de prueba",
    icon: CreditCard,
    endpoint: "/api/create-payment-intent",
    method: "POST",
    payload: {
      productId: "automation_ai",
      customerInfo: {
        name: "Test Customer",
        email: "test@robertsoftware.es",
        phone: "+34600123456",
        address: "Calle Test 123",
        city: "Madrid",
        postalCode: "28001",
        country: "España",
      },
    },
    dependencies: ["database", "stripe"],
  },
  {
    id: "order-verification",
    name: "Verificar Orden",
    description: "Comprobar que la orden se creó correctamente en BD",
    icon: FileText,
    dependencies: ["payment-intent"],
  },
  {
    id: "webhook-simulation",
    name: "Simular Webhook",
    description: "Simular confirmación de pago desde Stripe",
    icon: Settings,
    endpoint: "/api/webhook/stripe",
    method: "POST",
    dependencies: ["order-verification"],
  },
  {
    id: "invoice-generation",
    name: "Generar Factura",
    description: "Crear factura automática tras pago exitoso",
    icon: FileText,
    dependencies: ["webhook-simulation"],
  },
  {
    id: "download-token",
    name: "Token de Descarga",
    description: "Generar token seguro para descarga de archivos",
    icon: Download,
    dependencies: ["invoice-generation"],
  },
  {
    id: "email-notification",
    name: "Notificación Email",
    description: "Enviar emails de confirmación y descarga",
    icon: Mail,
    endpoint: "/api/test/email",
    method: "POST",
    dependencies: ["download-token"],
  },
  {
    id: "file-download",
    name: "Descarga de Archivo",
    description: "Probar descarga usando token generado",
    icon: Download,
    dependencies: ["download-token"],
  },
  {
    id: "cleanup",
    name: "Limpiar Datos",
    description: "Eliminar datos de testing de la base de datos",
    icon: Settings,
    dependencies: ["file-download"],
  },
]

export default function PaymentFlowTester() {
  const [results, setResults] = useState<TestResult[]>(
    testSteps.map((step) => ({
      id: step.id,
      name: step.name,
      status: "pending",
    })),
  )
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState<string | null>(null)
  const [testData, setTestData] = useState<any>({})
  const [logs, setLogs] = useState<string[]>([])

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }, [])

  const updateResult = useCallback((id: string, update: Partial<TestResult>) => {
    setResults((prev) => prev.map((result) => (result.id === id ? { ...result, ...update } : result)))
  }, [])

  const runIndividualTest = async (stepId: string) => {
    const step = testSteps.find((s) => s.id === stepId)
    if (!step) return

    setCurrentStep(stepId)
    updateResult(stepId, { status: "running" })
    addLog(`Iniciando test: ${step.name}`)

    const startTime = Date.now()

    try {
      let result: any

      switch (stepId) {
        case "database":
        case "stripe":
        case "email-notification":
          if (step.endpoint) {
            const response = await fetch(step.endpoint, {
              method: step.method || "GET",
              headers: { "Content-Type": "application/json" },
              body: step.payload ? JSON.stringify(step.payload) : undefined,
            })
            result = await response.json()
          }
          break

        case "payment-intent":
          if (step.endpoint && step.payload) {
            const response = await fetch(step.endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(step.payload),
            })
            result = await response.json()
            if (result.orderId) {
              setTestData((prev) => ({ ...prev, orderId: result.orderId, clientSecret: result.clientSecret }))
            }
          }
          break

        case "order-verification":
          if (testData.orderId) {
            const response = await fetch(`/api/orders/${testData.orderId}`)
            result = await response.json()
          } else {
            throw new Error("No hay Order ID para verificar")
          }
          break

        case "webhook-simulation":
          if (testData.orderId) {
            const webhookPayload = {
              type: "payment_intent.succeeded",
              data: {
                object: {
                  id: `pi_test_${testData.orderId}`,
                  status: "succeeded",
                  amount: 299700,
                  currency: "eur",
                },
              },
            }
            const response = await fetch("/api/webhook/stripe", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "stripe-signature": "test-signature",
              },
              body: JSON.stringify(webhookPayload),
            })
            result = await response.json()
          } else {
            throw new Error("No hay Order ID para webhook")
          }
          break

        case "invoice-generation":
          if (testData.orderId) {
            const response = await fetch(`/api/invoices?orderId=${testData.orderId}`)
            result = await response.json()
            if (result.invoice) {
              setTestData((prev) => ({ ...prev, invoiceId: result.invoice.id }))
            }
          } else {
            throw new Error("No hay Order ID para generar factura")
          }
          break

        case "download-token":
          if (testData.orderId) {
            const response = await fetch(`/api/downloads?orderId=${testData.orderId}`)
            result = await response.json()
            if (result.download) {
              setTestData((prev) => ({ ...prev, downloadToken: result.download.download_token }))
            }
          } else {
            throw new Error("No hay Order ID para generar token")
          }
          break

        case "file-download":
          if (testData.downloadToken) {
            const response = await fetch(`/api/download/${testData.downloadToken}`)
            result = {
              success: response.ok,
              status: response.status,
              contentType: response.headers.get("content-type"),
              contentLength: response.headers.get("content-length"),
            }
          } else {
            throw new Error("No hay token de descarga para probar")
          }
          break

        case "cleanup":
          if (testData.orderId) {
            const response = await fetch(`/api/test/cleanup`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: testData.orderId }),
            })
            result = await response.json()
            setTestData({}) // Limpiar datos de testing
          } else {
            result = { success: true, message: "No hay datos para limpiar" }
          }
          break

        default:
          throw new Error(`Test no implementado: ${stepId}`)
      }

      const duration = Date.now() - startTime

      if (result?.success !== false) {
        updateResult(stepId, {
          status: "success",
          message: result?.message || "Test completado exitosamente",
          details: result,
          duration,
        })
        addLog(`✅ ${step.name} - Exitoso (${duration}ms)`)
      } else {
        throw new Error(result?.error || "Test falló")
      }
    } catch (error) {
      const duration = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"

      updateResult(stepId, {
        status: "error",
        message: errorMessage,
        error: errorMessage,
        duration,
      })
      addLog(`❌ ${step.name} - Error: ${errorMessage} (${duration}ms)`)
    }

    setCurrentStep(null)
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setLogs([])
    setTestData({})

    // Resetear todos los resultados
    setResults(
      testSteps.map((step) => ({
        id: step.id,
        name: step.name,
        status: "pending",
      })),
    )

    addLog("🚀 Iniciando testing completo del flujo de pagos")

    for (const step of testSteps) {
      // Verificar dependencias
      if (step.dependencies) {
        const failedDependencies = step.dependencies.filter((depId) => {
          const depResult = results.find((r) => r.id === depId)
          return depResult?.status === "error"
        })

        if (failedDependencies.length > 0) {
          updateResult(step.id, {
            status: "skipped",
            message: `Saltado por dependencias fallidas: ${failedDependencies.join(", ")}`,
          })
          addLog(`⏭️ ${step.name} - Saltado por dependencias`)
          continue
        }
      }

      await runIndividualTest(step.id)

      // Pequeña pausa entre tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setIsRunning(false)
    addLog("🏁 Testing completo finalizado")
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />
      case "running":
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
      case "skipped":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    const variants = {
      success: "bg-green-500/20 text-green-400 border-green-500/30",
      error: "bg-red-500/20 text-red-400 border-red-500/30",
      running: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      skipped: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      pending: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    }

    const labels = {
      success: "Exitoso",
      error: "Error",
      running: "Ejecutando",
      skipped: "Saltado",
      pending: "Pendiente",
    }

    return <Badge className={variants[status]}>{labels[status]}</Badge>
  }

  const completedTests = results.filter((r) => r.status === "success").length
  const totalTests = results.length
  const progress = (completedTests / totalTests) * 100

  return (
    <div className="space-y-6">
      {/* Header y controles */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Testing de Flujo de Pagos</CardTitle>
              <CardDescription className="text-gray-400">
                Ejecuta tests individuales o completos del sistema de pagos
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={runAllTests} disabled={isRunning} className="bg-blue-600 hover:bg-blue-700">
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ejecutando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Ejecutar Todos
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progreso</span>
              <span className="text-white">
                {completedTests}/{totalTests} tests completados
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Lista de tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {testSteps.map((step, index) => {
          const result = results.find((r) => r.id === step.id)
          const IconComponent = step.icon

          return (
            <Card key={step.id} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700">
                      <span className="text-sm font-medium text-white">{index + 1}</span>
                    </div>
                    <IconComponent className="w-5 h-5 text-blue-400" />
                    <div>
                      <CardTitle className="text-white text-sm">{step.name}</CardTitle>
                      <CardDescription className="text-xs text-gray-400">{step.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(result?.status || "pending")}
                    {getStatusBadge(result?.status || "pending")}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {result?.message && (
                      <p
                        className={`text-xs ${
                          result.status === "success"
                            ? "text-green-400"
                            : result.status === "error"
                              ? "text-red-400"
                              : "text-gray-400"
                        }`}
                      >
                        {result.message}
                      </p>
                    )}
                    {result?.duration && <p className="text-xs text-gray-500 mt-1">Duración: {result.duration}ms</p>}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => runIndividualTest(step.id)}
                    disabled={isRunning || currentStep === step.id}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    {currentStep === step.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Logs */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Logs de Ejecución</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={logs.join("\n")}
            readOnly
            className="min-h-[200px] bg-gray-900 border-gray-600 text-gray-300 font-mono text-sm"
            placeholder="Los logs aparecerán aquí durante la ejecución..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
