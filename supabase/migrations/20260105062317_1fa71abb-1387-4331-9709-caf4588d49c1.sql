-- Add columns to permit_reviews table for technical compliance assessment and violations
ALTER TABLE public.permit_reviews 
ADD COLUMN IF NOT EXISTS technical_compliance_checks JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS violations_found TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS compliance_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS recommendations TEXT,
ADD COLUMN IF NOT EXISTS next_review_date DATE;

-- Add comments for documentation
COMMENT ON COLUMN public.permit_reviews.technical_compliance_checks IS 'JSON object storing technical compliance check states (e.g., environmental_compliance, technical_compliance, etc.)';
COMMENT ON COLUMN public.permit_reviews.violations_found IS 'Array of violation descriptions found during compliance review';
COMMENT ON COLUMN public.permit_reviews.compliance_score IS 'Numeric score (0-100) for overall compliance';
COMMENT ON COLUMN public.permit_reviews.recommendations IS 'Detailed recommendations from the compliance review';
COMMENT ON COLUMN public.permit_reviews.next_review_date IS 'Scheduled date for next compliance review';