import { type NextRequest, NextResponse } from "next/server"

// Configuración de cabeceras de seguridad
export const securityHeaders = {
  contentSecurityPolicy: {
    production: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https: blob:;
      connect-src 'self' https://api.stripe.com https://www.google-analytics.com https://vitals.vercel-insights.com;
      frame-src https://js.stripe.com https://hooks.stripe.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `,
    development: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com;
      style-src 'self' 'unsafe-inline';
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https: blob:;
      connect-src 'self' ws: wss: https://vitals.vercel-insights.com;
      frame-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
    `,
  },
  frameOptions: "DENY",
  contentTypeOptions: "nosniff",
  referrerPolicy: "strict-origin-when-cross-origin",
  xssProtection: "1; mode=block",
  permissionsPolicy: "camera=(), microphone=(), geolocation=()",
  strictTransportSecurity: "max-age=31536000; includeSubDomains; preload",
  crossOriginEmbedderPolicy: "require-corp",
  crossOriginOpenerPolicy: "same-origin",
  crossOriginResourcePolicy: "same-origin",
}

// Función para aplicar cabeceras de seguridad a una respuesta
export function applySecurityHeaders(response: NextResponse): NextResponse {
  const isDev = process.env.NODE_ENV === "development"

  // Content Security Policy
  const csp = isDev
    ? securityHeaders.contentSecurityPolicy.development
    : securityHeaders.contentSecurityPolicy.production

  response.headers.set("Content-Security-Policy", csp.replace(/\s{2,}/g, " ").trim())

  // Otras cabeceras de seguridad
  response.headers.set("X-Frame-Options", securityHeaders.frameOptions)
  response.headers.set("X-Content-Type-Options", securityHeaders.contentTypeOptions)
  response.headers.set("Referrer-Policy", securityHeaders.referrerPolicy)
  response.headers.set("X-XSS-Protection", securityHeaders.xssProtection)
  response.headers.set("Permissions-Policy", securityHeaders.permissionsPolicy)

  // Solo aplicar HSTS en producción con HTTPS
  if (!isDev) {
    response.headers.set("Strict-Transport-Security", securityHeaders.strictTransportSecurity)
  }

  // Cross-Origin Policies (más permisivo en desarrollo)
  if (!isDev) {
    response.headers.set("Cross-Origin-Embedder-Policy", securityHeaders.crossOriginEmbedderPolicy)
    response.headers.set("Cross-Origin-Opener-Policy", securityHeaders.crossOriginOpenerPolicy)
    response.headers.set("Cross-Origin-Resource-Policy", securityHeaders.crossOriginResourcePolicy)
  }

  // DNS Prefetch Control
  response.headers.set("X-DNS-Prefetch-Control", "on")

  return response
}

// Función para generar nonce para CSP (si se necesita)
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Función para validar origen de requests
export function isValidOrigin(origin: string | null, host?: string): boolean {
  if (!origin) return true // Permitir requests sin origin (navegadores)

  const allowedOrigins = [
    `https://${host}`,
    `http://${host}`,
    "http://localhost:3000",
    "http://localhost:3001",
    "https://localhost:3000",
    "https://localhost:3001",
    // Agregar más orígenes de desarrollo si es necesario
  ]

  return allowedOrigins.includes(origin)
}

// Función para detectar user agents sospechosos (más específica)
export function isSuspiciousUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false // No bloquear si no hay user agent

  // Solo bloquear user agents claramente maliciosos
  const maliciousPatterns = [
    /sqlmap/i,
    /nikto/i,
    /nmap/i,
    /masscan/i,
    /zap/i,
    /burp/i,
    /acunetix/i,
    /nessus/i,
    /openvas/i,
    /w3af/i,
    /dirbuster/i,
    /gobuster/i,
    /ffuf/i,
    /wfuzz/i,
  ]

  return maliciousPatterns.some((pattern) => pattern.test(userAgent))
}

// Función para extraer información de IP
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const cfIP = request.headers.get("cf-connecting-ip")

  if (cfIP) {
    return cfIP
  }

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  // Fallback para desarrollo local
  return "127.0.0.1"
}

// Función para obtener User Agent
export function getUserAgent(request: NextRequest): string {
  return request.headers.get("user-agent") || "unknown"
}

// Función para validar rate limiting por IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(ip: string, limit = 100, windowMs: number = 15 * 60 * 1000): boolean {
  // Más permisivo para IPs locales
  const isLocal = ["127.0.0.1", "::1", "localhost"].includes(ip)
  if (isLocal) {
    limit = limit * 10 // 10x más permisivo para desarrollo
  }

  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

// Función para verificar si está en rate limit
export function isRateLimitedByIP(ip: string, action: string): boolean {
  return !checkRateLimit(ip, 100, 15 * 60 * 1000)
}

// Limpiar rate limit map periódicamente (solo en servidor)
if (typeof window === "undefined") {
  setInterval(
    () => {
      const now = Date.now()
      for (const [key, record] of rateLimitMap.entries()) {
        if (now > record.resetTime) {
          rateLimitMap.delete(key)
        }
      }
    },
    5 * 60 * 1000,
  ) // Limpiar cada 5 minutos
}

