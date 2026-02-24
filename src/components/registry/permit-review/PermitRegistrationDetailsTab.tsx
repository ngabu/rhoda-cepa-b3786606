import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { 
  FileText, ChevronDown, ChevronRight, Building, 
  DollarSign, Download, Eye, Activity, Users, Upload,
  Leaf, Factory, Droplets, Flame, FlaskConical, ClipboardList
} from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePermitDetails } from '@/hooks/usePermitDetails';
import { FeeCalculationDisplay } from '@/components/fee-calculation/FeeCalculationDisplay';

interface PermitRegistrationDetailsTabProps {
  application: {
    id: string;
    title: string;
    description?: string | null;
    permit_type: string;
    status: string;
    application_number?: string | null;
    created_at: string;
    activity_location?: string | null;
    estimated_cost_kina?: number | null;
    activity_classification?: string | null;
    activity_category?: string | null;
    activity_subcategory?: string | null;
    activity_level?: string | null;
    commencement_date?: string | null;
    completion_date?: string | null;
    entity_name?: string | null;
    entity_type?: string | null;
    province?: string | null;
    district?: string | null;
    llg?: string | null;
    project_description?: string | null;
    project_start_date?: string | null;
    project_end_date?: string | null;
    environmental_impact?: string | null;
    mitigation_measures?: string | null;
    entity_id: string;
    entity?: {
      id: string;
      name: string;
      entity_type: string;
    };
    industrial_sector_id?: string | null;
    eia_required?: boolean | null;
    eis_required?: boolean | null;
    consultation_period_start?: string | null;
    consultation_period_end?: string | null;
    fee_amount?: number | null;
    fee_breakdown?: any;
    application_fee?: number | null;
    composite_fee?: number | null;
    processing_days?: number | null;
    fee_source?: string | null;
    legal_declaration_accepted?: boolean | null;
    compliance_commitment?: boolean | null;
    // Document-related fields
    intent_registration_id?: string | null;
    document_uploads?: any;
    uploaded_files?: any;
    public_consultation_proof?: any;
    // Additional fields from comprehensive view
    operating_hours?: string | null;
    operational_capacity?: string | null;
    operational_details?: string | null;
    proposed_works_description?: string | null;
    permit_category?: string | null;
    permit_type_specific?: string | null;
    permit_type_specific_data?: any;
    ods_quota_allocation?: string | null;
    consulted_departments?: string | null;
    landowner_negotiation_status?: string | null;
    government_agreements_details?: string | null;
    required_approvals?: string | null;
    // Water & Waste details from view
    water_extraction_details?: any;
    effluent_discharge_details?: any;
    solid_waste_details?: any;
    hazardous_waste_details?: any;
    marine_dumping_details?: any;
    stormwater_details?: any;
    waste_contaminant_details?: any;
    // Chemical details from view
    chemical_storage_details?: any;
    fuel_storage_details?: any;
    hazardous_material_details?: any;
    pesticide_details?: any;
    mining_chemical_details?: any;
    ods_details?: any;
    // Emission details from view
    air_emission_details?: any;
    ghg_emission_details?: any;
    noise_emission_details?: any;
    // Environmental details from view
    biodiversity_abs_details?: any;
    carbon_offset_details?: any;
    land_clearing_details?: any;
    soil_extraction_details?: any;
    wildlife_trade_details?: any;
    rehabilitation_details?: any;
    // Industry details from view
    aquaculture_details?: any;
    mining_permit_details?: any;
    forest_product_details?: any;
    dredging_details?: any;
    infrastructure_details?: any;
    renewable_energy_details?: any;
    research_details?: any;
    monitoring_license_details?: any;
  };
}

interface Document {
  id: string;
  filename: string;
  file_path: string;
  uploaded_at: string;
  document_type?: string;
}

