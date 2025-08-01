import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function PUT(request: NextRequest) {
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
      .eq("user_id", user.id)
      .eq("is_read", false)

    if (error) {
      console.error("Error marcando todas las notificaciones como leídas:", error)
      return NextResponse.json({ error: "Error actualizando notificaciones" }, { status: 500 })
    }

    return NextResponse.json({ message: "Todas las notificaciones marcadas como leídas" })
  } catch (error) {
    console.error("Error en PUT /api/notifications/mark-all-read:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
