import { supabaseAdmin, type User, logAuditEvent, getUserByEmail, createUser } from "./supabase"
import bcrypt from "bcryptjs"
import { verifyJWT } from "./jwt"

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
  requiresVerification?: boolean
}

export class AuthService {
  // Verificar credenciales de usuario
  static async verifyCredentials(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const { email, password } = credentials

      // Buscar usuario por email
      const user = await getUserByEmail(email)
      if (!user || !user.is_active) {
        await this.incrementFailedAttempts(email)
        return {
          success: false,
          error: "Credenciales inválidas",
        }
      }

      // Verificar si la cuenta está bloqueada
      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        return {
          success: false,
          error: "Cuenta temporalmente bloqueada. Intenta más tarde.",
        }
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password_hash || "")

      if (!isValidPassword) {
        await this.incrementFailedAttempts(email)
        return {
          success: false,
          error: "Credenciales inválidas",
        }
      }

      // Resetear intentos fallidos y actualizar último login
      await this.resetFailedAttempts(user.id)

      // Crear log de auditoría
      await logAuditEvent({
        user_id: user.id,
        action: "LOGIN_SUCCESS",
        table_name: "users",
        record_id: user.id,
        severity: "info",
        success: true,
      })

      return {
        success: true,
        user: user,
      }
    } catch (error) {
      console.error("Error en verificación de credenciales:", error)
      return {
        success: false,
        error: "Error interno del servidor",
      }
    }
  }

  // Obtener usuario por ID
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const { data: user, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", userId)
        .eq("is_active", true)
        .single()

      if (error || !user) {
        return null
      }

      return user
    } catch (error) {
      console.error("Error obteniendo usuario:", error)
      return null
    }
  }

  // Crear nuevo usuario
  static async createUser(userData: {
    email: string
    password: string
    name: string
    role: "admin" | "empleado" | "cliente"
    phone?: string
    company?: string
    position?: string
  }): Promise<AuthResult> {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await getUserByEmail(userData.email)
      if (existingUser) {
        return {
          success: false,
          error: "El usuario ya existe",
        }
      }

      // Hash de la contraseña
      const passwordHash = await this.hashPassword(userData.password)

      // Crear usuario
      const user = await createUser({
        email: userData.email.toLowerCase(),
        password_hash: passwordHash,
        name: userData.name,
        role: userData.role,
        phone: userData.phone,
        company: userData.company,
        position: userData.position,
      })

      if (!user) {
        console.error("Error creando usuario:", "Usuario no creado")
        return {
          success: false,
          error: "Error creando usuario",
        }
      }

      // Log de creación de usuario
      await logAuditEvent({
        user_id: user.id,
        action: "USER_CREATED",
        table_name: "users",
        record_id: user.id,
        severity: "info",
        success: true,
        new_values: {
          email: userData.email,
          name: userData.name,
          role: userData.role,
        },
      })

      return {
        success: true,
        user: user,
      }
    } catch (error) {
      console.error("Error creando usuario:", error)
      await logAuditEvent({
        action: "USER_CREATE_FAILED",
        table_name: "users",
        severity: "error",
        success: false,
        error_message: error instanceof Error ? error.message : "Error desconocido",
        new_values: {
          email: userData.email,
          name: userData.name,
          role: userData.role,
        },
      })
      return {
        success: false,
        error: "Error interno del servidor",
      }
    }
  }

  // Incrementar intentos fallidos
  private static async incrementFailedAttempts(email: string): Promise<void> {
    try {
      const { data: user } = await supabaseAdmin
        .from("users")
        .select("failed_login_attempts, id")
        .eq("email", email.toLowerCase())
        .single()

      if (user) {
        const newAttempts = (user.failed_login_attempts || 0) + 1
        const updateData: any = {
          failed_login_attempts: newAttempts,
        }

        // Bloquear cuenta después de 5 intentos
        if (newAttempts >= 5) {
          const lockUntil = new Date()
          lockUntil.setMinutes(lockUntil.getMinutes() + 30)
          updateData.locked_until = lockUntil.toISOString()
        }

        await supabaseAdmin.from("users").update(updateData).eq("email", email.toLowerCase())

        // Log de intento fallido
        await logAuditEvent({
          user_id: user.id,
          action: "LOGIN_FAILED",
          table_name: "users",
          record_id: user.id,
          severity: newAttempts >= 5 ? "warning" : "info",
          success: false,
          new_values: { email, failed_attempts: newAttempts },
        })
      }
    } catch (error) {
      console.error("Error incrementando intentos fallidos:", error)
    }
  }

  // Resetear intentos fallidos
  private static async resetFailedAttempts(userId: string): Promise<void> {
    try {
      await supabaseAdmin
        .from("users")
        .update({
          failed_login_attempts: 0,
          locked_until: null,
          last_login: new Date().toISOString(),
        })
        .eq("id", userId)
    } catch (error) {
      console.error("Error reseteando intentos fallidos:", error)
    }
  }

  // Crear hash de contraseña
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
  }

  // Comparar contraseña con hash
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  // Validar formato de email
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    return emailRegex.test(email)
  }

  // Validar fortaleza de contraseña
  static isValidPassword(password: string): boolean {
    // Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return passwordRegex.test(password)
  }

  // Verificar si un usuario tiene permisos específicos
  static hasPermission(user: User, permission: string): boolean {
    const rolePermissions = {
      admin: ["read", "write", "delete", "manage_users", "manage_projects", "view_analytics"],
      empleado: ["read", "write", "manage_projects"],
      cliente: ["read"],
    }

    return rolePermissions[user.role]?.includes(permission) || false
  }

  // Obtener usuarios con filtros
  static async getUsers(filters?: {
    role?: "admin" | "empleado" | "cliente"
    active?: boolean
    limit?: number
    offset?: number
  }): Promise<{ users: User[]; total: number }> {
    try {
      let query = supabaseAdmin.from("users").select("*", { count: "exact" })

      if (filters?.role) {
        query = query.eq("role", filters.role)
      }

      if (filters?.active !== undefined) {
        query = query.eq("is_active", filters.active)
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data: users, error, count } = await query

      if (error) {
        console.error("Error obteniendo usuarios:", error)
        return { users: [], total: 0 }
      }

      return { users: users || [], total: count || 0 }
    } catch (error) {
      console.error("Error obteniendo usuarios:", error)
      return { users: [], total: 0 }
    }
  }

  // Actualizar usuario
  static async updateUser(
    userId: string,
    updates: Partial<{
      name: string
      email: string
      role: "admin" | "empleado" | "cliente"
      is_active: boolean
      phone: string
      company: string
      position: string
    }>,
  ): Promise<AuthResult> {
    try {
      const { data: user, error } = await supabaseAdmin
        .from("users")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select("*")
        .single()

      if (error || !user) {
        console.error("Error actualizando usuario:", error)
        return {
          success: false,
          error: "Error actualizando usuario",
        }
      }

      // Log de actualización
      await logAuditEvent({
        user_id: userId,
        action: "USER_UPDATED",
        table_name: "users",
        record_id: userId,
        severity: "info",
        success: true,
        new_values: updates,
      })

      return {
        success: true,
        user: user,
      }
    } catch (error) {
      console.error("Error actualizando usuario:", error)
      return {
        success: false,
        error: "Error interno del servidor",
      }
    }
  }

  // Eliminar usuario (soft delete)
  static async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabaseAdmin
        .from("users")
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) {
        console.error("Error eliminando usuario:", error)
        return {
          success: false,
          error: "Error eliminando usuario",
        }
      }

      // Log de eliminación
      await logAuditEvent({
        user_id: userId,
        action: "USER_DELETED",
        table_name: "users",
        record_id: userId,
        severity: "warning",
        success: true,
      })

      return { success: true }
    } catch (error) {
      console.error("Error eliminando usuario:", error)
      return {
        success: false,
        error: "Error interno del servidor",
      }
    }
  }
}

