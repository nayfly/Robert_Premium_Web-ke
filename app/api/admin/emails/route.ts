import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import {
  sendOrderConfirmationEmail,
  sendWelcomeEmail,
  sendDownloadReminderEmail,
  sendSupportInfoEmail,
} from "@/lib/email-service"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = (page - 1) * limit

    // Obtener logs de emails con paginación
    const {
      data: logs,
      error,
      count,
    } = await supabase
      .from("email_logs")
      .select("*", { count: "exact" })
      .order("sent_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching email logs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, orderId, emailType } = await request.json()

    if (action === "resend") {
      // Obtener datos de la orden
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select(`
          *,
          downloads(download_token, expires_at, download_count, max_downloads)
        `)
        .eq("id", orderId)
        .single()

      if (orderError || !order) {
        return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
      }

      let result
      switch (emailType) {
        case "confirmation":
          result = await sendOrderConfirmationEmail({
            ...order,
            download_token: order.downloads?.[0]?.download_token,
          })
          break
        case "welcome":
          result = await sendWelcomeEmail(order)
          break
        case "download_reminder":
          result = await sendDownloadReminderEmail({
            ...order,
            download_token: order.downloads?.[0]?.download_token,
          })
          break
        case "support_info":
          result = await sendSupportInfoEmail(order)
          break
        default:
          return NextResponse.json({ error: "Tipo de email no válido" }, { status: 400 })
      }

      return NextResponse.json({ success: result.success, message: result.error || "Email enviado correctamente" })
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 })
  } catch (error) {
    console.error("Error processing email request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
