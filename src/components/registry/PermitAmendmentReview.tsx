import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Edit, FileText, Download, Eye, ArrowLeft } from "lucide-react";
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

export function PermitAmendmentReview() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");

  const amendmentRequests = [
    {
      id: "1",
      permitNumber: "CEPA-PER-2024-0001",
      permitType: "Mining Operation",
      applicant: "ABC Mining Ltd",
      amendmentType: "Scope of Activities",
      amendmentDetails: "Request to expand mining area to include adjacent 50 hectares for additional mineral extraction.",
      environmentalImpact: "Minimal impact expected with proper mitigation measures in place.",
      mitigationMeasures: "Enhanced monitoring, buffer zones, and progressive rehabilitation.",
      status: "pending",
      submittedDate: "2024-11-05",
      // Documents submitted via public dashboard
      documents: [
        { id: "1", name: "Technical Report.pdf", type: "Technical Report", uploadedAt: "2024-11-05", size: "3.1 MB" },
        { id: "2", name: "Revised Site Plan.pdf", type: "Site Plan", uploadedAt: "2024-11-05", size: "4.5 MB" },
        { id: "3", name: "Environmental Assessment Update.pdf", type: "EIA Report", uploadedAt: "2024-11-05", size: "2.8 MB" }
      ] as SubmittedDocument[]
    },
    {
      id: "2",
      permitNumber: "CEPA-PER-2024-0003",
      permitType: "Industrial Facility",
      applicant: "Industrial Corp PNG",
      amendmentType: "Production Capacity",
      amendmentDetails: "Increase production capacity by 30% through equipment upgrades.",
      environmentalImpact: "Increased emissions but within acceptable limits with new technology.",
      mitigationMeasures: "Installation of advanced filtration systems and continuous monitoring.",
      status: "under_review",
      submittedDate: "2024-10-28",
      documents: [
        { id: "4", name: "Capacity Upgrade Proposal.pdf", type: "Technical Report", uploadedAt: "2024-10-28", size: "2.2 MB" },
        { id: "5", name: "Emission Study Report.pdf", type: "Environmental Assessment", uploadedAt: "2024-10-28", size: "1.9 MB" }
      ] as SubmittedDocument[]
    }
  ];

  const selectedRequestData = amendmentRequests.find(r => r.id === selectedRequest);

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
          Back to Amendment Requests
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Amendment Request Details (Read-Only)
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
                <Label className="text-muted-foreground">Amendment Type</Label>
                <Badge variant="outline">{selectedRequestData.amendmentType}</Badge>
              </div>
              <div>
                <Label className="text-muted-foreground">Submitted Date</Label>
                <p className="font-medium">{selectedRequestData.submittedDate}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge variant={selectedRequestData.status === 'pending' ? 'secondary' : 'default'}>
                  {selectedRequestData.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-muted-foreground">Amendment Details</Label>
              <p className="mt-1 p-3 bg-muted rounded-lg">{selectedRequestData.amendmentDetails}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Environmental Impact Assessment</Label>
              <p className="mt-1 p-3 bg-muted rounded-lg">{selectedRequestData.environmentalImpact}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Mitigation Measures</Label>
              <p className="mt-1 p-3 bg-muted rounded-lg">{selectedRequestData.mitigationMeasures}</p>
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
          applicationType="permit_amendment"
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
          <Edit className="w-5 h-5 mr-2" />
          Permit Amendment Reviews ({amendmentRequests.length})
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Review and assess permit amendment requests
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {amendmentRequests.length === 0 ? (
          <div className="text-center py-12">
            <Edit className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No amendment requests</h3>
            <p className="text-muted-foreground">
              No amendment requests have been submitted yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {amendmentRequests.map((request) => (
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
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">{request.amendmentType}</Badge>
                  <p className="text-sm text-muted-foreground mt-1">Submitted: {request.submittedDate}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
