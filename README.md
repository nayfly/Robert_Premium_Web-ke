# Robert Software - Premium Business Website

Una plataforma completa de gestión empresarial con autenticación, gestión de usuarios, proyectos y tareas, construida con Next.js 14, Supabase y TypeScript.

## 🚀 Características

### ✅ **Sistema de Autenticación Completo**
- Login seguro con JWT
- Gestión de roles (Admin, Empleado, Cliente)
- Protección de rutas por middleware
- Sistema de bloqueo por intentos fallidos
- Logs de auditoría completos

### ✅ **Gestión de Usuarios**
- CRUD completo de usuarios
- Filtros y búsqueda avanzada
- Gestión de roles y permisos
- Solicitudes de acceso automatizadas

### ✅ **Gestión de Proyectos**
- Creación y seguimiento de proyectos
- Asignación de tareas y empleados
- Control de presupuestos y fechas
- Estados y prioridades personalizables

### ✅ **Dashboard por Roles**
- **Admin**: Gestión completa del sistema
- **Empleado**: Gestión de tareas y proyectos asignados
- **Cliente**: Seguimiento de sus proyectos

### ✅ **Base de Datos Supabase**
- Persistencia de datos real
- Row Level Security (RLS)
- Funciones y triggers automáticos
- Backup y escalabilidad automática

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: JWT + Supabase Auth
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Formularios**: React Hook Form
- **Notificaciones**: React Hot Toast

## 📦 Instalación

### 1. Clonar el repositorio
\`\`\`bash
git clone <repository-url>
cd robertsoftware-premium
\`\`\`

### 2. Instalar dependencias
\`\`\`bash
npm install
# o
yarn install
# o
pnpm install
\`\`\`

### 3. Configurar variables de entorno
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edita `.env.local` con tus credenciales:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role_supabase

# JWT Secret
JWT_SECRET=tu_clave_secreta_jwt_muy_segura

# Stripe (opcional)
STRIPE_SECRET_KEY=tu_clave_secreta_stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_clave_publica_stripe
\`\`\`

### 4. Configurar Supabase

#### 4.1 Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia las credenciales al archivo `.env.local`

#### 4.2 Ejecutar scripts SQL
En el SQL Editor de Supabase, ejecuta en orden:

1. `scripts/01-create-tables.sql` - Crear tablas
2. `scripts/02-create-functions.sql` - Crear funciones y triggers
3. `scripts/03-insert-demo-data.sql` - Insertar datos de demo

### 5. Ejecutar en desarrollo
\`\`\`bash
npm run dev
# o
yarn dev
# o
pnpm dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 👥 Usuarios Demo

El sistema incluye usuarios demo para testing:

### 👑 **Administrador**
- **Email**: `admin@robertsoftware.com`
- **Contraseña**: `Admin123!`
- **Permisos**: Acceso completo al sistema

### 🧑‍💼 **Empleado**
- **Email**: `empleado@demo.com`
- **Contraseña**: `Empleado123!`
- **Permisos**: Gestión de proyectos y tareas

### 🙋 **Cliente**
- **Email**: `cliente@demo.com`
- **Contraseña**: `Cliente123!`
- **Permisos**: Seguimiento de sus proyectos

## 🗂️ Estructura del Proyecto

\`\`\`
├── app/                          # App Router de Next.js
│   ├── [lang]/                   # Rutas internacionalizadas
│   │   ├── dashboard/            # Dashboards por rol
│   │   │   ├── admin/           # Panel de administración
│   │   │   ├── empleado/        # Panel de empleado
│   │   │   └── cliente/         # Panel de cliente
│   │   ├── login/               # Página de login
│   │   └── page.tsx             # Página principal
│   ├── api/                     # API Routes
│   │   ├── auth/                # Endpoints de autenticación
│   │   ├── users/               # Gestión de usuarios
│   │   ├── projects/            # Gestión de proyectos
│   │   └── user-requests/       # Solicitudes de acceso
│   └── globals.css              # Estilos globales
├── components/                   # Componentes reutilizables
│   ├── ui/                      # Componentes de UI (shadcn)
│   ├── dashboard/               # Componentes del dashboard
│   └── ...                     # Otros componentes
├── lib/                         # Utilidades y configuración
│   ├── supabase.ts             # Cliente de Supabase
│   ├── auth.ts                 # Lógica de autenticación
│   ├── jwt.ts                  # Utilidades JWT
│   └── ...                     # Otras utilidades
├── scripts/                     # Scripts SQL para la base de datos
│   ├── 01-create-tables.sql    # Crear tablas
│   ├── 02-create-functions.sql # Funciones y triggers
│   └── 03-insert-demo-data.sql # Datos de demo
└── middleware.ts                # Middleware de autenticación
\`\`\`

## 🔐 Seguridad

### Características de Seguridad Implementadas:

- **Autenticación JWT**: Tokens seguros con expiración
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Sanitización de Datos**: Prevención de inyección SQL/XSS
- **Row Level Security**: Políticas de acceso a nivel de base de datos
- **Logs de Auditoría**: Registro completo de acciones del sistema
- **Bloqueo de Cuentas**: Bloqueo automático tras intentos fallidos
- **Validación de Entrada**: Validación estricta de todos los inputs

## 📊 Base de Datos

### Tablas Principales:

- **users**: Gestión de usuarios y autenticación
- **projects**: Proyectos y su información
- **tasks**: Tareas asociadas a proyectos
- **user_requests**: Solicitudes de acceso al sistema
- **audit_logs**: Logs de auditoría y seguridad

### Funciones Automáticas:

- Actualización automática de `updated_at`
- Gestión de intentos de login fallidos
- Limpieza automática de logs antiguos
- Validaciones de seguridad

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Variables de Entorno para Producción:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=tu_url_produccion
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_produccion
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_produccion
JWT_SECRET=clave_jwt_super_segura_produccion
\`\`\`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- **Email**: support@robertsoftware.com
- **Website**: [robertsoftware.com](https://robertsoftware.com)

---

**Desarrollado con ❤️ por Robert Software**
