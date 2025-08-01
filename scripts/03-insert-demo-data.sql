-- Insertar usuarios demo con contraseñas hasheadas
-- Contraseñas: Admin123!, Empleado123!, Cliente123!
INSERT INTO users (id, email, name, password_hash, role, is_active, email_verified, company, position) VALUES
    (
        '00000000-0000-0000-0000-000000000001',
        'admin@robertsoftware.com',
        'Administrador Principal',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9PS', -- Admin123!
        'admin',
        true,
        true,
        'Robert Software',
        'CEO & Fundador'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'empleado@demo.com',
        'Empleado Demo',
        '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Empleado123!
        'empleado',
        true,
        true,
        'Robert Software',
        'Desarrollador Senior'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'cliente@demo.com',
        'Cliente Demo',
        '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Cliente123!
        'cliente',
        true,
        true,
        'Empresa Demo S.L.',
        'Director de IT'
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        'maria@techflow.com',
        'María García',
        '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Cliente123!
        'cliente',
        true,
        true,
        'TechFlow Solutions',
        'CTO'
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        'carlos@financecore.com',
        'Carlos López',
        '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Cliente123!
        'cliente',
        true,
        true,
        'FinanceCore',
        'CEO'
    )
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    email_verified = EXCLUDED.email_verified,
    company = EXCLUDED.company,
    position = EXCLUDED.position,
    updated_at = NOW();

-- Insertar proyectos demo
INSERT INTO projects (id, name, description, status, priority, client_id, assigned_to, budget, start_date, end_date, completion_percentage) VALUES
    (
        '10000000-0000-0000-0000-000000000001',
        'Sistema de Gestión Empresarial',
        'Desarrollo de un sistema completo de gestión empresarial con módulos de CRM, inventario y facturación.',
        'active',
        'high',
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000002',
        25000.00,
        '2024-01-15',
        '2024-06-15',
        65
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        'Aplicación Móvil TechFlow',
        'Desarrollo de aplicación móvil para gestión de proyectos en tiempo real.',
        'active',
        'medium',
        '00000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000002',
        18000.00,
        '2024-02-01',
        '2024-05-01',
        40
    ),
    (
        '10000000-0000-0000-0000-000000000003',
        'Portal Web FinanceCore',
        'Rediseño completo del portal web corporativo con nuevas funcionalidades.',
        'planning',
        'medium',
        '00000000-0000-0000-0000-000000000005',
        NULL,
        12000.00,
        '2024-03-01',
        '2024-07-01',
        0
    ),
    (
        '10000000-0000-0000-0000-000000000004',
        'Sistema de Reportes Avanzados',
        'Implementación de sistema de reportes y analytics para datos empresariales.',
        'completed',
        'low',
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000002',
        8000.00,
        '2023-10-01',
        '2023-12-15',
        100
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    priority = EXCLUDED.priority,
    client_id = EXCLUDED.client_id,
    assigned_to = EXCLUDED.assigned_to,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    completion_percentage = EXCLUDED.completion_percentage,
    updated_at = NOW();

-- Insertar tareas demo
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, due_date, estimated_hours, actual_hours) VALUES
    (
        '20000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000001',
        'Diseño de Base de Datos',
        'Crear el esquema de base de datos para el sistema de gestión.',
        'completed',
        'high',
        '00000000-0000-0000-0000-000000000002',
        '2024-01-25',
        16.0,
        18.5
    ),
    (
        '20000000-0000-0000-0000-000000000002',
        '10000000-0000-0000-0000-000000000001',
        'Desarrollo del Módulo CRM',
        'Implementar funcionalidades básicas del módulo de gestión de clientes.',
        'in_progress',
        'high',
        '00000000-0000-0000-0000-000000000002',
        '2024-03-15',
        40.0,
        25.0
    ),
    (
        '20000000-0000-0000-0000-000000000003',
        '10000000-0000-0000-0000-000000000001',
        'Módulo de Facturación',
        'Crear sistema de facturación automática y gestión de pagos.',
        'todo',
        'medium',
        '00000000-0000-0000-0000-000000000002',
        '2024-04-30',
        32.0,
        NULL
    ),
    (
        '20000000-0000-0000-0000-000000000004',
        '10000000-0000-0000-0000-000000000002',
        'Diseño UI/UX Móvil',
        'Crear diseños de interfaz para la aplicación móvil.',
        'completed',
        'high',
        '00000000-0000-0000-0000-000000000002',
        '2024-02-15',
        24.0,
        22.0
    ),
    (
        '20000000-0000-0000-0000-000000000005',
        '10000000-0000-0000-0000-000000000002',
        'Desarrollo Frontend Móvil',
        'Implementar las pantallas principales de la aplicación.',
        'in_progress',
        'high',
        '00000000-0000-0000-0000-000000000002',
        '2024-04-01',
        60.0,
        35.0
    )
ON CONFLICT (id) DO UPDATE SET
    project_id = EXCLUDED.project_id,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    priority = EXCLUDED.priority,
    assigned_to = EXCLUDED.assigned_to,
    due_date = EXCLUDED.due_date,
    estimated_hours = EXCLUDED.estimated_hours,
    actual_hours = EXCLUDED.actual_hours,
    updated_at = NOW();

-- Insertar algunas solicitudes de usuario demo
INSERT INTO user_requests (id, name, email, company, position, access_type, message, status, source) VALUES
    (
        '30000000-0000-0000-0000-000000000001',
        'Ana Martínez',
        'ana@legaltech.com',
        'LegalTech Pro',
        'Directora de Operaciones',
        'cliente',
        'Necesitamos un sistema de gestión de casos legales para nuestro bufete.',
        'pending',
        'web'
    ),
    (
        '30000000-0000-0000-0000-000000000002',
        'Roberto Silva',
        'roberto@innovatech.com',
        'InnovaTech Solutions',
        'CTO',
        'cliente',
        'Buscamos desarrollar una plataforma de e-learning para nuestra empresa.',
        'pending',
        'web'
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    company = EXCLUDED.company,
    position = EXCLUDED.position,
    access_type = EXCLUDED.access_type,
    message = EXCLUDED.message,
    status = EXCLUDED.status,
    source = EXCLUDED.source,
    updated_at = NOW();

-- Insertar algunos logs de auditoría demo
INSERT INTO audit_logs (user_id, action, table_name, record_id, severity, success, created_at) VALUES
    (
        '00000000-0000-0000-0000-000000000001',
        'LOGIN_SUCCESS',
        'users',
        '00000000-0000-0000-0000-000000000001',
        'info',
        true,
        NOW() - INTERVAL '1 hour'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'PROJECT_CREATED',
        'projects',
        '10000000-0000-0000-0000-000000000001',
        'info',
        true,
        NOW() - INTERVAL '2 days'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'TASK_UPDATED',
        'tasks',
        '20000000-0000-0000-0000-000000000002',
        'info',
        true,
        NOW() - INTERVAL '30 minutes'
    );
