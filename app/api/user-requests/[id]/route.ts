import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { sanitizeInput, getClientIP, getUserAgent, generateSecurePassword } from "@/lib/supabase"
import { logAuditEvent } from "@/lib/supabase"
import { sendUserRequestNotificationEmail } from "@/lib/email-service"
import bcrypt from "bcryptjs"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const clientIP = getClientIP(request)
  const userAgent = getUserAgent(request)

  try {
    // Verificar autenticación básica (esto debería ser mejorado con JWT)
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      await logAuditEvent({
        action: "PATCH_USER_REQUEST_UNAUTHORIZED",
        table_name: "user_requests",
        record_id: params.id,
        ip_address: clientIP,
        user_agent: userAgent,
        severity: "warning",
        success: false,
        error_message: "Usuario no autenticado intentando modificar solicitud",
      })
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { action, rejection_reason } = body

    // Validar parámetros
    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Acción inválida" }, { status: 400 })
    }

    if (action === "reject" && (!rejection_reason || rejection_reason.trim().length === 0)) {
      return NextResponse.json({ error: "Se requiere una razón para rechazar" }, { status: 400 })
    }

    // Sanitizar datos
    const sanitizedRejectionReason = rejection_reason ? sanitizeInput(rejection_reason) : null

    if (sanitizedRejectionReason && sanitizedRejectionReason.length > 500) {
      return NextResponse.json({ error: "La razón de rechazo no puede superar los 500 caracteres" }, { status: 400 })
    }

    // Obtener la solicitud actual
    const { data: currentRequest, error: fetchError } = await supabaseAdmin
      .from("user_requests")
      .select("*")
      .eq("id", params.id)
      .single()

    if (fetchError || !currentRequest) {
      await logAuditEvent({
        action: "PATCH_USER_REQUEST_NOT_FOUND",
        table_name: "user_requests",
        record_id: params.id,
        ip_address: clientIP,
        user_agent: userAgent,
        severity: "warning",
        success: false,
        error_message: "Solicitud no encontrada",
      })
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 })
    }

    if (currentRequest.status !== "pending") {
      await logAuditEvent({
        action: "PATCH_USER_REQUEST_ALREADY_PROCESSED",
        table_name: "user_requests",
        record_id: params.id,
        ip_address: clientIP,
        user_agent: userAgent,
        severity: "warning",
        success: false,
        error_message: `Solicitud ya procesada: ${currentRequest.status}`,
      })
      return NextResponse.json({ error: "La solicitud ya fue procesada" }, { status: 400 })
    }

    // Verificar si el token de activación ha expirado
    if (currentRequest.token_expires_at && new Date(currentRequest.token_expires_at) < new Date()) {
      await logAuditEvent({
        action: "PATCH_USER_REQUEST_TOKEN_EXPIRED",
        table_name: "user_requests",
        record_id: params.id,
        ip_address: clientIP,
        user_agent: userAgent,
        severity: "warning",
        success: false,
        error_message: "Token de activación expirado",
      })
      return NextResponse.json({ error: "El token de activación ha expirado" }, { status: 400 })
    }

    let tempPassword = ""
    const updateData: any = {
      status: action === "approve" ? "approved" : "rejected",
      rejection_reason: sanitizedRejectionReason,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (action === "approve") {
      // Verificar si ya existe un usuario con el mismo email
      const { data: existingUser } = await supabaseAdmin
        .from("users")
        .select("id, email")
        .eq("email", currentRequest.email)
        .single()

      if (existingUser) {
        await logAuditEvent({
          action: "PATCH_USER_REQUEST_USER_EXISTS",
          table_name: "user_requests",
          record_id: params.id,
          ip_address: clientIP,
          user_agent: userAgent,
          severity: "warning",
          success: false,
          error_message: "Usuario ya existe en el sistema",
        })
        return NextResponse.json({ error: "Ya existe un usuario con este email" }, { status: 409 })
      }

      // Crear usuario directamente en la tabla users
      tempPassword = generateSecurePassword(12)
      const passwordHash = await bcrypt.hash(tempPassword, 12)

      // Calcular fecha de expiración de contraseña (7 días)
      const passwordExpiresAt = new Date()
      passwordExpiresAt.setDate(passwordExpiresAt.getDate() + 7)

      const { error: profileError } = await supabaseAdmin.from("users").insert({
        email: currentRequest.email,
        name: currentRequest.name,
        role: currentRequest.access_type,
        is_active: true,
        email_verified: false,
        phone: currentRequest.phone,
        company: currentRequest.company,
        position: currentRequest.position,
        password_hash: passwordHash,
        failed_login_attempts: 0,
        password_changed_at: new Date().toISOString(),
        password_expires_at: passwordExpiresAt.toISOString(),
        requires_password_change: true,
        created_from_request: true,
        activation_token: currentRequest.activation_token,
        metadata: {
          created_from_request_id: currentRequest.id,
          original_request_data: {
            company: currentRequest.company,
            position: currentRequest.position,
            access_type: currentRequest.access_type,
            message: currentRequest.message,
          },
        },
      })

      if (profileError) {
        console.error("Error creating user profile:", profileError)

        await logAuditEvent({
          action: "PATCH_USER_REQUEST_PROFILE_ERROR",
          table_name: "user_requests",
          record_id: params.id,
          ip_address: clientIP,
          user_agent: userAgent,
          severity: "error",
          success: false,
          error_message: `Error creando perfil de usuario: ${profileError.message}`,
        })
        return NextResponse.json({ error: "Error al crear perfil de usuario" }, { status: 500 })
      }

      // Log de auditoría para creación de usuario
      await logAuditEvent({
        action: "CREATE_USER_FROM_REQUEST",
        table_name: "users",
        ip_address: clientIP,
        user_agent: userAgent,
        severity: "info",
        success: true,
        new_values: {
          email: currentRequest.email,
          name: currentRequest.name,
          role: currentRequest.access_type,
          company: currentRequest.company,
          created_from_request: true,
        },
      })

      updateData.approved_at = new Date().toISOString()
    }

    // Actualizar la solicitud
    const { data: updatedRequest, error: updateError } = await supabaseAdmin
      .from("user_requests")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating request:", updateError)
      await logAuditEvent({
        action: "PATCH_USER_REQUEST_UPDATE_ERROR",
        table_name: "user_requests",
        record_id: params.id,
        ip_address: clientIP,
        user_agent: userAgent,
        severity: "error",
        success: false,
        error_message: `Error actualizando solicitud: ${updateError.message}`,
      })
      return NextResponse.json({ error: "Error al actualizar solicitud" }, { status: 500 })
    }

    // Enviar email de notificación al usuario
    try {
      if (action === "approve") {
        await sendUserRequestNotificationEmail(updatedRequest, "approved", { tempPassword })
      } else {
        await sendUserRequestNotificationEmail(updatedRequest, "rejected", {
          rejectionReason: sanitizedRejectionReason,
        })
      }
    } catch (emailError) {
      console.error("Error sending notification email:", emailError)
      // No fallar la operación por error de email, pero registrarlo
      await logAuditEvent({
        action: "EMAIL_NOTIFICATION_FAILED",
        table_name: "user_requests",
        record_id: params.id,
        ip_address: clientIP,
        user_agent: userAgent,
        severity: "warning",
        success: false,
        error_message: `Error enviando email: ${emailError instanceof Error ? emailError.message : "Error desconocido"}`,
      })
    }

    // Log de auditoría exitoso
    await logAuditEvent({
      action: action === "approve" ? "APPROVE_USER_REQUEST" : "REJECT_USER_REQUEST",
      table_name: "user_requests",
      record_id: params.id,
      ip_address: clientIP,
      user_agent: userAgent,
      severity: "info",
      success: true,
      old_values: currentRequest,
      new_values: {
        ...updatedRequest,
        temp_password: action === "approve" ? "***HIDDEN***" : undefined,
      },
    })

    const response: any = {
      message:
        action === "approve"
          ? "Solicitud aprobada y usuario creado correctamente"
          : "Solicitud rechazada correctamente",
      request: updatedRequest,
    }

    // Solo incluir la contraseña temporal en la respuesta si es aprobación
    if (action === "approve") {
      response.tempPassword = tempPassword
      response.userCreated = true
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in PATCH /api/user-requests/[id]:", error)

    await logAuditEvent({
      action: "PATCH_USER_REQUEST_EXCEPTION",
      table_name: "user_requests",
      record_id: params.id,
      ip_address: clientIP,
      user_agent: userAgent,
      severity: "critical",
      success: false,
      error_message: error instanceof Error ? error.message : "Error desconocido",
    })

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const clientIP = getClientIP(request)
  const userAgent = getUserAgent(request)

  try {
    // Verificar autenticación básica (esto debería ser mejorado con JWT)
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      await logAuditEvent({
        action: "DELETE_USER_REQUEST_UNAUTHORIZED",
        table_name: "user_requests",
        record_id: params.id,
        ip_address: clientIP,
        user_agent: userAgent,
        severity: "warning",
        success: false,
        error_message: "Usuario no autenticado intentando eliminar solicitud",
      })
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener la solicitud antes de eliminarla
    const { data: requestToDelete, error: fetchError } = await supabaseAdmin
      .from("user_requests")
      .select("*")
      .eq("id", params.id)
      .single()

    if (fetchError || !requestToDelete) {
      await logAuditEvent({
        action: "DELETE_USER_REQUEST_NOT_FOUND",
        table_name: "user_requests",
        record_id: params.id,
        ip_address: clientIP,
        user_agent: userAgent,
        severity: "warning",
        success: false,
        error_message: "Solicitud no encontrada para eliminar",
      })
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 })
    }

    // Si la solicitud fue aprobada, verificar si se debe eliminar también el usuario
    if (requestToDelete.status === "approved") {
      const { data: associatedUser } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", requestToDelete.email)
        .eq("created_from_request", true)
        .single()

      if (associatedUser) {
        // Desactivar el usuario en lugar de eliminarlo completamente
        await supabaseAdmin
          .from("users")
          .update({
            is_active: false,
            updated_at: new Date().toISOString(),
            deactivated_reason: "Solicitud eliminada por administrador",
          })
          .eq("id", associatedUser.id)

        await logAuditEvent({
          action: "DEACTIVATE_USER_FROM_DELETED_REQUEST",
          table_name: "users",
          record_id: associatedUser.id,
          ip_address: clientIP,
          user_agent: userAgent,
          severity: "warning",
          success: true,
          old_values: { is_active: true },
          new_values: { is_active: false, deactivated_reason: "Solicitud eliminada por administrador" },
        })
      }
    }

    // Eliminar la solicitud
    const { error: deleteError } = await supabaseAdmin.from("user_requests").delete().eq("id", params.id)

    if (deleteError) {
      console.error("Error deleting request:", deleteError)
      await logAuditEvent({
        action: "DELETE_USER_REQUEST_ERROR",
        table_name: "user_requests",
        record_id: params.id,
        ip_address: clientIP,
        user_agent: userAgent,
        severity: "error",
        success: false,
        error_message: `Error eliminando solicitud: ${deleteError.message}`,
      })
      return NextResponse.json({ error: "Error al eliminar solicitud" }, { status: 500 })
    }

    // Log de auditoría exitoso
    await logAuditEvent({
      action: "DELETE_USER_REQUEST_SUCCESS",
      table_name: "user_requests",
      record_id: params.id,
      ip_address: clientIP,
      user_agent: userAgent,
      severity: "info",
      success: true,
      old_values: requestToDelete,
    })

    return NextResponse.json({
      message: "Solicitud eliminada correctamente",
      userDeactivated: requestToDelete.status === "approved",
    })
  } catch (error) {
    console.error("Error in DELETE /api/user-requests/[id]:", error)

    await logAuditEvent({
      action: "DELETE_USER_REQUEST_EXCEPTION",
      table_name: "user_requests",
      record_id: params.id,
      ip_address: clientIP,
      user_agent: userAgent,
      severity: "critical",
      success: false,
      error_message: error instanceof Error ? error.message : "Error desconocido",
    })

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
