import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin, sanitizeInput, getClientIP, getUserAgent, logAuditEvent } from "@/lib/supabase"
import { validateData, createUserRequestSchema, paginationSchema, commonFiltersSchema } from "@/lib/validation-schemas"
import { sendUserRequestNotificationEmail } from "@/lib/email-service"
import { z } from "zod"

// Esquema para filtros específicos de solicitudes
const userRequestFiltersSchema = commonFiltersSchema.extend({
  status: z.enum(["all", "pending", "approved", "rejected"]).default("all"),
  access_type: z.enum(["all", "cliente", "empleado"]).default("all"),
})

export async function GET(request: NextRequest) {
  const clientIP = getClientIP(request)
  const userAgent = getUserAgent(request)

  try {
    // Verificar autenticación (en producción usar JWT)
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      await logAuditEvent({
        action: "GET_USER_REQUESTS_UNAUTHORIZED",
        table_name: "user_requests",
        ip_address: clientIP,
        user_agent: userAgent,
        severity: "warning",
        success: false,
        error_message: "Acceso no autorizado a solicitudes",
      })
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Validar parámetros de query
    const url = new URL(request.url)
    const pagination = validateData(paginationSchema, {
      page: Number(url.searchParams.get("page")) || 1,
      limit: Number(url.searchParams.get("limit")) || 10,
    })

    const filters = validateData(userRequestFiltersSchema, {
      status: url.searchParams.get("status") || "all",
      access_type: url.searchParams.get("access_type") || "all",
      search: url.searchParams.get("search") || "",
      sortBy: url.searchParams.get("sortBy") || "created_at",
      sortOrder: url.searchParams.get("sortOrder") || "desc",
    })

    // Construir query base
    let query = supabaseAdmin.from("user_requests").select(
      `
        *,
        reviewed_by_user:users!user_requests_reviewed_by_fkey (
          name,
          email
        )
      `,
      { count: "exact" },
    )

    // Aplicar filtros
    if (filters.status !== "all") {
      query = query.eq("status", filters.status)
    }

    if (filters.access_type !== "all") {
      query = query.eq("access_type", filters.access_type)
    }

    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`,
      )
    }

    // Aplicar ordenamiento
    query = query.order(filters.sortBy, { ascending: filters.sortOrder === "asc" })

    // Aplicar paginación
    const from = (pagination.page - 1) * pagination.limit
    const to = from + pagination.limit - 1
    query = query.range(from, to)

    const { data: requests, error, count } = await query

    if (error) {
      console.error("Error fetching user requests:", error)
      await logAuditEvent({
        action: "GET_USER_REQUESTS_ERROR",
        table_name: "user_requests",
        ip_address: clientIP,
        user_agent: userAgent,
        severity: "error",
        success: false,
        error_message: `Error obteniendo solicitudes: ${error.message}`,
      })
      return NextResponse.json({ error: "Error al obtener solicitudes" }, { status: 500 })
    }

    // Calcular estadísticas
    const { data: stats } = await supabaseAdmin.from("user_requests").select("status")

    const statistics = {
      total: count || 0,
      pending: stats?.filter((s) => s.status === "pending").length || 0,
      approved: stats?.filter((s) => s.status === "approved").length || 0,
      rejected: stats?.filter((s) => s.status === "rejected").length || 0,
    }

    const totalPages = Math.ceil((count || 0) / pagination.limit)

    // Log de acceso exitoso
    await logAuditEvent({
      action: "GET_USER_REQUESTS_SUCCESS",
      table_name: "user_requests",
      ip_address: clientIP,
      user_agent: userAgent,
      severity: "info",
      success: true,
      new_values: {
        page: pagination.page,
        limit: pagination.limit,
        total_results: count,
        filters: filters,
      },
    })

    return NextResponse.json({
      success: true,
      requests: requests || [],
      statistics,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: count || 0,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Error in GET /api/user-requests:", error)
    await logAuditEvent({
      action: "GET_USER_REQUESTS_EXCEPTION",
      table_name: "user_requests",
      ip_address: clientIP,
      user_agent: userAgent,
      severity: "critical",
      success: false,
      error_message: error instanceof Error ? error.message : "Error desconocido",
    })
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request)
  const userAgent = getUserAgent(request)

  try {
    const body = await request.json()

    // Validar datos de entrada
    const validatedData = validateData(createUserRequestSchema, {
      name: `${body.firstName || ""} ${body.lastName || ""}`.trim(),
      email: body.email,
      phone: body.phone,
      company: body.company,
      position: body.position,
      access_type: body.access_type || "cliente", // Por defecto cliente
      message: body.description || body.message,
    })

    // Sanitizar datos
    const sanitizedData = {
      name: sanitizeInput(validatedData.name),
      email: sanitizeInput(validatedData.email.toLowerCase()),
      phone: validatedData.phone ? sanitizeInput(validatedData.phone) : null,
      company: sanitizeInput(validatedData.company),
      position: validatedData.position ? sanitizeInput(validatedData.position) : null,
      access_type: validatedData.access_type,
      message: validatedData.message ? sanitizeInput(validatedData.message) : null,
    }

    // Verificar si ya existe una solicitud pendiente con el mismo email
    const { data: existingRequest } = await supabaseAdmin
      .from("user_requests")
      .select("id, status")
      .eq("email", sanitizedData.email)
      .eq("status", "pending")
      .single()

    if (existingRequest) {
      await logAuditEvent({
        action: "CREATE_USER_REQUEST_DUPLICATE",
        table_name: "user_requests",
        ip_address: clientIP,
        user_agent: userAgent,
        severity: "warning",
        success: false,
        error_message: "Solicitud duplicada detectada",
        new_values: sanitizedData,
      })
      return NextResponse.json(
        {
          error: "Ya tienes una solicitud pendiente. Te contactaremos pronto.",
        },
        { status: 409 },
      )
    }

    // Verificar si ya existe un usuario con el mismo email
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id, email")
      .eq("email", sanitizedData.email)
      .single()

    if (existingUser) {
      await logAuditEvent({
        action: "CREATE_USER_REQUEST_USER_EXISTS",
        table_name: "user_requests",
        ip_address: clientIP,
        user_agent: userAgent,
        severity: "warning",
        success: false,
        error_message: "Usuario ya existe en el sistema",
        new_values: sanitizedData,
      })
      return NextResponse.json(
        {
          error: "Ya tienes una cuenta en nuestro sistema. Intenta iniciar sesión.",
        },
        { status: 409 },
      )
    }

    // Generar token de activación
    const activationToken = Math.random().toString(36).substring(2) + Date.now().toString(36)
    const tokenExpiration = new Date()
    tokenExpiration.setDate(tokenExpiration.getDate() + 7) // Expira en 7 días

    // Crear la solicitud
    const { data: newRequest, error: insertError } = await supabaseAdmin
      .from("user_requests")
      .insert({
        ...sanitizedData,
        status: "pending",
        activation_token: activationToken,
        token_expires_at: tokenExpiration.toISOString(),
        ip_address: clientIP,
        user_agent: userAgent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating user request:", insertError)
      await logAuditEvent({
        action: "CREATE_USER_REQUEST_ERROR",
        table_name: "user_requests",
        ip_address: clientIP,
        user_agent: userAgent,
        severity: "error",
        success: false,
        error_message: `Error creando solicitud: ${insertError.message}`,
        new_values: sanitizedData,
      })
      return NextResponse.json({ error: "Error al crear la solicitud" }, { status: 500 })
    }

    // Enviar email de confirmación al usuario
    try {
      await sendUserRequestNotificationEmail(newRequest, "user_confirmation")
    } catch (emailError) {
      console.error("Error sending user confirmation email:", emailError)
      // No fallar la request por error de email
    }

    // Enviar notificación a administradores
    try {
      await sendUserRequestNotificationEmail(newRequest, "admin_notification")
    } catch (emailError) {
      console.error("Error sending admin notification email:", emailError)
      // No fallar la request por error de email
    }

    // Log de creación exitosa
    await logAuditEvent({
      action: "CREATE_USER_REQUEST_SUCCESS",
      table_name: "user_requests",
      record_id: newRequest.id,
      ip_address: clientIP,
      user_agent: userAgent,
      severity: "info",
      success: true,
      new_values: {
        ...sanitizedData,
        activation_token: "***HIDDEN***",
        token_expires_at: tokenExpiration.toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Solicitud creada correctamente",
      request: {
        id: newRequest.id,
        name: newRequest.name,
        email: newRequest.email,
        company: newRequest.company,
        access_type: newRequest.access_type,
        status: newRequest.status,
        created_at: newRequest.created_at,
      },
    })
  } catch (error) {
    console.error("Error in POST /api/user-requests:", error)
    await logAuditEvent({
      action: "CREATE_USER_REQUEST_EXCEPTION",
      table_name: "user_requests",
      ip_address: clientIP,
      user_agent: userAgent,
      severity: "critical",
      success: false,
      error_message: error instanceof Error ? error.message : "Error desconocido",
    })

    if (error instanceof Error && error.message.includes("Datos inválidos")) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
