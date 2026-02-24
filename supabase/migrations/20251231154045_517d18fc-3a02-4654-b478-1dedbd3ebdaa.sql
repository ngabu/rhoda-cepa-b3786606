-- Add updated_at triggers to all tables (drop first if exists for idempotency)

-- Activity & Fee tables
DROP TRIGGER IF EXISTS update_activity_document_requirements_updated_at ON public.activity_document_requirements;
CREATE TRIGGER update_activity_document_requirements_updated_at
  BEFORE UPDATE ON public.activity_document_requirements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_activity_fee_mapping_updated_at ON public.activity_fee_mapping;
CREATE TRIGGER update_activity_fee_mapping_updated_at
  BEFORE UPDATE ON public.activity_fee_mapping
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Workflow & Approval tables
DROP TRIGGER IF EXISTS update_application_workflow_state_updated_at ON public.application_workflow_state;
CREATE TRIGGER update_application_workflow_state_updated_at
  BEFORE UPDATE ON public.application_workflow_state
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_approval_stages_updated_at ON public.approval_stages;
CREATE TRIGGER update_approval_stages_updated_at
  BEFORE UPDATE ON public.approval_stages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_director_approvals_updated_at ON public.director_approvals;
CREATE TRIGGER update_director_approvals_updated_at
  BEFORE UPDATE ON public.director_approvals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_directorate_approvals_updated_at ON public.directorate_approvals;
CREATE TRIGGER update_directorate_approvals_updated_at
  BEFORE UPDATE ON public.directorate_approvals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Compliance tables
DROP TRIGGER IF EXISTS update_compliance_assessments_updated_at ON public.compliance_assessments;
CREATE TRIGGER update_compliance_assessments_updated_at
  BEFORE UPDATE ON public.compliance_assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_compliance_reports_updated_at ON public.compliance_reports;
CREATE TRIGGER update_compliance_reports_updated_at
  BEFORE UPDATE ON public.compliance_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_compliance_tasks_updated_at ON public.compliance_tasks;
CREATE TRIGGER update_compliance_tasks_updated_at
  BEFORE UPDATE ON public.compliance_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Document & Template tables
DROP TRIGGER IF EXISTS update_document_templates_updated_at ON public.document_templates;
CREATE TRIGGER update_document_templates_updated_at
  BEFORE UPDATE ON public.document_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Entity tables
DROP TRIGGER IF EXISTS update_entities_updated_at ON public.entities;
CREATE TRIGGER update_entities_updated_at
  BEFORE UPDATE ON public.entities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Fee tables
DROP TRIGGER IF EXISTS update_fee_calculation_methods_updated_at ON public.fee_calculation_methods;
CREATE TRIGGER update_fee_calculation_methods_updated_at
  BEFORE UPDATE ON public.fee_calculation_methods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_fee_payments_updated_at ON public.fee_payments;
CREATE TRIGGER update_fee_payments_updated_at
  BEFORE UPDATE ON public.fee_payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_fee_structures_updated_at ON public.fee_structures;
CREATE TRIGGER update_fee_structures_updated_at
  BEFORE UPDATE ON public.fee_structures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Financial tables
DROP TRIGGER IF EXISTS update_financial_transactions_updated_at ON public.financial_transactions;
CREATE TRIGGER update_financial_transactions_updated_at
  BEFORE UPDATE ON public.financial_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- GIS & Reference tables
DROP TRIGGER IF EXISTS update_gis_data_updated_at ON public.gis_data;
CREATE TRIGGER update_gis_data_updated_at
  BEFORE UPDATE ON public.gis_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_industrial_sectors_updated_at ON public.industrial_sectors;
CREATE TRIGGER update_industrial_sectors_updated_at
  BEFORE UPDATE ON public.industrial_sectors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inspection tables
DROP TRIGGER IF EXISTS update_inspections_updated_at ON public.inspections;
CREATE TRIGGER update_inspections_updated_at
  BEFORE UPDATE ON public.inspections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Intent Registration tables
DROP TRIGGER IF EXISTS update_intent_registration_drafts_updated_at ON public.intent_registration_drafts;
CREATE TRIGGER update_intent_registration_drafts_updated_at
  BEFORE UPDATE ON public.intent_registration_drafts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_intent_registrations_updated_at ON public.intent_registrations;
