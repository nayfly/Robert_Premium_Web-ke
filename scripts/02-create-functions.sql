-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_requests_updated_at
    BEFORE UPDATE ON user_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para resetear intentos de login fallidos
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
    
    -- Bloquear cuenta después de 5 intentos fallidos por 30 minutos
    IF current_attempts >= 5 THEN
        UPDATE users 
        SET locked_until = NOW() + INTERVAL '30 minutes'
        WHERE email = user_email;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para limpiar logs antiguos
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM audit_logs 
    WHERE created_at < NOW() - INTERVAL '6 months';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para limpiar solicitudes antiguas
CREATE OR REPLACE FUNCTION cleanup_old_user_requests()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_requests 
    WHERE created_at < NOW() - INTERVAL '6 months'
    AND status IN ('approved', 'rejected');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
