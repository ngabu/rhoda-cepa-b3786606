// Service for managing permit details in child tables
// Replaces direct JSONB column access on permit_applications

import { supabase } from '@/integrations/supabase/client';
import {
  PermitWaterWasteDetails,
  PermitChemicalDetails,
  PermitEmissionDetails,
  PermitEnvironmentalDetails,
  PermitIndustryDetails,
  PermitLocationDetails,
  PermitConsultationDetails,
  PermitFeeDetails,
  PermitProjectDetails,
  PermitClassificationDetails,
  PermitComplianceDetails,
  PermitAllDetails,
  PermitDetailsFlatteneed,
  WaterWasteDetailsInput,
  ChemicalDetailsInput,
  EmissionDetailsInput,
  EnvironmentalDetailsInput,
  IndustryDetailsInput,
  LocationDetailsInput,
  ConsultationDetailsInput,
  FeeDetailsInput,
  ProjectDetailsInput,
  ClassificationDetailsInput,
  ComplianceDetailsInput,
} from './types';

// ============================================
// FETCH OPERATIONS - Read from child tables
// ============================================

/**
 * Fetch all details for a permit application from all child tables
 */
export async function fetchPermitAllDetails(permitApplicationId: string): Promise<PermitAllDetails> {
  const [
    waterWaste, chemical, emission, environmental, industry,
    location, consultation, fee, project, classification, compliance
  ] = await Promise.all([
    fetchWaterWasteDetails(permitApplicationId),
    fetchChemicalDetails(permitApplicationId),
    fetchEmissionDetails(permitApplicationId),
    fetchEnvironmentalDetails(permitApplicationId),
    fetchIndustryDetails(permitApplicationId),
    fetchLocationDetails(permitApplicationId),
    fetchConsultationDetails(permitApplicationId),
    fetchFeeDetails(permitApplicationId),
    fetchProjectDetails(permitApplicationId),
    fetchClassificationDetails(permitApplicationId),
    fetchComplianceDetails(permitApplicationId),
  ]);

  return { 
    waterWaste, chemical, emission, environmental, industry,
    location, consultation, fee, project, classification, compliance
  };
}

/**
 * Fetch all details and flatten them for backward compatibility with existing UI
 */
