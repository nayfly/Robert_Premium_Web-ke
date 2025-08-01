import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { verifyJWT } from "@/lib/jwt"
import { createAuditLog } from "@/lib/audit"
import { AuthService } from "@/lib/auth"

// GET - Obtener proyecto específico
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { id } = params

    // Obtener proyecto con relaciones
    const { data: project, error } = await supabaseAdmin
      .from("projects")
      .select(
        `
        *,
        client:users!projects_client_id_fkey(id, name, email, company, phone),
        assigned_user:users!projects_assigned_to_fkey(id, name, email),
        tasks(
          id, title, status, priority, due_date, estimated_hours, actual_hours,
          assigned_user:users!tasks_assigned_to_fkey(id, name, email)
        )
      `,
      )
      .eq("id", id)
      .single()

    if (error || !project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
    }

    // Verificar permisos
    const hasAccess =
      currentUser.role === "admin" ||
      project.client_id === currentUser.id ||
      project.assigned_to === currentUser.id ||
      (currentUser.role === "empleado" && !project.assigned_to)

    if (!hasAccess) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error obteniendo proyecto:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT - Actualizar proyecto
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Solo admin y empleados pueden actualizar proyectos
    if (currentUser.role === "cliente") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()

    // Obtener proyecto actual
    const { data: existingProject, error: fetchError } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !existingProject) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
    }

    // Verificar permisos específicos
    const canEdit =
      currentUser.role === "admin" ||
      existingProject.assigned_to === currentUser.id ||
      (currentUser.role === "empleado" && !existingProject.assigned_to)

    if (!canEdit) {
      return NextResponse.json({ error: "No tienes permisos para editar este proyecto" }, { status: 403 })
    }

    // Preparar datos de actualización
    const updateData: any = {}
    const allowedFields = [
      "name",
      "description",
      "status",
      "priority",
      "budget",
      "start_date",
      "end_date",
      "completion_percentage",
    ]

    // Solo admin puede cambiar cliente y empleado asignado
    if (currentUser.role === "admin") {
      allowedFields.push("client_id", "assigned_to")
    }

    // Filtrar campos permitidos
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "budget" && body[field] !== null) {
          updateData[field] = Number.parseFloat(body[field])
        } else if (field === "completion_percentage") {
          const percentage = Number.parseInt(body[field])
          if (percentage >= 0 && percentage <= 100) {
            updateData[field] = percentage
          }
        } else {
          updateData[field] = body[field]
        }
      }
    }

    // Validar cliente si se está cambiando
    if (updateData.client_id) {
      const { data: client, error: clientError } = await supabaseAdmin
        .from("users")
        .select("id, role")
        .eq("id", updateData.client_id)
        .eq("is_active", true)
        .single()

      if (clientError || !client || client.role !== "cliente") {
        return NextResponse.json({ error: "Cliente no válido" }, { status: 400 })
      }
    }

    // Validar empleado asignado si se está cambiando
    if (updateData.assigned_to) {
      const { data: employee, error: employeeError } = await supabaseAdmin
        .from("users")
        .select("id, role")
        .eq("id", updateData.assigned_to)
        .eq("is_active", true)
        .single()

      if (employeeError || !employee || !["admin", "empleado"].includes(employee.role)) {
        return NextResponse.json({ error: "Empleado asignado no válido" }, { status: 400 })
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No hay datos para actualizar" }, { status: 400 })
    }

    // Actualizar proyecto
    const { data: updatedProject, error } = await supabaseAdmin
      .from("projects")
      .update(updateData)
      .eq("id", id)
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
      action: "PROJECT_UPDATED",
      table_name: "projects",
      record_id: id,
      severity: "info",
      success: true,
      old_values: existingProject,
      new_values: updateData,
    })

    return NextResponse.json({ project: updatedProject })
  } catch (error) {
    console.error("Error actualizando proyecto:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar proyecto (solo admin)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    const { id } = params

    // Obtener proyecto para auditoría
    const { data: projectToDelete, error: fetchError } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !projectToDelete) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
    }

    // Verificar si tiene tareas asociadas
    const { data: tasks, error: tasksError } = await supabaseAdmin
      .from("tasks")
      .select("id")
      .eq("project_id", id)
      .limit(1)

    if (tasksError) {
      throw tasksError
    }

    if (tasks && tasks.length > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar el proyecto porque tiene tareas asociadas" },
        { status: 400 },
      )
    }

    // Eliminar proyecto
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", id)

    if (error) {
      throw error
    }

    // Log de auditoría
    await createAuditLog({
      user_id: currentUser.id,
      action: "PROJECT_DELETED",
      table_name: "projects",
      record_id: id,
      severity: "warning",
      success: true,
      old_values: projectToDelete,
    })

    return NextResponse.json({ message: "Proyecto eliminado correctamente" })
  } catch (error) {
    console.error("Error eliminando proyecto:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
