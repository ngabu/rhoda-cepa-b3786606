import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileX, CheckCircle, AlertTriangle, FileText, Download, Eye, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CEPAInternalReviewTabs } from "@/components/shared/CEPAInternalReviewTabs";
import { Button } from "@/components/ui/button";

interface SubmittedDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: string;
}

export function PermitSurrenderReview() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");

  const surrenderRequests = [
    {
      id: "1",
      permitNumber: "CEPA-PER-2024-0005",
      permitType: "Forestry Project",
      applicant: "XYZ Forestry Co",
      reason: "Project operations ceased due to completion of forestry activities. Site has been fully rehabilitated.",
      status: "pending",
      submittedDate: "2024-11-08",
      complianceStatus: "All obligations met",
      outstandingIssues: "None",
      // Documents submitted via public dashboard
      documents: [
        { id: "1", name: "Final Compliance Report.pdf", type: "Compliance Report", uploadedAt: "2024-11-08", size: "2.1 MB" },
        { id: "2", name: "Site Restoration Certificate.pdf", type: "Certificate", uploadedAt: "2024-11-08", size: "0.8 MB" },
        { id: "3", name: "Environmental Clearance Letter.pdf", type: "Clearance Letter", uploadedAt: "2024-11-08", size: "0.4 MB" }
      ] as SubmittedDocument[]
    }
  ];

  const selectedRequestData = surrenderRequests.find(r => r.id === selectedRequest);

  const handleSubmitReview = () => {
    console.log("Registry review submitted:", { selectedRequest, reviewStatus, reviewNotes });
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
          Back to Surrender Requests
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileX className="w-5 h-5 text-primary" />
              Surrender Request Details (Read-Only)
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
                <Label className="text-muted-foreground">Submitted Date</Label>
                <p className="font-medium">{selectedRequestData.submittedDate}</p>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-muted-foreground">Reason for Surrender</Label>
              <p className="mt-1 p-3 bg-muted rounded-lg">{selectedRequestData.reason}</p>
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
                <Label className="text-muted-foreground">Outstanding Issues</Label>
                <p className="font-medium">{selectedRequestData.outstandingIssues}</p>
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
          applicationType="permit_surrender"
          applicationNumber={selectedRequestData.permitNumber}
          currentStatus={selectedRequestData.status}
        />
      </div>
    );
  }

  // Show listing view
  return (
    <>
      <Alert className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Permit surrender is permanent. Ensure all compliance obligations and site restoration requirements are verified before approval.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileX className="w-5 h-5 mr-2" />
            Permit Surrender Reviews ({surrenderRequests.length})
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Review and assess permit surrender applications
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {surrenderRequests.length === 0 ? (
            <div className="text-center py-12">
              <FileX className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No surrender requests</h3>
              <p className="text-muted-foreground">
                No surrender requests have been submitted yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {surrenderRequests.map((request) => (
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
                  <p className="text-sm text-muted-foreground mt-2">Submitted: {request.submittedDate}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
