-- Create a view for compliance reports with all necessary fields for staff pages
CREATE OR REPLACE VIEW vw_compliance_reports_list AS
SELECT 
  cr.id,
  cr.permit_id,
  cr.user_id,
  cr.report_date,
  cr.status,
  cr.description,
  cr.file_path,
  cr.review_notes,
  cr.reviewed_by,
  cr.reviewed_at,
  cr.created_at,
  cr.updated_at,
  -- Permit details
  pa.permit_number,
  pa.title AS project_title,
  pa.description AS project_description,
  pa.permit_type,
  -- Entity details
  e.id AS entity_id,
  e.name AS entity_name,
  e.entity_type,
  e.province,
  e.district,
  -- Activity details from permit classification
  pcd.activity_level,
  pcd.activity_classification,
  pcd.permit_category,
  -- Reviewer profile - using first_name and last_name
  CONCAT(p.first_name, ' ', p.last_name) AS reviewer_name,
  p.email AS reviewer_email
FROM compliance_reports cr
LEFT JOIN permit_applications pa ON cr.permit_id = pa.id
LEFT JOIN entities e ON pa.entity_id = e.id
LEFT JOIN permit_classification_details pcd ON pa.id = pcd.permit_application_id
LEFT JOIN profiles p ON cr.reviewed_by = p.id
ORDER BY cr.created_at DESC;