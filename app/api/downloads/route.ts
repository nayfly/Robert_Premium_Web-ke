import { type NextRequest, NextResponse } from "next/server"
import { getDownloadByToken, incrementDownloadCount } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token requerido" }, { status: 400 })
    }

    const download = await getDownloadByToken(token)
    if (!download) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 404 })
    }

    // Verificar si el token ha expirado
    if (new Date(download.expires_at) < new Date()) {
      return NextResponse.json({ error: "Token expirado" }, { status: 410 })
    }

    // Verificar límite de descargas
    if (download.download_count >= download.max_downloads) {
      return NextResponse.json({ error: "Límite de descargas alcanzado" }, { status: 429 })
    }

    // Incrementar contador de descargas
    await incrementDownloadCount(download.id)

    // En un caso real, aquí generarías o servirías el archivo
    // Por ahora, devolvemos información del pedido
    return NextResponse.json({
      success: true,
      order: download.orders,
      download_info: {
        remaining_downloads: download.max_downloads - download.download_count - 1,
        expires_at: download.expires_at,
      },
      // En producción, esto sería una URL de descarga real
      download_url: `/api/files/download/${token}`,
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
