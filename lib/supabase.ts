import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables")
}

// Cliente público para el frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Cliente admin para operaciones del servidor
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Tipos de usuario
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "empleado" | "cliente"
  is_active: boolean
  created_at: string
  updated_at?: string
  last_login?: string
  phone?: string
  company?: string
  position?: string
  avatar_url?: string
  email_verified?: boolean
  password_hash?: string
  failed_login_attempts?: number
  locked_until?: string
  password_changed_at?: string
  metadata?: Record<string, any>
}

// Rate limiting simple en memoria
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function isRateLimited(identifier: string, action: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean {
  const key = `${identifier}:${action}`
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return false
  }

  if (record.count >= maxAttempts) {
    return true
  }

  record.count++
  return false
}

// Funciones de utilidad para requests
export function getClientIP(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const cfConnectingIP = request.headers.get("cf-connecting-ip")

  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(",")[0].trim()

  return null
}

export function getUserAgent(request: NextRequest): string | null {
  return request.headers.get("user-agent")
}

// Funciones de validación y sanitización
export function sanitizeInput(input: string): string {
  if (!input) return ""
  return input.trim().replace(/[<>]/g, "")
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))
}

export function generateSecurePassword(length = 12): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

// Funciones de utilidad para usuarios
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("is_active", true)
      .single()

    if (error || !data) {
      return null
    }

    return data as User
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("*").eq("id", id).eq("is_active", true).single()

    if (error || !data) {
      return null
    }

    return data as User
  } catch (error) {
    console.error("Error getting user by id:", error)
    return null
  }
}

