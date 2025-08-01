"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Mail,
  Building,
  Phone,
  MessageSquare,
  CheckCircle,
  Loader2,
  Shield,
  Clock,
  UserCheck,
} from "lucide-react"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  position: string
  access_type: "cliente" | "empleado" | ""
  description: string
  acceptTerms: boolean
  acceptPrivacy: boolean
}

interface FormErrors {
  [key: string]: string
}

export default function RegistroPage({ params }: { params: { lang: string } }) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    access_type: "",
    description: "",
    acceptTerms: false,
    acceptPrivacy: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const { toast } = useToast()
  const router = useRouter()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validaciones básicas
    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es obligatorio"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Los apellidos son obligatorios"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El formato del email no es válido"
    }

    if (!formData.company.trim()) {
      newErrors.company = "La empresa es obligatoria"
    }

    if (!formData.access_type) {
      newErrors.access_type = "Selecciona el tipo de acceso"
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Debes aceptar los términos y condiciones"
    }

    if (!formData.acceptPrivacy) {
      newErrors.acceptPrivacy = "Debes aceptar la política de privacidad"
    }

    // Validaciones específicas
    if (formData.phone && !/^[+]?[\d\s\-$$$$]{9,}$/.test(formData.phone)) {
      newErrors.phone = "El formato del teléfono no es válido"
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "La descripción no puede superar los 500 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Errores en el formulario",
        description: "Por favor, corrige los errores antes de continuar",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/user-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company,
          position: formData.position || null,
          access_type: formData.access_type,
          description: formData.description || null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al enviar la solicitud")
      }

      setIsSubmitted(true)
      setSubmitMessage(result.message || "Solicitud enviada correctamente")

      toast({
        title: "¡Solicitud Enviada!",
        description: "Te contactaremos en las próximas 24-48 horas",
      })

      // Limpiar formulario
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        access_type: "",
        description: "",
        acceptTerms: false,
        acceptPrivacy: false,
      })
    } catch (error) {
      console.error("Error submitting form:", error)

      const errorMessage = error instanceof Error ? error.message : "Error desconocido"

      toast({
        title: "Error al enviar solicitud",
        description: errorMessage,
        variant: "destructive",
      })

      // Si es un error de duplicado, mostrar mensaje específico
      if (errorMessage.includes("solicitud pendiente") || errorMessage.includes("cuenta en nuestro sistema")) {
        setErrors({ email: errorMessage })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Solicitud Enviada!</h1>
              <p className="text-gray-600 text-lg">{submitMessage}</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">¿Qué sucede ahora?</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <span className="text-blue-800">Revisamos tu solicitud (24-48 horas)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <span className="text-blue-800">Te contactamos para confirmar detalles</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <span className="text-blue-800">Creamos tu cuenta personalizada</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <span className="text-blue-800">¡Comenzamos a trabajar juntos!</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.push(`/${params.lang}`)} className="bg-blue-600 hover:bg-blue-700">
                Volver al Inicio
              </Button>
              <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                Enviar Otra Solicitud
              </Button>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p>¿Tienes preguntas? Contacta con nosotros:</p>
              <p className="font-medium">📧 hola@robertsoftware.com | 📞 +34 600 000 000</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Solicitar Acceso</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Únete a Robert Software y transforma tu negocio con automatización inteligente
          </p>
        </div>

        {/* Beneficios */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Respuesta Rápida</h3>
              <p className="text-sm text-gray-600">Te contactamos en 24-48 horas</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Proceso Seguro</h3>
              <p className="text-sm text-gray-600">Tus datos están protegidos</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <UserCheck className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Acceso Personalizado</h3>
              <p className="text-sm text-gray-600">Dashboard adaptado a tu rol</p>
            </CardContent>
          </Card>
        </div>

        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Información de Solicitud</CardTitle>
            <CardDescription>Completa el formulario para solicitar acceso a nuestra plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Personal
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={errors.firstName ? "border-red-500" : ""}
                      placeholder="Tu nombre"
                    />
                    {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Apellidos *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={errors.lastName ? "border-red-500" : ""}
                      placeholder="Tus apellidos"
                    />
                    {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                        placeholder="tu@email.com"
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                        placeholder="+34 600 000 000"
                      />
                    </div>
                    {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Información Profesional */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Información Profesional
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Empresa *</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        className={`pl-10 ${errors.company ? "border-red-500" : ""}`}
                        placeholder="Nombre de tu empresa"
                      />
                    </div>
                    {errors.company && <p className="text-sm text-red-600 mt-1">{errors.company}</p>}
                  </div>

                  <div>
                    <Label htmlFor="position">Cargo</Label>
                    <Input
                      id="position"
                      type="text"
                      value={formData.position}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                      placeholder="Tu cargo en la empresa"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="access_type">Tipo de Acceso *</Label>
                  <Select
                    value={formData.access_type}
                    onValueChange={(value) => handleInputChange("access_type", value)}
                  >
                    <SelectTrigger className={errors.access_type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecciona el tipo de acceso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cliente">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          <div>
                            <div className="font-medium">Cliente</div>
                            <div className="text-sm text-gray-600">Necesito servicios de automatización</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="empleado">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <div>
                            <div className="font-medium">Empleado/Colaborador</div>
                            <div className="text-sm text-gray-600">Quiero trabajar con Robert Software</div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.access_type && <p className="text-sm text-red-600 mt-1">{errors.access_type}</p>}
                </div>
              </div>

              {/* Información Adicional */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Información Adicional
                </h3>

                <div>
                  <Label htmlFor="description">
                    Cuéntanos más sobre tu proyecto o interés
                    <span className="text-sm text-gray-500 ml-2">({formData.description.length}/500 caracteres)</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className={errors.description ? "border-red-500" : ""}
                    placeholder="Describe tu proyecto, necesidades específicas, o por qué te interesa colaborar con nosotros..."
                    rows={4}
                    maxLength={500}
                  />
                  {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                </div>
              </div>

              {/* Términos y Condiciones */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                    className={errors.acceptTerms ? "border-red-500" : ""}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="acceptTerms" className="text-sm font-normal">
                      Acepto los{" "}
                      <a
                        href={`/${params.lang}/legal/terminos`}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        términos y condiciones
                      </a>{" "}
                      de Robert Software *
                    </Label>
                    {errors.acceptTerms && <p className="text-sm text-red-600">{errors.acceptTerms}</p>}
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptPrivacy"
                    checked={formData.acceptPrivacy}
                    onCheckedChange={(checked) => handleInputChange("acceptPrivacy", checked as boolean)}
                    className={errors.acceptPrivacy ? "border-red-500" : ""}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="acceptPrivacy" className="text-sm font-normal">
                      Acepto la{" "}
                      <a
                        href={`/${params.lang}/legal/privacidad`}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        política de privacidad
                      </a>{" "}
                      y el tratamiento de mis datos *
                    </Label>
                    {errors.acceptPrivacy && <p className="text-sm text-red-600">{errors.acceptPrivacy}</p>}
                  </div>
                </div>
              </div>

              {/* Información de seguridad */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tu privacidad es importante:</strong> Tus datos están protegidos y solo se utilizarán para
                  procesar tu solicitud. No compartimos información personal con terceros.
                </AlertDescription>
              </Alert>

              {/* Botón de envío */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando Solicitud...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Enviar Solicitud
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/${params.lang}`)}
                  className="flex-1 sm:flex-none"
                >
                  Cancelar
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>Al enviar esta solicitud, nuestro equipo la revisará y te contactará en un plazo de 24-48 horas.</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
