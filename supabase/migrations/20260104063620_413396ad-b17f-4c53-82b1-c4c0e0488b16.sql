-- Create permit_reviews table to store all workflow stage reviews
CREATE TABLE IF NOT EXISTS public.permit_reviews (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    permit_application_id UUID NOT NULL REFERENCES public.permit_applications(id) ON DELETE CASCADE,
    review_stage TEXT NOT NULL, -- 'registry', 'compliance', 'revenue', 'md'
    reviewer_id UUID,
    assessment TEXT,
    remarks TEXT,
    proposed_action TEXT,
    validation_checks JSONB DEFAULT '{}',
    uploaded_documents JSONB DEFAULT '[]',
    status TEXT DEFAULT 'pending',
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(permit_application_id, review_stage)
);

-- Enable RLS
ALTER TABLE public.permit_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Staff can view permit reviews"
ON public.permit_reviews
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.user_type IN ('staff', 'admin', 'super_admin')
    )
);

CREATE POLICY "Staff can create permit reviews"
ON public.permit_reviews
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.user_type IN ('staff', 'admin', 'super_admin')
    )
);

CREATE POLICY "Staff can update permit reviews"
ON public.permit_reviews
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.user_type IN ('staff', 'admin', 'super_admin')
    )
);

-- Create index for faster lookups
CREATE INDEX idx_permit_reviews_application ON public.permit_reviews(permit_application_id);
CREATE INDEX idx_permit_reviews_stage ON public.permit_reviews(review_stage);

-- Create trigger for updated_at
CREATE TRIGGER update_permit_reviews_updated_at
    BEFORE UPDATE ON public.permit_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();