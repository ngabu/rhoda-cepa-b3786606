-- Fix Security Definer View warnings by using security_invoker
-- This ensures views respect the RLS policies of the querying user

ALTER VIEW vw_permit_applications_full SET (security_invoker = on);
ALTER VIEW vw_permit_applications_list SET (security_invoker = on);
ALTER VIEW vw_permit_applications_compliance SET (security_invoker = on);
ALTER VIEW vw_permit_applications_registry SET (security_invoker = on);