-- Create permit_location_details child table
CREATE TABLE public.permit_location_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  permit_application_id UUID NOT NULL REFERENCES public.permit_applications(id) ON DELETE CASCADE,
  province TEXT,
  district TEXT,
  llg TEXT,
  project_boundary JSONB,
  coordinates JSONB,
  total_area_sqkm NUMERIC,
  project_site_description TEXT,
  site_ownership_details TEXT,
  land_type TEXT,
  tenure TEXT,
  legal_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT permit_location_details_permit_application_id_key UNIQUE (permit_application_id)
);

-- Create permit_consultation_details child table
CREATE TABLE public.permit_consultation_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  permit_application_id UUID NOT NULL REFERENCES public.permit_applications(id) ON DELETE CASCADE,
  consultation_period_start DATE,
  consultation_period_end DATE,
  consulted_departments TEXT,
  public_consultation_proof JSONB,
  landowner_negotiation_status TEXT,
  government_agreements_details TEXT,
  required_approvals TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT permit_consultation_details_permit_application_id_key UNIQUE (permit_application_id)
);

-- Create permit_fee_details child table
CREATE TABLE public.permit_fee_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  permit_application_id UUID NOT NULL REFERENCES public.permit_applications(id) ON DELETE CASCADE,
  application_fee NUMERIC,
  fee_amount NUMERIC,
  fee_breakdown JSONB,
  fee_source TEXT,
  composite_fee NUMERIC,
  payment_status TEXT,
  processing_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT permit_fee_details_permit_application_id_key UNIQUE (permit_application_id)
);

-- Create permit_project_details child table
CREATE TABLE public.permit_project_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  permit_application_id UUID NOT NULL REFERENCES public.permit_applications(id) ON DELETE CASCADE,
  project_description TEXT,
  project_start_date DATE,
  project_end_date DATE,
  commencement_date DATE,
  completion_date DATE,
  estimated_cost_kina NUMERIC,
  operational_details TEXT,
  operational_capacity TEXT,
  operating_hours TEXT,
  environmental_impact TEXT,
  mitigation_measures TEXT,
  proposed_works_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT permit_project_details_permit_application_id_key UNIQUE (permit_application_id)
);

-- Create permit_classification_details child table
CREATE TABLE public.permit_classification_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  permit_application_id UUID NOT NULL REFERENCES public.permit_applications(id) ON DELETE CASCADE,
  permit_category TEXT,
  permit_type_specific TEXT,
  activity_classification TEXT,
  activity_category TEXT,
  activity_subcategory TEXT,
  activity_level TEXT,
  eia_required BOOLEAN,
  eis_required BOOLEAN,
  permit_type_specific_data JSONB,
  ods_quota_allocation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT permit_classification_details_permit_application_id_key UNIQUE (permit_application_id)
);

-- Create permit_compliance_details child table
CREATE TABLE public.permit_compliance_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  permit_application_id UUID NOT NULL REFERENCES public.permit_applications(id) ON DELETE CASCADE,
  compliance_checks JSONB,
  compliance_commitment BOOLEAN,
  compliance_commitment_accepted_at TIMESTAMP WITH TIME ZONE,
  legal_declaration_accepted BOOLEAN,
  legal_declaration_accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT permit_compliance_details_permit_application_id_key UNIQUE (permit_application_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.permit_location_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permit_consultation_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permit_fee_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permit_project_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permit_classification_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permit_compliance_details ENABLE ROW LEVEL SECURITY;

-- RLS Policies for permit_location_details
CREATE POLICY "Users can manage their own permit location details"
ON public.permit_location_details FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM permit_applications pa
    WHERE pa.id = permit_location_details.permit_application_id
    AND pa.user_id = auth.uid()
  )
  OR is_admin_or_super_admin()
  OR EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid()
    AND p.user_type = 'staff'
  )
);

-- RLS Policies for permit_consultation_details
CREATE POLICY "Users can manage their own permit consultation details"
ON public.permit_consultation_details FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM permit_applications pa
    WHERE pa.id = permit_consultation_details.permit_application_id
    AND pa.user_id = auth.uid()
  )
  OR is_admin_or_super_admin()
  OR EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid()
    AND p.user_type = 'staff'
  )
);

-- RLS Policies for permit_fee_details
CREATE POLICY "Users can manage their own permit fee details"
ON public.permit_fee_details FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM permit_applications pa
    WHERE pa.id = permit_fee_details.permit_application_id
    AND pa.user_id = auth.uid()
  )
  OR is_admin_or_super_admin()
  OR EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid()
    AND p.user_type = 'staff'
  )
);

-- RLS Policies for permit_project_details
CREATE POLICY "Users can manage their own permit project details"
ON public.permit_project_details FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM permit_applications pa
    WHERE pa.id = permit_project_details.permit_application_id
    AND pa.user_id = auth.uid()
  )
  OR is_admin_or_super_admin()
  OR EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid()
    AND p.user_type = 'staff'
  )
);

-- RLS Policies for permit_classification_details
CREATE POLICY "Users can manage their own permit classification details"
ON public.permit_classification_details FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM permit_applications pa
    WHERE pa.id = permit_classification_details.permit_application_id
    AND pa.user_id = auth.uid()
  )
  OR is_admin_or_super_admin()
  OR EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid()
    AND p.user_type = 'staff'
  )
);

-- RLS Policies for permit_compliance_details
CREATE POLICY "Users can manage their own permit compliance details"
ON public.permit_compliance_details FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM permit_applications pa
    WHERE pa.id = permit_compliance_details.permit_application_id
    AND pa.user_id = auth.uid()
  )
  OR is_admin_or_super_admin()
  OR EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid()
    AND p.user_type = 'staff'
  )
);

-- Add updated_at triggers for all new tables
CREATE TRIGGER update_permit_location_details_updated_at
BEFORE UPDATE ON public.permit_location_details
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_permit_consultation_details_updated_at
BEFORE UPDATE ON public.permit_consultation_details
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_permit_fee_details_updated_at
BEFORE UPDATE ON public.permit_fee_details
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_permit_project_details_updated_at
BEFORE UPDATE ON public.permit_project_details
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_permit_classification_details_updated_at
BEFORE UPDATE ON public.permit_classification_details
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_permit_compliance_details_updated_at
BEFORE UPDATE ON public.permit_compliance_details
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for foreign key lookups
CREATE INDEX idx_permit_location_details_application_id ON public.permit_location_details(permit_application_id);
CREATE INDEX idx_permit_consultation_details_application_id ON public.permit_consultation_details(permit_application_id);
CREATE INDEX idx_permit_fee_details_application_id ON public.permit_fee_details(permit_application_id);
CREATE INDEX idx_permit_project_details_application_id ON public.permit_project_details(permit_application_id);
CREATE INDEX idx_permit_classification_details_application_id ON public.permit_classification_details(permit_application_id);
CREATE INDEX idx_permit_compliance_details_application_id ON public.permit_compliance_details(permit_application_id);