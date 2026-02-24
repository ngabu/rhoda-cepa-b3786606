import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Clock, Search, Filter, MapPin, Shield, UserCheck, ChevronDown, ChevronsUpDown, FileDown, Loader2, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import {
  PermitSiteMappingTab,
  PermitRegistrationDetailsTab,
  PermitRegistryReviewTab,
  PermitComplianceReviewTab,
  PermitInvoicePaymentsTab,
  PermitMDReviewTab,
} from './permit-review';

interface PermitApplication {
  id: string;
  user_id: string;
  entity_id: string;
  title: string;
  description: string | null;
  permit_type: string;
  status: string;
  application_number: string | null;
  created_at: string;
  updated_at: string;
  activity_location?: string | null;
  estimated_cost_kina?: number | null;
  activity_classification?: string | null;
  activity_category?: string | null;
  activity_subcategory?: string | null;
  activity_level?: string | null;
  permit_period?: string | null;
  commencement_date?: string | null;
  completion_date?: string | null;
  entity_name?: string | null;
  entity_type?: string | null;
  coordinates?: any;
  project_boundary?: any;
  environmental_impact?: string | null;
  mitigation_measures?: string | null;
  compliance_checks?: any;
  uploaded_files?: any;
  project_description?: string | null;
  project_start_date?: string | null;
  project_end_date?: string | null;
  district?: string | null;
  province?: string | null;
  llg?: string | null;
  permit_specific_fields?: any;
  // Location tab fields
  project_site_description?: string | null;
  site_ownership_details?: string | null;
  total_area_sqkm?: number | null;
  // Details of Application (Step 2) fields
  legal_description?: string | null;
  land_type?: string | null;
  owner_name?: string | null;
  tenure?: string | null;
  existing_permits_details?: string | null;
  government_agreements_details?: string | null;
  consulted_departments?: string | null;
  required_approvals?: string | null;
  landowner_negotiation_status?: string | null;
  // Activity Details fields
  proposed_works_description?: string | null;
  operating_hours?: string | null;
  operational_capacity?: string | null;
  operational_details?: string | null;
  // Fee fields
  application_fee?: number | null;
  fee_amount?: number | null;
  fee_breakdown?: any;
  composite_fee?: number | null;
  processing_days?: number | null;
  fee_source?: string | null;
  // Compliance fields
  compliance_commitment?: boolean | null;
  legal_declaration_accepted?: boolean | null;
  eia_required?: boolean | null;
  eis_required?: boolean | null;
  // Consultation fields
  consultation_period_start?: string | null;
  consultation_period_end?: string | null;
  public_consultation_proof?: any;
  // Document fields
  document_uploads?: any;
  intent_registration_id?: string | null;
  industrial_sector_id?: string | null;
  // Classification fields
  permit_category?: string | null;
  permit_type_specific?: string | null;
  permit_type_specific_data?: any;
  ods_quota_allocation?: string | null;
  // Prescribed activity fields
  activity_category_number?: string | null;
  prescribed_activity_description?: string | null;
  activity_level_number?: number | null;
  // Water & Waste details
  water_extraction_details?: any;
  effluent_discharge_details?: any;
  solid_waste_details?: any;
  hazardous_waste_details?: any;
  marine_dumping_details?: any;
  stormwater_details?: any;
  waste_contaminant_details?: any;
  // Chemical details
  chemical_storage_details?: any;
  fuel_storage_details?: any;
  hazardous_material_details?: any;
  pesticide_details?: any;
  mining_chemical_details?: any;
  ods_details?: any;
  // Emission details
  air_emission_details?: any;
  ghg_emission_details?: any;
  noise_emission_details?: any;
  // Environmental details
  biodiversity_abs_details?: any;
  carbon_offset_details?: any;
  land_clearing_details?: any;
  soil_extraction_details?: any;
  wildlife_trade_details?: any;
  rehabilitation_details?: any;
  // Industry details
  aquaculture_details?: any;
  mining_permit_details?: any;
  forest_product_details?: any;
  dredging_details?: any;
  infrastructure_details?: any;
  renewable_energy_details?: any;
  research_details?: any;
  monitoring_license_details?: any;
  // Entity reference
  entity?: {
    id: string;
    name: string;
    entity_type: string;
  };
}

