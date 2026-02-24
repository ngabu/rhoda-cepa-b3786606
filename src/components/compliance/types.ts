
export interface ComplianceStaff {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  operational_unit: string | null;
  staff_position: string | null;
  is_active: boolean | null;
  created_at: string | null;
}

export interface PermitApplication {
  id: string;
  title: string;
  permit_type: string;
  status: string;
  application_date: string | null;
  application_number: string | null;
  permit_number: string | null;
  assigned_officer_id: string | null;
  assigned_compliance_officer_id: string | null;
  assigned_officer_name: string | null;
  assigned_officer_email: string | null;
  // Entity info from JOIN
  entity_name: string | null;
  entity_type: string | null;
  entity: {
    name: string;
    entity_type: string;
  };
  // Location from child table
  province?: string | null;
  district?: string | null;
  // Classification from child table
  activity_level?: string | null;
  activity_classification?: string | null;
  eia_required?: boolean | null;
  eis_required?: boolean | null;
  // Compliance from child table
  compliance_checks?: any;
  compliance_commitment?: boolean | null;
  legal_declaration_accepted?: boolean | null;
  created_at: string;
  updated_at: string;
}
