// Tipos para eventos de seguridad
interface SecurityEvent {
  id?: string
  timestamp?: string
  type:
    | "login_attempt"
    | "data_access"
    | "system_error"
    | "security_violation"
    | "auth_failure"
    | "suspicious_activity"
    | "admin_action"
    | "rate_limit"
  severity: "low" | "medium" | "high" | "critical"
  ip?: string
  userAgent?: string
  userId?: string
  details?: any
  success?: boolean
}

interface IPBlock {
  ip: string
  blockedUntil: Date
  failureCount: number
  reason: string
}

interface RateLimit {
  count: number
  resetTime: Date
}

// Almacenamiento en memoria para eventos de seguridad
const securityLog: SecurityEvent[] = []
const ipBlocks = new Map<string, IPBlock>()
const rateLimitMap = new Map<string, RateLimit>()

// Configuración
const MAX_FAILURE_ATTEMPTS = 10
const BLOCK_DURATION_MINUTES = 60
const RATE_LIMIT_WINDOW_MINUTES = 15
const MAX_REQUESTS_PER_WINDOW = 1000

// IPs que nunca deben ser bloqueadas (localhost, desarrollo)
const WHITELIST_IPS = ["127.0.0.1", "::1", "localhost", "0.0.0.0"]

// Función principal para registrar eventos de seguridad
export function logSecurityEvent(event: SecurityEvent): void {
  const timestamp = new Date().toISOString()
  const logEntry = {
    id: Math.random().toString(36).substring(2),
    timestamp,
    ...event,
  }

  securityLog.push(logEntry)

  // Solo log críticos en consola para evitar spam
  if (event.severity === "critical") {
    console.error("🚨 CRITICAL SECURITY EVENT:", logEntry)
  } else if (event.severity === "high" && !event.ip?.includes("127.0.0.1")) {
    console.warn("⚠️ High Security Event:", logEntry)
  }

  // Mantener solo los últimos 1000 eventos en memoria
  if (securityLog.length > 1000) {
    securityLog.splice(0, securityLog.length - 1000)
  }
}

// Función específica para fallos de autenticación
export function logAuthFailure(ip: string, userAgent: string | null, details: any): void {
  logSecurityEvent({
    type: "auth_failure",
    severity: "medium",
    ip,
    userAgent: userAgent || undefined,
    details,
    success: false,
  })
}

// Función para actividad sospechosa
export function logSuspiciousActivity(ip: string, userAgent?: string | null, details?: any): void {
  // No registrar como sospechoso si es IP local
  if (WHITELIST_IPS.includes(ip)) {
    return
  }

  logSecurityEvent({
    type: "suspicious_activity",
    severity: "high",
    ip,
    userAgent: userAgent || undefined,
    details: details || {},
    success: false,
  })
}

// Función para acciones de administrador
export function logAdminAction(
  userId: string,
  ip: string,
  action: string,
  details?: any,
  userAgent?: string | null,
): void {
  logSecurityEvent({
    type: "admin_action",
    severity: "low",
    ip,
    userAgent: userAgent || undefined,
    userId,
    details: { action, ...details },
    success: true,
  })
}

// Función para rate limiting
export function logRateLimit(ip: string, userAgent?: string | null, details?: any): void {
  logSecurityEvent({
    type: "rate_limit",
    severity: "medium",
    ip,
    userAgent: userAgent || undefined,
    details: details || {},
    success: false,
  })
}

// Verificar si una IP está bloqueada
export function checkIPBlocked(ip: string): boolean {
  // Nunca bloquear IPs de la whitelist
  if (WHITELIST_IPS.includes(ip)) {
    return false
  }

  const block = ipBlocks.get(ip)
  if (!block) return false

  // Verificar si el bloqueo ha expirado
  if (new Date() > block.blockedUntil) {
    ipBlocks.delete(ip)
    return false
  }

  return true
}

// Alias para compatibilidad
export const isIPBlocked = checkIPBlocked

// Bloquear IP manualmente
export function blockIP(ip: string, reason = "Manual block"): void {
  // No bloquear IPs de la whitelist
  if (WHITELIST_IPS.includes(ip)) {
    return
  }

  const now = new Date()
  ipBlocks.set(ip, {
    ip,
    blockedUntil: new Date(now.getTime() + BLOCK_DURATION_MINUTES * 60 * 1000),
    failureCount: 1,
    reason,
  })

  logSecurityEvent({
    type: "suspicious_activity",
    severity: "high",
    ip,
    details: { action: "ip_blocked", reason },
    success: true,
  })
}

