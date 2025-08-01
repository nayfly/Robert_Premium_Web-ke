-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla users
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Los admins pueden ver todos los usuarios" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin' 
            AND is_active = true
        )
    );

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Los admins pueden actualizar cualquier usuario" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin' 
            AND is_active = true
        )
    );

CREATE POLICY "Admins can insert users" ON users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'admin' 
            AND u.is_active = true
        )
    );

-- Políticas para la tabla orders
CREATE POLICY "Admins and employees can view all orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'empleado') 
            AND u.is_active = true
        )
    );

CREATE POLICY "Clients can view their own orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.email = orders.customer_email 
            AND u.is_active = true
        )
    );

CREATE POLICY "Admins and employees can manage orders" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'empleado') 
            AND u.is_active = true
        )
    );

-- Políticas para la tabla downloads
CREATE POLICY "Admins and employees can view all downloads" ON downloads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'empleado') 
            AND u.is_active = true
        )
    );

CREATE POLICY "Clients can view their own downloads" ON downloads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u, orders o 
            WHERE u.id = auth.uid() 
            AND u.email = o.customer_email 
            AND o.id = downloads.order_id 
            AND u.is_active = true
        )
    );

CREATE POLICY "Admins and employees can manage downloads" ON downloads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'empleado') 
            AND u.is_active = true
        )
    );

-- Políticas para la tabla invoices
CREATE POLICY "Admins and employees can view all invoices" ON invoices
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'empleado') 
            AND u.is_active = true
        )
    );

CREATE POLICY "Clients can view their own invoices" ON invoices
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u, orders o 
            WHERE u.id = auth.uid() 
            AND u.email = o.customer_email 
            AND o.id = invoices.order_id 
            AND u.is_active = true
        )
    );

CREATE POLICY "Admins and employees can manage invoices" ON invoices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'empleado') 
            AND u.is_active = true
        )
    );

-- Políticas para la tabla audit_logs
CREATE POLICY "Admins can view all audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'admin' 
            AND u.is_active = true
        )
    );

CREATE POLICY "System can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- Políticas para la tabla notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins and employees can manage all notifications" ON notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'empleado') 
            AND u.is_active = true
        )
    );

-- Políticas para la tabla email_logs
CREATE POLICY "Admins can view all email logs" ON email_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'admin' 
            AND u.is_active = true
        )
    );

CREATE POLICY "System can insert email logs" ON email_logs
    FOR INSERT WITH CHECK (true);

-- Políticas para la tabla budgets
CREATE POLICY "Admins and employees can view all budgets" ON budgets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'empleado') 
            AND u.is_active = true
        )
    );

CREATE POLICY "Users can view their own budgets" ON budgets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND (u.id = budgets.user_id OR u.email = budgets.email)
            AND u.is_active = true
        )
    );

CREATE POLICY "Anyone can create budgets" ON budgets
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins and employees can manage budgets" ON budgets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'empleado') 
            AND u.is_active = true
        )
    );

-- Políticas para la tabla feedback
CREATE POLICY "Admins and employees can view all feedback" ON feedback
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'empleado') 
            AND u.is_active = true
        )
    );

CREATE POLICY "Users can view their own feedback" ON feedback
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND (u.id = feedback.user_id OR u.email = feedback.email)
            AND u.is_active = true
        )
    );

CREATE POLICY "Anyone can create feedback" ON feedback
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins and employees can manage feedback" ON feedback
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'empleado') 
            AND u.is_active = true
        )
    );

-- Políticas para la tabla user_requests
CREATE POLICY "Admins can view all user requests" ON user_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'admin' 
            AND u.is_active = true
        )
    );

CREATE POLICY "Anyone can create user requests" ON user_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage user requests" ON user_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'admin' 
            AND u.is_active = true
        )
    );

-- Políticas para la tabla projects
CREATE POLICY "Admins can view all projects" ON projects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'admin' 
            AND u.is_active = true
        )
    );

CREATE POLICY "Employees can view their projects" ON projects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'empleado' 
            AND u.is_active = true
        )
    );

CREATE POLICY "Admins can manage all projects" ON projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'admin' 
            AND u.is_active = true
        )
    );

-- Políticas para la tabla tasks
CREATE POLICY "Admins can view all tasks" ON tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'admin' 
            AND u.is_active = true
        )
    );

CREATE POLICY "Employees can view their tasks" ON tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'empleado' 
            AND u.is_active = true
        )
    );

CREATE POLICY "Admins can manage all tasks" ON tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'admin' 
            AND u.is_active = true
        )
    );
