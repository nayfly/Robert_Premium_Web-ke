"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Loader2, CreditCard, Shield, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { PRODUCTS } from "@/lib/stripe"

interface CustomerInfoFormProps {
  productId: string
}

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  address: string
  city: string
  postalCode: string
  country: string
  acceptTerms: boolean
  acceptMarketing: boolean
}

export default function CustomerInfoForm({ productId }: CustomerInfoFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    postalCode: "",
    country: "España",
    acceptTerms: false,
    acceptMarketing: false,
  })

  const product = PRODUCTS[productId as keyof typeof PRODUCTS]

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Producto no encontrado</p>
      </div>
    )
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    const requiredFields = ["name", "email", "phone", "address", "city", "postalCode"]

    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        toast({
          title: "Campo requerido",
          description: `Por favor completa el campo ${field}`,
          variant: "destructive",
        })
        return false
      }
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Términos requeridos",
        description: "Debes aceptar los términos y condiciones",
        variant: "destructive",
      })
      return false
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor introduce un email válido",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      // Crear Payment Intent con información del cliente
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          customerInfo: formData,
        }),
      })

      if (!response.ok) {
        throw new Error("Error creando payment intent")
      }

      const { clientSecret, orderId } = await response.json()

      // Guardar información en sessionStorage para la página de pago
      sessionStorage.setItem(
        "checkout-data",
        JSON.stringify({
          clientSecret,
          orderId,
          customerInfo: formData,
          product,
        }),
      )

      // Redirigir a la página de pago
      router.push("/checkout/payment")
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Hubo un problema procesando tu solicitud. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const savings = product.originalPrice - product.price
  const discountPercentage = Math.round((savings / product.originalPrice) * 100)

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Finalizar Compra</h1>
          <p className="text-gray-400">Completa tus datos para proceder al pago</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Información de Facturación</CardTitle>
              <CardDescription className="text-gray-400">
                Todos los campos marcados con * son obligatorios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">
                      Nombre completo *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Juan Pérez"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-300">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="juan@empresa.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-gray-300">
                      Teléfono *
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="+34 600 123 456"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-gray-300">
                      Empresa
                    </Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Mi Empresa S.L."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-gray-300">
                    Dirección *
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Calle Principal 123"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-gray-300">
                      Ciudad *
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Madrid"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="text-gray-300">
                      Código Postal *
                    </Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="28001"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-gray-300">
                      País *
                    </Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-700">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                      className="border-gray-600"
                    />
                    <Label htmlFor="acceptTerms" className="text-sm text-gray-300 leading-relaxed">
                      Acepto los{" "}
                      <a
                        href="/legal/terminos"
                        target="_blank"
                        className="text-blue-400 hover:underline"
                        rel="noreferrer"
                      >
                        términos y condiciones
                      </a>{" "}
                      y la{" "}
                      <a
                        href="/legal/privacidad"
                        target="_blank"
                        className="text-blue-400 hover:underline"
                        rel="noreferrer"
                      >
                        política de privacidad
                      </a>{" "}
                      *
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptMarketing"
                      checked={formData.acceptMarketing}
                      onCheckedChange={(checked) => handleInputChange("acceptMarketing", checked as boolean)}
                      className="border-gray-600"
                    />
                    <Label htmlFor="acceptMarketing" className="text-sm text-gray-300 leading-relaxed">
                      Acepto recibir comunicaciones comerciales y ofertas especiales
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Proceder al Pago
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Resumen del Pedido */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-semibold">{product.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">{product.description}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-700">
                  <div className="flex justify-between text-gray-300">
                    <span>Precio original</span>
                    <span className="line-through">€{product.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span>Descuento ({discountPercentage}%)</span>
                    <span>-€{savings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>€{product.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>IVA (21%)</span>
                    <span>€{Math.round(product.price * 0.21).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white font-semibold text-lg pt-2 border-t border-gray-700">
                    <span>Total</span>
                    <span>€{Math.round(product.price * 1.21).toLocaleString()}</span>
                  </div>
                </div>

                <Badge className="w-full justify-center bg-green-500/20 text-green-400 border-green-500/30 py-2">
                  ¡Ahorras €{savings.toLocaleString()}!
                </Badge>
              </CardContent>
            </Card>

            {/* Garantías */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300 text-sm">Garantía de devolución 30 días</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300 text-sm">Pago 100% seguro con Stripe</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-300 text-sm">Soporte técnico incluido</span>
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
