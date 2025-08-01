import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { verifyJWT } from "@/lib/jwt"

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación y rol admin
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    const offset = (page - 1) * limit

    // Construir query base
    let query = supabaseAdmin
      .from("orders")
      .select(`
        *,
        download_tokens (
          id,
          token,
          downloads_count,
          max_downloads,
          expires_at,
          created_at
        )
      `)
      .order("created_at", { ascending: false })

    // Aplicar filtros
    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,id.ilike.%${search}%`)
    }

    if (dateFrom) {
      query = query.gte("created_at", dateFrom)
    }

    if (dateTo) {
      query = query.lte("created_at", dateTo)
    }

    // Obtener total de registros para paginación
    const { count } = await supabaseAdmin.from("orders").select("*", { count: "exact", head: true })

    // Obtener pedidos con paginación
    const { data: orders, error } = await query.range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 })
    }

    // Obtener estadísticas
    const { data: stats } = await supabaseAdmin.rpc("get_orders_stats")

    return NextResponse.json({
      orders: orders || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
      stats: stats || {
        total_orders: 0,
        total_revenue: 0,
        pending_orders: 0,
        completed_orders: 0,
      },
    })
  } catch (error) {
    console.error("Error in orders API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verificar autenticación y rol admin
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    const { orderId, updates } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "ID de pedido requerido" }, { status: 400 })
    }

    // Actualizar pedido
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single()

    if (error) {
      console.error("Error updating order:", error)
      return NextResponse.json({ error: "Error al actualizar pedido" }, { status: 500 })
    }

    return NextResponse.json({ order: data })
  } catch (error) {
    console.error("Error in orders PATCH:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
