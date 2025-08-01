import { NextResponse } from "next/server"
import { cleanupTestData } from "@/lib/supabase"

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")

    const result = await cleanupTestData(orderId || undefined)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("Error in cleanup:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