export function PermitApplicationReview() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<PermitApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [expandedApplicationId, setExpandedApplicationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('site-mapping');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      // Use the comprehensive view that joins all child detail tables
      const { data, error } = await supabase
        .from('vw_permit_applications_full')
        .select('*')
        .not('status', 'eq', 'approved')
        .not('status', 'eq', 'draft')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedApplications: PermitApplication[] = (data || []).map(app => {
        const appAny = app as any;
        return {
          ...app,
          // Map location details from view
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
          // Map project details from view
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
          // Map classification details from view
          permit_category: appAny.permit_category,
          activity_classification: appAny.activity_classification,
          activity_category: appAny.activity_category,
          activity_subcategory: appAny.activity_subcategory,
          activity_level: appAny.activity_level,
          eia_required: appAny.eia_required,
          eis_required: appAny.eis_required,
          // Map consultation details from view
          consultation_period_start: appAny.consultation_period_start,
          consultation_period_end: appAny.consultation_period_end,
          consulted_departments: appAny.consulted_departments,
          public_consultation_proof: appAny.public_consultation_proof,
          landowner_negotiation_status: appAny.landowner_negotiation_status,
          government_agreements_details: appAny.government_agreements_details,
          required_approvals: appAny.required_approvals,
          // Map fee details from view
          application_fee: appAny.application_fee,
          fee_amount: appAny.fee_amount,
          fee_breakdown: appAny.fee_breakdown,
          composite_fee: appAny.composite_fee,
          processing_days: appAny.processing_days,
          fee_source: appAny.fee_source,
          // Map compliance details from view
          compliance_commitment: appAny.compliance_commitment,
          legal_declaration_accepted: appAny.legal_declaration_accepted,
          // Map entity reference
          entity: appAny.entity_name ? {
            id: appAny.entity_id || '',
            name: appAny.entity_name,
            entity_type: appAny.entity_type || ''
          } : undefined,
          entity_name: appAny.entity_name,
          entity_type: appAny.entity_type,
        };
      });
      
      setApplications(mappedApplications);
    } catch (error) {
      console.error('Error fetching permit applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch permit applications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = !searchTerm || 
        app.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.entity?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.entity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.application_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.province?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesLevel = levelFilter === 'all' || app.activity_level === levelFilter;

      return matchesSearch && matchesStatus && matchesLevel;
    });
  }, [applications, searchTerm, statusFilter, levelFilter]);

  const activityLevels = useMemo(() => {
    return Array.from(new Set(applications.map(a => a.activity_level).filter(Boolean)));
  }, [applications]);

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedApplications = filteredApplications.slice(startIndex, endIndex);

  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, levelFilter]);

  const exportToExcel = () => {
    const exportData = filteredApplications.map(app => ({
      'Application Number': app.application_number || '-',
      'Title': app.title,
      'Entity': app.entity?.name || app.entity_name || '-',
      'Permit Type': app.permit_type,
      'Activity Level': app.activity_level || '-',
      'Province': app.province || '-',
      'District': app.district || '-',
      'Status': app.status,
      'Created Date': format(new Date(app.created_at), 'MMM dd, yyyy'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    worksheet['!cols'] = [
      { wch: 20 }, { wch: 30 }, { wch: 25 }, { wch: 20 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Permit Applications');
    XLSX.writeFile(workbook, `Permit_Applications_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const exportToCSV = () => {
    const exportData = filteredApplications.map(app => ({
      'Application Number': app.application_number || '-',
      'Title': app.title,
      'Entity': app.entity?.name || app.entity_name || '-',
      'Permit Type': app.permit_type,
      'Activity Level': app.activity_level || '-',
      'Province': app.province || '-',
      'District': app.district || '-',
      'Status': app.status,
      'Created Date': format(new Date(app.created_at), 'MMM dd, yyyy'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Permit_Applications_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="print:border-none print:shadow-none print:bg-transparent">
      <CardHeader className="print:hidden">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Permit Application Reviews
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={exportToExcel} className="bg-primary hover:bg-primary/90 text-primary-foreground" size="sm">
                <FileDown className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
              <Button onClick={exportToCSV} className="bg-accent hover:bg-accent/90 text-accent-foreground" size="sm">
                <FileDown className="h-4 w-4 mr-2" />
                Export to CSV
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by title, entity, application number, or province..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="pl-9" 
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-background">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_initial_review">Under Initial Review</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="requires_clarification">Requires Clarification</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[180px] bg-background">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Activity Level" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="all">All Levels</SelectItem>
                  {activityLevels.map(level => (
                    <SelectItem key={level} value={level!}>
                      Level {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Showing {filteredApplications.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredApplications.length)} of {filteredApplications.length} permit applications
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="print:hidden">
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Entity</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Permit Type</TableHead>
              <TableHead>Activity Level</TableHead>
              <TableHead>Province</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length === 0 ? (
              <TableRow className="print:hidden">
                <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No permit applications found</h3>
                  <p>
                    {applications.length === 0 
                      ? "No permit applications have been submitted yet."
                      : "Try adjusting your filters to see more results."
                    }
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedApplications.map(app => {
                const isExpanded = expandedApplicationId === app.id;
                return (
                  <>
                    <TableRow 
                      key={app.id} 
                      className={`cursor-pointer transition-colors print:hidden ${isExpanded ? 'bg-accent hover:bg-accent/90' : 'hover:bg-muted/50'}`} 
                      onClick={() => setExpandedApplicationId(isExpanded ? null : app.id)}
                    >
                      <TableCell>
                        {isExpanded 
                          ? <ChevronDown className="w-4 h-4 text-primary" /> 
                          : <ChevronsUpDown className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />}
                      </TableCell>
                      <TableCell className="font-medium">{app.entity?.name || app.entity_name || '-'}</TableCell>
                      <TableCell className="max-w-xs truncate">{app.title}</TableCell>
                      <TableCell>{app.permit_type}</TableCell>
                      <TableCell>{app.activity_level ? `Level ${app.activity_level}` : '-'}</TableCell>
                      <TableCell>{app.province || '-'}</TableCell>
                      <TableCell>{format(new Date(app.created_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(app.status)}>
                          {app.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow key={`${app.id}-details`} className="bg-glass/50 backdrop-blur-md hover:bg-glass/50 print:bg-transparent">
                        <TableCell colSpan={8} className="p-0 print:p-0">
                          <div className="border-t border-glass/30 bg-white/80 dark:bg-primary/5 backdrop-blur-md p-6 print:border-none print:p-0 print:bg-transparent print:block">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full print:hidden">
                              <TabsList className="grid w-full grid-cols-6">
                                <TabsTrigger value="site-mapping" className="flex items-center gap-1 text-xs">
                                  <MapPin className="w-3 h-3" />
                                  Site Mapping
                                </TabsTrigger>
                                <TabsTrigger value="registration" className="flex items-center gap-1 text-xs">
                                  <FileText className="w-3 h-3" />
                                  Permit Details
                                </TabsTrigger>
                                <TabsTrigger value="registry-review" className="flex items-center gap-1 text-xs">
                                  <FileText className="w-3 h-3" />
                                  Registry Review
                                </TabsTrigger>
                                <TabsTrigger value="compliance-review" className="flex items-center gap-1 text-xs">
                                  <Shield className="w-3 h-3" />
                                  Compliance Review
                                </TabsTrigger>
                                <TabsTrigger value="invoice-payment" className="flex items-center gap-1 text-xs">
                                  <Receipt className="w-3 h-3" />
                                  Invoice & Payment
                                </TabsTrigger>
                                <TabsTrigger value="md-review" className="flex items-center gap-1 text-xs">
                                  <UserCheck className="w-3 h-3" />
                                  MD Review & Approval
                                </TabsTrigger>
                              </TabsList>

                              <TabsContent value="site-mapping" className="mt-4">
                                <PermitSiteMappingTab application={app} />
                              </TabsContent>

                              <TabsContent value="registration" className="mt-4">
                                <PermitRegistrationDetailsTab application={app} />
                              </TabsContent>

                              <TabsContent value="registry-review" className="mt-4">
                                <PermitRegistryReviewTab 
                                  applicationId={app.id}
                                  currentStatus={app.status}
                                  onStatusUpdate={fetchApplications}
                                />
                              </TabsContent>

                              <TabsContent value="compliance-review" className="mt-4">
                                <PermitComplianceReviewTab 
                                  applicationId={app.id}
                                  currentStatus={app.status}
                                  onStatusUpdate={fetchApplications}
                                />
                              </TabsContent>

                              <TabsContent value="invoice-payment" className="mt-4">
                                <PermitInvoicePaymentsTab 
                                  applicationId={app.id}
                                  entityId={app.entity_id}
                                  onStatusUpdate={fetchApplications}
                                />
                              </TabsContent>

                              <TabsContent value="md-review" className="mt-4">
                                <PermitMDReviewTab 
                                  applicationId={app.id}
                                  currentStatus={app.status}
                                  onStatusUpdate={fetchApplications}
                                />
                              </TabsContent>
                            </Tabs>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
