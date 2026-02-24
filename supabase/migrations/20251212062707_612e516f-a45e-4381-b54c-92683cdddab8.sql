-- Add document_uploads column to store categorized documents (EIA, EIS, etc.)
ALTER TABLE public.permit_applications 
ADD COLUMN IF NOT EXISTS document_uploads jsonb DEFAULT '{}'::jsonb;