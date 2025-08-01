export type LogLevel = "error" | "warn" | "info" | "debug"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  metadata?: Record<string, any>
  userId?: string
  sessionId?: string
  requestId?: string
}

class Logger {
  private serviceName = "robert-software"
  private environment: string = process.env.NODE_ENV || "development"

  constructor() {
    // Configurar captura de errores globales
    if (typeof window !== "undefined") {
      window.addEventListener("error", this.handleGlobalError.bind(this))
      window.addEventListener("unhandledrejection", this.handleUnhandledRejection.bind(this))
    }
  }

  private async sendLog(entry: LogEntry): Promise<void> {
    try {
      // En desarrollo, solo log a consola
      if (this.environment === "development") {
        this.logToConsole(entry)
        return
      }

      // En producción, enviar a servicio de logging
      await this.sendToLoggingService(entry)

      // También log a consola en casos críticos
      if (entry.level === "error") {
        this.logToConsole(entry)
      }
    } catch (error) {
      console.error("Error enviando log:", error)
      this.logToConsole(entry)
    }
  }

  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`

    switch (entry.level) {
      case "error":
        console.error(prefix, entry.message, entry.metadata)
        break
      case "warn":
        console.warn(prefix, entry.message, entry.metadata)
        break
      case "info":
        console.info(prefix, entry.message, entry.metadata)
        break
      case "debug":
        console.debug(prefix, entry.message, entry.metadata)
        break
    }
  }

  private async sendToLoggingService(entry: LogEntry): Promise<void> {
    try {
      const response = await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...entry,
          service: this.serviceName,
          environment: this.environment,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      // Fallback a consola si el servicio de logging falla
      console.error("Error en servicio de logging:", error)
    }
  }

  private createLogEntry(level: LogLevel, message: string, metadata?: Record<string, any>, userId?: string): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
      userId,
      sessionId: this.getSessionId(),
      requestId: this.getRequestId(),
    }
  }

  private getSessionId(): string {
    if (typeof window === "undefined") return "server"

    let sessionId = sessionStorage.getItem("sessionId")
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem("sessionId", sessionId)
    }
    return sessionId
  }

  private getRequestId(): string {
    // En el cliente, generar ID único por operación
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private handleGlobalError(event: ErrorEvent): void {
    this.error("Error global capturado", {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
    })
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent): void {
    this.error("Promise rejection no manejada", {
      reason: event.reason,
      stack: event.reason?.stack,
    })
  }

  // Métodos públicos para logging
  async error(message: string, metadata?: Record<string, any>, userId?: string): Promise<void> {
    const entry = this.createLogEntry("error", message, metadata, userId)
    await this.sendLog(entry)
  }

  async warn(message: string, metadata?: Record<string, any>, userId?: string): Promise<void> {
    const entry = this.createLogEntry("warn", message, metadata, userId)
    await this.sendLog(entry)
  }

  async info(message: string, metadata?: Record<string, any>, userId?: string): Promise<void> {
    const entry = this.createLogEntry("info", message, metadata, userId)
    await this.sendLog(entry)
  }

  async debug(message: string, metadata?: Record<string, any>, userId?: string): Promise<void> {
    const entry = this.createLogEntry("debug", message, metadata, userId)
    await this.sendLog(entry)
  }

  // Métodos para casos específicos
  async logUserAction(action: string, userId: string, metadata?: Record<string, any>): Promise<void> {
    await this.info(`Usuario realizó acción: ${action}`, { action, ...metadata }, userId)
  }

  async logAPICall(
    method: string,
    endpoint: string,
    statusCode: number,
    duration?: number,
    userId?: string,
  ): Promise<void> {
    const level: LogLevel = statusCode >= 400 ? "error" : statusCode >= 300 ? "warn" : "info"
    await this.sendLog(
      this.createLogEntry(
        level,
        `API ${method} ${endpoint}`,
        {
          method,
          endpoint,
          statusCode,
          duration,
        },
        userId,
      ),
    )
  }

  async logPerformance(operation: string, duration: number, metadata?: Record<string, any>): Promise<void> {
    const level: LogLevel = duration > 5000 ? "warn" : "info"
    await this.sendLog(
      this.createLogEntry(level, `Performance: ${operation}`, {
        operation,
        duration,
        ...metadata,
      }),
    )
  }

  async logSecurityEvent(
    event: string,
    severity: "low" | "medium" | "high" | "critical",
    metadata?: Record<string, any>,
  ): Promise<void> {
    const level: LogLevel = severity === "critical" ? "error" : severity === "high" ? "warn" : "info"
    await this.sendLog(
      this.createLogEntry(level, `Evento de seguridad: ${event}`, {
        securityEvent: event,
        severity,
        ...metadata,
      }),
    )
  }
}

// Instancia singleton
export const logger = new Logger()

// Helper para medir rendimiento
export function measurePerformance<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>,
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const start = performance.now()

    try {
      const result = await fn()
      const duration = performance.now() - start

      await logger.logPerformance(operation, duration, metadata)
      resolve(result)
    } catch (error) {
      const duration = performance.now() - start

      await logger.error(`Error en operación: ${operation}`, {
        operation,
        duration,
        error: error instanceof Error ? error.message : String(error),
        ...metadata,
      })

      reject(error)
    }
  })
}

// Helper para logging estructurado
export const structuredLogger = {
  request: (req: any, metadata?: Record<string, any>) => {
    return logger.info("HTTP Request", {
      method: req.method,
      url: req.url,
      userAgent: req.headers?.["user-agent"],
      ip: req.headers?.["x-forwarded-for"] || req.connection?.remoteAddress,
      ...metadata,
    })
  },

  database: (operation: string, table: string, duration?: number, error?: any) => {
    if (error) {
      return logger.error(`DB Error: ${operation}`, {
        operation,
        table,
        error: error.message,
        duration,
      })
    } else {
      return logger.info(`DB Operation: ${operation}`, {
        operation,
        table,
        duration,
      })
    }
  },

  auth: (event: string, userId?: string, metadata?: Record<string, any>) => {
    return logger.info(`Auth: ${event}`, { authEvent: event, ...metadata }, userId)
  },

  payment: (event: string, amount?: number, currency?: string, metadata?: Record<string, any>) => {
    return logger.info(`Payment: ${event}`, {
      paymentEvent: event,
      amount,
      currency,
      ...metadata,
    })
  },
}
