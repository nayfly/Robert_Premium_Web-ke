import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { verifyJWT } from "@/lib/jwt"
import { createAuditLog } from "@/lib/audit"
import { AuthService } from "@/lib/auth"

// GET - Obtener lista de tareas
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
    const project_id = searchParams.get("project_id")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const assigned_to = searchParams.get("assigned_to")
    const search = searchParams.get("search")

    const offset = (page - 1) * limit

    // Construir consulta base
    let query = supabaseAdmin
      .from("tasks")
      .select(
        `
        *,
        project:projects(id, name, client_id, assigned_to),
        assigned_user:users!tasks_assigned_to_fkey(id, name, email)
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })

    // Filtrar según el rol del usuario
    if (currentUser.role === "cliente") {
      // Los clientes solo ven tareas de sus proyectos
      query = query.eq("project.client_id", currentUser.id)
    } else if (currentUser.role === "empleado") {
      // Los empleados ven tareas asignadas a ellos o de proyectos asignados a ellos
      query = query.or(`assigned_to.eq.${currentUser.id},project.assigned_to.eq.${currentUser.id}`)
    }
    // Los admin ven todas las tareas

    // Aplicar filtros
    if (project_id) {
      query = query.eq("project_id", project_id)
    }

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (priority && priority !== "all") {
      query = query.eq("priority", priority)
    }

    if (assigned_to && assigned_to !== "all") {
      if (assigned_to === "unassigned") {
        query = query.is("assigned_to", null)
      } else {
        query = query.eq("assigned_to", assigned_to)
      }
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    query = query.range(offset, offset + limit - 1)

    const { data: tasks, error, count } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      tasks: tasks || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error obteniendo tareas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear nueva tarea
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

    // Solo admin y empleados pueden crear tareas
    if (currentUser.role === "cliente") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    const body = await request.json()
    const { project_id, title, description, assigned_to, due_date, estimated_hours, priority, status } = body

    // Validaciones
    if (!project_id || !title) {
      return NextResponse.json({ error: "Campos requeridos: project_id, title" }, { status: 400 })
    }

    // Verificar que el proyecto existe y el usuario tiene acceso
    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .select("id, client_id, assigned_to")
      .eq("id", project_id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
    }

    // Verificar permisos sobre el proyecto
    const canCreateTask =
      currentUser.role === "admin" ||
      project.assigned_to === currentUser.id ||
      (currentUser.role === "empleado" && !project.assigned_to)

    if (!canCreateTask) {
      return NextResponse.json({ error: "No tienes permisos para crear tareas en este proyecto" }, { status: 403 })
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

    // Crear tarea
    const taskData = {
      project_id,
      title,
      description,
      assigned_to,
      due_date,
      estimated_hours: estimated_hours ? Number.parseFloat(estimated_hours) : null,
      priority: priority || "medium",
      status: status || "todo",
    }

    const { data: newTask, error } = await supabaseAdmin
      .from("tasks")
      .insert(taskData)
      .select(
        `
        *,
        project:projects(id, name, client_id, assigned_to),
        assigned_user:users!tasks_assigned_to_fkey(id, name, email)
      `,
      )
      .single()

    if (error) {
      throw error
    }

    // Log de auditoría
    await createAuditLog({
      user_id: currentUser.id,
      action: "TASK_CREATED",
      table_name: "tasks",
      record_id: newTask.id,
      severity: "info",
      success: true,
      new_values: taskData,
    })

    return NextResponse.json({ task: newTask }, { status: 201 })
  } catch (error) {
    console.error("Error creando tarea:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
