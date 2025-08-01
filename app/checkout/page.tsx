"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { PRODUCTS } from "@/lib/stripe"
import CustomerInfoForm from "@/components/customer-info-form"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const productId = searchParams.get("product")
  const [clientSecret, setClientSecret] = useState<string>("")
  const [orderId, setOrderId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (!productId || !PRODUCTS[productId as keyof typeof PRODUCTS]) {
      setError("Producto no válido")
      setLoading(false)
      return
    }

    // Crear Payment Intent
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            customerInfo: {
              email: "cliente@example.com", // En producción, obtener del formulario
              name: "Cliente Ejemplo",
              address: "Calle Ejemplo 123",
              city: "Madrid",
              postalCode: "28001",
              country: "ES",
            },
          }),
        })

        const data = await response.json()

        if (data.error) {
          setError(data.error)
        } else {
          setClientSecret(data.clientSecret)
          setOrderId(data.orderId)
        }
      } catch (err) {
        setError("Error creando el pago")
      } finally {
        setLoading(false)
      }
    }

    createPaymentIntent()
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <CustomerInfoForm productId={productId} />
    </div>
  )
}
