# 🚀 Guía de Deployment - Robert Software

Esta guía te llevará paso a paso para deployar Robert Software en Vercel con Supabase.

## 📋 Requisitos Previos

- ✅ Proyecto configurado localmente
- ✅ Supabase configurado (ver SETUP_SUPABASE.md)
- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Repositorio en GitHub

## 🔧 Paso 1: Preparar el Repositorio

1. **Subir código a GitHub**
   \`\`\`bash
   git add .
   git commit -m "feat: preparar para deployment"
   git push origin main
   \`\`\`

2. **Verificar archivos importantes**
   - ✅ `.env.example` (sin credenciales reales)
   - ✅ `package.json` con todas las dependencias
   - ✅ `next.config.mjs` configurado
   - ✅ Scripts SQL en `/scripts/`

## 🌐 Paso 2: Configurar Dominio (Opcional)

Si tienes un dominio personalizado:

1. **Configurar DNS**
   - Apunta tu dominio a Vercel
   - Configura registros A/CNAME según tu proveedor

2. **Actualizar URLs**
   - Cambia `NEXT_PUBLIC_APP_URL` en variables de entorno
   - Actualiza Site URL en Supabase

## 🚀 Paso 3: Deploy en Vercel

1. **Conectar Repositorio**
   - Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
   - Haz clic en "New Project"
   - Importa tu repositorio de GitHub
   - Selecciona "robert-software-premium"

2. **Configurar Variables de Entorno**
   
   En la sección "Environment Variables", añade:

   \`\`\`bash
   # OBLIGATORIAS
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   JWT_SECRET=tu-jwt-secret-super-seguro-de-32-caracteres
   NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
   
   # OPCIONALES (si las usas)
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=tu-email@gmail.com
   SMTP_PASS=tu-password
   EMAIL_FROM=noreply@robertsoftware.com
   EMAIL_FROM_NAME=Robert Software
   GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   GOOGLE_SITE_VERIFICATION=tu-codigo
   \`\`\`

3. **Configurar Build Settings**
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy**
   - Haz clic en "Deploy"
   - Espera 2-3 minutos
   - ✅ Tu aplicación estará disponible en `https://tu-proyecto.vercel.app`

## 🔐 Paso 4: Configurar Supabase para Producción

1. **Actualizar Site URL**
   - Ve a Supabase Dashboard → Authentication → Settings
   - Site URL: `https://tu-dominio.vercel.app`
   - Redirect URLs: Añadir tu dominio de producción

2. **Configurar CORS (si es necesario)**
   - Ve a Settings → API
   - Añade tu dominio a las URLs permitidas

3. **Verificar RLS Policies**
   - Ve a Authentication → Policies
   - Asegúrate de que todas las políticas estén activas

## 🧪 Paso 5: Verificar Deployment

1. **Test de Conexión**
   \`\`\`bash
   curl https://tu-dominio.vercel.app/api/test/database
   \`\`\`
   Respuesta esperada:
   \`\`\`json
   {"success": true, "message": "Supabase connection successful"}
   \`\`\`

2. **Test de Login**
   - Ve a: `https://tu-dominio.vercel.app/login`
   - Usa: `admin@robertsoftware.com` / `Admin123!`
   - Deberías acceder al dashboard

3. **Test de Funcionalidades**
   - ✅ Login/Logout
   - ✅ Dashboard por roles
   - ✅ Gestión de usuarios (admin)
   - ✅ Sistema de órdenes
   - ✅ Logs de auditoría

## 📊 Paso 6: Configurar Analytics (Opcional)

1. **Google Analytics**
   - Crea una propiedad GA4
   - Añade `GOOGLE_ANALYTICS_ID` a variables de entorno
   - Redeploy la aplicación

2. **Vercel Analytics**
   - Ve a tu proyecto en Vercel
   - Habilita Analytics en la pestaña correspondiente

## 🔒 Paso 7: Configurar Seguridad

1. **Headers de Seguridad**
   - Ya configurados en `middleware.ts`
   - Incluye CSP, HSTS, etc.

2. **Rate Limiting**
   - Configurado para APIs críticas
   - Límites por IP y usuario

3. **Validación de Inputs**
   - Sanitización automática
   - Validación en cliente y servidor

## 🎯 Paso 8: Configurar Dominio Personalizado (Opcional)

1. **En Vercel**
   - Ve a tu proyecto → Settings → Domains
   - Añade tu dominio personalizado
   - Sigue las instrucciones de DNS

2. **Certificado SSL**
   - Vercel configura SSL automáticamente
   - Verifica que HTTPS funcione correctamente

3. **Actualizar Variables**
   - Cambia `NEXT_PUBLIC_APP_URL` por tu dominio
   - Actualiza Site URL en Supabase

## 📈 Paso 9: Monitoreo y Mantenimiento

1. **Logs de Vercel**
   - Revisa logs en tiempo real
   - Configura alertas para errores

2. **Métricas de Supabase**
   - Monitorea uso de base de datos
   - Revisa logs de autenticación

3. **Backups**
   - Supabase hace backups automáticos
   - Considera backups adicionales para datos críticos

## ✅ Checklist Final de Deployment

### Pre-Deploy
- [ ] Código subido a GitHub
- [ ] Variables de entorno configuradas
- [ ] Supabase configurado y probado
- [ ] Tests locales pasando

### Deploy
- [ ] Proyecto conectado en Vercel
- [ ] Variables de entorno añadidas
- [ ] Build exitoso
- [ ] Aplicación accesible

### Post-Deploy
- [ ] Test de conexión a base de datos
- [ ] Login demo funcionando
- [ ] Todas las funcionalidades probadas
- [ ] Analytics configurado (opcional)
- [ ] Dominio personalizado (opcional)
- [ ] Monitoreo configurado

## 🚨 Solución de Problemas

### Error de Build
\`\`\`bash
# Verificar dependencias
npm install
npm run build

# Revisar logs de Vercel
vercel logs tu-deployment-url
\`\`\`

### Error de Base de Datos
- Verifica credenciales de Supabase
- Comprueba que las tablas existan
- Revisa políticas RLS

### Error 500
- Revisa logs de Vercel
- Verifica variables de entorno
- Comprueba conexión a Supabase

### Error de CORS
- Actualiza Site URL en Supabase
- Verifica configuración de dominios

## 📞 Soporte Post-Deploy

1. **Monitoreo Continuo**
   - Configura alertas en Vercel
   - Revisa métricas de Supabase regularmente

2. **Actualizaciones**
   - Mantén dependencias actualizadas
   - Aplica parches de seguridad

3. **Escalabilidad**
   - Monitorea límites de Supabase
   - Considera upgrade de plan si es necesario

## 🎉 ¡Deployment Completado!

Tu aplicación Robert Software está ahora en producción:

- 🌐 **URL**: https://tu-dominio.vercel.app
- 🔐 **Admin**: admin@robertsoftware.com / Admin123!
- 📊 **Dashboard**: Acceso completo por roles
- 🔒 **Seguridad**: RLS, rate limiting, headers seguros
- 📈 **Monitoreo**: Analytics y logs configurados

¡Felicidades! Tu aplicación está lista para usuarios reales. 🚀
\`\`\`
