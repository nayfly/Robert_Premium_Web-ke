"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Calculator, Send } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/components/ui/use-toast"

interface BudgetItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface BudgetFormProps {
  clientId?: string
  onSuccess?: () => void
}

export function BudgetForm({ clientId, onSuccess }: BudgetFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [items, setItems] = useState<BudgetItem[]>([{ id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 }])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  const addItem = () => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof BudgetItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
          }
          return updatedItem
        }
        return item
      }),
    )
  }

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const handleSubmit = async (status: "draft" | "sent" = "draft") => {
    if (!user || !title.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const budgetData = {
        client_id: clientId || user.id,
        title: title.trim(),
        description: description.trim(),
        total_amount: getTotalAmount(),
        status,
        items: items.filter((item) => item.description.trim()),
      }

      const { data, error } = await supabase.from("budgets").insert(budgetData).select().single()

      if (error) {
        throw error
      }

      // Crear notificación para el cliente
      if (status === "sent" && clientId) {
        await supabase.from("notifications").insert({
          user_id: clientId,
          title: "Nuevo Presupuesto Recibido",
          message: `Has recibido un nuevo presupuesto: ${title}`,
          type: "info",
        })
      }

      toast({
        title: "Éxito",
        description: `Presupuesto ${status === "sent" ? "enviado" : "guardado"} correctamente`,
      })

      // Reset form
      setTitle("")
      setDescription("")
      setItems([{ id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 }])

      onSuccess?.()
    } catch (error) {
      console.error("Error creating budget:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el presupuesto",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Crear Presupuesto
        </CardTitle>
        <CardDescription className="text-gray-400">Crea un presupuesto detallado para tu cliente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="title" className="text-white">
              Título del Presupuesto *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Automatización de Procesos de Ventas"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-white">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción detallada del proyecto..."
              className="bg-gray-700 border-gray-600 text-white"
              rows={3}
            />
          </div>
        </div>

        {/* Items del presupuesto */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white text-lg">Items del Presupuesto</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Item
            </Button>
          </div>

          {items.map((item, index) => (
            <Card key={item.id} className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-5">
                    <Label className="text-gray-300 text-sm">Descripción</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      placeholder="Descripción del servicio..."
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-300 text-sm">Cantidad</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-300 text-sm">Precio Unit.</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-300 text-sm">Total</Label>
                    <div className="bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-white font-medium">
                      €{item.total.toFixed(2)}
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-end">
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="text-right">
                <Label className="text-gray-300">Total del Presupuesto</Label>
                <div className="text-2xl font-bold text-green-400">€{getTotalAmount().toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSubmit("draft")}
            disabled={loading || !title.trim()}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Guardar Borrador
          </Button>
          <Button
            type="button"
            onClick={() => handleSubmit("sent")}
            disabled={loading || !title.trim() || items.every((item) => !item.description.trim())}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar Presupuesto
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
