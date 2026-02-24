-- Drop and recreate vw_permit_applications_registry to include approval_date
DROP VIEW IF EXISTS vw_permit_applications_registry;

CREATE VIEW vw_permit_applications_registry AS
SELECT 
    pa.id,
    pa.title,
    pa.permit_type,
    pa.status,
    pa.application_date,
    pa.approval_date,
    pa.application_number,
    pa.permit_number,
    pa.user_id,
    pa.entity_id,
    pa.assigned_officer_id,
    pa.is_draft,
    pa.created_at,
    pa.updated_at,
    e.name AS entity_name,
    e.entity_type,
    e.registration_number,
    COALESCE((ao.first_name || ' '::text) || ao.last_name, ao.email) AS assigned_officer_name,
    ao.email AS assigned_officer_email,
    loc.province,
    loc.district,
    loc.llg,
    proj.commencement_date,
    proj.completion_date,
    proj.estimated_cost_kina,
    cls.activity_level,
    cls.activity_classification,
    cls.permit_category,
    fee.fee_amount,
    fee.payment_status
FROM permit_applications pa
LEFT JOIN entities e ON pa.entity_id = e.id
LEFT JOIN profiles ao ON pa.assigned_officer_id = ao.user_id
LEFT JOIN permit_location_details loc ON pa.id = loc.permit_application_id
LEFT JOIN permit_project_details proj ON pa.id = proj.permit_application_id
LEFT JOIN permit_classification_details cls ON pa.id = cls.permit_application_id
LEFT JOIN permit_fee_details fee ON pa.id = fee.permit_application_id;