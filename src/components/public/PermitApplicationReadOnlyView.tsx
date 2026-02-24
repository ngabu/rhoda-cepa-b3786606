import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PermitApplicationReadOnlyViewProps {
  applicationId: string;
}

export function PermitApplicationReadOnlyView({ applicationId }: PermitApplicationReadOnlyViewProps) {
  const [application, setApplication] = useState<any>(null);
  
  useEffect(() => {
    const fetchApplication = async () => {
      if (!applicationId) return;
      
      try {
        const { data, error } = await (supabase as any)
          .from('vw_permit_applications_full')
          .select('*')
          .eq('id', applicationId)
          .single();
        
        if (!error && data) {
          setApplication(data);
        }
      } catch (error) {
        console.error('Error fetching application:', error);
      }
    };
    
    fetchApplication();
  }, [applicationId]);
  
  if (!application) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h3>Application Details</h3>
      <p>Title: {application.title}</p>
      <p>Type: {application.permit_type}</p>
      <p>Status: {application.status}</p>
    </div>
  );
}