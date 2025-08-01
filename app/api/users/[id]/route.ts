import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { verifyJWT } from "@/lib/jwt"
import { createAuditLog } from "@/lib/audit"
import { AuthService } from "@/lib/auth"

// GET - Obtener usuario específico
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

    // Los usuarios pueden ver su propio perfil, los admin pueden ver cualquiera
    if (currentUser.role !== "admin" && currentUser.id !== id) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    // Obtener usuario
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select(
        "id, email, name, role, is_active, created_at, updated_at, last_login, company, position, phone, email_verified, avatar_url",
      )
      .eq("id", id)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error obteniendo usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT - Actualizar usuario
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

    // Los usuarios pueden actualizar su propio perfil, los admin pueden actualizar cualquiera
    if (currentUser.role !== "admin" && currentUser.id !== id) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    // Obtener usuario actual para auditoría
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Preparar datos de actualización
    const updateData: any = {}
    const allowedFields = ["name", "company", "position", "phone"]

    // Solo admin puede cambiar role y is_active
    if (currentUser.role === "admin") {
      allowedFields.push("role", "is_active", "email_verified")
    }

    // Filtrar campos permitidos
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    // Validar email si se está actualizando
    if (body.email && currentUser.role === "admin") {
      if (!AuthService.isValidEmail(body.email)) {
        return NextResponse.json({ error: "Formato de email inválido" }, { status: 400 })
      }

      // Verificar que el email no esté en uso
      const { data: emailExists } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", body.email.toLowerCase())
        .neq("id", id)
        .single()

      if (emailExists) {
        return NextResponse.json({ error: "El email ya está en uso" }, { status: 409 })
      }

      updateData.email = body.email.toLowerCase()
    }

    // Actualizar contraseña si se proporciona
    if (body.password) {
      if (!AuthService.isValidPassword(body.password)) {
        return NextResponse.json(
          {
            error:
              "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
          },
          { status: 400 },
        )
      }

      updateData.password_hash = await AuthService.hashPassword(body.password)
      updateData.password_changed_at = new Date().toISOString()
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No hay datos para actualizar" }, { status: 400 })
    }

    // Actualizar usuario
    const { data: updatedUser, error } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select(
        "id, email, name, role, is_active, created_at, updated_at, last_login, company, position, phone, email_verified, avatar_url",
      )
      .single()

    if (error) {
      throw error
    }

    // Log de auditoría
    await createAuditLog({
      user_id: currentUser.id,
      action: "USER_UPDATED",
      table_name: "users",
      record_id: id,
      severity: "info",
      success: true,
      old_values: existingUser,
      new_values: updateData,
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Error actualizando usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar usuario (solo admin)
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

    // No permitir que el admin se elimine a sí mismo
    if (currentUser.id === id) {
      return NextResponse.json({ error: "No puedes eliminar tu propia cuenta" }, { status: 400 })
    }

    // Obtener usuario para auditoría
    const { data: userToDelete, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !userToDelete) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // En lugar de eliminar, desactivar el usuario (soft delete)
    const { error } = await supabaseAdmin.from("users").update({ is_active: false }).eq("id", id)

    if (error) {
      throw error
    }

    // Log de auditoría
    await createAuditLog({
      user_id: currentUser.id,
      action: "USER_DEACTIVATED",
      table_name: "users",
      record_id: id,
      severity: "warning",
      success: true,
      old_values: userToDelete,
      new_values: { is_active: false },
    })

    return NextResponse.json({ message: "Usuario desactivado correctamente" })
  } catch (error) {
    console.error("Error eliminando usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
