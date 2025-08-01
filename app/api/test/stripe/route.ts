import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function GET() {
  try {
    // Verificar que las variables de entorno existan
    const secretKey = process.env.STRIPE_SECRET_KEY
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

    if (!secretKey) {
      return NextResponse.json(
        {
          success: false,
          error: "STRIPE_SECRET_KEY no configurada",
          details: { missingVars: ["STRIPE_SECRET_KEY"] },
        },
        { status: 500 },
      )
    }

    if (!publishableKey) {
      return NextResponse.json(
        {
          success: false,
          error: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no configurada",
          details: { missingVars: ["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"] },
        },
        { status: 500 },
      )
    }

    // Verificar formato de las claves
    if (!secretKey.startsWith("sk_")) {
      return NextResponse.json(
        {
          success: false,
          error: "STRIPE_SECRET_KEY tiene formato inválido (debe empezar con 'sk_')",
        },
        { status: 500 },
      )
    }

    if (!publishableKey.startsWith("pk_")) {
      return NextResponse.json(
        {
          success: false,
          error: "STRIPE_PUBLISHABLE_KEY tiene formato inválido (debe empezar con 'pk_')",
        },
        { status: 500 },
      )
    }

    // Inicializar Stripe
    const stripe = new Stripe(secretKey, {
      apiVersion: "2024-12-18.acacia",
    })

    // Test de conexión con Stripe
    const account = await stripe.accounts.retrieve()

    // Test de creación de producto (solo para verificar permisos)
    const testProduct = await stripe.products.create({
      name: "Test Product - DELETE ME",
      description: "Producto de testing - eliminar",
      metadata: { testing: "true" },
    })

    // Eliminar el producto de testing inmediatamente
    await stripe.products.del(testProduct.id)

    // Verificar webhook secret si existe
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    const webhookStatus = webhookSecret
      ? webhookSecret.startsWith("whsec_")
        ? "válido"
        : "formato inválido"
      : "no configurado"

    return NextResponse.json({
      success: true,
      message: `Stripe configurado correctamente - Cuenta: ${account.display_name || account.id}`,
      details: {
        account: {
          id: account.id,
          display_name: account.display_name,
          country: account.country,
          default_currency: account.default_currency,
          email: account.email,
          type: account.type,
        },
        keys: {
          secret_key: secretKey.substring(0, 8) + "...",
          publishable_key: publishableKey.substring(0, 8) + "...",
          webhook_secret: webhookStatus,
        },
        environment: secretKey.includes("test") ? "test" : "live",
        api_version: "2024-12-18.acacia",
      },
    })
  } catch (error) {
    let errorMessage = "Error desconocido"
    let errorDetails: any = {}

    if (error instanceof Stripe.errors.StripeError) {
      errorMessage = `Error de Stripe: ${error.message}`
      errorDetails = {
        type: error.type,
        code: error.code,
        decline_code: error.decline_code,
        param: error.param,
      }
    } else if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = { stack: error.stack }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 },
    )
  }
}
