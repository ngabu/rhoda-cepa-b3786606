import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Building, 
  User, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  FileText, 
  Download, 
  ChevronDown, 
  ChevronRight, 
  Eye,
  Activity,
  Droplets,
  Trash2,
  CheckCircle,
  ClipboardList,
  FolderOpen
} from 'lucide-react';
import { format } from 'date-fns';
import { IntentBoundaryMapDisplay } from '@/components/registry/read-only/IntentBoundaryMapDisplay';
import { FeeCalculationDisplay } from '@/components/fee-calculation/FeeCalculationDisplay';
import { area } from '@turf/area';
import { polygon } from '@turf/helpers';

interface Document {
  id: string;
  filename: string;
  file_path: string;
  uploaded_at: string;
  file_size: number;
  document_type?: string;
}

interface EntityDetails {
  id: string;
  name: string;
  entity_type: string;
  registered_address?: string;
  postal_address?: string;
  email?: string;
  phone?: string;
  district?: string;
  province?: string;
  contact_person?: string;
  contact_person_email?: string;
  contact_person_phone?: number | string;
  registration_number?: string;
  tax_number?: string;
}

interface PermitApplicationDetailsCollapsibleProps {
  permit: {
    id: string;
    permit_number?: string;
    permit_type: string;
    title: string;
    description?: string;
    status: string;
    application_date?: string;
    approval_date?: string;
    expiry_date?: string;
    entity_id?: string;
    entity_name?: string;
    entity_type?: string;
    province?: string;
    district?: string;
    llg?: string;
    coordinates?: any;
    project_boundary?: any;
    activity_level?: string;
    activity_category?: string;
    activity_subcategory?: string;
    activity_classification?: string;
    activity_location?: string;
    industrial_sector_id?: string;
    permit_type_id?: string;
    permit_type_specific_data?: any;
    water_extraction_details?: any;
    waste_contaminant_details?: any;
    project_description?: string;
    project_site_description?: string;
    site_ownership_details?: string;
    environmental_impact?: string;
    mitigation_measures?: string;
    commencement_date?: string;
    completion_date?: string;
    estimated_cost_kina?: number;
    permit_period?: string;
    consultation_period_start?: string;
    consultation_period_end?: string;
    public_consultation_proof?: any;
    fee_amount?: number;
    fee_breakdown?: any;
    payment_status?: string;
    eia_required?: boolean;
    eis_required?: boolean;
    legal_declaration_accepted?: boolean;
    compliance_commitment?: boolean;
    created_at: string;
    application_number?: string;
    total_area_sqkm?: number;
    government_agreements_details?: string;
    consulted_departments?: string;
    required_approvals?: string;
    landowner_negotiation_status?: string;
    intent_registration_id?: string;
    existing_permit_id?: string;
    // Fee fields
    application_fee?: number;
    composite_fee?: number;
    processing_days?: number;
    fee_source?: string;
    administration_form?: string;
    technical_form?: string;
    // Document fields
    document_uploads?: Record<string, any>;
    uploaded_files?: any[];
  };
}

interface FeePaymentData {
  id: string;
  total_fee: number;
  administration_fee: number;
  technical_fee: number;
  payment_status: string;
  payment_method?: string;
  payment_reference?: string;
  receipt_number?: string;
  paid_at?: string;
}

