-- Crear tabla de solicitudes de usuario con funcionalidades avanzadas
CREATE TABLE IF NOT EXISTS user_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Información básica del solicitante
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    
    -- Tipo de acceso solicitado
    access_type VARCHAR(20) NOT NULL CHECK (access_type IN ('cliente', 'empleado')),
    
    -- Mensaje adicional del solicitante
    message TEXT,
    
    -- Estado de la solicitud
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    
    -- Token de activación con expiración
    activation_token VARCHAR(255) UNIQUE,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Información de revisión
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- Información de seguimiento
    ip_address INET,
    user_agent TEXT,
    
    -- Metadatos adicionales
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_user_requests_email ON user_requests(email);
CREATE INDEX IF NOT EXISTS idx_user_requests_status ON user_requests(status);
CREATE INDEX IF NOT EXISTS idx_user_requests_access_type ON user_requests(access_type);
CREATE INDEX IF NOT EXISTS idx_user_requests_created_at ON user_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_user_requests_activation_token ON user_requests(activation_token);
CREATE INDEX IF NOT EXISTS idx_user_requests_token_expires_at ON user_requests(token_expires_at);

-- Índice compuesto para consultas comunes
CREATE INDEX IF NOT EXISTS idx_user_requests_status_created ON user_requests(status, created_at DESC);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_user_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_user_requests_updated_at ON user_requests;
CREATE TRIGGER trigger_update_user_requests_updated_at
    BEFORE UPDATE ON user_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_user_requests_updated_at();

-- Función para limpiar tokens expirados
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Marcar como expiradas las solicitudes con tokens vencidos
    UPDATE user_requests 
    SET 
        status = 'expired',
        updated_at = NOW()
    WHERE 
        status = 'pending' 
        AND token_expires_at < NOW()
        AND token_expires_at IS NOT NULL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de solicitudes
CREATE OR REPLACE FUNCTION get_user_requests_stats()
RETURNS TABLE (
    total_requests BIGINT,
    pending_requests BIGINT,
    approved_requests BIGINT,
    rejected_requests BIGINT,
    expired_requests BIGINT,
    requests_today BIGINT,
    requests_this_week BIGINT,
    requests_this_month BIGINT,
    avg_processing_time_hours NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_requests,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_requests,
        COUNT(*) FILTER (WHERE status = 'approved') as approved_requests,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected_requests,
        COUNT(*) FILTER (WHERE status = 'expired') as expired_requests,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as requests_today,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as requests_this_week,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as requests_this_month,
        AVG(EXTRACT(EPOCH FROM (reviewed_at - created_at))/3600) FILTER (WHERE reviewed_at IS NOT NULL) as avg_processing_time_hours
    FROM user_requests;
END;
$$ LANGUAGE plpgsql;

-- Función para generar reportes de solicitudes
CREATE OR REPLACE FUNCTION get_user_requests_report(
    start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    date_created DATE,
    total_requests BIGINT,
    pending_requests BIGINT,
    approved_requests BIGINT,
    rejected_requests BIGINT,
    cliente_requests BIGINT,
    empleado_requests BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        created_at::DATE as date_created,
        COUNT(*) as total_requests,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_requests,
        COUNT(*) FILTER (WHERE status = 'approved') as approved_requests,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected_requests,
        COUNT(*) FILTER (WHERE access_type = 'cliente') as cliente_requests,
        COUNT(*) FILTER (WHERE access_type = 'empleado') as empleado_requests
    FROM user_requests
    WHERE created_at::DATE BETWEEN start_date AND end_date
    GROUP BY created_at::DATE
    ORDER BY date_created DESC;
END;
$$ LANGUAGE plpgsql;

-- Política de seguridad RLS (Row Level Security)
ALTER TABLE user_requests ENABLE ROW LEVEL SECURITY;

-- Política para administradores (pueden ver todo)
CREATE POLICY "Admins can view all requests" ON user_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
            AND users.is_active = true
        )
    );

