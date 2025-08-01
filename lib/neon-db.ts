import { neon } from "@neondatabase/serverless"

// Función para obtener la URL de la base de datos con fallbacks
function getDatabaseUrl(): string {
  // Intentar diferentes nombres de variables de entorno
  const possibleUrls = [
    process.env.NEON_NEON_NEON_NEON_DATABASE_URL,
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.NEON_POSTGRES_URL,
  ]

  for (const url of possibleUrls) {
    if (url && url.trim()) {
      return url.trim()
    }
  }

  // En desarrollo, permitir modo demo sin base de datos
  if (process.env.NODE_ENV === "development") {
    console.warn("⚠️  No se encontró DATABASE_URL. Funcionando en modo demo.")
    return ""
  }

  throw new Error("No se encontró una URL de base de datos válida. Configura NEON_DATABASE_URL o DATABASE_URL.")
}

// Cliente SQL de Neon
let sql: ReturnType<typeof neon> | null = null

export function getSQL() {
  if (!sql) {
    const connectionString = process.env.NEON_NEON_NEON_DATABASE_URL || process.env.NEON_DATABASE_URL
    if (!connectionString) {
      throw new Error("No database connection string found")
    }
    sql = neon(connectionString)
  }
  return sql
}

export function getSQLSafe() {
  try {
    return getSQL()
  } catch (error) {
    console.warn("Database not available:", error)
    return null
  }
}

