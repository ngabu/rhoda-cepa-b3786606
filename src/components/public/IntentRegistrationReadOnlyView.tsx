import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, User, Calendar, MapPin, DollarSign, Users, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { IntentRegistration } from '@/hooks/useIntentRegistrations';

interface IntentRegistrationReadOnlyViewProps {
  intent: IntentRegistration;
}

export function IntentRegistrationReadOnlyView({ intent }: IntentRegistrationReadOnlyViewProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      under_review: 'outline'
    };
    return (
      <Badge variant={variants[status] || 'outline'} className="capitalize">
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-glass/50 backdrop-blur-sm border-glass">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <CardTitle className="flex items-center gap-2">
                {intent.entity?.entity_type === 'company' ? (
                  <Building className="w-6 h-6" />
                ) : (
                  <User className="w-6 h-6" />
                )}
                {intent.entity?.name}
              </CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{intent.activity_level}</Badge>
                  <span>•</span>
                  <span>Submitted {format(new Date(intent.created_at), 'MMMM dd, yyyy')}</span>
                </div>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(intent.status)}
              <Button variant="outline" size="sm" onClick={handleExportPDF} className="no-print">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Registration Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Entity</Label>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  {intent.entity?.entity_type === 'company' ? (
                    <Building className="w-5 h-5 text-primary" />
                  ) : (
                    <User className="w-5 h-5 text-primary" />
                  )}
                  <div>
                    <p className="font-medium">{intent.entity?.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {intent.entity?.entity_type}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Activity Level</Label>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Badge variant="outline">{intent.activity_level}</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Activity Description</Label>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm">{intent.activity_description}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Preparatory Work Description</Label>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{intent.preparatory_work_description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Commencement Date
              </Label>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">{format(new Date(intent.commencement_date), 'MMMM dd, yyyy')}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Completion Date
              </Label>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">{format(new Date(intent.completion_date), 'MMMM dd, yyyy')}</p>
              </div>
            </div>
          </div>

          {/* Project Site Information */}
          {(intent.project_site_address || intent.project_site_description || intent.site_ownership_details) && (
            <>
              <div className="pt-6 border-t border-glass">
                <h3 className="text-lg font-semibold mb-4">Project Site Information</h3>
              </div>

              {intent.project_site_address && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Project Site Address</Label>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">{intent.project_site_address}</p>
                  </div>
                </div>
              )}

              {intent.project_site_description && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Site Description</Label>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{intent.project_site_description}</p>
                  </div>
                </div>
              )}

              {intent.site_ownership_details && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Site Ownership Details</Label>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{intent.site_ownership_details}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Government & Stakeholder Engagement */}
          {(intent.government_agreement || intent.departments_approached || intent.approvals_required || intent.landowner_negotiation_status) && (
            <>
              <div className="pt-6 border-t border-glass">
                <h3 className="text-lg font-semibold mb-4">Government & Stakeholder Engagement</h3>
              </div>

              {intent.government_agreement && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Agreement with Government of PNG</Label>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{intent.government_agreement}</p>
                  </div>
                </div>
              )}

              {intent.departments_approached && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Departments/Statutory Bodies Approached</Label>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{intent.departments_approached}</p>
                  </div>
                </div>
              )}

              {intent.approvals_required && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Other Formal Government Approvals Required</Label>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{intent.approvals_required}</p>
                  </div>
                </div>
              )}

              {intent.landowner_negotiation_status && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Landowner Negotiation Status</Label>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{intent.landowner_negotiation_status}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Financial Information */}
          {intent.estimated_cost_kina && (
            <>
              <div className="pt-6 border-t border-glass">
                <h3 className="text-lg font-semibold mb-4">Project Financial Information</h3>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Estimated Cost of Works</Label>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-2xl font-bold text-primary">
                    K{intent.estimated_cost_kina.toLocaleString()}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Review Information (if available) */}
          {intent.reviewed_by && (
            <>
              <Separator />
              <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                <h3 className="text-lg font-semibold">Review Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Reviewed By</Label>
                    <p className="text-sm mt-1">
                      {intent.reviewer?.first_name} {intent.reviewer?.last_name}
                    </p>
                    {intent.reviewer?.email && (
                      <p className="text-sm text-muted-foreground">{intent.reviewer.email}</p>
                    )}
                  </div>
                  
                  {intent.reviewed_at && (
                    <div>
                      <Label>Review Date</Label>
                      <p className="text-sm mt-1">
                        {format(new Date(intent.reviewed_at), 'MMMM dd, yyyy h:mm a')}
                      </p>
                    </div>
                  )}
                </div>

                {intent.review_notes && (
                  <div>
                    <Label>Official Review Notes</Label>
                    <p className="text-sm mt-2 text-muted-foreground whitespace-pre-wrap">
                      {intent.review_notes}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-sm font-medium ${className || ''}`}>{children}</label>;
}
