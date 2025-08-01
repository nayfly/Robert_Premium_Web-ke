"use client"

import type React from "react"
import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, CheckCircle, Clock, Headphones, CreditCard, AlertCircle, ArrowLeft } from "lucide-react"
import { PRODUCTS } from "@/lib/stripe"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface CheckoutFormProps {
  productId: keyof typeof PRODUCTS
  clientSecret: string
  orderId: string
}

export function CheckoutForm({ productId, clientSecret, orderId }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentProgress, setPaymentProgress] = useState(0)

  const product = PRODUCTS[productId]
  const taxAmount = Math.round(product.price * 0.21)
  const totalAmount = product.price + taxAmount

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      setError("Stripe no está disponible. Por favor, recarga la página.")
      return
    }

    setIsLoading(true)
    setError(null)
    setPaymentProgress(20)

    try {
      // Validar elementos del formulario
      const { error: submitError } = await elements.submit()
      if (submitError) {
        throw new Error(submitError.message || "Error validando los datos de pago")
      }

      setPaymentProgress(50)

      // Confirmar el pago
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?order_id=${orderId}`,
        },
        redirect: "if_required",
      })

      setPaymentProgress(80)

      if (confirmError) {
        throw new Error(confirmError.message || "Error procesando el pago")
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        setPaymentProgress(100)
        toast({
          title: "¡Pago exitoso!",
          description: "Tu compra ha sido procesada correctamente",
        })

        // Redirigir a la página de éxito
        window.location.href = `/checkout/success?order_id=${orderId}&payment_intent=${paymentIntent.id}`
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido procesando el pago"
      setError(errorMessage)
      setPaymentProgress(0)

      toast({
        title: "Error en el pago",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/checkout?product=${productId}`}>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Pago Seguro</h1>
            <p className="text-xl text-gray-400">Completa tu compra de forma segura</p>
          </div>
        </div>

        {/* Progreso del pago */}
        {isLoading && (
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Procesando pago...</span>
                    <span>{paymentProgress}%</span>
                  </div>
                  <Progress value={paymentProgress} className="h-2" />
                </div>
                <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de Pago */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  Información de Pago
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Procesado por Stripe - Tus datos están completamente protegidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <PaymentElement
                    options={{
                      layout: "tabs",
                      defaultValues: {
                        billingDetails: {
                          name: "",
                          email: "",
                        },
                      },
                    }}
                  />

                  {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-medium">Error en el pago</p>
                        <p className="text-red-300 text-sm mt-1">{error}</p>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={!stripe || isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Procesando pago...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Pagar €{totalAmount.toLocaleString()} ahora
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-gray-400 text-center">
                    Al hacer clic en "Pagar", aceptas nuestros{" "}
                    <Link href="/legal/terminos" className="text-blue-400 hover:underline">
                      términos de servicio
                    </Link>{" "}
                    y confirmas que has leído nuestra{" "}
                    <Link href="/legal/privacidad" className="text-blue-400 hover:underline">
                      política de privacidad
                    </Link>
                    .
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Garantías de Seguridad */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <h3 className="text-white font-semibold mb-4">Tu compra está protegida</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-300">Cifrado SSL 256-bit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-300">Garantía 30 días</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-300">Soporte 24/7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-300">Acceso inmediato</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen del Pedido */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Resumen del Pedido</CardTitle>
                <CardDescription className="text-gray-400">Orden #{orderId.slice(-8).toUpperCase()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{product.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">{product.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-2xl font-bold text-white">€{product.price.toLocaleString()}</span>
                      <span className="text-lg text-gray-400 line-through">
                        €{product.originalPrice.toLocaleString()}
                      </span>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>€{product.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>IVA (21%)</span>
                    <span>€{taxAmount.toLocaleString()}</span>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex justify-between text-white font-semibold text-lg">
                    <span>Total a pagar</span>
                    <span>€{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Características Incluidas */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Incluido en tu compra</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Urgencia */}
            <Card className="bg-gradient-to-r from-orange-900/50 to-red-900/50 border-orange-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-orange-400" />
                  <div>
                    <p className="text-white font-semibold">Oferta por Tiempo Limitado</p>
                    <p className="text-orange-200 text-sm">Solo quedan 3 licencias a este precio especial</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