CREATE TRIGGER update_intent_registrations_updated_at
  BEFORE UPDATE ON public.intent_registrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Invoice tables
DROP TRIGGER IF EXISTS update_invoices_updated_at ON public.invoices;
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Permit Activity tables
DROP TRIGGER IF EXISTS update_permit_activities_updated_at ON public.permit_activities;
CREATE TRIGGER update_permit_activities_updated_at
  BEFORE UPDATE ON public.permit_activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Permit Lifecycle tables
DROP TRIGGER IF EXISTS update_permit_amalgamations_updated_at ON public.permit_amalgamations;
CREATE TRIGGER update_permit_amalgamations_updated_at
  BEFORE UPDATE ON public.permit_amalgamations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_permit_amendments_updated_at ON public.permit_amendments;
CREATE TRIGGER update_permit_amendments_updated_at
  BEFORE UPDATE ON public.permit_amendments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_permit_applications_updated_at ON public.permit_applications;
CREATE TRIGGER update_permit_applications_updated_at
  BEFORE UPDATE ON public.permit_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_permit_renewals_updated_at ON public.permit_renewals;
CREATE TRIGGER update_permit_renewals_updated_at
  BEFORE UPDATE ON public.permit_renewals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_permit_surrenders_updated_at ON public.permit_surrenders;
CREATE TRIGGER update_permit_surrenders_updated_at
  BEFORE UPDATE ON public.permit_surrenders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_permit_transfers_updated_at ON public.permit_transfers;
CREATE TRIGGER update_permit_transfers_updated_at
  BEFORE UPDATE ON public.permit_transfers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Permit Detail tables (11 child tables)
DROP TRIGGER IF EXISTS update_permit_chemical_details_updated_at ON public.permit_chemical_details;
CREATE TRIGGER update_permit_chemical_details_updated_at
  BEFORE UPDATE ON public.permit_chemical_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_permit_classification_details_updated_at ON public.permit_classification_details;
CREATE TRIGGER update_permit_classification_details_updated_at
  BEFORE UPDATE ON public.permit_classification_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_permit_compliance_details_updated_at ON public.permit_compliance_details;
CREATE TRIGGER update_permit_compliance_details_updated_at
  BEFORE UPDATE ON public.permit_compliance_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_permit_consultation_details_updated_at ON public.permit_consultation_details;
CREATE TRIGGER update_permit_consultation_details_updated_at
  BEFORE UPDATE ON public.permit_consultation_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_permit_emission_details_updated_at ON public.permit_emission_details;
CREATE TRIGGER update_permit_emission_details_updated_at
  BEFORE UPDATE ON public.permit_emission_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_permit_environmental_details_updated_at ON public.permit_environmental_details;
CREATE TRIGGER update_permit_environmental_details_updated_at
  BEFORE UPDATE ON public.permit_environmental_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_permit_fee_details_updated_at ON public.permit_fee_details;
CREATE TRIGGER update_permit_fee_details_updated_at
  BEFORE UPDATE ON public.permit_fee_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_permit_industry_details_updated_at ON public.permit_industry_details;
CREATE TRIGGER update_permit_industry_details_updated_at
  BEFORE UPDATE ON public.permit_industry_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_permit_location_details_updated_at ON public.permit_location_details;
CREATE TRIGGER update_permit_location_details_updated_at
  BEFORE UPDATE ON public.permit_location_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_permit_project_details_updated_at ON public.permit_project_details;
CREATE TRIGGER update_permit_project_details_updated_at
  BEFORE UPDATE ON public.permit_project_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_permit_water_waste_details_updated_at ON public.permit_water_waste_details;
CREATE TRIGGER update_permit_water_waste_details_updated_at
  BEFORE UPDATE ON public.permit_water_waste_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Permit Type tables
DROP TRIGGER IF EXISTS update_permit_type_fields_updated_at ON public.permit_type_fields;
CREATE TRIGGER update_permit_type_fields_updated_at
  BEFORE UPDATE ON public.permit_type_fields
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_permit_types_updated_at ON public.permit_types;
CREATE TRIGGER update_permit_types_updated_at
  BEFORE UPDATE ON public.permit_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Profile tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();