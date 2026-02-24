-- =====================================================
-- Fix Remaining Function Search Path Security Issues
-- =====================================================

-- Fix workflow functions
CREATE OR REPLACE FUNCTION public.update_workflow_timestamp()
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

CREATE OR REPLACE FUNCTION public.create_workflow_state(
  p_application_id uuid, 
  p_application_type application_category, 
  p_applicant_id uuid, 
  p_entity_id uuid DEFAULT NULL, 
  p_application_number text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_workflow_id UUID;
BEGIN
  INSERT INTO public.application_workflow_state (
    application_id,
    application_type,
    application_number,
    current_stage,
    applicant_id,
    entity_id,
    assigned_unit,
    priority
  ) VALUES (
    p_application_id,
    p_application_type,
    p_application_number,
    'submitted',
    p_applicant_id,
    p_entity_id,
    'registry',
    'normal'
  )
  RETURNING id INTO v_workflow_id;

  INSERT INTO public.approval_stages (workflow_state_id, stage_name, stage_unit, stage_order, status)
  VALUES (v_workflow_id, 'Registry Initial Review', 'registry', 1, 'in_progress');

  INSERT INTO public.approval_stages (workflow_state_id, stage_name, stage_unit, stage_order, status)
  VALUES (v_workflow_id, 'Compliance Assessment', 'compliance', 2, 'pending');

  INSERT INTO public.approval_stages (workflow_state_id, stage_name, stage_unit, stage_order, status)
  VALUES (v_workflow_id, 'Revenue Review & Invoicing', 'revenue', 3, 'pending');

  INSERT INTO public.approval_stages (workflow_state_id, stage_name, stage_unit, stage_order, status)
  VALUES (v_workflow_id, 'Director Final Approval', 'directorate', 4, 'pending');

  INSERT INTO public.workflow_transitions (
    workflow_state_id, from_stage, to_stage, transition_type, performed_by, auto_transition, notes
  ) VALUES (v_workflow_id, NULL, 'submitted', 'submission', p_applicant_id, TRUE, 'Application submitted');

  INSERT INTO public.unified_notifications (
    recipient_id, recipient_type, title, message, notification_type, 
    workflow_state_id, application_id, application_type, requires_action, priority
  )
  SELECT 
    p.user_id, 'unit_manager', 'New Application Submitted',
    'A new ' || p_application_type || ' application has been submitted and requires assignment.',
    'new_application', v_workflow_id, p_application_id, p_application_type, TRUE, 'normal'
  FROM public.profiles p
  WHERE p.staff_unit = 'registry' AND p.staff_position = 'manager'
  LIMIT 1;

  RETURN v_workflow_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.transition_workflow_stage(
  p_workflow_id uuid, 
  p_to_stage workflow_stage, 
  p_performer_id uuid, 
  p_notes text DEFAULT NULL, 
  p_attachments jsonb DEFAULT '[]'::jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_current_stage workflow_stage;
  v_performer_unit staff_unit;
  v_performer_position staff_position;
  v_applicant_id UUID;
  v_application_id UUID;
  v_application_type application_category;
BEGIN
  SELECT current_stage, applicant_id, application_id, application_type
  INTO v_current_stage, v_applicant_id, v_application_id, v_application_type
  FROM public.application_workflow_state
  WHERE id = p_workflow_id;

  SELECT staff_unit, staff_position
  INTO v_performer_unit, v_performer_position
  FROM public.profiles
  WHERE user_id = p_performer_id;

  UPDATE public.application_workflow_state
  SET previous_stage = v_current_stage, current_stage = p_to_stage, updated_at = now()
  WHERE id = p_workflow_id;

  INSERT INTO public.workflow_transitions (
    workflow_state_id, from_stage, to_stage, transition_type, performed_by, 
    performer_role, performer_position, notes, attachments
  ) VALUES (
    p_workflow_id, v_current_stage, p_to_stage, 'stage_transition', p_performer_id,
    v_performer_unit, v_performer_position, p_notes, p_attachments
  );

  INSERT INTO public.unified_notifications (
    recipient_id, recipient_type, title, message, notification_type,
    workflow_state_id, application_id, application_type
  ) VALUES (
    v_applicant_id, 'user', 'Application Status Updated',
    'Your application has moved to: ' || p_to_stage,
    'application_status', p_workflow_id, v_application_id, v_application_type
  );

  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.lock_workflow(
  p_workflow_id uuid, 
  p_user_id uuid, 
  p_lock boolean, 
  p_reason text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF p_lock THEN
    UPDATE public.application_workflow_state
    SET is_locked = TRUE, locked_by = p_user_id, locked_at = now(), lock_reason = p_reason, updated_at = now()
    WHERE id = p_workflow_id AND (is_locked = FALSE OR locked_by = p_user_id);
  ELSE
    UPDATE public.application_workflow_state
    SET is_locked = FALSE, locked_by = NULL, locked_at = NULL, lock_reason = NULL, updated_at = now()
    WHERE id = p_workflow_id AND locked_by = p_user_id;
  END IF;
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.send_workflow_notification(
  p_recipient_id uuid, 
  p_recipient_type text, 
  p_title text, 
  p_message text, 
  p_notification_type text, 
  p_workflow_id uuid, 
  p_requires_action boolean DEFAULT false, 
  p_priority text DEFAULT 'normal'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_notification_id UUID;
  v_application_id UUID;
  v_application_type application_category;
BEGIN
  SELECT application_id, application_type
  INTO v_application_id, v_application_type
  FROM public.application_workflow_state
  WHERE id = p_workflow_id;

  INSERT INTO public.unified_notifications (
    recipient_id, recipient_type, title, message, notification_type,
    workflow_state_id, application_id, application_type, requires_action, priority
  ) VALUES (
    p_recipient_id, p_recipient_type, p_title, p_message, p_notification_type,
    p_workflow_id, v_application_id, v_application_type, p_requires_action, p_priority
  )
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$;

-- Fix other utility functions
CREATE OR REPLACE FUNCTION public.notify_md_approval_required()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  md_user_id UUID;
  app_title TEXT;
BEGIN
  SELECT user_id INTO md_user_id
  FROM public.profiles
  WHERE staff_position = 'managing_director' OR email = 'admin@cepa.gov.pg'
  LIMIT 1;

  IF md_user_id IS NOT NULL THEN
    SELECT title INTO app_title
    FROM public.permit_applications
    WHERE id = NEW.application_id;

    INSERT INTO public.directorate_notifications (
      user_id, title, message, type, related_approval_id, related_application_id, priority, action_required
    ) VALUES (
      md_user_id,
      'Approval Required: ' || NEW.application_type,
      'Application "' || COALESCE(app_title, 'Untitled') || '" requires your approval and signature.',
      'approval_required', NEW.id, NEW.application_id, NEW.priority, true
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_registry_on_intent_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  entity_name TEXT;
BEGIN
  IF NEW.status = 'pending' THEN
    SELECT name INTO entity_name FROM public.entities WHERE id = NEW.entity_id;

    INSERT INTO public.manager_notifications (
      type, message, related_id, target_unit, is_read, metadata
    ) VALUES (
      'new_intent_submission',
      'New intent registration submitted by ' || COALESCE(entity_name, 'Unknown Entity') || ' for ' || NEW.activity_level,
      NEW.id, 'registry', false,
      jsonb_build_object('entity_name', COALESCE(entity_name, 'Unknown Entity'), 'activity_level', NEW.activity_level, 'submitted_at', NOW(), 'intent_id', NEW.id)
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_submitted_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  assessment_exists BOOLEAN;
BEGIN
  IF NEW.status = 'submitted' AND (OLD.status IS NULL OR OLD.status != 'submitted') THEN
    SELECT EXISTS(SELECT 1 FROM public.initial_assessments WHERE permit_application_id = NEW.id) INTO assessment_exists;
    
    IF NOT assessment_exists THEN
      INSERT INTO public.initial_assessments (
        permit_application_id, assessed_by, assessment_status, assessment_notes, assessment_outcome, permit_activity_type
      ) VALUES (
        NEW.id, '00000000-0000-0000-0000-000000000000', 'pending', 
        'Application submitted - awaiting initial assessment', 'pending_review', 'new_application'
      );
      
      INSERT INTO public.manager_notifications (type, message, related_id, target_unit, metadata) VALUES (
        'new_permit_application',
        'New permit application submitted requiring initial assessment',
        NEW.id, 'registry',
        jsonb_build_object('permit_application_id', NEW.id, 'application_date', NEW.application_date, 'permit_type', NEW.permit_type, 'entity_name', NEW.entity_name)
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_intent_registrations_with_reviewer(requesting_user_id uuid)
RETURNS TABLE(
  id uuid, user_id uuid, entity_id uuid, activity_level text, project_title text,
  activity_description text, preparatory_work_description text, commencement_date date,
  completion_date date, status text, review_notes text, reviewed_by uuid,
  reviewed_at timestamp with time zone, official_feedback_attachments jsonb,
  created_at timestamp with time zone, updated_at timestamp with time zone,
  project_site_address text, project_site_description text, site_ownership_details text,
  government_agreement text, departments_approached text, approvals_required text,
  landowner_negotiation_status text, estimated_cost_kina numeric, prescribed_activity_id uuid,
  existing_permit_id uuid, project_boundary jsonb, district text, province text, llg text,
  total_area_sqkm numeric, signed_document_path text, docusign_envelope_id text,
  reviewer_first_name text, reviewer_last_name text, reviewer_email text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ir.id, ir.user_id, ir.entity_id, ir.activity_level, ir.project_title,
    ir.activity_description, ir.preparatory_work_description, ir.commencement_date,
    ir.completion_date, ir.status, ir.review_notes, ir.reviewed_by, ir.reviewed_at,
    ir.official_feedback_attachments, ir.created_at, ir.updated_at, ir.project_site_address,
    ir.project_site_description, ir.site_ownership_details, ir.government_agreement,
    ir.departments_approached, ir.approvals_required, ir.landowner_negotiation_status,
    ir.estimated_cost_kina, ir.prescribed_activity_id, ir.existing_permit_id, ir.project_boundary,
    ir.district, ir.province, ir.llg, ir.total_area_sqkm, ir.signed_document_path,
    ir.docusign_envelope_id, p.first_name, p.last_name, p.email
  FROM public.intent_registrations ir
  LEFT JOIN public.profiles p ON p.user_id = ir.reviewed_by
  WHERE ir.user_id = requesting_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_table_statistics()
RETURNS TABLE(table_name text, row_count bigint, total_size text, size_bytes bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (c.table_schema || '.' || c.table_name)::text,
    COALESCE(s.n_live_tup, 0)::bigint,
    pg_size_pretty(pg_total_relation_size('"' || c.table_schema || '"."' || c.table_name || '"'))::text,
    pg_total_relation_size('"' || c.table_schema || '"."' || c.table_name || '"')::bigint
  FROM information_schema.tables c
  LEFT JOIN pg_stat_user_tables s ON s.schemaname = c.table_schema AND s.relname = c.table_name
  WHERE c.table_schema = 'public' AND c.table_type = 'BASE TABLE'
  ORDER BY pg_total_relation_size('"' || c.table_schema || '"."' || c.table_name || '"') DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_permit_fee_complete(
  p_activity_type text, p_activity_subcategory text, p_permit_type text, p_activity_level text,
  p_project_cost numeric DEFAULT NULL, p_land_area numeric DEFAULT NULL,
  p_duration_years integer DEFAULT 1, p_ods_details jsonb DEFAULT NULL, p_waste_details jsonb DEFAULT NULL
)
RETURNS TABLE(
  component_id uuid, component_name text, fee_category text, calculation_method text,
  base_amount numeric, calculated_amount numeric, formula_used text, is_mandatory boolean, notes text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_activity_id UUID;
  v_fee_structure RECORD;
BEGIN
  SELECT pa.id INTO v_activity_id
  FROM public.prescribed_activities pa
  WHERE pa.category_type = p_activity_type
    AND pa.sub_category = p_activity_subcategory
    AND pa.level = CASE p_activity_level
                     WHEN 'Level 1' THEN 1 WHEN 'Level 2A' THEN 2 WHEN 'Level 2B' THEN 2 WHEN 'Level 3' THEN 3 ELSE 1
                   END
  LIMIT 1;

  FOR v_fee_structure IN (
    SELECT 
      fs.id, fs.fee_category, fs.annual_recurrent_fee AS base_fee, fs.category_multiplier,
      fs.work_plan_amount, fcm.method_name, fcm.formula, afm.is_default,
      CASE 
        WHEN fs.fee_category = 'Annual' THEN fs.annual_recurrent_fee * p_duration_years
        WHEN fcm.method_name = 'Flat Fee' THEN fs.annual_recurrent_fee
        WHEN fcm.method_name = 'Base+Multiplier' THEN fs.annual_recurrent_fee * fs.category_multiplier
        WHEN fcm.method_name = 'Percentage' AND p_project_cost IS NOT NULL 
          THEN (p_project_cost * fs.annual_recurrent_fee / 100)
        WHEN fcm.method_name = 'Tiered' AND p_land_area IS NOT NULL THEN
          CASE WHEN p_land_area <= 1000 THEN 500 WHEN p_land_area <= 5000 THEN 1500 ELSE 3000 END
        ELSE fs.annual_recurrent_fee
      END AS calculated_fee
    FROM public.activity_fee_mapping afm
    JOIN public.fee_structures fs ON afm.fee_structure_id = fs.id
    JOIN public.fee_calculation_methods fcm ON fs.calculation_method_id = fcm.id
    WHERE afm.activity_id = v_activity_id AND fs.permit_type = p_permit_type AND fs.is_active = true
    ORDER BY afm.is_default DESC
  ) LOOP
    component_id := v_fee_structure.id;
    component_name := v_fee_structure.fee_category || ' Fee';
    fee_category := v_fee_structure.fee_category;
    calculation_method := v_fee_structure.method_name;
    base_amount := v_fee_structure.base_fee;
    calculated_amount := v_fee_structure.calculated_fee;
    formula_used := v_fee_structure.formula;
    is_mandatory := true;
    notes := CASE WHEN v_fee_structure.fee_category = 'Annual' 
                  THEN p_duration_years || ' year(s) @ ' || v_fee_structure.base_fee || ' per year' ELSE NULL END;
    RETURN NEXT;
  END LOOP;
END;
$$;

-- Fix trigger function
CREATE OR REPLACE FUNCTION public.trigger_application_docs()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN NEW;
END;
$$;