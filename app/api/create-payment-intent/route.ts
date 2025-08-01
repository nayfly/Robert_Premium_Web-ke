import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createOrder } from "@/lib/supabaseAdmin"

// Inicializar Stripe solo si la clave está disponible
let stripe: Stripe | null = null

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia",
  })
}

export async function POST(request: Request) {
  try {
    // Verificar si Stripe está configurado
    if (!stripe) {
      return NextResponse.json({ error: "Stripe no está configurado. Contacta con el administrador." }, { status: 500 })
    }

    const { amount, currency = "eur", customerInfo, productInfo } = await request.json()

    // Validar datos requeridos
    if (!amount || !customerInfo?.email || !customerInfo?.name) {
      return NextResponse.json(
        { error: "Faltan datos requeridos: amount, customerInfo.email, customerInfo.name" },
        { status: 400 },
      )
    }

    // Validar monto mínimo
    if (amount < 0.5) {
      return NextResponse.json({ error: "El monto mínimo es 0.50 EUR" }, { status: 400 })
    }

    // Crear customer en Stripe si no existe
    let customer
    try {
      const existingCustomers = await stripe.customers.list({
        email: customerInfo.email,
        limit: 1,
      })

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0]
      } else {
        customer = await stripe.customers.create({
          email: customerInfo.email,
          name: customerInfo.name,
          phone: customerInfo.phone,
          metadata: {
            company: customerInfo.company || "",
          },
        })
      }
    } catch (stripeError) {
      console.error("Error creating Stripe customer:", stripeError)
      return NextResponse.json({ error: "Error creando el cliente en Stripe" }, { status: 500 })
    }

    // Crear PaymentIntent
    let paymentIntent
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convertir a centavos
        currency: currency.toLowerCase(),
        customer: customer.id,
        metadata: {
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_company: customerInfo.company || "",
          product_name: productInfo?.name || "Producto Digital",
          product_id: productInfo?.id || "",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      })
    } catch (stripeError) {
      console.error("Error creating PaymentIntent:", stripeError)
      return NextResponse.json({ error: "Error creando el intento de pago" }, { status: 500 })
    }

    // Crear orden en Supabase
    let order
    try {
      order = await createOrder({
        customer_email: customerInfo.email,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_company: customerInfo.company,
        product_name: productInfo?.name || "Producto Digital",
        product_id: productInfo?.id,
        amount: amount,
        currency: currency.toUpperCase(),
        status: "pending",
        stripe_payment_intent_id: paymentIntent.id,
        stripe_customer_id: customer.id,
        metadata: {
          stripe_payment_intent_id: paymentIntent.id,
          stripe_customer_id: customer.id,
          product_info: productInfo,
        },
      })
    } catch (dbError) {
      console.error("Error creating order in database:", dbError)

      // Cancelar el PaymentIntent si no se pudo crear la orden
      try {
        await stripe.paymentIntents.cancel(paymentIntent.id)
      } catch (cancelError) {
        console.error("Error canceling PaymentIntent:", cancelError)
      }

      return NextResponse.json({ error: "Error creando la orden en la base de datos" }, { status: 500 })
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      customerId: customer.id,
      orderId: order.id,
    })
  } catch (error) {
    console.error("Unexpected error in create-payment-intent:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
