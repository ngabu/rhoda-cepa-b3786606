import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PermitApplication } from '../types';

export function usePermitApplications() {
  const [applications, setApplications] = useState<PermitApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const fetchPermitApplications = async () => {
    try {
      // Use the vw_permit_applications_compliance view for compliance unit
      const { data, error } = await (supabase as any)
        .from('vw_permit_applications_compliance')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedApplications: PermitApplication[] = (data || []).map((app: any) => ({
        id: app.id,
        title: app.title || 'Untitled Application',
        permit_type: app.permit_type || 'General',
        status: app.status || 'pending',
        application_date: app.application_date,
        permit_number: app.permit_number,
        assigned_officer_id: app.assigned_officer_id,
        assigned_compliance_officer_id: app.assigned_compliance_officer_id,
        assigned_officer_name: app.compliance_officer_name,
        assigned_officer_email: app.compliance_officer_email,
        entity_name: app.entity_name,
        entity_type: app.entity_type,
        entity: {
          name: app.entity_name || 'Unknown Entity',
          entity_type: app.entity_type || 'Unknown'
        },
        created_at: app.created_at || new Date().toISOString(),
        updated_at: app.created_at || new Date().toISOString()
      }));

      setApplications(formattedApplications);
    } catch (error) {
      console.error('Error fetching permit applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.staff_unit === 'compliance') {
      fetchPermitApplications();
    } else {
      setLoading(false);
    }
  }, [profile?.staff_unit]);

  return { applications, loading, refetch: fetchPermitApplications };
}