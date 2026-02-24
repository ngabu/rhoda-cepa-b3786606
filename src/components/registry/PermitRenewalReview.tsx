import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RefreshCw, CheckCircle, Calendar, FileText, Download, Eye, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CEPAInternalReviewTabs } from "@/components/shared/CEPAInternalReviewTabs";
import { Button } from "@/components/ui/button";

interface SubmittedDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: string;
}

export function PermitRenewalReview() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");

  // Mock data - replace with actual data from Supabase
  const renewalRequests = [
    {
      id: "1",
      permitNumber: "CEPA-PER-2024-0001",
      permitType: "Mining Operation",
      applicant: "ABC Mining Ltd",
      currentExpiry: "2024-12-31",
      requestedPeriod: "3 Years",
      preferredStartDate: "2025-01-01",
      operationalChanges: "No major changes. Minor expansion to include adjacent area.",
      status: "pending",
      submittedDate: "2024-10-15",
      complianceStatus: "Good Standing",
      // Compliance Status Review fields (matching public dashboard)
      outstandingComplianceIssues: "No outstanding compliance issues found",
      recentInspections: "Last inspection: March 15, 2024 - Compliant",
      // Documents submitted via public dashboard
      documents: [
        { id: "1", name: "Updated Environmental Management Plan.pdf", type: "Management Plan", uploadedAt: "2024-10-15", size: "2.3 MB" },
        { id: "2", name: "Annual Monitoring Report 2024.pdf", type: "Monitoring Report", uploadedAt: "2024-10-15", size: "1.8 MB" },
        { id: "3", name: "Compliance Certificate.pdf", type: "Certificate", uploadedAt: "2024-10-15", size: "0.5 MB" }
      ] as SubmittedDocument[]
    },
    {
      id: "2",
      permitNumber: "CEPA-PER-2024-0002",
      permitType: "Forestry Project",
      applicant: "XYZ Forestry Co",
      currentExpiry: "2025-03-31",
      requestedPeriod: "2 Years",
      preferredStartDate: "2025-04-01",
      operationalChanges: "Introduction of sustainable harvesting techniques.",
      status: "under_review",
      submittedDate: "2024-11-01",
      complianceStatus: "Good Standing",
      outstandingComplianceIssues: "Minor documentation update required",
      recentInspections: "Last inspection: September 10, 2024 - Compliant with recommendations",
      documents: [
        { id: "4", name: "Sustainable Harvesting Plan.pdf", type: "Management Plan", uploadedAt: "2024-11-01", size: "3.2 MB" },
        { id: "5", name: "Forest Inventory Report.pdf", type: "Monitoring Report", uploadedAt: "2024-11-01", size: "2.7 MB" }
      ] as SubmittedDocument[]
    }
  ];

  const selectedRequestData = renewalRequests.find(r => r.id === selectedRequest);

  const handleSubmitReview = () => {
    console.log("Registry review submitted:", { selectedRequest, reviewStatus, reviewNotes });
    // TODO: Save to Supabase
  };

  const handleBack = () => {
    setSelectedRequest(null);
  };

  // Show detail view when a record is selected
  if (selectedRequestData) {
    return (
      <div className="animate-slide-in-right space-y-6">
        {/* Back Navigation */}
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="flex items-center gap-2 hover:bg-accent"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Renewal Requests
        </Button>

        {/* Read-Only Renewal Request Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-primary" />
              Renewal Request Details (Read-Only)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Permit Number</Label>
                <p className="font-medium">{selectedRequestData.permitNumber}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Permit Type</Label>
                <p className="font-medium">{selectedRequestData.permitType}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Applicant</Label>
                <p className="font-medium">{selectedRequestData.applicant}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Current Expiry</Label>
                <p className="font-medium">{selectedRequestData.currentExpiry}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Requested Period</Label>
                <p className="font-medium">{selectedRequestData.requestedPeriod}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Preferred Start Date</Label>
                <p className="font-medium">{selectedRequestData.preferredStartDate}</p>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-muted-foreground">Operational Changes (if any)</Label>
              <p className="mt-1 p-3 bg-muted rounded-lg">{selectedRequestData.operationalChanges}</p>
            </div>

            <Separator />

            {/* Compliance Status Review Section - matches public dashboard */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">Compliance Status Review</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Outstanding Compliance Issues</Label>
                  <div className="mt-1 p-3 bg-muted rounded-lg text-sm">
                    {selectedRequestData.outstandingComplianceIssues}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Recent Inspections</Label>
                  <div className="mt-1 p-3 bg-muted rounded-lg text-sm">
                    {selectedRequestData.recentInspections}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Compliance Status</Label>
                <p className="font-medium flex items-center gap-2 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {selectedRequestData.complianceStatus}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Submitted Date</Label>
                <p className="font-medium">{selectedRequestData.submittedDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submitted Documents Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Submitted Documents ({selectedRequestData.documents?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRequestData.documents && selectedRequestData.documents.length > 0 ? (
              <div className="space-y-3">
                {selectedRequestData.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>Uploaded: {doc.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No documents have been submitted</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CEPA Internal Review Tabs */}
        <CEPAInternalReviewTabs
          applicationId={selectedRequestData.id}
          applicationType="permit_renewal"
          applicationNumber={selectedRequestData.permitNumber}
          currentStatus={selectedRequestData.status}
        />
      </div>
    );
  }

  // Show listing view
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <RefreshCw className="w-5 h-5 mr-2" />
          Permit Renewal Reviews ({renewalRequests.length})
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Review and assess permit renewal applications
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {renewalRequests.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No renewal requests</h3>
            <p className="text-muted-foreground">
              No renewal requests have been submitted yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {renewalRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => setSelectedRequest(request.id)}
                className="p-4 border rounded-lg cursor-pointer transition-all hover:bg-accent/50 hover:border-primary"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-card-foreground">{request.permitNumber}</p>
                    <p className="text-sm text-muted-foreground">{request.applicant}</p>
                  </div>
                  <Badge variant={request.status === 'pending' ? 'secondary' : 'default'}>
                    {request.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>Expires: {request.currentExpiry} | Submitted: {request.submittedDate}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
