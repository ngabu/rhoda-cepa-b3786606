import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Shield, Upload, CheckCircle, Loader2, Lock, AlertTriangle } from 'lucide-react';

interface PermitComplianceReviewTabProps {
  applicationId: string;
  currentStatus: string;
  onStatusUpdate: () => void;
}

// Technical compliance checks configuration
const technicalComplianceChecks = [
  { key: 'environmental_compliance', label: 'Environmental Impact Assessment', icon: '🌍', description: 'Comprehensive environmental assessment completed' },
  { key: 'technical_compliance', label: 'Technical Specifications', icon: '⚙️', description: 'Technical requirements and specifications verified' },
  { key: 'legal_compliance', label: 'Legal & Regulatory Requirements', icon: '⚖️', description: 'All legal and regulatory requirements met' },
  { key: 'safety_compliance', label: 'Health & Safety Standards', icon: '🦺', description: 'Health and safety protocols adequate' },
  { key: 'waste_management_compliance', label: 'Waste Management Plan', icon: '♻️', description: 'Waste management plan comprehensive and compliant' },
  { key: 'emission_compliance', label: 'Emission Controls', icon: '💨', description: 'Emission control measures adequate' },
  { key: 'water_quality_compliance', label: 'Water Quality Standards', icon: '💧', description: 'Water quality protection measures adequate' },
  { key: 'soil_protection_compliance', label: 'Soil Protection Measures', icon: '🌱', description: 'Soil protection and restoration plans adequate' },
  { key: 'biodiversity_compliance', label: 'Biodiversity Conservation', icon: '🦋', description: 'Biodiversity conservation measures adequate' },
  { key: 'public_consultation_compliance', label: 'Public Consultation', icon: '👥', description: 'Public consultation process completed satisfactorily' },
];

// Common violations list
const commonViolations = [
  'Incomplete Environmental Impact Assessment',
  'Missing Technical Documentation',
  'Inadequate Waste Management Plan',
  'Insufficient Emission Control Measures',
  'Non-compliance with Water Quality Standards',
  'Lack of Public Consultation Evidence',
  'Missing Safety Protocols',
  'Inadequate Biodiversity Protection Measures',
  'Incomplete Financial Guarantees',
  'Non-compliance with Zoning Regulations',
  'Missing Required Permits/Licenses',
  'Inadequate Monitoring Plans',
  'Insufficient Emergency Response Procedures'
];

