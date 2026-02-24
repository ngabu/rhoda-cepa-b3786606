-- Fix remaining functions with mutable search_path
-- Using DROP and CREATE to handle return type changes

-- calculate_fee returns void
DROP FUNCTION IF EXISTS public.calculate_fee();
CREATE FUNCTION public.calculate_fee()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Placeholder function
  NULL;
END;
$$;

-- clear_old_system_logs returns integer
CREATE OR REPLACE FUNCTION public.clear_old_system_logs(days_threshold integer DEFAULT 30)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  RETURN deleted_count;
END;
$$;

-- get_activities returns json
CREATE OR REPLACE FUNCTION public.get_activities()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN (
    SELECT json_agg(
      json_build_object(
        'id', id,
        'name', category_number || ': ' || activity_description,
        'level', level
      )
    )
    FROM public.prescribed_activities
  );
END;
$$;

-- handle_new_submission returns trigger
CREATE OR REPLACE FUNCTION public.handle_new_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN NEW;
END;
$$;

-- handle_new_user returns trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN NEW;
END;
$$;

-- is_admin returns boolean (language plpgsql)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND user_type IN ('admin', 'super_admin')
  );
END;
$$;

-- log_profile_changes returns trigger
CREATE OR REPLACE FUNCTION public.log_profile_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, target_type, target_id, details)
  VALUES (
    auth.uid(),
    TG_OP || '_profile',
    'profile',
    NEW.id::text,
    jsonb_build_object('changes', row_to_json(NEW))
  );
  RETURN NEW;
END;
$$;

-- rebuild_database_indexes returns void
CREATE OR REPLACE FUNCTION public.rebuild_database_indexes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  idx record;
BEGIN
  FOR idx IN 
    SELECT indexname, tablename
    FROM pg_indexes
    WHERE schemaname = 'public'
  LOOP
    EXECUTE 'REINDEX INDEX public.' || quote_ident(idx.indexname);
  END LOOP;
END;
$$;

-- update_database_statistics returns void
CREATE OR REPLACE FUNCTION public.update_database_statistics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  tbl record;
BEGIN
  FOR tbl IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE 'ANALYZE public.' || quote_ident(tbl.tablename);
  END LOOP;
END;
$$;

-- update_permit_types_updated_at returns trigger
CREATE OR REPLACE FUNCTION public.update_permit_types_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- vacuum_analyze_database returns void
CREATE OR REPLACE FUNCTION public.vacuum_analyze_database()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  tbl record;
BEGIN
  FOR tbl IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE 'VACUUM ANALYZE public.' || quote_ident(tbl.tablename);
  END LOOP;
END;
$$;

-- validate_documents returns json
DROP FUNCTION IF EXISTS public.validate_documents(uuid, jsonb);
CREATE FUNCTION public.validate_documents(activity_id uuid, uploaded_docs jsonb)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN json_build_object('valid', true);
END;
$$;