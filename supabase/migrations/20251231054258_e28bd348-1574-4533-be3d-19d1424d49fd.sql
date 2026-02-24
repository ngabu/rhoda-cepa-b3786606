-- Phase 1: Clean up unused tables and consolidate audit tables

-- Step 1: Migrate any data from audit_log to audit_logs (if columns are compatible)
-- First, let's insert the 38 records from audit_log into audit_logs
INSERT INTO public.audit_logs (
  id,
  action,
  created_at,
  details,
  target_id,
  target_type,
  user_id
)
SELECT 
  id,
  operation as action,
  changed_at as created_at,
  row_data as details,
  NULL as target_id,
  table_name as target_type,
  user_id
FROM public.audit_log
ON CONFLICT (id) DO NOTHING;

-- Step 2: Drop the 4 unused tables (no data, no code usage)
DROP TABLE IF EXISTS public.activity_document_mapping CASCADE;
DROP TABLE IF EXISTS public.unified_notifications CASCADE;
DROP TABLE IF EXISTS public.workflow_fees CASCADE;
DROP TABLE IF EXISTS public.workflow_transitions CASCADE;

-- Step 3: Drop the duplicate audit_log table (data migrated to audit_logs)
DROP TABLE IF EXISTS public.audit_log CASCADE;

-- Step 4: Add index on audit_logs for better query performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs (action);