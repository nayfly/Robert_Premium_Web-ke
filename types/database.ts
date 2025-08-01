// Tipos de base de datos para Robert Software

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "empleado" | "cliente"
  is_active: boolean
  email_verified: boolean
  phone?: string
  company?: string
  position?: string
  password_hash: string
  failed_login_attempts: number
  last_login_at?: string
  password_changed_at: string
  password_expires_at?: string
  requires_password_change: boolean
  created_from_request?: boolean
  activation_token?: string
  metadata?: any
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id?: string
  customer_name: string
  customer_email: string
  customer_company?: string
  customer_phone?: string
  product_name: string
  product_id?: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded" | "canceled"
  stripe_payment_intent_id?: string
  stripe_customer_id?: string
  notes?: string
  metadata?: any
  created_at: string
  updated_at: string
}

export interface DownloadToken {
  id: string
  order_id: string
  download_token: string
  max_downloads: number
  downloads_used: number
  expires_at: string
  last_downloaded_at?: string
  created_at: string
}

export interface Invoice {
  id: string
  order_id: string
  invoice_number: string
  customer_name: string
  customer_email: string
  customer_company?: string
  total_amount: number
  tax_amount: number
  currency: string
  status: "draft" | "sent" | "paid" | "overdue" | "canceled"
  due_date?: string
  paid_at?: string
  created_at: string
  updated_at: string
}

export interface UserRequest {
  id: string
  name: string
  email: string
  phone?: string
  company: string
  position?: string
  access_type: "cliente" | "empleado"
  message?: string
  status: "pending" | "approved" | "rejected"
  rejection_reason?: string
  activation_token?: string
  token_expires_at?: string
  reviewed_by?: string
  reviewed_at?: string
  approved_at?: string
  ip_address?: string
  user_agent?: string
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  user_id?: string
  action: string
  table_name?: string
  record_id?: string
  ip_address?: string
  user_agent?: string
  severity: "info" | "warning" | "error" | "critical"
  success: boolean
  error_message?: string
  old_values?: any
  new_values?: any
  created_at: string
}

export interface EmailLog {
  id: string
  order_id?: string
  user_id?: string
  email_type: string
  recipient: string
  subject: string
  status: "sent" | "failed" | "pending"
  external_id?: string
  error_message?: string
  sent_at: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  is_read: boolean
  metadata?: any
  created_at: string
  read_at?: string
}

export interface Project {
  id: string
  name: string
  description?: string
  status: "active" | "completed" | "paused" | "canceled"
  client_id: string
  assigned_to?: string
  start_date?: string
  end_date?: string
  budget?: number
  currency?: string
  metadata?: any
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  project_id: string
  title: string
  description?: string
  status: "todo" | "in_progress" | "review" | "completed"
  priority: "low" | "medium" | "high" | "urgent"
  assigned_to?: string
  due_date?: string
  completed_at?: string
  metadata?: any
  created_at: string
  updated_at: string
}

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Tipos para formularios
export interface CreateOrderRequest {
  customer_name: string
  customer_email: string
  customer_company?: string
  customer_phone?: string
  product_name: string
  product_id?: string
  amount: number
  currency?: string
}

export interface CreateUserRequestRequest {
  name: string
  email: string
  phone?: string
  company: string
  position?: string
  access_type: "cliente" | "empleado"
  message?: string
}

export interface UpdateOrderStatusRequest {
  status: "pending" | "completed" | "failed" | "refunded" | "canceled"
  notes?: string
}
