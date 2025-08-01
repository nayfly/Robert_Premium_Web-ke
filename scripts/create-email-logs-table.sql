-- Crear tabla de logs de email
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    email_type VARCHAR(50) NOT NULL, -- 'confirmation', 'download_link', 'invoice'
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'bounced'
    provider VARCHAR(50) DEFAULT 'resend', -- 'resend', 'sendgrid', etc.
    provider_message_id VARCHAR(255),
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_email_logs_order_id ON email_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_email_logs_updated_at ON email_logs;
CREATE TRIGGER trigger_update_email_logs_updated_at
    BEFORE UPDATE ON email_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_email_logs_updated_at();

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_email_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para limpiar logs antiguos (más de 90 días)
CREATE OR REPLACE FUNCTION cleanup_old_email_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM email_logs 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Política de seguridad RLS
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Solo administradores pueden ver todos los logs
CREATE POLICY "Admin can view all email logs" ON email_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Solo el sistema puede insertar logs
CREATE POLICY "System can insert email logs" ON email_logs
    FOR INSERT WITH CHECK (true);

-- Solo el sistema puede actualizar logs
CREATE POLICY "System can update email logs" ON email_logs
    FOR UPDATE USING (true);

-- Comentarios para documentación
COMMENT ON TABLE email_logs IS 'Registro de todos los emails enviados por el sistema';
COMMENT ON COLUMN email_logs.email_type IS 'Tipo de email: confirmation, download_link, invoice';
COMMENT ON COLUMN email_logs.status IS 'Estado del email: pending, sent, failed, bounced';
COMMENT ON COLUMN email_logs.provider IS 'Proveedor de email utilizado';
COMMENT ON COLUMN email_logs.error_message IS 'Mensaje de error si el envío falló';
