import { type NextRequest, NextResponse } from "next/server"
import { verifyJWT } from "./jwt"
import { AuthService } from "./auth"
import { logAuditEvent } from "./supabase"
import { getClientIP, getUserAgent } from "./supabase"

export interface ApiContext {
  user: any
  clientIP: string | null
  userAgent: string | null
}

export interface ApiError {
  message: string
  status: number
  code?: string
}

export class ApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.status = status
    this.code = code
    this.name = "ApiError"
  }
}

// Middleware centralizado para autenticación
export async function withAuth(request: NextRequest, requiredRole?: string[]): Promise<ApiContext> {
  const token = request.cookies.get("auth-token")?.value
  const clientIP = getClientIP(request)
  const userAgent = getUserAgent(request)

  if (!token) {
    await logAuditEvent({
      action: "UNAUTHORIZED_ACCESS_ATTEMPT",
      ip_address: clientIP,
      user_agent: userAgent,
      severity: "warning",
      success: false,
      error_message: "No token provided",
    })
    throw new ApiError("No autorizado", 401, "NO_TOKEN")
  }

  const payload = await verifyJWT(token)
  if (!payload) {
    await logAuditEvent({
      action: "INVALID_TOKEN_ACCESS_ATTEMPT",
      ip_address: clientIP,
      user_agent: userAgent,
      severity: "warning",
      success: false,
      error_message: "Invalid token",
    })
    throw new ApiError("Token inválido", 401, "INVALID_TOKEN")
  }

  const user = await AuthService.getUserById(payload.userId)
  if (!user || !user.is_active) {
    await logAuditEvent({
      user_id: payload.userId,
      action: "INACTIVE_USER_ACCESS_ATTEMPT",
      ip_address: clientIP,
      user_agent: userAgent,
      severity: "warning",
      success: false,
      error_message: "User not found or inactive",
    })
    throw new ApiError("Usuario no encontrado o inactivo", 404, "USER_NOT_FOUND")
  }

  // Verificar si el usuario está bloqueado
  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    await logAuditEvent({
      user_id: user.id,
      action: "LOCKED_USER_ACCESS_ATTEMPT",
      ip_address: clientIP,
      user_agent: userAgent,
      severity: "warning",
      success: false,
      error_message: "User account is locked",
    })
    throw new ApiError("Cuenta temporalmente bloqueada", 403, "ACCOUNT_LOCKED")
  }

  // Verificar rol si es requerido
  if (requiredRole && !requiredRole.includes(user.role)) {
    await logAuditEvent({
      user_id: user.id,
      action: "INSUFFICIENT_PERMISSIONS",
      ip_address: clientIP,
      user_agent: userAgent,
      severity: "warning",
      success: false,
      error_message: `Required role: ${requiredRole.join(", ")}, user role: ${user.role}`,
    })
    throw new ApiError("Permisos insuficientes", 403, "INSUFFICIENT_PERMISSIONS")
  }

  return {
    user,
    clientIP,
    userAgent,
  }
}

// Handler centralizado de errores
export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error)

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.status },
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    )
  }

  return NextResponse.json(
    {
      error: "Error desconocido",
      code: "UNKNOWN_ERROR",
    },
    { status: 500 },
  )
}

// Wrapper para endpoints con manejo de errores automático
export function withErrorHandling(handler: (request: NextRequest, params?: any) => Promise<NextResponse>) {
  return async (request: NextRequest, params?: any): Promise<NextResponse> => {
    try {
      return await handler(request, params)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

// Validador de paginación
export interface PaginationParams {
  page: number
  limit: number
  offset: number
}

export function validatePagination(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1"))
  const limit = Math.min(100, Math.max(1, Number.parseInt(searchParams.get("limit") || "10")))
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

// Validador de filtros comunes
export interface CommonFilters {
  search?: string
  status?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export function validateCommonFilters(
  searchParams: URLSearchParams,
  validStatuses: string[] = [],
  validSortFields: string[] = ["created_at", "updated_at"],
): CommonFilters {
  const search = searchParams.get("search") || undefined
  const status = searchParams.get("status") || undefined
  const sortBy = searchParams.get("sortBy") || "created_at"
  const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc"

  // Validar status
  if (status && validStatuses.length > 0 && !validStatuses.includes(status)) {
    throw new ApiError(`Estado inválido. Valores permitidos: ${validStatuses.join(", ")}`, 400, "INVALID_STATUS")
  }

  // Validar sortBy
  if (!validSortFields.includes(sortBy)) {
    throw new ApiError(
      `Campo de ordenación inválido. Valores permitidos: ${validSortFields.join(", ")}`,
      400,
      "INVALID_SORT_FIELD",
    )
  }

  // Validar sortOrder
  if (!["asc", "desc"].includes(sortOrder)) {
    throw new ApiError("Orden de clasificación inválido. Valores permitidos: asc, desc", 400, "INVALID_SORT_ORDER")
  }

  return {
    search,
    status,
    sortBy,
    sortOrder,
  }
}

// Helper para respuestas paginadas
export function createPaginatedResponse<T>(
  data: T[],
  pagination: PaginationParams,
  total: number,
  additionalData?: Record<string, any>,
) {
  return {
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
      hasNext: pagination.page * pagination.limit < total,
      hasPrev: pagination.page > 1,
    },
    ...additionalData,
  }
}

// Rate limiting helper
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests = 100,
  windowMs: number = 15 * 60 * 1000, // 15 minutos
): boolean {
  const now = Date.now()
  const key = identifier
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

// Limpieza periódica del rate limit store
setInterval(
  () => {
    const now = Date.now()
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  },
  5 * 60 * 1000,
) // Limpiar cada 5 minutos
