-- Create intent_reviews table matching permit_reviews pattern
CREATE TABLE public.intent_reviews (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    intent_registration_id UUID NOT NULL REFERENCES public.intent_registrations(id) ON DELETE CASCADE,
    review_stage TEXT NOT NULL, -- 'registry', 'compliance', 'invoice_payment', 'md'
    reviewer_id UUID,
    assessment TEXT,
    remarks TEXT,
    proposed_action TEXT,
    validation_checks JSONB DEFAULT '{}'::jsonb,
    uploaded_documents JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'pending',
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    -- For MD review stage
    decision TEXT,
    decision_notes TEXT,
    CONSTRAINT intent_reviews_unique_stage UNIQUE (intent_registration_id, review_stage)
);

-- Create indexes
CREATE INDEX idx_intent_reviews_intent_id ON public.intent_reviews(intent_registration_id);
CREATE INDEX idx_intent_reviews_stage ON public.intent_reviews(review_stage);
CREATE INDEX idx_intent_reviews_reviewer ON public.intent_reviews(reviewer_id);
CREATE INDEX idx_intent_reviews_status ON public.intent_reviews(status);

-- Enable RLS
ALTER TABLE public.intent_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Staff can view all intent reviews
CREATE POLICY "Staff can view intent reviews"
ON public.intent_reviews
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.user_type IN ('staff', 'admin', 'super_admin')
    )
);

-- Registry staff can manage registry reviews
CREATE POLICY "Registry staff can manage registry reviews"
ON public.intent_reviews
FOR ALL
USING (
    review_stage = 'registry'
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND (profiles.staff_unit = 'registry' OR profiles.user_type IN ('admin', 'super_admin'))
    )
)
WITH CHECK (
    review_stage = 'registry'
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND (profiles.staff_unit = 'registry' OR profiles.user_type IN ('admin', 'super_admin'))
    )
);

-- Compliance staff can manage compliance reviews
CREATE POLICY "Compliance staff can manage compliance reviews"
ON public.intent_reviews
FOR ALL
USING (
    review_stage = 'compliance'
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND (profiles.staff_unit = 'compliance' OR profiles.user_type IN ('admin', 'super_admin'))
    )
)
WITH CHECK (
    review_stage = 'compliance'
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND (profiles.staff_unit = 'compliance' OR profiles.user_type IN ('admin', 'super_admin'))
    )
);

-- Revenue staff can manage invoice/payment reviews
CREATE POLICY "Revenue staff can manage invoice reviews"
ON public.intent_reviews
FOR ALL
USING (
    review_stage = 'invoice_payment'
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND (profiles.staff_unit = 'revenue' OR profiles.user_type IN ('admin', 'super_admin'))
    )
)
WITH CHECK (
    review_stage = 'invoice_payment'
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND (profiles.staff_unit = 'revenue' OR profiles.user_type IN ('admin', 'super_admin'))
    )
);

-- Managing director can manage MD reviews
CREATE POLICY "MD can manage MD reviews"
ON public.intent_reviews
FOR ALL
USING (
    review_stage = 'md'
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND (profiles.staff_position = 'managing_director' OR profiles.user_type IN ('admin', 'super_admin'))
    )
)
WITH CHECK (
    review_stage = 'md'
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND (profiles.staff_position = 'managing_director' OR profiles.user_type IN ('admin', 'super_admin'))
    )
);

-- Create trigger for updated_at
CREATE TRIGGER update_intent_reviews_updated_at
    BEFORE UPDATE ON public.intent_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add deprecation comments to old columns in intent_registrations
COMMENT ON COLUMN public.intent_registrations.registry_review_status IS 'DEPRECATED: Use intent_reviews table with review_stage=registry';
COMMENT ON COLUMN public.intent_registrations.registry_review_notes IS 'DEPRECATED: Use intent_reviews table with review_stage=registry';
COMMENT ON COLUMN public.intent_registrations.registry_reviewed_by IS 'DEPRECATED: Use intent_reviews table with review_stage=registry';
COMMENT ON COLUMN public.intent_registrations.registry_reviewed_at IS 'DEPRECATED: Use intent_reviews table with review_stage=registry';
COMMENT ON COLUMN public.intent_registrations.compliance_review_status IS 'DEPRECATED: Use intent_reviews table with review_stage=compliance';
COMMENT ON COLUMN public.intent_registrations.compliance_review_notes IS 'DEPRECATED: Use intent_reviews table with review_stage=compliance';
COMMENT ON COLUMN public.intent_registrations.compliance_reviewed_by IS 'DEPRECATED: Use intent_reviews table with review_stage=compliance';
COMMENT ON COLUMN public.intent_registrations.compliance_reviewed_at IS 'DEPRECATED: Use intent_reviews table with review_stage=compliance';
COMMENT ON COLUMN public.intent_registrations.md_review_status IS 'DEPRECATED: Use intent_reviews table with review_stage=md';
COMMENT ON COLUMN public.intent_registrations.md_decision IS 'DEPRECATED: Use intent_reviews table with review_stage=md';
COMMENT ON COLUMN public.intent_registrations.md_decision_notes IS 'DEPRECATED: Use intent_reviews table with review_stage=md';
COMMENT ON COLUMN public.intent_registrations.md_decided_by IS 'DEPRECATED: Use intent_reviews table with review_stage=md';
COMMENT ON COLUMN public.intent_registrations.md_decided_at IS 'DEPRECATED: Use intent_reviews table with review_stage=md';