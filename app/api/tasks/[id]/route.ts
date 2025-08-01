import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { verifyJWT } from "@/lib/jwt"
import { createAuditLog } from "@/lib/audit"
import { AuthService } from "@/lib/auth"

// GET - Obtener tarea específica
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

    // Obtener tarea con relaciones
    const { data: task, error } = await supabaseAdmin
      .from("tasks")
      .select(
        `
        *,
        project:projects(id, name, client_id, assigned_to, client:users!projects_client_id_fkey(id, name, email, company)),
        assigned_user:users!tasks_assigned_to_fkey(id, name, email)
      `,
      )
      .eq("id", id)
      .single()

    if (error || !task) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 })
    }

    // Verificar permisos
    const hasAccess =
      currentUser.role === "admin" ||
      task.project.client_id === currentUser.id ||
      task.project.assigned_to === currentUser.id ||
      task.assigned_to === currentUser.id ||
      (currentUser.role === "empleado" && !task.project.assigned_to)

    if (!hasAccess) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Error obteniendo tarea:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT - Actualizar tarea
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

    const { id } = params
    const body = await request.json()

    // Obtener tarea actual con proyecto
    const { data: existingTask, error: fetchError } = await supabaseAdmin
      .from("tasks")
      .select(
        `
        *,
        project:projects(id, client_id, assigned_to)
      `,
      )
      .eq("id", id)
      .single()

    if (fetchError || !existingTask) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 })
    }

    // Verificar permisos
    const canEdit =
      currentUser.role === "admin" ||
      existingTask.project.assigned_to === currentUser.id ||
      existingTask.assigned_to === currentUser.id ||
      (currentUser.role === "empleado" && !existingTask.project.assigned_to)

    if (!canEdit) {
      return NextResponse.json({ error: "No tienes permisos para editar esta tarea" }, { status: 403 })
    }

    // Preparar datos de actualización
    const updateData: any = {}
    const allowedFields = ["title", "description", "status", "priority", "due_date", "estimated_hours", "actual_hours"]

    // Solo admin y el responsable del proyecto pueden cambiar asignación
    if (currentUser.role === "admin" || existingTask.project.assigned_to === currentUser.id) {
      allowedFields.push("assigned_to")
    }

    // Filtrar campos permitidos
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "estimated_hours" || field === "actual_hours") {
          updateData[field] = body[field] ? Number.parseFloat(body[field]) : null
        } else {
          updateData[field] = body[field]
        }
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

    // Marcar fecha de completado si se cambia a completado
    if (updateData.status === "completed" && existingTask.status !== "completed") {
      updateData.completed_at = new Date().toISOString()
    } else if (updateData.status !== "completed" && existingTask.status === "completed") {
      updateData.completed_at = null
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No hay datos para actualizar" }, { status: 400 })
    }

    // Actualizar tarea
    const { data: updatedTask, error } = await supabaseAdmin
      .from("tasks")
      .update(updateData)
      .eq("id", id)
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
      action: "TASK_UPDATED",
      table_name: "tasks",
      record_id: id,
      severity: "info",
      success: true,
      old_values: existingTask,
      new_values: updateData,
    })

    return NextResponse.json({ task: updatedTask })
  } catch (error) {
    console.error("Error actualizando tarea:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar tarea
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
    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    const { id } = params

    // Obtener tarea con proyecto para auditoría y verificación de permisos
    const { data: taskToDelete, error: fetchError } = await supabaseAdmin
      .from("tasks")
      .select(
        `
        *,
        project:projects(id, client_id, assigned_to)
      `,
      )
      .eq("id", id)
      .single()

    if (fetchError || !taskToDelete) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 })
    }

    // Verificar permisos (solo admin y responsable del proyecto pueden eliminar)
    const canDelete =
      currentUser.role === "admin" ||
      taskToDelete.project.assigned_to === currentUser.id ||
      (currentUser.role === "empleado" && !taskToDelete.project.assigned_to)

    if (!canDelete) {
      return NextResponse.json({ error: "No tienes permisos para eliminar esta tarea" }, { status: 403 })
    }

    // Eliminar tarea
    const { error } = await supabaseAdmin.from("tasks").delete().eq("id", id)

    if (error) {
      throw error
    }

    // Log de auditoría
    await createAuditLog({
      user_id: currentUser.id,
      action: "TASK_DELETED",
      table_name: "tasks",
      record_id: id,
      severity: "warning",
      success: true,
      old_values: taskToDelete,
    })

    return NextResponse.json({ message: "Tarea eliminada correctamente" })
  } catch (error) {
    console.error("Error eliminando tarea:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
