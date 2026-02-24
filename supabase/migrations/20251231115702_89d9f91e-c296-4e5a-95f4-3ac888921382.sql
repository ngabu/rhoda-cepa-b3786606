-- =====================================================
-- PHASE 1: Add indexes on foreign keys for all child tables
-- =====================================================

-- Indexes for child tables (already have unique indexes on permit_application_id via constraints)
CREATE INDEX IF NOT EXISTS idx_permit_water_waste_details_app_id 
ON permit_water_waste_details(permit_application_id);

CREATE INDEX IF NOT EXISTS idx_permit_chemical_details_app_id 
ON permit_chemical_details(permit_application_id);

CREATE INDEX IF NOT EXISTS idx_permit_emission_details_app_id 
ON permit_emission_details(permit_application_id);

CREATE INDEX IF NOT EXISTS idx_permit_environmental_details_app_id 
ON permit_environmental_details(permit_application_id);

CREATE INDEX IF NOT EXISTS idx_permit_industry_details_app_id 
ON permit_industry_details(permit_application_id);

CREATE INDEX IF NOT EXISTS idx_permit_location_details_app_id 
ON permit_location_details(permit_application_id);

CREATE INDEX IF NOT EXISTS idx_permit_consultation_details_app_id 
ON permit_consultation_details(permit_application_id);

CREATE INDEX IF NOT EXISTS idx_permit_fee_details_app_id 
ON permit_fee_details(permit_application_id);

CREATE INDEX IF NOT EXISTS idx_permit_project_details_app_id 
ON permit_project_details(permit_application_id);

CREATE INDEX IF NOT EXISTS idx_permit_classification_details_app_id 
ON permit_classification_details(permit_application_id);

CREATE INDEX IF NOT EXISTS idx_permit_compliance_details_app_id 
ON permit_compliance_details(permit_application_id);

-- Indexes on main permit_applications table
CREATE INDEX IF NOT EXISTS idx_permit_applications_entity_id 
ON permit_applications(entity_id);

CREATE INDEX IF NOT EXISTS idx_permit_applications_user_id 
ON permit_applications(user_id);

CREATE INDEX IF NOT EXISTS idx_permit_applications_status 
ON permit_applications(status);

CREATE INDEX IF NOT EXISTS idx_permit_applications_assigned_officer_id 
ON permit_applications(assigned_officer_id);

CREATE INDEX IF NOT EXISTS idx_permit_applications_assigned_compliance_officer_id 
ON permit_applications(assigned_compliance_officer_id);

-- =====================================================
-- PHASE 2: Create utility views for common JOIN patterns
-- Using first_name || ' ' || last_name for full name
-- =====================================================

-- Comprehensive permit application view with all related data
CREATE OR REPLACE VIEW vw_permit_applications_full AS
SELECT 
  pa.id,
  pa.title,
  pa.permit_type,
  pa.status,
  pa.application_date,
  pa.application_number,
  pa.permit_number,
  pa.approval_date,
  pa.expiry_date,
  pa.user_id,
  pa.entity_id,
  pa.is_draft,
  pa.is_frozen,
  pa.frozen_reason,
  pa.created_at,
  pa.updated_at,
  pa.intent_registration_id,
  pa.existing_permit_id,
  pa.activity_id,
  pa.industrial_sector_id,
  pa.permit_type_id,
  pa.mandatory_fields_complete,
  pa.current_step,
  pa.completed_steps,
  pa.uploaded_files,
  pa.document_uploads,
  pa.assigned_officer_id,
  pa.assigned_compliance_officer_id,
  pa.description,
  pa.administration_form,
  pa.technical_form,
  pa.permit_period,
  pa.activity_location,
  pa.existing_permits_details,
  pa.owner_name,
  -- Entity info from JOIN
  e.name as entity_name,
  e.entity_type,
  e.email as entity_email,
  e.phone as entity_phone,
  e.province as entity_province,
  e.district as entity_district,
  -- Assigned officer info from profiles (use first_name || ' ' || last_name)
  COALESCE(ao.first_name || ' ' || ao.last_name, ao.email) as assigned_officer_name,
  ao.email as assigned_officer_email,
  -- Location details
  loc.province,
  loc.district,
  loc.llg,
  loc.coordinates,
  loc.project_boundary,
  loc.total_area_sqkm,
  loc.project_site_description,
  loc.site_ownership_details,
  loc.land_type,
  loc.tenure,
  loc.legal_description,
  -- Project details
  proj.project_description,
  proj.project_start_date,
  proj.project_end_date,
  proj.commencement_date,
  proj.completion_date,
  proj.estimated_cost_kina,
  proj.operational_details,
  proj.operational_capacity,
  proj.operating_hours,
  proj.environmental_impact,
  proj.mitigation_measures,
  proj.proposed_works_description,
  -- Classification details
  cls.permit_category,
  cls.permit_type_specific,
  cls.activity_classification,
  cls.activity_category,
  cls.activity_subcategory,
  cls.activity_level,
  cls.eia_required,
  cls.eis_required,
  cls.permit_type_specific_data,
  cls.ods_quota_allocation,
  -- Fee details
  fee.application_fee,
  fee.fee_amount,
  fee.fee_breakdown,
  fee.fee_source,
  fee.composite_fee,
  fee.payment_status,
  fee.processing_days,
  -- Consultation details
  con.consultation_period_start,
  con.consultation_period_end,
  con.consulted_departments,
  con.public_consultation_proof,
  con.landowner_negotiation_status,
  con.government_agreements_details,
  con.required_approvals,
  -- Compliance details
  cmp.compliance_checks,
  cmp.compliance_commitment,
  cmp.compliance_commitment_accepted_at,
  cmp.legal_declaration_accepted,
  cmp.legal_declaration_accepted_at
