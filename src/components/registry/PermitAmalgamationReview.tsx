import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { GitMerge, CheckCircle, Info, FileText, Download, Eye, ArrowLeft } from "lucide-react";
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

export function PermitAmalgamationReview() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");

  // Mock data - replace with actual data from Supabase
  const amalgamationRequests = [
    {
      id: "1",
      selectedPermits: [
        { id: "CEPA-PER-2024-0001", title: "Mining Operation - Site A", type: "Mining", expiry: "2026-12-31" },
        { id: "CEPA-PER-2024-0002", title: "Forestry Project - Block B", type: "Forestry", expiry: "2025-06-30" }
      ],
      amalgamationType: "Geographic Consolidation",
      justification: "Both operations are geographically adjacent and share common infrastructure. Consolidating permits will improve operational efficiency and reduce administrative burden.",
      proposedTitle: "Integrated Mining & Forestry Operations - Sites A & B",
      proposedDuration: "3 Years",
      consolidatedScope: "Combined mining and forestry operations covering Sites A and B with shared infrastructure and environmental management systems.",
      applicant: "ABC Resources Ltd",
      status: "pending",
      submittedDate: "2024-11-15",
      complianceChecks: {
        goodStanding: true,
        compatibilityAssessed: true,
        environmentalReview: false,
        stakeholderConsultation: true
      },
      // Documents submitted via public dashboard
      documents: [
        { id: "1", name: "Environmental Impact Assessment.pdf", type: "EIA Report", uploadedAt: "2024-11-15", size: "2.4 MB" },
        { id: "2", name: "Operational Plan.pdf", type: "Operational Plan", uploadedAt: "2024-11-15", size: "1.8 MB" },
        { id: "3", name: "Compatibility Study.pdf", type: "Compatibility Study", uploadedAt: "2024-11-15", size: "3.2 MB" }
      ] as SubmittedDocument[]
    },
    {
      id: "2",
      selectedPermits: [
        { id: "CEPA-PER-2024-0003", title: "Water Extraction - Area C", type: "Water", expiry: "2027-03-15" },
        { id: "CEPA-PER-2024-0004", title: "Waste Processing - Facility D", type: "Waste", expiry: "2025-09-30" }
      ],
      amalgamationType: "Operational Integration",
      justification: "Water extraction supports waste processing operations. Single permit streamlines management.",
      proposedTitle: "Integrated Water & Waste Management Facility",
      proposedDuration: "5 Years",
      consolidatedScope: "Integrated water extraction and waste processing operations with shared monitoring systems.",
      applicant: "XYZ Environmental Services",
      status: "under_review",
      submittedDate: "2024-11-01",
      complianceChecks: {
        goodStanding: true,
        compatibilityAssessed: true,
        environmentalReview: true,
        stakeholderConsultation: false
      },
      documents: [
        { id: "4", name: "Water Impact Assessment.pdf", type: "EIA Report", uploadedAt: "2024-11-01", size: "1.9 MB" },
        { id: "5", name: "Waste Management Plan.pdf", type: "Management Plan", uploadedAt: "2024-11-01", size: "2.1 MB" }
      ] as SubmittedDocument[]
    }
  ];

  const selectedRequestData = amalgamationRequests.find(r => r.id === selectedRequest);

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
          Back to Amalgamation Requests
        </Button>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Review the amalgamation request details below. All permits must be compatible and in good standing.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-primary" />
              Amalgamation Request Details (Read-Only)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Applicant</Label>
                <p className="font-medium">{selectedRequestData.applicant}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Amalgamation Type</Label>
                <p className="font-medium">{selectedRequestData.amalgamationType}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Proposed Duration</Label>
                <p className="font-medium">{selectedRequestData.proposedDuration}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Submitted Date</Label>
                <p className="font-medium">{selectedRequestData.submittedDate}</p>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-muted-foreground">Selected Permits for Amalgamation</Label>
              <div className="mt-2 space-y-2">
                {selectedRequestData.selectedPermits.map((permit) => (
                  <div key={permit.id} className="p-3 bg-muted rounded-lg">
                    <p className="font-medium text-sm">{permit.id} - {permit.title}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{permit.type}</Badge>
                      <span className="text-xs text-muted-foreground">Expires: {permit.expiry}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-muted-foreground">Proposed Consolidated Permit Title</Label>
              <p className="mt-1 p-3 bg-muted rounded-lg font-medium">{selectedRequestData.proposedTitle}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Justification for Amalgamation</Label>
              <p className="mt-1 p-3 bg-muted rounded-lg">{selectedRequestData.justification}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Consolidated Scope of Work</Label>
              <p className="mt-1 p-3 bg-muted rounded-lg">{selectedRequestData.consolidatedScope}</p>
            </div>

            <Separator />

            <div>
              <Label className="text-muted-foreground">Compliance Requirements</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  {selectedRequestData.complianceChecks.goodStanding ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span className="text-sm">All permits in good standing</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedRequestData.complianceChecks.compatibilityAssessed ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span className="text-sm">Compatibility assessment completed</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedRequestData.complianceChecks.environmentalReview ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span className="text-sm">Environmental impact review conducted</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedRequestData.complianceChecks.stakeholderConsultation ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span className="text-sm">Stakeholder consultation completed</span>
                </div>
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
          applicationType="permit_amalgamation"
          applicationNumber={selectedRequestData.proposedTitle}
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
          <GitMerge className="w-5 h-5 mr-2" />
          Permit Amalgamation Reviews ({amalgamationRequests.length})
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Review and assess permit amalgamation applications
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amalgamation Requests List */}
        {amalgamationRequests.length === 0 ? (
          <div className="text-center py-12">
            <GitMerge className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No amalgamation requests</h3>
            <p className="text-muted-foreground">
              No amalgamation requests have been submitted yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {amalgamationRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => setSelectedRequest(request.id)}
                className="p-4 border rounded-lg cursor-pointer transition-all hover:bg-accent/50 hover:border-primary"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-card-foreground">{request.proposedTitle}</p>
                    <p className="text-sm text-muted-foreground">{request.applicant}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Combining {request.selectedPermits.length} permits
                    </p>
                  </div>
                  <Badge variant={request.status === 'pending' ? 'secondary' : 'default'}>
                    {request.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>Submitted: {request.submittedDate}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
