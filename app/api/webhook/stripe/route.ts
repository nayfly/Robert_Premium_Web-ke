import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import {
  supabaseAdmin,
  updateOrderStatus,
  createDownloadToken,
  createInvoice,
  logAuditEvent,
} from "@/lib/supabaseAdmin"
import { sendOrderConfirmationEmail } from "@/lib/email-service"

// Configuración básica de Stripe sin inicializar el cliente aquí
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    // Verificar que tenemos el webhook secret
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET no configurado")
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
    }

    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      console.error("No signature provided")
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    // En desarrollo, simular el procesamiento del webhook
    if (process.env.NODE_ENV === "development") {
      console.log("🔄 [SIMULADO] Procesando webhook de Stripe")

      // Simular un evento de pago exitoso
      const mockEvent = {
        type: "payment_intent.succeeded",
        data: {
          object: {
            id: "pi_test_" + Date.now(),
            amount: 2999, // €29.99
            currency: "eur",
            status: "succeeded",
          },
        },
      }

      await handlePaymentSuccess(mockEvent.data.object)

      return NextResponse.json({ received: true, simulated: true })
    }

    // En producción, aquí iría la verificación real del webhook
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    console.log("Webhook de Stripe recibido (producción)")

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error en webhook de Stripe:", error)

    await logAuditEvent({
      action: "STRIPE_WEBHOOK_ERROR",
      severity: "error",
      success: false,
      error_message: error instanceof Error ? error.message : "Error desconocido en webhook",
    })

    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  try {
    console.log("Procesando pago exitoso:", paymentIntent.id)

    // En desarrollo, crear una orden de prueba
    if (process.env.NODE_ENV === "development") {
      const mockOrder = {
        id: "order_" + Date.now(),
        customer_name: "Cliente de Prueba",
        customer_email: "test@ejemplo.com",
        product_name: "Producto de Prueba",
        amount: paymentIntent.amount / 100, // Convertir de centavos
        currency: paymentIntent.currency.toUpperCase(),
        status: "pending",
        created_at: new Date().toISOString(),
      }

      // Simular actualización de estado
      console.log("📝 Actualizando estado de orden:", mockOrder.id)

      // Simular creación de token de descarga
      const mockToken = {
        download_token: "token_" + Math.random().toString(36).substring(2),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }

      console.log("🔗 Token de descarga creado:", mockToken.download_token)

      // Simular envío de email
      try {
        await sendOrderConfirmationEmail({
          ...mockOrder,
          download_token: mockToken.download_token,
        })
        console.log("📧 Email de confirmación enviado")
      } catch (emailError) {
        console.error("Error enviando email:", emailError)
      }

      // Log de auditoría
      await logAuditEvent({
        action: "PAYMENT_COMPLETED_SIMULATED",
        severity: "info",
        success: true,
        new_values: {
          payment_intent_id: paymentIntent.id,
          order_id: mockOrder.id,
          amount: mockOrder.amount,
        },
      })

      return
    }

    // En producción, buscar la orden real
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("stripe_payment_intent_id", paymentIntent.id)
      .single()

    if (orderError || !order) {
      console.error("Orden no encontrada para payment intent:", paymentIntent.id)
      return
    }

    // Actualizar estado de la orden
    await updateOrderStatus(order.id, "completed")

    // Crear token de descarga
    const downloadToken = await createDownloadToken(order.id)

    // Crear factura
    const invoice = await createInvoice(order)

    // Enviar email de confirmación
    try {
      await sendOrderConfirmationEmail({
        ...order,
        download_token: downloadToken.download_token,
      })
    } catch (emailError) {
      console.error("Error enviando email de confirmación:", emailError)
    }

    // Log de auditoría
    await logAuditEvent({
      action: "PAYMENT_COMPLETED",
      table_name: "orders",
      record_id: order.id,
      severity: "info",
      success: true,
      new_values: {
        payment_intent_id: paymentIntent.id,
        download_token: downloadToken.download_token,
        invoice_id: invoice.id,
      },
    })

    console.log("Pago procesado exitosamente para orden:", order.id)
  } catch (error) {
    console.error("Error manejando pago exitoso:", error)
    throw error
  }
}
