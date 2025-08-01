import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que el usuario es admin
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const userId = searchParams.get("user_id")
    const action = searchParams.get("action")
    const tableName = searchParams.get("table_name")

    let query = supabase
      .from("audit_logs")
      .select(`
        *,
        users(name, email)
      `)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (userId) {
      query = query.eq("user_id", userId)
    }

    if (action) {
      query = query.eq("action", action)
    }

    if (tableName) {
      query = query.eq("table_name", tableName)
    }

    const { data: logs, error } = await query

    if (error) {
      console.error("Error obteniendo logs de auditoría:", error)
      return NextResponse.json({ error: "Error obteniendo logs" }, { status: 500 })
    }

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Error en GET /api/audit-logs:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { action, table_name, record_id, old_values, new_values } = await request.json()

    if (!action) {
      return NextResponse.json({ error: "Acción requerida" }, { status: 400 })
    }

    const { data: log, error } = await supabase
      .from("audit_logs")
      .insert({
        user_id: user.id,
        action,
        table_name,
        record_id,
        old_values,
        new_values,
        ip_address: request.ip,
        user_agent: request.headers.get("user-agent"),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creando log de auditoría:", error)
      return NextResponse.json({ error: "Error creando log" }, { status: 500 })
    }

    return NextResponse.json({ log })
  } catch (error) {
    console.error("Error en POST /api/audit-logs:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
