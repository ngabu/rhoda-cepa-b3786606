// Types for the normalized permit details child tables

import { Json } from '@/integrations/supabase/types';

// Base interface for all child detail tables
interface BaseDetails {
  id: string;
  permit_application_id: string;
  created_at: string;
  updated_at: string;
}

// ===== EXISTING DOMAIN-SPECIFIC CHILD TABLES =====

// Water & Waste Details
export interface PermitWaterWasteDetails extends BaseDetails {
  water_extraction_details: Json | null;
  effluent_discharge_details: Json | null;
  solid_waste_details: Json | null;
  hazardous_waste_details: Json | null;
  marine_dumping_details: Json | null;
  stormwater_details: Json | null;
  waste_contaminant_details: Json | null;
}

// Chemical Details
export interface PermitChemicalDetails extends BaseDetails {
  chemical_storage_details: Json | null;
  fuel_storage_details: Json | null;
  hazardous_material_details: Json | null;
  pesticide_details: Json | null;
  mining_chemical_details: Json | null;
  ods_details: Json | null;
}

// Emission Details
export interface PermitEmissionDetails extends BaseDetails {
  air_emission_details: Json | null;
  ghg_emission_details: Json | null;
  noise_emission_details: Json | null;
}

// Environmental Details (domain-specific)
export interface PermitEnvironmentalDetails extends BaseDetails {
  biodiversity_abs_details: Json | null;
  carbon_offset_details: Json | null;
  land_clearing_details: Json | null;
  soil_extraction_details: Json | null;
  wildlife_trade_details: Json | null;
  rehabilitation_details: Json | null;
}

// Industry Details
export interface PermitIndustryDetails extends BaseDetails {
  aquaculture_details: Json | null;
  mining_permit_details: Json | null;
  forest_product_details: Json | null;
  dredging_details: Json | null;
  infrastructure_details: Json | null;
  renewable_energy_details: Json | null;
  research_details: Json | null;
  monitoring_license_details: Json | null;
}

// ===== NEW NORMALIZED CHILD TABLES =====

// Location Details
export interface PermitLocationDetails extends BaseDetails {
  province: string | null;
  district: string | null;
  llg: string | null;
  project_boundary: Json | null;
  coordinates: Json | null;
  total_area_sqkm: number | null;
  project_site_description: string | null;
  site_ownership_details: string | null;
  land_type: string | null;
  tenure: string | null;
  legal_description: string | null;
}

// Consultation Details
export interface PermitConsultationDetails extends BaseDetails {
  consultation_period_start: string | null;
  consultation_period_end: string | null;
  consulted_departments: string | null;
  public_consultation_proof: Json | null;
  landowner_negotiation_status: string | null;
  government_agreements_details: string | null;
  required_approvals: string | null;
}

// Fee Details
export interface PermitFeeDetails extends BaseDetails {
  application_fee: number | null;
  fee_amount: number | null;
  fee_breakdown: Json | null;
  fee_source: string | null;
  composite_fee: number | null;
  payment_status: string | null;
  processing_days: number | null;
}

// Project Details
export interface PermitProjectDetails extends BaseDetails {
  project_description: string | null;
  project_start_date: string | null;
  project_end_date: string | null;
  commencement_date: string | null;
  completion_date: string | null;
  estimated_cost_kina: number | null;
  operational_details: string | null;
  operational_capacity: string | null;
  operating_hours: string | null;
  environmental_impact: string | null;
  mitigation_measures: string | null;
  proposed_works_description: string | null;
}

// Classification Details
export interface PermitClassificationDetails extends BaseDetails {
  permit_category: string | null;
  permit_type_specific: string | null;
  activity_classification: string | null;
  activity_category: string | null;
  activity_subcategory: string | null;
  activity_level: string | null;
  eia_required: boolean | null;
  eis_required: boolean | null;
  permit_type_specific_data: Json | null;
  ods_quota_allocation: string | null;
}

// Compliance Details
export interface PermitComplianceDetails extends BaseDetails {
  compliance_checks: Json | null;
  compliance_commitment: boolean | null;
  compliance_commitment_accepted_at: string | null;
  legal_declaration_accepted: boolean | null;
  legal_declaration_accepted_at: string | null;
}

// ===== COMBINED TYPES =====

// Combined details for a permit application (domain-specific)
export interface PermitDomainDetails {
  waterWaste: PermitWaterWasteDetails | null;
  chemical: PermitChemicalDetails | null;
  emission: PermitEmissionDetails | null;
  environmental: PermitEnvironmentalDetails | null;
  industry: PermitIndustryDetails | null;
}

