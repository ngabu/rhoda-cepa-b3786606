-- Add missing columns to intent_reviews table to match permit_reviews and capture all UI fields
ALTER TABLE intent_reviews 
ADD COLUMN IF NOT EXISTS technical_compliance_checks JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS violations_found TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS compliance_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS next_review_date DATE,
ADD COLUMN IF NOT EXISTS recommendations TEXT;

-- Add comment for documentation
COMMENT ON COLUMN intent_reviews.technical_compliance_checks IS 'Stores technical compliance assessment checkboxes including technical_compliance_assessed and violations_assessed';
COMMENT ON COLUMN intent_reviews.violations_found IS 'Array of violations found during compliance review';
COMMENT ON COLUMN intent_reviews.compliance_score IS 'Calculated compliance score percentage';