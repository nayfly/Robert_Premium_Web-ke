"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Copy, Shield, Briefcase, UserCheck, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface DemoUser {
  email: string
  password: string
  name: string
  role: string
  color: string
  icon: React.ReactNode
  description: string
}

const DEMO_USERS: DemoUser[] = [
  {
    email: "admin@robertsoftware.com",
    password: "Admin123!",
    name: "Administrador",
    role: "admin",
    color: "bg-red-500 hover:bg-red-600",
    icon: <Shield className="w-5 h-5" />,
    description: "Acceso completo al sistema",
  },
  {
    email: "empleado@demo.com",
    password: "Empleado123!",
    name: "Empleado",
    role: "empleado",
    color: "bg-blue-500 hover:bg-blue-600",
    icon: <Briefcase className="w-5 h-5" />,
    description: "Gestión de proyectos y clientes",
  },
  {
    email: "cliente@demo.com",
    password: "Cliente123!",
    name: "Cliente",
    role: "cliente",
    color: "bg-purple-500 hover:bg-purple-600",
    icon: <UserCheck className="w-5 h-5" />,
    description: "Vista de proyectos y reportes",
  },
]

export default function DemoLoginButtons() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [copiedUser, setCopiedUser] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`¡Bienvenido ${data.user.name}!`)

        // Redirigir según el rol después de un breve delay
        setTimeout(() => {
          switch (data.user.role) {
            case "admin":
              router.push("/dashboard/admin")
              break
            case "empleado":
              router.push("/dashboard/empleado")
              break
            case "cliente":
              router.push("/dashboard/cliente")
              break
            default:
              router.push("/dashboard")
          }
        }, 1500)
      } else {
        setError(data.error || "Error de autenticación")
        if (data.remainingAttempts !== undefined) {
          setError(`${data.error} (${data.remainingAttempts} intentos restantes)`)
        }
      }
    } catch (error) {
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const fillCredentials = (user: DemoUser) => {
    setEmail(user.email)
    setPassword(user.password)
    setError("")
    setSuccess("")
  }

  const copyCredentials = async (user: DemoUser) => {
    const credentials = `Email: ${user.email}\nPassword: ${user.password}`
    try {
      await navigator.clipboard.writeText(credentials)
      setCopiedUser(user.email)
      setTimeout(() => setCopiedUser(null), 2000)
    } catch (error) {
      console.error("Error al copiar:", error)
    }
  }

  const quickLogin = async (user: DemoUser) => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email, password: user.password }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`¡Bienvenido ${data.user.name}!`)

        setTimeout(() => {
          switch (data.user.role) {
            case "admin":
              router.push("/dashboard/admin")
              break
            case "empleado":
              router.push("/dashboard/empleado")
              break
            case "cliente":
              router.push("/dashboard/cliente")
              break
            default:
              router.push("/dashboard")
          }
        }, 1500)
      } else {
        setError(data.error || "Error de autenticación")
      }
    } catch (error) {
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">🚀 Acceso Demo</h2>
        <p className="text-gray-600">Prueba el sistema con diferentes tipos de usuario</p>
      </div>

      {/* Usuarios Demo - Acceso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEMO_USERS.map((user) => (
          <Card key={user.email} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-full text-white ${user.color}`}>{user.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription className="text-sm">{user.description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Email:</span>
                  <div className="font-mono text-xs bg-gray-50 p-2 rounded border mt-1">{user.email}</div>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Password:</span>
                  <div className="font-mono text-xs bg-gray-50 p-2 rounded border mt-1">
                    {showPassword ? user.password : "••••••••"}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => quickLogin(user)}
                  className={`flex-1 text-white ${user.color}`}
                  size="sm"
                  disabled={loading}
                >
                  {loading ? "Conectando..." : "Acceso Rápido"}
                </Button>
                <Button
                  onClick={() => fillCredentials(user)}
                  variant="outline"
                  size="sm"
                  className="px-3"
                  disabled={loading}
                >
                  Llenar
                </Button>
                <Button
                  onClick={() => copyCredentials(user)}
                  variant="outline"
                  size="sm"
                  className="px-3"
                  disabled={loading}
                >
                  {copiedUser === user.email ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toggle para mostrar contraseñas */}
      <div className="flex justify-center">
        <Button variant="outline" size="sm" onClick={() => setShowPassword(!showPassword)} className="text-xs">
          {showPassword ? (
            <>
              <EyeOff className="h-3 w-3 mr-1" />
              Ocultar contraseñas
            </>
          ) : (
            <>
              <Eye className="h-3 w-3 mr-1" />
              Mostrar contraseñas
            </>
          )}
        </Button>
      </div>

      {/* Formulario de Login Manual */}
      <Card>
        <CardHeader>
          <CardTitle>Iniciar Sesión Manual</CardTitle>
          <CardDescription>O ingresa las credenciales manualmente</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@robertsoftware.com"
                required
                disabled={loading}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin123!"
                  required
                  disabled={loading}
                  className="font-mono pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading || !email || !password}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Información del Sistema */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">ℹ️ Información del Sistema Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">🔒 Seguridad:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Rate limiting: 5 intentos por IP/15 min</li>
                <li>• Tokens JWT con expiración de 24h</li>
                <li>• Cookies httpOnly seguras</li>
                <li>• Validación de inputs exhaustiva</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📊 Funcionalidades:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Dashboards específicos por rol</li>
                <li>• Sistema de auditoría completo</li>
                <li>• Gestión de solicitudes de acceso</li>
                <li>• Logs de actividad en tiempo real</li>
              </ul>
            </div>
          </div>
          <div className="pt-2 border-t border-blue-300">
            <p className="text-xs">
              <strong>Nota:</strong> Este es un entorno de demostración. Los datos se resetean periódicamente y todas
              las acciones quedan registradas en los logs de auditoría.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
