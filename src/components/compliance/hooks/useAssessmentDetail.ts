
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AssessmentDetail {
  id: string;
  permit_application_id: string;
  assessed_by: string;
  assigned_by: string;
  assessment_status: string;
  assessment_notes: string | null;
  compliance_score: number | null;
  recommendations: string | null;
  violations_found: any;
  next_review_date: string | null;
  created_at: string;
  updated_at: string;
  permit_application?: {
    id: string;
    title: string;
    application_number: string | null;
    entity_name: string | null;
    entity_type: string | null;
    status: string;
    activity_classification: string;
    activity_level: string;
    permit_type: string;
    description: string | null;
    activity_location: string | null;
    coordinates: any;
    compliance_checks: any;
    uploaded_files: any;
    application_date: string;
    user_id: string;
    activity_id?: string | null;
    estimated_cost_kina?: number | null;
    land_area?: number | null;
    permit_period?: string | null;
    activity_type?: string;
    fee_amount?: number | null;
    commencement_date?: string | null;
    completion_date?: string | null;
  };
}

export function useAssessmentDetail(assessmentId: string) {
  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching assessment:', assessmentId);
      
      // Fetch compliance assessment with related data
      // Use the view for the permit application data to get all joined fields
      const { data: assessment, error: assessmentError } = await supabase
        .from('compliance_assessments')
        .select(`
          *,
          permit_applications:permit_application_id (
            id,
            title,
            application_number,
            status,
            permit_type,
            description,
            activity_location,
            uploaded_files,
            application_date,
            user_id,
            entity_id,
            activity_id
          )
        `)
        .eq('id', assessmentId)
        .maybeSingle();

      if (assessmentError) {
        console.error('Assessment fetch error:', assessmentError);
        throw assessmentError;
      }

      // Get permit application from the assessment
      const permitApp = assessment?.permit_applications as any;
      let enrichedPermitApplicationWithTypes: any = null;
      
      if (permitApp?.id) {
        const [
          { data: classificationData },
          { data: projectData },
          { data: feeData },
          { data: locationData },
          { data: complianceData },
          { data: entityData }
        ] = await Promise.all([
          supabase.from('permit_classification_details').select('*').eq('permit_application_id', permitApp.id).maybeSingle(),
          supabase.from('permit_project_details').select('*').eq('permit_application_id', permitApp.id).maybeSingle(),
          supabase.from('permit_fee_details').select('*').eq('permit_application_id', permitApp.id).maybeSingle(),
          supabase.from('permit_location_details').select('*').eq('permit_application_id', permitApp.id).maybeSingle(),
          supabase.from('permit_compliance_details').select('*').eq('permit_application_id', permitApp.id).maybeSingle(),
          permitApp.entity_id ? supabase.from('entities').select('name, entity_type').eq('id', permitApp.entity_id).maybeSingle() : Promise.resolve({ data: null })
        ]);

        enrichedPermitApplicationWithTypes = {
          ...permitApp,
          entity_name: entityData?.name || null,
          entity_type: entityData?.entity_type || null,
          activity_classification: classificationData?.activity_classification || null,
          activity_level: classificationData?.activity_level || null,
          activity_category: classificationData?.activity_category || null,
          estimated_cost_kina: projectData?.estimated_cost_kina || null,
          commencement_date: projectData?.commencement_date || null,
          completion_date: projectData?.completion_date || null,
          fee_amount: feeData?.fee_amount || null,
          permit_period: projectData?.operating_hours || null,
          coordinates: locationData?.coordinates || null,
          compliance_checks: complianceData?.compliance_checks || null,
        };
      }

      console.log('Fetched assessment:', assessment);

      const fullAssessmentData = {
        ...assessment,
        permit_application: enrichedPermitApplicationWithTypes || assessment?.permit_applications
      };

      console.log('Full assessment data with fee parameters:', fullAssessmentData);
      setAssessment(fullAssessmentData as unknown as AssessmentDetail);

    } catch (error: any) {
      console.error('Error fetching assessment:', error);
      setError(error.message || 'Failed to fetch assessment');
    } finally {
      setLoading(false);
    }
  };

  const updateAssessment = async (updates: Partial<AssessmentDetail>) => {
    try {
      const { error } = await supabase
        .from('compliance_assessments')
        .update({
          ...updates,
          assessed_by: profile?.user_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', assessmentId);

      if (error) throw error;

      // Refresh the assessment data
      await fetchAssessment();
      return { success: true };
    } catch (error: any) {
      console.error('Error updating assessment:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    if (assessmentId && profile?.user_id) {
      fetchAssessment();
    }
  }, [assessmentId, profile?.user_id]);

  return {
    assessment,
    loading,
    error,
    updateAssessment,
    refetch: fetchAssessment
  };
}
