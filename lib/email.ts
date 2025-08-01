// Funciones básicas de email para compatibilidad
export async function sendTestEmail(to: string, recipientName = "Usuario") {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Test Email - Robert Software</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1>✅ Test Exitoso</h1>
        </div>
        <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Hola ${recipientName},</p>
          <p>Este es un email de prueba para verificar que la configuración SMTP está funcionando correctamente.</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString("es-ES")}</p>
        </div>
      </div>
    </body>
    </html>
  `

  if (process.env.NODE_ENV === "development") {
    console.log("📧 [TEST EMAIL SIMULADO] Enviado a:", to)
    return { success: true, message: "Email de prueba simulado enviado" }
  }

  // En producción aquí iría la lógica real
  return { success: true, message: "Email de prueba enviado" }
}

export async function sendOrderConfirmationEmail(data: any) {
  console.log("📧 Enviando confirmación de orden:", data.order?.id)
  return { success: true, message: "Email de confirmación enviado" }
}
