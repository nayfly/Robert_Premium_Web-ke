-- Función para obtener estadísticas de órdenes
CREATE OR REPLACE FUNCTION get_orders_stats(
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL
)
RETURNS TABLE (
    total_orders BIGINT,
    total_revenue BIGINT,
    completed_orders BIGINT,
    pending_orders BIGINT,
    failed_orders BIGINT,
    avg_order_value NUMERIC,
    top_product VARCHAR,
    conversion_rate NUMERIC
) AS $$
BEGIN
    -- Si no se proporcionan fechas, usar los últimos 30 días
    IF start_date IS NULL THEN
        start_date := CURRENT_DATE - INTERVAL '30 days';
    END IF;
    
    IF end_date IS NULL THEN
        end_date := CURRENT_DATE;
    END IF;

    RETURN QUERY
    WITH order_stats AS (
        SELECT 
            COUNT(*) as total_count,
            SUM(amount) as total_amount,
            COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
            COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
            COUNT(*) FILTER (WHERE status = 'failed') as failed_count,
            AVG(amount) as avg_amount
        FROM orders 
        WHERE created_at::DATE BETWEEN start_date AND end_date
    ),
    product_stats AS (
        SELECT 
            product_name,
            COUNT(*) as product_count
        FROM orders 
        WHERE created_at::DATE BETWEEN start_date AND end_date
        GROUP BY product_name
        ORDER BY product_count DESC
        LIMIT 1
    )
    SELECT 
        os.total_count::BIGINT,
        os.total_amount::BIGINT,
        os.completed_count::BIGINT,
        os.pending_count::BIGINT,
        os.failed_count::BIGINT,
        ROUND(os.avg_amount, 2),
        COALESCE(ps.product_name, 'N/A')::VARCHAR,
        CASE 
            WHEN os.total_count > 0 THEN 
                ROUND((os.completed_count::NUMERIC / os.total_count::NUMERIC) * 100, 2)
            ELSE 0
        END
    FROM order_stats os
    LEFT JOIN product_stats ps ON true;
END;
$$ LANGUAGE plpgsql;

-- Vista materializada para estadísticas rápidas
CREATE MATERIALIZED VIEW IF NOT EXISTS orders_daily_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_orders,
    SUM(amount) as total_revenue,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_orders,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_orders,
    AVG(amount) as avg_order_value
FROM orders 
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Índice para la vista materializada
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_daily_stats_date ON orders_daily_stats(date);

-- Función para refrescar estadísticas
CREATE OR REPLACE FUNCTION refresh_orders_stats()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY orders_daily_stats;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas por producto
CREATE OR REPLACE FUNCTION get_product_stats(
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL
)
RETURNS TABLE (
    product_name VARCHAR,
    total_sales BIGINT,
    total_revenue BIGINT,
    avg_price NUMERIC,
    conversion_rate NUMERIC
) AS $$
BEGIN
    IF start_date IS NULL THEN
        start_date := CURRENT_DATE - INTERVAL '30 days';
    END IF;
    
    IF end_date IS NULL THEN
        end_date := CURRENT_DATE;
    END IF;

    RETURN QUERY
    SELECT 
        o.product_name::VARCHAR,
        COUNT(*)::BIGINT as total_sales,
        SUM(o.amount)::BIGINT as total_revenue,
        ROUND(AVG(o.amount), 2) as avg_price,
        ROUND(
            (COUNT(*) FILTER (WHERE o.status = 'completed')::NUMERIC / 
             COUNT(*)::NUMERIC) * 100, 2
        ) as conversion_rate
    FROM orders o
    WHERE o.created_at::DATE BETWEEN start_date AND end_date
    GROUP BY o.product_name
    ORDER BY total_revenue DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_orders_stats IS 'Obtiene estadísticas generales de órdenes para un rango de fechas';
COMMENT ON FUNCTION get_product_stats IS 'Obtiene estadísticas por producto para un rango de fechas';
COMMENT ON FUNCTION refresh_orders_stats IS 'Refresca la vista materializada de estadísticas diarias';
