// Usuarios demo hardcodeados para testing
const DEMO_USERS = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    email: "admin@robertsoftware.com",
    password: "Admin123!",
    name: "Administrador Principal",
    role: "admin",
    company: "Robert Software",
    position: "CEO & Fundador",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    email: "empleado@demo.com",
    password: "Empleado123!",
    name: "Empleado Demo",
    role: "empleado",
    company: "Robert Software",
    position: "Desarrollador Senior",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    email: "cliente@demo.com",
    password: "Cliente123!",
    name: "Cliente Demo",
    role: "cliente",
    company: "Empresa Demo S.L.",
    position: "Director de IT",
  },
]

// Rate limiting simple en memoria (en producción usar Redis)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

export interface DemoUser {
  id: string
  email: string
  name: string
  role: string
  company: string
  position: string
}

export interface LoginResult {
  success: boolean
  user?: DemoUser
  token?: string
  error?: string
  remainingAttempts?: number
}

export function validateDemoCredentials(email: string, password: string): DemoUser | null {
  const user = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())

  if (!user) {
    return null
  }

  // Validar contraseña
  if (user.password !== password) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    company: user.company,
    position: user.position,
  }
}

export function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts: number } {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutos
  const maxAttempts = 5

  const attempts = loginAttempts.get(ip)

  if (!attempts) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return { allowed: true, remainingAttempts: maxAttempts - 1 }
  }

  // Resetear si ha pasado la ventana de tiempo
  if (now - attempts.lastAttempt > windowMs) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return { allowed: true, remainingAttempts: maxAttempts - 1 }
  }

  // Incrementar contador
  attempts.count++
  attempts.lastAttempt = now

  const remaining = Math.max(0, maxAttempts - attempts.count)

  return {
    allowed: attempts.count <= maxAttempts,
    remainingAttempts: remaining,
  }
}

export function generateDemoToken(user: DemoUser): string {
  // Token simple sin JWT para evitar dependencias
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    company: user.company,
    position: user.position,
    demo: true,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
  }

  // Codificar en base64 para simplicidad
  return Buffer.from(JSON.stringify(payload)).toString("base64")
}

export function validateDemoToken(token: string): DemoUser | null {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString())

    if (!decoded.demo || decoded.exp < Date.now()) {
      return null
    }

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      company: decoded.company,
      position: decoded.position,
    }
  } catch (error) {
    return null
  }
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remover caracteres peligrosos
    .substring(0, 255) // Limitar longitud
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  return emailRegex.test(email)
}

export async function loginDemo(email: string, password: string, ip: string): Promise<LoginResult> {
  try {
    // Sanitizar inputs
    const cleanEmail = sanitizeInput(email)
    const cleanPassword = sanitizeInput(password)

    // Validar formato de email
    if (!validateEmail(cleanEmail)) {
      return {
        success: false,
        error: "Formato de email inválido",
      }
    }

    // Verificar rate limiting
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: "Demasiados intentos fallidos. Intenta de nuevo en 15 minutos.",
        remainingAttempts: 0,
      }
    }

    // Validar credenciales
    const user = validateDemoCredentials(cleanEmail, cleanPassword)
    if (!user) {
      return {
        success: false,
        error: "Credenciales inválidas",
        remainingAttempts: rateLimit.remainingAttempts - 1,
      }
    }

    // Generar token
    const token = generateDemoToken(user)

    return {
      success: true,
      user,
      token,
    }
  } catch (error) {
    console.error("Error en loginDemo:", error)
    return {
      success: false,
      error: "Error interno del servidor",
    }
  }
}

// Función para obtener todos los usuarios demo (para UI)
export function getAllDemoUsers() {
  return DEMO_USERS.map(({ password, ...user }) => user)
}

// Función para limpiar rate limiting periódicamente
export function cleanupRateLimit() {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000

  for (const [ip, attempts] of loginAttempts.entries()) {
    if (now - attempts.lastAttempt > windowMs) {
      loginAttempts.delete(ip)
    }
  }
}
