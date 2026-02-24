import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, FileText, Shield, Receipt, UserCheck, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  PermitSiteMappingTab,
  PermitRegistrationDetailsTab,
  PermitRegistryReviewTab,
  PermitComplianceReviewTab,
  PermitInvoicePaymentsTab,
  PermitMDReviewTab,
} from '@/components/registry/permit-review';

interface PermitApplicationInlineViewProps {
  applicationId: string;
  onBack: () => void;
  onUpdate?: () => void;
}

interface PermitApplication {
  id: string;
  title: string;
  status: string;
  entity_id: string;
  entity_name?: string | null;
  entity_type?: string | null;
  permit_type: string;
  application_number?: string | null;
  created_at: string;
  province?: string | null;
  district?: string | null;
  llg?: string | null;
  project_boundary?: any;
  coordinates?: any;
  total_area_sqkm?: number | null;
  project_site_description?: string | null;
  site_ownership_details?: string | null;
  land_type?: string | null;
  tenure?: string | null;
  legal_description?: string | null;
  project_description?: string | null;
  project_start_date?: string | null;
  project_end_date?: string | null;
  commencement_date?: string | null;
  completion_date?: string | null;
  estimated_cost_kina?: number | null;
  operational_details?: string | null;
  operational_capacity?: string | null;
  operating_hours?: string | null;
  environmental_impact?: string | null;
  mitigation_measures?: string | null;
  proposed_works_description?: string | null;
  permit_category?: string | null;
  activity_classification?: string | null;
  activity_category?: string | null;
  activity_subcategory?: string | null;
  activity_level?: string | null;
  eia_required?: boolean | null;
  eis_required?: boolean | null;
  consultation_period_start?: string | null;
  consultation_period_end?: string | null;
  consulted_departments?: string | null;
  public_consultation_proof?: any;
  landowner_negotiation_status?: string | null;
  government_agreements_details?: string | null;
  required_approvals?: string | null;
  application_fee?: number | null;
  fee_amount?: number | null;
  fee_breakdown?: any;
  composite_fee?: number | null;
  processing_days?: number | null;
  fee_source?: string | null;
  compliance_commitment?: boolean | null;
  legal_declaration_accepted?: boolean | null;
  entity?: {
    id: string;
    name: string;
    entity_type: string;
  };
}

