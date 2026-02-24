export interface RegistryStaff {
  id: string;
  email: string;
  full_name: string | null;
  staff_position: 'officer' | 'manager';
}

export interface PermitForAssessment {
  id: string;
  permit_number: string | null;
  title: string;
  permit_type: string;
  status: string;
  application_date: string;
  description?: string;
  // Fields from child tables (via views)
  commencement_date?: string | null;
  completion_date?: string | null;
  estimated_cost_kina?: number | null;
  activity_classification?: string | null;
  activity_level?: string | null;
  permit_category?: string | null;
  province?: string | null;
  district?: string | null;
  llg?: string | null;
  fee_amount?: number | null;
  payment_status?: string | null;
  // Entity info from JOIN
  entity_name?: string | null;
  entity_type?: string | null;
  entity: {
    id?: string;
    name: string;
    entity_type: string;
  };
  // Assigned officer from JOIN
  assigned_officer_id?: string;
  assigned_officer_name?: string | null;
  assigned_officer_email?: string | null;
  assigned_officer?: {
    id: string;
    full_name: string | null;
    email: string;
  };
  assessment?: {
    id: string;
    assessment_status: string;
    assessment_notes: string;
    assessed_by: string;
    created_at: string;
  } | null;
  created_at: string;
  updated_at: string;
}
