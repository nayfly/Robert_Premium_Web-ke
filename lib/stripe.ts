import Stripe from "stripe"

// Configuración de Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key"

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20",
  typescript: true,
})

// Función para crear un Payment Intent
export async function createPaymentIntent(params: {
  amount: number // en centavos
  currency: string
  customerEmail?: string
  metadata?: Record<string, string>
}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: params.customerEmail,
      metadata: params.metadata || {},
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error) {
    console.error("Error creando Payment Intent:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

// Función para confirmar un pago
export async function confirmPayment(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return {
      success: true,
      status: paymentIntent.status,
      paymentIntent,
    }
  } catch (error) {
    console.error("Error confirmando pago:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

// Función para crear un cliente en Stripe
export async function createStripeCustomer(params: {
  email: string
  name?: string
  metadata?: Record<string, string>
}) {
  try {
    const customer = await stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: params.metadata || {},
    })

    return {
      success: true,
      customer,
    }
  } catch (error) {
    console.error("Error creando cliente Stripe:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

// Función para crear una factura
export async function createInvoice(params: {
  customerId: string
  items: Array<{
    description: string
    amount: number
    quantity?: number
  }>
  metadata?: Record<string, string>
}) {
  try {
    // Crear los items de la factura
    for (const item of params.items) {
      await stripe.invoiceItems.create({
        customer: params.customerId,
        amount: item.amount,
        currency: "eur",
        description: item.description,
        quantity: item.quantity || 1,
      })
    }

    // Crear la factura
    const invoice = await stripe.invoices.create({
      customer: params.customerId,
      auto_advance: true,
      metadata: params.metadata || {},
    })

    // Finalizar la factura
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)

    return {
      success: true,
      invoice: finalizedInvoice,
    }
  } catch (error) {
    console.error("Error creando factura:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

// Función para obtener información de un pago
export async function getPaymentDetails(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ["charges.data.receipt_url"],
    })

    return {
      success: true,
      paymentIntent,
    }
  } catch (error) {
    console.error("Error obteniendo detalles del pago:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

// Función para procesar webhooks de Stripe
export async function processStripeWebhook(
  body: string,
  signature: string,
): Promise<{ success: boolean; event?: Stripe.Event; error?: string }> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return {
      success: false,
      error: "Webhook secret no configurado",
    }
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    return {
      success: true,
      event,
    }
  } catch (error) {
    console.error("Error procesando webhook:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

// Tipos de productos disponibles
export const PRODUCTS = {
  CONSULTATION: {
    id: "consultation",
    name: "Consulta Estratégica Premium",
    price: 29700, // €297 en centavos
    currency: "eur",
    description: "Análisis completo de tu negocio con plan de automatización personalizado",
  },
  AUTOMATION_BASIC: {
    id: "automation-basic",
    name: "Automatización Básica",
    price: 149700, // €1,497 en centavos
    currency: "eur",
    description: "Automatización de 1-2 procesos clave de tu negocio",
  },
  AUTOMATION_PREMIUM: {
    id: "automation-premium",
    name: "Automatización Premium",
    price: 297000, // €2,970 en centavos
    currency: "eur",
    description: "Automatización completa con integración de sistemas",
  },
  CUSTOM_DEVELOPMENT: {
    id: "custom-development",
    name: "Desarrollo Personalizado",
    price: 497000, // €4,970 en centavos
    currency: "eur",
    description: "Desarrollo de software personalizado para tu negocio",
  },
} as const

export type ProductId = keyof typeof PRODUCTS
