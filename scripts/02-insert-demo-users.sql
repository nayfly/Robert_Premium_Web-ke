-- Insertar usuarios demo
-- Contraseña para todos: Admin123! (hash bcrypt)
INSERT INTO users (
    id,
    email, 
    password_hash, 
    name, 
    role, 
    is_active, 
    email_verified,
    created_at,
    updated_at
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    'admin@robertsoftware.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm',
    'Administrador Principal',
    'admin',
    true,
    true,
    NOW(),
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440001',
    'empleado@demo.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm',
    'Empleado Demo',
    'empleado',
    true,
    true,
    NOW(),
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'cliente@demo.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm',
    'Cliente Demo',
    'cliente',
    true,
    true,
    NOW(),
    NOW()
);

-- Insertar algunos proyectos demo
INSERT INTO projects (
    id,
    name,
    description,
    client_id,
    assigned_to,
    status,
    priority,
    budget,
    start_date,
    end_date,
    completion_percentage,
    created_at,
    updated_at
) VALUES 
(
    gen_random_uuid(),
    'Automatización de Procesos Contables',
    'Implementación de sistema automatizado para la gestión contable de la empresa',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    'in_progress',
    'high',
    5000.00,
    CURRENT_DATE - INTERVAL '15 days',
    CURRENT_DATE + INTERVAL '30 days',
    65,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Dashboard de Analytics',
    'Desarrollo de dashboard personalizado para visualización de métricas de negocio',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    'planning',
    'medium',
    3500.00,
    CURRENT_DATE + INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '45 days',
    0,
    NOW(),
    NOW()
);

-- Insertar algunas tareas demo
INSERT INTO tasks (
    id,
    project_id,
    title,
    description,
    assigned_to,
    status,
    priority,
    due_date,
    estimated_hours,
    actual_hours,
    created_at,
    updated_at
) VALUES 
(
    gen_random_uuid(),
    (SELECT id FROM projects WHERE name = 'Automatización de Procesos Contables' LIMIT 1),
    'Análisis de Requisitos',
    'Reunión con cliente para definir requisitos específicos del sistema',
    '550e8400-e29b-41d4-a716-446655440001',
    'completed',
    'high',
    CURRENT_DATE - INTERVAL '10 days',
    8.0,
    7.5,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    (SELECT id FROM projects WHERE name = 'Automatización de Procesos Contables' LIMIT 1),
    'Desarrollo del Backend',
    'Implementación de la lógica de negocio y APIs necesarias',
    '550e8400-e29b-41d4-a716-446655440001',
    'in_progress',
    'high',
    CURRENT_DATE + INTERVAL '7 days',
    24.0,
    16.0,
    NOW(),
    NOW()
);

-- Insertar algunos logs de auditoría demo
INSERT INTO audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    severity,
    success,
    new_values,
    created_at
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    'USER_LOGIN',
    'users',
    '550e8400-e29b-41d4-a716-446655440000',
    'info',
    true,
    '{"login_type": "demo", "role": "admin"}',
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440001',
    'PROJECT_UPDATED',
    'projects',
    (SELECT id::text FROM projects WHERE name = 'Automatización de Procesos Contables' LIMIT 1),
    'info',
    true,
    '{"completion_percentage": 65}',
    NOW() - INTERVAL '2 hours'
);