export async function createUser(userData: {
  email: string
  password_hash: string
  name: string
  role: "admin" | "empleado" | "cliente"
  phone?: string
  company?: string
  position?: string
}): Promise<User | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert({
        email: userData.email.toLowerCase(),
        password_hash: userData.password_hash,
        name: userData.name,
        role: userData.role,
        phone: userData.phone || null,
        company: userData.company || null,
        position: userData.position || null,
        is_active: true,
        email_verified: false,
        failed_login_attempts: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error || !data) {
      console.error("Error creating user:", error)
      return null
    }

    return data as User
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export async function updateUserLastLogin(userId: string): Promise<void> {
  try {
    await supabaseAdmin
      .from("users")
      .update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
  } catch (error) {
    console.error("Error updating last login:", error)
  }
}

// Funciones para órdenes
export async function createOrder(orderData: {
  customer_email: string
  customer_name: string
  customer_phone?: string
  customer_company?: string
  product_name?: string
  product_id?: string
  amount: number
  currency?: string
  status?: string
  stripe_payment_intent_id?: string
  stripe_customer_id?: string
  metadata?: Record<string, any>
}) {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_email: orderData.customer_email,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone || null,
        customer_company: orderData.customer_company || null,
        product_name: orderData.product_name || "Producto Digital",
        product_id: orderData.product_id || null,
        amount: orderData.amount,
        currency: orderData.currency || "EUR",
        status: orderData.status || "pending",
        stripe_payment_intent_id: orderData.stripe_payment_intent_id || null,
        stripe_customer_id: orderData.stripe_customer_id || null,
        metadata: orderData.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export async function getOrderById(orderId: string) {
  try {
    const { data, error } = await supabaseAdmin.from("orders").select("*").eq("id", orderId).single()

    if (error) {
      return null
    }

    return data
  } catch (error) {
    console.error("Error getting order:", error)
    return null
  }
}

export async function updateOrderStatus(orderId: string, status: string, adminNotes?: string) {
  try {
    const updateData: any = {
      status: status,
      updated_at: new Date().toISOString(),
    }

    if (adminNotes) {
      updateData.admin_notes = adminNotes
      updateData.admin_status = status
    }

    const { data, error } = await supabaseAdmin.from("orders").update(updateData).eq("id", orderId).select().single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
}

// Funciones para descargas
export async function createDownloadToken(orderId: string, maxDownloads = 5, expirationDays = 30) {
  try {
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expirationDays)

    const { data, error } = await supabaseAdmin
      .from("downloads")
      .insert({
        order_id: orderId,
        download_token: token,
        max_downloads: maxDownloads,
        download_count: 0,
        expires_at: expiresAt.toISOString(),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("Error creating download token:", error)
    throw error
  }
}

export async function getDownloadByToken(token: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("downloads")
      .select(
        `
        *,
        orders (*)
      `,
      )
      .eq("download_token", token)
      .eq("is_active", true)
      .single()

    if (error) {
      return null
    }

    return data
  } catch (error) {
    console.error("Error getting download by token:", error)
    return null
  }
}

export async function incrementDownloadCount(downloadId: string) {
  try {
    // Primero obtenemos el conteo actual
    const { data: currentDownload, error: fetchError } = await supabaseAdmin
      .from("downloads")
      .select("download_count")
      .eq("id", downloadId)
      .single()

    if (fetchError || !currentDownload) {
      throw new Error("Download not found")
    }

    // Incrementamos el contador
    const { data, error } = await supabaseAdmin
      .from("downloads")
      .update({
        download_count: currentDownload.download_count + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", downloadId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("Error incrementing download count:", error)
    throw error
  }
}

// Funciones para facturas
export async function createInvoice(invoiceData: {
  order_id: string
  total_amount: number
  tax_amount?: number
  currency?: string
  status?: string
  pdf_url?: string
  metadata?: Record<string, any>
}) {
  try {
    const invoiceNumber = `INV-${Date.now()}`

    const { data, error } = await supabaseAdmin
      .from("invoices")
      .insert({
        order_id: invoiceData.order_id,
        invoice_number: invoiceNumber,
        total_amount: invoiceData.total_amount,
        tax_amount: invoiceData.tax_amount || 0,
        currency: invoiceData.currency || "EUR",
        status: invoiceData.status || "draft",
        pdf_url: invoiceData.pdf_url || null,
        metadata: invoiceData.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("Error creating invoice:", error)
    throw error
  }
}

export async function getInvoiceByOrderId(orderId: string) {
  try {
    const { data, error } = await supabaseAdmin.from("invoices").select("*").eq("order_id", orderId).single()

    if (error) {
      return null
    }

    return data
  } catch (error) {
    console.error("Error getting invoice:", error)
    return null
  }
}

// Funciones para logs de auditoría
export async function logAuditEvent(eventData: {
  user_id?: string
  action: string
  table_name?: string
  record_id?: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  ip_address?: string
  user_agent?: string
  session_id?: string
  severity?: "info" | "warning" | "error" | "critical"
  success?: boolean
  error_message?: string
}) {
  try {
    await supabaseAdmin.from("audit_logs").insert({
      user_id: eventData.user_id || null,
      action: eventData.action,
      table_name: eventData.table_name || null,
      record_id: eventData.record_id || null,
      old_values: eventData.old_values || null,
      new_values: eventData.new_values || null,
      ip_address: eventData.ip_address || null,
      user_agent: eventData.user_agent || null,
      session_id: eventData.session_id || null,
      severity: eventData.severity || "info",
      success: eventData.success !== undefined ? eventData.success : true,
      error_message: eventData.error_message || null,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error logging audit event:", error)
  }
}

export async function getAuditLogs(filters?: {
  user_id?: string
  action?: string
  table_name?: string
  severity?: string
  limit?: number
  offset?: number
}) {
  try {
    let query = supabaseAdmin
      .from("audit_logs")
      .select(
        `
        *,
        users (
          name,
          email
        )
      `,
      )
      .order("created_at", { ascending: false })

    if (filters?.user_id) {
      query = query.eq("user_id", filters.user_id)
    }
    if (filters?.action) {
      query = query.eq("action", filters.action)
    }
    if (filters?.table_name) {
      query = query.eq("table_name", filters.table_name)
    }
    if (filters?.severity) {
      query = query.eq("severity", filters.severity)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error getting audit logs:", error)
    return []
  }
}

// Función para verificar conexión
export async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabaseAdmin.from("users").select("count").limit(1)

    if (error) {
      return {
        success: false,
        message: `Supabase connection failed: ${error.message}`,
      }
    }

    return {
      success: true,
      message: "Supabase connection successful",
    }
  } catch (error) {
    return {
      success: false,
      message: `Supabase connection error: ${error}`,
    }
  }
}

// Funciones de limpieza para testing
export async function cleanupTestData(orderId?: string) {
  try {
    if (orderId) {
      // Limpiar datos específicos de una orden
      await supabaseAdmin.from("downloads").delete().eq("order_id", orderId)
      await supabaseAdmin.from("invoices").delete().eq("order_id", orderId)
      await supabaseAdmin.from("orders").delete().eq("id", orderId)
      return { message: `Datos de testing eliminados para orden: ${orderId}` }
    } else {
      // Limpiar todos los datos de testing (órdenes de prueba)
      const { data: testOrders } = await supabaseAdmin
        .from("orders")
        .select("id")
        .or("customer_email.like.%test%,customer_email.like.%demo%,customer_name.like.%Test%")

      if (testOrders) {
        for (const order of testOrders) {
          await supabaseAdmin.from("downloads").delete().eq("order_id", order.id)
          await supabaseAdmin.from("invoices").delete().eq("order_id", order.id)
        }

        await supabaseAdmin
          .from("orders")
          .delete()
          .or("customer_email.like.%test%,customer_email.like.%demo%,customer_name.like.%Test%")

        return { message: `${testOrders.length} órdenes de testing eliminadas` }
      }

      return { message: "No se encontraron órdenes de testing para eliminar" }
    }
  } catch (error) {
    console.error("Error limpiando datos de testing:", error)
    throw error
  }
}

export default supabase
