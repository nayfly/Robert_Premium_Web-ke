"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Send, Settings, CheckCircle, XCircle, AlertTriangle, Eye, RefreshCw } from "lucide-react"

interface EmailConfig {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPass: string
  fromName: string
  replyTo: string
}

interface EmailTest {
  id: string
  type: string
  recipient: string
  subject: string
  status: "pending" | "sent" | "failed"
  sentAt?: string
  error?: string
}

export default function EmailConfigDashboard() {
  const [config, setConfig] = useState<EmailConfig>({
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "",
    smtpPass: "",
    fromName: "Robert Software",
    replyTo: "hola@robertsoftware.com",
  })

  const [testEmail, setTestEmail] = useState("")
  const [testSubject, setTestSubject] = useState("Email de prueba - Robert Software")
  const [testMessage, setTestMessage] = useState("Este es un email de prueba del sistema.")
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "connected" | "error">("unknown")
  const [recentTests, setRecentTests] = useState<EmailTest[]>([])

  // Verificar configuración al cargar
  useEffect(() => {
    checkEmailConfig()
    loadRecentTests()
  }, [])

  const checkEmailConfig = async () => {
    try {
      const response = await fetch("/api/test/email-config")
      const data = await response.json()
      setConnectionStatus(data.success ? "connected" : "error")
    } catch (error) {
      setConnectionStatus("error")
    }
  }

  const loadRecentTests = async () => {
    try {
      const response = await fetch("/api/admin/email-tests")
      if (response.ok) {
        const data = await response.json()
        setRecentTests(data.tests || [])
      }
    } catch (error) {
      console.error("Error loading recent tests:", error)
    }
  }

  const saveConfig = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/email-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        setConnectionStatus("connected")
        alert("Configuración guardada correctamente")
      } else {
        throw new Error("Error al guardar configuración")
      }
    } catch (error) {
      alert("Error al guardar la configuración")
      setConnectionStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestEmail = async () => {
    if (!testEmail) {
      alert("Por favor, introduce un email de destino")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/test/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: testEmail,
          subject: testSubject,
          message: testMessage,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert("Email de prueba enviado correctamente")
        loadRecentTests() // Recargar tests recientes
      } else {
        throw new Error(data.error || "Error enviando email")
      }
    } catch (error) {
      alert(`Error enviando email: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <Badge variant="default" className="bg-green-500">
            Enviado
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Fallido</Badge>
      default:
        return <Badge variant="secondary">Pendiente</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Configuración de Email
              </CardTitle>
              <CardDescription>Gestiona la configuración SMTP y prueba el envío de emails</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(connectionStatus)}
              <span className="text-sm font-medium">
                {connectionStatus === "connected"
                  ? "Conectado"
                  : connectionStatus === "error"
                    ? "Error"
                    : "Desconocido"}
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="config" className="space-y-4">
        <TabsList>
          <TabsTrigger value="config">Configuración</TabsTrigger>
          <TabsTrigger value="test">Pruebas</TabsTrigger>
          <TabsTrigger value="logs">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Configuración SMTP</CardTitle>
              <CardDescription>Configura los parámetros de conexión para el servidor de email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">Servidor SMTP</Label>
                  <Input
                    id="smtpHost"
                    value={config.smtpHost}
                    onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Puerto</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={config.smtpPort}
                    onChange={(e) => setConfig({ ...config, smtpPort: Number.parseInt(e.target.value) })}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">Usuario SMTP</Label>
                  <Input
                    id="smtpUser"
                    value={config.smtpUser}
                    onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })}
                    placeholder="tu-email@gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPass">Contraseña</Label>
                  <Input
                    id="smtpPass"
                    type="password"
                    value={config.smtpPass}
                    onChange={(e) => setConfig({ ...config, smtpPass: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromName">Nombre del remitente</Label>
                  <Input
                    id="fromName"
                    value={config.fromName}
                    onChange={(e) => setConfig({ ...config, fromName: e.target.value })}
                    placeholder="Robert Software"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="replyTo">Email de respuesta</Label>
                  <Input
                    id="replyTo"
                    value={config.replyTo}
                    onChange={(e) => setConfig({ ...config, replyTo: e.target.value })}
                    placeholder="hola@robertsoftware.com"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveConfig} disabled={isLoading}>
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Settings className="w-4 h-4 mr-2" />
                  )}
                  Guardar Configuración
                </Button>
                <Button variant="outline" onClick={checkEmailConfig}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Verificar Conexión
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Enviar Email de Prueba</CardTitle>
              <CardDescription>Prueba la configuración enviando un email de prueba</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testEmail">Email de destino</Label>
                <Input
                  id="testEmail"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="testSubject">Asunto</Label>
                <Input id="testSubject" value={testSubject} onChange={(e) => setTestSubject(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="testMessage">Mensaje</Label>
                <Textarea
                  id="testMessage"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <Button onClick={sendTestEmail} disabled={isLoading || !testEmail}>
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Enviar Email de Prueba
              </Button>

              {connectionStatus === "error" && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    La configuración SMTP no está funcionando correctamente. Verifica los parámetros de conexión.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Emails</CardTitle>
              <CardDescription>Últimos emails enviados desde el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No hay emails recientes</p>
                  </div>
                ) : (
                  recentTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{test.subject}</span>
                          {getStatusBadge(test.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Para: {test.recipient} •{" "}
                          {test.sentAt ? new Date(test.sentAt).toLocaleString("es-ES") : "Pendiente"}
                        </div>
                        {test.error && <div className="text-sm text-red-600 mt-1">Error: {test.error}</div>}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Export nombrado para compatibilidad
export { EmailConfigDashboard }
