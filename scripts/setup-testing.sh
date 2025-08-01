#!/bin/bash

echo "🚀 Configurando sistema de testing para Robert Software"
echo "=================================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Crear directorio de logs si no existe
mkdir -p logs

# Instalar dependencias necesarias para testing
echo "📦 Instalando dependencias de testing..."
npm install --save-dev node-fetch @types/node-fetch

# Verificar variables de entorno
echo "🔧 Verificando configuración..."

if [ ! -f ".env.local" ]; then
    echo "⚠️  Archivo .env.local no encontrado"
    echo "📋 Copiando .env.example a .env.local..."
    cp .env.example .env.local
    echo "✅ Archivo .env.local creado"
    echo "🔧 Por favor, edita .env.local con tus valores reales"
else
    echo "✅ Archivo .env.local encontrado"
fi

# Verificar variables críticas
echo "🔍 Verificando variables de entorno críticas..."

check_env_var() {
    local var_name=$1
    local var_value=$(grep "^$var_name=" .env.local 2>/dev/null | cut -d'=' -f2)
    
    if [ -z "$var_value" ] || [ "$var_value" = "your-value-here" ] || [[ "$var_value" == *"your-"* ]]; then
        echo "❌ $var_name no configurada correctamente"
        return 1
    else
        echo "✅ $var_name configurada"
        return 0
    fi
}

# Variables críticas para testing
critical_vars=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "SUPABASE_SERVICE_ROLE_KEY"
    "STRIPE_SECRET_KEY"
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
)

missing_vars=0
for var in "${critical_vars[@]}"; do
    if ! check_env_var "$var"; then
        missing_vars=$((missing_vars + 1))
    fi
done

if [ $missing_vars -gt 0 ]; then
    echo ""
    echo "⚠️  $missing_vars variables críticas no están configuradas"
    echo "🔧 Por favor, edita .env.local antes de ejecutar los tests"
    echo ""
fi

# Crear scripts de testing en package.json
echo "📝 Configurando scripts de testing..."

# Verificar si los scripts ya existen
if ! grep -q "test:payments" package.json; then
    echo "➕ Añadiendo scripts de testing a package.json..."
    
    # Crear backup del package.json
    cp package.json package.json.backup
    
    # Añadir scripts usando node
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (!pkg.scripts) pkg.scripts = {};
    
    pkg.scripts['test:payments'] = 'node scripts/test-payment-flow.js';
    pkg.scripts['test:setup'] = 'node -e \"console.log(\\\"Testing setup complete\\\")\"';
    pkg.scripts['db:test-data'] = 'echo \"Ejecutar: psql -d your_database -f scripts/create-test-data.sql\"';
    
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    console.log('✅ Scripts añadidos a package.json');
    "
else
    echo "✅ Scripts de testing ya configurados"
fi

# Verificar permisos de ejecución
chmod +x scripts/test-payment-flow.js 2>/dev/null || true

# Crear directorio de testing si no existe
mkdir -p components/testing

echo ""
echo "🎉 Configuración de testing completada!"
echo "=================================================="
echo ""
echo "📋 Próximos pasos:"
echo "1. Editar .env.local con tus valores reales"
echo "2. Ejecutar scripts SQL para crear tablas:"
echo "   psql -d tu_database -f scripts/create-email-logs-table.sql"
echo "   psql -d tu_database -f scripts/create-orders-stats-function.sql"
echo "   psql -d tu_database -f scripts/create-test-data.sql"
echo ""
echo "3. Ejecutar testing:"
echo "   npm run test:payments"
echo ""
echo "4. O usar la interfaz web:"
echo "   http://localhost:3000/dashboard/admin/testing"
echo ""
echo "🔧 Para más ayuda, consulta el README.md"
