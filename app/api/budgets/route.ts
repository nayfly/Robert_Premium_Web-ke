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

    // Obtener perfil del usuario
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    let query = supabase.from("budgets").select(`
      *,
      users!budgets_client_id_fkey(name, email)
    `)

    // Filtrar según el rol
    if (profile?.role === "cliente") {
      query = query.eq("client_id", user.id)
    }

    const { data: budgets, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error obteniendo presupuestos:", error)
      return NextResponse.json({ error: "Error obteniendo presupuestos" }, { status: 500 })
    }

    return NextResponse.json({ budgets })
  } catch (error) {
    console.error("Error en GET /api/budgets:", error)
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

    // Verificar que el usuario es admin o empleado
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (!profile || !["admin", "empleado"].includes(profile.role)) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { client_id, title, description, items } = await request.json()

    if (!client_id || !title || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    // Calcular total
    const total_amount = items.reduce((sum, item) => sum + item.quantity * item.price, 0)

    const { data: budget, error } = await supabase
      .from("budgets")
      .insert({
        client_id,
        title,
        description,
        total_amount,
        items,
        status: "draft",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creando presupuesto:", error)
      return NextResponse.json({ error: "Error creando presupuesto" }, { status: 500 })
    }

    // Crear notificación para el cliente
    await supabase.from("notifications").insert({
      user_id: client_id,
      title: "Nuevo Presupuesto",
      message: `Has recibido un nuevo presupuesto: ${title}`,
      type: "info",
    })

    return NextResponse.json({ budget })
  } catch (error) {
    console.error("Error en POST /api/budgets:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
