import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, Building, FileText, Download, Eye, ArrowLeft } from "lucide-react";
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

export function PermitTransferReview() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");

  const transferRequests = [
    {
      id: "1",
      permitNumber: "CEPA-PER-2024-0001",
      permitType: "Mining Operation",
      currentHolder: "ABC Mining Ltd",
      transfereeType: "Company",
      transfereeName: "New Mining Corporation PNG",
      transfereeBusinessNumber: "BN12345678",
      transfereeAddress: "Section 45, Allotment 12, Port Moresby, NCD",
      transfereeContact: "John Doe",
      transfereeEmail: "john.doe@newmining.pg",
      transfereePhone: "+675 7234 5678",
      status: "pending",
      submittedDate: "2024-11-10",
      // Documents submitted via public dashboard
      documents: [
        { id: "1", name: "Business Registration Certificate.pdf", type: "Registration Certificate", uploadedAt: "2024-11-10", size: "1.2 MB" },
        { id: "2", name: "Financial Statements 2024.pdf", type: "Financial Statement", uploadedAt: "2024-11-10", size: "3.4 MB" },
        { id: "3", name: "Technical Competency Certificate.pdf", type: "Competency Certificate", uploadedAt: "2024-11-10", size: "0.8 MB" },
        { id: "4", name: "Transfer Agreement.pdf", type: "Agreement", uploadedAt: "2024-11-10", size: "2.1 MB" }
      ] as SubmittedDocument[]
    }
  ];

  const selectedRequestData = transferRequests.find(r => r.id === selectedRequest);

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
          Back to Transfer Requests
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-primary" />
              Transfer Request Details (Read-Only)
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
                <Label className="text-muted-foreground">Current Holder</Label>
                <p className="font-medium">{selectedRequestData.currentHolder}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Submitted Date</Label>
                <p className="font-medium">{selectedRequestData.submittedDate}</p>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">Transferee Details</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Entity Type</Label>
                  <p className="font-medium">{selectedRequestData.transfereeType}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Entity/Individual Name</Label>
                  <p className="font-medium">{selectedRequestData.transfereeName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Business Registration Number</Label>
                  <p className="font-medium">{selectedRequestData.transfereeBusinessNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Contact Person</Label>
                  <p className="font-medium">{selectedRequestData.transfereeContact}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Address</Label>
                  <p className="font-medium">{selectedRequestData.transfereeAddress}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedRequestData.transfereeEmail}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{selectedRequestData.transfereePhone}</p>
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
          applicationType="permit_transfer"
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
          <ArrowRightLeft className="w-5 h-5 mr-2" />
          Permit Transfer Reviews ({transferRequests.length})
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Review and assess permit transfer applications
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {transferRequests.length === 0 ? (
          <div className="text-center py-12">
            <ArrowRightLeft className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No transfer requests</h3>
            <p className="text-muted-foreground">
              No transfer requests have been submitted yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transferRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => setSelectedRequest(request.id)}
                className="p-4 border rounded-lg cursor-pointer transition-all hover:bg-accent/50 hover:border-primary"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-card-foreground">{request.permitNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.currentHolder} → {request.transfereeName}
                    </p>
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
  );
}