// Combined details for normalized tables
export interface PermitNormalizedDetails {
  location: PermitLocationDetails | null;
  consultation: PermitConsultationDetails | null;
  fee: PermitFeeDetails | null;
  project: PermitProjectDetails | null;
  classification: PermitClassificationDetails | null;
  compliance: PermitComplianceDetails | null;
}

// All details combined
export interface PermitAllDetails extends PermitDomainDetails, PermitNormalizedDetails {}

// Flattened details for backward compatibility with existing UI
export interface PermitDetailsFlatteneed {
  // Water & Waste
  water_extraction_details?: any;
  effluent_discharge_details?: any;
  solid_waste_details?: any;
  hazardous_waste_details?: any;
  marine_dumping_details?: any;
  stormwater_details?: any;
  waste_contaminant_details?: any;
  
  // Chemical
  chemical_storage_details?: any;
  fuel_storage_details?: any;
  hazardous_material_details?: any;
  pesticide_details?: any;
  mining_chemical_details?: any;
  ods_details?: any;
  
  // Emission
  air_emission_details?: any;
  ghg_emission_details?: any;
  noise_emission_details?: any;
  
  // Environmental (domain)
  biodiversity_abs_details?: any;
  carbon_offset_details?: any;
  land_clearing_details?: any;
  soil_extraction_details?: any;
  wildlife_trade_details?: any;
  rehabilitation_details?: any;
  
  // Industry
  aquaculture_details?: any;
  mining_permit_details?: any;
  forest_product_details?: any;
  dredging_details?: any;
  infrastructure_details?: any;
  renewable_energy_details?: any;
  research_details?: any;
  monitoring_license_details?: any;

  // Location
  province?: string;
  district?: string;
  llg?: string;
  project_boundary?: any;
  coordinates?: any;
  total_area_sqkm?: number;
  project_site_description?: string;
  site_ownership_details?: string;
  land_type?: string;
  tenure?: string;
  legal_description?: string;

  // Consultation
  consultation_period_start?: string;
  consultation_period_end?: string;
  consulted_departments?: string;
  public_consultation_proof?: any;
  landowner_negotiation_status?: string;
  government_agreements_details?: string;
  required_approvals?: string;

  // Fee
  application_fee?: number;
  fee_amount?: number;
  fee_breakdown?: any;
  fee_source?: string;
  composite_fee?: number;
  payment_status?: string;
  processing_days?: number;

  // Project
  project_description?: string;
  project_start_date?: string;
  project_end_date?: string;
  commencement_date?: string;
  completion_date?: string;
  estimated_cost_kina?: number;
  operational_details?: string;
  operational_capacity?: string;
  operating_hours?: string;
  environmental_impact?: string;
  mitigation_measures?: string;
  proposed_works_description?: string;

  // Classification
  permit_category?: string;
  permit_type_specific?: string;
  activity_classification?: string;
  activity_category?: string;
  activity_subcategory?: string;
  activity_level?: string;
  eia_required?: boolean;
  eis_required?: boolean;
  permit_type_specific_data?: any;
  ods_quota_allocation?: string;

  // Compliance
  compliance_checks?: any;
  compliance_commitment?: boolean;
  compliance_commitment_accepted_at?: string;
  legal_declaration_accepted?: boolean;
  legal_declaration_accepted_at?: string;
}

// ===== INPUT TYPES FOR UPSERT OPERATIONS =====

// Domain-specific input types
export type WaterWasteDetailsInput = Omit<PermitWaterWasteDetails, 'id' | 'created_at' | 'updated_at'>;
export type ChemicalDetailsInput = Omit<PermitChemicalDetails, 'id' | 'created_at' | 'updated_at'>;
export type EmissionDetailsInput = Omit<PermitEmissionDetails, 'id' | 'created_at' | 'updated_at'>;
export type EnvironmentalDetailsInput = Omit<PermitEnvironmentalDetails, 'id' | 'created_at' | 'updated_at'>;
export type IndustryDetailsInput = Omit<PermitIndustryDetails, 'id' | 'created_at' | 'updated_at'>;

// Normalized input types
export type LocationDetailsInput = Omit<PermitLocationDetails, 'id' | 'created_at' | 'updated_at'>;
export type ConsultationDetailsInput = Omit<PermitConsultationDetails, 'id' | 'created_at' | 'updated_at'>;
export type FeeDetailsInput = Omit<PermitFeeDetails, 'id' | 'created_at' | 'updated_at'>;
export type ProjectDetailsInput = Omit<PermitProjectDetails, 'id' | 'created_at' | 'updated_at'>;
export type ClassificationDetailsInput = Omit<PermitClassificationDetails, 'id' | 'created_at' | 'updated_at'>;
export type ComplianceDetailsInput = Omit<PermitComplianceDetails, 'id' | 'created_at' | 'updated_at'>;