// Actualizar contador de fallos de IP
function updateIPFailureCount(ip: string): void {
  // No contar fallos para IPs de la whitelist
  if (WHITELIST_IPS.includes(ip)) {
    return
  }

  const existing = ipBlocks.get(ip)
  const now = new Date()

  if (existing) {
    existing.failureCount++
    if (existing.failureCount >= MAX_FAILURE_ATTEMPTS) {
      existing.blockedUntil = new Date(now.getTime() + BLOCK_DURATION_MINUTES * 60 * 1000)
      existing.reason = `Auto-blocked after ${existing.failureCount} failed attempts`

      logSecurityEvent({
        type: "suspicious_activity",
        severity: "critical",
        ip,
        details: {
          reason: "IP auto-blocked",
          failureCount: existing.failureCount,
          blockedUntil: existing.blockedUntil,
        },
        success: false,
      })
    }
  } else {
    ipBlocks.set(ip, {
      ip,
      blockedUntil: new Date(now.getTime() + BLOCK_DURATION_MINUTES * 60 * 1000),
      failureCount: 1,
      reason: "First failure recorded",
    })
  }
}

// Verificar rate limiting
export function checkRateLimit(ip: string, maxRequests = MAX_REQUESTS_PER_WINDOW): boolean {
  // Rate limiting más permisivo para IPs locales
  if (WHITELIST_IPS.includes(ip)) {
    maxRequests = maxRequests * 10 // 10x más permisivo para desarrollo
  }

  const now = new Date()
  const key = ip
  const existing = rateLimitMap.get(key)

  if (existing) {
    if (now > existing.resetTime) {
      // Ventana expirada, resetear
      rateLimitMap.set(key, {
        count: 1,
        resetTime: new Date(now.getTime() + RATE_LIMIT_WINDOW_MINUTES * 60 * 1000),
      })
      return true
    }

    if (existing.count >= maxRequests) {
      // Solo log si no es IP local
      if (!WHITELIST_IPS.includes(ip)) {
        logRateLimit(ip, undefined, {
          currentCount: existing.count,
          limit: maxRequests,
        })
      }
      return false
    }

    existing.count++
    return true
  } else {
    // Primera request en esta ventana
    rateLimitMap.set(key, {
      count: 1,
      resetTime: new Date(now.getTime() + RATE_LIMIT_WINDOW_MINUTES * 60 * 1000),
    })
    return true
  }
}

// Obtener eventos de seguridad
export function getSecurityLogs(): SecurityEvent[] {
  return securityLog.slice(-100) // Últimos 100 eventos
}

// Obtener eventos recientes
export function getRecentSecurityEvents(limit = 100): SecurityEvent[] {
  return securityLog.slice(-limit)
}

// Obtener IPs bloqueadas
export function getBlockedIPs(): IPBlock[] {
  const now = new Date()
  const activeBlocks: IPBlock[] = []

  for (const [ip, block] of ipBlocks.entries()) {
    if (now <= block.blockedUntil) {
      activeBlocks.push(block)
    }
  }

  return activeBlocks
}

// Desbloquear IP manualmente
export function unblockIP(ip: string): boolean {
  const wasBlocked = ipBlocks.has(ip)
  ipBlocks.delete(ip)

  if (wasBlocked) {
    logSecurityEvent({
      type: "admin_action",
      severity: "low",
      ip,
      details: { action: "ip_unblocked" },
      success: true,
    })
  }

  return wasBlocked
}

// Limpiar eventos antiguos (ejecutar periódicamente)
export function cleanupOldEvents(): void {
  const now = new Date()
  const cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000) // 24 horas

  // Limpiar eventos antiguos
  const validEvents = securityLog.filter((event) => {
    if (!event.timestamp) return false
    return new Date(event.timestamp) > cutoffTime
  })

  securityLog.length = 0
  securityLog.push(...validEvents)

  // Limpiar bloqueos expirados
  for (const [ip, block] of ipBlocks.entries()) {
    if (now > block.blockedUntil) {
      ipBlocks.delete(ip)
    }
  }

  // Limpiar rate limits expirados
  for (const [key, limit] of rateLimitMap.entries()) {
    if (now > limit.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}

// Estadísticas de seguridad
export function getSecurityStats() {
  const now = new Date()
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const recentEvents = securityLog.filter((event) => {
    if (!event.timestamp) return false
    return new Date(event.timestamp) > last24h
  })

  return {
    totalEvents: securityLog.length,
    recentEvents: recentEvents.length,
    blockedIPs: Array.from(ipBlocks.values()).filter((block) => now <= block.blockedUntil).length,
    eventsByType: recentEvents.reduce(
      (acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
    eventsBySeverity: recentEvents.reduce(
      (acc, event) => {
        acc[event.severity] = (acc[event.severity] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
  }
}

// Función para limpiar los registros de seguridad
export function clearSecurityLogs(): void {
  securityLog.length = 0
}

// Limpiar automáticamente cada 5 minutos (solo en servidor)
if (typeof window === "undefined") {
  setInterval(cleanupOldEvents, 5 * 60 * 1000)
}
