
-- Add FK constraints to all 11 permit child tables
-- Using ON DELETE CASCADE to automatically clean up child records when parent is deleted

-- 1. permit_project_details
ALTER TABLE public.permit_project_details 
ADD CONSTRAINT fk_permit_project_details_application 
FOREIGN KEY (permit_application_id) 
REFERENCES public.permit_applications(id) 
ON DELETE CASCADE;

-- 2. permit_location_details
ALTER TABLE public.permit_location_details 
ADD CONSTRAINT fk_permit_location_details_application 
FOREIGN KEY (permit_application_id) 
REFERENCES public.permit_applications(id) 
ON DELETE CASCADE;

-- 3. permit_classification_details
ALTER TABLE public.permit_classification_details 
ADD CONSTRAINT fk_permit_classification_details_application 
FOREIGN KEY (permit_application_id) 
REFERENCES public.permit_applications(id) 
ON DELETE CASCADE;

-- 4. permit_industry_details
ALTER TABLE public.permit_industry_details 
ADD CONSTRAINT fk_permit_industry_details_application 
FOREIGN KEY (permit_application_id) 
REFERENCES public.permit_applications(id) 
ON DELETE CASCADE;

-- 5. permit_fee_details
ALTER TABLE public.permit_fee_details 
ADD CONSTRAINT fk_permit_fee_details_application 
FOREIGN KEY (permit_application_id) 
REFERENCES public.permit_applications(id) 
ON DELETE CASCADE;

-- 6. permit_water_waste_details
ALTER TABLE public.permit_water_waste_details 
ADD CONSTRAINT fk_permit_water_waste_details_application 
FOREIGN KEY (permit_application_id) 
REFERENCES public.permit_applications(id) 
ON DELETE CASCADE;

-- 7. permit_consultation_details
ALTER TABLE public.permit_consultation_details 
ADD CONSTRAINT fk_permit_consultation_details_application 
FOREIGN KEY (permit_application_id) 
REFERENCES public.permit_applications(id) 
ON DELETE CASCADE;

-- 8. permit_chemical_details
ALTER TABLE public.permit_chemical_details 
ADD CONSTRAINT fk_permit_chemical_details_application 
FOREIGN KEY (permit_application_id) 
REFERENCES public.permit_applications(id) 
ON DELETE CASCADE;

-- 9. permit_environmental_details
ALTER TABLE public.permit_environmental_details 
ADD CONSTRAINT fk_permit_environmental_details_application 
FOREIGN KEY (permit_application_id) 
REFERENCES public.permit_applications(id) 
ON DELETE CASCADE;

-- 10. permit_compliance_details
ALTER TABLE public.permit_compliance_details 
ADD CONSTRAINT fk_permit_compliance_details_application 
FOREIGN KEY (permit_application_id) 
REFERENCES public.permit_applications(id) 
ON DELETE CASCADE;

-- 11. permit_emission_details
ALTER TABLE public.permit_emission_details 
ADD CONSTRAINT fk_permit_emission_details_application 
FOREIGN KEY (permit_application_id) 
REFERENCES public.permit_applications(id) 
ON DELETE CASCADE;