export async function getUserByEmail(email: string) {
  try {
    const sql = getSQL()
    const users = await sql`
      SELECT id, email, password_hash, name, role, active
      FROM users 
      WHERE email = ${email.toLowerCase()} 
      AND active = true
    `
    return users[0] || null
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

export async function createUser(userData: {
  email: string
  password_hash: string
  name: string
  role: string
  phone?: string
  company?: string
  position?: string
}) {
  try {
    const sql = getSQL()
    const users = await sql`
      INSERT INTO users (email, password_hash, name, role, phone, company, position, active, created_at, updated_at)
      VALUES (${userData.email.toLowerCase()}, ${userData.password_hash}, ${userData.name}, ${userData.role}, 
              ${userData.phone || null}, ${userData.company || null}, ${userData.position || null}, 
              true, NOW(), NOW())
      RETURNING id, email, name, role, created_at
    `
    return users[0] || null
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export async function updateUserLastLogin(userId: string | number) {
  try {
    const sql = getSQL()
    await sql`
      UPDATE users 
      SET last_login = NOW(), updated_at = NOW()
      WHERE id = ${userId}
    `
  } catch (error) {
    console.error("Error updating last login:", error)
  }
}

export async function getUserByEmailOld(email: string) {
  const sql = getSQLSafe()
  if (!sql) return null

  try {
    const users = await sql`
      SELECT id, email, password_hash, name, role 
      FROM users 
      WHERE email = ${email}
    `
    return users[0] || null
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function testConnection() {
  const sql = getSQLSafe()
  if (!sql) return { success: false, error: "No database connection" }

  try {
    await sql`SELECT 1 as test`
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Funciones de utilidad para la base de datos
export async function checkTables() {
  try {
    const sqlInstance = getSQL()
    const tables = await sqlInstance`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    return { success: true, tables: tables.map((t: any) => t.table_name) }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}

export async function setupDatabase() {
  try {
    const sqlInstance = getSQL()

    // Crear tabla de usuarios si no existe
    await sqlInstance`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'cliente',
        phone VARCHAR(20),
        company VARCHAR(255),
        position VARCHAR(255),
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `

    // Crear tabla de proyectos si no existe
    await sqlInstance`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'active',
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Crear tabla de tareas si no existe
    await sqlInstance`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(20) DEFAULT 'medium',
        project_id INTEGER REFERENCES projects(id),
        assigned_to INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Crear tabla de auditoría si no existe
    await sqlInstance`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        action VARCHAR(255) NOT NULL,
        resource VARCHAR(255) NOT NULL,
        details JSONB,
        ip_address VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Crear tabla de descargas si no existe
    await sqlInstance`
      CREATE TABLE IF NOT EXISTS downloads (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        download_token VARCHAR(255) UNIQUE NOT NULL,
        max_downloads INTEGER NOT NULL,
        download_count INTEGER DEFAULT 0,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Crear tabla de órdenes si no existe
    await sqlInstance`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_email VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) NOT NULL,
        status VARCHAR(50) NOT NULL,
        stripe_payment_intent_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Crear tabla de facturas si no existe
    await sqlInstance`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        tax_amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    return { success: true, message: "Base de datos configurada correctamente" }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}

export async function insertDemoData() {
  try {
    const sqlInstance = getSQL()

    // Verificar si ya hay datos
    const existingUsers = await sqlInstance`SELECT COUNT(*) as count FROM users`
    if (existingUsers[0].count > 0) {
      return { success: true, message: "Los datos demo ya existen" }
    }

    // Insertar usuarios demo
    await sqlInstance`
      INSERT INTO users (email, password_hash, name, role, phone, company, position, active, created_at, updated_at)
      VALUES ('admin@demo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin Demo', 'admin', null, null, null, true, NOW(), NOW()),
             ('empleado@demo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Empleado Demo', 'empleado', null, null, null, true, NOW(), NOW()),
             ('cliente@demo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Cliente Demo', 'cliente', null, null, null, true, NOW(), NOW())
    `

    return { success: true, message: "Datos demo insertados correctamente" }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}

export async function testDatabaseConnection() {
  try {
    const client = getSQL()
    const result = await client`SELECT NOW() as current_time`
    console.log("✅ Conexión a la base de datos exitosa:", result[0]?.current_time)
    return { success: true, timestamp: result[0]?.current_time }
  } catch (error) {
    console.error("❌ Error de conexión a la base de datos:", error)
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}

export async function checkTablesExist() {
  try {
    const client = getSQL()
    const tables = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    const requiredTables = ["users", "projects", "tasks", "audit_logs", "downloads", "orders", "invoices"]
    const existingTables = tables.map((t: any) => t.table_name)
    const missingTables = requiredTables.filter((table) => !existingTables.includes(table))

    return {
      success: missingTables.length === 0,
      existingTables,
      missingTables,
    }
  } catch (error) {
    console.error("❌ Error verificando tablas:", error)
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}

export async function ensureDemoUser() {
  try {
    const client = getSQL()
    const existingUser = await client`
      SELECT id FROM users WHERE email = 'admin@demo.com' LIMIT 1
    `

    if (existingUser.length === 0) {
      await client`
        INSERT INTO users (email, password_hash, name, role, active, created_at)
        VALUES ('admin@demo.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin Demo', 'admin', true, NOW())
      `
      console.log("✅ Usuario demo creado: admin@demo.com / admin123")
    }

    return { success: true }
  } catch (error) {
    console.error("❌ Error creando usuario demo:", error)
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" }
  }
}

export async function createOrder(orderData: {
  customerEmail: string
  customerName: string
  amount: number
  currency: string
  status: string
  stripePaymentIntentId?: string
}) {
  try {
    const client = getSQL()
    const result = await client`
      INSERT INTO orders (
        customer_email, 
        customer_name, 
        amount, 
        currency, 
        status, 
        stripe_payment_intent_id,
        created_at
      )
      VALUES (
        ${orderData.customerEmail},
        ${orderData.customerName},
        ${orderData.amount},
        ${orderData.currency},
        ${orderData.status},
        ${orderData.stripePaymentIntentId || null},
        NOW()
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creando orden:", error)
    throw error
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const client = getSQL()
    const result = await client`
      UPDATE orders 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${orderId}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error actualizando orden:", error)
    throw error
  }
}

export async function getOrderById(orderId: string) {
  try {
    const client = getSQL()
    const result = await client`
      SELECT * FROM orders 
      WHERE id = ${orderId}
      LIMIT 1
    `
    return result[0] || null
  } catch (error) {
    console.error("Error obteniendo orden:", error)
    return null
  }
}

export async function getOrders(limit = 50) {
  try {
    const client = getSQL()
    const result = await client`
      SELECT * FROM orders 
      ORDER BY created_at DESC 
      LIMIT ${limit}
    `
    return result
  } catch (error) {
    console.error("Error obteniendo órdenes:", error)
    return []
  }
}

export async function createDownloadToken(orderId: string, maxDownloads = 5, expirationDays = 30) {
  try {
    const client = getSQL()
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expirationDays)

    const result = await client`
      INSERT INTO downloads (
        order_id,
        download_token,
        max_downloads,
        download_count,
        expires_at,
        created_at
      )
      VALUES (
        ${orderId},
        ${token},
        ${maxDownloads},
        0,
        ${expiresAt.toISOString()},
        NOW()
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creando token de descarga:", error)
    throw error
  }
}

export async function getInvoiceByOrderId(orderId: string) {
  try {
    const client = getSQL()
    const result = await client`
      SELECT * FROM invoices 
      WHERE order_id = ${orderId}
      LIMIT 1
    `
    return result[0] || null
  } catch (error) {
    console.error("Error obteniendo factura:", error)
    return null
  }
}

export async function createInvoice(invoiceData: {
  order_id: string
  total_amount: number
  tax_amount: number
  currency: string
  status: string
}) {
  try {
    const client = getSQL()
    const invoiceNumber = `INV-${Date.now()}`

    const result = await client`
      INSERT INTO invoices (
        order_id,
        invoice_number,
        total_amount,
        tax_amount,
        currency,
        status,
        created_at
      )
      VALUES (
        ${invoiceData.order_id},
        ${invoiceNumber},
        ${invoiceData.total_amount},
        ${invoiceData.tax_amount},
        ${invoiceData.currency},
        ${invoiceData.status},
        NOW()
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creando factura:", error)
    throw error
  }
}

export async function cleanupTestData(orderId?: string) {
  try {
    const client = getSQL()
    if (orderId) {
      // Limpiar datos específicos de una orden
      await client`DELETE FROM downloads WHERE order_id = ${orderId}`
      await client`DELETE FROM invoices WHERE order_id = ${orderId}`
      await client`DELETE FROM orders WHERE id = ${orderId}`
      return { message: `Datos de testing eliminados para orden: ${orderId}` }
    } else {
      // Limpiar todos los datos de testing (órdenes de prueba)
      const testOrders = await client`
        SELECT id FROM orders 
        WHERE customer_email LIKE '%test%' 
        OR customer_email LIKE '%demo%'
        OR customer_name LIKE '%Test%'
      `

      for (const order of testOrders) {
        await client`DELETE FROM downloads WHERE order_id = ${order.id}`
        await client`DELETE FROM invoices WHERE order_id = ${order.id}`
      }

      await client`
        DELETE FROM orders 
        WHERE customer_email LIKE '%test%' 
        OR customer_email LIKE '%demo%'
        OR customer_name LIKE '%Test%'
      `

      return { message: `${testOrders.length} órdenes de testing eliminadas` }
    }
  } catch (error) {
    console.error("Error limpiando datos de testing:", error)
    throw error
  }
}

export async function logAuditEvent(eventData: {
  userId?: string
  action: string
  resource: string
  details?: any
  ipAddress?: string
}) {
  try {
    const client = getSQL()
    await client`
      INSERT INTO audit_logs (
        user_id,
        action,
        resource,
        details,
        ip_address,
        created_at
      )
      VALUES (
        ${eventData.userId || null},
        ${eventData.action},
        ${eventData.resource},
        ${JSON.stringify(eventData.details || {})},
        ${eventData.ipAddress || null},
        NOW()
      )
    `
  } catch (error) {
    console.error("Error registrando evento de auditoría:", error)
  }
}

export default getSQL
