-- Phase 2 Part 2: Migrate existing data from permit_applications to child tables

-- Migrate emission details (only if any data exists)
INSERT INTO public.permit_emission_details (permit_application_id, air_emission_details, ghg_emission_details, noise_emission_details)
SELECT 
  id,
  air_emission_details,
  ghg_emission_details,
  noise_emission_details
FROM public.permit_applications
WHERE air_emission_details IS NOT NULL 
   OR ghg_emission_details IS NOT NULL 
   OR noise_emission_details IS NOT NULL;

-- Migrate water/waste details
INSERT INTO public.permit_water_waste_details (
  permit_application_id, 
  effluent_discharge_details, 
  solid_waste_details, 
  hazardous_waste_details, 
  marine_dumping_details, 
  stormwater_details, 
  waste_contaminant_details, 
  water_extraction_details
)
SELECT 
  id,
  effluent_discharge_details,
  solid_waste_details,
  hazardous_waste_details,
  marine_dumping_details,
  stormwater_details,
  waste_contaminant_details,
  water_extraction_details
FROM public.permit_applications
WHERE effluent_discharge_details IS NOT NULL 
   OR solid_waste_details IS NOT NULL 
   OR hazardous_waste_details IS NOT NULL
   OR marine_dumping_details IS NOT NULL
   OR stormwater_details IS NOT NULL
   OR waste_contaminant_details IS NOT NULL
   OR water_extraction_details IS NOT NULL;

-- Migrate chemical details
INSERT INTO public.permit_chemical_details (
  permit_application_id, 
  chemical_storage_details, 
  fuel_storage_details, 
  hazardous_material_details, 
  pesticide_details, 
  mining_chemical_details, 
  ods_details
)
SELECT 
  id,
  chemical_storage_details,
  fuel_storage_details,
  hazardous_material_details,
  pesticide_details,
  mining_chemical_details,
  ods_details
FROM public.permit_applications
WHERE chemical_storage_details IS NOT NULL 
   OR fuel_storage_details IS NOT NULL 
   OR hazardous_material_details IS NOT NULL
   OR pesticide_details IS NOT NULL
   OR mining_chemical_details IS NOT NULL
   OR ods_details IS NOT NULL;

-- Migrate industry details
INSERT INTO public.permit_industry_details (
  permit_application_id, 
  aquaculture_details, 
  mining_permit_details, 
  forest_product_details, 
  dredging_details, 
  infrastructure_details, 
  renewable_energy_details, 
  research_details, 
  monitoring_license_details
)
SELECT 
  id,
  aquaculture_details,
  mining_permit_details,
  forest_product_details,
  dredging_details,
  infrastructure_details,
  renewable_energy_details,
  research_details,
  monitoring_license_details
FROM public.permit_applications
WHERE aquaculture_details IS NOT NULL 
   OR mining_permit_details IS NOT NULL 
   OR forest_product_details IS NOT NULL
   OR dredging_details IS NOT NULL
   OR infrastructure_details IS NOT NULL
   OR renewable_energy_details IS NOT NULL
   OR research_details IS NOT NULL
   OR monitoring_license_details IS NOT NULL;

-- Migrate environmental details
INSERT INTO public.permit_environmental_details (
  permit_application_id, 
  biodiversity_abs_details, 
  carbon_offset_details, 
  land_clearing_details, 
  soil_extraction_details, 
  wildlife_trade_details, 
  rehabilitation_details
)
SELECT 
  id,
  biodiversity_abs_details,
  carbon_offset_details,
  land_clearing_details,
  soil_extraction_details,
  wildlife_trade_details,
  rehabilitation_details
FROM public.permit_applications
WHERE biodiversity_abs_details IS NOT NULL 
   OR carbon_offset_details IS NOT NULL 
   OR land_clearing_details IS NOT NULL
   OR soil_extraction_details IS NOT NULL
   OR wildlife_trade_details IS NOT NULL
   OR rehabilitation_details IS NOT NULL;

