"use client"

import type React from "react"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  amount: number
  productName: string
  customerEmail: string
}

function PaymentForm({ amount, productName, customerEmail }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState("")

  useEffect(() => {
    // Crear payment intent cuando se monta el componente
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            metadata: {
              productName,
              customerEmail,
            },
          }),
        })

        const data = await response.json()

        if (response.ok) {
          setClientSecret(data.clientSecret)
        } else {
          throw new Error(data.error)
        }
      } catch (error) {
        console.error("Error creando payment intent:", error)
        toast({
          title: "Error",
          description: "Error preparando el pago",
          variant: "destructive",
        })
      }
    }

    if (amount > 0) {
      createPaymentIntent()
    }
  }, [amount, productName, customerEmail, toast])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsProcessing(true)

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setIsProcessing(false)
      return
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: customerEmail,
          },
        },
      })

      if (error) {
        console.error("Error en el pago:", error)
        toast({
          title: "Error en el pago",
          description: error.message,
          variant: "destructive",
        })
      } else if (paymentIntent.status === "succeeded") {
        toast({
          title: "¡Pago exitoso!",
          description: "Tu pago ha sido procesado correctamente",
        })

        // Redirigir a página de éxito
        router.push(`/checkout/success?payment_intent=${paymentIntent.id}`)
      }
    } catch (error) {
      console.error("Error procesando pago:", error)
      toast({
        title: "Error",
        description: "Error procesando el pago",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Información de Pago
        </CardTitle>
        <CardDescription>Complete los datos de su tarjeta para finalizar la compra</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Datos de la Tarjeta</label>
            <div className="p-3 border rounded-md">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Producto:</span>
              <span className="font-medium">{productName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total:</span>
              <span className="text-lg font-bold">€{amount.toFixed(2)}</span>
            </div>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Sus datos están protegidos con encriptación SSL y son procesados de forma segura por Stripe.
            </AlertDescription>
          </Alert>

          <Button type="submit" className="w-full" disabled={!stripe || isProcessing || !clientSecret}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              `Pagar €${amount.toFixed(2)}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function PaymentPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const amount = Number.parseFloat(searchParams.get("amount") || "0")
  const productName = searchParams.get("product") || "Producto"
  const customerEmail = searchParams.get("email") || ""

  useEffect(() => {
    if (!amount || amount <= 0) {
      router.push("/checkout")
    }
  }, [amount, router])

  if (!amount || amount <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Error en los datos de pago</p>
              <p className="text-gray-600 mb-4">No se encontraron datos válidos para procesar el pago.</p>
              <Button onClick={() => router.push("/checkout")}>Volver al Checkout</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Compra</h1>
          <p className="text-gray-600">Complete su pago de forma segura</p>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm amount={amount} productName={productName} customerEmail={customerEmail} />
        </Elements>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  )
}
