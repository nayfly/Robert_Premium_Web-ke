import { NextResponse } from "next/server"
import { getInvoiceByOrderId, createInvoice } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "orderId es requerido",
        },
        { status: 400 },
      )
    }

    let invoice = await getInvoiceByOrderId(orderId)

    // Si no existe factura, crear una nueva
    if (!invoice) {
      invoice = await createInvoice({
        order_id: orderId,
        total_amount: 299700, // Ejemplo: €2997.00
        tax_amount: 52146, // 21% IVA
        currency: "EUR",
        status: "paid",
      })
    }

    return NextResponse.json({
      success: true,
      message: "Factura obtenida/creada correctamente",
      invoice,
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
