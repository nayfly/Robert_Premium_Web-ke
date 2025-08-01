-- Políticas de seguridad adicionales y configuración avanzada

-- Crear función para validar roles
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role = 'admin' 
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear función para validar empleados
CREATE OR REPLACE FUNCTION is_employee_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'empleado')
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear función para validar usuario activo
CREATE OR REPLACE FUNCTION is_active_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para registrar intentos de acceso no autorizados
CREATE OR REPLACE FUNCTION log_unauthorized_access(
    p_table_name VARCHAR(100),
    p_action VARCHAR(100),
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO audit_logs (
        user_id, action, table_name, ip_address, user_agent, 
        severity, success, error_message
    ) VALUES (
        auth.uid(), p_action, p_table_name, p_ip_address, p_user_agent,
        'warning', false, 'Unauthorized access attempt'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para validar formato de email
CREATE OR REPLACE FUNCTION is_valid_email(email_input TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN email_input ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para validar formato de teléfono
CREATE OR REPLACE FUNCTION is_valid_phone(phone_input TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN phone_input IS NULL OR phone_input ~* '^\+?[1-9]\d{1,14}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para sanitizar texto
CREATE OR REPLACE FUNCTION sanitize_text(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    IF input_text IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Remover caracteres peligrosos y espacios extra
    RETURN trim(regexp_replace(input_text, '[<>"\'';&]', '', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para generar token seguro
CREATE OR REPLACE FUNCTION generate_secure_token(length INTEGER DEFAULT 32)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(gen_random_bytes(length), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para hash de contraseña (simulada para demo)
CREATE OR REPLACE FUNCTION hash_password(password_input TEXT)
RETURNS TEXT AS $$
BEGIN
    -- En producción usar bcrypt o similar
    RETURN encode(digest(password_input || 'salt_secret', 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar contraseña
CREATE OR REPLACE FUNCTION verify_password(password_input TEXT, hash_stored TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN hash_password(password_input) = hash_stored;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear tabla de sesiones para manejo seguro
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para sesiones
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active);

-- RLS para sesiones
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas para sesiones
DROP POLICY IF EXISTS "Users can view their own sessions" ON user_sessions;
CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own sessions" ON user_sessions;
CREATE POLICY "Users can update their own sessions" ON user_sessions
    FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "System can insert sessions" ON user_sessions;
CREATE POLICY "System can insert sessions" ON user_sessions
    FOR INSERT WITH CHECK (true);

-- Función para limpiar sesiones expiradas
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS VOID AS $$
BEGIN
    DELETE FROM user_sessions 
    WHERE expires_at < NOW() OR is_active = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear sesión
CREATE OR REPLACE FUNCTION create_user_session(
    p_user_id UUID,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_expires_hours INTEGER DEFAULT 24
)
RETURNS TEXT AS $$
DECLARE
    session_token TEXT;
BEGIN
    session_token := generate_secure_token(64);
    
    INSERT INTO user_sessions (
        user_id, session_token, ip_address, user_agent, expires_at
    ) VALUES (
        p_user_id, session_token, p_ip_address, p_user_agent,
        NOW() + (p_expires_hours || ' hours')::INTERVAL
    );
    
    RETURN session_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para validar sesión
CREATE OR REPLACE FUNCTION validate_session(p_session_token TEXT)
RETURNS UUID AS $$
DECLARE
    user_id_result UUID;
BEGIN
    SELECT user_id INTO user_id_result
    FROM user_sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.session_token = p_session_token
    AND s.expires_at > NOW()
    AND s.is_active = true
    AND u.is_active = true;
    
    IF user_id_result IS NOT NULL THEN
        -- Actualizar última actividad
        UPDATE user_sessions 
        SET last_activity = NOW()
        WHERE session_token = p_session_token;
    END IF;
    
    RETURN user_id_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
