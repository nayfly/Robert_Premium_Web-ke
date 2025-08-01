import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Funciones auxiliares para el admin
export async function updateOrderStatus(orderId: string, status: string, notes?: string) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({
      status,
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single()

  if (error) {
    console.error("Error updating order status:", error)
    throw error
  }

  return data
}

export async function createDownloadToken(orderId: string, maxDownloads = 5, expiryDays = 30) {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expiryDays)

  const { data, error } = await supabaseAdmin
    .from("download_tokens")
    .insert({
      order_id: orderId,
      download_token: token,
      max_downloads: maxDownloads,
      downloads_used: 0,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating download token:", error)
    throw error
  }

  return data
}

export async function createInvoice(order: any) {
  const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

  const { data, error } = await supabaseAdmin
    .from("invoices")
    .insert({
      order_id: order.id,
      invoice_number: invoiceNumber,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_company: order.customer_company,
      total_amount: order.amount,
      tax_amount: Math.round(order.amount * 0.21), // 21% IVA
      currency: order.currency || "EUR",
      status: "paid",
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating invoice:", error)
    throw error
  }

  return data
}

export async function logAuditEvent(event: {
  action: string
  table_name?: string
  record_id?: string
  user_id?: string
  ip_address?: string
  user_agent?: string
  severity: "info" | "warning" | "error" | "critical"
  success: boolean
  error_message?: string
  old_values?: any
  new_values?: any
}) {
  try {
    await supabaseAdmin.from("audit_logs").insert({
      ...event,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error logging audit event:", error)
  }
}
