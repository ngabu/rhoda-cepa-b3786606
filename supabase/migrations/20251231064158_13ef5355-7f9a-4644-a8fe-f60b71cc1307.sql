-- STEP 1: Migrate existing data from deprecated JSONB columns to child tables
-- Only water_extraction_details and waste_contaminant_details have data (1 record each)

-- Migrate data to permit_water_waste_details
INSERT INTO permit_water_waste_details (permit_application_id, water_extraction_details, waste_contaminant_details, effluent_discharge_details, solid_waste_details, hazardous_waste_details, marine_dumping_details, stormwater_details)
SELECT 
  id,
  water_extraction_details,
  waste_contaminant_details,
  effluent_discharge_details,
  solid_waste_details,
  hazardous_waste_details,
  marine_dumping_details,
  stormwater_details
FROM permit_applications
WHERE 
  water_extraction_details IS NOT NULL OR
  waste_contaminant_details IS NOT NULL OR
  effluent_discharge_details IS NOT NULL OR
  solid_waste_details IS NOT NULL OR
  hazardous_waste_details IS NOT NULL OR
  marine_dumping_details IS NOT NULL OR
  stormwater_details IS NOT NULL
ON CONFLICT (permit_application_id) DO UPDATE SET
  water_extraction_details = EXCLUDED.water_extraction_details,
  waste_contaminant_details = EXCLUDED.waste_contaminant_details,
  effluent_discharge_details = EXCLUDED.effluent_discharge_details,
  solid_waste_details = EXCLUDED.solid_waste_details,
  hazardous_waste_details = EXCLUDED.hazardous_waste_details,
  marine_dumping_details = EXCLUDED.marine_dumping_details,
  stormwater_details = EXCLUDED.stormwater_details,
  updated_at = NOW();

-- Migrate data to permit_chemical_details
INSERT INTO permit_chemical_details (permit_application_id, chemical_storage_details, fuel_storage_details, hazardous_material_details, pesticide_details, mining_chemical_details, ods_details)
SELECT 
  id,
  chemical_storage_details,
  fuel_storage_details,
  hazardous_material_details,
  pesticide_details,
  mining_chemical_details,
  ods_details
FROM permit_applications
WHERE 
  chemical_storage_details IS NOT NULL OR
  fuel_storage_details IS NOT NULL OR
  hazardous_material_details IS NOT NULL OR
  pesticide_details IS NOT NULL OR
  mining_chemical_details IS NOT NULL OR
  ods_details IS NOT NULL
ON CONFLICT (permit_application_id) DO UPDATE SET
  chemical_storage_details = EXCLUDED.chemical_storage_details,
  fuel_storage_details = EXCLUDED.fuel_storage_details,
  hazardous_material_details = EXCLUDED.hazardous_material_details,
  pesticide_details = EXCLUDED.pesticide_details,
  mining_chemical_details = EXCLUDED.mining_chemical_details,
  ods_details = EXCLUDED.ods_details,
  updated_at = NOW();

-- Migrate data to permit_emission_details
INSERT INTO permit_emission_details (permit_application_id, air_emission_details, ghg_emission_details, noise_emission_details)
SELECT 
  id,
  air_emission_details,
  ghg_emission_details,
  noise_emission_details
FROM permit_applications
WHERE 
  air_emission_details IS NOT NULL OR
  ghg_emission_details IS NOT NULL OR
  noise_emission_details IS NOT NULL
ON CONFLICT (permit_application_id) DO UPDATE SET
  air_emission_details = EXCLUDED.air_emission_details,
  ghg_emission_details = EXCLUDED.ghg_emission_details,
  noise_emission_details = EXCLUDED.noise_emission_details,
  updated_at = NOW();

-- Migrate data to permit_environmental_details
INSERT INTO permit_environmental_details (permit_application_id, biodiversity_abs_details, carbon_offset_details, land_clearing_details, soil_extraction_details, wildlife_trade_details, rehabilitation_details)
SELECT 
  id,
  biodiversity_abs_details,
  carbon_offset_details,
  land_clearing_details,
  soil_extraction_details,
  wildlife_trade_details,
  rehabilitation_details
FROM permit_applications
WHERE 
  biodiversity_abs_details IS NOT NULL OR
  carbon_offset_details IS NOT NULL OR
  land_clearing_details IS NOT NULL OR
  soil_extraction_details IS NOT NULL OR
  wildlife_trade_details IS NOT NULL OR
  rehabilitation_details IS NOT NULL
ON CONFLICT (permit_application_id) DO UPDATE SET
  biodiversity_abs_details = EXCLUDED.biodiversity_abs_details,
  carbon_offset_details = EXCLUDED.carbon_offset_details,
  land_clearing_details = EXCLUDED.land_clearing_details,
  soil_extraction_details = EXCLUDED.soil_extraction_details,
  wildlife_trade_details = EXCLUDED.wildlife_trade_details,
  rehabilitation_details = EXCLUDED.rehabilitation_details,
  updated_at = NOW();

-- Migrate data to permit_industry_details
INSERT INTO permit_industry_details (permit_application_id, aquaculture_details, mining_permit_details, forest_product_details, dredging_details, infrastructure_details, renewable_energy_details, research_details, monitoring_license_details)
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
FROM permit_applications
WHERE 
  aquaculture_details IS NOT NULL OR
  mining_permit_details IS NOT NULL OR
  forest_product_details IS NOT NULL OR
  dredging_details IS NOT NULL OR
  infrastructure_details IS NOT NULL OR
  renewable_energy_details IS NOT NULL OR
  research_details IS NOT NULL OR
  monitoring_license_details IS NOT NULL
ON CONFLICT (permit_application_id) DO UPDATE SET
  aquaculture_details = EXCLUDED.aquaculture_details,
  mining_permit_details = EXCLUDED.mining_permit_details,
  forest_product_details = EXCLUDED.forest_product_details,
  dredging_details = EXCLUDED.dredging_details,
  infrastructure_details = EXCLUDED.infrastructure_details,
  renewable_energy_details = EXCLUDED.renewable_energy_details,
  research_details = EXCLUDED.research_details,
  monitoring_license_details = EXCLUDED.monitoring_license_details,
  updated_at = NOW();