export async function fetchPermitDetailsFlatteneed(permitApplicationId: string): Promise<PermitDetailsFlatteneed> {
  const allDetails = await fetchPermitAllDetails(permitApplicationId);
  
  return {
    // Water & Waste
    water_extraction_details: allDetails.waterWaste?.water_extraction_details,
    effluent_discharge_details: allDetails.waterWaste?.effluent_discharge_details,
    solid_waste_details: allDetails.waterWaste?.solid_waste_details,
    hazardous_waste_details: allDetails.waterWaste?.hazardous_waste_details,
    marine_dumping_details: allDetails.waterWaste?.marine_dumping_details,
    stormwater_details: allDetails.waterWaste?.stormwater_details,
    waste_contaminant_details: allDetails.waterWaste?.waste_contaminant_details,
    
    // Chemical
    chemical_storage_details: allDetails.chemical?.chemical_storage_details,
    fuel_storage_details: allDetails.chemical?.fuel_storage_details,
    hazardous_material_details: allDetails.chemical?.hazardous_material_details,
    pesticide_details: allDetails.chemical?.pesticide_details,
    mining_chemical_details: allDetails.chemical?.mining_chemical_details,
    ods_details: allDetails.chemical?.ods_details,
    
    // Emission
    air_emission_details: allDetails.emission?.air_emission_details,
    ghg_emission_details: allDetails.emission?.ghg_emission_details,
    noise_emission_details: allDetails.emission?.noise_emission_details,
    
    // Environmental (domain)
    biodiversity_abs_details: allDetails.environmental?.biodiversity_abs_details,
    carbon_offset_details: allDetails.environmental?.carbon_offset_details,
    land_clearing_details: allDetails.environmental?.land_clearing_details,
    soil_extraction_details: allDetails.environmental?.soil_extraction_details,
    wildlife_trade_details: allDetails.environmental?.wildlife_trade_details,
    rehabilitation_details: allDetails.environmental?.rehabilitation_details,
    
    // Industry
    aquaculture_details: allDetails.industry?.aquaculture_details,
    mining_permit_details: allDetails.industry?.mining_permit_details,
    forest_product_details: allDetails.industry?.forest_product_details,
    dredging_details: allDetails.industry?.dredging_details,
    infrastructure_details: allDetails.industry?.infrastructure_details,
    renewable_energy_details: allDetails.industry?.renewable_energy_details,
    research_details: allDetails.industry?.research_details,
    monitoring_license_details: allDetails.industry?.monitoring_license_details,

    // Location
    province: allDetails.location?.province ?? undefined,
    district: allDetails.location?.district ?? undefined,
    llg: allDetails.location?.llg ?? undefined,
    project_boundary: allDetails.location?.project_boundary,
    coordinates: allDetails.location?.coordinates,
    total_area_sqkm: allDetails.location?.total_area_sqkm ?? undefined,
    project_site_description: allDetails.location?.project_site_description ?? undefined,
    site_ownership_details: allDetails.location?.site_ownership_details ?? undefined,
    land_type: allDetails.location?.land_type ?? undefined,
    tenure: allDetails.location?.tenure ?? undefined,
    legal_description: allDetails.location?.legal_description ?? undefined,

    // Consultation
    consultation_period_start: allDetails.consultation?.consultation_period_start ?? undefined,
    consultation_period_end: allDetails.consultation?.consultation_period_end ?? undefined,
    consulted_departments: allDetails.consultation?.consulted_departments ?? undefined,
    public_consultation_proof: allDetails.consultation?.public_consultation_proof,
    landowner_negotiation_status: allDetails.consultation?.landowner_negotiation_status ?? undefined,
    government_agreements_details: allDetails.consultation?.government_agreements_details ?? undefined,
    required_approvals: allDetails.consultation?.required_approvals ?? undefined,

    // Fee
    application_fee: allDetails.fee?.application_fee ?? undefined,
    fee_amount: allDetails.fee?.fee_amount ?? undefined,
    fee_breakdown: allDetails.fee?.fee_breakdown,
    fee_source: allDetails.fee?.fee_source ?? undefined,
    composite_fee: allDetails.fee?.composite_fee ?? undefined,
    payment_status: allDetails.fee?.payment_status ?? undefined,
    processing_days: allDetails.fee?.processing_days ?? undefined,

    // Project
    project_description: allDetails.project?.project_description ?? undefined,
    project_start_date: allDetails.project?.project_start_date ?? undefined,
    project_end_date: allDetails.project?.project_end_date ?? undefined,
    commencement_date: allDetails.project?.commencement_date ?? undefined,
    completion_date: allDetails.project?.completion_date ?? undefined,
    estimated_cost_kina: allDetails.project?.estimated_cost_kina ?? undefined,
    operational_details: allDetails.project?.operational_details ?? undefined,
    operational_capacity: allDetails.project?.operational_capacity ?? undefined,
    operating_hours: allDetails.project?.operating_hours ?? undefined,
    environmental_impact: allDetails.project?.environmental_impact ?? undefined,
    mitigation_measures: allDetails.project?.mitigation_measures ?? undefined,
    proposed_works_description: allDetails.project?.proposed_works_description ?? undefined,

    // Classification
    permit_category: allDetails.classification?.permit_category ?? undefined,
    permit_type_specific: allDetails.classification?.permit_type_specific ?? undefined,
    activity_classification: allDetails.classification?.activity_classification ?? undefined,
    activity_category: allDetails.classification?.activity_category ?? undefined,
    activity_subcategory: allDetails.classification?.activity_subcategory ?? undefined,
    activity_level: allDetails.classification?.activity_level ?? undefined,
    eia_required: allDetails.classification?.eia_required ?? undefined,
    eis_required: allDetails.classification?.eis_required ?? undefined,
    permit_type_specific_data: allDetails.classification?.permit_type_specific_data,
    ods_quota_allocation: allDetails.classification?.ods_quota_allocation ?? undefined,

    // Compliance
    compliance_checks: allDetails.compliance?.compliance_checks,
    compliance_commitment: allDetails.compliance?.compliance_commitment ?? undefined,
    compliance_commitment_accepted_at: allDetails.compliance?.compliance_commitment_accepted_at ?? undefined,
    legal_declaration_accepted: allDetails.compliance?.legal_declaration_accepted ?? undefined,
    legal_declaration_accepted_at: allDetails.compliance?.legal_declaration_accepted_at ?? undefined,
  };
}

