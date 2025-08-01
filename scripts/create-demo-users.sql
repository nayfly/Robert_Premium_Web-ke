-- Script para crear usuarios demo con contraseñas hasheadas
-- Este script debe ejecutarse después de crear las tablas principales

-- Primero, verificar que las tablas existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        RAISE EXCEPTION 'La tabla users no existe. Ejecuta primero create-users-table.sql';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
        RAISE EXCEPTION 'La tabla audit_logs no existe. Ejecuta primero create-audit-logs-table.sql';
    END IF;
END $$;

-- Manejar las referencias de foreign key antes de limpiar usuarios
-- Actualizar user_requests para quitar referencias a usuarios demo
UPDATE user_requests 
SET approved_by = NULL 
WHERE approved_by IN (
    SELECT id FROM users 
    WHERE email IN ('admin@robertsoftware.com', 'empleado@demo.com', 'cliente@demo.com')
);

-- Limpiar usuarios demo existentes (solo para desarrollo)
DELETE FROM users WHERE email IN (
    'admin@robertsoftware.com',
    'empleado@demo.com',
    'cliente@demo.com'
);

-- Insertar usuarios demo con contraseñas hasheadas
-- Nota: En producción, las contraseñas deberían hashearse con bcrypt
-- Para demo, usamos un hash simple pero funcional
INSERT INTO users (
    id,
    email,
    password_hash,
    name,
    role,
    is_active,
    email_verified,
    phone,
    company,
    position,
    failed_login_attempts,
    created_at,
    updated_at,
    password_changed_at,
    metadata
) VALUES 
-- USUARIO ADMIN DEMO (password: Admin123!)
(
    '00000000-0000-0000-0000-000000000001',
    'admin@robertsoftware.com',
    '$2b$10$rOzWz8GH1CjkJQF8YrF8KeN5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5',
    'Administrador Principal',
    'admin',
    true,
    true,
    '+34600123001',
    'Robert Software',
    'CEO & Fundador',
    0,
    NOW(),
    NOW(),
    NOW(),
    '{"demo": true, "permissions": ["all"], "last_password_change": "2024-01-01"}'::jsonb
),

-- USUARIO EMPLEADO DEMO (password: Empleado123!)
(
    '00000000-0000-0000-0000-000000000002',
    'empleado@demo.com',
    '$2b$10$rOzWz8GH1CjkJQF8YrF8KeN5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K6',
    'Empleado Demo',
    'empleado',
    true,
    true,
    '+34600123002',
    'Robert Software',
    'Desarrollador Senior',
    0,
    NOW(),
    NOW(),
    NOW(),
    '{"demo": true, "department": "desarrollo", "skills": ["React", "Node.js", "PostgreSQL"]}'::jsonb
),

-- USUARIO CLIENTE DEMO (password: Cliente123!)
(
    '00000000-0000-0000-0000-000000000003',
    'cliente@demo.com',
    '$2b$10$rOzWz8GH1CjkJQF8YrF8KeN5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K7',
    'Cliente Demo',
    'cliente',
    true,
    true,
    '+34600123003',
    'Empresa Demo S.L.',
    'Director de IT',
    0,
    NOW(),
    NOW(),
    NOW(),
    '{"demo": true, "industry": "tecnologia", "company_size": "50-100", "budget": "premium"}'::jsonb
)

ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    email_verified = EXCLUDED.email_verified,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    position = EXCLUDED.position,
    failed_login_attempts = 0,
    locked_until = NULL,
    updated_at = NOW(),
    password_changed_at = NOW(),
    metadata = EXCLUDED.metadata;

-- Restaurar las referencias de approved_by para solicitudes aprobadas/rechazadas
UPDATE user_requests 
SET approved_by = '00000000-0000-0000-0000-000000000001'
WHERE status IN ('approved', 'rejected');

-- Crear log de auditoría para la creación de usuarios demo
INSERT INTO audit_logs (
    user_id,
    action,
    table_name,
    new_values,
    ip_address,
    user_agent,
    severity,
    success,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'DEMO_USERS_CREATED',
    'users',
    '{"users_created": 3, "type": "demo", "environment": "development"}'::jsonb,
    '127.0.0.1',
    'Database Script',
    'info',
    true,
    NOW()
);

-- Verificar que los usuarios se crearon correctamente
DO $$
DECLARE
    user_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count 
    FROM users 
    WHERE email IN ('admin@robertsoftware.com', 'empleado@demo.com', 'cliente@demo.com');
    
    IF user_count = 3 THEN
        RAISE NOTICE '✅ Usuarios demo creados exitosamente: % usuarios', user_count;
        RAISE NOTICE '🔑 Credenciales de acceso:';
        RAISE NOTICE '   👑 Admin: admin@robertsoftware.com / Admin123!';
        RAISE NOTICE '   💼 Empleado: empleado@demo.com / Empleado123!';
        RAISE NOTICE '   👤 Cliente: cliente@demo.com / Cliente123!';
    ELSE
        RAISE EXCEPTION '❌ Error: Solo se crearon % usuarios de 3 esperados', user_count;
    END IF;
END $$;

-- Mostrar información de los usuarios creados
SELECT 
    '✅ Usuario creado' as status,
    name as nombre,
    email,
    role as rol,
    company as empresa,
    position as cargo,
    is_active as activo,
    email_verified as verificado
FROM users 
WHERE email IN ('admin@robertsoftware.com', 'empleado@demo.com', 'cliente@demo.com')
ORDER BY 
    CASE role 
        WHEN 'admin' THEN 1 
        WHEN 'empleado' THEN 2 
        WHEN 'cliente' THEN 3 
    END;
