export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

// Template base para emails
function getBaseTemplate(content: string, title: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .highlight { background: #e8f4fd; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Robert Software</h1>
            <p>Automatización Empresarial Premium</p>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>&copy; 2024 Robert Software. Todos los derechos reservados.</p>
            <p>Si tienes alguna pregunta, contáctanos en soporte@robertsoftware.com</p>
        </div>
    </div>
</body>
</html>
  `
}

// Template de confirmación de compra
export function getPurchaseConfirmationTemplate(data: {
  customerName: string
  productName: string
  amount: number
  currency: string
  orderId: string
  downloadUrl?: string
}): EmailTemplate {
  const content = `
    <h2>¡Gracias por tu compra, ${data.customerName}!</h2>
    
    <div class="highlight">
        <h3>Detalles de tu pedido:</h3>
        <p><strong>Producto:</strong> ${data.productName}</p>
        <p><strong>Importe:</strong> ${(data.amount / 100).toFixed(2)} ${data.currency.toUpperCase()}</p>
        <p><strong>ID del pedido:</strong> ${data.orderId}</p>
    </div>
    
    <p>Tu compra ha sido procesada exitosamente. En breve recibirás un email con los detalles de acceso y descarga.</p>
    
    ${
      data.downloadUrl
        ? `
    <p>Puedes descargar tu producto aquí:</p>
    <a href="${data.downloadUrl}" class="button">Descargar Producto</a>
    `
        : ""
    }
    
    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
  `

  const text = `
¡Gracias por tu compra, ${data.customerName}!

Detalles de tu pedido:
- Producto: ${data.productName}
- Importe: ${(data.amount / 100).toFixed(2)} ${data.currency.toUpperCase()}
- ID del pedido: ${data.orderId}

Tu compra ha sido procesada exitosamente. En breve recibirás un email con los detalles de acceso y descarga.

${data.downloadUrl ? `Puedes descargar tu producto en: ${data.downloadUrl}` : ""}

Si tienes alguna pregunta, no dudes en contactarnos.

Robert Software
soporte@robertsoftware.com
  `

  return {
    subject: `Confirmación de compra - ${data.productName}`,
    html: getBaseTemplate(content, "Confirmación de compra"),
    text: text.trim(),
  }
}

// Template de bienvenida
export function getWelcomeTemplate(data: {
  customerName: string
  productName: string
  accessUrl?: string
}): EmailTemplate {
  const content = `
    <h2>¡Bienvenido a Robert Software, ${data.customerName}!</h2>
    
    <p>Nos complace darte la bienvenida como nuevo cliente de <strong>${data.productName}</strong>.</p>
    
    <div class="highlight">
        <h3>Próximos pasos:</h3>
        <ol>
            <li>Revisa la documentación incluida</li>
            <li>Programa tu sesión de onboarding</li>
            <li>Comienza a automatizar tus procesos</li>
        </ol>
    </div>
    
    ${
      data.accessUrl
        ? `
    <p>Accede a tu panel de cliente:</p>
    <a href="${data.accessUrl}" class="button">Acceder al Panel</a>
    `
        : ""
    }
    
    <p>Nuestro equipo está aquí para ayudarte en cada paso del proceso de implementación.</p>
  `

  const text = `
¡Bienvenido a Robert Software, ${data.customerName}!

Nos complace darte la bienvenida como nuevo cliente de ${data.productName}.

Próximos pasos:
1. Revisa la documentación incluida
2. Programa tu sesión de onboarding
3. Comienza a automatizar tus procesos

${data.accessUrl ? `Accede a tu panel de cliente: ${data.accessUrl}` : ""}

Nuestro equipo está aquí para ayudarte en cada paso del proceso de implementación.

Robert Software
soporte@robertsoftware.com
  `

  return {
    subject: `¡Bienvenido a Robert Software!`,
    html: getBaseTemplate(content, "Bienvenido"),
    text: text.trim(),
  }
}

// Template de descarga
export function getDownloadTemplate(data: {
  customerName: string
  productName: string
  downloadUrl: string
  expiresAt?: string
}): EmailTemplate {
  const content = `
    <h2>Tu descarga está lista, ${data.customerName}</h2>
    
    <p>Ya puedes descargar <strong>${data.productName}</strong>.</p>
    
    <div class="highlight">
        <p><strong>Importante:</strong> Este enlace de descarga es único y personal.</p>
        ${data.expiresAt ? `<p><strong>Expira:</strong> ${data.expiresAt}</p>` : ""}
    </div>
    
    <a href="${data.downloadUrl}" class="button">Descargar Ahora</a>
    
    <p>Si tienes problemas con la descarga, contáctanos inmediatamente.</p>
  `

  const text = `
Tu descarga está lista, ${data.customerName}

Ya puedes descargar ${data.productName}.

Enlace de descarga: ${data.downloadUrl}

Importante: Este enlace de descarga es único y personal.
${data.expiresAt ? `Expira: ${data.expiresAt}` : ""}

Si tienes problemas con la descarga, contáctanos inmediatamente.

Robert Software
soporte@robertsoftware.com
  `

  return {
    subject: `Descarga disponible - ${data.productName}`,
    html: getBaseTemplate(content, "Descarga disponible"),
    text: text.trim(),
  }
}

// Template de soporte
export function getSupportTemplate(data: {
  customerName: string
  ticketId: string
  subject: string
  message: string
}): EmailTemplate {
  const content = `
    <h2>Hemos recibido tu consulta, ${data.customerName}</h2>
    
    <div class="highlight">
        <p><strong>Ticket ID:</strong> ${data.ticketId}</p>
        <p><strong>Asunto:</strong> ${data.subject}</p>
    </div>
    
    <p><strong>Tu mensaje:</strong></p>
    <p style="background: #f0f0f0; padding: 15px; border-radius: 5px;">${data.message}</p>
    
    <p>Nuestro equipo de soporte revisará tu consulta y te responderá en un plazo máximo de 24 horas.</p>
    
    <p>Puedes hacer seguimiento de tu ticket usando el ID proporcionado.</p>
  `

  const text = `
Hemos recibido tu consulta, ${data.customerName}

Ticket ID: ${data.ticketId}
Asunto: ${data.subject}

Tu mensaje:
${data.message}

Nuestro equipo de soporte revisará tu consulta y te responderá en un plazo máximo de 24 horas.

Puedes hacer seguimiento de tu ticket usando el ID proporcionado.

Robert Software
soporte@robertsoftware.com
  `

  return {
    subject: `Ticket de soporte #${data.ticketId} - ${data.subject}`,
    html: getBaseTemplate(content, "Soporte técnico"),
    text: text.trim(),
  }
}