// ===== DOMAIN-SPECIFIC FETCH FUNCTIONS =====

export async function fetchWaterWasteDetails(permitApplicationId: string): Promise<PermitWaterWasteDetails | null> {
  const { data, error } = await supabase
    .from('permit_water_waste_details')
    .select('*')
    .eq('permit_application_id', permitApplicationId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching water waste details:', error);
    return null;
  }
  return data;
}

export async function fetchChemicalDetails(permitApplicationId: string): Promise<PermitChemicalDetails | null> {
  const { data, error } = await supabase
    .from('permit_chemical_details')
    .select('*')
    .eq('permit_application_id', permitApplicationId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching chemical details:', error);
    return null;
  }
  return data;
}

export async function fetchEmissionDetails(permitApplicationId: string): Promise<PermitEmissionDetails | null> {
  const { data, error } = await supabase
    .from('permit_emission_details')
    .select('*')
    .eq('permit_application_id', permitApplicationId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching emission details:', error);
    return null;
  }
  return data;
}

export async function fetchEnvironmentalDetails(permitApplicationId: string): Promise<PermitEnvironmentalDetails | null> {
  const { data, error } = await supabase
    .from('permit_environmental_details')
    .select('*')
    .eq('permit_application_id', permitApplicationId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching environmental details:', error);
    return null;
  }
  return data;
}

export async function fetchIndustryDetails(permitApplicationId: string): Promise<PermitIndustryDetails | null> {
  const { data, error } = await supabase
    .from('permit_industry_details')
    .select('*')
    .eq('permit_application_id', permitApplicationId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching industry details:', error);
    return null;
  }
  return data;
}

// ===== NEW NORMALIZED FETCH FUNCTIONS =====

export async function fetchLocationDetails(permitApplicationId: string): Promise<PermitLocationDetails | null> {
  const { data, error } = await supabase
    .from('permit_location_details')
    .select('*')
    .eq('permit_application_id', permitApplicationId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching location details:', error);
    return null;
  }
  return data as PermitLocationDetails | null;
}

export async function fetchConsultationDetails(permitApplicationId: string): Promise<PermitConsultationDetails | null> {
  const { data, error } = await supabase
    .from('permit_consultation_details')
    .select('*')
    .eq('permit_application_id', permitApplicationId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching consultation details:', error);
    return null;
  }
  return data as PermitConsultationDetails | null;
}

export async function fetchFeeDetails(permitApplicationId: string): Promise<PermitFeeDetails | null> {
  const { data, error } = await supabase
    .from('permit_fee_details')
    .select('*')
    .eq('permit_application_id', permitApplicationId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching fee details:', error);
    return null;
  }
  return data as PermitFeeDetails | null;
}

export async function fetchProjectDetails(permitApplicationId: string): Promise<PermitProjectDetails | null> {
  const { data, error } = await supabase
    .from('permit_project_details')
    .select('*')
    .eq('permit_application_id', permitApplicationId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching project details:', error);
    return null;
  }
  return data as PermitProjectDetails | null;
}

export async function fetchClassificationDetails(permitApplicationId: string): Promise<PermitClassificationDetails | null> {
  const { data, error } = await supabase
    .from('permit_classification_details')
    .select('*')
    .eq('permit_application_id', permitApplicationId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching classification details:', error);
    return null;
  }
  return data as PermitClassificationDetails | null;
}

export async function fetchComplianceDetails(permitApplicationId: string): Promise<PermitComplianceDetails | null> {
  const { data, error } = await supabase
    .from('permit_compliance_details')
    .select('*')
    .eq('permit_application_id', permitApplicationId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching compliance details:', error);
    return null;
  }
  return data as PermitComplianceDetails | null;
}

// ============================================
// UPSERT OPERATIONS - Create or Update
// ============================================

