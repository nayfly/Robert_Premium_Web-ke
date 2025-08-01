-- Actualizar tabla users con campos de seguridad adicionales
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS company VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS position VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Añadir constraints de seguridad si no existen
DO $$
BEGIN
    -- Constraint para email
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_email_format') THEN
        ALTER TABLE users ADD CONSTRAINT users_email_format 
        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
    END IF;
    
    -- Constraint para nombre
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_name_length') THEN
        ALTER TABLE users ADD CONSTRAINT users_name_length 
        CHECK (char_length(name) >= 2 AND char_length(name) <= 255);
    END IF;
    
    -- Constraint para teléfono
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_phone_format') THEN
        ALTER TABLE users ADD CONSTRAINT users_phone_format 
        CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$');
    END IF;
END $$;

-- Añadir índices adicionales
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);
CREATE INDEX IF NOT EXISTS idx_users_failed_attempts ON users(failed_login_attempts);
CREATE INDEX IF NOT EXISTS idx_users_locked_until ON users(locked_until);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);

-- Actualizar políticas existentes para incluir locked_until
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (
        auth.uid() = id AND 
        is_active = true AND
        (locked_until IS NULL OR locked_until < NOW())
    );

DROP POLICY IF EXISTS "Admins can view all users" ON users;
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
