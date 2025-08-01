import { NextResponse } from "next/server"
import { getOrderById, updateOrderStatus } from "@/lib/neon-db"
import { sendEmail } from "@/lib/email-service"
import { getPurchaseConfirmationTemplate, getDownloadTemplate } from "@/lib/email-templates"
import { generateDownloadToken } from "@/lib/download-tokens"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { action, note } = await request.json()
    const orderId = params.id

    // Obtener la orden
    const order = await getOrderById(orderId)
    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
    }

    switch (action) {
      case "complete":
        // Marcar orden como completada
        await updateOrderStatus(orderId, "completed")

        // Generar token de descarga
        const downloadToken = generateDownloadToken({
          orderId: orderId,
          customerEmail: order.customer_email,
          productId: order.product_id,
        })

        const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/download/${downloadToken}`

        // Enviar email de confirmación
        const confirmationTemplate = getPurchaseConfirmationTemplate({
          customerName: order.customer_name,
          productName: order.product_name,
          amount: order.amount,
          currency: order.currency,
          orderId: order.id,
          downloadUrl,
        })

        await sendEmail({
          to: order.customer_email,
          subject: confirmationTemplate.subject,
          html: confirmationTemplate.html,
          text: confirmationTemplate.text,
        })

        // Enviar email de descarga
        const downloadTemplate = getDownloadTemplate({
          customerName: order.customer_name,
          productName: order.product_name,
          downloadUrl,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 7 días
        })

        await sendEmail({
          to: order.customer_email,
          subject: downloadTemplate.subject,
          html: downloadTemplate.html,
          text: downloadTemplate.text,
        })

        return NextResponse.json({
          success: true,
          message: "Orden completada y emails enviados",
        })

      case "refund":
        // Marcar orden como reembolsada
        await updateOrderStatus(orderId, "refunded")

        // Enviar email de reembolso
        await sendEmail({
          to: order.customer_email,
          subject: `Reembolso procesado - ${order.product_name}`,
          html: `
            <h2>Reembolso procesado</h2>
            <p>Hola ${order.customer_name},</p>
            <p>Tu reembolso para <strong>${order.product_name}</strong> ha sido procesado.</p>
            <p>El importe de ${(order.amount / 100).toFixed(2)} ${order.currency.toUpperCase()} será devuelto a tu método de pago original en 5-10 días hábiles.</p>
            <p>Si tienes alguna pregunta, contáctanos.</p>
          `,
          text: `Reembolso procesado\n\nHola ${order.customer_name},\n\nTu reembolso para ${order.product_name} ha sido procesado.\n\nEl importe de ${(order.amount / 100).toFixed(2)} ${order.currency.toUpperCase()} será devuelto a tu método de pago original en 5-10 días hábiles.\n\nSi tienes alguna pregunta, contáctanos.`,
        })

        return NextResponse.json({
          success: true,
          message: "Orden reembolsada y email enviado",
        })

      case "add_note":
        // En una implementación real, guardarías la nota en la base de datos
        console.log(`Nota añadida a orden ${orderId}: ${note}`)

        return NextResponse.json({
          success: true,
          message: "Nota añadida correctamente",
        })

      default:
        return NextResponse.json({ error: "Acción no válida" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error processing order action:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