export function PermitApplicationDetailsCollapsible({ permit }: PermitApplicationDetailsCollapsibleProps) {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [industrialSector, setIndustrialSector] = useState<string | null>(null);
  const [prescribedActivity, setPrescribedActivity] = useState<any>(null);
  const [entityDetails, setEntityDetails] = useState<EntityDetails | null>(null);
  const [feePayment, setFeePayment] = useState<FeePaymentData | null>(null);
  const [loadingFees, setLoadingFees] = useState(true);
  const [openSections, setOpenSections] = useState({
    registration: false,
    project: false,
    siteMapping: false,
    classification: false,
    consultation: false,
    documents: false,
    fees: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    fetchDocuments();
    fetchIndustrialSector();
    fetchPrescribedActivity();
    fetchEntityDetails();
    fetchFeePayment();
  }, [permit.id, permit.industrial_sector_id, permit.entity_id, permit.intent_registration_id, permit.document_uploads, permit.uploaded_files, permit.public_consultation_proof]);

  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true);
      
      // Fetch documents associated with the permit from documents table
      const { data: permitDocs, error: permitError } = await supabase
        .from('documents')
        .select('*')
        .eq('permit_id', permit.id)
        .order('uploaded_at', { ascending: false });

      if (permitError) throw permitError;
      
      let allDocuments: Document[] = permitDocs || [];
      
      // If there's a linked intent registration, also fetch those documents
      if (permit.intent_registration_id) {
        const { data: intentDocs, error: intentError } = await supabase
          .from('documents')
          .select('*')
          .eq('intent_registration_id', permit.intent_registration_id)
          .order('uploaded_at', { ascending: false });

        if (!intentError && intentDocs) {
          // Merge documents, avoiding duplicates
          const existingIds = new Set(allDocuments.map(d => d.id));
          const uniqueIntentDocs = intentDocs.filter(d => !existingIds.has(d.id));
          allDocuments = [...allDocuments, ...uniqueIntentDocs];
        }
      }
      
      // Also include documents from document_uploads JSON field in permit_applications
      if (permit.document_uploads && typeof permit.document_uploads === 'object') {
        Object.entries(permit.document_uploads).forEach(([docType, docData]: [string, any]) => {
          if (docData && docData.file_path) {
            allDocuments.push({
              id: docData.id || `uploaded-${docType}`,
              filename: docData.name || docType,
              file_path: docData.file_path,
              uploaded_at: docData.uploadedAt || new Date().toISOString(),
              file_size: docData.size || 0,
              document_type: docType.replace(/_/g, ' '),
            });
          }
        });
      }
      
      // Also include documents from uploaded_files JSON array
      if (Array.isArray(permit.uploaded_files)) {
        permit.uploaded_files.forEach((file: any, index: number) => {
          if (file && file.file_path) {
            allDocuments.push({
              id: file.id || `file-${index}`,
              filename: file.name || file.filename || `File ${index + 1}`,
              file_path: file.file_path,
              uploaded_at: file.uploadedAt || file.uploaded_at || new Date().toISOString(),
              file_size: file.size || file.file_size || 0,
              document_type: file.document_type || file.type || 'Other',
            });
          }
        });
      }
      
      // Also include documents from public_consultation_proof JSON array (Consultation tab documents)
      if (Array.isArray(permit.public_consultation_proof)) {
        permit.public_consultation_proof.forEach((file: any, index: number) => {
          if (file && file.file_path) {
            // Check if document is already included (avoid duplicates)
            const existingIds = new Set(allDocuments.map(d => d.id));
            if (!existingIds.has(file.id)) {
              allDocuments.push({
                id: file.id || `consultation-${index}`,
                filename: file.name || file.filename || `Consultation Document ${index + 1}`,
                file_path: file.file_path,
                uploaded_at: file.uploadedAt || file.uploaded_at || new Date().toISOString(),
                file_size: file.size || file.file_size || 0,
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

  const fetchFeePayment = async () => {
    try {
      setLoadingFees(true);
      const { data, error } = await supabase
        .from('fee_payments')
        .select('*')
        .eq('permit_application_id', permit.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setFeePayment(data);
    } catch (error) {
      console.error('Error fetching fee payment:', error);
    } finally {
      setLoadingFees(false);
    }
  };

  const fetchEntityDetails = async () => {
    if (!permit.entity_id) return;
    try {
      const { data, error } = await supabase
        .from('entities')
        .select('*')
        .eq('id', permit.entity_id)
        .maybeSingle();

      if (error) throw error;
      setEntityDetails(data);
    } catch (error) {
      console.error('Error fetching entity details:', error);
    }
  };

  const fetchIndustrialSector = async () => {
    if (!permit.industrial_sector_id) return;
    try {
      const { data, error } = await supabase
        .from('industrial_sectors')
        .select('name')
        .eq('id', permit.industrial_sector_id)
        .maybeSingle();

      if (error) throw error;
      setIndustrialSector(data?.name || null);
    } catch (error) {
      console.error('Error fetching industrial sector:', error);
    }
  };

  const fetchPrescribedActivity = async () => {
    if (!permit.activity_classification) return;
    try {
      const { data, error } = await supabase
        .from('prescribed_activities')
        .select('category_number, category_type, activity_description, fee_category')
        .eq('id', permit.activity_classification)
        .maybeSingle();

      if (error) throw error;
      setPrescribedActivity(data);
    } catch (error) {
      console.error('Error fetching prescribed activity:', error);
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
      
      toast({
        title: "Download Started",
        description: `Downloading ${filename}`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download document",
        variant: "destructive"
      });
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
      console.error('View error:', error);
      toast({
        title: "View Failed",
        description: "Failed to open document",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return format(new Date(dateString), 'MMMM dd, yyyy');
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Not calculated';
    return `PGK ${amount.toLocaleString()}`;
  };

  const getPaymentStatusBadge = (status?: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: 'secondary',
      paid: 'default',
      overdue: 'destructive',
      waived: 'outline'
    };
    return (
      <Badge variant={variants[status || 'pending'] || 'outline'} className="capitalize">
        {(status || 'pending').replace('_', ' ')}
      </Badge>
    );
  };

  const renderField = (label: string, value: any, fullWidth = false) => {
    if (value === null || value === undefined || value === '') return null;
    return (
      <div className={`p-3 bg-muted/30 rounded-lg ${fullWidth ? 'md:col-span-2' : ''}`}>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium whitespace-pre-wrap">{value}</p>
      </div>
    );
  };

  // Group documents by type
  const groupedDocuments = documents.reduce((acc, doc) => {
    const type = doc.document_type || 'Other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  return (
    <div className="space-y-4">
      <Card className="bg-glass/50 backdrop-blur-sm border-glass">
        <CardHeader className="bg-primary/10">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <CardTitle className="flex items-center gap-2">
                {permit.entity_type === 'COMPANY' ? (
                  <Building className="w-6 h-6" />
                ) : (
                  <User className="w-6 h-6" />
                )}
                {permit.title}
              </CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2 flex-wrap">
                  {permit.application_number && (
                    <>
                      <span className="font-mono text-sm">{permit.application_number}</span>
                      <span>•</span>
                    </>
                  )}
                  {permit.permit_number && (
                    <>
                      <span className="font-mono text-sm">{permit.permit_number}</span>
                      <span>•</span>
                    </>
                  )}
                  <Badge variant="outline">{permit.permit_type}</Badge>
                  <span>•</span>
                  <span>Created {formatDate(permit.created_at)}</span>
                </div>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* Registration Details Section */}
          <Collapsible open={openSections.registration} onOpenChange={() => toggleSection('registration')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Registration Details</h3>
              </div>
              {openSections.registration ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4">
              {/* Entity Details */}
              <div className="p-4 bg-primary/10 rounded-lg space-y-4">
                <div className="flex items-center gap-2">
                  {entityDetails?.entity_type === 'COMPANY' ? (
                    <Building className="w-5 h-5 text-primary" />
                  ) : (
                    <User className="w-5 h-5 text-primary" />
                  )}
                  <Label className="font-medium text-lg">Entity Information</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('Entity Name', entityDetails?.name || permit.entity_name)}
                  {renderField('Entity Type', entityDetails?.entity_type || permit.entity_type)}
                  {renderField('Registration Number', entityDetails?.registration_number)}
                  {renderField('Tax Number', entityDetails?.tax_number)}
                  {renderField('Email', entityDetails?.email)}
                  {renderField('Phone', entityDetails?.phone)}
                  {renderField('Registered Address', entityDetails?.registered_address)}
                  {renderField('Postal Address', entityDetails?.postal_address)}
                  {renderField('Contact Person', entityDetails?.contact_person)}
                  {renderField('Contact Email', entityDetails?.contact_person_email)}
                  {renderField('Contact Phone', entityDetails?.contact_person_phone)}
                </div>
              </div>

              {/* Application Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                {renderField('Application Number', permit.application_number)}
                {renderField('Permit Number', permit.permit_number)}
                {renderField('Permit Type', permit.permit_type)}
                {renderField('Status', permit.status)}
                {renderField('Application Date', formatDate(permit.application_date))}
                {renderField('Approval Date', permit.approval_date ? formatDate(permit.approval_date) : null)}
                {renderField('Expiry Date', permit.expiry_date ? formatDate(permit.expiry_date) : null)}
                {permit.intent_registration_id && renderField('Linked Intent', 'Yes (From Intent Registration)')}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Project Details Section */}
          <Collapsible open={openSections.project} onOpenChange={() => toggleSection('project')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Project Details</h3>
              </div>
              {openSections.project ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4">
              {/* Project Description */}
              {permit.project_description && (
                <div className="p-4 bg-primary/10 rounded-lg space-y-2">
                  <Label className="text-muted-foreground text-sm">Project Description</Label>
                  <p className="font-medium whitespace-pre-wrap">{permit.project_description}</p>
                </div>
              )}

              {permit.description && !permit.project_description && (
                <div className="p-4 bg-primary/10 rounded-lg space-y-2">
                  <Label className="text-muted-foreground text-sm">Description</Label>
                  <p className="font-medium whitespace-pre-wrap">{permit.description}</p>
                </div>
              )}

              {/* Project Dates and Cost */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                {permit.commencement_date && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Commencement Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <p className="font-medium">{formatDate(permit.commencement_date)}</p>
                    </div>
                  </div>
                )}
                {permit.completion_date && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Completion Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <p className="font-medium">{formatDate(permit.completion_date)}</p>
                    </div>
                  </div>
                )}
                {renderField('Permit Period', permit.permit_period)}
                {permit.estimated_cost_kina && renderField('Estimated Cost', formatCurrency(permit.estimated_cost_kina))}
              </div>

              {/* Environmental Impact & Mitigation */}
              {permit.environmental_impact && (
                <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <Label className="text-muted-foreground text-sm">Environmental Impact</Label>
                  <p className="font-medium whitespace-pre-wrap">{permit.environmental_impact}</p>
                </div>
              )}

              {permit.mitigation_measures && (
                <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <Label className="text-muted-foreground text-sm">Mitigation Measures</Label>
                  <p className="font-medium whitespace-pre-wrap">{permit.mitigation_measures}</p>
                </div>
              )}

              {/* Government & Stakeholder Info */}
              {(permit.government_agreements_details || permit.consulted_departments || permit.required_approvals || permit.landowner_negotiation_status) && (
                <div className="p-4 bg-blue-500/10 rounded-lg space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <Label className="font-medium">Government & Stakeholder Engagement</Label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField('Agreement with Government', permit.government_agreements_details, true)}
                    {renderField('Departments/Statutory Bodies Approached', permit.consulted_departments, true)}
                    {renderField('Other Approvals Required', permit.required_approvals, true)}
                    {renderField('Landowner Negotiation Status', permit.landowner_negotiation_status)}
                  </div>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Site Description Section */}
          <Collapsible open={openSections.siteMapping} onOpenChange={() => toggleSection('siteMapping')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Project Site Description</h3>
              </div>
              {openSections.siteMapping ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4">
              {/* Location Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-500/10 rounded-lg">
                {renderField('Province', permit.province)}
                {renderField('District', permit.district)}
                {renderField('LLG', permit.llg)}
              </div>

              {permit.activity_location && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Project Site Address</p>
                  <p className="font-medium">{permit.activity_location}</p>
                </div>
              )}

              {/* Area calculated dynamically from project_boundary using Turf.js for accuracy */}
              {(() => {
                // Calculate area from project_boundary geometry using Turf.js (same as map component)
                let areaSqKm: number | null = null;
                let areaHectares: number | null = null;
                
                if (permit.project_boundary) {
                  try {
                    // Handle both Feature and raw Polygon structures
                    const geometry = permit.project_boundary.geometry || permit.project_boundary;
                    if (geometry?.type === 'Polygon' && geometry?.coordinates) {
                      const turfPolygon = polygon(geometry.coordinates);
                      const areaSqMeters = area(turfPolygon);
                      areaSqKm = areaSqMeters / 1_000_000;
                      areaHectares = areaSqMeters / 10_000;
                    }
                  } catch (e) {
                    console.error('Error calculating area:', e);
                  }
                }
                
                if (areaSqKm == null && areaHectares == null) return null;
                
                return (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Area (sq km)</p>
                      <p className="font-bold text-lg">
                        {areaSqKm?.toFixed(4) ?? 'N/A'}
                      </p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Area (hectares)</p>
                      <p className="font-bold text-lg">
                        {areaHectares?.toFixed(2) ?? 'N/A'}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {permit.project_site_description && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Project Site Description</p>
                  <p className="font-medium whitespace-pre-wrap">{permit.project_site_description}</p>
                </div>
              )}

              {permit.site_ownership_details && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Site Ownership Details</p>
                  <p className="font-medium whitespace-pre-wrap">{permit.site_ownership_details}</p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Classification Section */}
          <Collapsible open={openSections.classification} onOpenChange={() => toggleSection('classification')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Activity Classification</h3>
              </div>
              {openSections.classification ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                {permit.activity_level && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Activity Level</p>
                    <Badge variant="outline" className="mt-1">{permit.activity_level}</Badge>
                  </div>
                )}
                {industrialSector && renderField('Industrial Sector', industrialSector)}
                {permit.activity_category && renderField('Activity Category', permit.activity_category)}
                {permit.activity_subcategory && renderField('Activity Subcategory', permit.activity_subcategory)}
              </div>

              {/* Prescribed Activity Details */}
              {prescribedActivity && (
                <div className="p-4 bg-primary/10 rounded-lg space-y-3">
                  <Label className="font-medium">Prescribed Activity</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField('Category Number', prescribedActivity.category_number)}
                    {renderField('Category Type', prescribedActivity.category_type)}
                    {renderField('Fee Category', prescribedActivity.fee_category)}
                    {renderField('Activity Description', prescribedActivity.activity_description, true)}
                  </div>
                </div>
              )}

              {/* EIA/EIS Requirements */}
              {(permit.eia_required || permit.eis_required) && (
                <div className="p-4 bg-amber-500/10 rounded-lg">
                  <Label className="font-medium mb-2 block">Environmental Assessment Requirements</Label>
                  <div className="flex gap-4 flex-wrap">
                    {permit.eia_required && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        EIA Required
                      </Badge>
                    )}
                    {permit.eis_required && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        EIS Required
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Water Extraction Details */}
              {permit.water_extraction_details && Object.keys(permit.water_extraction_details).length > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <Label className="font-medium">Water Extraction Details</Label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(permit.water_extraction_details).map(([key, value]) => (
                      <div key={key} className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground capitalize">
                          {key.replace(/^we_/, '').replace(/_/g, ' ')}
                        </p>
                        <p className="font-medium">{String(value) || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Waste Discharge Details */}
              {permit.waste_contaminant_details && Object.keys(permit.waste_contaminant_details).length > 0 && (
                <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-orange-500" />
                    <Label className="font-medium">Waste Discharge Details</Label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(permit.waste_contaminant_details).map(([key, value]) => (
                      <div key={key} className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground capitalize">
                          {key.replace(/^wd_/, '').replace(/_/g, ' ')}
                        </p>
                        <p className="font-medium">{String(value) || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Permit Type Specific Data */}
              {permit.permit_type_specific_data && Object.keys(permit.permit_type_specific_data).length > 0 && (
                <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                  <Label className="font-medium">Permit-Specific Details</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(permit.permit_type_specific_data).map(([key, value]) => (
                      <div key={key} className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground capitalize">
                          {key.replace(/_/g, ' ')}
                        </p>
                        <p className="font-medium">{String(value) || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Consultation Section */}
          <Collapsible open={openSections.consultation} onOpenChange={() => toggleSection('consultation')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Public Consultation</h3>
              </div>
              {openSections.consultation ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                {(permit.consultation_period_start || permit.consultation_period_end) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permit.consultation_period_start && (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Consultation Start Date</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <p className="font-medium">{formatDate(permit.consultation_period_start)}</p>
                        </div>
                      </div>
                    )}
                    {permit.consultation_period_end && (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Consultation End Date</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <p className="font-medium">{formatDate(permit.consultation_period_end)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No public consultation period recorded</p>
                )}

                {/* Legal Declarations */}
                <div className="space-y-2 pt-4 border-t">
                  <Label className="font-medium">Declarations</Label>
                  <div className="flex gap-4 flex-wrap">
                    {permit.legal_declaration_accepted && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Legal Declaration Accepted
                      </Badge>
                    )}
                    {permit.compliance_commitment && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Compliance Commitment
                      </Badge>
                    )}
                    {!permit.legal_declaration_accepted && !permit.compliance_commitment && (
                      <p className="text-sm text-muted-foreground">No declarations recorded</p>
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Documents Section */}
          <Collapsible open={openSections.documents} onOpenChange={() => toggleSection('documents')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Supporting Documents</h3>
                <Badge variant="outline" className="ml-2">{documents.length}</Badge>
              </div>
              {openSections.documents ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4">
              {loadingDocs ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Loading documents...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No documents uploaded</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedDocuments).map(([type, docs]) => (
                    <div key={type} className="p-4 bg-muted/30 rounded-lg space-y-3">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-primary" />
                        <Label className="font-medium capitalize">{type.replace(/_/g, ' ')}</Label>
                        <Badge variant="outline" className="text-xs">{docs.length}</Badge>
                      </div>
                      <div className="space-y-2">
                        {docs.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{doc.filename}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(doc.uploaded_at)}
                                  {doc.file_size && ` • ${(doc.file_size / 1024).toFixed(1)} KB`}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewDocument(doc.file_path)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDownloadDocument(doc.file_path, doc.filename)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Fees Section */}
          <Collapsible open={openSections.fees} onOpenChange={() => toggleSection('fees')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Application Fees</h3>
              </div>
              {openSections.fees ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4">
              {loadingFees ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Loading fee information...</p>
                </div>
              ) : (
                <>
                  {/* Priority 1: Use direct permit columns (new columns) */}
                  {(permit.application_fee && permit.processing_days) ? (
                    <div className="space-y-4">
                      <FeeCalculationDisplay
                        applicationFee={permit.application_fee || 0}
                        compositeFee={permit.composite_fee || 0}
                        totalFee={permit.fee_amount || (permit.application_fee || 0) + (permit.composite_fee || 0)}
                        processingDays={permit.processing_days || 30}
                        source={(permit.fee_source as 'official' | 'estimated') || 'official'}
                        showDetails={true}
                      />
                      
                      {/* Payment Status */}
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-background rounded-lg border">
                            <p className="text-sm text-muted-foreground">Payment Status</p>
                            <div className="mt-1">{getPaymentStatusBadge(permit.payment_status)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : feePayment ? (
                    /* Priority 2: Use fee_payments table */
                    <div className="p-4 bg-green-500/10 rounded-lg space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <Label className="font-medium text-lg">Calculated Fee Details</Label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">Administration Fee</p>
                          <p className="text-lg font-semibold">{formatCurrency(feePayment.administration_fee)}</p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">Technical Fee</p>
                          <p className="text-lg font-semibold">{formatCurrency(feePayment.technical_fee)}</p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                          <p className="text-sm text-muted-foreground">Total Fee</p>
                          <p className="text-xl font-bold text-primary">{formatCurrency(feePayment.total_fee)}</p>
                        </div>
                      </div>
                      
                      {/* Payment Status */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">Payment Status</p>
                          <div className="mt-1">{getPaymentStatusBadge(feePayment.payment_status)}</div>
                        </div>
                        {feePayment.payment_method && (
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-sm text-muted-foreground">Payment Method</p>
                            <p className="font-medium capitalize">{feePayment.payment_method.replace(/_/g, ' ')}</p>
                          </div>
                        )}
                        {feePayment.payment_reference && (
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-sm text-muted-foreground">Payment Reference</p>
                            <p className="font-medium font-mono">{feePayment.payment_reference}</p>
                          </div>
                        )}
                        {feePayment.receipt_number && (
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-sm text-muted-foreground">Receipt Number</p>
                            <p className="font-medium font-mono">{feePayment.receipt_number}</p>
                          </div>
                        )}
                        {feePayment.paid_at && (
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-sm text-muted-foreground">Paid On</p>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-primary" />
                              <p className="font-medium">{formatDate(feePayment.paid_at)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (permit.fee_breakdown && typeof permit.fee_breakdown === 'object' && 
                       ((permit.fee_breakdown as any).totalFee || (permit.fee_breakdown as any).administrationFee)) ? (
                    /* Priority 3: Use fee_breakdown JSON */
                    <div className="space-y-4">
                      <FeeCalculationDisplay
                        applicationFee={(permit.fee_breakdown as any).administrationFee || (permit.fee_breakdown as any).totalFee || 0}
                        compositeFee={(permit.fee_breakdown as any).compositeFee || 0}
                        totalFee={(permit.fee_breakdown as any).totalFee || 0}
                        processingDays={(permit.fee_breakdown as any).processingDays || 30}
                        source={(permit.fee_breakdown as any).source || 'official'}
                        showDetails={true}
                      />

                      {/* Payment Status */}
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-background rounded-lg border">
                            <p className="text-sm text-muted-foreground">Payment Status</p>
                            <div className="mt-1">{getPaymentStatusBadge(permit.payment_status)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (permit.application_fee || permit.fee_amount) ? (
                    /* Priority 4: Basic fee display */
                    <div className="p-4 bg-green-500/10 rounded-lg space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <Label className="font-medium text-lg">Fee Details</Label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">Application Fee</p>
                          <p className="text-lg font-semibold">{formatCurrency(permit.application_fee || 0)}</p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                          <p className="text-sm text-muted-foreground">Total Fee Payable</p>
                          <p className="text-xl font-bold text-primary">{formatCurrency(permit.fee_amount || permit.application_fee || 0)}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">Payment Status</p>
                          <div className="mt-1">{getPaymentStatusBadge(permit.payment_status)}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-500/10 rounded-lg text-center">
                      <DollarSign className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                      <p className="text-sm text-muted-foreground">Fee not yet calculated. Complete the Classification tab to calculate fees.</p>
                    </div>
                  )}
                </>
              )}
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
}