export function PermitApplicationInlineView({ 
  applicationId,
  onBack,
  onUpdate 
}: PermitApplicationInlineViewProps) {
  const [activeTab, setActiveTab] = useState<string>('compliance-review');
  const [application, setApplication] = useState<PermitApplication | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  const fetchApplication = async () => {
    if (!applicationId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vw_permit_applications_full')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (error) throw error;
      
      if (data) {
        const appAny = data as any;
        setApplication({
          ...data,
          province: appAny.province,
          district: appAny.district,
          llg: appAny.llg,
          project_boundary: appAny.project_boundary,
          coordinates: appAny.coordinates,
          total_area_sqkm: appAny.total_area_sqkm,
          project_site_description: appAny.project_site_description,
          site_ownership_details: appAny.site_ownership_details,
          land_type: appAny.land_type,
          tenure: appAny.tenure,
          legal_description: appAny.legal_description,
          project_description: appAny.project_description,
          project_start_date: appAny.project_start_date,
          project_end_date: appAny.project_end_date,
          commencement_date: appAny.commencement_date,
          completion_date: appAny.completion_date,
          estimated_cost_kina: appAny.estimated_cost_kina,
          operational_details: appAny.operational_details,
          operational_capacity: appAny.operational_capacity,
          operating_hours: appAny.operating_hours,
          environmental_impact: appAny.environmental_impact,
          mitigation_measures: appAny.mitigation_measures,
          proposed_works_description: appAny.proposed_works_description,
          permit_category: appAny.permit_category,
          activity_classification: appAny.activity_classification,
          activity_category: appAny.activity_category,
          activity_subcategory: appAny.activity_subcategory,
          activity_level: appAny.activity_level,
          eia_required: appAny.eia_required,
          eis_required: appAny.eis_required,
          consultation_period_start: appAny.consultation_period_start,
          consultation_period_end: appAny.consultation_period_end,
          consulted_departments: appAny.consulted_departments,
          public_consultation_proof: appAny.public_consultation_proof,
          landowner_negotiation_status: appAny.landowner_negotiation_status,
          government_agreements_details: appAny.government_agreements_details,
          required_approvals: appAny.required_approvals,
          application_fee: appAny.application_fee,
          fee_amount: appAny.fee_amount,
          fee_breakdown: appAny.fee_breakdown,
          composite_fee: appAny.composite_fee,
          processing_days: appAny.processing_days,
          fee_source: appAny.fee_source,
          compliance_commitment: appAny.compliance_commitment,
          legal_declaration_accepted: appAny.legal_declaration_accepted,
          entity: appAny.entity_name ? {
            id: appAny.entity_id || '',
            name: appAny.entity_name,
            entity_type: appAny.entity_type || ''
          } : undefined,
          entity_name: appAny.entity_name,
          entity_type: appAny.entity_type,
        });
      }
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = () => {
    fetchApplication();
    onUpdate?.();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'secondary';
      case 'under_initial_review':
      case 'under_review':
        return 'outline';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'requires_clarification':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!application) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center py-12 text-muted-foreground">
            No application data found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessments
          </Button>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <CardTitle>Permit Application Review</CardTitle>
          </div>
          <Badge variant={getStatusColor(application.status)}>
            {application.status.replace(/_/g, ' ')}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{application.title}</p>
          <p>{application.entity_name || 'Unknown Entity'} • {application.application_number || 'No Application Number'}</p>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="site-mapping" className="flex items-center gap-1 text-xs">
              <MapPin className="w-3 h-3" />
              Site
            </TabsTrigger>
            <TabsTrigger value="registration" className="flex items-center gap-1 text-xs">
              <FileText className="w-3 h-3" />
              Details
            </TabsTrigger>
            <TabsTrigger value="registry-review" className="flex items-center gap-1 text-xs">
              <FileText className="w-3 h-3" />
              Registry
            </TabsTrigger>
            <TabsTrigger value="compliance-review" className="flex items-center gap-1 text-xs">
              <Shield className="w-3 h-3" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="invoice-payment" className="flex items-center gap-1 text-xs">
              <Receipt className="w-3 h-3" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="md-review" className="flex items-center gap-1 text-xs">
              <UserCheck className="w-3 h-3" />
              MD
            </TabsTrigger>
          </TabsList>

          <TabsContent value="site-mapping" className="mt-4">
            <PermitSiteMappingTab application={application as any} />
          </TabsContent>

          <TabsContent value="registration" className="mt-4">
            <PermitRegistrationDetailsTab application={application as any} />
          </TabsContent>

          <TabsContent value="registry-review" className="mt-4">
            <PermitRegistryReviewTab 
              applicationId={application.id}
              currentStatus={application.status}
              onStatusUpdate={handleStatusUpdate}
            />
          </TabsContent>

          <TabsContent value="compliance-review" className="mt-4">
            <PermitComplianceReviewTab 
              applicationId={application.id}
              currentStatus={application.status}
              onStatusUpdate={handleStatusUpdate}
            />
          </TabsContent>

          <TabsContent value="invoice-payment" className="mt-4">
            <PermitInvoicePaymentsTab 
              applicationId={application.id}
              entityId={application.entity_id}
              onStatusUpdate={handleStatusUpdate}
            />
          </TabsContent>

          <TabsContent value="md-review" className="mt-4">
            <PermitMDReviewTab 
              applicationId={application.id}
              currentStatus={application.status}
              onStatusUpdate={handleStatusUpdate}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
