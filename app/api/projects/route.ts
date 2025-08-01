import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { verifyJWT } from "@/lib/jwt"
import { createAuditLog } from "@/lib/audit"
import { AuthService } from "@/lib/auth"

// GET - Obtener lista de proyectos
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const currentUser = await AuthService.getUserById(payload.userId)
    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const search = searchParams.get("search")

    const offset = (page - 1) * limit

    // Construir consulta base
    let query = supabaseAdmin
      .from("projects")
      .select(
        `
        *,
        client:users!projects_client_id_fkey(id, name, email, company),
        assigned_user:users!projects_assigned_to_fkey(id, name, email)
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })

    // Filtrar según el rol del usuario
    if (currentUser.role === "cliente") {
      // Los clientes solo ven sus propios proyectos
      query = query.eq("client_id", currentUser.id)
    } else if (currentUser.role === "empleado") {
      // Los empleados ven proyectos asignados a ellos o sin asignar
      query = query.or(`assigned_to.eq.${currentUser.id},assigned_to.is.null`)
    }
    // Los admin ven todos los proyectos

    // Aplicar filtros
    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (priority && priority !== "all") {
      query = query.eq("priority", priority)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    query = query.range(offset, offset + limit - 1)

    const { data: projects, error, count } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      projects: projects || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error obteniendo proyectos:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear nuevo proyecto
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const currentUser = await AuthService.getUserById(payload.userId)
    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Solo admin y empleados pueden crear proyectos
    if (currentUser.role === "cliente") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, client_id, assigned_to, budget, start_date, end_date, priority, status } = body

    // Validaciones
    if (!name || !client_id) {
      return NextResponse.json({ error: "Campos requeridos: name, client_id" }, { status: 400 })
    }

    // Verificar que el cliente existe
    const { data: client, error: clientError } = await supabaseAdmin
      .from("users")
      .select("id, role")
      .eq("id", client_id)
      .eq("is_active", true)
      .single()

    if (clientError || !client || client.role !== "cliente") {
      return NextResponse.json({ error: "Cliente no válido" }, { status: 400 })
    }

    // Verificar empleado asignado si se proporciona
    if (assigned_to) {
      const { data: employee, error: employeeError } = await supabaseAdmin
        .from("users")
        .select("id, role")
        .eq("id", assigned_to)
        .eq("is_active", true)
        .single()

      if (employeeError || !employee || !["admin", "empleado"].includes(employee.role)) {
        return NextResponse.json({ error: "Empleado asignado no válido" }, { status: 400 })
      }
    }

    // Crear proyecto
    const projectData = {
      name,
      description,
      client_id,
      assigned_to,
      budget: budget ? Number.parseFloat(budget) : null,
      start_date,
      end_date,
      priority: priority || "medium",
      status: status || "planning",
      completion_percentage: 0,
    }

    const { data: newProject, error } = await supabaseAdmin
      .from("projects")
      .insert(projectData)
      .select(
        `
        *,
        client:users!projects_client_id_fkey(id, name, email, company),
        assigned_user:users!projects_assigned_to_fkey(id, name, email)
      `,
      )
      .single()

    if (error) {
      throw error
    }

    // Log de auditoría
    await createAuditLog({
      user_id: currentUser.id,
      action: "PROJECT_CREATED",
      table_name: "projects",
      record_id: newProject.id,
      severity: "info",
      success: true,
      new_values: projectData,
    })

    return NextResponse.json({ project: newProject }, { status: 201 })
  } catch (error) {
    console.error("Error creando proyecto:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
