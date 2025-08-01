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

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", params.id)
      .eq("user_id", user.id) // Solo puede marcar sus propias notificaciones

    if (error) {
      console.error("Error marcando notificación como leída:", error)
      return NextResponse.json({ error: "Error actualizando notificación" }, { status: 500 })
    }

    return NextResponse.json({ message: "Notificación marcada como leída" })
  } catch (error) {
    console.error("Error en PUT /api/notifications/[id]/read:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
