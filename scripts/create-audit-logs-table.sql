-- Crear tabla de logs de auditoría para tracking completo del sistema
-- Esta tabla registra todas las acciones importantes para seguridad y compliance

-- Eliminar tabla si existe (solo para desarrollo)
DROP TABLE IF EXISTS audit_logs CASCADE;

-- Crear tabla audit_logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para optimizar consultas
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX idx_audit_logs_success ON audit_logs(success);

-- Habilitar RLS (Row Level Security)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Política para que solo admins puedan ver todos los logs
CREATE POLICY audit_logs_admin_policy ON audit_logs
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
            AND users.is_active = true
        )
    );

-- Política para que usuarios puedan ver solo sus propios logs
CREATE POLICY audit_logs_user_policy ON audit_logs
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Función para crear logs de auditoría automáticamente
CREATE OR REPLACE FUNCTION create_audit_log(
    p_user_id UUID,
    p_action VARCHAR(100),
    p_table_name VARCHAR(50),
    p_record_id UUID DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_severity VARCHAR(20) DEFAULT 'info',
    p_success BOOLEAN DEFAULT true,
    p_error_message TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values,
        ip_address,
        user_agent,
        severity,
        success,
        error_message,
        created_at
    ) VALUES (
        p_user_id,
        p_action,
        p_table_name,
        p_record_id,
        p_old_values,
        p_new_values,
        p_ip_address,
        p_user_agent,
        p_severity,
        p_success,
        p_error_message,
        NOW()
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para limpiar logs antiguos (ejecutar periódicamente)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM audit_logs 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep
    AND severity NOT IN ('error', 'critical');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log de la limpieza
    INSERT INTO audit_logs (
        action,
        table_name,
        new_values,
        severity,
        success,
        created_at
    ) VALUES (
        'CLEANUP_OLD_LOGS',
        'audit_logs',
        jsonb_build_object('deleted_count', deleted_count, 'days_kept', days_to_keep),
        'info',
        true,
        NOW()
    );
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener estadísticas de auditoría
CREATE OR REPLACE FUNCTION get_audit_stats(days_back INTEGER DEFAULT 30)
RETURNS TABLE (
    total_actions BIGINT,
    failed_actions BIGINT,
    success_rate NUMERIC,
    top_actions JSONB,
    top_users JSONB,
    severity_breakdown JSONB
) AS $$
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT 
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE success = false) as failed,
            COUNT(*) FILTER (WHERE success = true) as successful
        FROM audit_logs 
        WHERE created_at >= NOW() - INTERVAL '1 day' * days_back
    ),
    top_actions_data AS (
        SELECT jsonb_agg(
            jsonb_build_object(
                'action', action,
                'count', count
            ) ORDER BY count DESC
        ) as actions
        FROM (
            SELECT action, COUNT(*) as count
            FROM audit_logs 
            WHERE created_at >= NOW() - INTERVAL '1 day' * days_back
            GROUP BY action
            ORDER BY count DESC
            LIMIT 10
        ) t
    ),
    top_users_data AS (
        SELECT jsonb_agg(
            jsonb_build_object(
                'user_id', user_id,
                'count', count
            ) ORDER BY count DESC
        ) as users
        FROM (
            SELECT user_id, COUNT(*) as count
            FROM audit_logs 
            WHERE created_at >= NOW() - INTERVAL '1 day' * days_back
            AND user_id IS NOT NULL
            GROUP BY user_id
            ORDER BY count DESC
            LIMIT 10
        ) t
    ),
    severity_data AS (
        SELECT jsonb_object_agg(severity, count) as breakdown
        FROM (
            SELECT severity, COUNT(*) as count
            FROM audit_logs 
            WHERE created_at >= NOW() - INTERVAL '1 day' * days_back
            GROUP BY severity
        ) t
    )
    SELECT 
        s.total,
        s.failed,
        CASE WHEN s.total > 0 THEN ROUND((s.successful::NUMERIC / s.total::NUMERIC) * 100, 2) ELSE 0 END,
        COALESCE(ta.actions, '[]'::jsonb),
        COALESCE(tu.users, '[]'::jsonb),
        COALESCE(sd.breakdown, '{}'::jsonb)
    FROM stats s
    CROSS JOIN top_actions_data ta
    CROSS JOIN top_users_data tu
    CROSS JOIN severity_data sd;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para auditar cambios en la tabla users
CREATE OR REPLACE FUNCTION audit_users_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM create_audit_log(
            NEW.id,
            'USER_CREATED',
            'users',
            NEW.id,
            NULL,
            to_jsonb(NEW),
            NULL,
            NULL,
            'info',
            true
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM create_audit_log(
            NEW.id,
            'USER_UPDATED',
            'users',
            NEW.id,
            to_jsonb(OLD),
            to_jsonb(NEW),
            NULL,
            NULL,
            'info',
            true
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM create_audit_log(
            OLD.id,
            'USER_DELETED',
            'users',
            OLD.id,
            to_jsonb(OLD),
            NULL,
            NULL,
            NULL,
            'warning',
            true
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger para auditar cambios en users
DROP TRIGGER IF EXISTS audit_users_trigger ON users;
CREATE TRIGGER audit_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_users_changes();

-- Insertar log inicial de creación de tabla
INSERT INTO audit_logs (
    action,
    table_name,
    new_values,
    severity,
    success,
    created_at
) VALUES (
    'AUDIT_SYSTEM_INITIALIZED',
    'audit_logs',
    '{"message": "Sistema de auditoría inicializado correctamente", "version": "1.0"}'::jsonb,
    'info',
    true,
    NOW()
);

-- Mostrar resultado
SELECT jsonb_build_object(
    'status', '✅ Tabla audit_logs creada exitosamente',
    'registros_existentes', (SELECT COUNT(*)::text FROM audit_logs)
);
