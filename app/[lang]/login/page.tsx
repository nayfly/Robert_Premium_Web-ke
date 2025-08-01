"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Mail, AlertCircle, Shield, Briefcase, UserCheck } from "lucide-react"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage({ params }: { params: { lang: string } }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    console.log("Form submitted with:", { email, password: "***" })

    try {
      const result = await login(email, password)
      console.log("Login result:", result)

      if (result.success) {
        toast({
          title: "¡Éxito!",
          description: "Inicio de sesión exitoso",
        })

        // Pequeño delay para que se vea el toast
        setTimeout(() => {
          router.push(`/${params.lang}/dashboard`)
        }, 500)
      } else {
        const errorMessage = result.message || "Error de autenticación"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      const errorMessage = "Error de conexión"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    console.log("Demo login clicked:", { email: demoEmail, password: "***" })

    setEmail(demoEmail)
    setPassword(demoPassword)
    setError("")
    setIsLoading(true)

    try {
      const result = await login(demoEmail, demoPassword)
      console.log("Demo login result:", result)

      if (result.success) {
        toast({
          title: "¡Éxito!",
          description: "Inicio de sesión exitoso",
        })

        setTimeout(() => {
          router.push(`/${params.lang}/dashboard`)
        }, 500)
      } else {
        const errorMessage = result.message || "Error de autenticación"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Demo login error:", error)
      const errorMessage = "Error de conexión"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const demoUsers = [
    {
      email: "admin@robertsoftware.com",
      password: "Admin123!",
      role: "Administrador",
      description: "Acceso completo al sistema",
      icon: Shield,
      color: "text-red-600 bg-red-50 border-red-200 hover:bg-red-100",
    },
    {
      email: "empleado@demo.com",
      password: "Empleado123!",
      role: "Empleado",
      description: "Gestión de proyectos y tareas",
      icon: Briefcase,
      color: "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100",
    },
    {
      email: "cliente@demo.com",
      password: "Cliente123!",
      role: "Cliente",
      description: "Seguimiento de proyectos",
      icon: UserCheck,
      color: "text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Logo className="h-16 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-white">Robert Software</h1>
          <p className="text-gray-300">Plataforma de gestión empresarial</p>
        </div>

        {/* Formulario de Login */}
        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Iniciar Sesión</CardTitle>
            <CardDescription className="text-gray-400">Accede a tu cuenta para continuar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="bg-red-900/20 border-red-800 text-red-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Usuarios Demo */}
        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg text-center text-white">Usuarios Demo</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Haz clic para probar diferentes roles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoUsers.map((user, index) => {
              const IconComponent = user.icon
              return (
                <button
                  key={index}
                  className={`w-full p-3 border border-gray-700 rounded-lg transition-all duration-200 ${user.color} ${
                    isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-[1.02]"
                  }`}
                  onClick={() => !isLoading && handleDemoLogin(user.email, user.password)}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-white/10">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm text-gray-900">{user.role}</p>
                      <p className="text-xs text-gray-600">{user.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-700 font-mono">{user.email}</p>
                      <p className="text-xs text-gray-600 font-mono">{user.password}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm">
          <p>© 2024 Robert Software. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}
