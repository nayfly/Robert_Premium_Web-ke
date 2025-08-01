-- Script para crear datos demo realistas para testing
-- Incluye solicitudes de acceso, logs de auditoría y actividad simulada

-- Verificar que las tablas necesarias existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_requests') THEN
        RAISE EXCEPTION 'La tabla user_requests no existe. Ejecuta primero create-user-requests-table.sql';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
        RAISE EXCEPTION 'La tabla audit_logs no existe. Ejecuta primero create-audit-logs-table.sql';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        RAISE EXCEPTION 'La tabla users no existe. Ejecuta primero create-users-table.sql';
    END IF;
END $$;

-- Limpiar datos demo existentes
DELETE FROM user_requests WHERE email LIKE '%demo%' OR email LIKE '%test%' OR email LIKE '%startup%' OR email LIKE '%pyme%' OR email LIKE '%freelance%';

-- Insertar solicitudes de acceso demo
INSERT INTO user_requests (
    id,
    name,
    email,
    phone,
    company,
    position,
    access_type,
    message,
    status,
    created_at,
    updated_at
) VALUES 
-- Solicitud pendiente reciente
(
    gen_random_uuid(),
    'Roberto Sánchez Torres',
    'roberto.sanchez@startup.io',
    '+34612345001',
    'StartupTech Innovation',
    'CTO & Co-founder',
    'cliente',
    'Somos una startup tecnológica en crecimiento y necesitamos servicios de desarrollo de software premium. Hemos visto su trabajo y nos interesa mucho colaborar en nuestro próximo proyecto de IA.',
    'pending',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
),

-- Solicitud pendiente de hace 2 días
(
    gen_random_uuid(),
    'Ana Fernández Silva',
    'ana.fernandez@pyme.es',
    '+34623456002',
    'PYME Consulting',
    'Directora de Operaciones',
    'cliente',
    'Representamos a varias PYMEs que necesitan modernizar sus sistemas. Nos gustaría conocer sus servicios de consultoría tecnológica y desarrollo de aplicaciones web.',
    'pending',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
),

-- Solicitud pendiente de hace 3 días
(
    gen_random_uuid(),
    'María García López',
    'maria.garcia@empresa.com',
    '+34634567003',
    'Innovación Tech S.L.',
    'Jefa de Proyecto',
    'cliente',
    'Necesitamos desarrollar una plataforma de e-commerce completa con funcionalidades avanzadas. Hemos revisado su portfolio y creemos que son el equipo ideal para este proyecto.',
    'pending',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
),

-- Solicitud aprobada (empleado)
(
    gen_random_uuid(),
    'Carlos Rodríguez Martín',
    'carlos.rodriguez@freelance.com',
    '+34645678004',
    'Freelance Developer',
    'Desarrollador Full Stack Senior',
    'empleado',
    'Soy desarrollador freelance con 8 años de experiencia en React, Node.js y PostgreSQL. Me interesa formar parte de su equipo para proyectos desafiantes. Adjunto mi CV y portfolio.',
    'approved',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '2 days'
),

-- Solicitud rechazada
(
    gen_random_uuid(),
    'Laura Martínez Ruiz',
    'laura.martinez@rejected.com',
    '+34656789005',
    'Competitor Corp',
    'Desarrolladora Junior',
    'empleado',
    'Busco oportunidades de crecimiento profesional en desarrollo web. Tengo conocimientos básicos en HTML, CSS y JavaScript.',
    'rejected',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '5 days'
);

-- Actualizar las solicitudes aprobadas/rechazadas con el admin como aprobador
UPDATE user_requests 
SET approved_by = '00000000-0000-0000-0000-000000000001',
    approved_at = updated_at
WHERE status IN ('approved', 'rejected');

