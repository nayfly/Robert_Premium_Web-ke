"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface OrderDetails {
  id: string
  status: string
  amount: number
  currency: string
  productName: string
  customerEmail: string
  downloadUrl?: string
  invoiceUrl?: string
  createdAt: string
}

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const paymentIntentId = searchParams.get("payment_intent")

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!paymentIntentId) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/orders/${paymentIntentId}`)
        if (response.ok) {
          const data = await response.json()
          setOrderDetails(data)
        } else {
          console.error("Error obteniendo detalles del pedido")
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [paymentIntentId])

  const handleDownload = async () => {
    if (!orderDetails?.downloadUrl) {
      toast({
        title: "Error",
        description: "URL de descarga no disponible",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(orderDetails.downloadUrl)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `${orderDetails.productName}.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)

        toast({
          title: "Descarga iniciada",
          description: "Su producto se está descargando",
        })
      }
    } catch (error) {
      console.error("Error en descarga:", error)
      toast({
        title: "Error",
        description: "Error al iniciar la descarga",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!paymentIntentId || !orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-medium mb-2">Pedido no encontrado</p>
            <p className="text-gray-600 mb-4">No se pudieron cargar los detalles de su pedido.</p>
            <Link href="/">
              <Button>Volver al Inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pago Completado!</h1>
          <p className="text-gray-600">Su compra ha sido procesada exitosamente</p>
        </div>

        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Detalles del Pedido</CardTitle>
            <CardDescription>Información de su compra y opciones de descarga</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">ID del Pedido</label>
                <p className="font-mono text-sm">{orderDetails.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Estado</label>
                <div>
                  <Badge variant="default" className="bg-green-500">
                    Completado
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Producto</label>
                <p className="font-medium">{orderDetails.productName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total</label>
                <p className="text-lg font-bold">
                  {orderDetails.currency.toUpperCase()} {(orderDetails.amount / 100).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="text-sm font-medium text-gray-500">Email de confirmación</label>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                {orderDetails.customerEmail}
              </p>
              <p className="text-sm text-gray-500 mt-1">Hemos enviado los detalles de su pedido a esta dirección</p>
            </div>

            {orderDetails.downloadUrl && (
              <div className="border-t pt-4">
                <Button onClick={handleDownload} className="w-full mb-3">
                  <Download className="mr-2 h-4 w-4" />
                  Descargar Producto
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  Su producto estará disponible para descarga durante 30 días
                </p>
              </div>
            )}

            {orderDetails.invoiceUrl && (
              <div className="border-t pt-4">
                <Link href={orderDetails.invoiceUrl} target="_blank">
                  <Button variant="outline" className="w-full bg-transparent">
                    Ver Factura
                  </Button>
                </Link>
              </div>
            )}

            <div className="border-t pt-4 text-center">
              <p className="text-sm text-gray-600 mb-4">¿Necesita ayuda? Contáctenos a soporte@robertsoftware.com</p>
              <Link href="/">
                <Button variant="outline">Volver al Inicio</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  )
}
