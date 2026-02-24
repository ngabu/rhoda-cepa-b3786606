
-- =====================================================
-- PRODUCTION READINESS MIGRATION - PHASE 1
-- Foreign Keys, Indexes, and Status Constraints
-- =====================================================

-- =====================================================
-- 1. CREATE ENUM TYPES FOR STATUS COLUMNS
-- =====================================================

-- General application/workflow status
CREATE TYPE application_status AS ENUM (
  'draft',
  'pending',
  'submitted',
  'under_review',
  'under_assessment',
  'awaiting_payment',
  'in_progress',
  'approved',
  'rejected',
  'cancelled',
  'revoked',
  'expired',
  'completed',
  'suspended'
);

-- Payment status enum
CREATE TYPE payment_status_enum AS ENUM (
  'pending',
  'partially_paid',
  'paid',
  'waived',
  'overdue',
  'refunded',
  'cancelled'
);

-- Assessment status enum
CREATE TYPE assessment_status_enum AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'requires_revision'
);

-- Task status enum
CREATE TYPE task_status_enum AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'cancelled',
  'overdue'
);

-- Inspection status enum  
CREATE TYPE inspection_status_enum AS ENUM (
  'scheduled',
  'in_progress',
  'completed',
  'cancelled',
  'postponed'
);

-- Approval status enum
CREATE TYPE approval_status_enum AS ENUM (
  'pending',
  'approved',
  'rejected',
  'requires_revision'
);

-- =====================================================
-- 2. ADD MISSING INDEXES ON FK COLUMNS
-- =====================================================

-- activity_document_requirements
CREATE INDEX IF NOT EXISTS idx_activity_doc_req_prescribed_activity 
  ON activity_document_requirements(prescribed_activity_id);

-- intent_registration_drafts  
CREATE INDEX IF NOT EXISTS idx_intent_drafts_entity 
  ON intent_registration_drafts(entity_id);

-- intent_registrations
CREATE INDEX IF NOT EXISTS idx_intent_reg_compliance_officer 
  ON intent_registrations(compliance_officer_id);
CREATE INDEX IF NOT EXISTS idx_intent_reg_registry_officer 
  ON intent_registrations(registry_officer_id);

-- compliance_tasks
CREATE INDEX IF NOT EXISTS idx_compliance_tasks_inspection 
  ON compliance_tasks(related_inspection_id);

-- directorate_notifications
CREATE INDEX IF NOT EXISTS idx_directorate_notif_application 
  ON directorate_notifications(related_application_id);
CREATE INDEX IF NOT EXISTS idx_directorate_notif_approval 
  ON directorate_notifications(related_approval_id);

-- directorate_approvals
CREATE INDEX IF NOT EXISTS idx_directorate_approvals_intent 
  ON directorate_approvals(intent_registration_id);

-- fee_structures
CREATE INDEX IF NOT EXISTS idx_fee_structures_calc_method 
  ON fee_structures(calculation_method_id);

-- permit_applications - ensure all FK columns indexed
CREATE INDEX IF NOT EXISTS idx_permit_apps_activity 
  ON permit_applications(activity_id);
CREATE INDEX IF NOT EXISTS idx_permit_apps_industrial_sector 
  ON permit_applications(industrial_sector_id);
CREATE INDEX IF NOT EXISTS idx_permit_apps_permit_type 
  ON permit_applications(permit_type_id);
CREATE INDEX IF NOT EXISTS idx_permit_apps_assigned_officer 
  ON permit_applications(assigned_officer_id);
CREATE INDEX IF NOT EXISTS idx_permit_apps_compliance_officer 
  ON permit_applications(assigned_compliance_officer_id);

-- invoices
CREATE INDEX IF NOT EXISTS idx_invoices_inspection 
  ON invoices(inspection_id);
CREATE INDEX IF NOT EXISTS idx_invoices_assigned_officer 
  ON invoices(assigned_officer_id);

-- =====================================================
-- 3. ADD FOREIGN KEY CONSTRAINTS (with safe options)
-- =====================================================

-- Note: Using ON DELETE SET NULL for optional references
-- and ON DELETE CASCADE for required child records

-- permit_applications -> entities (SET NULL - entity can be deleted)
DO $$ BEGIN
  ALTER TABLE permit_applications 
    ADD CONSTRAINT fk_permit_apps_entity 
    FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- permit_applications -> prescribed_activities
