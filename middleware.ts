import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJWT } from "./lib/jwt"
import {
  applySecurityHeaders,
  getClientIP,
  checkRateLimit,
  isSuspiciousUserAgent,
  validateRequest,
  createSecurityErrorResponse,
} from "./lib/security-headers"
import { checkIPBlocked, logSuspiciousActivity, logRateLimit, logSecurityEvent } from "./lib/security-audit"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getClientIP(request)
  const userAgent = request.headers.get("user-agent")
  const origin = request.headers.get("origin")

  // Crear respuesta base
  let response = NextResponse.next()

  // 1. Verificar si la IP está bloqueada (solo para IPs no locales)
  if (checkIPBlocked(ip)) {
    logSuspiciousActivity(ip, userAgent, {
      action: "blocked_ip_access_attempt",
      path: pathname,
    })
    return createSecurityErrorResponse("Access denied", 403)
  }

  // 2. Validar request (más permisivo)
  const validation = validateRequest(request)
  if (!validation.isValid && validation.shouldBlock) {
    logSuspiciousActivity(ip, userAgent, {
      action: "invalid_request",
      error: validation.error,
      path: pathname,
    })
    return createSecurityErrorResponse(validation.error || "Invalid request", 400)
  }

  // 3. Rate Limiting - Aplicar límites según la ruta
  let rateLimit = 1000 // límite por defecto

  if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/contact")) {
    rateLimit = 100 // más estricto para APIs sensibles
  } else if (pathname.startsWith("/api/")) {
    rateLimit = 500 // moderado para otras APIs
  }

  if (!checkRateLimit(ip, rateLimit)) {
    // Solo log si no es IP local
    if (!["127.0.0.1", "::1", "localhost"].includes(ip)) {
      logRateLimit(ip, userAgent, { pathname, limit: rateLimit })
    }

    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "900", // 15 minutos
        "X-RateLimit-Limit": rateLimit.toString(),
        "X-RateLimit-Remaining": "0",
      },
    })
  }

  // 4. User Agent Validation - Solo bloquear user agents claramente maliciosos
  if (pathname.startsWith("/api/") && isSuspiciousUserAgent(userAgent)) {
    logSuspiciousActivity(ip, userAgent, {
      action: "malicious_user_agent",
      pathname,
    })
    return new NextResponse("Forbidden", { status: 403 })
  }

  // 5. Redirecciones de idioma
  if (pathname === "/") {
    const acceptLanguage = request.headers.get("accept-language")
    const preferredLang = acceptLanguage?.includes("en") ? "en" : "es"
    response = NextResponse.redirect(new URL(`/${preferredLang}`, request.url))
  }

  // 6. Aplicar cabeceras de seguridad
  response = applySecurityHeaders(response)

  // 7. Logging de acceso para rutas importantes (solo no locales)
  if (
    (pathname.startsWith("/api/") || pathname.startsWith("/dashboard")) &&
    !["127.0.0.1", "::1", "localhost"].includes(ip)
  ) {
    logSecurityEvent({
      type: "data_access",
      severity: "low",
      ip,
      userAgent: userAgent || undefined,
      details: {
        method: request.method,
        pathname,
        timestamp: new Date().toISOString(),
      },
    })
  }

  // Rutas que no requieren autenticación
  const publicPaths = [
    "/",
    "/es",
    "/en",
    "/es/login",
    "/en/login",
    "/login",
    "/api/auth/login",
    "/api/auth/demo-login",
    "/api/auth/me",
    "/api/user-requests",
    "/legal",
    "/es/legal",
    "/en/legal",
    "/productos",
    "/es/productos",
    "/en/productos",
    "/casos",
  ]

  // Verificar si es una ruta pública
  const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith(path + "/"))

  // Permitir archivos estáticos y API routes públicas
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/user-requests") ||
    pathname.includes(".") ||
    isPublicPath
  ) {
    return response
  }

  // Verificar autenticación para rutas protegidas
  if (pathname.includes("/dashboard")) {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      const loginUrl = new URL("/es/login", request.url)
      const redirectResponse = NextResponse.redirect(loginUrl)
      return applySecurityHeaders(redirectResponse)
    }

    try {
      const decoded = verifyJWT(token)

      if (!decoded) {
        const loginUrl = new URL("/es/login", request.url)
        const redirectResponse = NextResponse.redirect(loginUrl)
        redirectResponse.cookies.delete("auth-token")
        return applySecurityHeaders(redirectResponse)
      }

      // Verificar permisos de rol para rutas específicas
      if (pathname.includes("/dashboard/admin") && decoded.role !== "admin") {
        const dashboardUrl = new URL("/es/dashboard", request.url)
        const redirectResponse = NextResponse.redirect(dashboardUrl)
        return applySecurityHeaders(redirectResponse)
      }

      if (pathname.includes("/dashboard/empleado") && !["admin", "empleado"].includes(decoded.role)) {
        const dashboardUrl = new URL("/es/dashboard", request.url)
        const redirectResponse = NextResponse.redirect(dashboardUrl)
        return applySecurityHeaders(redirectResponse)
      }

      return response
    } catch (error) {
      console.error("Error verifying token:", error)
      const loginUrl = new URL("/es/login", request.url)
      const redirectResponse = NextResponse.redirect(loginUrl)
      redirectResponse.cookies.delete("auth-token")
      return applySecurityHeaders(redirectResponse)
    }
  }

  return response
}

// Configuración del matcher - define qué rutas procesa el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