// Función para sanitizar input
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return ""

  return input
    .trim()
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .substring(0, 1000)
}

// Función para validar email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// Función para validar teléfono
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ""))
}

// Función para generar contraseña segura
export function generateSecurePassword(length = 12): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

// Función para validar URLs de redirección
export function isSecureRedirectUrl(url: string, allowedDomains: string[] = []): boolean {
  try {
    const parsedUrl = new URL(url)

    // Solo HTTPS en producción
    if (process.env.NODE_ENV === "production" && parsedUrl.protocol !== "https:") {
      return false
    }

    // Verificar dominios permitidos
    const allowedHosts = [
      "localhost",
      "127.0.0.1",
      process.env.VERCEL_URL,
      process.env.NEXT_PUBLIC_SITE_URL,
      ...allowedDomains,
    ].filter(Boolean)

    return allowedHosts.some((host) => {
      if (!host) return false
      return parsedUrl.hostname === host || parsedUrl.hostname.endsWith(`.${host}`)
    })
  } catch {
    return false
  }
}

// Función para generar headers seguros para diferentes tipos de respuesta
export function getSecureHeaders(type: "html" | "api" | "static" = "html"): Record<string, string> {
  const baseHeaders = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  }

  switch (type) {
    case "api":
      return {
        ...baseHeaders,
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Robots-Tag": "noindex, nofollow",
      }

    case "static":
      return {
        ...baseHeaders,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Cross-Origin-Resource-Policy": "cross-origin",
      }

    case "html":
    default:
      return {
        ...baseHeaders,
        "X-XSS-Protection": "1; mode=block",
      }
  }
}

// Exportar configuración para uso en middleware
export const securityConfig = {
  maxRequestSize: 1024 * 1024, // 1MB
  rateLimits: {
    general: { requests: 1000, windowMs: 15 * 60 * 1000 }, // 1000 req/15min
    auth: { requests: 10, windowMs: 15 * 60 * 1000 }, // 10 req/15min
    api: { requests: 100, windowMs: 15 * 60 * 1000 }, // 100 req/15min
  },
  blockedUserAgents: [/sqlmap/i, /nikto/i, /nmap/i, /masscan/i],
  allowedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://localhost:3000",
    "https://localhost:3001",
  ],
}

// Validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// Validar contraseña fuerte
export function isStrongPassword(password: string): boolean {
  // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return strongPasswordRegex.test(password)
}

// Detectar patrones de ataque comunes
export function detectAttackPatterns(input: string): boolean {
  const attackPatterns = [
    // SQL Injection
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
    /('|"|;|--|\*|\/\*|\*\/)/,

    // XSS
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,

    // Path Traversal
    /\.\.\//g,
    /\.\.\\/g,

    // Command Injection
    /(\||&|;|`|\$\(|\$\{)/,
  ]

  return attackPatterns.some((pattern) => pattern.test(input))
}

// Verificar si la IP está en lista blanca
export function isWhitelistedIP(ip: string): boolean {
  const whitelist = [
    "127.0.0.1",
    "::1",
    "localhost",
    // Agregar IPs de confianza aquí
  ]

  return whitelist.includes(ip)
}

// Crear respuesta de error de seguridad
export function createSecurityErrorResponse(message: string, status = 403): NextResponse {
  return NextResponse.json(
    {
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status },
  )
}

// Middleware de validación de request (más permisivo)
export function validateRequest(request: NextRequest): {
  isValid: boolean
  error?: string
  shouldBlock?: boolean
} {
  const userAgent = request.headers.get("user-agent")
  const origin = request.headers.get("origin")
  const host = request.headers.get("host") || ""

  // Solo bloquear user agents claramente maliciosos
  if (isSuspiciousUserAgent(userAgent)) {
    return {
      isValid: false,
      error: "Malicious user agent detected",
      shouldBlock: true,
    }
  }

  // Verificar origen válido (más permisivo)
  if (origin && !isValidOrigin(origin, host)) {
    return {
      isValid: false,
      error: "Invalid origin",
      shouldBlock: false, // No bloquear, solo rechazar
    }
  }

  // Verificar método HTTP
  const allowedMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"]
  if (!allowedMethods.includes(request.method)) {
    return {
      isValid: false,
      error: "Method not allowed",
      shouldBlock: false,
    }
  }

  return { isValid: true }
}

// Configuración de CORS segura
export function setCORSHeaders(response: NextResponse, origin?: string): NextResponse {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://localhost:3000",
    "https://localhost:3001",
    // Agregar dominios de producción aquí
  ]

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin)
  }

  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
  response.headers.set("Access-Control-Allow-Credentials", "true")
  response.headers.set("Access-Control-Max-Age", "86400")

  return response
}

// Rate limiting simple en memoria
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function isRateLimited(identifier: string, action: string, limit = 5, windowMs = 60000): boolean {
  const key = `${identifier}:${action}`
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return false
  }

  if (record.count >= limit) {
    return true
  }

  record.count++
  return false
}

export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function hashPassword(password: string): string {
  // Implementación básica, en producción usar bcrypt
  return password + "_hashed"
}

export function createSecureToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
