-- Drop existing triggers first (if they exist) then recreate
DROP TRIGGER IF EXISTS update_activity_document_requirements_updated_at ON activity_document_requirements;
DROP TRIGGER IF EXISTS update_activity_fee_mapping_updated_at ON activity_fee_mapping;
DROP TRIGGER IF EXISTS update_base_document_requirements_updated_at ON base_document_requirements;
DROP TRIGGER IF EXISTS update_gis_data_updated_at ON gis_data;
DROP TRIGGER IF EXISTS update_application_required_docs_updated_at ON application_required_docs;

-- Create updated_at triggers for tables missing them
CREATE TRIGGER update_activity_document_requirements_updated_at
  BEFORE UPDATE ON activity_document_requirements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activity_fee_mapping_updated_at
  BEFORE UPDATE ON activity_fee_mapping
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_base_document_requirements_updated_at
  BEFORE UPDATE ON base_document_requirements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gis_data_updated_at
  BEFORE UPDATE ON gis_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at column to application_required_docs if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'application_required_docs' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE application_required_docs ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;

CREATE TRIGGER update_application_required_docs_updated_at
  BEFORE UPDATE ON application_required_docs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add missing foreign key indexes for query performance
CREATE INDEX IF NOT EXISTS idx_compliance_assessments_permit_application_id 
  ON compliance_assessments(permit_application_id);

CREATE INDEX IF NOT EXISTS idx_fee_payments_permit_application_id 
  ON fee_payments(permit_application_id);

CREATE INDEX IF NOT EXISTS idx_inspections_permit_application_id 
  ON inspections(permit_application_id);

CREATE INDEX IF NOT EXISTS idx_invoices_permit_id 
  ON invoices(permit_id);

CREATE INDEX IF NOT EXISTS idx_permit_amendments_permit_id 
  ON permit_amendments(permit_id);

CREATE INDEX IF NOT EXISTS idx_fee_calculation_audit_permit_application_id 
  ON fee_calculation_audit(permit_application_id);

CREATE INDEX IF NOT EXISTS idx_compliance_reports_permit_id 
  ON compliance_reports(permit_id);

CREATE INDEX IF NOT EXISTS idx_compliance_tasks_related_permit_id 
  ON compliance_tasks(related_permit_id);

-- Add target_uuid column to audit_logs for proper UUID referencing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'audit_logs' AND column_name = 'target_uuid'
  ) THEN
    ALTER TABLE audit_logs ADD COLUMN target_uuid UUID;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_audit_logs_target_uuid ON audit_logs(target_uuid);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Add useful indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_permit_applications_status ON permit_applications(status);
CREATE INDEX IF NOT EXISTS idx_permit_applications_user_id ON permit_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_permit_applications_entity_id ON permit_applications(entity_id);

CREATE INDEX IF NOT EXISTS idx_intent_registrations_status ON intent_registrations(status);
CREATE INDEX IF NOT EXISTS idx_intent_registrations_user_id ON intent_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_intent_registrations_entity_id ON intent_registrations(entity_id);

CREATE INDEX IF NOT EXISTS idx_entities_user_id ON entities(user_id);

CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_staff_unit ON profiles(staff_unit);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Add composite indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_permit_applications_user_status ON permit_applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_intent_registrations_user_status ON intent_registrations(user_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);

-- Set default values for uploaded_at in application_required_docs
ALTER TABLE application_required_docs ALTER COLUMN uploaded_at SET DEFAULT now();

-- Set default for created_at in manager_notifications if not set
ALTER TABLE manager_notifications ALTER COLUMN created_at SET DEFAULT now();