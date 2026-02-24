-- Drop and recreate vw_permit_applications_list with approval_date
DROP VIEW IF EXISTS vw_permit_applications_list;

CREATE VIEW vw_permit_applications_list AS
SELECT 
  pa.id,
  pa.title,
  pa.description,
  pa.permit_type,
  pa.status,
  pa.permit_number,
  pa.application_number,
  pa.created_at,
  pa.updated_at,
  pa.approval_date,
  pa.user_id,
  pa.entity_id,
  pa.activity_id,
  e.name as entity_name,
  e.entity_type,
  pact.level::text as activity_level
FROM permit_applications pa
LEFT JOIN entities e ON pa.entity_id = e.id
LEFT JOIN prescribed_activities pact ON pa.activity_id = pact.id
WHERE pa.deleted_at IS NULL;