-- Política para empleados (pueden ver solicitudes de su tipo)
CREATE POLICY "Employees can view employee requests" ON user_requests
    FOR SELECT USING (
        access_type = 'empleado' AND
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'empleado')
            AND users.is_active = true
        )
    );

-- Política para inserción pública (cualquiera puede crear solicitudes)
CREATE POLICY "Anyone can create requests" ON user_requests
    FOR INSERT WITH CHECK (true);

-- Comentarios para documentación
COMMENT ON TABLE user_requests IS 'Tabla para gestionar solicitudes de acceso de usuarios con sistema de tokens y aprobación';
COMMENT ON COLUMN user_requests.activation_token IS 'Token único para activación de cuenta con expiración';
COMMENT ON COLUMN user_requests.token_expires_at IS 'Fecha de expiración del token de activación';
COMMENT ON COLUMN user_requests.access_type IS 'Tipo de acceso solicitado: cliente o empleado';
COMMENT ON COLUMN user_requests.status IS 'Estado de la solicitud: pending, approved, rejected, expired';
COMMENT ON COLUMN user_requests.metadata IS 'Información adicional en formato JSON';

-- Insertar algunos datos de ejemplo para testing
INSERT INTO user_requests (
    name, 
    email, 
    company, 
    access_type, 
    message,
    activation_token,
    token_expires_at,
    ip_address,
    user_agent
) VALUES 
(
    'Juan Pérez', 
    'juan.perez@empresa.com', 
    'Empresa Ejemplo S.L.', 
    'cliente', 
    'Necesito acceso para gestionar los proyectos de automatización de mi empresa.',
    'token_' || gen_random_uuid()::text,
    NOW() + INTERVAL '7 days',
    '192.168.1.100',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
),
(
    'María García', 
    'maria.garcia@consultora.com', 
    'Consultora Tech', 
    'empleado', 
    'Soy desarrolladora y me gustaría colaborar en proyectos.',
    'token_' || gen_random_uuid()::text,
    NOW() + INTERVAL '7 days',
    '192.168.1.101',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
),
(
    'Carlos Rodríguez', 
    'carlos@startup.io', 
    'StartupTech', 
    'cliente', 
    'Startup en fase de crecimiento, necesitamos automatizar procesos.',
    'token_' || gen_random_uuid()::text,
    NOW() + INTERVAL '7 days',
    '192.168.1.102',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
) ON CONFLICT DO NOTHING;

-- Crear job para limpiar tokens expirados (ejecutar diariamente)
-- Nota: Esto requiere la extensión pg_cron en producción
-- SELECT cron.schedule('cleanup-expired-tokens', '0 2 * * *', 'SELECT cleanup_expired_tokens();');

-- Crear vista para estadísticas rápidas
CREATE OR REPLACE VIEW user_requests_dashboard AS
SELECT 
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_requests,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_requests,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_requests,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as requests_today,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as requests_this_week,
    COUNT(*) FILTER (WHERE access_type = 'cliente') as cliente_requests,
    COUNT(*) FILTER (WHERE access_type = 'empleado') as empleado_requests,
    AVG(EXTRACT(EPOCH FROM (reviewed_at - created_at))/3600) FILTER (WHERE reviewed_at IS NOT NULL) as avg_processing_hours
FROM user_requests;

-- Crear vista para solicitudes pendientes con información adicional
CREATE OR REPLACE VIEW pending_user_requests AS
SELECT 
    ur.*,
    CASE 
        WHEN ur.token_expires_at < NOW() THEN true 
        ELSE false 
    END as token_expired,
    EXTRACT(EPOCH FROM (NOW() - ur.created_at))/3600 as hours_since_created,
    EXTRACT(EPOCH FROM (ur.token_expires_at - NOW()))/3600 as hours_until_token_expires
FROM user_requests ur
WHERE ur.status = 'pending'
ORDER BY ur.created_at ASC;

-- Conceder permisos necesarios
GRANT SELECT, INSERT, UPDATE, DELETE ON user_requests TO authenticated;
GRANT SELECT ON user_requests_dashboard TO authenticated;
GRANT SELECT ON pending_user_requests TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_requests_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_requests_report(DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_tokens() TO authenticated;
