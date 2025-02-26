-- Create function to get table information
CREATE OR REPLACE FUNCTION get_table_info(table_name TEXT)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- Get column information
    WITH columns AS (
        SELECT 
            column_name, 
            data_type,
            is_nullable
        FROM 
            information_schema.columns
        WHERE 
            table_name = $1
    ),
    -- Get primary key information
    pk AS (
        SELECT 
            tc.constraint_name,
            kcu.column_name
        FROM 
            information_schema.table_constraints tc
        JOIN 
            information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        WHERE 
            tc.table_name = $1
            AND tc.constraint_type = 'PRIMARY KEY'
    ),
    -- Get foreign key information
    fk AS (
        SELECT 
            tc.constraint_name,
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
        FROM 
            information_schema.table_constraints tc
        JOIN 
            information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        JOIN 
            information_schema.constraint_column_usage ccu
            ON tc.constraint_name = ccu.constraint_name
        WHERE 
            tc.table_name = $1
            AND tc.constraint_type = 'FOREIGN KEY'
    )
    -- Combine all information into a JSON structure
    SELECT 
        jsonb_build_object(
            'table_name', $1,
            'columns', jsonb_agg(
                jsonb_build_object(
                    'name', c.column_name,
                    'type', c.data_type,
                    'nullable', c.is_nullable,
                    'is_primary_key', CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END,
                    'foreign_key', CASE 
                        WHEN fk.column_name IS NOT NULL THEN 
                            jsonb_build_object(
                                'table', fk.foreign_table_name,
                                'column', fk.foreign_column_name
                            )
                        ELSE NULL
                    END
                )
            )
        ) INTO result
    FROM 
        columns c
    LEFT JOIN 
        pk ON c.column_name = pk.column_name
    LEFT JOIN 
        fk ON c.column_name = fk.column_name;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql; 