export function PermitComplianceReviewTab({ applicationId, currentStatus, onStatusUpdate }: PermitComplianceReviewTabProps) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [assessment, setAssessment] = useState('');
  const [proposedAction, setProposedAction] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState('');
  const [status, setStatus] = useState(currentStatus);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; path: string }[]>([]);
  
  // Validation checkboxes
  const [activityLevelJustified, setActivityLevelJustified] = useState(false);
  const [projectSiteVerified, setProjectSiteVerified] = useState(false);
  const [siteInspectionCompleted, setSiteInspectionCompleted] = useState(false);
  const [environmentalImpactAssessed, setEnvironmentalImpactAssessed] = useState(false);

  // Technical compliance checks
  const [technicalChecks, setTechnicalChecks] = useState<Record<string, boolean>>({});
  
  // Violations
  const [violations, setViolations] = useState<string[]>([]);
  const [customViolation, setCustomViolation] = useState('');

  // Check if user can edit this tab (only compliance staff)
  const canEdit = profile?.staff_unit === 'compliance' || 
                  profile?.user_type === 'admin' || 
                  profile?.user_type === 'super_admin';

  useEffect(() => {
    fetchReviewData();
  }, [applicationId]);

  const fetchReviewData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('permit_reviews')
        .select('*')
        .eq('permit_application_id', applicationId)
        .eq('review_stage', 'compliance')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setAssessment(data.assessment || '');
        setProposedAction(data.proposed_action || '');
        setUploadedFiles((data.uploaded_documents as { name: string; path: string }[]) || []);
        setNextReviewDate((data as any).next_review_date || '');
        
        const validations = data.validation_checks as Record<string, boolean> || {};
        setActivityLevelJustified(validations.activityLevelJustified || false);
        setProjectSiteVerified(validations.projectSiteVerified || false);
        setSiteInspectionCompleted(validations.siteInspectionCompleted || false);
        setEnvironmentalImpactAssessed(validations.environmentalImpactAssessed || false);
        
        // Load technical compliance checks
        const techChecks = (data as any).technical_compliance_checks as Record<string, boolean> || {};
        setTechnicalChecks(techChecks);
        
        // Load violations
        const violationsData = (data as any).violations_found as string[] || [];
        setViolations(violationsData);
      }
    } catch (error) {
      console.error('Error fetching review data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTechnicalCheck = (key: string) => {
    if (!canEdit) return;
    setTechnicalChecks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const addViolation = (violation: string) => {
    if (!canEdit) return;
    if (!violations.includes(violation)) {
      setViolations(prev => [...prev, violation]);
    }
  };

  const removeViolation = (violation: string) => {
    if (!canEdit) return;
    setViolations(prev => prev.filter(v => v !== violation));
  };

  const addCustomViolation = () => {
    if (!canEdit || !customViolation.trim()) return;
    if (!violations.includes(customViolation.trim())) {
      setViolations(prev => [...prev, customViolation.trim()]);
      setCustomViolation('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newFiles: { name: string; path: string }[] = [];
      
      for (const file of Array.from(files)) {
        const fileName = `${applicationId}/compliance-review/${Date.now()}-${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        
        newFiles.push({ name: file.name, path: fileName });
      }
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast({ title: 'Success', description: 'Files uploaded successfully' });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({ title: 'Error', description: 'Failed to upload files', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!canEdit) {
      toast({ title: 'Error', description: 'You do not have permission to edit this section', variant: 'destructive' });
      return;
    }

    if (!assessment || !proposedAction) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      // Calculate compliance score based on technical checks
      const totalChecks = technicalComplianceChecks.length;
      const completedChecks = Object.values(technicalChecks).filter(Boolean).length;
      const complianceScore = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;

      // Save review data to permit_reviews table
      const reviewData = {
        permit_application_id: applicationId,
        review_stage: 'compliance',
        reviewer_id: profile?.user_id,
        assessment,
        proposed_action: proposedAction,
        next_review_date: nextReviewDate || null,
        validation_checks: {
          activityLevelJustified,
          projectSiteVerified,
          siteInspectionCompleted,
          environmentalImpactAssessed
        },
        technical_compliance_checks: technicalChecks,
        violations_found: violations,
        compliance_score: complianceScore,
        uploaded_documents: uploadedFiles,
        status: status === 'compliance_approved' ? 'completed' : 'pending',
        reviewed_at: new Date().toISOString()
      };

      const { error: reviewError } = await supabase
        .from('permit_reviews')
        .upsert(reviewData, { 
          onConflict: 'permit_application_id,review_stage'
        });

      if (reviewError) throw reviewError;

      // Update permit application status
      const { error: appError } = await supabase
        .from('permit_applications')
        .update({ status })
        .eq('id', applicationId);

      if (appError) throw appError;

      // Also update compliance_assessments table for backward compatibility
      const { data: existingAssessment } = await supabase
        .from('compliance_assessments')
        .select('id')
        .eq('permit_application_id', applicationId)
        .maybeSingle();

      const assessmentData = {
        assessment_notes: JSON.stringify({
          assessment,
          proposed_action: proposedAction,
          documents: uploadedFiles,
          validation: {
            activityLevelJustified,
            projectSiteVerified,
            siteInspectionCompleted,
            environmentalImpactAssessed
          }
        }),
        assessment_status: status === 'compliance_approved' ? 'completed' : 'pending',
        recommendations: proposedAction,
      };

      if (existingAssessment) {
        await supabase
          .from('compliance_assessments')
          .update(assessmentData)
          .eq('id', existingAssessment.id);
      }

      toast({ title: 'Success', description: 'Compliance review submitted successfully' });
      onStatusUpdate();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({ title: 'Error', description: 'Failed to submit review', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading review data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-orange-500/10">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-orange-600" />
            Compliance Review & Assessment
            {!canEdit && <Lock className="w-4 h-4 text-muted-foreground ml-auto" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          {!canEdit && (
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                This section is read-only. Only Compliance staff can edit this tab.
              </AlertDescription>
            </Alert>
          )}

          {/* Technical Compliance Assessment */}
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold">Technical Compliance Assessment</h3>
              <p className="text-sm text-muted-foreground">
                Conduct systematic review based on permit type, activity level, and registry guidance
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {technicalComplianceChecks.map((check) => (
                <div key={check.key} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={check.key}
                    checked={technicalChecks[check.key] || false}
                    onCheckedChange={() => toggleTechnicalCheck(check.key)}
                    disabled={!canEdit}
                  />
                  <div className="flex-1">
                    <Label htmlFor={check.key} className="text-sm font-medium cursor-pointer flex items-center">
                      <span className="mr-2">{check.icon}</span>
                      {check.label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">{check.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Violations & Non-Compliance Issues */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Violations & Non-Compliance Issues
            </h3>
            <div className="space-y-2">
              <Label>Select Common Violations</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {commonViolations.map((violation) => (
                  <Button
                    key={violation}
                    type="button"
                    variant={violations.includes(violation) ? "default" : "outline"}
                    size="sm"
                    onClick={() => 
                      violations.includes(violation) 
                        ? removeViolation(violation)
                        : addViolation(violation)
                    }
                    disabled={!canEdit}
                    className="justify-start text-left h-auto py-2 px-3"
                  >
                    {violation}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add custom violation..."
                value={customViolation}
                onChange={(e) => setCustomViolation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomViolation())}
                disabled={!canEdit}
                className={!canEdit ? 'bg-muted cursor-not-allowed' : ''}
              />
              <Button type="button" onClick={addCustomViolation} disabled={!canEdit}>Add</Button>
            </div>

            {violations.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Selected Violations:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {violations.map((violation) => (
                    <Badge
                      key={violation}
                      variant="destructive"
                      className={canEdit ? "cursor-pointer" : ""}
                      onClick={() => canEdit && removeViolation(violation)}
                    >
                      {violation} {canEdit && '×'}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Compliance Validation Checklist */}
          <div className="space-y-3 p-4 bg-orange-500/5 rounded-lg border border-orange-200 dark:border-orange-900">
            <Label className="text-sm font-semibold">Compliance Validation Checklist</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="activityLevelJustified"
                  checked={activityLevelJustified}
                  onCheckedChange={(checked) => setActivityLevelJustified(!!checked)}
                  disabled={!canEdit}
                />
                <Label htmlFor="activityLevelJustified" className="text-sm font-normal cursor-pointer">
                  Activity Level and Prescribed Activity justified
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="projectSiteVerified"
                  checked={projectSiteVerified}
                  onCheckedChange={(checked) => setProjectSiteVerified(!!checked)}
                  disabled={!canEdit}
                />
                <Label htmlFor="projectSiteVerified" className="text-sm font-normal cursor-pointer">
                  Project Site Verified
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="siteInspectionCompleted"
                  checked={siteInspectionCompleted}
                  onCheckedChange={(checked) => setSiteInspectionCompleted(!!checked)}
                  disabled={!canEdit}
                />
                <Label htmlFor="siteInspectionCompleted" className="text-sm font-normal cursor-pointer">
                  Site Inspection completed
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="environmentalImpactAssessed"
                  checked={environmentalImpactAssessed}
                  onCheckedChange={(checked) => setEnvironmentalImpactAssessed(!!checked)}
                  disabled={!canEdit}
                />
                <Label htmlFor="environmentalImpactAssessed" className="text-sm font-normal cursor-pointer">
                  Environmental Impact assessed
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="technicalComplianceAssessed"
                  checked={technicalChecks['technical_compliance_assessed'] || false}
                  onCheckedChange={(checked) => setTechnicalChecks(prev => ({ ...prev, technical_compliance_assessed: !!checked }))}
                  disabled={!canEdit}
                />
                <Label htmlFor="technicalComplianceAssessed" className="text-sm font-normal cursor-pointer">
                  Technical Compliance Assessment
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="violationsAssessed"
                  checked={technicalChecks['violations_assessed'] || false}
                  onCheckedChange={(checked) => setTechnicalChecks(prev => ({ ...prev, violations_assessed: !!checked }))}
                  disabled={!canEdit}
                />
                <Label htmlFor="violationsAssessed" className="text-sm font-normal cursor-pointer">
                  Violations & Non-Compliance Issues
                </Label>
              </div>
            </div>
          </div>

          {/* Assessment Remarks */}
          <div className="space-y-2">
            <Label htmlFor="compliance-assessment">Assessment Remarks *</Label>
            <Textarea
              id="compliance-assessment"
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              placeholder="Provide detailed compliance assessment remarks..."
              rows={4}
              disabled={!canEdit}
              className={!canEdit ? 'bg-muted cursor-not-allowed' : ''}
            />
          </div>

          {/* Proposed Action */}
          <div className="space-y-2">
            <Label htmlFor="compliance-proposedAction">Proposed Action *</Label>
            <Textarea
              id="compliance-proposedAction"
              value={proposedAction}
              onChange={(e) => setProposedAction(e.target.value)}
              placeholder="Recommended compliance actions or next steps..."
              rows={3}
              disabled={!canEdit}
              className={!canEdit ? 'bg-muted cursor-not-allowed' : ''}
            />
          </div>

          {/* Full Assessment Report */}
          <div className="space-y-2">
            <Label>Full Assessment Report</Label>
            <div className={`border-2 border-dashed border-border rounded-lg p-4 ${!canEdit ? 'bg-muted' : ''}`}>
              <Input
                type="file"
                multiple
                onChange={handleFileUpload}
                disabled={uploading || !canEdit}
                className={`cursor-pointer ${!canEdit ? 'cursor-not-allowed' : ''}`}
              />
              {uploading && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </div>
              )}
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Upload className="w-4 h-4" />
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Next Review Date */}
          <div className="space-y-2">
            <Label htmlFor="next_review_date">Next Review Date (if applicable)</Label>
            <Input
              id="next_review_date"
              type="date"
              value={nextReviewDate}
              onChange={(e) => setNextReviewDate(e.target.value)}
              disabled={!canEdit}
              className={!canEdit ? 'bg-muted cursor-not-allowed' : ''}
            />
          </div>

          {/* Update Status */}
          <div className="space-y-2">
            <Label htmlFor="compliance-status">Update Status (for next workflow stage)</Label>
            <Select value={status} onValueChange={setStatus} disabled={!canEdit}>
              <SelectTrigger className={!canEdit ? 'bg-muted cursor-not-allowed' : ''}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="compliance_approved">Compliance Approved - Forward to MD</SelectItem>
                <SelectItem value="compliance_issues">Compliance Issues Found</SelectItem>
                <SelectItem value="requires_clarification">Requires Clarification</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {canEdit && (
        <div className="flex gap-4 pt-4">
          <Button onClick={handleSubmitReview} disabled={submitting} className="flex-1 bg-green-600 hover:bg-green-700">
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit Compliance Review
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
