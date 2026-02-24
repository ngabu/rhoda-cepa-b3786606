-- Insert registry review data for the permit application
INSERT INTO permit_reviews (
  permit_application_id,
  review_stage,
  reviewer_id,
  assessment,
  remarks,
  proposed_action,
  validation_checks,
  uploaded_documents,
  status,
  reviewed_at
) VALUES (
  'af881038-72b5-4a60-b45c-d088b872c377',
  'registry',
  (SELECT user_id FROM profiles WHERE staff_unit = 'registry' LIMIT 1),
  'The permit application for Angoram River Transport Hub Development (PAN-1767508051589) submitted by Sepik River Transport Ltd has been thoroughly reviewed. The application proposes development of an integrated river transport hub at Angoram including a modern cargo wharf with 500-tonne crane capacity, passenger terminal, fuel depot with 2 million litre storage, vessel maintenance yard, and cold chain facility. The project includes dredging of 3.5km approach channel to maintain 4m draft access during dry season. The Environmental Impact Assessment (TEST EIA.docx) and Environmental Inception Report (eVolume-2C-2026) have been uploaded and verified. The entity Sepik River Transport Ltd is properly registered (RC-2021-123) as a company. All mandatory documentation requirements for Level 2 environmental permit applications have been satisfied.',
  'This is a significant infrastructure development project that will enhance river transportation logistics in the East Sepik Province. The project location at Angoram Station Riverfront is strategically positioned adjacent to Provincial Works Depot. Given the scale of operations including fuel storage and dredging activities, close coordination with the Compliance Unit will be essential for ongoing environmental monitoring. The cold chain facility component is particularly valuable for regional fisheries and agricultural produce transport.',
  'Recommend forwarding this application to the Compliance Unit for technical environmental review and site inspection. The application meets all registry documentation requirements and the entity verification is complete. Upon completion of compliance review and fee calculation, proceed to invoice generation for the applicant.',
  '{"entityIPAValidated": true, "projectSiteMapValidated": true, "documentsComplete": true, "feeCalculated": true}'::jsonb,
  '[]'::jsonb,
  'completed',
  NOW()
) ON CONFLICT (permit_application_id, review_stage) 
DO UPDATE SET
  assessment = EXCLUDED.assessment,
  remarks = EXCLUDED.remarks,
  proposed_action = EXCLUDED.proposed_action,
  validation_checks = EXCLUDED.validation_checks,
  status = EXCLUDED.status,
  reviewed_at = EXCLUDED.reviewed_at;