// ===== DOMAIN-SPECIFIC UPSERT FUNCTIONS =====

export async function upsertWaterWasteDetails(
  input: Partial<WaterWasteDetailsInput> & { permit_application_id: string }
): Promise<PermitWaterWasteDetails | null> {
  const { data, error } = await supabase
    .from('permit_water_waste_details')
    .upsert(input, { onConflict: 'permit_application_id' })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting water waste details:', error);
    throw error;
  }
  return data;
}

export async function upsertChemicalDetails(
  input: Partial<ChemicalDetailsInput> & { permit_application_id: string }
): Promise<PermitChemicalDetails | null> {
  const { data, error } = await supabase
    .from('permit_chemical_details')
    .upsert(input, { onConflict: 'permit_application_id' })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting chemical details:', error);
    throw error;
  }
  return data;
}

export async function upsertEmissionDetails(
  input: Partial<EmissionDetailsInput> & { permit_application_id: string }
): Promise<PermitEmissionDetails | null> {
  const { data, error } = await supabase
    .from('permit_emission_details')
    .upsert(input, { onConflict: 'permit_application_id' })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting emission details:', error);
    throw error;
  }
  return data;
}

export async function upsertEnvironmentalDetails(
  input: Partial<EnvironmentalDetailsInput> & { permit_application_id: string }
): Promise<PermitEnvironmentalDetails | null> {
  const { data, error } = await supabase
    .from('permit_environmental_details')
    .upsert(input, { onConflict: 'permit_application_id' })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting environmental details:', error);
    throw error;
  }
  return data;
}

export async function upsertIndustryDetails(
  input: Partial<IndustryDetailsInput> & { permit_application_id: string }
): Promise<PermitIndustryDetails | null> {
  const { data, error } = await supabase
    .from('permit_industry_details')
    .upsert(input, { onConflict: 'permit_application_id' })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting industry details:', error);
    throw error;
  }
  return data;
}

// ===== NEW NORMALIZED UPSERT FUNCTIONS =====

export async function upsertLocationDetails(
  input: Partial<LocationDetailsInput> & { permit_application_id: string }
): Promise<PermitLocationDetails | null> {
  const { data, error } = await supabase
    .from('permit_location_details')
    .upsert(input as any, { onConflict: 'permit_application_id' })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting location details:', error);
    throw error;
  }
  return data as PermitLocationDetails;
}

export async function upsertConsultationDetails(
  input: Partial<ConsultationDetailsInput> & { permit_application_id: string }
): Promise<PermitConsultationDetails | null> {
  const { data, error } = await supabase
    .from('permit_consultation_details')
    .upsert(input as any, { onConflict: 'permit_application_id' })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting consultation details:', error);
    throw error;
  }
  return data as PermitConsultationDetails;
}

export async function upsertFeeDetails(
  input: Partial<FeeDetailsInput> & { permit_application_id: string }
): Promise<PermitFeeDetails | null> {
  const { data, error } = await supabase
    .from('permit_fee_details')
    .upsert(input as any, { onConflict: 'permit_application_id' })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting fee details:', error);
    throw error;
  }
  return data as PermitFeeDetails;
}

export async function upsertProjectDetails(
  input: Partial<ProjectDetailsInput> & { permit_application_id: string }
): Promise<PermitProjectDetails | null> {
  const { data, error } = await supabase
    .from('permit_project_details')
    .upsert(input as any, { onConflict: 'permit_application_id' })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting project details:', error);
    throw error;
  }
  return data as PermitProjectDetails;
}

export async function upsertClassificationDetails(
  input: Partial<ClassificationDetailsInput> & { permit_application_id: string }
): Promise<PermitClassificationDetails | null> {
  const { data, error } = await supabase
    .from('permit_classification_details')
    .upsert(input as any, { onConflict: 'permit_application_id' })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting classification details:', error);
    throw error;
  }
  return data as PermitClassificationDetails;
}

