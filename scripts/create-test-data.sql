-- Script para crear datos de testing
-- Ejecutar después de crear todas las tablas principales

-- Limpiar datos existentes de testing
DELETE FROM email_logs WHERE recipient_email LIKE '%test%';
DELETE FROM downloads WHERE order_id IN (
    SELECT id FROM orders WHERE customer_email LIKE '%test%'
);
DELETE FROM invoices WHERE order_id IN (
    SELECT id FROM orders WHERE customer_email LIKE '%test%'
);
DELETE FROM orders WHERE customer_email LIKE '%test%';

-- Insertar órdenes de testing
INSERT INTO orders (
    id,
    stripe_payment_intent_id,
    customer_name,
    customer_email,
    customer_phone,
    customer_address,
    customer_city,
    customer_postal_code,
    customer_country,
    product_id,
    product_name,
    amount,
    currency,
    status,
    metadata,
    created_at,
    updated_at
) VALUES 
-- Orden completada
(
    gen_random_uuid(),
    'pi_test_completed_001',
    'Test Customer 1',
    'test1@robertsoftware.es',
    '+34600123456',
    'Calle Test 123',
    'Madrid',
    '28001',
    'España',
    'automation_ai',
    'Sistema de Automatización con IA',
    299700, -- €2,997
    'eur',
    'completed',
    '{"test": true, "environment": "testing"}',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
),
-- Orden pendiente
(
    gen_random_uuid(),
    'pi_test_pending_001',
    'Test Customer 2',
    'test2@robertsoftware.es',
    '+34600123457',
    'Calle Test 456',
    'Barcelona',
    '08001',
    'España',
    'web_premium',
    'Desarrollo Web Premium',
    199700, -- €1,997
    'eur',
    'pending',
    '{"test": true, "environment": "testing"}',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
),
-- Orden fallida
(
    gen_random_uuid(),
    'pi_test_failed_001',
    'Test Customer 3',
    'test3@robertsoftware.es',
    '+34600123458',
    'Calle Test 789',
    'Valencia',
    '46001',
    'España',
    'consulting_premium',
    'Consultoría Premium',
    399700, -- €3,997
    'eur',
    'failed',
    '{"test": true, "environment": "testing", "error": "Payment failed"}',
    NOW() - INTERVAL '3 hours',
    NOW() - INTERVAL '3 hours'
);

-- Crear tokens de descarga para órdenes completadas
INSERT INTO downloads (
    id,
    order_id,
    download_token,
    download_count,
    max_downloads,
    expires_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    o.id,
    'test_token_' || SUBSTRING(o.id::text, 1, 8),
    0,
    5,
    NOW() + INTERVAL '30 days',
    o.created_at,
    o.updated_at
FROM orders o 
WHERE o.customer_email LIKE '%test%' 
AND o.status = 'completed';

-- Crear facturas para órdenes completadas
INSERT INTO invoices (
    id,
    order_id,
    invoice_number,
    total_amount,
    tax_amount,
    currency,
    status,
    pdf_url,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    o.id,
    'INV-TEST-' || TO_CHAR(o.created_at, 'YYYYMMDD') || '-' || SUBSTRING(o.id::text, 1, 8),
    o.amount,
    ROUND(o.amount * 0.21), -- 21% IVA
    o.currency,
    'paid',
    '/invoices/test_invoice_' || SUBSTRING(o.id::text, 1, 8) || '.pdf',
    o.created_at,
    o.updated_at
FROM orders o 
WHERE o.customer_email LIKE '%test%' 
AND o.status = 'completed';

-- Crear logs de email para todas las órdenes de testing
INSERT INTO email_logs (
    id,
    order_id,
    email_type,
    recipient_email,
    subject,
    status,
    provider,
    provider_message_id,
    error_message,
    sent_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    o.id,
    'confirmation',
    o.customer_email,
    'Confirmación de pedido - ' || o.product_name,
    CASE 
        WHEN o.status = 'completed' THEN 'sent'
        WHEN o.status = 'pending' THEN 'pending'
        ELSE 'failed'
    END,
    'resend',
    CASE 
        WHEN o.status = 'completed' THEN 'msg_test_' || SUBSTRING(o.id::text, 1, 8)
        ELSE NULL
    END,
    CASE 
        WHEN o.status = 'failed' THEN 'Payment failed, email not sent'
        ELSE NULL
    END,
    CASE 
        WHEN o.status = 'completed' THEN o.created_at + INTERVAL '5 minutes'
        ELSE NULL
    END,
    o.created_at,
    o.updated_at
FROM orders o 
WHERE o.customer_email LIKE '%test%';

-- Crear logs de email de descarga para órdenes completadas
INSERT INTO email_logs (
    id,
    order_id,
    email_type,
    recipient_email,
    subject,
    status,
    provider,
    provider_message_id,
    error_message,
    sent_at,
    created_at,
    updated_at
)
SELECT 
    gen_random_uuid(),
    o.id,
    'download_link',
    o.customer_email,
    'Enlaces de descarga - ' || o.product_name,
    'sent',
    'resend',
    'msg_download_' || SUBSTRING(o.id::text, 1, 8),
    NULL,
    o.created_at + INTERVAL '10 minutes',
    o.created_at + INTERVAL '5 minutes',
    o.updated_at
FROM orders o 
WHERE o.customer_email LIKE '%test%' 
AND o.status = 'completed';

-- Refrescar estadísticas
SELECT refresh_orders_stats();

-- Mostrar resumen de datos creados
SELECT 
    'Órdenes de testing creadas' as tipo,
    COUNT(*) as cantidad
FROM orders 
WHERE customer_email LIKE '%test%'

UNION ALL

SELECT 
    'Tokens de descarga creados' as tipo,
    COUNT(*) as cantidad
FROM downloads d
JOIN orders o ON d.order_id = o.id
WHERE o.customer_email LIKE '%test%'

UNION ALL

SELECT 
    'Facturas creadas' as tipo,
    COUNT(*) as cantidad
FROM invoices i
JOIN orders o ON i.order_id = o.id
WHERE o.customer_email LIKE '%test%'

UNION ALL

SELECT 
    'Logs de email creados' as tipo,
    COUNT(*) as cantidad
FROM email_logs 
WHERE recipient_email LIKE '%test%';

-- Mostrar estadísticas de testing
SELECT * FROM get_orders_stats(CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE);
