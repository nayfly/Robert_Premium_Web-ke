import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("project_id")
    const publicOnly = searchParams.get("public") === "true"

    // Obtener perfil del usuario
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    let query = supabase.from("feedback").select(`
      *,
      users!feedback_user_id_fkey(name, email),
      projects(name)
    `)

    if (publicOnly) {
      query = query.eq("is_public", true)
    } else if (profile?.role === "cliente") {
      query = query.eq("user_id", user.id)
    }

    if (projectId) {
      query = query.eq("project_id", projectId)
    }

    const { data: feedback, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error obteniendo feedback:", error)
      return NextResponse.json({ error: "Error obteniendo feedback" }, { status: 500 })
    }

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("Error en GET /api/feedback:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { project_id, rating, comment, category = "overall", is_public = false } = await request.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating debe estar entre 1 y 5" }, { status: 400 })
    }

    // Verificar que el proyecto pertenece al usuario (si es cliente)
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (profile?.role === "cliente" && project_id) {
      const { data: project } = await supabase.from("projects").select("client_id").eq("id", project_id).single()

      if (!project || project.client_id !== user.id) {
        return NextResponse.json({ error: "No tienes acceso a este proyecto" }, { status: 403 })
      }
    }

    const { data: feedback, error } = await supabase
      .from("feedback")
      .insert({
        user_id: user.id,
        project_id,
        rating,
        comment,
        category,
        is_public,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creando feedback:", error)
      return NextResponse.json({ error: "Error creando feedback" }, { status: 500 })
    }

    // Notificar a admins sobre nuevo feedback
    if (rating <= 3) {
      // Feedback negativo
      const { data: admins } = await supabase.from("users").select("id").eq("role", "admin")

      if (admins) {
        const notifications = admins.map((admin) => ({
          user_id: admin.id,
          title: "Feedback Negativo Recibido",
          message: `Se ha recibido feedback con ${rating} estrellas que requiere atención`,
          type: "warning",
        }))

        await supabase.from("notifications").insert(notifications)
      }
    }

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("Error en POST /api/feedback:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
