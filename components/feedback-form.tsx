"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MessageSquare, Send } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/components/ui/use-toast"

interface FeedbackFormProps {
  projectId?: string
  onSuccess?: () => void
}

export function FeedbackForm({ projectId, onSuccess }: FeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [category, setCategory] = useState<"service" | "communication" | "results" | "overall">("overall")
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  const handleSubmit = async () => {
    if (!user || rating === 0) {
      toast({
        title: "Error",
        description: "Por favor selecciona una calificación",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const feedbackData = {
        user_id: user.id,
        project_id: projectId || null,
        rating,
        comment: comment.trim() || null,
        category,
        is_public: isPublic,
      }

      const { data, error } = await supabase.from("feedback").insert(feedbackData).select().single()

      if (error) {
        throw error
      }

      // Crear notificación para los administradores
      const { data: admins } = await supabase.from("users").select("id").eq("role", "admin")

      if (admins && admins.length > 0) {
        const notifications = admins.map((admin) => ({
          user_id: admin.id,
          title: "Nuevo Feedback Recibido",
          message: `Se ha recibido una nueva valoración de ${rating} estrellas`,
          type: "info" as const,
        }))

        await supabase.from("notifications").insert(notifications)
      }

      toast({
        title: "¡Gracias por tu feedback!",
        description: "Tu valoración ha sido enviada correctamente",
      })

      // Reset form
      setRating(0)
      setHoveredRating(0)
      setComment("")
      setCategory("overall")
      setIsPublic(false)

      onSuccess?.()
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Error",
        description: "No se pudo enviar el feedback",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const StarRating = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="p-1 transition-colors"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hoveredRating || rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-400 hover:text-yellow-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-gray-300">
          {rating > 0 && (
            <>
              {rating} de 5 estrella{rating !== 1 ? "s" : ""}
            </>
          )}
        </span>
      </div>
    )
  }

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "service":
        return "Calidad del Servicio"
      case "communication":
        return "Comunicación"
      case "results":
        return "Resultados Obtenidos"
      case "overall":
        return "Valoración General"
      default:
        return cat
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Enviar Feedback
        </CardTitle>
        <CardDescription className="text-gray-400">Tu opinión nos ayuda a mejorar nuestros servicios</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calificación */}
        <div>
          <Label className="text-white text-lg mb-3 block">¿Cómo calificarías tu experiencia? *</Label>
          <StarRating />
        </div>

        {/* Categoría */}
        <div>
          <Label className="text-white">Categoría de Feedback</Label>
          <Select value={category} onValueChange={(value: any) => setCategory(value)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="overall">Valoración General</SelectItem>
              <SelectItem value="service">Calidad del Servicio</SelectItem>
              <SelectItem value="communication">Comunicación</SelectItem>
              <SelectItem value="results">Resultados Obtenidos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Comentario */}
        <div>
          <Label className="text-white">Comentarios adicionales</Label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Cuéntanos más sobre tu experiencia..."
            className="bg-gray-700 border-gray-600 text-white"
            rows={4}
          />
        </div>

        {/* Público */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
          />
          <Label htmlFor="isPublic" className="text-gray-300 text-sm">
            Permitir que este feedback sea público (se mostrará en testimonios)
          </Label>
        </div>

        {/* Información adicional */}
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-2">Resumen del Feedback</h4>
          <div className="space-y-1 text-sm text-gray-300">
            <p>
              <strong>Calificación:</strong> {rating > 0 ? `${rating}/5 estrellas` : "No seleccionada"}
            </p>
            <p>
              <strong>Categoría:</strong> {getCategoryLabel(category)}
            </p>
            <p>
              <strong>Visibilidad:</strong> {isPublic ? "Público" : "Privado"}
            </p>
            {projectId && (
              <p>
                <strong>Proyecto:</strong> Asociado
              </p>
            )}
          </div>
        </div>

        {/* Botón de envío */}
        <Button
          onClick={handleSubmit}
          disabled={loading || rating === 0}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Send className="w-4 h-4 mr-2" />
          {loading ? "Enviando..." : "Enviar Feedback"}
        </Button>
      </CardContent>
    </Card>
  )
}
