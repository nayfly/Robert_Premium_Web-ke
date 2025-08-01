# Guía de Estilo de Código - Robert Software

## 🎯 Objetivo

Esta guía establece estándares consistentes para mantener un código limpio, legible y mantenible en todo el proyecto.

## 📋 Tabla de Contenidos

- [Principios Generales](#principios-generales)
- [TypeScript](#typescript)
- [React & Next.js](#react--nextjs)
- [Styling & CSS](#styling--css)
- [API Routes](#api-routes)
- [Base de Datos](#base-de-datos)
- [Testing](#testing)
- [Performance](#performance)
- [Seguridad](#seguridad)

## 🎨 Principios Generales

### 1. Claridad sobre Brevedad
\`\`\`typescript
// ✅ Bueno - Claro y descriptivo
const calculateMonthlySubscriptionPrice = (basePrice: number, discountRate: number) => {
  return basePrice * (1 - discountRate)
}

// ❌ Malo - Demasiado breve
const calc = (p: number, d: number) => p * (1 - d)
\`\`\`

### 2. Consistencia
\`\`\`typescript
// ✅ Bueno - Patrón consistente
const getUserById = async (id: string) => { /* */ }
const getProjectById = async (id: string) => { /* */ }
const getTaskById = async (id: string) => { /* */ }

// ❌ Malo - Inconsistente
const getUserById = async (id: string) => { /* */ }
const fetchProject = async (projectId: string) => { /* */ }
const retrieveTask = (taskId: string) => { /* */ }
\`\`\`

### 3. Principio DRY (Don't Repeat Yourself)
\`\`\`typescript
// ✅ Bueno - Función reutilizable
const formatCurrency = (amount: number, currency = 'EUR') => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency
  }).format(amount)
}

// ❌ Malo - Código duplicado
const priceA = `€${(123.45).toFixed(2)}`
const priceB = `€${(678.90).toFixed(2)}`
\`\`\`

## 🔷 TypeScript

### Tipos e Interfaces
\`\`\`typescript
// ✅ Bueno - Interfaces para objetos
interface User {
  id: string
  email: string
  role: UserRole
  createdAt: Date
  profile?: UserProfile
}

// ✅ Bueno - Types para uniones y primitivos
type UserRole = 'admin' | 'employee' | 'client'
type Status = 'pending' | 'approved' | 'rejected'

// ✅ Bueno - Generics para reutilización
interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}
\`\`\`

### Naming Conventions
\`\`\`typescript
// Interfaces: PascalCase con 'I' opcional
interface UserProfile { }
interface IUserService { } // Solo si hay ambigüedad

// Types: PascalCase
type PaymentStatus = 'pending' | 'completed' | 'failed'

// Enums: PascalCase
enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed'
}

// Variables y funciones: camelCase
const currentUser = getCurrentUser()
const isUserAuthenticated = checkAuthentication()

// Constantes: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
\`\`\`

### Funciones
\`\`\`typescript
// ✅ Bueno - Tipado explícito
const calculateTax = (amount: number, rate: number): number => {
  return amount * rate
}

// ✅ Bueno - Async/await con manejo de errores
const fetchUserData = async (userId: string): Promise<User | null> => {
  try {
    const response = await api.get(`/users/${userId}`)
    return response.data
  } catch (error) {
    logger.error('Failed to fetch user', { userId, error })
    return null
  }
}

// ✅ Bueno - Parámetros opcionales al final
const createUser = (
  email: string, 
  role: UserRole, 
  profile?: Partial<UserProfile>
): Promise<User> => {
  // implementación
}
\`\`\`

## ⚛️ React & Next.js

### Componentes
\`\`\`tsx
// ✅ Bueno - Props interface separada
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ 
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick
}: ButtonProps) {
  return (
    <button
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        { 'btn-loading': loading }
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <LoadingSpinner /> : children}
    </button>
  )
}
\`\`\`

### Hooks Personalizados
\`\`\`tsx
// ✅ Bueno - Hook reutilizable
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        logger.error('Auth check failed', { error })
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    // implementación
  }, [])

  const logout = useCallback(async () => {
    // implementación
  }, [])

  return { user, loading, login, logout }
}
\`\`\`

### Estructura de Archivos
\`\`\`
components/
├── ui/                 # Componentes base reutilizables
│   ├── button.tsx
│   ├── input.tsx
│   └── modal.tsx
├── forms/             # Componentes de formularios
│   ├── login-form.tsx
│   └── user-form.tsx
├── layout/            # Componentes de layout
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── footer.tsx
└── features/          # Componentes específicos de features
    ├── auth/
    ├── dashboard/
    └── projects/
\`\`\`

## 🎨 Styling & CSS

### Tailwind CSS
\`\`\`tsx
// ✅ Bueno - Clases organizadas y legibles
<div className={cn(
  // Layout
  'flex items-center justify-between',
  // Spacing
  'px-4 py-2 mb-4',
  // Appearance
  'bg-white border border-gray-200 rounded-lg shadow-sm',
  // States
  'hover:shadow-md focus:ring-2 focus:ring-blue-500',
  // Responsive
  'md:px-6 lg:py-3'
)}>
\`\`\`

### Componentes con Variantes
\`\`\`tsx
// ✅ Bueno - Usando class-variance-authority
const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        danger: 'bg-red-600 text-white hover:bg-red-700'
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)
\`\`\`

## 🔌 API Routes

### Estructura Estándar
\`\`\`typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { withAuth, withErrorHandling } from '@/lib/api-helpers'
import { createUserSchema } from '@/lib/validation-schemas'
import { logger } from '@/lib/logger'

export const GET = withAuth(
  withErrorHandling(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    logger.info('Fetching users', { page, limit })

    const users = await getUsersWithPagination({ page, limit })
    
    return NextResponse.json({
      data: users,
      pagination: {
        page,
        limit,
        total: users.length
      }
    })
  })
)

export const POST = withAuth(
  withErrorHandling(async (request: NextRequest) => {
    const body = await request.json()
    
    // Validación
    const validatedData = createUserSchema.parse(body)
    
    logger.info('Creating user', { email: validatedData.email })
    
    const user = await createUser(validatedData)
    
    return NextResponse.json(
      { data: user, message: 'User created successfully' },
      { status: 201 }
    )
  })
)
\`\`\`

### Manejo de Errores
\`\`\`typescript
// ✅ Bueno - Errores tipados y consistentes
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Uso
if (!user) {
  throw new ApiError('User not found', 404, 'USER_NOT_FOUND')
}
\`\`\`

## 🗄️ Base de Datos

### Queries con Supabase
\`\`\`typescript
// ✅ Bueno - Queries tipadas y reutilizables
export const getUsersWithProjects = async (filters: UserFilters = {}) => {
  const query = supabase
    .from('users')
    .select(`
      id,
      email,
      role,
      created_at,
      projects (
        id,
        name,
        status
      )
    `)

  if (filters.role) {
    query.eq('role', filters.role)
  }

  if (filters.search) {
    query.ilike('email', `%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) {
    logger.error('Database query failed', { error, filters })
    throw new ApiError('Failed to fetch users')
  }

  return data
}
\`\`\`

### Migraciones SQL
\`\`\`sql
-- ✅ Bueno - Migraciones versionadas y documentadas
-- Migration: 001_create_users_table.sql
-- Description: Create users table with role-based access

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);
\`\`\`

## 🧪 Testing

### Unit Tests
\`\`\`typescript
// ✅ Bueno - Tests descriptivos y completos
describe('calculateTotalPrice', () => {
  it('should calculate price with tax correctly', () => {
    const result = calculateTotalPrice(100, 0.21)
    expect(result).toBe(121)
  })

  it('should handle zero tax rate', () => {
    const result = calculateTotalPrice(100, 0)
    expect(result).toBe(100)
  })

  it('should throw error for negative prices', () => {
    expect(() => calculateTotalPrice(-100, 0.21))
      .toThrow('Price cannot be negative')
  })
})
\`\`\`

### Component Tests
\`\`\`tsx
// ✅ Bueno - Testing user interactions
describe('LoginForm', () => {
  it('should submit form with valid credentials', async () => {
    const mockLogin = jest.fn()
    render(<LoginForm onLogin={mockLogin} />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })
})
\`\`\`

## ⚡ Performance

### Optimizaciones React
\`\`\`tsx
// ✅ Bueno - Memoización apropiada
const ExpensiveComponent = memo(({ data, onUpdate }: Props) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: expensiveCalculation(item)
    }))
  }, [data])

  const handleUpdate = useCallback((id: string) => {
    onUpdate(id)
  }, [onUpdate])

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} data={item} onUpdate={handleUpdate} />
      ))}
    </div>
  )
})
\`\`\`

### Lazy Loading
\`\`\`tsx
// ✅ Bueno - Componentes lazy
const DashboardChart = lazy(() => import('./dashboard-chart'))
const AdminPanel = lazy(() => import('./admin-panel'))

// Uso con Suspense
<Suspense fallback={<ChartLoading />}>
  <DashboardChart data={chartData} />
</Suspense>
\`\`\`

## 🔒 Seguridad

### Validación de Inputs
\`\`\`typescript
// ✅ Bueno - Validación con Zod
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

// Uso en API
const validatedData = loginSchema.parse(requestBody)
\`\`\`

### Sanitización
\`\`\`typescript
// ✅ Bueno - Sanitización de datos
import DOMPurify from 'dompurify'

const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
    ALLOWED_ATTR: []
  })
}
\`\`\`

## 📏 Métricas de Calidad

### Complejidad Ciclomática
\`\`\`typescript
// ✅ Bueno - Función simple (CC: 2)
const getUserStatus = (user: User): string => {
  return user.isActive ? 'active' : 'inactive'
}

// ❌ Malo - Función compleja (CC: 8)
const processUser = (user: User) => {
  if (user.role === 'admin') {
    if (user.permissions.includes('write')) {
      if (user.isActive) {
        // ... más lógica anidada
      }
    }
  }
  // Refactorizar en funciones más pequeñas
}
\`\`\`

### Cobertura de Tests
- **Mínimo**: 80% de cobertura
- **Objetivo**: 90% de cobertura
- **Crítico**: 100% para funciones de seguridad

## 🔧 Herramientas

### ESLint Configuration
\`\`\`json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "prefer-const": "error",
    "no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
\`\`\`

### Prettier Configuration
\`\`\`json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
\`\`\`

---

**Recuerda**: Estas son guías, no reglas absolutas. Usa el sentido común y prioriza la legibilidad y mantenibilidad del código.