-- Now drop the migrated columns from permit_applications to reduce table size
-- We keep the original columns but can drop them in a future migration after verification
-- For now, let's add a comment to track that these are deprecated
COMMENT ON COLUMN public.permit_applications.air_emission_details IS 'DEPRECATED: Migrated to permit_emission_details table';
COMMENT ON COLUMN public.permit_applications.ghg_emission_details IS 'DEPRECATED: Migrated to permit_emission_details table';
COMMENT ON COLUMN public.permit_applications.noise_emission_details IS 'DEPRECATED: Migrated to permit_emission_details table';
COMMENT ON COLUMN public.permit_applications.effluent_discharge_details IS 'DEPRECATED: Migrated to permit_water_waste_details table';
COMMENT ON COLUMN public.permit_applications.solid_waste_details IS 'DEPRECATED: Migrated to permit_water_waste_details table';
COMMENT ON COLUMN public.permit_applications.hazardous_waste_details IS 'DEPRECATED: Migrated to permit_water_waste_details table';
COMMENT ON COLUMN public.permit_applications.marine_dumping_details IS 'DEPRECATED: Migrated to permit_water_waste_details table';
COMMENT ON COLUMN public.permit_applications.stormwater_details IS 'DEPRECATED: Migrated to permit_water_waste_details table';
COMMENT ON COLUMN public.permit_applications.waste_contaminant_details IS 'DEPRECATED: Migrated to permit_water_waste_details table';
COMMENT ON COLUMN public.permit_applications.water_extraction_details IS 'DEPRECATED: Migrated to permit_water_waste_details table';
COMMENT ON COLUMN public.permit_applications.chemical_storage_details IS 'DEPRECATED: Migrated to permit_chemical_details table';
COMMENT ON COLUMN public.permit_applications.fuel_storage_details IS 'DEPRECATED: Migrated to permit_chemical_details table';
COMMENT ON COLUMN public.permit_applications.hazardous_material_details IS 'DEPRECATED: Migrated to permit_chemical_details table';
COMMENT ON COLUMN public.permit_applications.pesticide_details IS 'DEPRECATED: Migrated to permit_chemical_details table';
COMMENT ON COLUMN public.permit_applications.mining_chemical_details IS 'DEPRECATED: Migrated to permit_chemical_details table';
COMMENT ON COLUMN public.permit_applications.ods_details IS 'DEPRECATED: Migrated to permit_chemical_details table';
COMMENT ON COLUMN public.permit_applications.aquaculture_details IS 'DEPRECATED: Migrated to permit_industry_details table';
COMMENT ON COLUMN public.permit_applications.mining_permit_details IS 'DEPRECATED: Migrated to permit_industry_details table';
COMMENT ON COLUMN public.permit_applications.forest_product_details IS 'DEPRECATED: Migrated to permit_industry_details table';
COMMENT ON COLUMN public.permit_applications.dredging_details IS 'DEPRECATED: Migrated to permit_industry_details table';
COMMENT ON COLUMN public.permit_applications.infrastructure_details IS 'DEPRECATED: Migrated to permit_industry_details table';
COMMENT ON COLUMN public.permit_applications.renewable_energy_details IS 'DEPRECATED: Migrated to permit_industry_details table';
COMMENT ON COLUMN public.permit_applications.research_details IS 'DEPRECATED: Migrated to permit_industry_details table';
COMMENT ON COLUMN public.permit_applications.monitoring_license_details IS 'DEPRECATED: Migrated to permit_industry_details table';
COMMENT ON COLUMN public.permit_applications.biodiversity_abs_details IS 'DEPRECATED: Migrated to permit_environmental_details table';
COMMENT ON COLUMN public.permit_applications.carbon_offset_details IS 'DEPRECATED: Migrated to permit_environmental_details table';
COMMENT ON COLUMN public.permit_applications.land_clearing_details IS 'DEPRECATED: Migrated to permit_environmental_details table';
COMMENT ON COLUMN public.permit_applications.soil_extraction_details IS 'DEPRECATED: Migrated to permit_environmental_details table';
COMMENT ON COLUMN public.permit_applications.wildlife_trade_details IS 'DEPRECATED: Migrated to permit_environmental_details table';
COMMENT ON COLUMN public.permit_applications.rehabilitation_details IS 'DEPRECATED: Migrated to permit_environmental_details table';