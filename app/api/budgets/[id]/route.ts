import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { status, title, description, items } = await request.json()
    const budgetId = params.id

    // Obtener presupuesto actual
    const { data: currentBudget, error: fetchError } = await supabase
      .from("budgets")
      .select("*, users!budgets_client_id_fkey(role)")
      .eq("id", budgetId)
      .single()

    if (fetchError || !currentBudget) {
      return NextResponse.json({ error: "Presupuesto no encontrado" }, { status: 404 })
    }

    // Verificar permisos
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    const canEdit =
      profile?.role === "admin" ||
      profile?.role === "empleado" ||
      (profile?.role === "cliente" && currentBudget.client_id === user.id)

    if (!canEdit) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    // Preparar datos de actualización
    const updateData: any = {}

    if (status) updateData.status = status
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (items) {
      updateData.items = items
      updateData.total_amount = items.reduce((sum: number, item: any) => sum + item.quantity * item.price, 0)
    }

    const { data: budget, error } = await supabase
      .from("budgets")
      .update(updateData)
      .eq("id", budgetId)
      .select()
      .single()

    if (error) {
      console.error("Error actualizando presupuesto:", error)
      return NextResponse.json({ error: "Error actualizando presupuesto" }, { status: 500 })
    }

    // Crear notificación si cambió el estado
    if (status && status !== currentBudget.status) {
      const statusMessages = {
        sent: "Tu presupuesto ha sido enviado para revisión",
        approved: "¡Tu presupuesto ha sido aprobado!",
        rejected: "Tu presupuesto ha sido rechazado",
      }

      if (statusMessages[status as keyof typeof statusMessages]) {
        await supabase.from("notifications").insert({
          user_id: currentBudget.client_id,
          title: "Estado del Presupuesto Actualizado",
          message: statusMessages[status as keyof typeof statusMessages],
          type: status === "approved" ? "success" : status === "rejected" ? "error" : "info",
        })
      }
    }

    return NextResponse.json({ budget })
  } catch (error) {
    console.error("Error en PUT /api/budgets/[id]:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que el usuario es admin o empleado
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (!profile || !["admin", "empleado"].includes(profile.role)) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { error } = await supabase.from("budgets").delete().eq("id", params.id)

    if (error) {
      console.error("Error eliminando presupuesto:", error)
      return NextResponse.json({ error: "Error eliminando presupuesto" }, { status: 500 })
    }

    return NextResponse.json({ message: "Presupuesto eliminado" })
  } catch (error) {
    console.error("Error en DELETE /api/budgets/[id]:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
