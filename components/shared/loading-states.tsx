import { Loader2, Sparkles, Zap, Clock, CheckCircle2, Package, CreditCard, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface LoadingStateProps {
  message?: string
  size?: "sm" | "md" | "lg"
  variant?: "spinner" | "dots" | "pulse" | "skeleton"
}

export function LoadingSpinner({ message = "Cargando...", size = "md", variant = "spinner" }: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  if (variant === "skeleton") {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        {message && <span className="text-sm text-gray-600">{message}</span>}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className="flex items-center space-x-3">
        <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse" />
        <span className="text-sm text-gray-600 animate-pulse">{message}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center space-x-3">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500`} />
      {message && <span className="text-sm text-gray-600">{message}</span>}
    </div>
  )
}

export function FullPageLoading({ message = "Cargando página..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{message}</h3>
              <p className="text-sm text-gray-500 mt-1">Por favor espere...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ProcessingPayment() {
  return (
    <div className="flex items-center justify-center space-x-3 p-4">
      <div className="relative">
        <CreditCard className="h-6 w-6 text-blue-500" />
        <div className="absolute -top-1 -right-1">
          <Loader2 className="h-3 w-3 animate-spin text-green-500" />
        </div>
      </div>
      <span className="text-sm font-medium">Procesando pago...</span>
    </div>
  )
}

export function SendingEmail() {
  return (
    <div className="flex items-center justify-center space-x-3 p-4">
      <div className="relative">
        <Mail className="h-6 w-6 text-blue-500" />
        <div className="absolute -top-1 -right-1">
          <Zap className="h-3 w-3 text-yellow-500 animate-pulse" />
        </div>
      </div>
      <span className="text-sm font-medium">Enviando email...</span>
    </div>
  )
}

export function PreparingDownload() {
  return (
    <div className="flex items-center justify-center space-x-3 p-4">
      <div className="relative">
        <Package className="h-6 w-6 text-blue-500" />
        <div className="absolute -top-1 -right-1">
          <Sparkles className="h-3 w-3 text-purple-500 animate-pulse" />
        </div>
      </div>
      <span className="text-sm font-medium">Preparando descarga...</span>
    </div>
  )
}

export function LoadingWithSteps({
  steps,
  currentStep = 0,
}: {
  steps: string[]
  currentStep?: number
}) {
  return (
    <div className="space-y-4 p-6">
      <div className="text-center mb-6">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
        <h3 className="text-lg font-medium">Procesando...</h3>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center space-x-3">
            {index < currentStep ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : index === currentStep ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            ) : (
              <Clock className="h-5 w-5 text-gray-300" />
            )}
            <span className={`text-sm ${index <= currentStep ? "text-gray-900" : "text-gray-500"}`}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TableLoading({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 w-20" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid grid-cols-4 gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardLoading({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={`card-${index}`}>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function FormLoading() {
  return (
    <div className="space-y-4">
      <div>
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-16" />
      </div>
    </div>
  )
}
