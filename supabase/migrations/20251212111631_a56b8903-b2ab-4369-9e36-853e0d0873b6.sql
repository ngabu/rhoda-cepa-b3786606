-- Add fee calculation columns to permit_applications table
ALTER TABLE public.permit_applications 
ADD COLUMN IF NOT EXISTS composite_fee numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS processing_days integer,
ADD COLUMN IF NOT EXISTS fee_source text DEFAULT 'official',
ADD COLUMN IF NOT EXISTS administration_form text,
ADD COLUMN IF NOT EXISTS technical_form text;

-- Add comment for documentation
COMMENT ON COLUMN public.permit_applications.composite_fee IS 'Environmental Permit processing fee (K2000 flat rate)';
COMMENT ON COLUMN public.permit_applications.processing_days IS 'Processing time in days based on activity level';
COMMENT ON COLUMN public.permit_applications.fee_source IS 'Source of fee calculation: official or estimated';
COMMENT ON COLUMN public.permit_applications.administration_form IS 'Administration form used for calculation';
COMMENT ON COLUMN public.permit_applications.technical_form IS 'Technical form used for calculation';