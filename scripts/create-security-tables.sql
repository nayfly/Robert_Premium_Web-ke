-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'empleado', 'cliente')),
    phone VARCHAR(20),
    company VARCHAR(255),
    position VARCHAR(255),
    avatar_url TEXT,
    active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    last_login TIMESTAMP,
    password_changed_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);

-- Tabla de logs de seguridad
CREATE TABLE IF NOT EXISTS security_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    ip_address INET,
    user_agent TEXT,
    details JSONB DEFAULT '{}',
    success BOOLEAN DEFAULT true,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Índices para logs de seguridad
CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_severity ON security_logs(severity);
CREATE INDEX IF NOT EXISTS idx_security_logs_ip ON security_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_logs_timestamp ON security_logs(timestamp);

-- Tabla de sesiones de usuario
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    last_accessed TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para sesiones
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- Función para hashear contraseñas
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN crypt(password, gen_salt('bf', 12));
END;
$$ LANGUAGE plpgsql;

-- Función para verificar contraseñas
CREATE OR REPLACE FUNCTION verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN hash = crypt(password, hash);
END;
$$ LANGUAGE plpgsql;

-- Función para registrar eventos de seguridad
CREATE OR REPLACE FUNCTION log_security_event(
    p_user_id UUID,
    p_event_type VARCHAR(50),
    p_severity VARCHAR(20),
    p_ip_address INET,
    p_user_agent TEXT,
    p_details JSONB DEFAULT '{}',
    p_success BOOLEAN DEFAULT true,
    p_error_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO security_logs (
        user_id, event_type, severity, ip_address, user_agent, 
        details, success, timestamp
    ) VALUES (
        p_user_id, p_event_type, p_severity, p_ip_address, p_user_agent,
        CASE 
            WHEN p_error_message IS NOT NULL THEN 
                p_details || jsonb_build_object('error_message', p_error_message)
            ELSE p_details
        END,
        p_success, NOW()
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar credenciales de usuario
CREATE OR REPLACE FUNCTION verify_user_credentials(p_email TEXT, p_password TEXT)
RETURNS TABLE(
    success BOOLEAN,
    user_data JSONB,
    error_message TEXT
) AS $$
DECLARE
    user_record RECORD;
    is_valid_password BOOLEAN;
BEGIN
    -- Buscar usuario
    SELECT * INTO user_record
    FROM users 
    WHERE email = LOWER(p_email) AND active = true;
    
    -- Si no existe el usuario
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::JSONB, 'Usuario no encontrado o inactivo';
        RETURN;
    END IF;
    
    -- Verificar si está bloqueado
    IF user_record.locked_until IS NOT NULL AND user_record.locked_until > NOW() THEN
        RETURN QUERY SELECT false, NULL::JSONB, 'Cuenta temporalmente bloqueada';
        RETURN;
    END IF;
    
    -- Verificar contraseña
    SELECT verify_password(p_password, user_record.password_hash) INTO is_valid_password;
    
    IF NOT is_valid_password THEN
        -- Incrementar intentos fallidos
        UPDATE users 
        SET failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1,
            locked_until = CASE 
                WHEN COALESCE(failed_login_attempts, 0) + 1 >= 5 
                THEN NOW() + INTERVAL '30 minutes'
                ELSE NULL
            END,
            updated_at = NOW()
        WHERE id = user_record.id;
        
        RETURN QUERY SELECT false, NULL::JSONB, 'Credenciales inválidas';
        RETURN;
    END IF;
    
    -- Resetear intentos fallidos y actualizar último login
    UPDATE users 
    SET failed_login_attempts = 0,
        locked_until = NULL,
        last_login = NOW(),
        updated_at = NOW()
    WHERE id = user_record.id;
    
    -- Retornar datos del usuario
    RETURN QUERY SELECT 
        true,
        jsonb_build_object(
            'id', user_record.id,
            'email', user_record.email,
            'name', user_record.name,
            'role', user_record.role,
            'company', user_record.company,
            'position', user_record.position,
            'avatar_url', user_record.avatar_url,
            'email_verified', user_record.email_verified,
            'last_login', user_record.last_login
        ),
        NULL::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Función para limpiar datos antiguos
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Limpiar logs de seguridad antiguos (más de 90 días)
    DELETE FROM security_logs 
    WHERE timestamp < NOW() - INTERVAL '90 days';
    
    -- Limpiar sesiones expiradas
    DELETE FROM user_sessions 
    WHERE expires_at < NOW() OR (is_active = false AND created_at < NOW() - INTERVAL '7 days');
    
    -- Desbloquear cuentas con bloqueo expirado
    UPDATE users 
    SET locked_until = NULL 
    WHERE locked_until IS NOT NULL AND locked_until < NOW();
END;
$$ LANGUAGE plpgsql;

-- Vista para estadísticas de seguridad
CREATE OR REPLACE VIEW security_stats AS
SELECT 
    DATE_TRUNC('hour', timestamp) as hour,
    event_type,
    severity,
    COUNT(*) as event_count,
    COUNT(DISTINCT ip_address) as unique_ips,
    COUNT(DISTINCT user_id) as unique_users
FROM security_logs 
WHERE timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', timestamp), event_type, severity
ORDER BY hour DESC;

-- Insertar usuarios demo con contraseñas hasheadas
INSERT INTO users (email, password_hash, name, role, company, position, active, email_verified) VALUES
(
    'admin@robertsoftware.com',
    hash_password('Admin123!'),
    'Administrador Principal',
    'admin',
    'Robert Software',
    'CEO & Fundador',
    true,
    true
),
(
    'empleado@demo.com',
    hash_password('Empleado123!'),
    'Empleado Demo',
    'empleado',
    'Robert Software',
    'Desarrollador Senior',
    true,
    true
),
(
    'cliente@demo.com',
    hash_password('Cliente123!'),
    'Cliente Demo',
    'cliente',
    'Empresa Demo S.L.',
    'Director de IT',
    true,
    true
)
ON CONFLICT (email) DO NOTHING;

-- Crear job para limpieza automática (requiere pg_cron extension)
-- SELECT cron.schedule('cleanup-old-data', '0 2 * * *', 'SELECT cleanup_old_data();');

-- Función para obtener estadísticas de usuarios
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE(
    total_users BIGINT,
    active_users BIGINT,
    users_by_role JSONB,
    recent_logins BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE active = true) as active_users,
        (SELECT jsonb_object_agg(role, count) 
         FROM (SELECT role, COUNT(*) as count FROM users WHERE active = true GROUP BY role) t
        ) as users_by_role,
        (SELECT COUNT(*) FROM users WHERE last_login >= NOW() - INTERVAL '24 hours') as recent_logins;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE users IS 'Tabla principal de usuarios del sistema';
COMMENT ON TABLE security_logs IS 'Registro de eventos de seguridad';
COMMENT ON TABLE user_sessions IS 'Sesiones activas de usuarios';
COMMENT ON FUNCTION verify_user_credentials IS 'Verifica credenciales y maneja bloqueos automáticos';
COMMENT ON FUNCTION log_security_event IS 'Registra eventos de seguridad en el sistema';
COMMENT ON FUNCTION cleanup_old_data IS 'Limpia datos antiguos del sistema';
