import { NextResponse } from "next/server"
import { sendTestEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { to, subject, content } = await request.json()

    if (!to || !subject || !content) {
      return NextResponse.json({ error: "Faltan campos requeridos: to, subject, content" }, { status: 400 })
    }

    const result = await sendTestEmail(to, subject, content)

    return NextResponse.json({
      success: true,
      message: "Email de prueba enviado correctamente",
      ...result,
    })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
