-- Drop and recreate comprehensive view for permit application reviews
DROP VIEW IF EXISTS public.vw_permit_applications_full CASCADE;

CREATE VIEW public.vw_permit_applications_full AS
SELECT 
  -- Main permit application fields
  pa.id,
  pa.application_number,
  pa.title,
  pa.permit_type,
  pa.description,
  pa.status,
  pa.user_id,
  pa.entity_id,
  pa.existing_permit_id,
  pa.activity_location,
  pa.uploaded_files,
  pa.document_uploads,
  pa.is_draft,
  pa.current_step,
  pa.application_date,
  pa.approval_date,
  pa.activity_id,
  pa.permit_type_id,
  pa.mandatory_fields_complete,
  pa.industrial_sector_id,
  pa.intent_registration_id,
  pa.owner_name,
  pa.permit_number,
  pa.permit_period,
  pa.expiry_date,
  pa.created_at,
  pa.updated_at,
  
  -- Entity information
  e.name AS entity_name,
  e.entity_type,
  e.email AS entity_email,
  e.phone AS entity_phone,
  e.contact_person,
  e.contact_person_email,
  e.contact_person_phone,
  e.registered_address,
  e.postal_address,
  e.registration_number,
  e.tax_number,
  
  -- Prescribed Activity information
  pact.category_number AS activity_category_number,
  pact.activity_description AS prescribed_activity_description,
  pact.level AS activity_level_number,
  
  -- Location details
  pld.id AS location_details_id,
  pld.province,
  pld.district,
  pld.llg,
  pld.project_boundary,
  pld.coordinates,
  pld.total_area_sqkm,
  pld.project_site_description,
  pld.site_ownership_details,
  pld.land_type,
  pld.tenure,
  pld.legal_description,
  
  -- Project details
  ppd.id AS project_details_id,
  ppd.project_description,
  ppd.project_start_date,
  ppd.project_end_date,
  ppd.commencement_date,
  ppd.completion_date,
  ppd.estimated_cost_kina,
  ppd.operational_details,
  ppd.operational_capacity,
  ppd.operating_hours,
  ppd.environmental_impact,
  ppd.mitigation_measures,
  ppd.proposed_works_description,
  
  -- Classification details
  pcd.id AS classification_details_id,
  pcd.permit_category,
  pcd.permit_type_specific,
  pcd.activity_classification,
  pcd.activity_category,
  pcd.activity_subcategory,
  pcd.activity_level,
  pcd.eia_required,
  pcd.eis_required,
  pcd.permit_type_specific_data,
  pcd.ods_quota_allocation,
  
  -- Consultation details
  pcond.id AS consultation_details_id,
  pcond.consultation_period_start,
  pcond.consultation_period_end,
  pcond.consulted_departments,
  pcond.public_consultation_proof,
  pcond.landowner_negotiation_status,
  pcond.government_agreements_details,
  pcond.required_approvals,
  
  -- Fee details
  pfd.id AS fee_details_id,
  pfd.application_fee,
  pfd.fee_amount,
  pfd.fee_breakdown,
  pfd.fee_source,
  pfd.composite_fee,
  pfd.payment_status AS fee_payment_status,
  pfd.processing_days,
  
  -- Compliance details
  pcompd.id AS compliance_details_id,
  pcompd.compliance_checks,
  pcompd.compliance_commitment,
  pcompd.compliance_commitment_accepted_at,
  pcompd.legal_declaration_accepted,
  pcompd.legal_declaration_accepted_at,
  
  -- Water & Waste details
  pwwd.id AS water_waste_details_id,
  pwwd.water_extraction_details,
  pwwd.effluent_discharge_details,
  pwwd.solid_waste_details,
  pwwd.hazardous_waste_details,
  pwwd.marine_dumping_details,
  pwwd.stormwater_details,
  pwwd.waste_contaminant_details,
  
  -- Chemical details
  pchd.id AS chemical_details_id,
  pchd.chemical_storage_details,
  pchd.fuel_storage_details,
  pchd.hazardous_material_details,
  pchd.pesticide_details,
  pchd.mining_chemical_details,
  pchd.ods_details,
  
  -- Emission details
  ped.id AS emission_details_id,
  ped.air_emission_details,
  ped.ghg_emission_details,
  ped.noise_emission_details,
  
  -- Environmental details
  penvd.id AS environmental_details_id,
  penvd.biodiversity_abs_details,
  penvd.carbon_offset_details,
  penvd.land_clearing_details,
  penvd.soil_extraction_details,
  penvd.wildlife_trade_details,
  penvd.rehabilitation_details,
  
  -- Industry details
  pind.id AS industry_details_id,
  pind.aquaculture_details,
  pind.mining_permit_details,
  pind.forest_product_details,
  pind.dredging_details,
  pind.infrastructure_details,
  pind.renewable_energy_details,
  pind.research_details,
  pind.monitoring_license_details

FROM public.permit_applications pa
LEFT JOIN public.entities e ON e.id = pa.entity_id
LEFT JOIN public.prescribed_activities pact ON pact.id = pa.activity_id
LEFT JOIN public.permit_location_details pld ON pld.permit_application_id = pa.id
LEFT JOIN public.permit_project_details ppd ON ppd.permit_application_id = pa.id
LEFT JOIN public.permit_classification_details pcd ON pcd.permit_application_id = pa.id
LEFT JOIN public.permit_consultation_details pcond ON pcond.permit_application_id = pa.id
LEFT JOIN public.permit_fee_details pfd ON pfd.permit_application_id = pa.id
LEFT JOIN public.permit_compliance_details pcompd ON pcompd.permit_application_id = pa.id
LEFT JOIN public.permit_water_waste_details pwwd ON pwwd.permit_application_id = pa.id
LEFT JOIN public.permit_chemical_details pchd ON pchd.permit_application_id = pa.id
LEFT JOIN public.permit_emission_details ped ON ped.permit_application_id = pa.id
LEFT JOIN public.permit_environmental_details penvd ON penvd.permit_application_id = pa.id
LEFT JOIN public.permit_industry_details pind ON pind.permit_application_id = pa.id
WHERE pa.deleted_at IS NULL;