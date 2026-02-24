-- Update fee payment to mark as paid
UPDATE fee_payments SET
  payment_status = 'paid',
  amount_paid = 139254.80,
  paid_at = NOW(),
  payment_method = 'bank_transfer',
  payment_reference = 'BSP-TXN-2026-0104-001',
  receipt_number = 'CEPA-REC-2026-0001'
WHERE permit_application_id = 'af881038-72b5-4a60-b45c-d088b872c377';

-- Now insert compliance assessment with permit type and fee details
INSERT INTO compliance_assessments (
  permit_application_id,
  assessed_by,
  assigned_by,
  assessment_status,
  assessment_notes,
  activity_level,
  activity_type,
  permit_type_selected,
  fee_category,
  calculated_administration_fee,
  calculated_technical_fee,
  final_fee_amount,
  administration_form,
  technical_form,
  processing_days,
  compliance_score,
  recommendations
) VALUES (
  'af881038-72b5-4a60-b45c-d088b872c377',
  (SELECT user_id FROM profiles WHERE staff_unit = 'compliance' LIMIT 1),
  (SELECT user_id FROM profiles WHERE staff_unit = 'registry' LIMIT 1),
  'pending',
  'Level 3 Environmental Permit application for major transport infrastructure development. Activity falls under Category 14.1 (Capital investment >K50M). Project requires full EIA and EIS approval given scope includes dredging, fuel storage, and marine facilities.',
  'Level 3',
  'Level 3',
  'Environmental Permit - Level 3',
  '3.1',
  25000.00,
  114254.80,
  139254.80,
  'Form 2',
  'Form 9',
  90,
  NULL,
  'Pending technical compliance review and site inspection. EIA document verification required.'
);