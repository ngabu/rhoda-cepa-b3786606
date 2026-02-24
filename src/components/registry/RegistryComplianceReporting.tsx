import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCheck, Clock, CheckCircle, AlertTriangle, Eye } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface ComplianceReport {
  id: string;
  permit_id: string;
  user_id: string;
  report_date: string;
  status: string;
  description: string | null;
  file_path: string | null;
  review_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  permit_number: string | null;
  project_title: string | null;
  project_description: string | null;
  entity_name: string | null;
  entity_type: string | null;
  province: string | null;
  district: string | null;
  activity_level: string | null;
  reviewer_name: string | null;
}

export function RegistryComplianceReporting() {
  const { profile } = useAuth();
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const isManager = profile?.staff_position && ['manager', 'director', 'managing_director'].includes(profile.staff_position);

  // Fetch compliance reports from view
  const { data: reports, isLoading } = useQuery({
    queryKey: ['registry-compliance-reports-list'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('vw_compliance_reports_list')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ComplianceReport[];
    },
  });

  const handleViewReport = (report: ComplianceReport) => {
    setSelectedReport(report);
    setIsViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Submitted</Badge>;
      case 'under_review':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Under Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Calculate stats
  const pendingCount = reports?.filter(r => r.status === 'submitted' || r.status === 'pending').length || 0;
  const underReviewCount = reports?.filter(r => r.status === 'under_review').length || 0;
  const approvedCount = reports?.filter(r => r.status === 'approved').length || 0;
  const actionRequiredCount = reports?.filter(r => r.status === 'rejected' || r.status === 'requires_action').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">
            Compliance Reports Review
          </h2>
          <p className="text-sm text-muted-foreground">
            {isManager 
              ? 'Monitor and review all environmental compliance reports (Read-Only)' 
              : 'Review assigned compliance reports for accuracy and completeness (Read-Only)'
            }
          </p>
        </div>
        <Badge variant="outline" className="px-4 py-2">
          Registry {isManager ? 'Manager' : 'Officer'}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{underReviewCount}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Compliant</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non-Compliant</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actionRequiredCount}</div>
            <p className="text-xs text-muted-foreground">Action required</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Reports</CardTitle>
          <CardDescription>
            Review submitted environmental compliance reports from permit holders (Read-Only View)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Loading reports...</p>
            </div>
          ) : !reports || reports.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No compliance reports to review</p>
              <p className="text-sm">Reports will appear here when submitted by permit holders</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permit Number</TableHead>
                  <TableHead>Project Title</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-mono text-sm">
                      {report.permit_number || 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {report.project_title || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{report.entity_name || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">{report.entity_type}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {report.report_date ? format(new Date(report.report_date), 'dd MMM yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewReport(report)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Dialog (Read-Only) */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compliance Report Details</DialogTitle>
            <DialogDescription>
              View compliance report information (Read-Only)
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6 py-4">
              {/* Report Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Permit Number</Label>
                  <p className="font-medium">{selectedReport.permit_number || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Project Title</Label>
                  <p className="font-medium">{selectedReport.project_title || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Entity</Label>
                  <p className="font-medium">{selectedReport.entity_name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Entity Type</Label>
                  <p className="font-medium">{selectedReport.entity_type || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Province</Label>
                  <p className="font-medium">{selectedReport.province || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">District</Label>
                  <p className="font-medium">{selectedReport.district || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Submission Date</Label>
                  <p className="font-medium">
                    {selectedReport.report_date ? format(new Date(selectedReport.report_date), 'dd MMM yyyy') : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Activity Level</Label>
                  <p className="font-medium">{selectedReport.activity_level || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Report Description</Label>
                  <p className="text-sm bg-muted/30 p-3 rounded-lg mt-1">
                    {selectedReport.description || 'No description provided'}
                  </p>
                </div>
              </div>

              {/* Review Notes (if available) */}
              {selectedReport.review_notes && (
                <Card className="bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Compliance Feedback</CardTitle>
                    {selectedReport.reviewer_name && (
                      <CardDescription>
                        Reviewed by: {selectedReport.reviewer_name}
                        {selectedReport.reviewed_at && 
                          ` on ${format(new Date(selectedReport.reviewed_at), 'dd MMM yyyy')}`
                        }
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedReport.review_notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Close Button */}
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