export async function upsertComplianceDetails(
  input: Partial<ComplianceDetailsInput> & { permit_application_id: string }
): Promise<PermitComplianceDetails | null> {
  const { data, error } = await supabase
    .from('permit_compliance_details')
    .upsert(input as any, { onConflict: 'permit_application_id' })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting compliance details:', error);
    throw error;
  }
  return data as PermitComplianceDetails;
}

// ============================================
// SAVE FROM FLATTENED FORMAT
// ============================================

/**
 * Save permit details from a flattened format (for backward compatibility)
 * Routes each field to the appropriate child table
 */
export async function savePermitDetailsFromFlat(
  permitApplicationId: string,
  flatDetails: Partial<PermitDetailsFlatteneed>
): Promise<void> {
  const promises: Promise<any>[] = [];
  
  // Water & Waste details
  const waterWasteFields = {
    permit_application_id: permitApplicationId,
    water_extraction_details: flatDetails.water_extraction_details,
    effluent_discharge_details: flatDetails.effluent_discharge_details,
    solid_waste_details: flatDetails.solid_waste_details,
    hazardous_waste_details: flatDetails.hazardous_waste_details,
    marine_dumping_details: flatDetails.marine_dumping_details,
    stormwater_details: flatDetails.stormwater_details,
    waste_contaminant_details: flatDetails.waste_contaminant_details,
  };
  
  if (hasNonNullValues(waterWasteFields, 'permit_application_id')) {
    promises.push(upsertWaterWasteDetails(waterWasteFields));
  }
  
  // Chemical details
  const chemicalFields = {
    permit_application_id: permitApplicationId,
    chemical_storage_details: flatDetails.chemical_storage_details,
    fuel_storage_details: flatDetails.fuel_storage_details,
    hazardous_material_details: flatDetails.hazardous_material_details,
    pesticide_details: flatDetails.pesticide_details,
    mining_chemical_details: flatDetails.mining_chemical_details,
    ods_details: flatDetails.ods_details,
  };
  
  if (hasNonNullValues(chemicalFields, 'permit_application_id')) {
    promises.push(upsertChemicalDetails(chemicalFields));
  }
  
  // Emission details
  const emissionFields = {
    permit_application_id: permitApplicationId,
    air_emission_details: flatDetails.air_emission_details,
    ghg_emission_details: flatDetails.ghg_emission_details,
    noise_emission_details: flatDetails.noise_emission_details,
  };
  
  if (hasNonNullValues(emissionFields, 'permit_application_id')) {
    promises.push(upsertEmissionDetails(emissionFields));
  }
  
  // Environmental details (domain)
  const environmentalFields = {
    permit_application_id: permitApplicationId,
    biodiversity_abs_details: flatDetails.biodiversity_abs_details,
    carbon_offset_details: flatDetails.carbon_offset_details,
    land_clearing_details: flatDetails.land_clearing_details,
    soil_extraction_details: flatDetails.soil_extraction_details,
    wildlife_trade_details: flatDetails.wildlife_trade_details,
    rehabilitation_details: flatDetails.rehabilitation_details,
  };
  
  if (hasNonNullValues(environmentalFields, 'permit_application_id')) {
    promises.push(upsertEnvironmentalDetails(environmentalFields));
  }
  
  // Industry details
  const industryFields = {
    permit_application_id: permitApplicationId,
    aquaculture_details: flatDetails.aquaculture_details,
    mining_permit_details: flatDetails.mining_permit_details,
    forest_product_details: flatDetails.forest_product_details,
    dredging_details: flatDetails.dredging_details,
    infrastructure_details: flatDetails.infrastructure_details,
    renewable_energy_details: flatDetails.renewable_energy_details,
    research_details: flatDetails.research_details,
    monitoring_license_details: flatDetails.monitoring_license_details,
  };
  
  if (hasNonNullValues(industryFields, 'permit_application_id')) {
    promises.push(upsertIndustryDetails(industryFields));
  }

  // Location details
  const locationFields = {
    permit_application_id: permitApplicationId,
    province: flatDetails.province,
    district: flatDetails.district,
    llg: flatDetails.llg,
    project_boundary: flatDetails.project_boundary,
    coordinates: flatDetails.coordinates,
    total_area_sqkm: flatDetails.total_area_sqkm,
    project_site_description: flatDetails.project_site_description,
    site_ownership_details: flatDetails.site_ownership_details,
    land_type: flatDetails.land_type,
    tenure: flatDetails.tenure,
    legal_description: flatDetails.legal_description,
  };
  
  if (hasNonNullValues(locationFields, 'permit_application_id')) {
    promises.push(upsertLocationDetails(locationFields));
  }

  // Consultation details
  const consultationFields = {
    permit_application_id: permitApplicationId,
    consultation_period_start: flatDetails.consultation_period_start,
    consultation_period_end: flatDetails.consultation_period_end,
    consulted_departments: flatDetails.consulted_departments,
    public_consultation_proof: flatDetails.public_consultation_proof,
    landowner_negotiation_status: flatDetails.landowner_negotiation_status,
    government_agreements_details: flatDetails.government_agreements_details,
    required_approvals: flatDetails.required_approvals,
  };
  
  if (hasNonNullValues(consultationFields, 'permit_application_id')) {
    promises.push(upsertConsultationDetails(consultationFields));
  }

  // Fee details
  const feeFields = {
    permit_application_id: permitApplicationId,
    application_fee: flatDetails.application_fee,
    fee_amount: flatDetails.fee_amount,
    fee_breakdown: flatDetails.fee_breakdown,
    fee_source: flatDetails.fee_source,
    composite_fee: flatDetails.composite_fee,
    payment_status: flatDetails.payment_status,
    processing_days: flatDetails.processing_days,
  };
  
  if (hasNonNullValues(feeFields, 'permit_application_id')) {
    promises.push(upsertFeeDetails(feeFields));
  }

  // Project details
  const projectFields = {
    permit_application_id: permitApplicationId,
    project_description: flatDetails.project_description,
    project_start_date: flatDetails.project_start_date,
    project_end_date: flatDetails.project_end_date,
    commencement_date: flatDetails.commencement_date,
    completion_date: flatDetails.completion_date,
    estimated_cost_kina: flatDetails.estimated_cost_kina,
    operational_details: flatDetails.operational_details,
    operational_capacity: flatDetails.operational_capacity,
    operating_hours: flatDetails.operating_hours,
    environmental_impact: flatDetails.environmental_impact,
    mitigation_measures: flatDetails.mitigation_measures,
    proposed_works_description: flatDetails.proposed_works_description,
  };
  
  if (hasNonNullValues(projectFields, 'permit_application_id')) {
    promises.push(upsertProjectDetails(projectFields));
  }

  // Classification details
  const classificationFields = {
    permit_application_id: permitApplicationId,
    permit_category: flatDetails.permit_category,
    permit_type_specific: flatDetails.permit_type_specific,
    activity_classification: flatDetails.activity_classification,
    activity_category: flatDetails.activity_category,
    activity_subcategory: flatDetails.activity_subcategory,
    activity_level: flatDetails.activity_level,
    eia_required: flatDetails.eia_required,
    eis_required: flatDetails.eis_required,
    permit_type_specific_data: flatDetails.permit_type_specific_data,
    ods_quota_allocation: flatDetails.ods_quota_allocation,
  };
  
  if (hasNonNullValues(classificationFields, 'permit_application_id')) {
    promises.push(upsertClassificationDetails(classificationFields));
  }

  // Compliance details
  const complianceFields = {
    permit_application_id: permitApplicationId,
    compliance_checks: flatDetails.compliance_checks,
    compliance_commitment: flatDetails.compliance_commitment,
    compliance_commitment_accepted_at: flatDetails.compliance_commitment_accepted_at,
    legal_declaration_accepted: flatDetails.legal_declaration_accepted,
    legal_declaration_accepted_at: flatDetails.legal_declaration_accepted_at,
  };
  
  if (hasNonNullValues(complianceFields, 'permit_application_id')) {
    promises.push(upsertComplianceDetails(complianceFields));
  }
  
  await Promise.all(promises);
}

// Helper to check if an object has any non-null values (excluding specified keys)
function hasNonNullValues(obj: Record<string, any>, ...excludeKeys: string[]): boolean {
  return Object.entries(obj).some(
    ([key, value]) => !excludeKeys.includes(key) && value !== null && value !== undefined
  );
}