FROM permit_applications pa
LEFT JOIN entities e ON pa.entity_id = e.id
LEFT JOIN profiles ao ON pa.assigned_officer_id = ao.user_id
LEFT JOIN permit_location_details loc ON pa.id = loc.permit_application_id
LEFT JOIN permit_project_details proj ON pa.id = proj.permit_application_id
LEFT JOIN permit_classification_details cls ON pa.id = cls.permit_application_id
LEFT JOIN permit_fee_details fee ON pa.id = fee.permit_application_id
LEFT JOIN permit_consultation_details con ON pa.id = con.permit_application_id
LEFT JOIN permit_compliance_details cmp ON pa.id = cmp.permit_application_id;

-- Lightweight permit list view (for listings and dashboards)
CREATE OR REPLACE VIEW vw_permit_applications_list AS
SELECT 
  pa.id,
  pa.title,
  pa.permit_type,
  pa.status,
  pa.application_date,
  pa.application_number,
  pa.permit_number,
  pa.user_id,
  pa.entity_id,
  pa.is_draft,
  pa.created_at,
  pa.updated_at,
  pa.assigned_officer_id,
  pa.assigned_compliance_officer_id,
  -- Entity info
  e.name as entity_name,
  e.entity_type,
  -- Assigned officer info
  COALESCE(ao.first_name || ' ' || ao.last_name, ao.email) as assigned_officer_name,
  ao.email as assigned_officer_email,
  -- Key classification info
  cls.activity_level,
  cls.activity_classification
FROM permit_applications pa
LEFT JOIN entities e ON pa.entity_id = e.id
LEFT JOIN profiles ao ON pa.assigned_officer_id = ao.user_id
LEFT JOIN permit_classification_details cls ON pa.id = cls.permit_application_id;

-- View for compliance team
CREATE OR REPLACE VIEW vw_permit_applications_compliance AS
SELECT 
  pa.id,
  pa.title,
  pa.permit_type,
  pa.status,
  pa.application_date,
  pa.permit_number,
  pa.user_id,
  pa.entity_id,
  pa.assigned_compliance_officer_id,
  pa.created_at,
  -- Entity info
  e.name as entity_name,
  e.entity_type,
  -- Compliance officer info
  COALESCE(co.first_name || ' ' || co.last_name, co.email) as compliance_officer_name,
  co.email as compliance_officer_email,
  -- Location
  loc.province,
  loc.district,
  -- Classification
  cls.activity_level,
  cls.activity_classification,
  cls.eia_required,
  cls.eis_required,
  -- Compliance details
  cmp.compliance_checks,
  cmp.compliance_commitment,
  cmp.legal_declaration_accepted
FROM permit_applications pa
LEFT JOIN entities e ON pa.entity_id = e.id
LEFT JOIN profiles co ON pa.assigned_compliance_officer_id = co.user_id
LEFT JOIN permit_location_details loc ON pa.id = loc.permit_application_id
LEFT JOIN permit_classification_details cls ON pa.id = cls.permit_application_id
LEFT JOIN permit_compliance_details cmp ON pa.id = cmp.permit_application_id;

