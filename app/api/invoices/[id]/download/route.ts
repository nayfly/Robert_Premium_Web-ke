import { NextResponse } from "next/server"
import { supabaseAdmin, logAuditEvent } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Obtener factura
    const { data: invoice, error } = await supabaseAdmin
      .from("invoices")
      .select(
        `
        *,
        orders (*)
      `,
      )
      .eq("id", id)
      .single()

    if (error || !invoice) {
      await logAuditEvent({
        action: "INVOICE_NOT_FOUND",
        table_name: "invoices",
        record_id: id,
        severity: "warning",
        success: false,
        error_message: "Factura no encontrada",
      })

      return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 })
    }

    // Log de descarga de factura
    await logAuditEvent({
      action: "INVOICE_DOWNLOADED",
      table_name: "invoices",
      record_id: id,
      severity: "info",
      success: true,
      new_values: {
        invoice_number: invoice.invoice_number,
        order_id: invoice.order_id,
        customer_email: invoice.orders.customer_email,
      },
    })

    // En un caso real, aquí generarías y servirías el PDF de la factura
    // Por ahora, devolvemos la información de la factura
    return NextResponse.json({
      success: true,
      message: "Factura encontrada",
      invoice: {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        total_amount: invoice.total_amount,
        tax_amount: invoice.tax_amount,
        currency: invoice.currency,
        status: invoice.status,
        created_at: invoice.created_at,
      },
      order: invoice.orders,
      // En producción, esto sería el PDF real o una URL de descarga
      pdf_info: {
        filename: `${invoice.invoice_number}.pdf`,
        size: "156 KB",
        type: "application/pdf",
      },
    })
  } catch (error) {
    console.error("Invoice download error:", error)

    await logAuditEvent({
      action: "INVOICE_DOWNLOAD_ERROR",
      table_name: "invoices",
      record_id: params.id,
      severity: "error",
      success: false,
      error_message: error instanceof Error ? error.message : "Error desconocido",
    })

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
