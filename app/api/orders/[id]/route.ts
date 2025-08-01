import { NextResponse } from "next/server"
import { getOrderById } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const order = await getOrderById(params.id)

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "Orden no encontrada",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Orden encontrada",
      data: order,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
        details: error,
      },
      { status: 500 },
    )
  }
}
