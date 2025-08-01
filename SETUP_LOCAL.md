# 🚀 Guía de Configuración Local - Robert Software

Esta guía te ayudará a configurar el proyecto Robert Software en tu entorno local de desarrollo.

## 📋 Prerrequisitos

- **Node.js** 18+ o **Bun** 1.0+
- **Git**
- Cuenta en **Neon** (para base de datos PostgreSQL)
- Cuenta en **Stripe** (opcional, para pagos)
- Servicio SMTP (opcional, para emails)

## 🛠️ Instalación Paso a Paso

### 1. Clonar el Repositorio

\`\`\`bash
git clone <tu-repositorio>
cd robert-software-premium
\`\`\`

### 2. Instalar Dependencias

\`\`\`bash
# Con npm
npm install

# Con bun (recomendado)
bun install
\`\`\`

### 3. Configurar Variables de Entorno

Copia el archivo de ejemplo:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edita `.env.local` con tus valores:

\`\`\`env
# Base de datos (REQUERIDO)
NEON_DATABASE_URL="postgresql://usuario:password@host/database?sslmode=require"
NEON_DATABASE_URL="postgresql://usuario:password@host/database?sslmode=require"

# JWT (REQUERIDO)
JWT_SECRET="tu-jwt-secret-muy-seguro-aqui"

# Sitio (REQUERIDO)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Stripe (OPCIONAL)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (OPCIONAL)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-app-password"
EMAIL_FROM="tu-email@gmail.com"
EMAIL_FROM_NAME="Robert Software"
EMAIL_REPLY_TO="tu-email@gmail.com"
\`\`\`

## 🗄️ Configuración de Base de Datos

### Opción 1: Configuración Automática (Recomendada)

1. **Crear proyecto en Neon:**
   - Ve a [neon.tech](https://neon.tech)
   - Crea una cuenta y un nuevo proyecto
   - Copia la cadena de conexión

2. **Configurar automáticamente:**
   \`\`\`bash
   # Ejecutar el proyecto
   npm run dev
   
   # Visitar en el navegador
   http://localhost:3000/api/test/database
   \`\`\`

3. **Configurar tablas automáticamente:**
   \`\`\`bash
   curl -X POST http://localhost:3000/api/test/database
   \`\`\`

### Opción 2: Configuración Manual

1. **Ejecutar scripts SQL:**
   
   Conecta a tu base de datos Neon y ejecuta en orden:

   \`\`\`sql
   -- 1. Crear tablas básicas
   \i scripts/01-create-tables.sql
   
   -- 2. Crear funciones
   \i scripts/02-create-functions.sql
   
   -- 3. Insertar datos demo
   \i scripts/03-insert-demo-data.sql
   \`\`\`

2. **Verificar instalación:**
   \`\`\`bash
   curl http://localhost:3000/api/test/database
   \`\`\`

## 🚀 Ejecutar el Proyecto

\`\`\`bash
# Modo desarrollo
npm run dev

# Modo producción
npm run build
npm start
\`\`\`

El proyecto estará disponible en: http://localhost:3000

## 👥 Usuarios Demo

Una vez configurado, puedes usar estos usuarios para probar:

| Email | Contraseña | Rol |
|-------|------------|-----|
| `admin@demo.com` | `admin123` | Administrador |
| `empleado@demo.com` | `empleado123` | Empleado |
| `cliente@demo.com` | `cliente123` | Cliente |

## 🔧 Configuración Opcional

### Stripe (Pagos)

1. **Crear cuenta en Stripe:**
   - Ve a [stripe.com](https://stripe.com)
   - Obtén tus claves de API de prueba

2. **Configurar webhook:**
   - URL: `https://tu-dominio.com/api/webhook/stripe`
   - Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`

### SMTP (Emails)

Para Gmail:
1. Habilitar autenticación de 2 factores
2. Generar contraseña de aplicación
3. Usar la contraseña de aplicación en `SMTP_PASS`

## 🧪 Testing

### Probar Base de Datos
\`\`\`bash
curl http://localhost:3000/api/test/database
\`\`\`

### Probar Stripe
\`\`\`bash
curl http://localhost:3000/api/test/stripe
\`\`\`

### Probar Email
\`\`\`bash
curl -X POST http://localhost:3000/api/test/email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test"}'
\`\`\`

## 🐛 Solución de Problemas

### Error: "No database connection string"

**Problema:** No se encuentra la variable DATABASE_URL

**Solución:**
1. Verifica que `.env.local` existe
2. Confirma que `DATABASE_URL` o `NEON_DATABASE_URL` está configurada
3. Reinicia el servidor de desarrollo

### Error: "relation does not exist"

**Problema:** Las tablas no existen en la base de datos

**Solución:**
1. Ejecuta: `curl -X POST http://localhost:3000/api/test/database`
2. O ejecuta manualmente los scripts SQL en `/scripts`

### Error: "JWT must be provided"

**Problema:** JWT_SECRET no está configurado

**Solución:**
1. Genera un secret: `openssl rand -base64 32`
2. Agrégalo a `.env.local` como `JWT_SECRET`

### Error de CORS en desarrollo

**Problema:** Errores de CORS al hacer requests

**Solución:**
1. Verifica que `NEXT_PUBLIC_SITE_URL` esté configurado
2. Usa `http://localhost:3000` en desarrollo

## 📁 Estructura del Proyecto

\`\`\`
robert-software-premium/
├── app/                    # App Router de Next.js
│   ├── [lang]/            # Rutas internacionalizadas
│   ├── api/               # API Routes
│   └── dashboard/         # Panel de administración
├── components/            # Componentes React
├── lib/                   # Utilidades y configuración
├── scripts/               # Scripts SQL
└── public/               # Archivos estáticos
\`\`\`

## 🚀 Deploy a Producción

1. **Configurar variables en Vercel:**
   - Copia todas las variables de `.env.local`
   - Configura `NEXT_PUBLIC_SITE_URL` con tu dominio

2. **Deploy:**
   \`\`\`bash
   vercel --prod
   \`\`\`

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs en la consola del navegador
2. Verifica `/api/test/database` para diagnóstico
3. Consulta la documentación de [Next.js](https://nextjs.org/docs) y [Neon](https://neon.tech/docs)

---

¡Listo! Tu proyecto Robert Software debería estar funcionando correctamente. 🎉
