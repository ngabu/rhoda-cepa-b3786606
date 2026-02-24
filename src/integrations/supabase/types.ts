export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_document_requirements: {
        Row: {
          activity_classification: string | null
          activity_level: number
          created_at: string
          description: string | null
          document_name: string
          id: string
          is_mandatory: boolean
          prescribed_activity_id: string | null
          template_path: string | null
          trigger_condition: string | null
          updated_at: string
        }
        Insert: {
          activity_classification?: string | null
          activity_level: number
          created_at?: string
          description?: string | null
          document_name: string
          id?: string
          is_mandatory?: boolean
          prescribed_activity_id?: string | null
          template_path?: string | null
          trigger_condition?: string | null
          updated_at?: string
        }
        Update: {
          activity_classification?: string | null
          activity_level?: number
          created_at?: string
          description?: string | null
          document_name?: string
          id?: string
          is_mandatory?: boolean
          prescribed_activity_id?: string | null
          template_path?: string | null
          trigger_condition?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_document_requirements_prescribed_activity_id_fkey"
            columns: ["prescribed_activity_id"]
            isOneToOne: false
            referencedRelation: "activity_fee_view"
            referencedColumns: ["activity_id"]
          },
          {
            foreignKeyName: "activity_document_requirements_prescribed_activity_id_fkey"
            columns: ["prescribed_activity_id"]
            isOneToOne: false
            referencedRelation: "prescribed_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_document_requirements_prescribed_activity_id_fkey"
            columns: ["prescribed_activity_id"]
            isOneToOne: false
            referencedRelation: "vw_activity_options"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_fee_mapping: {
        Row: {
          activity_id: string
          created_at: string
          fee_structure_id: string
          id: string
          is_default: boolean
          updated_at: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          fee_structure_id: string
          id?: string
          is_default?: boolean
          updated_at?: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          fee_structure_id?: string
          id?: string
          is_default?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_fee_mapping_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity_fee_view"
            referencedColumns: ["activity_id"]
          },
          {
            foreignKeyName: "activity_fee_mapping_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "prescribed_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_fee_mapping_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "vw_activity_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_fee_mapping_fee_structure_id_fkey"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "activity_fee_view"
            referencedColumns: ["fee_structure_id"]
          },
          {
            foreignKeyName: "activity_fee_mapping_fee_structure_id_fkey"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "fee_structures"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_levels: {
        Row: {
          description: string
          id: number
          name: string
          public_review_required: boolean
        }
        Insert: {
          description: string
          id?: never
          name: string
          public_review_required?: boolean
        }
        Update: {
          description?: string
          id?: never
          name?: string
          public_review_required?: boolean
        }
        Relationships: []
      }
      application_required_docs: {
        Row: {
          application_id: string
          document_type: string
          file_path: string | null
          id: string
          notes: string | null
          requirement_id: string
          status: string
          updated_at: string | null
          uploaded_at: string | null
        }
        Insert: {
          application_id: string
          document_type: string
          file_path?: string | null
          id?: string
          notes?: string | null
          requirement_id: string
          status?: string
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Update: {
          application_id?: string
          document_type?: string
          file_path?: string | null
          id?: string
          notes?: string | null
          requirement_id?: string
          status?: string
          updated_at?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_required_docs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_required_docs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_required_docs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_required_docs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_required_docs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_required_docs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      application_workflow_state: {
        Row: {
          applicant_id: string
          application_id: string
          application_number: string | null
          application_type: Database["public"]["Enums"]["application_category"]
          assigned_at: string | null
          assigned_to: string | null
          assigned_unit: Database["public"]["Enums"]["staff_unit"] | null
          compliance_completed_at: string | null
          created_at: string
          current_stage: Database["public"]["Enums"]["workflow_stage"]
          entity_id: string | null
          final_decision_at: string | null
          id: string
          is_locked: boolean
          lock_reason: string | null
          locked_at: string | null
          locked_by: string | null
          notes: string | null
          previous_stage: Database["public"]["Enums"]["workflow_stage"] | null
          priority: string | null
          registry_completed_at: string | null
          revenue_completed_at: string | null
          sla_deadline: string | null
          submitted_at: string
          updated_at: string
        }
        Insert: {
          applicant_id: string
          application_id: string
          application_number?: string | null
          application_type: Database["public"]["Enums"]["application_category"]
          assigned_at?: string | null
          assigned_to?: string | null
          assigned_unit?: Database["public"]["Enums"]["staff_unit"] | null
          compliance_completed_at?: string | null
          created_at?: string
          current_stage?: Database["public"]["Enums"]["workflow_stage"]
          entity_id?: string | null
          final_decision_at?: string | null
          id?: string
          is_locked?: boolean
          lock_reason?: string | null
          locked_at?: string | null
          locked_by?: string | null
          notes?: string | null
          previous_stage?: Database["public"]["Enums"]["workflow_stage"] | null
          priority?: string | null
          registry_completed_at?: string | null
          revenue_completed_at?: string | null
          sla_deadline?: string | null
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          application_id?: string
          application_number?: string | null
          application_type?: Database["public"]["Enums"]["application_category"]
          assigned_at?: string | null
          assigned_to?: string | null
          assigned_unit?: Database["public"]["Enums"]["staff_unit"] | null
          compliance_completed_at?: string | null
          created_at?: string
          current_stage?: Database["public"]["Enums"]["workflow_stage"]
          entity_id?: string | null
          final_decision_at?: string | null
          id?: string
          is_locked?: boolean
          lock_reason?: string | null
          locked_at?: string | null
          locked_by?: string | null
          notes?: string | null
          previous_stage?: Database["public"]["Enums"]["workflow_stage"] | null
          priority?: string | null
          registry_completed_at?: string | null
          revenue_completed_at?: string | null
          sla_deadline?: string | null
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_workflow_state_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_workflow_state_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_workflow_state_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
        ]
      }
      approval_stages: {
        Row: {
          assigned_at: string | null
          assigned_to: string | null
          attachments: Json | null
          completed_at: string | null
          completed_by: string | null
          created_at: string
          due_date: string | null
          id: string
          notes: string | null
          outcome: string | null
          recommendations: string | null
          stage_name: string
          stage_order: number
          stage_unit: Database["public"]["Enums"]["staff_unit"]
          started_at: string | null
          status: string
          updated_at: string
          workflow_state_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_to?: string | null
          attachments?: Json | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          outcome?: string | null
          recommendations?: string | null
          stage_name: string
          stage_order: number
          stage_unit: Database["public"]["Enums"]["staff_unit"]
          started_at?: string | null
          status?: string
          updated_at?: string
          workflow_state_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_to?: string | null
          attachments?: Json | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          outcome?: string | null
          recommendations?: string | null
          stage_name?: string
          stage_order?: number
          stage_unit?: Database["public"]["Enums"]["staff_unit"]
          started_at?: string | null
          status?: string
          updated_at?: string
          workflow_state_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_stages_workflow_state_id_fkey"
            columns: ["workflow_state_id"]
            isOneToOne: false
            referencedRelation: "application_workflow_state"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown
          target_id: string | null
          target_type: string | null
          target_uuid: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          target_id?: string | null
          target_type?: string | null
          target_uuid?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          target_id?: string | null
          target_type?: string | null
          target_uuid?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      base_document_requirements: {
        Row: {
          applies_to_entities: string[]
          description: string | null
          id: string
          is_mandatory: boolean | null
          name: string
          template_path: string | null
        }
        Insert: {
          applies_to_entities?: string[]
          description?: string | null
          id?: string
          is_mandatory?: boolean | null
          name: string
          template_path?: string | null
        }
        Update: {
          applies_to_entities?: string[]
          description?: string | null
          id?: string
          is_mandatory?: boolean | null
          name?: string
          template_path?: string | null
        }
        Relationships: []
      }
      compliance_assessments: {
        Row: {
          activity_level: string | null
          activity_type: string | null
          administration_form: string | null
          assessed_by: string
          assessment_notes: string | null
          assessment_status: string
          assigned_by: string
          calculated_administration_fee: number | null
          calculated_technical_fee: number | null
          compliance_score: number | null
          created_at: string
          fee_category: string | null
          final_fee_amount: number | null
          id: string
          next_review_date: string | null
          permit_application_id: string
          permit_type_selected: string | null
          processing_days: number | null
          recommendations: string | null
          technical_form: string | null
          updated_at: string
          violations_found: Json | null
        }
        Insert: {
          activity_level?: string | null
          activity_type?: string | null
          administration_form?: string | null
          assessed_by: string
          assessment_notes?: string | null
          assessment_status?: string
          assigned_by: string
          calculated_administration_fee?: number | null
          calculated_technical_fee?: number | null
          compliance_score?: number | null
          created_at?: string
          fee_category?: string | null
          final_fee_amount?: number | null
          id?: string
          next_review_date?: string | null
          permit_application_id: string
          permit_type_selected?: string | null
          processing_days?: number | null
          recommendations?: string | null
          technical_form?: string | null
          updated_at?: string
          violations_found?: Json | null
        }
        Update: {
          activity_level?: string | null
          activity_type?: string | null
          administration_form?: string | null
          assessed_by?: string
          assessment_notes?: string | null
          assessment_status?: string
          assigned_by?: string
          calculated_administration_fee?: number | null
          calculated_technical_fee?: number | null
          compliance_score?: number | null
          created_at?: string
          fee_category?: string | null
          final_fee_amount?: number | null
          id?: string
          next_review_date?: string | null
          permit_application_id?: string
          permit_type_selected?: string | null
          processing_days?: number | null
          recommendations?: string | null
          technical_form?: string | null
          updated_at?: string
          violations_found?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_assessments_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_assessments_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_assessments_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_assessments_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_assessments_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_assessments_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_reports: {
        Row: {
          created_at: string
          description: string | null
          file_path: string | null
          id: string
          permit_id: string
          report_date: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          permit_id: string
          report_date?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          permit_id?: string
          report_date?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_reports_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_reports_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_reports_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_reports_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_reports_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_reports_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_tasks: {
        Row: {
          assigned_by: string
          assigned_to: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          notes: string | null
          priority: string
          progress_percentage: number | null
          related_inspection_id: string | null
          related_intent_id: string | null
          related_permit_id: string | null
          status: string
          task_type: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_by: string
          assigned_to: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          priority?: string
          progress_percentage?: number | null
          related_inspection_id?: string | null
          related_intent_id?: string | null
          related_permit_id?: string | null
          status?: string
          task_type: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string
          assigned_to?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          priority?: string
          progress_percentage?: number | null
          related_inspection_id?: string | null
          related_intent_id?: string | null
          related_permit_id?: string | null
          status?: string
          task_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_tasks_related_inspection_id_fkey"
            columns: ["related_inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_tasks_related_intent_id_fkey"
            columns: ["related_intent_id"]
            isOneToOne: false
            referencedRelation: "intent_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_tasks_related_permit_id_fkey"
            columns: ["related_permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_tasks_related_permit_id_fkey"
            columns: ["related_permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_tasks_related_permit_id_fkey"
            columns: ["related_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_tasks_related_permit_id_fkey"
            columns: ["related_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_tasks_related_permit_id_fkey"
            columns: ["related_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_tasks_related_permit_id_fkey"
            columns: ["related_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_compliance_tasks_inspection"
            columns: ["related_inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      director_approvals: {
        Row: {
          created_at: string
          decided_at: string | null
          decided_by: string | null
          decision: string | null
          decision_notes: string | null
          docusign_envelope_id: string | null
          id: string
          letter_signed: boolean | null
          letter_signed_at: string | null
          priority: string | null
          recommendation: string
          recommendation_notes: string | null
          requires_signature: boolean | null
          signed_document_path: string | null
          submitted_at: string
          submitted_by: string
          submitted_to: string
          updated_at: string
          workflow_state_id: string
        }
        Insert: {
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision?: string | null
          decision_notes?: string | null
          docusign_envelope_id?: string | null
          id?: string
          letter_signed?: boolean | null
          letter_signed_at?: string | null
          priority?: string | null
          recommendation: string
          recommendation_notes?: string | null
          requires_signature?: boolean | null
          signed_document_path?: string | null
          submitted_at?: string
          submitted_by: string
          submitted_to: string
          updated_at?: string
          workflow_state_id: string
        }
        Update: {
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision?: string | null
          decision_notes?: string | null
          docusign_envelope_id?: string | null
          id?: string
          letter_signed?: boolean | null
          letter_signed_at?: string | null
          priority?: string | null
          recommendation?: string
          recommendation_notes?: string | null
          requires_signature?: boolean | null
          signed_document_path?: string | null
          submitted_at?: string
          submitted_by?: string
          submitted_to?: string
          updated_at?: string
          workflow_state_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "director_approvals_workflow_state_id_fkey"
            columns: ["workflow_state_id"]
            isOneToOne: false
            referencedRelation: "application_workflow_state"
            referencedColumns: ["id"]
          },
        ]
      }
      directorate_approvals: {
        Row: {
          application_id: string
          application_type: string
          approval_notes: string | null
          approval_status: string
          created_at: string
          docusign_envelope_id: string | null
          id: string
          intent_registration_id: string | null
          letter_signed: boolean | null
          letter_signed_at: string | null
          priority: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          submitted_at: string
          submitted_by: string
          updated_at: string
        }
        Insert: {
          application_id: string
          application_type: string
          approval_notes?: string | null
          approval_status?: string
          created_at?: string
          docusign_envelope_id?: string | null
          id?: string
          intent_registration_id?: string | null
          letter_signed?: boolean | null
          letter_signed_at?: string | null
          priority?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submitted_at?: string
          submitted_by: string
          updated_at?: string
        }
        Update: {
          application_id?: string
          application_type?: string
          approval_notes?: string | null
          approval_status?: string
          created_at?: string
          docusign_envelope_id?: string | null
          id?: string
          intent_registration_id?: string | null
          letter_signed?: boolean | null
          letter_signed_at?: string | null
          priority?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submitted_at?: string
          submitted_by?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "directorate_approvals_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directorate_approvals_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directorate_approvals_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directorate_approvals_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directorate_approvals_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directorate_approvals_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directorate_approvals_intent_registration_id_fkey"
            columns: ["intent_registration_id"]
            isOneToOne: false
            referencedRelation: "intent_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      directorate_notifications: {
        Row: {
          action_required: boolean | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          priority: string | null
          related_application_id: string | null
          related_approval_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_required?: boolean | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          priority?: string | null
          related_application_id?: string | null
          related_approval_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_required?: boolean | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          priority?: string | null
          related_application_id?: string | null
          related_approval_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "directorate_notifications_related_application_id_fkey"
            columns: ["related_application_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directorate_notifications_related_application_id_fkey"
            columns: ["related_application_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directorate_notifications_related_application_id_fkey"
            columns: ["related_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directorate_notifications_related_application_id_fkey"
            columns: ["related_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directorate_notifications_related_application_id_fkey"
            columns: ["related_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directorate_notifications_related_application_id_fkey"
            columns: ["related_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directorate_notifications_related_approval_id_fkey"
            columns: ["related_approval_id"]
            isOneToOne: false
            referencedRelation: "directorate_approvals"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          document_type: string
          file_path: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_type: string
          file_path?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_type?: string
          file_path?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          document_type: string | null
          entity_id: string | null
          file_path: string
          file_size: number | null
          filename: string
          id: string
          intent_registration_draft_id: string | null
          intent_registration_id: string | null
          mime_type: string | null
          permit_id: string | null
          uploaded_at: string
          user_id: string
        }
        Insert: {
          document_type?: string | null
          entity_id?: string | null
          file_path: string
          file_size?: number | null
          filename: string
          id?: string
          intent_registration_draft_id?: string | null
          intent_registration_id?: string | null
          mime_type?: string | null
          permit_id?: string | null
          uploaded_at?: string
          user_id: string
        }
        Update: {
          document_type?: string | null
          entity_id?: string | null
          file_path?: string
          file_size?: number | null
          filename?: string
          id?: string
          intent_registration_draft_id?: string | null
          intent_registration_id?: string | null
          mime_type?: string | null
          permit_id?: string | null
          uploaded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "documents_intent_registration_draft_id_fkey"
            columns: ["intent_registration_draft_id"]
            isOneToOne: false
            referencedRelation: "intent_registration_drafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_intent_registration_id_fkey"
            columns: ["intent_registration_id"]
            isOneToOne: false
            referencedRelation: "intent_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_documents_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_documents_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_documents_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
        ]
      }
      entities: {
        Row: {
          contact_person: string | null
          contact_person_email: string | null
          contact_person_phone: number | null
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          district: string | null
          email: string | null
          entity_type: string
          id: string
          is_suspended: boolean | null
          name: string
          phone: string | null
          postal_address: string | null
          province: string | null
          registered_address: string | null
          registration_number: string | null
          tax_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_person?: string | null
          contact_person_email?: string | null
          contact_person_phone?: number | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          district?: string | null
          email?: string | null
          entity_type: string
          id?: string
          is_suspended?: boolean | null
          name: string
          phone?: string | null
          postal_address?: string | null
          province?: string | null
          registered_address?: string | null
          registration_number?: string | null
          tax_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_person?: string | null
          contact_person_email?: string | null
          contact_person_phone?: number | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          district?: string | null
          email?: string | null
          entity_type?: string
          id?: string
          is_suspended?: boolean | null
          name?: string
          phone?: string | null
          postal_address?: string | null
          province?: string | null
          registered_address?: string | null
          registration_number?: string | null
          tax_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      fee_calculation_audit: {
        Row: {
          administration_fee: number
          calculated_by: string | null
          calculation_method: string
          created_at: string
          id: string
          is_official: boolean
          notes: string | null
          parameters: Json
          permit_application_id: string
          technical_fee: number
          total_fee: number
        }
        Insert: {
          administration_fee: number
          calculated_by?: string | null
          calculation_method: string
          created_at?: string
          id?: string
          is_official?: boolean
          notes?: string | null
          parameters: Json
          permit_application_id: string
          technical_fee: number
          total_fee: number
        }
        Update: {
          administration_fee?: number
          calculated_by?: string | null
          calculation_method?: string
          created_at?: string
          id?: string
          is_official?: boolean
          notes?: string | null
          parameters?: Json
          permit_application_id?: string
          technical_fee?: number
          total_fee?: number
        }
        Relationships: [
          {
            foreignKeyName: "fee_calculation_audit_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_calculation_audit_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_calculation_audit_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_calculation_audit_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_calculation_audit_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_calculation_audit_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_calculation_methods: {
        Row: {
          created_at: string
          description: string | null
          formula: string
          id: string
          is_active: boolean
          method_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          formula: string
          id?: string
          is_active?: boolean
          method_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          formula?: string
          id?: string
          is_active?: boolean
          method_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      fee_payments: {
        Row: {
          administration_fee: number
          amount_paid: number
          approved_by: string | null
          calculated_by: string | null
          created_at: string
          id: string
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string
          permit_application_id: string
          receipt_number: string | null
          technical_fee: number
          total_fee: number
          updated_at: string
        }
        Insert: {
          administration_fee?: number
          amount_paid?: number
          approved_by?: string | null
          calculated_by?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string
          permit_application_id: string
          receipt_number?: string | null
          technical_fee?: number
          total_fee?: number
          updated_at?: string
        }
        Update: {
          administration_fee?: number
          amount_paid?: number
          approved_by?: string | null
          calculated_by?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string
          permit_application_id?: string
          receipt_number?: string | null
          technical_fee?: number
          total_fee?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_structures: {
        Row: {
          activity_type: string
          administration_form: string
          annual_recurrent_fee: number | null
          base_processing_days: number
          basic_charge: number | null
          calculation_method_id: string | null
          calculation_params: Json | null
          category_multiplier: number
          created_at: string
          fee_category: string
          fee_type: string
          id: string
          is_active: boolean
          max_cost: number | null
          min_cost: number | null
          permit_operation: string
          permit_type: string | null
          technical_form: string
          treatment_factor: number | null
          updated_at: string
          use_factor: number | null
          work_plan_amount: number
        }
        Insert: {
          activity_type: string
          administration_form: string
          annual_recurrent_fee?: number | null
          base_processing_days: number
          basic_charge?: number | null
          calculation_method_id?: string | null
          calculation_params?: Json | null
          category_multiplier?: number
          created_at?: string
          fee_category: string
          fee_type?: string
          id?: string
          is_active?: boolean
          max_cost?: number | null
          min_cost?: number | null
          permit_operation: string
          permit_type?: string | null
          technical_form: string
          treatment_factor?: number | null
          updated_at?: string
          use_factor?: number | null
          work_plan_amount?: number
        }
        Update: {
          activity_type?: string
          administration_form?: string
          annual_recurrent_fee?: number | null
          base_processing_days?: number
          basic_charge?: number | null
          calculation_method_id?: string | null
          calculation_params?: Json | null
          category_multiplier?: number
          created_at?: string
          fee_category?: string
          fee_type?: string
          id?: string
          is_active?: boolean
          max_cost?: number | null
          min_cost?: number | null
          permit_operation?: string
          permit_type?: string | null
          technical_form?: string
          treatment_factor?: number | null
          updated_at?: string
          use_factor?: number | null
          work_plan_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "fee_structures_calculation_method_id_fkey"
            columns: ["calculation_method_id"]
            isOneToOne: false
            referencedRelation: "fee_calculation_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          amount: number
          application_id: string | null
          created_at: string
          currency: string
          due_date: string | null
          follow_up_notes: string | null
          follow_up_required: boolean | null
          id: string
          last_follow_up_date: string | null
          myob_reference: string | null
          paid_date: string | null
          payment_method: string | null
          payment_reference: string | null
          permit_id: string | null
          status: string
          transaction_number: string
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          application_id?: string | null
          created_at?: string
          currency?: string
          due_date?: string | null
          follow_up_notes?: string | null
          follow_up_required?: boolean | null
          id?: string
          last_follow_up_date?: string | null
          myob_reference?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          permit_id?: string | null
          status?: string
          transaction_number: string
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          application_id?: string | null
          created_at?: string
          currency?: string
          due_date?: string | null
          follow_up_notes?: string | null
          follow_up_required?: boolean | null
          id?: string
          last_follow_up_date?: string | null
          myob_reference?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          permit_id?: string | null
          status?: string
          transaction_number?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_fin_trans_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_fin_trans_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_fin_trans_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_fin_trans_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_fin_trans_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_fin_trans_application"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      gis_data: {
        Row: {
          created_at: string | null
          data: Json
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      industrial_sectors: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      inspections: {
        Row: {
          accommodation_cost: number | null
          completed_date: string | null
          created_at: string
          created_by: string | null
          daily_allowance: number | null
          findings: string | null
          id: string
          inspection_type: string
          inspector_id: string | null
          intent_registration_id: string | null
          notes: string | null
          number_of_days: number | null
          permit_application_id: string | null
          permit_category: string | null
          province: string | null
          report_path: string | null
          scheduled_date: string
          status: string
          total_travel_cost: number | null
          transportation_cost: number | null
          updated_at: string
        }
        Insert: {
          accommodation_cost?: number | null
          completed_date?: string | null
          created_at?: string
          created_by?: string | null
          daily_allowance?: number | null
          findings?: string | null
          id?: string
          inspection_type: string
          inspector_id?: string | null
          intent_registration_id?: string | null
          notes?: string | null
          number_of_days?: number | null
          permit_application_id?: string | null
          permit_category?: string | null
          province?: string | null
          report_path?: string | null
          scheduled_date: string
          status?: string
          total_travel_cost?: number | null
          transportation_cost?: number | null
          updated_at?: string
        }
        Update: {
          accommodation_cost?: number | null
          completed_date?: string | null
          created_at?: string
          created_by?: string | null
          daily_allowance?: number | null
          findings?: string | null
          id?: string
          inspection_type?: string
          inspector_id?: string | null
          intent_registration_id?: string | null
          notes?: string | null
          number_of_days?: number | null
          permit_application_id?: string | null
          permit_category?: string | null
          province?: string | null
          report_path?: string | null
          scheduled_date?: string
          status?: string
          total_travel_cost?: number | null
          transportation_cost?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspections_intent_registration_id_fkey"
            columns: ["intent_registration_id"]
            isOneToOne: false
            referencedRelation: "intent_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      intent_registration_drafts: {
        Row: {
          activity_description: string | null
          activity_level: string | null
          approvals_required: string | null
          commencement_date: string | null
          completion_date: string | null
          created_at: string
          departments_approached: string | null
          district: string | null
          draft_name: string | null
          entity_id: string | null
          estimated_cost_kina: number | null
          existing_permit_id: string | null
          government_agreement: string | null
          id: string
          landowner_negotiation_status: string | null
          latitude: number | null
          llg: string | null
          longitude: number | null
          preparatory_work_description: string | null
          prescribed_activity_id: string | null
          project_boundary: Json | null
          project_site_address: string | null
          project_site_description: string | null
          project_title: string | null
          province: string | null
          site_ownership_details: string | null
          total_area_sqkm: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_description?: string | null
          activity_level?: string | null
          approvals_required?: string | null
          commencement_date?: string | null
          completion_date?: string | null
          created_at?: string
          departments_approached?: string | null
          district?: string | null
          draft_name?: string | null
          entity_id?: string | null
          estimated_cost_kina?: number | null
          existing_permit_id?: string | null
          government_agreement?: string | null
          id?: string
          landowner_negotiation_status?: string | null
          latitude?: number | null
          llg?: string | null
          longitude?: number | null
          preparatory_work_description?: string | null
          prescribed_activity_id?: string | null
          project_boundary?: Json | null
          project_site_address?: string | null
          project_site_description?: string | null
          project_title?: string | null
          province?: string | null
          site_ownership_details?: string | null
          total_area_sqkm?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_description?: string | null
          activity_level?: string | null
          approvals_required?: string | null
          commencement_date?: string | null
          completion_date?: string | null
          created_at?: string
          departments_approached?: string | null
          district?: string | null
          draft_name?: string | null
          entity_id?: string | null
          estimated_cost_kina?: number | null
          existing_permit_id?: string | null
          government_agreement?: string | null
          id?: string
          landowner_negotiation_status?: string | null
          latitude?: number | null
          llg?: string | null
          longitude?: number | null
          preparatory_work_description?: string | null
          prescribed_activity_id?: string | null
          project_boundary?: Json | null
          project_site_address?: string | null
          project_site_description?: string | null
          project_title?: string | null
          province?: string | null
          site_ownership_details?: string | null
          total_area_sqkm?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_intent_drafts_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_intent_drafts_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_intent_drafts_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "intent_registration_drafts_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intent_registration_drafts_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intent_registration_drafts_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "intent_registration_drafts_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intent_registration_drafts_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intent_registration_drafts_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intent_registration_drafts_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intent_registration_drafts_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intent_registration_drafts_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intent_registration_drafts_prescribed_activity_id_fkey"
            columns: ["prescribed_activity_id"]
            isOneToOne: false
            referencedRelation: "activity_fee_view"
            referencedColumns: ["activity_id"]
          },
          {
            foreignKeyName: "intent_registration_drafts_prescribed_activity_id_fkey"
            columns: ["prescribed_activity_id"]
            isOneToOne: false
            referencedRelation: "prescribed_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intent_registration_drafts_prescribed_activity_id_fkey"
            columns: ["prescribed_activity_id"]
            isOneToOne: false
            referencedRelation: "vw_activity_options"
            referencedColumns: ["id"]
          },
        ]
      }
      intent_registrations: {
        Row: {
          activity_description: string
          activity_level: string
          approvals_required: string | null
          commencement_date: string
          completion_date: string
          compliance_assigned_at: string | null
          compliance_officer_id: string | null
          compliance_recommendations: string | null
          compliance_review_notes: string | null
          compliance_review_status: string | null
          compliance_reviewed_at: string | null
          compliance_reviewed_by: string | null
          compliance_score: number | null
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          departments_approached: string | null
          district: string | null
          docusign_envelope_id: string | null
          entity_id: string
          estimated_cost_kina: number | null
          existing_permit_id: string | null
          government_agreement: string | null
          id: string
          landowner_negotiation_status: string | null
          latitude: number | null
          llg: string | null
          longitude: number | null
          md_decided_at: string | null
          md_decided_by: string | null
          md_decision: string | null
          md_decision_notes: string | null
          md_review_status: string | null
          official_feedback_attachments: Json | null
          preparatory_work_description: string
          prescribed_activity_id: string | null
          project_boundary: Json | null
          project_site_address: string | null
          project_site_description: string | null
          project_title: string | null
          province: string | null
          registry_assigned_at: string | null
          registry_officer_id: string | null
          registry_review_notes: string | null
          registry_review_status: string | null
          registry_reviewed_at: string | null
          registry_reviewed_by: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          signed_document_path: string | null
          site_ownership_details: string | null
          status: string
          total_area_sqkm: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_description: string
          activity_level: string
          approvals_required?: string | null
          commencement_date: string
          completion_date: string
          compliance_assigned_at?: string | null
          compliance_officer_id?: string | null
          compliance_recommendations?: string | null
          compliance_review_notes?: string | null
          compliance_review_status?: string | null
          compliance_reviewed_at?: string | null
          compliance_reviewed_by?: string | null
          compliance_score?: number | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          departments_approached?: string | null
          district?: string | null
          docusign_envelope_id?: string | null
          entity_id: string
          estimated_cost_kina?: number | null
          existing_permit_id?: string | null
          government_agreement?: string | null
          id?: string
          landowner_negotiation_status?: string | null
          latitude?: number | null
          llg?: string | null
          longitude?: number | null
          md_decided_at?: string | null
          md_decided_by?: string | null
          md_decision?: string | null
          md_decision_notes?: string | null
          md_review_status?: string | null
          official_feedback_attachments?: Json | null
          preparatory_work_description: string
          prescribed_activity_id?: string | null
          project_boundary?: Json | null
          project_site_address?: string | null
          project_site_description?: string | null
          project_title?: string | null
          province?: string | null
          registry_assigned_at?: string | null
          registry_officer_id?: string | null
          registry_review_notes?: string | null
          registry_review_status?: string | null
          registry_reviewed_at?: string | null
          registry_reviewed_by?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          signed_document_path?: string | null
          site_ownership_details?: string | null
          status?: string
          total_area_sqkm?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_description?: string
          activity_level?: string
          approvals_required?: string | null
          commencement_date?: string
          completion_date?: string
          compliance_assigned_at?: string | null
          compliance_officer_id?: string | null
          compliance_recommendations?: string | null
          compliance_review_notes?: string | null
          compliance_review_status?: string | null
          compliance_reviewed_at?: string | null
          compliance_reviewed_by?: string | null
          compliance_score?: number | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          departments_approached?: string | null
          district?: string | null
          docusign_envelope_id?: string | null
          entity_id?: string
          estimated_cost_kina?: number | null
          existing_permit_id?: string | null
          government_agreement?: string | null
          id?: string
          landowner_negotiation_status?: string | null
          latitude?: number | null
          llg?: string | null
          longitude?: number | null
          md_decided_at?: string | null
          md_decided_by?: string | null
          md_decision?: string | null
          md_decision_notes?: string | null
          md_review_status?: string | null
          official_feedback_attachments?: Json | null
          preparatory_work_description?: string
          prescribed_activity_id?: string | null
          project_boundary?: Json | null
          project_site_address?: string | null
          project_site_description?: string | null
          project_title?: string | null
          province?: string | null
          registry_assigned_at?: string | null
          registry_officer_id?: string | null
          registry_review_notes?: string | null
          registry_review_status?: string | null
          registry_reviewed_at?: string | null
          registry_reviewed_by?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          signed_document_path?: string | null
          site_ownership_details?: string | null
          status?: string
          total_area_sqkm?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_intent_reg_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_intent_reg_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_intent_reg_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "intent_registrations_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intent_registrations_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intent_registrations_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "intent_registrations_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intent_registrations_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intent_registrations_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intent_registrations_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intent_registrations_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intent_registrations_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intent_registrations_prescribed_activity_id_fkey"
            columns: ["prescribed_activity_id"]
            isOneToOne: false
            referencedRelation: "activity_fee_view"
            referencedColumns: ["activity_id"]
          },
          {
            foreignKeyName: "intent_registrations_prescribed_activity_id_fkey"
            columns: ["prescribed_activity_id"]
            isOneToOne: false
            referencedRelation: "prescribed_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intent_registrations_prescribed_activity_id_fkey"
            columns: ["prescribed_activity_id"]
            isOneToOne: false
            referencedRelation: "vw_activity_options"
            referencedColumns: ["id"]
          },
        ]
      }
      intent_reviews: {
        Row: {
          assessment: string | null
          compliance_score: number | null
          created_at: string
          decision: string | null
          decision_notes: string | null
          id: string
          intent_registration_id: string
          next_review_date: string | null
          proposed_action: string | null
          recommendations: string | null
          remarks: string | null
          review_stage: string
          reviewed_at: string | null
          reviewer_id: string | null
          status: string | null
          technical_compliance_checks: Json | null
          updated_at: string
          uploaded_documents: Json | null
          validation_checks: Json | null
          violations_found: string[] | null
        }
        Insert: {
          assessment?: string | null
          compliance_score?: number | null
          created_at?: string
          decision?: string | null
          decision_notes?: string | null
          id?: string
          intent_registration_id: string
          next_review_date?: string | null
          proposed_action?: string | null
          recommendations?: string | null
          remarks?: string | null
          review_stage: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string | null
          technical_compliance_checks?: Json | null
          updated_at?: string
          uploaded_documents?: Json | null
          validation_checks?: Json | null
          violations_found?: string[] | null
        }
        Update: {
          assessment?: string | null
          compliance_score?: number | null
          created_at?: string
          decision?: string | null
          decision_notes?: string | null
          id?: string
          intent_registration_id?: string
          next_review_date?: string | null
          proposed_action?: string | null
          recommendations?: string | null
          remarks?: string | null
          review_stage?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string | null
          technical_compliance_checks?: Json | null
          updated_at?: string
          uploaded_documents?: Json | null
          validation_checks?: Json | null
          violations_found?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "intent_reviews_intent_registration_id_fkey"
            columns: ["intent_registration_id"]
            isOneToOne: false
            referencedRelation: "intent_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          accounts_verified: boolean | null
          activity_id: string | null
          amount: number
          assigned_officer_id: string | null
          cepa_receipt_path: string | null
          created_at: string
          currency: string
          document_path: string | null
          due_date: string
          entity_id: string | null
          follow_up_date: string | null
          follow_up_notes: string | null
          id: string
          inspection_id: string | null
          intent_registration_id: string | null
          invoice_number: string
          invoice_type: string | null
          item_code: string | null
          item_description: string | null
          paid_date: string | null
          payment_receipt: string | null
          payment_status: string | null
          permit_id: string | null
          source_dashboard: string | null
          status: string
          stripe_receipt_url: string | null
          transaction_number: string | null
          updated_at: string
          user_id: string
          verification_notes: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          accounts_verified?: boolean | null
          activity_id?: string | null
          amount: number
          assigned_officer_id?: string | null
          cepa_receipt_path?: string | null
          created_at?: string
          currency?: string
          document_path?: string | null
          due_date: string
          entity_id?: string | null
          follow_up_date?: string | null
          follow_up_notes?: string | null
          id?: string
          inspection_id?: string | null
          intent_registration_id?: string | null
          invoice_number: string
          invoice_type?: string | null
          item_code?: string | null
          item_description?: string | null
          paid_date?: string | null
          payment_receipt?: string | null
          payment_status?: string | null
          permit_id?: string | null
          source_dashboard?: string | null
          status?: string
          stripe_receipt_url?: string | null
          transaction_number?: string | null
          updated_at?: string
          user_id: string
          verification_notes?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          accounts_verified?: boolean | null
          activity_id?: string | null
          amount?: number
          assigned_officer_id?: string | null
          cepa_receipt_path?: string | null
          created_at?: string
          currency?: string
          document_path?: string | null
          due_date?: string
          entity_id?: string | null
          follow_up_date?: string | null
          follow_up_notes?: string | null
          id?: string
          inspection_id?: string | null
          intent_registration_id?: string | null
          invoice_number?: string
          invoice_type?: string | null
          item_code?: string | null
          item_description?: string | null
          paid_date?: string | null
          payment_receipt?: string | null
          payment_status?: string | null
          permit_id?: string | null
          source_dashboard?: string | null
          status?: string
          stripe_receipt_url?: string | null
          transaction_number?: string | null
          updated_at?: string
          user_id?: string
          verification_notes?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_invoices_activity"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity_fee_view"
            referencedColumns: ["activity_id"]
          },
          {
            foreignKeyName: "fk_invoices_activity"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "prescribed_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_invoices_activity"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "vw_activity_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_invoices_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_invoices_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_invoices_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "fk_invoices_inspection"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_invoices_intent"
            columns: ["intent_registration_id"]
            isOneToOne: false
            referencedRelation: "intent_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_invoices_permit"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_invoices_permit"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_invoices_permit"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_invoices_permit"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_invoices_permit"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_invoices_permit"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "permit_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "invoices_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_intent_registration_id_fkey"
            columns: ["intent_registration_id"]
            isOneToOne: false
            referencedRelation: "intent_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      manager_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          related_id: string
          target_position: Database["public"]["Enums"]["staff_position"] | null
          target_unit: Database["public"]["Enums"]["staff_unit"]
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          related_id: string
          target_position?: Database["public"]["Enums"]["staff_position"] | null
          target_unit: Database["public"]["Enums"]["staff_unit"]
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          related_id?: string
          target_position?: Database["public"]["Enums"]["staff_position"] | null
          target_unit?: Database["public"]["Enums"]["staff_unit"]
          type?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          related_activity_id: string | null
          related_permit_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          related_activity_id?: string | null
          related_permit_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          related_activity_id?: string | null
          related_permit_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_activity_id_fkey"
            columns: ["related_activity_id"]
            isOneToOne: false
            referencedRelation: "permit_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_permit_id_fkey"
            columns: ["related_permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_permit_id_fkey"
            columns: ["related_permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_permit_id_fkey"
            columns: ["related_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_permit_id_fkey"
            columns: ["related_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_permit_id_fkey"
            columns: ["related_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_permit_id_fkey"
            columns: ["related_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_activities: {
        Row: {
          activity_type: string
          created_at: string
          details: Json | null
          id: string
          permit_id: string
          status: string
          updated_at: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          details?: Json | null
          id?: string
          permit_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          permit_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "permit_activities_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_activities_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_activities_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_activities_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_activities_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_activities_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_amalgamations: {
        Row: {
          amalgamation_reason: string | null
          created_at: string
          id: string
          permit_ids: string[]
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amalgamation_reason?: string | null
          created_at?: string
          id?: string
          permit_ids: string[]
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amalgamation_reason?: string | null
          created_at?: string
          id?: string
          permit_ids?: string[]
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      permit_amendments: {
        Row: {
          amendment_reason: string | null
          amendment_type: string
          created_at: string
          id: string
          permit_id: string
          proposed_changes: Json | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amendment_reason?: string | null
          amendment_type: string
          created_at?: string
          id?: string
          permit_id: string
          proposed_changes?: Json | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amendment_reason?: string | null
          amendment_type?: string
          created_at?: string
          id?: string
          permit_id?: string
          proposed_changes?: Json | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "permit_amendments_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_amendments_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_amendments_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_amendments_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_amendments_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_amendments_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_applications: {
        Row: {
          activity_id: string | null
          activity_location: string | null
          administration_form: string | null
          application_date: string | null
          application_number: string | null
          approval_date: string | null
          assigned_compliance_officer_id: string | null
          assigned_officer_id: string | null
          completed_steps: Json | null
          created_at: string
          current_step: number | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          document_uploads: Json | null
          entity_id: string | null
          existing_permit_id: string | null
          existing_permits_details: string | null
          expiry_date: string | null
          frozen_reason: string | null
          id: string
          industrial_sector_id: string | null
          intent_registration_id: string | null
          is_draft: boolean | null
          is_frozen: boolean | null
          mandatory_fields_complete: boolean | null
          owner_name: string | null
          permit_number: string | null
          permit_period: string | null
          permit_type: string
          permit_type_id: string | null
          status: string
          technical_form: string | null
          title: string
          updated_at: string
          uploaded_files: Json | null
          user_id: string
        }
        Insert: {
          activity_id?: string | null
          activity_location?: string | null
          administration_form?: string | null
          application_date?: string | null
          application_number?: string | null
          approval_date?: string | null
          assigned_compliance_officer_id?: string | null
          assigned_officer_id?: string | null
          completed_steps?: Json | null
          created_at?: string
          current_step?: number | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          document_uploads?: Json | null
          entity_id?: string | null
          existing_permit_id?: string | null
          existing_permits_details?: string | null
          expiry_date?: string | null
          frozen_reason?: string | null
          id?: string
          industrial_sector_id?: string | null
          intent_registration_id?: string | null
          is_draft?: boolean | null
          is_frozen?: boolean | null
          mandatory_fields_complete?: boolean | null
          owner_name?: string | null
          permit_number?: string | null
          permit_period?: string | null
          permit_type: string
          permit_type_id?: string | null
          status?: string
          technical_form?: string | null
          title: string
          updated_at?: string
          uploaded_files?: Json | null
          user_id: string
        }
        Update: {
          activity_id?: string | null
          activity_location?: string | null
          administration_form?: string | null
          application_date?: string | null
          application_number?: string | null
          approval_date?: string | null
          assigned_compliance_officer_id?: string | null
          assigned_officer_id?: string | null
          completed_steps?: Json | null
          created_at?: string
          current_step?: number | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          document_uploads?: Json | null
          entity_id?: string | null
          existing_permit_id?: string | null
          existing_permits_details?: string | null
          expiry_date?: string | null
          frozen_reason?: string | null
          id?: string
          industrial_sector_id?: string | null
          intent_registration_id?: string | null
          is_draft?: boolean | null
          is_frozen?: boolean | null
          mandatory_fields_complete?: boolean | null
          owner_name?: string | null
          permit_number?: string | null
          permit_period?: string | null
          permit_type?: string
          permit_type_id?: string | null
          status?: string
          technical_form?: string | null
          title?: string
          updated_at?: string
          uploaded_files?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_permit_apps_activity"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity_fee_view"
            referencedColumns: ["activity_id"]
          },
          {
            foreignKeyName: "fk_permit_apps_activity"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "prescribed_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_activity"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "vw_activity_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "fk_permit_apps_industrial_sector"
            columns: ["industrial_sector_id"]
            isOneToOne: false
            referencedRelation: "industrial_sectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_intent_reg"
            columns: ["intent_registration_id"]
            isOneToOne: false
            referencedRelation: "intent_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_permit_type"
            columns: ["permit_type_id"]
            isOneToOne: false
            referencedRelation: "permit_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity_fee_view"
            referencedColumns: ["activity_id"]
          },
          {
            foreignKeyName: "permit_applications_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "prescribed_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "vw_activity_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "permit_applications_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_industrial_sector_id_fkey"
            columns: ["industrial_sector_id"]
            isOneToOne: false
            referencedRelation: "industrial_sectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_intent_registration_id_fkey"
            columns: ["intent_registration_id"]
            isOneToOne: false
            referencedRelation: "intent_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_permit_type_id_fkey"
            columns: ["permit_type_id"]
            isOneToOne: false
            referencedRelation: "permit_types"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_chemical_details: {
        Row: {
          chemical_storage_details: Json | null
          created_at: string
          fuel_storage_details: Json | null
          hazardous_material_details: Json | null
          id: string
          mining_chemical_details: Json | null
          ods_details: Json | null
          permit_application_id: string
          pesticide_details: Json | null
          updated_at: string
        }
        Insert: {
          chemical_storage_details?: Json | null
          created_at?: string
          fuel_storage_details?: Json | null
          hazardous_material_details?: Json | null
          id?: string
          mining_chemical_details?: Json | null
          ods_details?: Json | null
          permit_application_id: string
          pesticide_details?: Json | null
          updated_at?: string
        }
        Update: {
          chemical_storage_details?: Json | null
          created_at?: string
          fuel_storage_details?: Json | null
          hazardous_material_details?: Json | null
          id?: string
          mining_chemical_details?: Json | null
          ods_details?: Json | null
          permit_application_id?: string
          pesticide_details?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_permit_chem_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_chem_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_chem_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_chem_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_chem_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_chem_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_chemical_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_chemical_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_chemical_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_chemical_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_chemical_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_chemical_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_chemical_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_chemical_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_chemical_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_chemical_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_chemical_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_chemical_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_classification_details: {
        Row: {
          activity_category: string | null
          activity_classification: string | null
          activity_level: string | null
          activity_subcategory: string | null
          created_at: string
          eia_required: boolean | null
          eis_required: boolean | null
          id: string
          ods_quota_allocation: string | null
          permit_application_id: string
          permit_category: string | null
          permit_type_specific: string | null
          permit_type_specific_data: Json | null
          updated_at: string
        }
        Insert: {
          activity_category?: string | null
          activity_classification?: string | null
          activity_level?: string | null
          activity_subcategory?: string | null
          created_at?: string
          eia_required?: boolean | null
          eis_required?: boolean | null
          id?: string
          ods_quota_allocation?: string | null
          permit_application_id: string
          permit_category?: string | null
          permit_type_specific?: string | null
          permit_type_specific_data?: Json | null
          updated_at?: string
        }
        Update: {
          activity_category?: string | null
          activity_classification?: string | null
          activity_level?: string | null
          activity_subcategory?: string | null
          created_at?: string
          eia_required?: boolean | null
          eis_required?: boolean | null
          id?: string
          ods_quota_allocation?: string | null
          permit_application_id?: string
          permit_category?: string | null
          permit_type_specific?: string | null
          permit_type_specific_data?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_permit_classification_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_classification_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_classification_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_classification_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_classification_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_classification_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_classification_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_classification_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_classification_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_classification_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_classification_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_classification_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_classification_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_classification_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_classification_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_classification_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_classification_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_classification_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_compliance_details: {
        Row: {
          compliance_checks: Json | null
          compliance_commitment: boolean | null
          compliance_commitment_accepted_at: string | null
          created_at: string
          id: string
          legal_declaration_accepted: boolean | null
          legal_declaration_accepted_at: string | null
          permit_application_id: string
          updated_at: string
        }
        Insert: {
          compliance_checks?: Json | null
          compliance_commitment?: boolean | null
          compliance_commitment_accepted_at?: string | null
          created_at?: string
          id?: string
          legal_declaration_accepted?: boolean | null
          legal_declaration_accepted_at?: string | null
          permit_application_id: string
          updated_at?: string
        }
        Update: {
          compliance_checks?: Json | null
          compliance_commitment?: boolean | null
          compliance_commitment_accepted_at?: string | null
          created_at?: string
          id?: string
          legal_declaration_accepted?: boolean | null
          legal_declaration_accepted_at?: string | null
          permit_application_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_permit_compliance_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_compliance_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_compliance_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_compliance_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_compliance_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_compliance_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_compliance_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_compliance_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_compliance_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_compliance_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_compliance_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_compliance_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_compliance_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_compliance_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_compliance_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_compliance_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_compliance_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_compliance_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_consultation_details: {
        Row: {
          consultation_period_end: string | null
          consultation_period_start: string | null
          consulted_departments: string | null
          created_at: string
          government_agreements_details: string | null
          id: string
          landowner_negotiation_status: string | null
          permit_application_id: string
          public_consultation_proof: Json | null
          required_approvals: string | null
          updated_at: string
        }
        Insert: {
          consultation_period_end?: string | null
          consultation_period_start?: string | null
          consulted_departments?: string | null
          created_at?: string
          government_agreements_details?: string | null
          id?: string
          landowner_negotiation_status?: string | null
          permit_application_id: string
          public_consultation_proof?: Json | null
          required_approvals?: string | null
          updated_at?: string
        }
        Update: {
          consultation_period_end?: string | null
          consultation_period_start?: string | null
          consulted_departments?: string | null
          created_at?: string
          government_agreements_details?: string | null
          id?: string
          landowner_negotiation_status?: string | null
          permit_application_id?: string
          public_consultation_proof?: Json | null
          required_approvals?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_permit_consultation_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_consultation_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_consultation_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_consultation_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_consultation_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_consultation_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_consultation_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_consultation_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_consultation_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_consultation_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_consultation_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_consultation_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_consultation_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_consultation_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_consultation_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_consultation_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_consultation_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_consultation_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_emission_details: {
        Row: {
          air_emission_details: Json | null
          created_at: string
          ghg_emission_details: Json | null
          id: string
          noise_emission_details: Json | null
          permit_application_id: string
          updated_at: string
        }
        Insert: {
          air_emission_details?: Json | null
          created_at?: string
          ghg_emission_details?: Json | null
          id?: string
          noise_emission_details?: Json | null
          permit_application_id: string
          updated_at?: string
        }
        Update: {
          air_emission_details?: Json | null
          created_at?: string
          ghg_emission_details?: Json | null
          id?: string
          noise_emission_details?: Json | null
          permit_application_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_permit_emission_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_emission_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_emission_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_emission_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_emission_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_emission_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_emission_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_emission_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_emission_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_emission_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_emission_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_emission_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_emission_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_emission_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_emission_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_emission_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_emission_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_emission_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_environmental_details: {
        Row: {
          biodiversity_abs_details: Json | null
          carbon_offset_details: Json | null
          created_at: string
          id: string
          land_clearing_details: Json | null
          permit_application_id: string
          rehabilitation_details: Json | null
          soil_extraction_details: Json | null
          updated_at: string
          wildlife_trade_details: Json | null
        }
        Insert: {
          biodiversity_abs_details?: Json | null
          carbon_offset_details?: Json | null
          created_at?: string
          id?: string
          land_clearing_details?: Json | null
          permit_application_id: string
          rehabilitation_details?: Json | null
          soil_extraction_details?: Json | null
          updated_at?: string
          wildlife_trade_details?: Json | null
        }
        Update: {
          biodiversity_abs_details?: Json | null
          carbon_offset_details?: Json | null
          created_at?: string
          id?: string
          land_clearing_details?: Json | null
          permit_application_id?: string
          rehabilitation_details?: Json | null
          soil_extraction_details?: Json | null
          updated_at?: string
          wildlife_trade_details?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_permit_env_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_env_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_env_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_env_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_env_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_env_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_environmental_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_environmental_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_environmental_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_environmental_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_environmental_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_environmental_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_environmental_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_environmental_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_environmental_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_environmental_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_environmental_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_environmental_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_fee_details: {
        Row: {
          application_fee: number | null
          composite_fee: number | null
          created_at: string
          fee_amount: number | null
          fee_breakdown: Json | null
          fee_source: string | null
          id: string
          payment_status: string | null
          permit_application_id: string
          processing_days: number | null
          updated_at: string
        }
        Insert: {
          application_fee?: number | null
          composite_fee?: number | null
          created_at?: string
          fee_amount?: number | null
          fee_breakdown?: Json | null
          fee_source?: string | null
          id?: string
          payment_status?: string | null
          permit_application_id: string
          processing_days?: number | null
          updated_at?: string
        }
        Update: {
          application_fee?: number | null
          composite_fee?: number | null
          created_at?: string
          fee_amount?: number | null
          fee_breakdown?: Json | null
          fee_source?: string | null
          id?: string
          payment_status?: string | null
          permit_application_id?: string
          processing_days?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_permit_fee_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_fee_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_fee_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_fee_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_fee_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_fee_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_fee_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_fee_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_fee_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_fee_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_fee_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_fee_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_fee_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_fee_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_fee_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_fee_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_fee_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_fee_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_industry_details: {
        Row: {
          aquaculture_details: Json | null
          created_at: string
          dredging_details: Json | null
          forest_product_details: Json | null
          id: string
          infrastructure_details: Json | null
          mining_permit_details: Json | null
          monitoring_license_details: Json | null
          permit_application_id: string
          renewable_energy_details: Json | null
          research_details: Json | null
          updated_at: string
        }
        Insert: {
          aquaculture_details?: Json | null
          created_at?: string
          dredging_details?: Json | null
          forest_product_details?: Json | null
          id?: string
          infrastructure_details?: Json | null
          mining_permit_details?: Json | null
          monitoring_license_details?: Json | null
          permit_application_id: string
          renewable_energy_details?: Json | null
          research_details?: Json | null
          updated_at?: string
        }
        Update: {
          aquaculture_details?: Json | null
          created_at?: string
          dredging_details?: Json | null
          forest_product_details?: Json | null
          id?: string
          infrastructure_details?: Json | null
          mining_permit_details?: Json | null
          monitoring_license_details?: Json | null
          permit_application_id?: string
          renewable_energy_details?: Json | null
          research_details?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_permit_industry_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_industry_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_industry_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_industry_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_industry_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_industry_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_industry_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_industry_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_industry_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_industry_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_industry_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_industry_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_industry_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_industry_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_industry_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_industry_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_industry_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_industry_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_location_details: {
        Row: {
          coordinates: Json | null
          created_at: string
          district: string | null
          id: string
          land_type: string | null
          legal_description: string | null
          llg: string | null
          permit_application_id: string
          project_boundary: Json | null
          project_site_description: string | null
          province: string | null
          site_ownership_details: string | null
          tenure: string | null
          total_area_sqkm: number | null
          updated_at: string
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string
          district?: string | null
          id?: string
          land_type?: string | null
          legal_description?: string | null
          llg?: string | null
          permit_application_id: string
          project_boundary?: Json | null
          project_site_description?: string | null
          province?: string | null
          site_ownership_details?: string | null
          tenure?: string | null
          total_area_sqkm?: number | null
          updated_at?: string
        }
        Update: {
          coordinates?: Json | null
          created_at?: string
          district?: string | null
          id?: string
          land_type?: string | null
          legal_description?: string | null
          llg?: string | null
          permit_application_id?: string
          project_boundary?: Json | null
          project_site_description?: string | null
          province?: string | null
          site_ownership_details?: string | null
          tenure?: string | null
          total_area_sqkm?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_permit_location_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_location_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_location_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_location_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_location_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_location_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_location_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_location_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_location_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_location_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_location_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_location_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_location_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_location_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_location_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_location_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_location_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_location_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_project_details: {
        Row: {
          commencement_date: string | null
          completion_date: string | null
          created_at: string
          environmental_impact: string | null
          estimated_cost_kina: number | null
          id: string
          mitigation_measures: string | null
          operating_hours: string | null
          operational_capacity: string | null
          operational_details: string | null
          permit_application_id: string
          project_description: string | null
          project_end_date: string | null
          project_start_date: string | null
          proposed_works_description: string | null
          updated_at: string
        }
        Insert: {
          commencement_date?: string | null
          completion_date?: string | null
          created_at?: string
          environmental_impact?: string | null
          estimated_cost_kina?: number | null
          id?: string
          mitigation_measures?: string | null
          operating_hours?: string | null
          operational_capacity?: string | null
          operational_details?: string | null
          permit_application_id: string
          project_description?: string | null
          project_end_date?: string | null
          project_start_date?: string | null
          proposed_works_description?: string | null
          updated_at?: string
        }
        Update: {
          commencement_date?: string | null
          completion_date?: string | null
          created_at?: string
          environmental_impact?: string | null
          estimated_cost_kina?: number | null
          id?: string
          mitigation_measures?: string | null
          operating_hours?: string | null
          operational_capacity?: string | null
          operational_details?: string | null
          permit_application_id?: string
          project_description?: string | null
          project_end_date?: string | null
          project_start_date?: string | null
          proposed_works_description?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_permit_project_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_project_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_project_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_project_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_project_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_project_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_project_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_project_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_project_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_project_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_project_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_project_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_project_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_project_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_project_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_project_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_project_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_project_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_renewals: {
        Row: {
          created_at: string
          id: string
          permit_id: string
          renewal_period_years: number | null
          renewal_reason: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permit_id: string
          renewal_period_years?: number | null
          renewal_reason?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permit_id?: string
          renewal_period_years?: number | null
          renewal_reason?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "permit_renewals_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_renewals_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_renewals_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_renewals_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_renewals_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_renewals_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_reviews: {
        Row: {
          assessment: string | null
          compliance_score: number | null
          created_at: string
          id: string
          next_review_date: string | null
          permit_application_id: string
          proposed_action: string | null
          recommendations: string | null
          remarks: string | null
          review_stage: string
          reviewed_at: string | null
          reviewer_id: string | null
          status: string | null
          technical_compliance_checks: Json | null
          updated_at: string
          uploaded_documents: Json | null
          validation_checks: Json | null
          violations_found: string[] | null
        }
        Insert: {
          assessment?: string | null
          compliance_score?: number | null
          created_at?: string
          id?: string
          next_review_date?: string | null
          permit_application_id: string
          proposed_action?: string | null
          recommendations?: string | null
          remarks?: string | null
          review_stage: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string | null
          technical_compliance_checks?: Json | null
          updated_at?: string
          uploaded_documents?: Json | null
          validation_checks?: Json | null
          violations_found?: string[] | null
        }
        Update: {
          assessment?: string | null
          compliance_score?: number | null
          created_at?: string
          id?: string
          next_review_date?: string | null
          permit_application_id?: string
          proposed_action?: string | null
          recommendations?: string | null
          remarks?: string | null
          review_stage?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string | null
          technical_compliance_checks?: Json | null
          updated_at?: string
          uploaded_documents?: Json | null
          validation_checks?: Json | null
          violations_found?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "permit_reviews_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_reviews_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_reviews_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_reviews_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_reviews_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_reviews_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_surrenders: {
        Row: {
          created_at: string
          effective_date: string | null
          id: string
          permit_id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string | null
          surrender_reason: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          effective_date?: string | null
          id?: string
          permit_id: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          surrender_reason: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          effective_date?: string | null
          id?: string
          permit_id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          surrender_reason?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "permit_surrenders_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_surrenders_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_surrenders_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_surrenders_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_surrenders_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_surrenders_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_transfers: {
        Row: {
          created_at: string
          id: string
          permit_id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string | null
          transfer_reason: string | null
          transferee_entity_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permit_id: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          transfer_reason?: string | null
          transferee_entity_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permit_id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          transfer_reason?: string | null
          transferee_entity_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "permit_transfers_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_transfers_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_transfers_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_transfers_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_transfers_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_transfers_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_transfers_transferee_entity_id_fkey"
            columns: ["transferee_entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_transfers_transferee_entity_id_fkey"
            columns: ["transferee_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_transfers_transferee_entity_id_fkey"
            columns: ["transferee_entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
        ]
      }
      permit_type_fields: {
        Row: {
          created_at: string
          field_label: string
          field_name: string
          field_options: Json | null
          field_type: string
          help_text: string | null
          id: string
          is_active: boolean
          is_mandatory: boolean
          permit_type_id: string
          placeholder: string | null
          sort_order: number
          updated_at: string
          validation_rules: Json | null
        }
        Insert: {
          created_at?: string
          field_label: string
          field_name: string
          field_options?: Json | null
          field_type: string
          help_text?: string | null
          id?: string
          is_active?: boolean
          is_mandatory?: boolean
          permit_type_id: string
          placeholder?: string | null
          sort_order?: number
          updated_at?: string
          validation_rules?: Json | null
        }
        Update: {
          created_at?: string
          field_label?: string
          field_name?: string
          field_options?: Json | null
          field_type?: string
          help_text?: string | null
          id?: string
          is_active?: boolean
          is_mandatory?: boolean
          permit_type_id?: string
          placeholder?: string | null
          sort_order?: number
          updated_at?: string
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "permit_type_fields_permit_type_id_fkey"
            columns: ["permit_type_id"]
            isOneToOne: false
            referencedRelation: "permit_types"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_types: {
        Row: {
          category: string
          created_at: string
          display_name: string
          icon_name: string | null
          id: string
          industrial_sector: string | null
          is_active: boolean
          jsonb_column_name: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          display_name: string
          icon_name?: string | null
          id?: string
          industrial_sector?: string | null
          is_active?: boolean
          jsonb_column_name: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          display_name?: string
          icon_name?: string | null
          id?: string
          industrial_sector?: string | null
          is_active?: boolean
          jsonb_column_name?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "permit_types_industrial_sector_fkey"
            columns: ["industrial_sector"]
            isOneToOne: false
            referencedRelation: "industrial_sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_water_waste_details: {
        Row: {
          created_at: string
          effluent_discharge_details: Json | null
          hazardous_waste_details: Json | null
          id: string
          marine_dumping_details: Json | null
          permit_application_id: string
          solid_waste_details: Json | null
          stormwater_details: Json | null
          updated_at: string
          waste_contaminant_details: Json | null
          water_extraction_details: Json | null
        }
        Insert: {
          created_at?: string
          effluent_discharge_details?: Json | null
          hazardous_waste_details?: Json | null
          id?: string
          marine_dumping_details?: Json | null
          permit_application_id: string
          solid_waste_details?: Json | null
          stormwater_details?: Json | null
          updated_at?: string
          waste_contaminant_details?: Json | null
          water_extraction_details?: Json | null
        }
        Update: {
          created_at?: string
          effluent_discharge_details?: Json | null
          hazardous_waste_details?: Json | null
          id?: string
          marine_dumping_details?: Json | null
          permit_application_id?: string
          solid_waste_details?: Json | null
          stormwater_details?: Json | null
          updated_at?: string
          waste_contaminant_details?: Json | null
          water_extraction_details?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_permit_water_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_water_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_water_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_water_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_water_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_water_app"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_water_waste_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_water_waste_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_water_waste_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_water_waste_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_water_waste_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_water_waste_details_application"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_water_waste_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_water_waste_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_water_waste_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_water_waste_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_water_waste_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_water_waste_details_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: true
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      prescribed_activities: {
        Row: {
          activity_description: string
          category_number: string
          category_type: string
          created_at: string
          fee_category: string | null
          id: string
          level: number
          sub_category: string
        }
        Insert: {
          activity_description: string
          category_number: string
          category_type: string
          created_at?: string
          fee_category?: string | null
          id?: string
          level: number
          sub_category: string
        }
        Update: {
          activity_description?: string
          category_number?: string
          category_type?: string
          created_at?: string
          fee_category?: string | null
          id?: string
          level?: number
          sub_category?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          is_active: boolean
          is_suspended: boolean | null
          last_name: string | null
          must_change_password: boolean | null
          organization: string | null
          password_changed_at: string | null
          phone: string | null
          staff_position: Database["public"]["Enums"]["staff_position"] | null
          staff_unit: Database["public"]["Enums"]["staff_unit"] | null
          suspended_at: string | null
          suspended_by: string | null
          suspension_reason: string | null
          two_fa_enabled: boolean
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          is_suspended?: boolean | null
          last_name?: string | null
          must_change_password?: boolean | null
          organization?: string | null
          password_changed_at?: string | null
          phone?: string | null
          staff_position?: Database["public"]["Enums"]["staff_position"] | null
          staff_unit?: Database["public"]["Enums"]["staff_unit"] | null
          suspended_at?: string | null
          suspended_by?: string | null
          suspension_reason?: string | null
          two_fa_enabled?: boolean
          updated_at?: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          is_suspended?: boolean | null
          last_name?: string | null
          must_change_password?: boolean | null
          organization?: string | null
          password_changed_at?: string | null
          phone?: string | null
          staff_position?: Database["public"]["Enums"]["staff_position"] | null
          staff_unit?: Database["public"]["Enums"]["staff_unit"] | null
          suspended_at?: string | null
          suspended_by?: string | null
          suspension_reason?: string | null
          two_fa_enabled?: boolean
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      project_aois: {
        Row: {
          created_at: string | null
          geometry: Json
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          geometry: Json
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          geometry?: Json
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      registry_audit_trail: {
        Row: {
          action_type: string
          assessment_id: string | null
          assessment_notes: string | null
          changes_made: Json | null
          created_at: string
          feedback_provided: string | null
          id: string
          metadata: Json | null
          new_outcome: string | null
          new_status: string | null
          officer_email: string | null
          officer_id: string
          officer_name: string | null
          permit_application_id: string
          previous_outcome: string | null
          previous_status: string | null
        }
        Insert: {
          action_type: string
          assessment_id?: string | null
          assessment_notes?: string | null
          changes_made?: Json | null
          created_at?: string
          feedback_provided?: string | null
          id?: string
          metadata?: Json | null
          new_outcome?: string | null
          new_status?: string | null
          officer_email?: string | null
          officer_id: string
          officer_name?: string | null
          permit_application_id: string
          previous_outcome?: string | null
          previous_status?: string | null
        }
        Update: {
          action_type?: string
          assessment_id?: string | null
          assessment_notes?: string | null
          changes_made?: Json | null
          created_at?: string
          feedback_provided?: string | null
          id?: string
          metadata?: Json | null
          new_outcome?: string | null
          new_status?: string | null
          officer_email?: string | null
          officer_id?: string
          officer_name?: string | null
          permit_application_id?: string
          previous_outcome?: string | null
          previous_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registry_audit_trail_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registry_audit_trail_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registry_audit_trail_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registry_audit_trail_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registry_audit_trail_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registry_audit_trail_permit_application_id_fkey"
            columns: ["permit_application_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      registry_tasks: {
        Row: {
          assigned_by: string
          assigned_to: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          notes: string | null
          priority: string
          progress_percentage: number
          related_permit_id: string | null
          status: string
          task_type: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_by: string
          assigned_to: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          priority?: string
          progress_percentage?: number
          related_permit_id?: string | null
          status?: string
          task_type: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string
          assigned_to?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          priority?: string
          progress_percentage?: number
          related_permit_id?: string | null
          status?: string
          task_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "registry_tasks_related_permit_id_fkey"
            columns: ["related_permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registry_tasks_related_permit_id_fkey"
            columns: ["related_permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registry_tasks_related_permit_id_fkey"
            columns: ["related_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registry_tasks_related_permit_id_fkey"
            columns: ["related_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registry_tasks_related_permit_id_fkey"
            columns: ["related_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registry_tasks_related_permit_id_fkey"
            columns: ["related_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      required_documents: {
        Row: {
          created_at: string
          document_name: string
          id: string
          is_mandatory: boolean
          reference: string
        }
        Insert: {
          created_at?: string
          document_name: string
          id?: string
          is_mandatory?: boolean
          reference: string
        }
        Update: {
          created_at?: string
          document_name?: string
          id?: string
          is_mandatory?: boolean
          reference?: string
        }
        Relationships: []
      }
      revenue_item_codes: {
        Row: {
          created_at: string | null
          id: string
          item_description: string | null
          item_name: string
          item_number: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_description?: string | null
          item_name: string
          item_number: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_description?: string | null
          item_name?: string
          item_number?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      revenue_tasks: {
        Row: {
          assigned_by: string
          assigned_to: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          notes: string | null
          priority: string
          progress_percentage: number
          related_invoice_id: string | null
          status: string
          task_type: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_by: string
          assigned_to: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          priority?: string
          progress_percentage?: number
          related_invoice_id?: string | null
          status?: string
          task_type: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string
          assigned_to?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          priority?: string
          progress_percentage?: number
          related_invoice_id?: string | null
          status?: string
          task_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenue_tasks_related_invoice_id_fkey"
            columns: ["related_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      system_metrics: {
        Row: {
          id: string
          metric_data: Json | null
          metric_name: string
          metric_value: number | null
          recorded_at: string | null
        }
        Insert: {
          id?: string
          metric_data?: Json | null
          metric_name: string
          metric_value?: number | null
          recorded_at?: string | null
        }
        Update: {
          id?: string
          metric_data?: Json | null
          metric_name?: string
          metric_value?: number | null
          recorded_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      active_entities: {
        Row: {
          contact_person: string | null
          contact_person_email: string | null
          contact_person_phone: number | null
          created_at: string | null
          deleted_at: string | null
          deleted_by: string | null
          district: string | null
          email: string | null
          entity_type: string | null
          id: string | null
          is_suspended: boolean | null
          name: string | null
          phone: string | null
          postal_address: string | null
          province: string | null
          registered_address: string | null
          registration_number: string | null
          tax_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          contact_person?: string | null
          contact_person_email?: string | null
          contact_person_phone?: number | null
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          district?: string | null
          email?: string | null
          entity_type?: string | null
          id?: string | null
          is_suspended?: boolean | null
          name?: string | null
          phone?: string | null
          postal_address?: string | null
          province?: string | null
          registered_address?: string | null
          registration_number?: string | null
          tax_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          contact_person?: string | null
          contact_person_email?: string | null
          contact_person_phone?: number | null
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          district?: string | null
          email?: string | null
          entity_type?: string | null
          id?: string | null
          is_suspended?: boolean | null
          name?: string | null
          phone?: string | null
          postal_address?: string | null
          province?: string | null
          registered_address?: string | null
          registration_number?: string | null
          tax_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      active_permit_applications: {
        Row: {
          activity_id: string | null
          activity_location: string | null
          administration_form: string | null
          application_date: string | null
          application_number: string | null
          approval_date: string | null
          assigned_compliance_officer_id: string | null
          assigned_officer_id: string | null
          completed_steps: Json | null
          created_at: string | null
          current_step: number | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          document_uploads: Json | null
          entity_id: string | null
          existing_permit_id: string | null
          existing_permits_details: string | null
          expiry_date: string | null
          frozen_reason: string | null
          id: string | null
          industrial_sector_id: string | null
          intent_registration_id: string | null
          is_draft: boolean | null
          is_frozen: boolean | null
          mandatory_fields_complete: boolean | null
          owner_name: string | null
          permit_number: string | null
          permit_period: string | null
          permit_type: string | null
          permit_type_id: string | null
          status: string | null
          technical_form: string | null
          title: string | null
          updated_at: string | null
          uploaded_files: Json | null
          user_id: string | null
        }
        Insert: {
          activity_id?: string | null
          activity_location?: string | null
          administration_form?: string | null
          application_date?: string | null
          application_number?: string | null
          approval_date?: string | null
          assigned_compliance_officer_id?: string | null
          assigned_officer_id?: string | null
          completed_steps?: Json | null
          created_at?: string | null
          current_step?: number | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          document_uploads?: Json | null
          entity_id?: string | null
          existing_permit_id?: string | null
          existing_permits_details?: string | null
          expiry_date?: string | null
          frozen_reason?: string | null
          id?: string | null
          industrial_sector_id?: string | null
          intent_registration_id?: string | null
          is_draft?: boolean | null
          is_frozen?: boolean | null
          mandatory_fields_complete?: boolean | null
          owner_name?: string | null
          permit_number?: string | null
          permit_period?: string | null
          permit_type?: string | null
          permit_type_id?: string | null
          status?: string | null
          technical_form?: string | null
          title?: string | null
          updated_at?: string | null
          uploaded_files?: Json | null
          user_id?: string | null
        }
        Update: {
          activity_id?: string | null
          activity_location?: string | null
          administration_form?: string | null
          application_date?: string | null
          application_number?: string | null
          approval_date?: string | null
          assigned_compliance_officer_id?: string | null
          assigned_officer_id?: string | null
          completed_steps?: Json | null
          created_at?: string | null
          current_step?: number | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          document_uploads?: Json | null
          entity_id?: string | null
          existing_permit_id?: string | null
          existing_permits_details?: string | null
          expiry_date?: string | null
          frozen_reason?: string | null
          id?: string | null
          industrial_sector_id?: string | null
          intent_registration_id?: string | null
          is_draft?: boolean | null
          is_frozen?: boolean | null
          mandatory_fields_complete?: boolean | null
          owner_name?: string | null
          permit_number?: string | null
          permit_period?: string | null
          permit_type?: string | null
          permit_type_id?: string | null
          status?: string | null
          technical_form?: string | null
          title?: string | null
          updated_at?: string | null
          uploaded_files?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_permit_apps_activity"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity_fee_view"
            referencedColumns: ["activity_id"]
          },
          {
            foreignKeyName: "fk_permit_apps_activity"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "prescribed_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_activity"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "vw_activity_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "fk_permit_apps_industrial_sector"
            columns: ["industrial_sector_id"]
            isOneToOne: false
            referencedRelation: "industrial_sectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_intent_reg"
            columns: ["intent_registration_id"]
            isOneToOne: false
            referencedRelation: "intent_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_permit_type"
            columns: ["permit_type_id"]
            isOneToOne: false
            referencedRelation: "permit_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity_fee_view"
            referencedColumns: ["activity_id"]
          },
          {
            foreignKeyName: "permit_applications_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "prescribed_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "vw_activity_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "permit_applications_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_industrial_sector_id_fkey"
            columns: ["industrial_sector_id"]
            isOneToOne: false
            referencedRelation: "industrial_sectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_intent_registration_id_fkey"
            columns: ["intent_registration_id"]
            isOneToOne: false
            referencedRelation: "intent_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_permit_type_id_fkey"
            columns: ["permit_type_id"]
            isOneToOne: false
            referencedRelation: "permit_types"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_fee_view: {
        Row: {
          activity_description: string | null
          activity_id: string | null
          administration_form: string | null
          annual_recurrent_fee: number | null
          base_processing_days: number | null
          calculation_method: string | null
          category_number: string | null
          category_type: string | null
          fee_structure_id: string | null
          formula: string | null
          fs_fee_category: string | null
          is_default: boolean | null
          level: number | null
          pa_fee_category: string | null
          permit_type: string | null
          technical_form: string | null
          work_plan_amount: number | null
        }
        Relationships: []
      }
      vw_activity_options: {
        Row: {
          display_name: string | null
          id: string | null
          level: number | null
        }
        Insert: {
          display_name?: never
          id?: string | null
          level?: number | null
        }
        Update: {
          display_name?: never
          id?: string | null
          level?: number | null
        }
        Relationships: []
      }
      vw_compliance_reports_list: {
        Row: {
          activity_classification: string | null
          activity_level: string | null
          created_at: string | null
          description: string | null
          district: string | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          file_path: string | null
          id: string | null
          permit_category: string | null
          permit_id: string | null
          permit_number: string | null
          permit_type: string | null
          project_description: string | null
          project_title: string | null
          province: string | null
          report_date: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_email: string | null
          reviewer_name: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_reports_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_reports_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_reports_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_reports_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_reports_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_reports_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_permit_applications_compliance: {
        Row: {
          activity_classification: string | null
          activity_level: string | null
          application_date: string | null
          assigned_compliance_officer_id: string | null
          compliance_checks: Json | null
          compliance_commitment: boolean | null
          compliance_officer_email: string | null
          compliance_officer_name: string | null
          created_at: string | null
          district: string | null
          eia_required: boolean | null
          eis_required: boolean | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          id: string | null
          legal_declaration_accepted: boolean | null
          permit_number: string | null
          permit_type: string | null
          province: string | null
          status: string | null
          title: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_permit_apps_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "permit_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
        ]
      }
      vw_permit_applications_full: {
        Row: {
          activity_category: string | null
          activity_category_number: string | null
          activity_classification: string | null
          activity_id: string | null
          activity_level: string | null
          activity_level_number: number | null
          activity_location: string | null
          activity_subcategory: string | null
          air_emission_details: Json | null
          application_date: string | null
          application_fee: number | null
          application_number: string | null
          approval_date: string | null
          aquaculture_details: Json | null
          biodiversity_abs_details: Json | null
          carbon_offset_details: Json | null
          chemical_details_id: string | null
          chemical_storage_details: Json | null
          classification_details_id: string | null
          commencement_date: string | null
          completion_date: string | null
          compliance_checks: Json | null
          compliance_commitment: boolean | null
          compliance_commitment_accepted_at: string | null
          compliance_details_id: string | null
          composite_fee: number | null
          consultation_details_id: string | null
          consultation_period_end: string | null
          consultation_period_start: string | null
          consulted_departments: string | null
          contact_person: string | null
          contact_person_email: string | null
          contact_person_phone: number | null
          coordinates: Json | null
          created_at: string | null
          current_step: number | null
          description: string | null
          district: string | null
          document_uploads: Json | null
          dredging_details: Json | null
          effluent_discharge_details: Json | null
          eia_required: boolean | null
          eis_required: boolean | null
          emission_details_id: string | null
          entity_email: string | null
          entity_id: string | null
          entity_name: string | null
          entity_phone: string | null
          entity_type: string | null
          environmental_details_id: string | null
          environmental_impact: string | null
          estimated_cost_kina: number | null
          existing_permit_id: string | null
          expiry_date: string | null
          fee_amount: number | null
          fee_breakdown: Json | null
          fee_details_id: string | null
          fee_payment_status: string | null
          fee_source: string | null
          forest_product_details: Json | null
          fuel_storage_details: Json | null
          ghg_emission_details: Json | null
          government_agreements_details: string | null
          hazardous_material_details: Json | null
          hazardous_waste_details: Json | null
          id: string | null
          industrial_sector_id: string | null
          industry_details_id: string | null
          infrastructure_details: Json | null
          intent_registration_id: string | null
          is_draft: boolean | null
          land_clearing_details: Json | null
          land_type: string | null
          landowner_negotiation_status: string | null
          legal_declaration_accepted: boolean | null
          legal_declaration_accepted_at: string | null
          legal_description: string | null
          llg: string | null
          location_details_id: string | null
          mandatory_fields_complete: boolean | null
          marine_dumping_details: Json | null
          mining_chemical_details: Json | null
          mining_permit_details: Json | null
          mitigation_measures: string | null
          monitoring_license_details: Json | null
          noise_emission_details: Json | null
          ods_details: Json | null
          ods_quota_allocation: string | null
          operating_hours: string | null
          operational_capacity: string | null
          operational_details: string | null
          owner_name: string | null
          permit_category: string | null
          permit_number: string | null
          permit_period: string | null
          permit_type: string | null
          permit_type_id: string | null
          permit_type_specific: string | null
          permit_type_specific_data: Json | null
          pesticide_details: Json | null
          postal_address: string | null
          prescribed_activity_description: string | null
          processing_days: number | null
          project_boundary: Json | null
          project_description: string | null
          project_details_id: string | null
          project_end_date: string | null
          project_site_description: string | null
          project_start_date: string | null
          proposed_works_description: string | null
          province: string | null
          public_consultation_proof: Json | null
          registered_address: string | null
          registration_number: string | null
          rehabilitation_details: Json | null
          renewable_energy_details: Json | null
          required_approvals: string | null
          research_details: Json | null
          site_ownership_details: string | null
          soil_extraction_details: Json | null
          solid_waste_details: Json | null
          status: string | null
          stormwater_details: Json | null
          tax_number: string | null
          tenure: string | null
          title: string | null
          total_area_sqkm: number | null
          updated_at: string | null
          uploaded_files: Json | null
          user_id: string | null
          waste_contaminant_details: Json | null
          water_extraction_details: Json | null
          water_waste_details_id: string | null
          wildlife_trade_details: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_permit_apps_activity"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity_fee_view"
            referencedColumns: ["activity_id"]
          },
          {
            foreignKeyName: "fk_permit_apps_activity"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "prescribed_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_activity"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "vw_activity_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "fk_permit_apps_industrial_sector"
            columns: ["industrial_sector_id"]
            isOneToOne: false
            referencedRelation: "industrial_sectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_intent_reg"
            columns: ["intent_registration_id"]
            isOneToOne: false
            referencedRelation: "intent_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_permit_type"
            columns: ["permit_type_id"]
            isOneToOne: false
            referencedRelation: "permit_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity_fee_view"
            referencedColumns: ["activity_id"]
          },
          {
            foreignKeyName: "permit_applications_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "prescribed_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "vw_activity_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "permit_applications_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "active_permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "permit_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_compliance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_full"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_existing_permit_id_fkey"
            columns: ["existing_permit_id"]
            isOneToOne: false
            referencedRelation: "vw_permit_applications_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_industrial_sector_id_fkey"
            columns: ["industrial_sector_id"]
            isOneToOne: false
            referencedRelation: "industrial_sectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_intent_registration_id_fkey"
            columns: ["intent_registration_id"]
            isOneToOne: false
            referencedRelation: "intent_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_permit_type_id_fkey"
            columns: ["permit_type_id"]
            isOneToOne: false
            referencedRelation: "permit_types"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_permit_applications_list: {
        Row: {
          activity_id: string | null
          activity_level: string | null
          application_number: string | null
          approval_date: string | null
          created_at: string | null
          description: string | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          id: string | null
          permit_number: string | null
          permit_type: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_permit_apps_activity"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity_fee_view"
            referencedColumns: ["activity_id"]
          },
          {
            foreignKeyName: "fk_permit_apps_activity"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "prescribed_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_activity"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "vw_activity_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "permit_applications_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activity_fee_view"
            referencedColumns: ["activity_id"]
          },
          {
            foreignKeyName: "permit_applications_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "prescribed_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "vw_activity_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
        ]
      }
      vw_permit_applications_registry: {
        Row: {
          activity_classification: string | null
          activity_level: string | null
          application_date: string | null
          application_number: string | null
          approval_date: string | null
          assigned_officer_email: string | null
          assigned_officer_id: string | null
          assigned_officer_name: string | null
          commencement_date: string | null
          completion_date: string | null
          created_at: string | null
          district: string | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          estimated_cost_kina: number | null
          fee_amount: number | null
          id: string | null
          is_draft: boolean | null
          llg: string | null
          payment_status: string | null
          permit_category: string | null
          permit_number: string | null
          permit_type: string | null
          province: string | null
          registration_number: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_permit_apps_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_permit_apps_entity"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "permit_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "active_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permit_applications_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "vw_compliance_reports_list"
            referencedColumns: ["entity_id"]
          },
        ]
      }
    }
    Functions: {
      backup_old_audit_logs: {
        Args: { days_threshold?: number }
        Returns: {
          backup_count: number
          backup_file: string
        }[]
      }
      calculate_application_fee: {
        Args: {
          p_activity_id: string
          p_custom_processing_days?: number
          p_permit_type?: string
        }
        Returns: number
      }
      calculate_fee: { Args: never; Returns: undefined }
      calculate_permit_fee_complete: {
        Args: {
          p_activity_level: string
          p_activity_subcategory: string
          p_activity_type: string
          p_duration_years?: number
          p_land_area?: number
          p_ods_details?: Json
          p_permit_type: string
          p_project_cost?: number
          p_waste_details?: Json
        }
        Returns: {
          base_amount: number
          calculated_amount: number
          calculation_method: string
          component_id: string
          component_name: string
          fee_category: string
          formula_used: string
          is_mandatory: boolean
          notes: string
        }[]
      }
      can_update_user_role: {
        Args: { new_role: string; target_user_id: string }
        Returns: boolean
      }
      clean_old_drafts: { Args: { days_old?: number }; Returns: number }
      clear_old_audit_logs: {
        Args: { days_threshold?: number }
        Returns: number
      }
      clear_old_system_logs: {
        Args: { days_threshold?: number }
        Returns: number
      }
      create_database_backup: {
        Args: { backup_filename: string; backup_format: string }
        Returns: Json
      }
      create_workflow_state: {
        Args: {
          p_applicant_id: string
          p_application_id: string
          p_application_number?: string
          p_application_type: Database["public"]["Enums"]["application_category"]
          p_entity_id?: string
        }
        Returns: string
      }
      freeze_entity_records: {
        Args: {
          entity_id_param: string
          freeze_reason?: string
          should_freeze: boolean
        }
        Returns: undefined
      }
      generate_secure_password: { Args: never; Returns: string }
      generate_secure_password_v2: { Args: never; Returns: string }
      get_activities: { Args: never; Returns: Json }
      get_applicable_fee_structures: {
        Args: { p_activity_id: string }
        Returns: {
          annual_recurrent_fee: number
          calculation_method: string
          fee_category: string
          fee_structure_id: string
          formula: string
          is_default: boolean
          permit_type: string
        }[]
      }
      get_current_user_staff_unit: { Args: never; Returns: string }
      get_intent_registrations_with_reviewer: {
        Args: { requesting_user_id: string }
        Returns: {
          activity_description: string
          activity_level: string
          approvals_required: string
          commencement_date: string
          completion_date: string
          created_at: string
          departments_approached: string
          district: string
          docusign_envelope_id: string
          entity_id: string
          estimated_cost_kina: number
          existing_permit_id: string
          government_agreement: string
          id: string
          landowner_negotiation_status: string
          llg: string
          official_feedback_attachments: Json
          preparatory_work_description: string
          prescribed_activity_id: string
          project_boundary: Json
          project_site_address: string
          project_site_description: string
          project_title: string
          province: string
          review_notes: string
          reviewed_at: string
          reviewed_by: string
          reviewer_email: string
          reviewer_first_name: string
          reviewer_last_name: string
          signed_document_path: string
          site_ownership_details: string
          status: string
          total_area_sqkm: number
          updated_at: string
          user_id: string
        }[]
      }
      get_prescribed_activities: { Args: never; Returns: Json }
      get_table_statistics: {
        Args: never
        Returns: {
          row_count: number
          size_bytes: number
          table_name: string
          total_size: string
        }[]
      }
      get_user_staff_position: { Args: never; Returns: string }
      get_user_staff_unit: { Args: never; Returns: string }
      get_user_type: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_admin_or_super_admin: { Args: never; Returns: boolean }
      is_admin_or_super_admin_user: { Args: never; Returns: boolean }
      is_admin_user: { Args: never; Returns: boolean }
      is_compliance_staff_user: { Args: never; Returns: boolean }
      is_managing_director: { Args: never; Returns: boolean }
      is_public_user: { Args: never; Returns: boolean }
      is_registry_staff: { Args: never; Returns: boolean }
      is_registry_staff_user: { Args: never; Returns: boolean }
      is_revenue_staff_user: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      lock_workflow: {
        Args: {
          p_lock: boolean
          p_reason?: string
          p_user_id: string
          p_workflow_id: string
        }
        Returns: boolean
      }
      log_audit_event: {
        Args: {
          p_action: string
          p_details?: Json
          p_ip_address?: unknown
          p_target_id?: string
          p_target_type?: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
      log_fee_calculation: {
        Args: {
          p_administration_fee: number
          p_calculation_method: string
          p_is_official?: boolean
          p_notes?: string
          p_parameters: Json
          p_permit_application_id: string
          p_technical_fee: number
          p_total_fee: number
        }
        Returns: string
      }
      log_registry_action: {
        Args: {
          p_action_type: string
          p_assessment_id: string
          p_assessment_notes?: string
          p_changes_made?: Json
          p_feedback_provided?: string
          p_metadata?: Json
          p_new_outcome?: string
          p_new_status?: string
          p_officer_id: string
          p_permit_application_id: string
          p_previous_outcome?: string
          p_previous_status?: string
        }
        Returns: string
      }
      rebuild_database_indexes: { Args: never; Returns: undefined }
      record_system_metric: {
        Args: {
          p_metric_data?: Json
          p_metric_name: string
          p_metric_value?: number
        }
        Returns: string
      }
      send_workflow_notification: {
        Args: {
          p_message: string
          p_notification_type: string
          p_priority?: string
          p_recipient_id: string
          p_recipient_type: string
          p_requires_action?: boolean
          p_title: string
          p_workflow_id: string
        }
        Returns: string
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      transition_workflow_stage: {
        Args: {
          p_attachments?: Json
          p_notes?: string
          p_performer_id: string
          p_to_stage: Database["public"]["Enums"]["workflow_stage"]
          p_workflow_id: string
        }
        Returns: boolean
      }
      update_database_statistics: { Args: never; Returns: undefined }
      update_user_role_secure: {
        Args: {
          new_role: string
          new_staff_position?: string
          new_staff_unit?: string
          target_user_id: string
        }
        Returns: boolean
      }
      update_user_role_secure_v2: {
        Args: {
          new_role: string
          new_staff_position?: string
          new_staff_unit?: string
          target_user_id: string
        }
        Returns: boolean
      }
      vacuum_analyze_database: { Args: never; Returns: undefined }
      validate_assessment_prerequisites: {
        Args: { p_permit_application_id: string }
        Returns: Json
      }
      validate_documents: {
        Args: { activity_id: string; uploaded_docs: Json }
        Returns: Json
      }
    }
    Enums: {
      application_category:
        | "intent_registration"
        | "new_permit"
        | "permit_renewal"
        | "permit_transfer"
        | "permit_amendment"
        | "permit_amalgamation"
        | "permit_surrender"
        | "compliance_report"
      application_status:
        | "draft"
        | "pending"
        | "submitted"
        | "under_review"
        | "under_assessment"
        | "awaiting_payment"
        | "in_progress"
        | "approved"
        | "rejected"
        | "cancelled"
        | "revoked"
        | "expired"
        | "completed"
        | "suspended"
      approval_status_enum:
        | "pending"
        | "approved"
        | "rejected"
        | "requires_revision"
      assessment_status_enum:
        | "pending"
        | "in_progress"
        | "completed"
        | "requires_revision"
      inspection_status_enum:
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "postponed"
      payment_status_enum:
        | "pending"
        | "partially_paid"
        | "paid"
        | "waived"
        | "overdue"
        | "refunded"
        | "cancelled"
      staff_position: "officer" | "manager" | "director" | "managing_director"
      staff_unit:
        | "registry"
        | "revenue"
        | "compliance"
        | "finance"
        | "directorate"
        | "systems_admin"
      task_status_enum:
        | "pending"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "overdue"
      user_type: "public" | "staff" | "admin" | "super_admin"
      workflow_stage:
        | "submitted"
        | "registry_review"
        | "registry_clarification_needed"
        | "compliance_review"
        | "compliance_clarification_needed"
        | "revenue_review"
        | "revenue_invoice_issued"
        | "payment_pending"
        | "payment_confirmed"
        | "director_review"
        | "approved"
        | "rejected"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_category: [
        "intent_registration",
        "new_permit",
        "permit_renewal",
        "permit_transfer",
        "permit_amendment",
        "permit_amalgamation",
        "permit_surrender",
        "compliance_report",
      ],
      application_status: [
        "draft",
        "pending",
        "submitted",
        "under_review",
        "under_assessment",
        "awaiting_payment",
        "in_progress",
        "approved",
        "rejected",
        "cancelled",
        "revoked",
        "expired",
        "completed",
        "suspended",
      ],
      approval_status_enum: [
        "pending",
        "approved",
        "rejected",
        "requires_revision",
      ],
      assessment_status_enum: [
        "pending",
        "in_progress",
        "completed",
        "requires_revision",
      ],
      inspection_status_enum: [
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
        "postponed",
      ],
      payment_status_enum: [
        "pending",
        "partially_paid",
        "paid",
        "waived",
        "overdue",
        "refunded",
        "cancelled",
      ],
      staff_position: ["officer", "manager", "director", "managing_director"],
      staff_unit: [
        "registry",
        "revenue",
        "compliance",
        "finance",
        "directorate",
        "systems_admin",
      ],
      task_status_enum: [
        "pending",
        "in_progress",
        "completed",
        "cancelled",
        "overdue",
      ],
      user_type: ["public", "staff", "admin", "super_admin"],
      workflow_stage: [
        "submitted",
        "registry_review",
        "registry_clarification_needed",
        "compliance_review",
        "compliance_clarification_needed",
        "revenue_review",
        "revenue_invoice_issued",
        "payment_pending",
        "payment_confirmed",
        "director_review",
        "approved",
        "rejected",
        "cancelled",
      ],
    },
  },
} as const
