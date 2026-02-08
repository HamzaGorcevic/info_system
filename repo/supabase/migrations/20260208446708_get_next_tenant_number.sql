CREATE OR REPLACE FUNCTION get_next_tenant_number(p_building_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(tenant_number), 0) + 1
    INTO next_num
    FROM tenants
    WHERE building_id = p_building_id;
    
    RETURN next_num;
END;
$$;
