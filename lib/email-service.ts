// Servicio de email para Robert Software
// En desarrollo simula el envío, en producción usaría un servicio real como Resend

interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

interface OrderData {
  id: string
  customer_name: string
  customer_email: string
  customer_company?: string
  product_name: string
  amount: number
  currency: string
  created_at: string
  download_token?: string
}

// Función principal para enviar emails
export async function sendEmail(data: EmailData) {
  if (process.env.NODE_ENV === "development") {
    console.log("📧 [SIMULADO] Enviando email:", {
      to: data.to,
      subject: data.subject,
      preview: data.html.substring(0, 100) + "...",
    })
    return { success: true, message: "Email simulado enviado correctamente" }
  }

  // En producción aquí iría la integración con Resend, SendGrid, etc.
  try {
    // Aquí iría la lógica real de envío
    console.log("📧 Enviando email real:", data.to)
    return { success: true, message: "Email enviado correctamente" }
  } catch (error) {
    console.error("Error enviando email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}

export async function sendOrderConfirmationEmail(order: OrderData) {
  const downloadUrl = order.download_token
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/download/${order.download_token}`
    : "#"

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmación de Pedido - Robert Software</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; background: #f8fafc; border-radius: 0 0 8px 8px; }
        .button { 
          display: inline-block; 
          background: #2563eb; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 6px; 
          margin: 20px 0;
          font-weight: bold;
        }
        .order-details { 
          background: white; 
          padding: 20px; 
          margin: 20px 0; 
          border-radius: 8px; 
          border-left: 4px solid #2563eb;
        }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Gracias por tu compra!</h1>
          <p>Tu pedido ha sido procesado exitosamente</p>
        </div>
        
        <div class="content">
          <h2>Hola ${order.customer_name},</h2>
          
          <p>Tu pago ha sido procesado correctamente y tu pedido está listo.</p>
          
          <div class="order-details">
            <h3>📋 Detalles del Pedido</h3>
            <p><strong>Número de Pedido:</strong> #${order.id}</p>
            <p><strong>Producto:</strong> ${order.product_name}</p>
            <p><strong>Importe:</strong> €${(order.amount).toFixed(2)}</p>
            <p><strong>Fecha:</strong> ${new Date(order.created_at).toLocaleDateString("es-ES")}</p>
            ${order.customer_company ? `<p><strong>Empresa:</strong> ${order.customer_company}</p>` : ""}
          </div>
          
          ${
            order.download_token
              ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadUrl}" class="button">📥 Descargar Producto</a>
          </div>
          `
              : ""
          }
          
          <div class="order-details">
            <h3>ℹ️ Información Importante</h3>
            <ul>
              <li>Tu enlace de descarga estará disponible durante 30 días</li>
              <li>Puedes descargar el producto hasta 5 veces</li>
              <li>Si tienes problemas, contacta con nosotros</li>
            </ul>
          </div>
          
          <p>Si tienes alguna pregunta, no dudes en contactarnos:</p>
          <p>📧 <a href="mailto:hola@robertsoftware.com">hola@robertsoftware.com</a></p>
          <p>📞 +34 600 000 000</p>
        </div>
        
        <div class="footer">
          <p>© 2024 Robert Software. Todos los derechos reservados.</p>
          <p>Este email fue enviado automáticamente.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return await sendEmail({
    to: order.customer_email,
    subject: `Confirmación de Pedido #${order.id} - Robert Software`,
    html,
  })
}

export async function sendWelcomeEmail(order: OrderData) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bienvenido a Robert Software</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1>¡Bienvenido a Robert Software!</h1>
        </div>
        
        <div style="padding: 30px; background: #f8fafc; border-radius: 0 0 8px 8px;">
          <h2>Hola ${order.customer_name},</h2>
          <p>Gracias por confiar en nosotros para automatizar tu negocio.</p>
          <p>Estamos aquí para ayudarte en todo lo que necesites.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return await sendEmail({
    to: order.customer_email,
    subject: "Bienvenido a Robert Software",
    html,
  })
}

export async function sendDownloadReminderEmail(order: OrderData) {
  const downloadUrl = order.download_token
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/download/${order.download_token}`
    : "#"

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Recordatorio de Descarga - Robert Software</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Recordatorio: Tu producto está listo para descargar</h2>
        <p>Hola ${order.customer_name},</p>
        <p>Te recordamos que tu producto "${order.product_name}" está disponible para descarga.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${downloadUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Descargar Ahora</a>
        </div>
      </div>
    </body>
    </html>
  `

  return await sendEmail({
    to: order.customer_email,
    subject: "Recordatorio: Tu descarga está disponible",
    html,
  })
}

export async function sendSupportInfoEmail(order: OrderData) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Información de Soporte - Robert Software</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Información de Soporte</h2>
        <p>Hola ${order.customer_name},</p>
        <p>Aquí tienes toda la información de soporte para tu producto "${order.product_name}":</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>📞 Contacto de Soporte</h3>
          <p><strong>Email:</strong> soporte@robertsoftware.com</p>
          <p><strong>Teléfono:</strong> +34 600 000 000</p>
          <p><strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>📚 Recursos Útiles</h3>
          <ul>
            <li><a href="#">Documentación del producto</a></li>
            <li><a href="#">Preguntas frecuentes</a></li>
            <li><a href="#">Tutoriales en video</a></li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `

  return await sendEmail({
    to: order.customer_email,
    subject: "Información de Soporte - Robert Software",
    html,
  })
}

// Función para enviar notificaciones de solicitudes de usuario
export async function sendUserRequestNotificationEmail(
  requestData: any,
  type: "user_confirmation" | "admin_notification" | "approved" | "rejected",
  additionalData?: any,
) {
  let template
  let recipient

  switch (type) {
    case "user_confirmation":
      template = {
        subject: "Solicitud de acceso recibida - Robert Software",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1>¡Solicitud Recibida!</h1>
              <p>Gracias por tu interés</p>
            </div>
            <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>Hola ${requestData.name},</p>
              <p>Hemos recibido tu solicitud de acceso a Robert Software. Nuestro equipo la revisará en las próximas 24-48 horas.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <h3>Detalles de tu solicitud:</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 5px 0; border-bottom: 1px solid #eee;"><strong>Empresa:</strong> ${requestData.company}</li>
                  <li style="padding: 5px 0; border-bottom: 1px solid #eee;"><strong>Tipo de acceso:</strong> ${requestData.access_type === "cliente" ? "Cliente" : "Empleado"}</li>
                  <li style="padding: 5px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong> ${requestData.email}</li>
                  ${requestData.position ? `<li style="padding: 5px 0; border-bottom: 1px solid #eee;"><strong>Cargo:</strong> ${requestData.position}</li>` : ""}
                </ul>
              </div>
            </div>
          </div>
        `,
      }
      recipient = requestData.email
      break

    case "admin_notification":
      template = {
        subject: `Nueva solicitud de acceso - ${requestData.company}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1>🚨 Nueva Solicitud</h1>
              <p>Requiere revisión</p>
            </div>
            <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                <h3>Información del solicitante:</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Nombre:</strong> ${requestData.name}</li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong> ${requestData.email}</li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Empresa:</strong> ${requestData.company}</li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Tipo de acceso:</strong> ${requestData.access_type === "cliente" ? "Cliente" : "Empleado"}</li>
                  ${requestData.position ? `<li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Cargo:</strong> ${requestData.position}</li>` : ""}
                  ${requestData.phone ? `<li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong> ${requestData.phone}</li>` : ""}
                  <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Fecha:</strong> ${new Date(requestData.created_at).toLocaleString("es-ES")}</li>
                </ul>
              </div>
            </div>
          </div>
        `,
      }
      recipient = process.env.ADMIN_EMAIL || "admin@robertsoftware.com"
      break

    case "approved":
      template = {
        subject: "¡Solicitud aprobada! - Acceso a Robert Software",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #16a34a; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1>🎉 ¡Solicitud Aprobada!</h1>
              <p>Tu cuenta está lista</p>
            </div>
            <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>¡Excelentes noticias, ${requestData.name}!</p>
              <p>Tu solicitud de acceso ha sido aprobada y tu cuenta ha sido creada exitosamente.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
                <h3>Tus credenciales de acceso:</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong> ${requestData.email}</li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Contraseña temporal:</strong> <code style="background: #f8fafc; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${additionalData?.tempPassword}</code></li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Tipo de cuenta:</strong> ${requestData.access_type === "cliente" ? "Cliente" : "Empleado"}</li>
                </ul>
              </div>
            </div>
          </div>
        `,
      }
      recipient = requestData.email
      break

    case "rejected":
      template = {
        subject: "Actualización de tu solicitud - Robert Software",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1>Actualización de Solicitud</h1>
              <p>Información importante</p>
            </div>
            <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>Hola ${requestData.name},</p>
              <p>Gracias por tu interés en Robert Software. Después de revisar tu solicitud, no podemos proceder con la aprobación en este momento.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                <h3>Motivo:</h3>
                <p style="color: #721c24; margin: 0; font-style: italic; background: #fecaca; padding: 15px; border-radius: 4px;">
                  "${additionalData?.rejectionReason}"
                </p>
              </div>
            </div>
          </div>
        `,
      }
      recipient = requestData.email
      break

    default:
      throw new Error("Tipo de email no válido")
  }

  return await sendEmail({
    to: recipient,
    subject: template.subject,
    html: template.html,
  })
}
