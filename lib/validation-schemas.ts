import { z } from "zod"

// Esquemas base
export const emailSchema = z.string().email("Email inválido").toLowerCase()
export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial",
  )

export const phoneSchema = z
  .string()
  .regex(/^[+]?[1-9][\d]{0,15}$/, "Formato de teléfono inválido")
  .optional()

export const nameSchema = z
  .string()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(255, "El nombre no puede superar los 255 caracteres")
  .trim()

export const companySchema = z
  .string()
  .min(2, "La empresa debe tener al menos 2 caracteres")
  .max(255, "La empresa no puede superar los 255 caracteres")
  .trim()

// Esquemas de usuario
export const userRoleSchema = z.enum(["admin", "empleado", "cliente"])

export const createUserSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema,
  role: userRoleSchema,
  phone: phoneSchema,
  company: companySchema.optional(),
  position: z.string().max(255).optional(),
})

export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  role: userRoleSchema.optional(),
  phone: phoneSchema,
  company: companySchema.optional(),
  position: z.string().max(255).optional(),
  is_active: z.boolean().optional(),
  email_verified: z.boolean().optional(),
  password: passwordSchema.optional(),
})

// Esquemas de solicitudes de usuario
export const createUserRequestSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  company: companySchema,
  position: z.string().max(255).optional(),
  access_type: z.enum(["cliente", "empleado"]),
  message: z.string().max(2000, "El mensaje no puede superar los 2000 caracteres").optional(),
})

export const updateUserRequestSchema = z.object({
  action: z.enum(["approve", "reject"]),
  rejection_reason: z.string().max(500, "La razón de rechazo no puede superar los 500 caracteres").optional(),
})

// Esquemas de proyectos
export const projectStatusSchema = z.enum(["planning", "active", "on_hold", "completed", "cancelled"])
export const projectPrioritySchema = z.enum(["low", "medium", "high", "urgent"])

export const createProjectSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255),
  description: z.string().max(2000).optional(),
  client_id: z.string().uuid("ID de cliente inválido"),
  assigned_to: z.string().uuid("ID de empleado inválido").optional(),
  budget: z.number().positive("El presupuesto debe ser positivo").optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  priority: projectPrioritySchema.default("medium"),
  status: projectStatusSchema.default("planning"),
})

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  client_id: z.string().uuid().optional(),
  assigned_to: z.string().uuid().optional(),
  budget: z.number().positive().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  priority: projectPrioritySchema.optional(),
  status: projectStatusSchema.optional(),
  completion_percentage: z.number().min(0).max(100).optional(),
})

// Esquemas de tareas
export const taskStatusSchema = z.enum(["todo", "in_progress", "review", "completed", "cancelled"])
export const taskPrioritySchema = z.enum(["low", "medium", "high", "urgent"])

export const createTaskSchema = z.object({
  project_id: z.string().uuid("ID de proyecto inválido"),
  title: z.string().min(1, "El título es requerido").max(255),
  description: z.string().max(2000).optional(),
  assigned_to: z.string().uuid("ID de empleado inválido").optional(),
  due_date: z.string().datetime().optional(),
  estimated_hours: z.number().positive("Las horas estimadas deben ser positivas").optional(),
  priority: taskPrioritySchema.default("medium"),
  status: taskStatusSchema.default("todo"),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  assigned_to: z.string().uuid().optional(),
  due_date: z.string().datetime().optional(),
  estimated_hours: z.number().positive().optional(),
  actual_hours: z.number().positive().optional(),
  priority: taskPrioritySchema.optional(),
  status: taskStatusSchema.optional(),
})

// Esquemas de autenticación
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "La contraseña es requerida"),
})

// Esquemas de paginación y filtros
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

export const commonFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

// Helper para validar datos
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ")
      throw new Error(`Datos inválidos: ${messages}`)
    }
    throw error
  }
}

// Helper para validar parámetros de query
export function validateQueryParams<T>(schema: z.ZodSchema<T>, searchParams: URLSearchParams): T {
  const params: Record<string, any> = {}

  for (const [key, value] of searchParams.entries()) {
    // Convertir números
    if (!isNaN(Number(value)) && value !== "") {
      params[key] = Number(value)
    } else if (value === "true" || value === "false") {
      // Convertir booleanos
      params[key] = value === "true"
    } else {
      params[key] = value
    }
  }

  return validateData(schema, params)
}
