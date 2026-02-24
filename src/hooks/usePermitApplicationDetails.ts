import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { fetchPermitDetailsFlatteneed, savePermitDetailsFromFlat, PermitDetailsFlatteneed } from '@/services/permitDetails';

export interface PermitApplicationDetails {
  id?: string;
  permit_id?: string;
  user_id?: string;
  
  // Basic Info fields
  title?: string;
  entity_id?: string;
  entity_type?: string;
  
  // Step 2: Details of Application
  legal_description?: string;
  land_type?: string;
  owner_name?: string;
  tenure?: string;
  existing_permits_details?: string;
  government_agreements_details?: string;
  consulted_departments?: string;
  required_approvals?: string;
  landowner_negotiation_status?: string;
  
  // Step 3: Details of the Activity
  proposed_works_description?: string;
  activity_location?: string;
  estimated_cost_kina?: number;
  commencement_date?: string;
  completion_date?: string;
  activity_classification?: string;
  activity_category?: string;
  activity_subcategory?: string;
  industrial_sector_id?: string;
  
  // Step 4: Permit Period
  permit_period?: string;
  
  // Step 5: Application Fee
  application_fee?: number;
  fee_amount?: number;
  fee_breakdown?: any;
  composite_fee?: number;
  processing_days?: number;
  fee_source?: string;
  administration_form?: string;
  technical_form?: string;
  
  // Project Details fields
  project_description?: string;
  project_start_date?: string;
  project_end_date?: string;
  environmental_impact?: string;
  mitigation_measures?: string;
  district?: string;
  province?: string;
  
  // Documents
  uploaded_files?: any;
  document_uploads?: any;
  public_consultation_proof?: any;
  
  // EIA/EIS
  eia_required?: boolean;
  eis_required?: boolean;
  
  // Progress tracking
  current_step?: number;
  is_draft?: boolean;
  completed_steps?: number[];
  
  // Permit-specific details from child tables (flattened)
  permitDetails?: PermitDetailsFlatteneed;
}

export interface PermitInfo {
  id: string;
  title: string;
  permit_type: string;
  status: string;
  created_at: string;
}

export function usePermitApplicationDetails(permitId: string) {
  const [details, setDetails] = useState<PermitApplicationDetails | null>(null);
  const [permitDetails, setPermitDetails] = useState<PermitDetailsFlatteneed | null>(null);
  const [permitInfo, setPermitInfo] = useState<PermitInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (permitId) {
      loadDetails();
    }
  }, [permitId]);

  const loadDetails = async () => {
    try {
      // Load permit info from view
      const { data: permitData, error: permitError } = await (supabase as any)
        .from('vw_permit_applications_full')
        .select('id, title, permit_type, status, created_at')
        .eq('id', permitId)
        .single();

      if (permitError) throw permitError;
      setPermitInfo(permitData);

      // Load main application details from view
      const { data, error } = await (supabase as any)
        .from('vw_permit_applications_full')
        .select('*')
        .eq('id', permitId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Fetch permit-specific details from child tables
      let childDetails: PermitDetailsFlatteneed | null = null;
      try {
        childDetails = await fetchPermitDetailsFlatteneed(permitId);
        setPermitDetails(childDetails);
      } catch (childError) {
        console.warn('Could not fetch child table details:', childError);
      }

      if (data) {
        const parsedData = {
          ...data,
          completed_steps: Array.isArray(data.completed_steps) 
            ? data.completed_steps as number[]
            : [],
          permitDetails: childDetails || undefined,
        };
        setDetails(parsedData);
      } else {
        setDetails(null);
      }
    } catch (error) {
      console.error('Error loading permit details:', error);
      toast({
        title: "Error",
        description: "Failed to load application details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveDetails = async (updatedDetails: Partial<PermitApplicationDetails>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Separate permit-specific details from main application data
      const { permitDetails: permitSpecificDetails, ...mainDetails } = updatedDetails;

      const dataToSave = {
        ...mainDetails,
        id: permitId,
        updated_at: new Date().toISOString()
      };

      // Update main permit_applications table
      const result = await supabase
        .from('permit_applications')
        .update(dataToSave)
        .eq('id', permitId)
        .select()
        .single();

      if (result.error) throw result.error;

      // Save permit-specific details to child tables if provided
      if (permitSpecificDetails) {
        await savePermitDetailsFromFlat(permitId, permitSpecificDetails);
        setPermitDetails(permitSpecificDetails);
      }

      const parsedResult = {
        ...result.data,
        completed_steps: Array.isArray(result.data.completed_steps) 
          ? result.data.completed_steps as number[]
          : [],
        permitDetails: permitSpecificDetails || permitDetails,
      };
      
      setDetails(parsedResult);
      toast({
        title: "Success",
        description: "Application details saved successfully"
      });

      return parsedResult;
    } catch (error) {
      console.error('Error saving permit details:', error);
      toast({
        title: "Error",
        description: "Failed to save application details",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    details,
    permitDetails,
    permitInfo,
    loading,
    saveDetails,
    refreshDetails: loadDetails
  };
}
