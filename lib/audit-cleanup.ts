import { supabaseAdmin } from "./supabase"

// Configuración de limpieza automática
const CLEANUP_CONFIG = {
  // Días después de los cuales anonimizar IPs
  ANONYMIZE_IPS_AFTER_DAYS: 90,
  // Días después de los cuales eliminar logs no críticos
  DELETE_LOGS_AFTER_DAYS: 365,
  // Logs críticos que nunca se eliminan
  CRITICAL_SEVERITIES: ["critical", "error"],
}

/**
 * Anonimiza IPs y user agents de logs antiguos
 * Mantiene la funcionalidad pero protege la privacidad
 */
export async function anonymizeOldLogs(): Promise<{ anonymized: number }> {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - CLEANUP_CONFIG.ANONYMIZE_IPS_AFTER_DAYS)

    const { data, error } = await supabaseAdmin
      .from("audit_logs")
      .update({
        ip_address: "xxx.xxx.xxx.xxx",
        user_agent: "anonymized",
      })
      .lt("created_at", cutoffDate.toISOString())
      .not("ip_address", "is", null)
      .select("id")

    if (error) {
      console.error("Error anonimizando logs:", error)
      return { anonymized: 0 }
    }

    const anonymizedCount = data?.length || 0

    // Log de la operación de limpieza
    await supabaseAdmin.from("audit_logs").insert({
      action: "PRIVACY_ANONYMIZE_IPS",
      table_name: "audit_logs",
      new_values: {
        anonymized_count: anonymizedCount,
        days_threshold: CLEANUP_CONFIG.ANONYMIZE_IPS_AFTER_DAYS,
      },
      severity: "info",
      success: true,
      created_at: new Date().toISOString(),
    })

    return { anonymized: anonymizedCount }
  } catch (error) {
    console.error("Error en anonymizeOldLogs:", error)
    return { anonymized: 0 }
  }
}

/**
 * Elimina logs antiguos no críticos
 * Mantiene solo lo esencial para auditoría
 */
export async function cleanupOldLogs(): Promise<{ deleted: number }> {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - CLEANUP_CONFIG.DELETE_LOGS_AFTER_DAYS)

    const { data, error } = await supabaseAdmin
      .from("audit_logs")
      .delete()
      .lt("created_at", cutoffDate.toISOString())
      .not("severity", "in", `(${CLEANUP_CONFIG.CRITICAL_SEVERITIES.map((s) => `'${s}'`).join(",")})`)
      .select("id")

    if (error) {
      console.error("Error eliminando logs antiguos:", error)
      return { deleted: 0 }
    }

    const deletedCount = data?.length || 0

    // Log de la operación de limpieza
    await supabaseAdmin.from("audit_logs").insert({
      action: "PRIVACY_CLEANUP_OLD_LOGS",
      table_name: "audit_logs",
      new_values: {
        deleted_count: deletedCount,
        days_threshold: CLEANUP_CONFIG.DELETE_LOGS_AFTER_DAYS,
        preserved_severities: CLEANUP_CONFIG.CRITICAL_SEVERITIES,
      },
      severity: "info",
      success: true,
      created_at: new Date().toISOString(),
    })

    return { deleted: deletedCount }
  } catch (error) {
    console.error("Error en cleanupOldLogs:", error)
    return { deleted: 0 }
  }
}

/**
 * Ejecuta todas las tareas de limpieza de privacidad
 */
export async function runPrivacyCleanup(): Promise<{
  anonymized: number
  deleted: number
  success: boolean
}> {
  try {
    console.log("🧹 Iniciando limpieza de privacidad...")

    const [anonymizeResult, cleanupResult] = await Promise.all([anonymizeOldLogs(), cleanupOldLogs()])

    console.log(`✅ Limpieza completada:`)
    console.log(`   - IPs anonimizadas: ${anonymizeResult.anonymized}`)
    console.log(`   - Logs eliminados: ${cleanupResult.deleted}`)

    return {
      anonymized: anonymizeResult.anonymized,
      deleted: cleanupResult.deleted,
      success: true,
    }
  } catch (error) {
    console.error("❌ Error en limpieza de privacidad:", error)
    return {
      anonymized: 0,
      deleted: 0,
      success: false,
    }
  }
}

/**
 * Obtiene estadísticas de privacidad del sistema
 */
export async function getPrivacyStats(): Promise<{
  totalLogs: number
  anonymizedLogs: number
  oldestLog: string | null
  criticalLogs: number
}> {
  try {
    const [totalResult, anonymizedResult, oldestResult, criticalResult] = await Promise.all([
      // Total de logs
      supabaseAdmin
        .from("audit_logs")
        .select("id", { count: "exact", head: true }),

      // Logs anonimizados
      supabaseAdmin
        .from("audit_logs")
        .select("id", { count: "exact", head: true })
        .eq("ip_address", "xxx.xxx.xxx.xxx"),

      // Log más antiguo
      supabaseAdmin
        .from("audit_logs")
        .select("created_at")
        .order("created_at", { ascending: true })
        .limit(1),

      // Logs críticos
      supabaseAdmin
        .from("audit_logs")
        .select("id", { count: "exact", head: true })
        .in("severity", CLEANUP_CONFIG.CRITICAL_SEVERITIES),
    ])

    return {
      totalLogs: totalResult.count || 0,
      anonymizedLogs: anonymizedResult.count || 0,
      oldestLog: oldestResult.data?.[0]?.created_at || null,
      criticalLogs: criticalResult.count || 0,
    }
  } catch (error) {
    console.error("Error obteniendo estadísticas de privacidad:", error)
    return {
      totalLogs: 0,
      anonymizedLogs: 0,
      oldestLog: null,
      criticalLogs: 0,
    }
  }
}
