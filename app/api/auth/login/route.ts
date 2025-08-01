import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getUserByEmail, updateUserLastLogin, logAuditEvent } from "@/lib/supabase"
import { signJWT } from "@/lib/jwt"

// Usuarios demo para desarrollo
const DEMO_USERS = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "admin@robertsoftware.com",
    password: "Admin123!",
    name: "Administrador Principal",
    role: "admin" as const,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "empleado@demo.com",
    password: "Empleado123!",
    name: "Empleado Demo",
    role: "empleado" as const,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    email: "cliente@demo.com",
    password: "Cliente123!",
    name: "Cliente Demo",
    role: "cliente" as const,
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Verificar usuario demo primero
    const demoUser = DEMO_USERS.find((user) => user.email === normalizedEmail)
    if (demoUser && demoUser.password === password) {
      const token = await signJWT({
        userId: demoUser.id,
        email: demoUser.email,
        role: demoUser.role,
      })

      // Log del evento de login
      await logAuditEvent({
        user_id: demoUser.id,
        action: "USER_LOGIN",
        table_name: "users",
        record_id: demoUser.id,
        ip_address: request.ip || "unknown",
        user_agent: request.headers.get("user-agent") || "unknown",
        severity: "info",
        success: true,
        new_values: {
          email: demoUser.email,
          role: demoUser.role,
          login_type: "demo",
        },
      })

      const response = NextResponse.json({
        success: true,
        user: {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
        },
        token,
      })

      // Configurar cookie segura
      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 horas
        path: "/",
      })

      return response
    }

    // Buscar usuario en Supabase
    const user = await getUserByEmail(normalizedEmail)
    if (!user) {
      await logAuditEvent({
        action: "LOGIN_FAILED",
        table_name: "users",
        ip_address: request.ip || "unknown",
        user_agent: request.headers.get("user-agent") || "unknown",
        severity: "warning",
        success: false,
        error_message: "Usuario no encontrado",
        new_values: { email: normalizedEmail },
      })

      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Verificar si el usuario está activo
    if (!user.is_active) {
      await logAuditEvent({
        user_id: user.id,
        action: "LOGIN_FAILED",
        table_name: "users",
        record_id: user.id,
        ip_address: request.ip || "unknown",
        user_agent: request.headers.get("user-agent") || "unknown",
        severity: "warning",
        success: false,
        error_message: "Usuario inactivo",
        new_values: { email: normalizedEmail },
      })

      return NextResponse.json({ error: "Cuenta desactivada" }, { status: 401 })
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash || "")
    if (!isValidPassword) {
      await logAuditEvent({
        user_id: user.id,
        action: "LOGIN_FAILED",
        table_name: "users",
        record_id: user.id,
        ip_address: request.ip || "unknown",
        user_agent: request.headers.get("user-agent") || "unknown",
        severity: "warning",
        success: false,
        error_message: "Contraseña incorrecta",
        new_values: { email: normalizedEmail },
      })

      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Actualizar último login
    await updateUserLastLogin(user.id)

    // Crear JWT
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Log del evento de login exitoso
    await logAuditEvent({
      user_id: user.id,
      action: "USER_LOGIN",
      table_name: "users",
      record_id: user.id,
      ip_address: request.ip || "unknown",
      user_agent: request.headers.get("user-agent") || "unknown",
      severity: "info",
      success: true,
      new_values: {
        email: user.email,
        role: user.role,
        login_type: "database",
      },
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    })

    // Configurar cookie segura
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 horas
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)

    await logAuditEvent({
      action: "LOGIN_ERROR",
      table_name: "users",
      ip_address: request.ip || "unknown",
      user_agent: request.headers.get("user-agent") || "unknown",
      severity: "error",
      success: false,
      error_message: error instanceof Error ? error.message : "Error desconocido",
    })

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