-- View for registry team
CREATE OR REPLACE VIEW vw_permit_applications_registry AS
SELECT 
  pa.id,
  pa.title,
  pa.permit_type,
  pa.status,
  pa.application_date,
  pa.application_number,
  pa.permit_number,
  pa.user_id,
  pa.entity_id,
  pa.assigned_officer_id,
  pa.is_draft,
  pa.created_at,
  pa.updated_at,
  -- Entity info
  e.name as entity_name,
  e.entity_type,
  e.registration_number,
  -- Assigned officer info
  COALESCE(ao.first_name || ' ' || ao.last_name, ao.email) as assigned_officer_name,
  ao.email as assigned_officer_email,
  -- Location
  loc.province,
  loc.district,
  loc.llg,
  -- Project
  proj.commencement_date,
  proj.completion_date,
  proj.estimated_cost_kina,
  -- Classification
  cls.activity_level,
  cls.activity_classification,
  cls.permit_category,
  -- Fee
  fee.fee_amount,
  fee.payment_status
FROM permit_applications pa
LEFT JOIN entities e ON pa.entity_id = e.id
LEFT JOIN profiles ao ON pa.assigned_officer_id = ao.user_id
LEFT JOIN permit_location_details loc ON pa.id = loc.permit_application_id
LEFT JOIN permit_project_details proj ON pa.id = proj.permit_application_id
LEFT JOIN permit_classification_details cls ON pa.id = cls.permit_application_id
LEFT JOIN permit_fee_details fee ON pa.id = fee.permit_application_id;

-- =====================================================
-- PHASE 3: Grant SELECT on views to authenticated users
-- =====================================================

GRANT SELECT ON vw_permit_applications_full TO authenticated;
GRANT SELECT ON vw_permit_applications_list TO authenticated;
GRANT SELECT ON vw_permit_applications_compliance TO authenticated;
GRANT SELECT ON vw_permit_applications_registry TO authenticated;

-- =====================================================
-- PHASE 4: Remove duplicate columns from permit_applications
-- These columns are now sourced from JOINs with entities and profiles tables
-- =====================================================

-- Remove entity_name and entity_type (now from entities table via entity_id)
ALTER TABLE permit_applications DROP COLUMN IF EXISTS entity_name;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS entity_type;

-- Remove assigned_officer_name and assigned_officer_email (now from profiles table via assigned_officer_id)
ALTER TABLE permit_applications DROP COLUMN IF EXISTS assigned_officer_name;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS assigned_officer_email;

-- =====================================================
-- PHASE 5: Remove columns that are now in child tables
-- These have been migrated to normalized child tables
-- =====================================================

-- Location columns (now in permit_location_details)
ALTER TABLE permit_applications DROP COLUMN IF EXISTS province;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS district;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS llg;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS coordinates;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS project_boundary;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS total_area_sqkm;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS project_site_description;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS site_ownership_details;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS land_type;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS tenure;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS legal_description;

-- Project columns (now in permit_project_details)
ALTER TABLE permit_applications DROP COLUMN IF EXISTS project_description;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS project_start_date;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS project_end_date;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS commencement_date;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS completion_date;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS estimated_cost_kina;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS operational_details;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS operational_capacity;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS operating_hours;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS environmental_impact;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS mitigation_measures;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS proposed_works_description;

-- Classification columns (now in permit_classification_details)
ALTER TABLE permit_applications DROP COLUMN IF EXISTS permit_category;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS permit_type_specific;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS activity_classification;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS activity_category;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS activity_subcategory;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS activity_level;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS eia_required;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS eis_required;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS permit_type_specific_data;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS ods_quota_allocation;

-- Fee columns (now in permit_fee_details)
ALTER TABLE permit_applications DROP COLUMN IF EXISTS application_fee;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS fee_amount;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS fee_breakdown;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS fee_source;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS composite_fee;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS payment_status;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS processing_days;

-- Consultation columns (now in permit_consultation_details)
ALTER TABLE permit_applications DROP COLUMN IF EXISTS consultation_period_start;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS consultation_period_end;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS consulted_departments;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS public_consultation_proof;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS landowner_negotiation_status;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS government_agreements_details;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS required_approvals;

-- Compliance columns (now in permit_compliance_details)
ALTER TABLE permit_applications DROP COLUMN IF EXISTS compliance_checks;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS compliance_commitment;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS compliance_commitment_accepted_at;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS legal_declaration_accepted;
ALTER TABLE permit_applications DROP COLUMN IF EXISTS legal_declaration_accepted_at;