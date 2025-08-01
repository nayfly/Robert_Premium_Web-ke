import { logAuditEvent } from "@/lib/supabase"

export interface AuditEventData {
  user_id?: string
  action: string
  table_name?: string
  record_id?: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  ip_address?: string
  user_agent?: string
  session_id?: string
  severity?: "info" | "warning" | "error" | "critical"
  success?: boolean
  error_message?: string
}

export class AuditLogger {
  static async log(eventData: AuditEventData): Promise<void> {
    try {
      await logAuditEvent(eventData)
    } catch (error) {
      console.error("Failed to log audit event:", error)
      // No lanzar error para no interrumpir el flujo principal
    }
  }

  static async logUserAction(
    userId: string,
    action: string,
    details?: {
      table_name?: string
      record_id?: string
      old_values?: Record<string, any>
      new_values?: Record<string, any>
      ip_address?: string
      user_agent?: string
    },
  ): Promise<void> {
    await this.log({
      user_id: userId,
      action,
      table_name: details?.table_name,
      record_id: details?.record_id,
      old_values: details?.old_values,
      new_values: details?.new_values,
      ip_address: details?.ip_address,
      user_agent: details?.user_agent,
      severity: "info",
      success: true,
    })
  }

  static async logError(
    action: string,
    error: Error | string,
    details?: {
      user_id?: string
      table_name?: string
      record_id?: string
      ip_address?: string
      user_agent?: string
    },
  ): Promise<void> {
    await this.log({
      user_id: details?.user_id,
      action,
      table_name: details?.table_name,
      record_id: details?.record_id,
      ip_address: details?.ip_address,
      user_agent: details?.user_agent,
      severity: "error",
      success: false,
      error_message: error instanceof Error ? error.message : error,
    })
  }

  static async logSecurityEvent(
    action: string,
    details: {
      user_id?: string
      ip_address?: string
      user_agent?: string
      severity?: "warning" | "error" | "critical"
      additional_data?: Record<string, any>
    },
  ): Promise<void> {
    await this.log({
      user_id: details.user_id,
      action,
      ip_address: details.ip_address,
      user_agent: details.user_agent,
      severity: details.severity || "warning",
      success: false,
      new_values: details.additional_data,
    })
  }
}

// Función de conveniencia para compatibilidad
export const createAuditLog = AuditLogger.log

export default AuditLogger