DO $$ BEGIN
  ALTER TABLE permit_applications 
    ADD CONSTRAINT fk_permit_apps_activity 
    FOREIGN KEY (activity_id) REFERENCES prescribed_activities(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- permit_applications -> industrial_sectors
DO $$ BEGIN
  ALTER TABLE permit_applications 
    ADD CONSTRAINT fk_permit_apps_industrial_sector 
    FOREIGN KEY (industrial_sector_id) REFERENCES industrial_sectors(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- permit_applications -> permit_types
DO $$ BEGIN
  ALTER TABLE permit_applications 
    ADD CONSTRAINT fk_permit_apps_permit_type 
    FOREIGN KEY (permit_type_id) REFERENCES permit_types(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- permit_applications -> intent_registrations
DO $$ BEGIN
  ALTER TABLE permit_applications 
    ADD CONSTRAINT fk_permit_apps_intent_reg 
    FOREIGN KEY (intent_registration_id) REFERENCES intent_registrations(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Child tables of permit_applications -> CASCADE delete
DO $$ BEGIN
  ALTER TABLE permit_location_details 
    ADD CONSTRAINT fk_permit_location_app 
    FOREIGN KEY (permit_application_id) REFERENCES permit_applications(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE permit_consultation_details 
    ADD CONSTRAINT fk_permit_consultation_app 
    FOREIGN KEY (permit_application_id) REFERENCES permit_applications(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE permit_fee_details 
    ADD CONSTRAINT fk_permit_fee_app 
    FOREIGN KEY (permit_application_id) REFERENCES permit_applications(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE permit_project_details 
    ADD CONSTRAINT fk_permit_project_app 
    FOREIGN KEY (permit_application_id) REFERENCES permit_applications(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE permit_classification_details 
    ADD CONSTRAINT fk_permit_classification_app 
    FOREIGN KEY (permit_application_id) REFERENCES permit_applications(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE permit_compliance_details 
    ADD CONSTRAINT fk_permit_compliance_app 
    FOREIGN KEY (permit_application_id) REFERENCES permit_applications(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Other child tables with CASCADE
DO $$ BEGIN
  ALTER TABLE permit_environmental_details 
    ADD CONSTRAINT fk_permit_env_app 
    FOREIGN KEY (permit_application_id) REFERENCES permit_applications(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE permit_chemical_details 
    ADD CONSTRAINT fk_permit_chem_app 
    FOREIGN KEY (permit_application_id) REFERENCES permit_applications(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE permit_emission_details 
    ADD CONSTRAINT fk_permit_emission_app 
    FOREIGN KEY (permit_application_id) REFERENCES permit_applications(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE permit_water_waste_details 
    ADD CONSTRAINT fk_permit_water_app 
    FOREIGN KEY (permit_application_id) REFERENCES permit_applications(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE permit_industry_details 
    ADD CONSTRAINT fk_permit_industry_app 
    FOREIGN KEY (permit_application_id) REFERENCES permit_applications(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- invoices -> entities
DO $$ BEGIN
  ALTER TABLE invoices 
    ADD CONSTRAINT fk_invoices_entity 
    FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- invoices -> permit_applications
DO $$ BEGIN
  ALTER TABLE invoices 
    ADD CONSTRAINT fk_invoices_permit 
    FOREIGN KEY (permit_id) REFERENCES permit_applications(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- invoices -> intent_registrations
DO $$ BEGIN
  ALTER TABLE invoices 
    ADD CONSTRAINT fk_invoices_intent 
    FOREIGN KEY (intent_registration_id) REFERENCES intent_registrations(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- invoices -> inspections
DO $$ BEGIN
  ALTER TABLE invoices 
    ADD CONSTRAINT fk_invoices_inspection 
    FOREIGN KEY (inspection_id) REFERENCES inspections(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- invoices -> prescribed_activities
DO $$ BEGIN
  ALTER TABLE invoices 
    ADD CONSTRAINT fk_invoices_activity 
    FOREIGN KEY (activity_id) REFERENCES prescribed_activities(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- intent_registrations -> entities
DO $$ BEGIN
  ALTER TABLE intent_registrations 
    ADD CONSTRAINT fk_intent_reg_entity 
    FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE RESTRICT;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- intent_registration_drafts -> entities
DO $$ BEGIN
  ALTER TABLE intent_registration_drafts 
    ADD CONSTRAINT fk_intent_drafts_entity 
    FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- documents -> entities
DO $$ BEGIN
  ALTER TABLE documents 
    ADD CONSTRAINT fk_documents_entity 
    FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- compliance_tasks -> inspections
DO $$ BEGIN
  ALTER TABLE compliance_tasks 
    ADD CONSTRAINT fk_compliance_tasks_inspection 
    FOREIGN KEY (related_inspection_id) REFERENCES inspections(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- financial_transactions -> entities
DO $$ BEGIN
  ALTER TABLE financial_transactions 
    ADD CONSTRAINT fk_fin_trans_application 
    FOREIGN KEY (application_id) REFERENCES permit_applications(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- 4. ADD COMPOSITE INDEXES FOR COMMON QUERIES
-- =====================================================

-- Permit applications by status and user
CREATE INDEX IF NOT EXISTS idx_permit_apps_user_status 
  ON permit_applications(user_id, status);

-- Permit applications by entity and status
CREATE INDEX IF NOT EXISTS idx_permit_apps_entity_status 
  ON permit_applications(entity_id, status);

-- Intent registrations by user and status
CREATE INDEX IF NOT EXISTS idx_intent_reg_user_status 
  ON intent_registrations(user_id, status);

-- Invoices by status and due date
CREATE INDEX IF NOT EXISTS idx_invoices_status_due 
  ON invoices(status, due_date);

-- Fee payments by permit and status
CREATE INDEX IF NOT EXISTS idx_fee_payments_permit_status 
  ON fee_payments(permit_application_id, payment_status);

-- Compliance assessments by status
CREATE INDEX IF NOT EXISTS idx_compliance_assess_status 
  ON compliance_assessments(assessment_status);

-- Inspections by status and date
CREATE INDEX IF NOT EXISTS idx_inspections_status_date 
  ON inspections(status, scheduled_date);

-- =====================================================
-- 5. ADD UPDATED_AT TRIGGER TO TABLES MISSING IT
-- =====================================================

-- Ensure the trigger function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to tables that have updated_at but may lack triggers
DO $$ 
DECLARE
  tbl TEXT;
  trigger_exists BOOLEAN;
BEGIN
  FOR tbl IN 
    SELECT table_name FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND column_name = 'updated_at'
    AND table_name NOT LIKE 'vw_%'
    AND table_name NOT LIKE 'active_%'
  LOOP
    SELECT EXISTS (
      SELECT 1 FROM pg_trigger 
      WHERE tgname = 'update_' || tbl || '_updated_at'
    ) INTO trigger_exists;
    
    IF NOT trigger_exists THEN
      EXECUTE format('
        CREATE TRIGGER update_%I_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()', tbl, tbl);
    END IF;
  END LOOP;
END $$;
