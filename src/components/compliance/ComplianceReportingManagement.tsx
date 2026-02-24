import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCheck, Clock, CheckCircle, AlertTriangle, Shield, Eye, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "sonner";

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

export function ComplianceReportingManagement() {
  const { profile, user } = useAuth();
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isManager = profile?.staff_position && ['manager', 'director', 'managing_director'].includes(profile.staff_position);

  // Fetch compliance reports from view
  const { data: reports, isLoading, refetch } = useQuery({
    queryKey: ['compliance-reports-list'],
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
    setReviewNotes(report.review_notes || "");
    setReviewStatus(report.status);
    setIsViewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedReport || !reviewStatus) {
      toast.error("Please select a status");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('compliance_reports')
        .update({
          status: reviewStatus,
          review_notes: reviewNotes,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', selectedReport.id);

      if (error) throw error;

      toast.success("Review submitted successfully");
      setIsViewDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error("Failed to submit review: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
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
  const compliantCount = reports?.filter(r => r.status === 'approved').length || 0;
  const violationsCount = reports?.filter(r => r.status === 'rejected').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">
            Compliance Reporting Management
          </h2>
          <p className="text-sm text-muted-foreground">
            {isManager 
              ? 'Monitor compliance reporting trends and assign reports for technical assessment' 
              : 'Conduct technical assessments of environmental compliance reports'
            }
          </p>
        </div>
        <Badge variant="outline" className="px-4 py-2">
          <Shield className="w-4 h-4 mr-2" />
          Compliance {isManager ? 'Manager' : 'Officer'}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assessment</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Assessment</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{underReviewCount}</div>
            <p className="text-xs text-muted-foreground">In technical review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{compliantCount}</div>
            <p className="text-xs text-muted-foreground">Meeting standards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{violationsCount}</div>
            <p className="text-xs text-muted-foreground">Requires action</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Reports for Assessment</CardTitle>
          <CardDescription>
            Technical assessment of environmental compliance reports under PNG Environment Act 2000
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
              <p className="text-lg font-medium mb-2">No reports for assessment</p>
              <p className="text-sm">
                {isManager 
                  ? 'Reports cleared by Registry will appear here for assignment' 
                  : 'Assigned reports will appear here for your technical assessment'
                }
              </p>
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

      {/* View/Review Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compliance Report Review</DialogTitle>
            <DialogDescription>
              Review and provide feedback on this compliance report
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
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Report Description</Label>
                  <p className="text-sm">{selectedReport.description || 'No description provided'}</p>
                </div>
              </div>

              {/* Review Section */}
              <Card className="bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Compliance Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Review Status *</Label>
                    <Select value={reviewStatus} onValueChange={setReviewStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved (Compliant)</SelectItem>
                        <SelectItem value="rejected">Rejected (Non-Compliant)</SelectItem>
                        <SelectItem value="requires_action">Requires Action</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Review Notes / Feedback</Label>
                    <Textarea
                      placeholder="Provide feedback for the permit holder..."
                      rows={4}
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || !reviewStatus}
                  className="flex-1"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
