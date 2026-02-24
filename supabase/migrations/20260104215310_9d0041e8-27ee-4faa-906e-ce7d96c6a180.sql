-- First insert fee payment record to satisfy the trigger
INSERT INTO fee_payments (
  permit_application_id,
  administration_fee,
  technical_fee,
  total_fee,
  amount_paid,
  payment_status,
  calculated_by
) VALUES (
  'af881038-72b5-4a60-b45c-d088b872c377',
  25000.00,
  114254.80,
  139254.80,
  0,
  'pending',
  (SELECT user_id FROM profiles WHERE staff_unit = 'registry' LIMIT 1)
);

-- Update existing permit classification details
UPDATE permit_classification_details SET
  permit_category = 'Environment',
  permit_type_specific = 'Environmental Permit - Level 3',
  activity_classification = 'Category 14.1 - Activities involving investment of a capital cost of more than K50 million',
  activity_category = 'Major Infrastructure Development',
  activity_subcategory = 'Transport Hub & Marine Facilities',
  activity_level = 'Level 3',
  eia_required = true,
  eis_required = true,
  permit_type_specific_data = '{
    "project_value_kina": 85000000,
    "estimated_duration_months": 36,
    "environmental_sensitivity": "High",
    "water_body_impact": true,
    "dredging_required": true,
    "fuel_storage_capacity_litres": 2000000,
    "requires_public_consultation": true,
    "requires_eia_approval": true,
    "requires_eis_approval": true
  }'::jsonb,
  updated_at = NOW()
WHERE permit_application_id = 'af881038-72b5-4a60-b45c-d088b872c377';