-- Insertar logs de auditoría simulando actividad del sistema
INSERT INTO audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    new_values,
    ip_address,
    user_agent,
    severity,
    success,
    created_at
) VALUES 
-- Login del admin hace 1 hora
(
    '00000000-0000-0000-0000-000000000001',
    'LOGIN_SUCCESS',
    'users',
    '00000000-0000-0000-0000-000000000001',
    '{"email": "admin@robertsoftware.com", "role": "admin", "login_method": "demo"}'::jsonb,
    '192.168.1.100',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'info',
    true,
    NOW() - INTERVAL '1 hour'
),

-- Aprobación de solicitud de empleado
(
    '00000000-0000-0000-0000-000000000001',
    'USER_REQUEST_APPROVED',
    'user_requests',
    (SELECT id FROM user_requests WHERE email = 'carlos.rodriguez@freelance.com'),
    '{"email": "carlos.rodriguez@freelance.com", "status": "approved", "access_type": "empleado"}'::jsonb,
    '192.168.1.100',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'info',
    true,
    NOW() - INTERVAL '2 days'
),

-- Rechazo de solicitud
(
    '00000000-0000-0000-0000-000000000001',
    'USER_REQUEST_REJECTED',
    'user_requests',
    (SELECT id FROM user_requests WHERE email = 'laura.martinez@rejected.com'),
    '{"email": "laura.martinez@rejected.com", "status": "rejected", "reason": "Experiencia insuficiente"}'::jsonb,
    '192.168.1.100',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'warning',
    true,
    NOW() - INTERVAL '5 days'
),

-- Login del empleado
(
    '00000000-0000-0000-0000-000000000002',
    'LOGIN_SUCCESS',
    'users',
    '00000000-0000-0000-0000-000000000002',
    '{"email": "empleado@demo.com", "role": "empleado", "login_method": "demo"}'::jsonb,
    '192.168.1.101',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'info',
    true,
    NOW() - INTERVAL '3 hours'
),

-- Login del cliente
(
    '00000000-0000-0000-0000-000000000003',
    'LOGIN_SUCCESS',
    'users',
    '00000000-0000-0000-0000-000000000003',
    '{"email": "cliente@demo.com", "role": "cliente", "login_method": "demo"}'::jsonb,
    '192.168.1.102',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    'info',
    true,
    NOW() - INTERVAL '6 hours'
),

-- Intento de login fallido
(
    NULL,
    'LOGIN_FAILED',
    'users',
    NULL,
    '{"email": "hacker@malicious.com", "reason": "invalid_credentials", "attempts": 3}'::jsonb,
    '203.0.113.42',
    'curl/7.68.0',
    'warning',
    false,
    NOW() - INTERVAL '12 hours'
),

-- Creación de nueva solicitud
(
    NULL,
    'USER_REQUEST_CREATED',
    'user_requests',
    (SELECT id FROM user_requests WHERE email = 'roberto.sanchez@startup.io'),
    '{"email": "roberto.sanchez@startup.io", "company": "StartupTech Innovation", "access_type": "cliente"}'::jsonb,
    '203.0.113.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    'info',
    true,
    NOW() - INTERVAL '1 day'
),

-- Actividad de sistema - backup
(
    NULL,
    'SYSTEM_BACKUP',
    'system',
    NULL,
    '{"type": "automated", "tables": ["users", "user_requests", "audit_logs"], "status": "completed"}'::jsonb,
    '127.0.0.1',
    'System Cron Job',
    'info',
    true,
    NOW() - INTERVAL '1 day'
);

-- Mostrar resumen de las solicitudes creadas
SELECT 
    '📋 Solicitud creada' as status,
    name as nombre,
    email,
    company as empresa,
    access_type as tipo_acceso,
    status as estado,
    created_at as fecha_creacion
FROM user_requests 
WHERE email LIKE '%demo%' OR email LIKE '%test%' OR email LIKE '%startup%' OR email LIKE '%pyme%' OR email LIKE '%freelance%'
ORDER BY created_at DESC;
