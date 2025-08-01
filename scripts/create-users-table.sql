-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear tabla users con todas las medidas de seguridad
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'empleado', 'cliente')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email_verified BOOLEAN DEFAULT false,
    phone VARCHAR(20),
    company VARCHAR(255),
    position VARCHAR(255),
    avatar_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Constraints de seguridad
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 255),
    CONSTRAINT users_phone_format CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$')
);

-- Índices para optimización y seguridad
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);
CREATE INDEX IF NOT EXISTS idx_users_failed_attempts ON users(failed_login_attempts);
CREATE INDEX IF NOT EXISTS idx_users_locked_until ON users(locked_until);

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad estrictas
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (
        auth.uid() = id AND 
        is_active = true
    );

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin' 
            AND is_active = true
            AND (locked_until IS NULL OR locked_until < NOW())
        )
    );

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (
        auth.uid() = id AND 
        is_active = true AND
        (locked_until IS NULL OR locked_until < NOW())
    ) WITH CHECK (
        auth.uid() = id AND 
        is_active = true AND
        role = OLD.role -- No permitir cambio de rol
    );

CREATE POLICY "Admins can update all users" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin' 
            AND is_active = true
            AND (locked_until IS NULL OR locked_until < NOW())
        )
    );

CREATE POLICY "Admins can insert users" ON users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin' 
            AND is_active = true
            AND (locked_until IS NULL OR locked_until < NOW())
        )
    );

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_users_updated_at();

-- Función para limpiar intentos de login fallidos
CREATE OR REPLACE FUNCTION reset_failed_login_attempts(user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET failed_login_attempts = 0, 
        locked_until = NULL,
        last_login = NOW()
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para incrementar intentos fallidos
CREATE OR REPLACE FUNCTION increment_failed_login_attempts(user_email VARCHAR)
RETURNS VOID AS $$
DECLARE
    current_attempts INTEGER;
BEGIN
    UPDATE users 
    SET failed_login_attempts = failed_login_attempts + 1
    WHERE email = user_email
    RETURNING failed_login_attempts INTO current_attempts;
    
    -- Bloquear cuenta después de 5 intentos fallidos
    IF current_attempts >= 5 THEN
        UPDATE users 
        SET locked_until = NOW() + INTERVAL '30 minutes'
        WHERE email = user_email;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insertar usuario admin por defecto con ID fijo para consistencia
INSERT INTO users (id, email, name, role, is_active, email_verified) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@robertsoftware.com',
    'Administrador Principal',
    'admin',
    true,
    true
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    email_verified = EXCLUDED.email_verified,
    updated_at = NOW();

-- Insertar usuarios demo para testing
INSERT INTO users (id, email, name, role, is_active, email_verified, company, position) VALUES
    (
        '00000000-0000-0000-0000-000000000002',
        'empleado@demo.com',
        'Empleado Demo',
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
        'cliente',
        true,
        true,
        'Empresa Demo S.L.',
        'Director de IT'
    )
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    email_verified = EXCLUDED.email_verified,
    company = EXCLUDED.company,
    position = EXCLUDED.position,
    updated_at = NOW();
