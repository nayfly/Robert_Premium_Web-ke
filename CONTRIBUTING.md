# Guía de Contribución - Robert Software

## 🎯 Bienvenido

Gracias por tu interés en contribuir al proyecto Robert Software. Esta guía te ayudará a entender cómo participar de manera efectiva.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Estándares de Código](#estándares-de-código)
- [Testing](#testing)
- [Documentación](#documentación)

## 🤝 Código de Conducta

### Nuestros Valores
- **Respeto**: Tratamos a todos con dignidad y profesionalismo
- **Colaboración**: Trabajamos juntos hacia objetivos comunes
- **Excelencia**: Nos esforzamos por la calidad en todo lo que hacemos
- **Transparencia**: Comunicamos de manera clara y honesta

### Comportamientos Esperados
- Usar lenguaje inclusivo y profesional
- Ser constructivo en feedback y críticas
- Respetar diferentes puntos de vista
- Enfocarse en lo que es mejor para la comunidad

## 🚀 Cómo Contribuir

### Tipos de Contribuciones

1. **🐛 Reportar Bugs**
   - Usar el template de issue para bugs
   - Incluir pasos para reproducir
   - Especificar entorno (OS, browser, versión)

2. **✨ Proponer Features**
   - Usar el template de feature request
   - Explicar el problema que resuelve
   - Proporcionar casos de uso

3. **📝 Mejorar Documentación**
   - Corregir typos o errores
   - Añadir ejemplos o clarificaciones
   - Traducir contenido

4. **💻 Contribuir Código**
   - Seguir el flujo de trabajo establecido
   - Cumplir con estándares de código
   - Incluir tests apropiados

## ⚙️ Configuración del Entorno

### Prerrequisitos
\`\`\`bash
- Node.js 18+ 
- npm o yarn
- Git
- Supabase CLI (opcional)
\`\`\`

### Instalación
\`\`\`bash
# 1. Fork y clonar el repositorio
git clone https://github.com/tu-usuario/robertsoftware-premium.git
cd robertsoftware-premium

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# 4. Ejecutar en desarrollo
npm run dev
\`\`\`

### Base de Datos
\`\`\`bash
# Configurar Supabase (ver SETUP_SUPABASE.md)
npx supabase init
npx supabase start
npx supabase db reset
\`\`\`

## 🔄 Flujo de Trabajo

### 1. Preparación
\`\`\`bash
# Crear rama desde main
git checkout main
git pull origin main
git checkout -b feature/nombre-descriptivo
\`\`\`

### 2. Desarrollo
\`\`\`bash
# Hacer cambios
# Ejecutar tests
npm run test

# Verificar linting
npm run lint

# Verificar tipos
npm run type-check
\`\`\`

### 3. Commit
\`\`\`bash
# Seguir Conventional Commits
git add .
git commit -m "feat: añadir sistema de notificaciones"

# Tipos de commit:
# feat: nueva funcionalidad
# fix: corrección de bug
# docs: cambios en documentación
# style: formateo, punto y coma faltante, etc
# refactor: refactoring de código
# test: añadir tests
# chore: tareas de mantenimiento
\`\`\`

### 4. Pull Request
\`\`\`bash
# Push de la rama
git push origin feature/nombre-descriptivo

# Crear PR en GitHub con:
# - Título descriptivo
# - Descripción detallada
# - Screenshots si aplica
# - Referencias a issues
\`\`\`

## 📏 Estándares de Código

### TypeScript
\`\`\`typescript
// ✅ Bueno
interface UserProps {
  id: string
  email: string
  role: 'admin' | 'employee' | 'client'
}

const getUser = async (id: string): Promise<UserProps | null> => {
  // implementación
}

// ❌ Malo
const getUser = async (id: any) => {
  // implementación sin tipos
}
\`\`\`

### React Components
\`\`\`tsx
// ✅ Bueno
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick 
}: ButtonProps) {
  return (
    <button 
      className={cn(buttonVariants({ variant, size }))}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
\`\`\`

### API Routes
\`\`\`typescript
// ✅ Bueno
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    
    const result = await getUsersWithPagination(page)
    
    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error fetching users', { error })
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
\`\`\`

### Naming Conventions
\`\`\`typescript
// Variables y funciones: camelCase
const userName = 'john'
const getUserById = () => {}

// Componentes: PascalCase
const UserProfile = () => {}

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'

// Archivos: kebab-case
// user-profile.tsx
// api-helpers.ts
\`\`\`

## 🧪 Testing

### Unit Tests
\`\`\`typescript
// components/__tests__/button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '../button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    screen.getByText('Click me').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
\`\`\`

### Integration Tests
\`\`\`typescript
// app/api/__tests__/users.test.ts
import { GET } from '../users/route'

describe('/api/users', () => {
  it('returns users with pagination', async () => {
    const request = new Request('http://localhost/api/users?page=1')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('users')
    expect(data).toHaveProperty('pagination')
  })
})
\`\`\`

### E2E Tests
\`\`\`typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can login successfully', async ({ page }) => {
  await page.goto('/login')
  
  await page.fill('[data-testid=email]', 'test@example.com')
  await page.fill('[data-testid=password]', 'password123')
  await page.click('[data-testid=login-button]')
  
  await expect(page).toHaveURL('/dashboard')
})
\`\`\`

## 📚 Documentación

### Comentarios en Código
\`\`\`typescript
/**
 * Calcula el precio total incluyendo impuestos
 * @param basePrice - Precio base sin impuestos
 * @param taxRate - Tasa de impuesto (0.21 para 21%)
 * @returns Precio total con impuestos
 */
function calculateTotalPrice(basePrice: number, taxRate: number): number {
  return basePrice * (1 + taxRate)
}
\`\`\`

### README de Componentes
\`\`\`markdown
# UserProfile Component

## Descripción
Componente para mostrar información del perfil de usuario.

## Props
- `user`: Objeto con datos del usuario
- `editable`: Permite edición del perfil
- `onSave`: Callback cuando se guarda

## Ejemplo
\`\`\`tsx
<UserProfile 
  user={currentUser} 
  editable={true}
  onSave={handleSave}
/>
\`\`\`

## Checklist de Calidad

### Antes de Crear PR
- [ ] Código sigue estándares establecidos
- [ ] Tests pasan (unit + integration)
- [ ] No hay errores de TypeScript
- [ ] Linting pasa sin errores
- [ ] Documentación actualizada
- [ ] Screenshots incluidos (si aplica)
- [ ] Performance verificada
- [ ] Accesibilidad verificada

### Definición de "Terminado"
- [ ] Feature implementada completamente
- [ ] Tests con cobertura >80%
- [ ] Documentación actualizada
- [ ] Code review aprobado
- [ ] QA testing completado
- [ ] Deploy en staging exitoso

## 🆘 Obtener Ayuda

### Canales de Comunicación
- **Issues**: Para bugs y feature requests
- **Discussions**: Para preguntas generales
- **Email**: robert@robertsoftware.com

### Recursos Útiles
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🙏 Reconocimientos

Agradecemos a todos los contribuidores que hacen posible este proyecto. Tu tiempo y esfuerzo son muy valorados.

---

**¿Preguntas?** No dudes en abrir un issue o contactarnos directamente.
