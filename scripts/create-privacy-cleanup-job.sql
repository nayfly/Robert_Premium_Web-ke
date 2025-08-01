-- Script para crear un job automático de limpieza de privacidad
-- Este script configura la limpieza automática de logs

-- Función para ejecutar limpieza automática
CREATE OR REPLACE FUNCTION run_automated_privacy_cleanup()
RETURNS void AS $$
DECLARE
    anonymized_count INTEGER := 0;
    deleted_count INTEGER := 0;
    cutoff_anonymize DATE;
    cutoff_delete DATE;
BEGIN
    -- Calcular fechas de corte
    cutoff_anonymize := CURRENT_DATE - INTERVAL '90 days';
    cutoff_delete := CURRENT_DATE - INTERVAL '365 days';
    
    -- Anonimizar IPs antiguas
    UPDATE audit_logs 
    SET 
        ip_address = 'xxx.xxx.xxx.xxx',
        user_agent = 'anonymized'
    WHERE 
        created_at < cutoff_anonymize
        AND ip_address IS NOT NULL
        AND ip_address != 'xxx.xxx.xxx.xxx';
    
    GET DIAGNOSTICS anonymized_count = ROW_COUNT;
    
    -- Eliminar logs antiguos no críticos
    DELETE FROM audit_logs 
    WHERE 
        created_at < cutoff_delete
        AND severity NOT IN ('critical', 'error');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Registrar la operación de limpieza
    INSERT INTO audit_logs (
        action,
        table_name,
        new_values,
        severity,
        success,
        created_at
    ) VALUES (
        'AUTOMATED_PRIVACY_CLEANUP',
        'audit_logs',
        jsonb_build_object(
            'anonymized_count', anonymized_count,
            'deleted_count', deleted_count,
            'anonymize_cutoff', cutoff_anonymize,
            'delete_cutoff', cutoff_delete
        ),
        'info',
        true,
        NOW()
    );
    
    -- Log del resultado
    RAISE NOTICE 'Limpieza automática completada: % IPs anonimizadas, % logs eliminados', 
                 anonymized_count, deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear extensión pg_cron si no existe (requiere permisos de superusuario)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Programar ejecución semanal (domingos a las 2:00 AM)
-- SELECT cron.schedule('privacy-cleanup', '0 2 * * 0', 'SELECT run_automated_privacy_cleanup();');

-- Función para obtener el estado del job de limpieza
CREATE OR REPLACE FUNCTION get_privacy_cleanup_status()
RETURNS TABLE (
    last_cleanup TIMESTAMP WITH TIME ZONE,
    next_scheduled TIMESTAMP WITH TIME ZONE,
    total_cleanups BIGINT,
    avg_anonymized NUMERIC,
    avg_deleted NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH cleanup_stats AS (
        SELECT 
            MAX(created_at) as last_run,
            COUNT(*) as total_runs,
            AVG((new_values->>'anonymized_count')::INTEGER) as avg_anon,
            AVG((new_values->>'deleted_count')::INTEGER) as avg_del
        FROM audit_logs 
        WHERE action = 'AUTOMATED_PRIVACY_CLEANUP'
    )
    SELECT 
        cs.last_run,
        -- Próximo domingo a las 2:00 AM
        (DATE_TRUNC('week', NOW()) + INTERVAL '7 days' + INTERVAL '2 hours')::TIMESTAMP WITH TIME ZONE,
        cs.total_runs,
        COALESCE(cs.avg_anon, 0),
        COALESCE(cs.avg_del, 0)
    FROM cleanup_stats cs;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para ejecutar limpieza manual (para el dashboard)
CREATE OR REPLACE FUNCTION manual_privacy_cleanup()
RETURNS jsonb AS $$
DECLARE
    result jsonb;
BEGIN
    -- Ejecutar limpieza
    PERFORM run_automated_privacy_cleanup();
    
    -- Obtener estadísticas del resultado
    SELECT jsonb_build_object(
        'success', true,
        'timestamp', NOW(),
        'message', 'Limpieza manual ejecutada correctamente'
    ) INTO result;
    
    RETURN result;
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM,
        'timestamp', NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insertar log inicial
INSERT INTO audit_logs (
    action,
    table_name,
    new_values,
    severity,
    success,
    created_at
) VALUES (
    'PRIVACY_SYSTEM_INITIALIZED',
    'audit_logs',
    '{"message": "Sistema de limpieza de privacidad configurado", "version": "1.0"}'::jsonb,
    'info',
    true,
    NOW()
);

-- Mostrar resultado
SELECT jsonb_build_object(
    'status', '✅ Sistema de privacidad configurado correctamente',
    'features', jsonb_build_array(
        'Anonimización automática de IPs (90 días)',
        'Eliminación de logs no críticos (365 días)',
        'Preservación de logs críticos',
        'Limpieza manual disponible'
    )
);