export function PermitRegistrationDetailsTab({ application }: PermitRegistrationDetailsTabProps) {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [entityDetails, setEntityDetails] = useState<any>(null);
  const [openSections, setOpenSections] = useState({
    project: false,
    classification: false,
    permitType: false,
    consultation: false,
    documents: false,
    fees: false,
    environmental: false,
    emissions: false,
    chemicals: false,
    industry: false,
  });

  // Data is now passed directly from the comprehensive view - use as fallback only
  const { details, allDetails, loading: loadingDetails } = usePermitDetails(application.id);
  
  // Helper to get value from view first, then fallback to child table data
  const getValue = (viewValue: any, detailsValue: any) => viewValue ?? detailsValue;

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    fetchDocuments();
    fetchEntityDetails();
  }, [application.id, application.intent_registration_id, application.document_uploads, application.uploaded_files, application.public_consultation_proof]);

  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true);
      
      // Fetch documents associated with the permit from documents table
      const { data: permitDocs, error: permitError } = await supabase
        .from('documents')
        .select('*')
        .eq('permit_id', application.id)
        .order('uploaded_at', { ascending: false });

      if (permitError) throw permitError;
      
      let allDocuments: Document[] = permitDocs || [];
      
      // If there's a linked intent registration, also fetch those documents
      if (application.intent_registration_id) {
        const { data: intentDocs, error: intentError } = await supabase
          .from('documents')
          .select('*')
          .eq('intent_registration_id', application.intent_registration_id)
          .order('uploaded_at', { ascending: false });

        if (!intentError && intentDocs) {
          // Merge documents, avoiding duplicates
          const existingIds = new Set(allDocuments.map(d => d.id));
          const uniqueIntentDocs = intentDocs.filter(d => !existingIds.has(d.id));
          allDocuments = [...allDocuments, ...uniqueIntentDocs];
        }
      }
      
      // Also include documents from document_uploads JSON field in permit_applications
      if (application.document_uploads && typeof application.document_uploads === 'object') {
        Object.entries(application.document_uploads).forEach(([docType, docData]: [string, any]) => {
          if (docData && docData.file_path) {
            allDocuments.push({
              id: docData.id || `uploaded-${docType}`,
              filename: docData.name || docType,
              file_path: docData.file_path,
              uploaded_at: docData.uploadedAt || new Date().toISOString(),
              document_type: docType.replace(/_/g, ' '),
            });
          }
        });
      }
      
      // Also include documents from uploaded_files JSON array
      if (Array.isArray(application.uploaded_files)) {
        application.uploaded_files.forEach((file: any, index: number) => {
          if (file && file.file_path) {
            allDocuments.push({
              id: file.id || `file-${index}`,
              filename: file.name || file.filename || `File ${index + 1}`,
              file_path: file.file_path,
              uploaded_at: file.uploadedAt || file.uploaded_at || new Date().toISOString(),
              document_type: file.document_type || file.type || 'Other',
            });
          }
        });
      }
      
      // Also include documents from public_consultation_proof JSON array (Consultation tab documents)
      if (Array.isArray(application.public_consultation_proof)) {
        application.public_consultation_proof.forEach((file: any, index: number) => {
          if (file && file.file_path) {
            // Check if document is already included (avoid duplicates)
            const existingIds = new Set(allDocuments.map(d => d.id));
            if (!existingIds.has(file.id)) {
              allDocuments.push({
                id: file.id || `consultation-${index}`,
                filename: file.name || file.filename || `Consultation Document ${index + 1}`,
                file_path: file.file_path,
                uploaded_at: file.uploadedAt || file.uploaded_at || new Date().toISOString(),
                document_type: 'Public Consultation Evidence',
              });
            }
          }
        });
      }
      
      setDocuments(allDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoadingDocs(false);
    }
  };

  const fetchEntityDetails = async () => {
    if (!application.entity_id) return;
    try {
      const { data, error } = await supabase
        .from('entities')
        .select('*')
        .eq('id', application.entity_id)
        .maybeSingle();

      if (error) throw error;
      setEntityDetails(data);
    } catch (error) {
      console.error('Error fetching entity details:', error);
    }
  };

  const handleDownloadDocument = async (filePath: string, filename: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(filePath);
      
      if (error) throw error;
      
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to download document', variant: 'destructive' });
    }
  };

  const handleViewDocument = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600);
      
      if (error) throw error;
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to view document', variant: 'destructive' });
    }
  };

  const renderField = (label: string, value: any) => {
    if (value === null || value === undefined || value === '') return null;
    return (
      <div className="p-3 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</p>
      </div>
    );
  };

  const renderJsonField = (label: string, value: any) => {
    if (value === null || value === undefined) return null;
    
    // Handle different JSON structures
    const formatValue = (val: any): string => {
      if (typeof val === 'string') return val;
      if (typeof val === 'boolean') return val ? 'Yes' : 'No';
      if (typeof val === 'number') return val.toLocaleString();
      if (Array.isArray(val)) return val.map(formatValue).join(', ');
      if (typeof val === 'object') {
        return Object.entries(val)
          .filter(([_, v]) => v !== null && v !== undefined && v !== '')
          .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${formatValue(v)}`)
          .join('\n');
      }
      return String(val);
    };

    const formattedValue = formatValue(value);
    if (!formattedValue || formattedValue.trim() === '') return null;

    return (
      <div className="p-3 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground font-medium mb-2">{label}</p>
        <p className="font-medium whitespace-pre-wrap text-sm">{formattedValue}</p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5 text-primary" />
          Permit Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {/* Section 1: Project (matching Project tab) */}
        <Collapsible open={openSections.project} onOpenChange={() => toggleSection('project')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors border">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-primary" />
              <span className="font-medium">Project</span>
            </div>
            {openSections.project ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4 pl-4">
            {loadingDetails ? (
              <p className="text-muted-foreground text-sm">Loading project details...</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('Application Title', application.title)}
                  {renderField('Application Number', application.application_number)}
                  {renderField('Permit Type', application.permit_type)}
                  {renderField('Status', application.status?.replace(/_/g, ' '))}
                  {renderField('Submitted Date', application.created_at ? format(new Date(application.created_at), 'MMMM dd, yyyy') : null)}
                  {renderField('Entity Name', application.entity?.name || application.entity_name)}
                  {renderField('Entity Type', application.entity?.entity_type || application.entity_type)}
                </div>
                {(allDetails?.project?.project_description || application.project_description) && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Project Description</p>
                    <p className="font-medium whitespace-pre-wrap">{allDetails?.project?.project_description || application.project_description}</p>
                  </div>
                )}
                {application.description && application.description !== (allDetails?.project?.project_description || application.project_description) && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium whitespace-pre-wrap">{application.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('Start Date', allDetails?.project?.project_start_date || allDetails?.project?.commencement_date || application.project_start_date || application.commencement_date ? format(new Date(allDetails?.project?.project_start_date || allDetails?.project?.commencement_date || application.project_start_date || application.commencement_date!), 'MMMM dd, yyyy') : null)}
                  {renderField('End Date', allDetails?.project?.project_end_date || allDetails?.project?.completion_date || application.project_end_date || application.completion_date ? format(new Date(allDetails?.project?.project_end_date || allDetails?.project?.completion_date || application.project_end_date || application.completion_date!), 'MMMM dd, yyyy') : null)}
                  {renderField('Estimated Cost', allDetails?.project?.estimated_cost_kina || application.estimated_cost_kina ? `K${(allDetails?.project?.estimated_cost_kina || application.estimated_cost_kina)?.toLocaleString()}` : null)}
                  {renderField('Environmental Impact', allDetails?.project?.environmental_impact || application.environmental_impact)}
                  {renderField('Mitigation Measures', allDetails?.project?.mitigation_measures || application.mitigation_measures)}
                </div>
                
                {/* Operational Details from child table */}
                {(allDetails?.project?.operational_details || allDetails?.project?.operational_capacity || allDetails?.project?.operating_hours || allDetails?.project?.proposed_works_description) && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Operational Information</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderField('Operating Hours', allDetails?.project?.operating_hours)}
                      {renderField('Operational Capacity', allDetails?.project?.operational_capacity)}
                    </div>
                    {allDetails?.project?.operational_details && (
                      <div className="p-3 bg-muted/30 rounded-lg mt-4">
                        <p className="text-sm text-muted-foreground">Operational Details</p>
                        <p className="font-medium whitespace-pre-wrap">{allDetails.project.operational_details}</p>
                      </div>
                    )}
                    {allDetails?.project?.proposed_works_description && (
                      <div className="p-3 bg-muted/30 rounded-lg mt-4">
                        <p className="text-sm text-muted-foreground">Proposed Works Description</p>
                        <p className="font-medium whitespace-pre-wrap">{allDetails.project.proposed_works_description}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Entity Details */}
                {entityDetails && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Entity Contact Details</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderField('Registration Number', entityDetails.registration_number)}
                      {renderField('Tax Number', entityDetails.tax_number)}
                      {renderField('Email', entityDetails.email)}
                      {renderField('Phone', entityDetails.phone)}
                      {renderField('Registered Address', entityDetails.registered_address)}
                      {renderField('Contact Person', entityDetails.contact_person)}
                      {renderField('Contact Email', entityDetails.contact_person_email)}
                    </div>
                  </div>
                )}
              </>
            )}
          </CollapsibleContent>
        </Collapsible>


        {/* Section 3: Classification (matching Classification tab) */}
        <Collapsible open={openSections.classification} onOpenChange={() => toggleSection('classification')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors border">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-600" />
              <span className="font-medium">Classification</span>
            </div>
            {openSections.classification ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4 pl-4">
            {loadingDetails ? (
              <p className="text-muted-foreground text-sm">Loading classification details...</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('Activity Level', allDetails?.classification?.activity_level || application.activity_level ? `Level ${allDetails?.classification?.activity_level || application.activity_level}` : null)}
                  {renderField('Activity Classification', allDetails?.classification?.activity_classification || application.activity_classification)}
                  {renderField('Activity Category', allDetails?.classification?.activity_category || application.activity_category)}
                  {renderField('Activity Subcategory', allDetails?.classification?.activity_subcategory || application.activity_subcategory)}
                  {renderField('Permit Category', allDetails?.classification?.permit_category)}
                  {renderField('Permit Type Specific', allDetails?.classification?.permit_type_specific)}
                  {renderField('EIA Required', allDetails?.classification?.eia_required ?? application.eia_required)}
                  {renderField('EIS Required', allDetails?.classification?.eis_required ?? application.eis_required)}
                  {renderField('ODS Quota Allocation', allDetails?.classification?.ods_quota_allocation)}
                </div>
                {allDetails?.classification?.permit_type_specific_data && (
                  <div className="mt-4 pt-4 border-t border-border">
                    {renderJsonField('Permit Type Specific Data', allDetails.classification.permit_type_specific_data)}
                  </div>
                )}
              </>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Section: Permit Type Details */}
        <Collapsible open={openSections.permitType} onOpenChange={() => toggleSection('permitType')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors border">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-purple-600" />
              <span className="font-medium">Permit Type Details</span>
            </div>
            {openSections.permitType ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4 pl-4">
            {loadingDetails ? (
              <p className="text-muted-foreground text-sm">Loading permit type details...</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('Permit Type', application.permit_type)}
                  {renderField('Permit Category', allDetails?.classification?.permit_category)}
                  {renderField('Permit Type Specific', allDetails?.classification?.permit_type_specific)}
                </div>
                {allDetails?.classification?.permit_type_specific_data && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Permit Type Specific Data</p>
                    {renderJsonField('Details', allDetails.classification.permit_type_specific_data)}
                  </div>
                )}

                {!application.permit_type && !allDetails?.classification?.permit_category && !allDetails?.classification?.permit_type_specific && (
                  <p className="text-muted-foreground text-sm">No permit type details available</p>
                )}
              </>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.consultation} onOpenChange={() => toggleSection('consultation')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors border">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Consultation</span>
            </div>
            {openSections.consultation ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4 pl-4">
            {loadingDetails ? (
              <p className="text-muted-foreground text-sm">Loading consultation details...</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('Consultation Period Start', allDetails?.consultation?.consultation_period_start || application.consultation_period_start ? format(new Date(allDetails?.consultation?.consultation_period_start || application.consultation_period_start!), 'MMMM dd, yyyy') : null)}
                  {renderField('Consultation Period End', allDetails?.consultation?.consultation_period_end || application.consultation_period_end ? format(new Date(allDetails?.consultation?.consultation_period_end || application.consultation_period_end!), 'MMMM dd, yyyy') : null)}
                  {renderField('Consulted Departments', allDetails?.consultation?.consulted_departments)}
                  {renderField('Landowner Negotiation Status', allDetails?.consultation?.landowner_negotiation_status)}
                  {renderField('Required Approvals', allDetails?.consultation?.required_approvals)}
                </div>
                {allDetails?.consultation?.government_agreements_details && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Government Agreements Details</p>
                    <p className="font-medium whitespace-pre-wrap">{allDetails.consultation.government_agreements_details}</p>
                  </div>
                )}
                {allDetails?.consultation?.public_consultation_proof && (
                  <div className="mt-4 pt-4 border-t border-border">
                    {renderJsonField('Public Consultation Evidence', allDetails.consultation.public_consultation_proof)}
                  </div>
                )}
                {!allDetails?.consultation?.consultation_period_start && !application.consultation_period_start && !allDetails?.consultation?.consulted_departments && (
                  <p className="text-muted-foreground text-sm">No consultation information provided</p>
                )}
              </>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Section 4: Documents (matching Documents tab) */}
        <Collapsible open={openSections.documents} onOpenChange={() => toggleSection('documents')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors border">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-green-600" />
              <span className="font-medium">Documents</span>
              {documents.length > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {documents.length}
                </span>
              )}
            </div>
            {openSections.documents ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4 pl-4">
            {loadingDocs ? (
              <p className="text-muted-foreground text-sm">Loading documents...</p>
            ) : documents.length === 0 ? (
              <p className="text-muted-foreground text-sm">No documents uploaded</p>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{doc.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.document_type && `${doc.document_type} • `}
                          {format(new Date(doc.uploaded_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(doc.file_path)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadDocument(doc.file_path, doc.filename)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Section 5: Fees (matching Fees tab) */}
        <Collapsible open={openSections.fees} onOpenChange={() => toggleSection('fees')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors border">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">Fees</span>
            </div>
            {openSections.fees ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4 pl-4">
            {loadingDetails ? (
              <p className="text-muted-foreground text-sm">Loading fee details...</p>
            ) : (
              <>
                {/* Use the FeeCalculationDisplay component for consistent display */}
                {(() => {
                  const applicationFee = allDetails?.fee?.application_fee || 
                    application.application_fee || 
                    (application.fee_breakdown as any)?.administrationFee || 0;
                  const compositeFee = allDetails?.fee?.composite_fee || 
                    application.composite_fee ||
                    (application.fee_breakdown as any)?.compositeFee || 0;
                  const totalFee = allDetails?.fee?.fee_amount || 
                    application.fee_amount || 
                    (application.fee_breakdown as any)?.totalFee || 0;
                  const processingDays = allDetails?.fee?.processing_days || 
                    application.processing_days ||
                    (application.fee_breakdown as any)?.processingDays || 0;
                  const source = (allDetails?.fee?.fee_source || 
                    application.fee_source ||
                    (application.fee_breakdown as any)?.source || 'official') as 'official' | 'estimated';

                  // Only show FeeCalculationDisplay if we have fee data
                  if (applicationFee > 0 || totalFee > 0) {
                    return (
                      <FeeCalculationDisplay
                        applicationFee={applicationFee}
                        compositeFee={compositeFee}
                        totalFee={totalFee}
                        processingDays={processingDays}
                        source={source}
                        showDetails={true}
                      />
                    );
                  }
                  
                  return (
                    <div className="p-4 bg-amber-500/10 rounded-lg text-center">
                      <DollarSign className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                      <p className="text-sm text-muted-foreground">
                        Fee not yet calculated. Complete the Classification tab to calculate fees.
                      </p>
                    </div>
                  );
                })()}

                {/* Payment & Processing Info - Additional Details */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-3">Payment & Processing</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField('Payment Status', allDetails?.fee?.payment_status || 'Pending')}
                    {renderField('Processing Days', allDetails?.fee?.processing_days || (application.fee_breakdown as any)?.processingDays ? `${allDetails?.fee?.processing_days || (application.fee_breakdown as any)?.processingDays} days` : null)}
                    {renderField('Fee Category', (application.fee_breakdown as any)?.feeCategory)}
                    {renderField('Fee Source', allDetails?.fee?.fee_source || (application.fee_breakdown as any)?.source)}
                  </div>
                </div>
              </>
            )}
          </CollapsibleContent>
        </Collapsible>


        {/* Section 6: Environmental Details */}
        {(hasViewEnvironmentalData(application) || (allDetails?.environmental && hasEnvironmentalData(allDetails.environmental))) && (
          <Collapsible open={openSections.environmental} onOpenChange={() => toggleSection('environmental')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors border">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-600" />
                <span className="font-medium">Environmental Details</span>
              </div>
              {openSections.environmental ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4 pl-4">
              {renderJsonField('Biodiversity & ABS', application.biodiversity_abs_details ?? allDetails?.environmental?.biodiversity_abs_details)}
              {renderJsonField('Carbon Offset', application.carbon_offset_details ?? allDetails?.environmental?.carbon_offset_details)}
              {renderJsonField('Land Clearing', application.land_clearing_details ?? allDetails?.environmental?.land_clearing_details)}
              {renderJsonField('Soil Extraction', application.soil_extraction_details ?? allDetails?.environmental?.soil_extraction_details)}
              {renderJsonField('Wildlife Trade', application.wildlife_trade_details ?? allDetails?.environmental?.wildlife_trade_details)}
              {renderJsonField('Rehabilitation', application.rehabilitation_details ?? allDetails?.environmental?.rehabilitation_details)}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Section 7: Emissions Details */}
        {(hasViewEmissionData(application) || (allDetails?.emission && hasEmissionData(allDetails.emission))) && (
          <Collapsible open={openSections.emissions} onOpenChange={() => toggleSection('emissions')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors border">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-600" />
                <span className="font-medium">Emissions Details</span>
              </div>
              {openSections.emissions ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4 pl-4">
              {renderJsonField('Air Emissions', application.air_emission_details ?? allDetails?.emission?.air_emission_details)}
              {renderJsonField('GHG Emissions', application.ghg_emission_details ?? allDetails?.emission?.ghg_emission_details)}
              {renderJsonField('Noise Emissions', application.noise_emission_details ?? allDetails?.emission?.noise_emission_details)}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Section 8: Chemical Details */}
        {(hasViewChemicalData(application) || (allDetails?.chemical && hasChemicalData(allDetails.chemical))) && (
          <Collapsible open={openSections.chemicals} onOpenChange={() => toggleSection('chemicals')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors border">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Chemical Details</span>
              </div>
              {openSections.chemicals ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4 pl-4">
              {renderJsonField('Chemical Storage', application.chemical_storage_details ?? allDetails?.chemical?.chemical_storage_details)}
              {renderJsonField('Fuel Storage', application.fuel_storage_details ?? allDetails?.chemical?.fuel_storage_details)}
              {renderJsonField('Hazardous Materials', application.hazardous_material_details ?? allDetails?.chemical?.hazardous_material_details)}
              {renderJsonField('Pesticides', application.pesticide_details ?? allDetails?.chemical?.pesticide_details)}
              {renderJsonField('Mining Chemicals', application.mining_chemical_details ?? allDetails?.chemical?.mining_chemical_details)}
              {renderJsonField('ODS (Ozone Depleting Substances)', application.ods_details ?? allDetails?.chemical?.ods_details)}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Section 9: Industry Details */}
        {(hasViewIndustryData(application) || (allDetails?.industry && hasIndustryData(allDetails.industry))) && (
          <Collapsible open={openSections.industry} onOpenChange={() => toggleSection('industry')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors border">
              <div className="flex items-center gap-2">
                <Factory className="w-4 h-4 text-gray-600" />
                <span className="font-medium">Industry-Specific Details</span>
              </div>
              {openSections.industry ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4 pl-4">
              {renderJsonField('Aquaculture', application.aquaculture_details ?? allDetails?.industry?.aquaculture_details)}
              {renderJsonField('Mining Permit', application.mining_permit_details ?? allDetails?.industry?.mining_permit_details)}
              {renderJsonField('Forest Products', application.forest_product_details ?? allDetails?.industry?.forest_product_details)}
              {renderJsonField('Dredging', application.dredging_details ?? allDetails?.industry?.dredging_details)}
              {renderJsonField('Infrastructure', application.infrastructure_details ?? allDetails?.industry?.infrastructure_details)}
              {renderJsonField('Renewable Energy', application.renewable_energy_details ?? allDetails?.industry?.renewable_energy_details)}
              {renderJsonField('Research', application.research_details ?? allDetails?.industry?.research_details)}
              {renderJsonField('Monitoring License', application.monitoring_license_details ?? allDetails?.industry?.monitoring_license_details)}
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}

// Helper functions to check if data exists in allDetails child tables
function hasEnvironmentalData(data: any): boolean {
  return data && Object.values(data).some(v => v !== null && v !== undefined);
}

function hasWaterWasteData(data: any): boolean {
  return data && Object.values(data).some(v => v !== null && v !== undefined);
}

function hasEmissionData(data: any): boolean {
  return data && Object.values(data).some(v => v !== null && v !== undefined);
}

function hasChemicalData(data: any): boolean {
  return data && Object.values(data).some(v => v !== null && v !== undefined);
}

function hasIndustryData(data: any): boolean {
  return data && Object.values(data).some(v => v !== null && v !== undefined);
}

// Helper functions to check if data exists in view (application props)
function hasViewEnvironmentalData(app: any): boolean {
  return app.biodiversity_abs_details || app.carbon_offset_details || 
         app.land_clearing_details || app.soil_extraction_details || 
         app.wildlife_trade_details || app.rehabilitation_details;
}

function hasViewEmissionData(app: any): boolean {
  return app.air_emission_details || app.ghg_emission_details || app.noise_emission_details;
}

function hasViewChemicalData(app: any): boolean {
  return app.chemical_storage_details || app.fuel_storage_details || 
         app.hazardous_material_details || app.pesticide_details || 
         app.mining_chemical_details || app.ods_details;
}

function hasViewIndustryData(app: any): boolean {
  return app.aquaculture_details || app.mining_permit_details || 
         app.forest_product_details || app.dredging_details || 
         app.infrastructure_details || app.renewable_energy_details || 
         app.research_details || app.monitoring_license_details;
}
