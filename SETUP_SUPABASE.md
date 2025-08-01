# 🚀 Configuración de Supabase para Robert Software

Esta guía te ayudará a configurar Supabase paso a paso para el proyecto Robert Software.

## 📋 Requisitos Previos

- Cuenta en [Supabase](https://supabase.com)
- Node.js 18+ instalado
- Git configurado

## 🔧 Paso 1: Crear Proyecto en Supabase

1. **Accede a Supabase Dashboard**
   - Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Inicia sesión o crea una cuenta

2. **Crear Nuevo Proyecto**
   - Haz clic en "New Project"
   - Nombre: `robert-software-premium`
   - Base de datos: Elige una contraseña segura
   - Región: Europe (más cercana a España)
   - Plan: Free (suficiente para empezar)

3. **Esperar Configuración**
   - El proyecto tardará 2-3 minutos en configurarse
   - ✅ Cuando esté listo, verás el dashboard

## 🔑 Paso 2: Obtener Credenciales

1. **Ir a Settings > API**
   - En el sidebar, ve a Settings → API
   - Copia las siguientes credenciales:

\`\`\`bash
# URL del proyecto
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co

# Clave pública (anon key)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clave de servicio (service_role key) - ¡MANTENER SECRETA!
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

## 🗄️ Paso 3: Configurar Base de Datos

1. **Ir a SQL Editor**
   - En el sidebar, ve a SQL Editor
   - Haz clic en "New Query"

2. **Ejecutar Scripts en Orden**

   **Script 1: Crear Tablas**
   \`\`\`sql
   -- Copia y pega el contenido de scripts/01-create-supabase-tables.sql
   -- Ejecuta con Ctrl+Enter o botón "Run"
   \`\`\`

   **Script 2: Insertar Datos Demo**
   \`\`\`sql
   -- Copia y pega el contenido de scripts/02-insert-demo-users.sql
   -- Ejecuta con Ctrl+Enter o botón "Run"
   \`\`\`

   **Script 3: Configurar Seguridad RLS**
   \`\`\`sql
   -- Copia y pega el contenido de scripts/03-create-rls-policies.sql
   -- Ejecuta con Ctrl+Enter o botón "Run"
   \`\`\`

3. **Verificar Tablas**
   - Ve a Table Editor
   - Deberías ver todas las tablas creadas:
     - ✅ users
     - ✅ orders
     - ✅ downloads
     - ✅ invoices
     - ✅ audit_logs
     - ✅ notifications
     - ✅ email_logs
     - ✅ budgets
     - ✅ feedback
     - ✅ user_requests

## 🔐 Paso 4: Configurar Autenticación

1. **Ir a Authentication > Settings**
   - Habilita "Enable email confirmations": ❌ OFF (para desarrollo)
   - Site URL: `http://localhost:3000` (desarrollo) o tu dominio
   - Redirect URLs: Añadir tu dominio de producción

2. **Configurar Providers (Opcional)**
   - Si quieres login con Google, GitHub, etc.
   - Por ahora usaremos email/password

## 🌐 Paso 5: Configurar Variables de Entorno

1. **Crear archivo .env.local**
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

2. **Completar con tus credenciales**
   \`\`\`bash
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
   JWT_SECRET=genera-una-clave-segura-de-32-caracteres
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   \`\`\`

## 🧪 Paso 6: Probar la Configuración

1. **Instalar dependencias**
   \`\`\`bash
   npm install
   \`\`\`

2. **Ejecutar en desarrollo**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Probar conexión**
   - Ve a: http://localhost:3000/api/test/database
   - Deberías ver: `{"success": true, "message": "Supabase connection successful"}`

4. **Probar login demo**
   - Ve a: http://localhost:3000/login
   - Usa: `admin@robertsoftware.com` / `Admin123!`
   - Deberías acceder al dashboard de admin

## 👥 Usuarios Demo Disponibles

| Email | Password | Rol | Descripción |
|-------|----------|-----|-------------|
| `admin@robertsoftware.com` | `Admin123!` | admin | Acceso completo |
| `empleado@demo.com` | `Empleado123!` | empleado | Gestión de proyectos |
| `cliente@demo.com` | `Cliente123!` | cliente | Vista de cliente |

## 🔍 Verificación Final

### ✅ Checklist de Configuración

- [ ] Proyecto Supabase creado
- [ ] Credenciales copiadas correctamente
- [ ] 3 scripts SQL ejecutados sin errores
- [ ] Variables de entorno configuradas
- [ ] Aplicación ejecutándose en localhost:3000
- [ ] Test de base de datos exitoso
- [ ] Login demo funcionando
- [ ] Dashboard accesible según rol

### 🚨 Solución de Problemas

**Error: "Invalid API key"**
- Verifica que las credenciales sean correctas
- Asegúrate de no tener espacios extra

**Error: "relation does not exist"**
- Ejecuta los scripts SQL en orden
- Verifica que no haya errores en la consola SQL

**Error: "JWT malformed"**
- Genera un JWT_SECRET de al menos 32 caracteres
- Usa solo caracteres alfanuméricos y símbolos básicos

**Error de conexión**
- Verifica que el proyecto Supabase esté activo
- Comprueba la URL del proyecto

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en la consola del navegador
2. Verifica los logs de Supabase en el dashboard
3. Consulta la documentación oficial: [https://supabase.com/docs](https://supabase.com/docs)

¡Tu configuración de Supabase está lista! 🎉
\`\`\`
