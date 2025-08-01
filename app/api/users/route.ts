import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { verifyJWT } from "@/lib/jwt"
import { createAuditLog } from "@/lib/audit"
import { AuthService } from "@/lib/auth"

// GET - Obtener lista de usuarios (solo admin)
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

    // Verificar que sea admin
    const user = await AuthService.getUserById(payload.userId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const role = searchParams.get("role")
    const search = searchParams.get("search")

    const offset = (page - 1) * limit

    // Construir consulta
    let query = supabaseAdmin
      .from("users")
      .select("id, email, name, role, is_active, created_at, last_login, company, position, email_verified", {
        count: "exact",
      })
      .order("created_at", { ascending: false })

    if (role && role !== "all") {
      query = query.eq("role", role)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`)
    }

    query = query.range(offset, offset + limit - 1)

    const { data: users, error, count } = await query

    if (error) {
      throw error
    }

    // Log de auditoría
    await createAuditLog({
      user_id: user.id,
      action: "USERS_LIST_VIEWED",
      table_name: "users",
      severity: "info",
      success: true,
    })

    return NextResponse.json({
      users: users || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error obteniendo usuarios:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear nuevo usuario (solo admin)
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

    // Verificar que sea admin
    const adminUser = await AuthService.getUserById(payload.userId)
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    const body = await request.json()
    const { email, name, role, company, position, phone, password } = body

    // Validaciones
    if (!email || !name || !role || !password) {
      return NextResponse.json({ error: "Campos requeridos: email, name, role, password" }, { status: 400 })
    }

    if (!AuthService.isValidEmail(email)) {
      return NextResponse.json({ error: "Formato de email inválido" }, { status: 400 })
      return NextResponse.json({ error: "Formato de email inválido" }, { status: 400 })
    }

    if (!AuthService.isValidPassword(password)) {
      return NextResponse.json(
        {
          error:
            "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
        },
        { status: 400 },
      )
    }

    if (!["admin", "empleado", "cliente"].includes(role)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 })
    }

    // Verificar si el email ya existe
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .single()

    if (existingUser) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 })
    }

    // Hashear contraseña
    const passwordHash = await AuthService.hashPassword(password)

    // Crear usuario
    const { data: newUser, error } = await supabaseAdmin
      .from("users")
      .insert({
        email: email.toLowerCase(),
        name,
        role,
        company,
        position,
        phone,
        password_hash: passwordHash,
        is_active: true,
        email_verified: false,
      })
      .select("id, email, name, role, is_active, created_at, company, position, phone, email_verified")
      .single()

    if (error) {
      throw error
    }

    // Log de auditoría
    await createAuditLog({
      user_id: adminUser.id,
      action: "USER_CREATED",
      table_name: "users",
      record_id: newUser.id,
      severity: "info",
      success: true,
      new_values: { email, name, role, company, position },
    })

    return NextResponse.json({ user: newUser }, { status: 201 })
  } catch (error) {
    console.error("Error creando usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
