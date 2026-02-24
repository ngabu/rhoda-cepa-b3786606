-- Drop deprecated JSONB columns from permit_applications table
-- Data has been migrated to child tables: permit_emission_details, permit_water_waste_details, 
-- permit_chemical_details, permit_industry_details, permit_environmental_details

-- Emission related columns (migrated to permit_emission_details)
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS air_emission_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS ghg_emission_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS noise_emission_details;

-- Water & Waste related columns (migrated to permit_water_waste_details)
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS effluent_discharge_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS solid_waste_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS hazardous_waste_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS marine_dumping_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS stormwater_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS waste_contaminant_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS water_extraction_details;

-- Chemical related columns (migrated to permit_chemical_details)
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS chemical_storage_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS fuel_storage_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS hazardous_material_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS pesticide_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS mining_chemical_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS ods_details;

-- Industry specific columns (migrated to permit_industry_details)
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS aquaculture_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS mining_permit_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS forest_product_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS dredging_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS infrastructure_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS renewable_energy_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS research_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS monitoring_license_details;

-- Environmental related columns (migrated to permit_environmental_details)
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS biodiversity_abs_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS carbon_offset_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS land_clearing_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS soil_extraction_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS wildlife_trade_details;
ALTER TABLE public.permit_applications DROP COLUMN IF EXISTS rehabilitation_details;