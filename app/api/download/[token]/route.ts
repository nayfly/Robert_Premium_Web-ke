import { NextResponse } from "next/server"
import { getDownloadByToken, incrementDownloadCount, logAuditEvent } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { token: string } }) {
  try {
    const { token } = params

    // Obtener información de descarga
    const download = await getDownloadByToken(token)

    if (!download) {
      await logAuditEvent({
        action: "DOWNLOAD_TOKEN_INVALID",
        table_name: "downloads",
        severity: "warning",
        success: false,
        error_message: "Token de descarga inválido",
        new_values: { token },
      })

      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 404 })
    }

    // Verificar si el token ha expirado
    if (new Date(download.expires_at) < new Date()) {
      await logAuditEvent({
        action: "DOWNLOAD_TOKEN_EXPIRED",
        table_name: "downloads",
        record_id: download.id,
        severity: "warning",
        success: false,
        error_message: "Token de descarga expirado",
        new_values: { token, expires_at: download.expires_at },
      })

      return NextResponse.json({ error: "Token expirado" }, { status: 410 })
    }

    // Verificar límite de descargas
    if (download.download_count >= download.max_downloads) {
      await logAuditEvent({
        action: "DOWNLOAD_LIMIT_EXCEEDED",
        table_name: "downloads",
        record_id: download.id,
        severity: "warning",
        success: false,
        error_message: "Límite de descargas alcanzado",
        new_values: {
          token,
          download_count: download.download_count,
          max_downloads: download.max_downloads,
        },
      })

      return NextResponse.json({ error: "Límite de descargas alcanzado" }, { status: 429 })
    }

    // Incrementar contador de descargas
    await incrementDownloadCount(download.id)

    // Log de descarga exitosa
    await logAuditEvent({
      action: "FILE_DOWNLOADED",
      table_name: "downloads",
      record_id: download.id,
      severity: "info",
      success: true,
      new_values: {
        token,
        order_id: download.order_id,
        download_count: download.download_count + 1,
        remaining_downloads: download.max_downloads - download.download_count - 1,
      },
    })

    // En un caso real, aquí servirías el archivo real
    // Por ahora, devolvemos información de la descarga
    return NextResponse.json({
      success: true,
      message: "Descarga autorizada",
      order: download.orders,
      download_info: {
        remaining_downloads: download.max_downloads - download.download_count - 1,
        expires_at: download.expires_at,
      },
      // En producción, esto sería una URL de descarga real o el archivo mismo
      file_info: {
        name: `${download.orders.product_name}.zip`,
        size: "25.4 MB",
        type: "application/zip",
      },
    })
  } catch (error) {
    console.error("Download error:", error)

    await logAuditEvent({
      action: "DOWNLOAD_ERROR",
      table_name: "downloads",
      severity: "error",
      success: false,
      error_message: error instanceof Error ? error.message : "Error desconocido en descarga",
      new_values: { token: params.token },
    })

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
