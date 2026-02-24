-- =====================================================
-- CRITICAL FIX #2: Create Trigger Function and Apply to All Tables
-- =====================================================

-- Create the reusable trigger function with proper search_path
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = 'public';

-- Apply trigger to all BASE TABLES with updated_at column (excluding views)
DO $$
DECLARE
  tbl RECORD;
BEGIN
  FOR tbl IN 
    SELECT c.table_name 
    FROM information_schema.columns c
    JOIN information_schema.tables t 
      ON c.table_schema = t.table_schema 
      AND c.table_name = t.table_name
    WHERE c.table_schema = 'public' 
    AND c.column_name = 'updated_at'
    AND t.table_type = 'BASE TABLE'
  LOOP
    -- Drop existing trigger if any
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', tbl.table_name);
    
    -- Create new trigger
    EXECUTE format('
      CREATE TRIGGER set_updated_at
      BEFORE UPDATE ON public.%I
      FOR EACH ROW
      EXECUTE FUNCTION public.trigger_set_updated_at()
    ', tbl.table_name);
  END LOOP;
END $$;

-- =====================================================
-- CRITICAL FIX #3: Fix Function Search Path Security
-- =====================================================

-- Fix functions that have mutable search_path issues

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND user_type = 'super_admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_public_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND user_type = 'public'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND user_type IN ('admin', 'super_admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_managing_director()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND staff_position = 'managing_director'
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_permit_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF (NEW.status = 'under_review' OR NEW.status = 'under_technical_review') 
     AND (OLD.status IS NULL OR (OLD.status != 'under_review' AND OLD.status != 'under_technical_review'))
     AND NOT EXISTS (
       SELECT 1 
       FROM public.compliance_assessments 
       WHERE permit_application_id = NEW.id
     ) THEN
    
    INSERT INTO public.compliance_assessments (
      permit_application_id,
      assessed_by,           
      assigned_by,           
      assessment_status,
      assessment_notes
    ) VALUES (
      NEW.id,
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      'pending',
      'Automatically created when application status changed to ' || NEW.status
    );
    
    INSERT INTO public.manager_notifications (
      type,
      message,
      related_id,
      target_unit,
      metadata
    ) VALUES (
      'new_compliance_assessment',
      'New application requires compliance officer assignment',
      NEW.id,
      'compliance',
      jsonb_build_object(
        'permit_application_id', NEW.id,
        'status_change', OLD.status || ' -> ' || NEW.status,
        'auto_created', true,
        'created_date', NOW()
      )
    );
    
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_permit_application_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.assessment_status = 'passed' THEN
    UPDATE public.permit_applications 
    SET status = 'approved', updated_at = now()
    WHERE id = NEW.permit_application_id;
  ELSIF NEW.assessment_status = 'failed' THEN
    UPDATE public.permit_applications 
    SET status = 'rejected', updated_at = now()
    WHERE id = NEW.permit_application_id;
  ELSIF NEW.assessment_status = 'requires_clarification' THEN
    UPDATE public.permit_applications 
    SET status = 'requires_clarification', updated_at = now()
    WHERE id = NEW.permit_application_id;
  ELSIF NEW.assessment_status = 'in_progress' THEN
    UPDATE public.permit_applications 
    SET status = 'under_initial_review', updated_at = now()
    WHERE id = NEW.permit_application_id;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_user_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_id_val UUID;
  action_val TEXT;
BEGIN
  user_id_val := auth.uid();
  
  IF (TG_OP = 'DELETE') THEN
    action_val := 'DELETE_' || TG_TABLE_NAME;
    INSERT INTO public.audit_logs (user_id, action, target_type, target_id, details)
    VALUES (user_id_val, action_val, TG_TABLE_NAME, OLD.id::TEXT, row_to_json(OLD));
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    action_val := 'UPDATE_' || TG_TABLE_NAME;
    INSERT INTO public.audit_logs (user_id, action, target_type, target_id, details)
    VALUES (user_id_val, action_val, TG_TABLE_NAME, NEW.id::TEXT, jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW)));
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    action_val := 'CREATE_' || TG_TABLE_NAME;
    INSERT INTO public.audit_logs (user_id, action, target_type, target_id, details)
    VALUES (user_id_val, action_val, TG_TABLE_NAME, NEW.id::TEXT, row_to_json(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.freeze_entity_records(entity_id_param uuid, should_freeze boolean, freeze_reason text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.entities
  SET is_suspended = should_freeze
  WHERE id = entity_id_param;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_database_backup(backup_format text, backup_filename text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  backup_info json;
BEGIN
  backup_info := json_build_object(
    'filename', backup_filename,
    'format', backup_format,
    'timestamp', NOW(),
    'status', 'scheduled',
    'message', 'Backup scheduled - requires external backup tool for execution'
  );
  
  RETURN backup_info;
END;
$$;

CREATE OR REPLACE FUNCTION public.backup_old_audit_logs(days_threshold integer DEFAULT 30)
RETURNS TABLE(backup_count integer, backup_file text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  log_count INTEGER;
  backup_timestamp TEXT;
BEGIN
  SELECT COUNT(*) INTO log_count
  FROM public.audit_logs
  WHERE created_at < NOW() - (days_threshold || ' days')::INTERVAL;
  
  backup_timestamp := to_char(NOW(), 'YYYY-MM-DD_HH24-MI-SS');
  
  RETURN QUERY SELECT log_count, 'audit_logs_backup_' || backup_timestamp || '.json';
END;
$$;

CREATE OR REPLACE FUNCTION public.clear_old_audit_logs(days_threshold integer DEFAULT 30)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  WITH deleted AS (
    DELETE FROM public.audit_logs
    WHERE created_at < NOW() - (days_threshold || ' days')::INTERVAL
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted;
  
  RETURN deleted_count;
END;
$$;