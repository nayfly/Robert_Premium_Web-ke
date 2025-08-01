"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error capturado por ErrorBoundary:", error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })

    // Reportar error a servicio de monitoreo
    this.reportError(error, errorInfo)
  }

  private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    try {
      // Enviar error a servicio de logging
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }

      fetch("/api/errors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(errorData),
      }).catch((err) => {
        console.error("Error enviando reporte de error:", err)
      })
    } catch (reportingError) {
      console.error("Error en reporte de errores:", reportingError)
    }
  }

  private resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props

      if (Fallback && this.state.error) {
        return <Fallback error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-red-600">Algo salió mal</CardTitle>
              <CardDescription>Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="bg-red-50 p-3 rounded-md">
                  <details className="text-sm">
                    <summary className="cursor-pointer font-medium text-red-800">Detalles del Error (Dev)</summary>
                    <div className="mt-2 space-y-2">
                      <div>
                        <strong>Mensaje:</strong>
                        <p className="text-red-700">{this.state.error.message}</p>
                      </div>
                      {this.state.error.stack && (
                        <div>
                          <strong>Stack:</strong>
                          <pre className="text-xs text-red-700 overflow-auto max-h-32">{this.state.error.stack}</pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Button onClick={this.resetError} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Intentar de nuevo
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full">
                  Ir al inicio
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Si el problema persiste, contacta a{" "}
                  <a href="mailto:soporte@robertsoftware.com" className="text-blue-600 hover:underline">
                    soporte@robertsoftware.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook para usar en componentes funcionales
export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    console.error("Error manejado:", error, errorInfo)

    // Reportar error
    try {
      fetch("/api/errors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          ...errorInfo,
        }),
      }).catch((err) => {
        console.error("Error enviando reporte:", err)
      })
    } catch (reportingError) {
      console.error("Error en reporte:", reportingError)
    }
  }
}

// Componente de error personalizado para páginas específicas
interface CustomErrorProps {
  error: Error
  resetError: () => void
  title?: string
  description?: string
}

export function CustomError({
  error,
  resetError,
  title = "Error en la aplicación",
  description = "Ha ocurrido un error inesperado",
}: CustomErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-red-600">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={resetError} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