export async function verifyAuth(token: string): Promise<User | null> {
  try {
    const decoded = verifyJWT(token)
    if (!decoded) return null

    // Verificar usuario en Supabase
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", decoded.userId)
      .eq("is_active", true)
      .single()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error("Auth verification error:", error)
    return null
  }
}

export async function requireAuth(token: string, requiredRole?: string[]): Promise<User> {
  const user = await verifyAuth(token)

  if (!user) {
    throw new Error("Authentication required")
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    throw new Error("Insufficient permissions")
  }

  return user
}

export function hasRole(user: User | null, allowedRoles: string[]): boolean {
  if (!user || !user.is_active) return false
  return allowedRoles.includes(user.role)
}

export function isAdmin(user: User | null): boolean {
  return hasRole(user, ["admin"])
}

export function isEmployee(user: User | null): boolean {
  return hasRole(user, ["admin", "empleado"])
}

export function canAccessResource(user: User | null, resourceOwner?: string): boolean {
  if (!user || !user.is_active) return false

  // Admin puede acceder a todo
  if (user.role === "admin") return true

  // Empleado puede acceder a recursos sin dueño específico
  if (user.role === "empleado" && !resourceOwner) return true

  // Usuario puede acceder solo a sus propios recursos
  return user.id === resourceOwner
}

export async function validateUserPermissions(
  userId: string,
  requiredRole?: string,
  resourceOwner?: string,
): Promise<boolean> {
  try {
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, role, is_active")
      .eq("id", userId)
      .eq("is_active", true)
      .single()

    if (error || !user) return false

    // Verificar rol si es requerido
    if (requiredRole) {
      if (requiredRole === "admin" && user.role !== "admin") return false
      if (requiredRole === "empleado" && !["admin", "empleado"].includes(user.role)) return false
    }

    // Verificar acceso a recurso específico
    if (resourceOwner) {
      if (user.role === "admin") return true
      if (user.id !== resourceOwner) return false
    }

    return true
  } catch (error) {
    console.error("Error validating user permissions:", error)
    return false
  }
}

// Función de conveniencia para compatibilidad
export const createAuditLog = logAuditEvent

export default AuthService
