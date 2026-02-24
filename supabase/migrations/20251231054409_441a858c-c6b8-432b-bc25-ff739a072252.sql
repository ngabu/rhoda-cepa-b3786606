-- Phase 2: Create normalized child tables for permit_applications
-- This will reduce the main table from 121 columns to ~87 core columns

-- Table 1: Emissions & Air Quality Details
CREATE TABLE public.permit_emission_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  permit_application_id UUID NOT NULL REFERENCES public.permit_applications(id) ON DELETE CASCADE,
  air_emission_details JSONB,
  ghg_emission_details JSONB,
  noise_emission_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(permit_application_id)
);

-- Table 2: Water & Waste Management Details
CREATE TABLE public.permit_water_waste_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  permit_application_id UUID NOT NULL REFERENCES public.permit_applications(id) ON DELETE CASCADE,
  effluent_discharge_details JSONB,
  solid_waste_details JSONB,
  hazardous_waste_details JSONB,
  marine_dumping_details JSONB,
  stormwater_details JSONB,
  waste_contaminant_details JSONB,
  water_extraction_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(permit_application_id)
);

-- Table 3: Chemical & Hazardous Material Details
CREATE TABLE public.permit_chemical_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  permit_application_id UUID NOT NULL REFERENCES public.permit_applications(id) ON DELETE CASCADE,
  chemical_storage_details JSONB,
  fuel_storage_details JSONB,
  hazardous_material_details JSONB,
  pesticide_details JSONB,
  mining_chemical_details JSONB,
  ods_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(permit_application_id)
);

-- Table 4: Industry-Specific Details
CREATE TABLE public.permit_industry_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  permit_application_id UUID NOT NULL REFERENCES public.permit_applications(id) ON DELETE CASCADE,
  aquaculture_details JSONB,
  mining_permit_details JSONB,
  forest_product_details JSONB,
  dredging_details JSONB,
  infrastructure_details JSONB,
  renewable_energy_details JSONB,
  research_details JSONB,
  monitoring_license_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(permit_application_id)
);

-- Table 5: Environmental & Land Details
CREATE TABLE public.permit_environmental_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  permit_application_id UUID NOT NULL REFERENCES public.permit_applications(id) ON DELETE CASCADE,
  biodiversity_abs_details JSONB,
  carbon_offset_details JSONB,
  land_clearing_details JSONB,
  soil_extraction_details JSONB,
  wildlife_trade_details JSONB,
  rehabilitation_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(permit_application_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.permit_emission_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permit_water_waste_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permit_chemical_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permit_industry_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permit_environmental_details ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for each table (matching permit_applications access)
-- Users can view their own permit details
CREATE POLICY "Users can view own permit emission details"
  ON public.permit_emission_details FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.permit_applications pa 
    WHERE pa.id = permit_application_id AND pa.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own permit emission details"
  ON public.permit_emission_details FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.permit_applications pa 
    WHERE pa.id = permit_application_id AND pa.user_id = auth.uid()
  ));

CREATE POLICY "Staff can view all permit emission details"
  ON public.permit_emission_details FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.user_type IN ('staff', 'admin', 'super_admin')
  ));

-- Water/Waste details policies
CREATE POLICY "Users can view own permit water waste details"
  ON public.permit_water_waste_details FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.permit_applications pa 
    WHERE pa.id = permit_application_id AND pa.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own permit water waste details"
  ON public.permit_water_waste_details FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.permit_applications pa 
    WHERE pa.id = permit_application_id AND pa.user_id = auth.uid()
  ));

CREATE POLICY "Staff can view all permit water waste details"
  ON public.permit_water_waste_details FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.user_type IN ('staff', 'admin', 'super_admin')
  ));

-- Chemical details policies
CREATE POLICY "Users can view own permit chemical details"
  ON public.permit_chemical_details FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.permit_applications pa 
    WHERE pa.id = permit_application_id AND pa.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own permit chemical details"
  ON public.permit_chemical_details FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.permit_applications pa 
    WHERE pa.id = permit_application_id AND pa.user_id = auth.uid()
  ));

CREATE POLICY "Staff can view all permit chemical details"
  ON public.permit_chemical_details FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.user_type IN ('staff', 'admin', 'super_admin')
  ));

-- Industry details policies
CREATE POLICY "Users can view own permit industry details"
  ON public.permit_industry_details FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.permit_applications pa 
    WHERE pa.id = permit_application_id AND pa.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own permit industry details"
  ON public.permit_industry_details FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.permit_applications pa 
    WHERE pa.id = permit_application_id AND pa.user_id = auth.uid()
  ));

CREATE POLICY "Staff can view all permit industry details"
  ON public.permit_industry_details FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.user_type IN ('staff', 'admin', 'super_admin')
  ));

-- Environmental details policies
CREATE POLICY "Users can view own permit environmental details"
  ON public.permit_environmental_details FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.permit_applications pa 
    WHERE pa.id = permit_application_id AND pa.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own permit environmental details"
  ON public.permit_environmental_details FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.permit_applications pa 
    WHERE pa.id = permit_application_id AND pa.user_id = auth.uid()
  ));

CREATE POLICY "Staff can view all permit environmental details"
  ON public.permit_environmental_details FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.user_type IN ('staff', 'admin', 'super_admin')
  ));

-- Create indexes for performance
CREATE INDEX idx_permit_emission_details_permit_id ON public.permit_emission_details(permit_application_id);
CREATE INDEX idx_permit_water_waste_details_permit_id ON public.permit_water_waste_details(permit_application_id);
CREATE INDEX idx_permit_chemical_details_permit_id ON public.permit_chemical_details(permit_application_id);
CREATE INDEX idx_permit_industry_details_permit_id ON public.permit_industry_details(permit_application_id);
CREATE INDEX idx_permit_environmental_details_permit_id ON public.permit_environmental_details(permit_application_id);

-- Create updated_at triggers
CREATE TRIGGER update_permit_emission_details_updated_at
  BEFORE UPDATE ON public.permit_emission_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_permit_water_waste_details_updated_at
  BEFORE UPDATE ON public.permit_water_waste_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_permit_chemical_details_updated_at
  BEFORE UPDATE ON public.permit_chemical_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_permit_industry_details_updated_at
  BEFORE UPDATE ON public.permit_industry_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_permit_environmental_details_updated_at
  BEFORE UPDATE ON public.permit_environmental_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();