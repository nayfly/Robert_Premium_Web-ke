import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { runPrivacyCleanup, getPrivacyStats } from "@/lib/audit-cleanup"

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que el usuario es admin
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Sin permisos de administrador" }, { status: 403 })
    }

    // Ejecutar limpieza de privacidad
    const result = await runPrivacyCleanup()

    return NextResponse.json({
      success: result.success,
      message: `Limpieza completada: ${result.anonymized} IPs anonimizadas, ${result.deleted} logs eliminados`,
      data: result,
    })
  } catch (error) {
    console.error("Error en limpieza de privacidad:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que el usuario es admin
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Sin permisos de administrador" }, { status: 403 })
    }

    // Obtener estadísticas de privacidad
    const stats = await getPrivacyStats()

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error obteniendo estadísticas de privacidad:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
