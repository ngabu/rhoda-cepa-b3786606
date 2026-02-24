import React, { useState, useEffect } from 'react';
import { FileText, MapPin, Upload, Save, Send, Building, User, AlertCircle, CheckCircle, Activity, Users, Settings, DollarSign, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import ProjectAndSpecificDetailsTab from '@/components/permit-application-form/ProjectAndSpecificDetailsTab';
import LocationTab from '@/components/permit-application-form/LocationTab';
import DocumentsTab from '@/components/permit-application-form/DocumentsTab';

import { ActivityClassificationStep } from '@/components/public/steps/ActivityClassificationStep';
import { ApplicationFeeStep } from '@/components/public/steps/ApplicationFeeStep';
import { PublicConsultationStep } from '@/components/public/steps/PublicConsultationStep';
import { useIntentRegistrations } from '@/hooks/useIntentRegistrations';
import { usePrescribedActivities } from '@/hooks/usePrescribedActivities';

import { ReviewSubmitStep } from '@/components/public/steps/ReviewSubmitStep';
import { savePermitDetailsFromFlat } from '@/services/permitDetails';

const generateApplicationNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomSuffix = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `CEPA-APP-${year}${month}${day}-${randomSuffix}`;
};

interface ComprehensivePermitFormProps {
  permitId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  isStandalone?: boolean;
  draftId?: string; // Add this to load existing drafts
}

export function ComprehensivePermitForm({ permitId, onSuccess, onCancel, isStandalone = false, draftId }: ComprehensivePermitFormProps) {
  const { toast } = useToast();
  const [applicationNumber, setApplicationNumber] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUser();
  }, []);

  // Fetch approved intent registrations
  const { intents, loading: intentsLoading } = useIntentRegistrations(userId || undefined);
  const approvedIntents = intents.filter(intent => intent.status === 'approved');
  
  // Fetch prescribed activities for classification lookup
  const { data: prescribedActivities } = usePrescribedActivities();

  useEffect(() => {
    if (!permitId) {
      setApplicationNumber(generateApplicationNumber());
    }
  }, [permitId]);
  
  const initialFormData = {
    applicationNumber: applicationNumber,
    applicationTitle: '',
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    organizationName: '',
    projectDescription: '',
    projectLocation: '',
    coordinates: { lat: -6.314993, lng: 143.95555 }, // Default to Papua New Guinea center
    // Land Information fields
    land_type: '',
    owner_name: '',
    legal_description: '',
    tenure: '',
    prescribedActivity: '',
    feeCategory: 'Green Category',
    projectStartDate: '',
    projectEndDate: '',
    environmentalImpact: '',
    mitigationMeasures: '',
    uploadedFiles: [],
    document_uploads: {}, // Categorized documents (EIA, EIS, etc.)
    calculatedFees: null,
    // PNG Environment Act 2000 fields - Activity Classification
    activity_level: '',
    prescribed_activity_id: '', // Add this field for document requirements
    activity_category: '', // Add activity category field
    activity_subcategory: '', // Add activity subcategory field
    activity_description: '', // Add activity description field
    entity_type: '', // Add this field for document requirements
    entity_id: '', // Add entity_id field
    entity_name: '', // Add entity_name field
    existing_permit_id: null, // Add existing permit reference
    intent_registration_id: null, // Link to approved intent registration
    permit_category: '',
    permit_type_id: '',
    permit_type: '',
    permit_type_specific_data: {},
    industrial_sector_id: '', // Industrial sector field
    district: '', // District field
    province: '', // Province field
    llg: '', // LLG field
    // Project Site Info fields (from intent registration)
    project_site_description: '',
    site_ownership_details: '',
    government_agreement: '',
    departments_approached: '',
    approvals_required: '',
    landowner_negotiation_status: '',
    total_area_sqkm: '',
    project_boundary: null, // GIS boundary from intent registration
    selected_intent_activity_description: '', // Activity description from selected intent
    // PNG Environment Act 2000 fields - Public Consultation
    public_consultation_proof: [],
    consultation_period_start: '',
    consultation_period_end: '',
    // PNG Environment Act 2000 fields - Fees
    application_fee: 0, // Base application fee
    composite_fee: 0, // Composite fee for Environmental Permits
    fee_amount: 0, // Total fee payable
    fee_breakdown: null,
    fee_source: 'official' as 'official' | 'estimated', // Fee calculation source
    processing_days: 0, // Processing days for fee calculation
    // PNG Environment Act 2000 fields - Requirements & Legal
    eia_required: false,
    eis_required: false,
    legal_declaration_accepted: false,
    legal_declaration_accepted_at: null,
    compliance_commitment: false,
    compliance_commitment_accepted_at: null,
    payment_status: 'pending',
    mandatory_fields_complete: false,
    complianceChecks: {
      environmentalAssessment: false,
      publicConsultation: false,
      technicalReview: false,
      legalCompliance: false
    }
  };

  const [formData, setFormData] = useState(initialFormData);
  const [lastSavedDraftId, setLastSavedDraftId] = useState<string | null>(draftId || null);
  
  // Load existing draft data
  useEffect(() => {
    const loadDraftData = async () => {
      if (draftId || permitId) {
        try {
          // Use the view to get all fields including those from child tables
          const { data, error } = await (supabase as any)
            .from('vw_permit_applications_full')
            .select('*')
            .eq('id', draftId || permitId)
            .single();
          
          if (error) throw error;
          
          if (data) {
            console.log('📥 Loading existing draft:', data);
            setFormData({
              applicationNumber: data.application_number || '',
              applicationTitle: data.title || '',
              applicantName: '', // Not stored in DB
              applicantEmail: '', // Not stored in DB currently
              applicantPhone: '', // Not stored in DB currently
              organizationName: data.entity_name || '',
              projectDescription: data.project_description || data.description || '',
              projectLocation: data.activity_location || '',
              coordinates: (typeof data.coordinates === 'object' && data.coordinates && 'lat' in data.coordinates) 
                ? data.coordinates as { lat: number; lng: number }
                : { lat: -6.314993, lng: 143.95555 },
              // Land Information fields - not available in current schema
              land_type: '',
              owner_name: '',
              legal_description: '',
              tenure: '',
              prescribedActivity: data.permit_type || '',
              feeCategory: 'Green Category',
              projectStartDate: data.project_start_date || data.commencement_date || '',
              projectEndDate: data.project_end_date || data.completion_date || '',
              environmentalImpact: data.environmental_impact || '',
              mitigationMeasures: data.mitigation_measures || '',
              uploadedFiles: Array.isArray(data.uploaded_files) ? data.uploaded_files : [],
              document_uploads: (typeof data.document_uploads === 'object' && data.document_uploads) ? data.document_uploads : {},
              calculatedFees: data.fee_breakdown,
              activity_level: data.activity_level || '',
              prescribed_activity_id: data.activity_id || '', // Map activity_id to prescribed_activity_id
              activity_category: data.activity_category || '', // Add activity_category mapping
              activity_subcategory: data.activity_subcategory || '', // Add activity_subcategory mapping
              activity_description: data.activity_classification || '', // Map activity_classification to activity_description
              entity_type: data.entity_type || '', // Add entity_type mapping
              entity_id: data.entity_id || '', // Add entity_id mapping
              entity_name: data.entity_name || '', // Add entity_name mapping
              existing_permit_id: data.existing_permit_id || null, // Add existing permit mapping
              intent_registration_id: data.intent_registration_id || null, // Load from saved data
              permit_category: data.permit_category || '',
              permit_type_id: data.permit_type_id || '',
              permit_type: data.permit_type || '',
              permit_type_specific_data: data.permit_type_specific_data || {},
              industrial_sector_id: data.industrial_sector_id || '', // Add industrial sector mapping
              district: data.district || '', // Add district mapping
              province: data.province || '', // Add province mapping
              llg: data.llg || '', // LLG field
              // Project Site Info fields - load from database
              project_site_description: data.project_site_description || '',
              site_ownership_details: data.site_ownership_details || '',
              government_agreement: data.government_agreements_details || '',
              departments_approached: data.consulted_departments || '',
              approvals_required: data.required_approvals || '',
              landowner_negotiation_status: data.landowner_negotiation_status || '',
              total_area_sqkm: data.total_area_sqkm?.toString() || '',
              project_boundary: data.project_boundary || null,
              selected_intent_activity_description: data.activity_classification || '',
              public_consultation_proof: Array.isArray(data.public_consultation_proof) ? data.public_consultation_proof : [],
              consultation_period_start: data.consultation_period_start || '',
              consultation_period_end: data.consultation_period_end || '',
              application_fee: data.application_fee || (typeof data.fee_breakdown === 'object' && data.fee_breakdown ? (data.fee_breakdown as any).administrationFee : 0) || 0,
              composite_fee: data.composite_fee || (typeof data.fee_breakdown === 'object' && data.fee_breakdown ? (data.fee_breakdown as any).compositeFee : 0) || 0,
              fee_amount: data.fee_amount || (typeof data.fee_breakdown === 'object' && data.fee_breakdown ? (data.fee_breakdown as any).totalFee : 0) || 0,
              fee_breakdown: data.fee_breakdown,
              fee_source: data.fee_source || (typeof data.fee_breakdown === 'object' && data.fee_breakdown ? (data.fee_breakdown as any).source : 'official') || 'official',
              processing_days: data.processing_days || (typeof data.fee_breakdown === 'object' && data.fee_breakdown ? (data.fee_breakdown as any).processingDays : 0) || 0,
              eia_required: data.eia_required || false,
              eis_required: data.eis_required || false,
              legal_declaration_accepted: data.legal_declaration_accepted || false,
              legal_declaration_accepted_at: data.legal_declaration_accepted_at || null,
              compliance_commitment: data.compliance_commitment || false,
              compliance_commitment_accepted_at: data.compliance_commitment_accepted_at || null,
              payment_status: data.payment_status || 'pending',
              mandatory_fields_complete: data.mandatory_fields_complete || false,
              complianceChecks: (typeof data.compliance_checks === 'object' && data.compliance_checks && 
                'environmentalAssessment' in data.compliance_checks) 
                ? data.compliance_checks as { environmentalAssessment: boolean; publicConsultation: boolean; technicalReview: boolean; legalCompliance: boolean; }
                : {
                    environmentalAssessment: false,
                    publicConsultation: false,
                    technicalReview: false,
                    legalCompliance: false
                  }
            });
            setLastSavedDraftId(data.id);
          }
        } catch (error) {
          console.error('Error loading draft:', error);
          toast({
            title: "Error Loading Draft",
            description: "Could not load your saved draft. Starting with a new form.",
            variant: "destructive",
          });
        }
      }
    };
    
    loadDraftData();
  }, [draftId, permitId]);
  
  useEffect(() => {
    if (applicationNumber && !draftId && !permitId) {
      setFormData(prev => ({ ...prev, applicationNumber }));
    }
  }, [applicationNumber, draftId, permitId]);

  // Auto-fill Project Site Info, Project Description, and Classification when an intent is selected
  useEffect(() => {
    if (formData.intent_registration_id) {
      const selectedIntent = approvedIntents.find(intent => intent.id === formData.intent_registration_id);
      if (selectedIntent) {
        // Look up prescribed activity details if available
        const selectedActivity = selectedIntent.prescribed_activity_id && prescribedActivities
          ? prescribedActivities.find(a => a.id === selectedIntent.prescribed_activity_id)
          : null;
        
        setFormData(prev => ({
          ...prev,
          // Application Title from intent's project_title
          applicationTitle: (selectedIntent as any).project_title || prev.applicationTitle,
          // Project Description from intent
          projectDescription: selectedIntent.activity_description || prev.projectDescription,
          // Classification fields from intent
          activity_level: selectedIntent.activity_level || prev.activity_level,
          prescribed_activity_id: selectedIntent.prescribed_activity_id || prev.prescribed_activity_id,
          // Activity details from prescribed activity lookup
          activity_category: selectedActivity?.category_type || prev.activity_category,
          activity_subcategory: selectedActivity?.sub_category || prev.activity_subcategory,
          activity_description: selectedActivity?.activity_description || prev.activity_description,
          // Project Site Info fields from intent registration
          projectLocation: selectedIntent.project_site_address || prev.projectLocation,
          project_site_description: selectedIntent.project_site_description || prev.project_site_description,
          site_ownership_details: selectedIntent.site_ownership_details || prev.site_ownership_details,
          government_agreement: selectedIntent.government_agreement || prev.government_agreement,
          departments_approached: selectedIntent.departments_approached || prev.departments_approached,
          approvals_required: selectedIntent.approvals_required || prev.approvals_required,
          landowner_negotiation_status: selectedIntent.landowner_negotiation_status || prev.landowner_negotiation_status,
          district: selectedIntent.district || prev.district,
          province: selectedIntent.province || prev.province,
          llg: selectedIntent.llg || prev.llg,
          total_area_sqkm: selectedIntent.total_area_sqkm?.toString() || prev.total_area_sqkm,
          // Also copy entity info
          entity_id: selectedIntent.entity_id || prev.entity_id,
          entity_name: selectedIntent.entity?.name || prev.entity_name,
          // Project boundary for map display
          project_boundary: (selectedIntent as any).project_boundary || prev.project_boundary,
          // Activity description for popup
          selected_intent_activity_description: selectedIntent.activity_description || prev.selected_intent_activity_description,
        }));
      }
    }
  }, [formData.intent_registration_id, approvedIntents, prescribedActivities]);

  const [activeTab, setActiveTab] = useState('project');

  const handleInputChange = async (field: string | Record<string, any>, value?: any) => {
    console.log('🔄 ComprehensivePermitForm - handleInputChange:', { field, value, currentFormData: formData });
    
    setFormData(prev => {
      // Handle object with multiple fields (from steps that update multiple fields at once)
      if (typeof field === 'object' && field !== null) {
        console.log('📦 Multiple fields update:', field);
        const updatedData = {
          ...prev,
          ...field
        };
        
        // Auto-save draft when editing existing permit/draft
        if (lastSavedDraftId || permitId) {
          saveDraftChanges(updatedData);
        }
        
        return updatedData;
      }
      
      // Handle single field update
      const fieldName = field as string;
      
      const newFormData = {
        ...prev,
        [fieldName]: value
      };
      
      console.log('🔄 ComprehensivePermitForm - Updated formData:', newFormData);
      
      // Auto-save draft when editing existing permit/draft
      if (lastSavedDraftId || permitId) {
        saveDraftChanges(newFormData);
      }
      
      return newFormData;
    });
  };

  // Helper function to extract Water Extraction and Waste Discharge details from permit_type_specific_data
  const extractEnvironmentalPermitDetails = (permitTypeSpecificData: Record<string, any> | undefined | null) => {
    if (!permitTypeSpecificData) return { waterExtractionDetails: null, wasteDischargeDetails: null };

    const waterExtractionDetails: Record<string, any> = {};
    const wasteDischargeDetails: Record<string, any> = {};

    Object.entries(permitTypeSpecificData).forEach(([key, value]) => {
      // Water Extraction fields start with 'we_'
      if (key.startsWith('we_')) {
        waterExtractionDetails[key] = value;
      }
      // Waste Discharge fields start with 'wd_'
      if (key.startsWith('wd_')) {
        wasteDischargeDetails[key] = value;
      }
    });

    return {
      waterExtractionDetails: Object.keys(waterExtractionDetails).length > 0 ? waterExtractionDetails : null,
      wasteDischargeDetails: Object.keys(wasteDischargeDetails).length > 0 ? wasteDischargeDetails : null
    };
  };

  // Auto-save function for draft changes
  const saveDraftChanges = async (updatedFormData: typeof formData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updateId = permitId || lastSavedDraftId;
      if (!updateId) return;

      // Extract Water Extraction and Waste Discharge details
      const { waterExtractionDetails, wasteDischargeDetails } = extractEnvironmentalPermitDetails(updatedFormData.permit_type_specific_data);

      // Only include columns that exist in permit_applications table
      const applicationData = {
        title: updatedFormData.applicationTitle,
        permit_type: updatedFormData.permit_type || '',
        description: updatedFormData.projectDescription,
        status: 'draft',
        user_id: user.id,
        entity_id: updatedFormData.entity_id || null,
        existing_permit_id: updatedFormData.existing_permit_id || null,
        activity_location: updatedFormData.projectLocation,
        uploaded_files: updatedFormData.uploadedFiles,
        document_uploads: updatedFormData.document_uploads || {},
        is_draft: true,
        current_step: 10,
        application_number: updatedFormData.applicationNumber,
        activity_id: updatedFormData.prescribed_activity_id || null,
        permit_type_id: updatedFormData.permit_type_id || null,
        mandatory_fields_complete: updatedFormData.mandatory_fields_complete,
        industrial_sector_id: updatedFormData.industrial_sector_id || null,
        intent_registration_id: updatedFormData.intent_registration_id || null,
        owner_name: updatedFormData.owner_name || null,
      };

      await supabase
        .from('permit_applications')
        .update(applicationData)
        .eq('id', updateId);

      // Save details to child tables
      await savePermitDetailsFromFlat(updateId, {
        // Water & Waste
        water_extraction_details: waterExtractionDetails,
        waste_contaminant_details: wasteDischargeDetails,
        // Location
        province: updatedFormData.province,
        district: updatedFormData.district,
        llg: updatedFormData.llg,
        project_boundary: updatedFormData.project_boundary,
        coordinates: updatedFormData.coordinates,
        total_area_sqkm: updatedFormData.total_area_sqkm ? parseFloat(updatedFormData.total_area_sqkm) : undefined,
        project_site_description: updatedFormData.project_site_description,
        site_ownership_details: updatedFormData.site_ownership_details,
        land_type: updatedFormData.land_type,
        tenure: updatedFormData.tenure,
        legal_description: updatedFormData.legal_description,
        // Consultation
        consultation_period_start: updatedFormData.consultation_period_start,
        consultation_period_end: updatedFormData.consultation_period_end,
        consulted_departments: updatedFormData.departments_approached,
        public_consultation_proof: updatedFormData.public_consultation_proof,
        landowner_negotiation_status: updatedFormData.landowner_negotiation_status,
        government_agreements_details: updatedFormData.government_agreement,
        required_approvals: updatedFormData.approvals_required,
        // Fee
        application_fee: updatedFormData.calculatedFees?.administrationFee || updatedFormData.application_fee,
        fee_amount: updatedFormData.calculatedFees?.totalFee || updatedFormData.fee_amount,
        fee_breakdown: updatedFormData.calculatedFees || updatedFormData.fee_breakdown,
        fee_source: updatedFormData.calculatedFees?.source || updatedFormData.fee_source,
        composite_fee: updatedFormData.calculatedFees?.compositeFee || updatedFormData.composite_fee,
        processing_days: updatedFormData.calculatedFees?.processingDays || updatedFormData.processing_days,
        payment_status: updatedFormData.payment_status,
        // Project
        project_description: updatedFormData.projectDescription,
        project_start_date: updatedFormData.projectStartDate,
        project_end_date: updatedFormData.projectEndDate,
        commencement_date: updatedFormData.projectStartDate,
        completion_date: updatedFormData.projectEndDate,
        environmental_impact: updatedFormData.environmentalImpact,
        mitigation_measures: updatedFormData.mitigationMeasures,
        // Classification
        permit_category: updatedFormData.permit_category,
        activity_classification: updatedFormData.activity_description,
        activity_category: updatedFormData.activity_category,
        activity_subcategory: updatedFormData.activity_subcategory,
        activity_level: updatedFormData.activity_level,
        eia_required: updatedFormData.eia_required,
        eis_required: updatedFormData.eis_required,
        permit_type_specific_data: updatedFormData.permit_type_specific_data,
        // Compliance
        compliance_checks: updatedFormData.complianceChecks,
        compliance_commitment: updatedFormData.compliance_commitment,
        compliance_commitment_accepted_at: updatedFormData.compliance_commitment_accepted_at,
        legal_declaration_accepted: updatedFormData.legal_declaration_accepted,
        legal_declaration_accepted_at: updatedFormData.legal_declaration_accepted_at,
      });

      console.log('💾 Auto-saved draft changes');
    } catch (error) {
      console.error('Error auto-saving draft:', error);
    }
  };

  const handleComplianceChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      complianceChecks: {
        ...prev.complianceChecks,
        [field]: checked
      }
    }));
  };

  const handleSubmit = async (isDraft = false) => {
    try {
      console.log('🚀 handleSubmit called with isDraft:', isDraft);
      console.log('🚀 Current formData:', formData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('❌ No authenticated user found');
        toast({
          title: "Authentication Required",
          description: "Please log in to submit an application.",
          variant: "destructive",
        });
        return;
      }
      
      console.log('✅ User authenticated:', user.id);

      // Generate application number only when submitting (not draft)
      const generatedAppNumber = isDraft ? formData.applicationNumber : `PAN-${Date.now()}`;
      
      console.log('🔍 Form data before submission:', {
        consultation_period_start: formData.consultation_period_start,
        consultation_period_end: formData.consultation_period_end,
        projectStartDate: formData.projectStartDate,
        projectEndDate: formData.projectEndDate
      });
      
      // Extract Water Extraction and Waste Discharge details for dedicated columns
      const { waterExtractionDetails, wasteDischargeDetails } = extractEnvironmentalPermitDetails(formData.permit_type_specific_data);

      // For final submission, upload any base64 stored documents to storage
      let finalDocumentUploads = { ...(formData.document_uploads || {}) };
      let finalUploadedFiles = [...(formData.uploadedFiles || [])];
      let finalConsultationProof = [...(formData.public_consultation_proof || [])];
      
      if (!isDraft) {
        // Upload document_uploads that have base64 fileData to storage
        for (const [docType, docData] of Object.entries(finalDocumentUploads)) {
          const doc = docData as any;
          if (doc?.fileData && !doc.fromWarehouse) {
            try {
              // Convert base64 back to blob
              const base64Response = await fetch(doc.fileData);
              const blob = await base64Response.blob();
              
              // Upload to storage
              const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${doc.name.split('.').pop()}`;
              const filePath = `${user.id}/permit-documents/${fileName}`;
              
              const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, blob, {
                  cacheControl: '3600',
                  upsert: false,
                  contentType: doc.type
                });
              
              if (uploadError) {
                console.error('Failed to upload document:', uploadError);
                continue;
              }
              
              // Update the document reference with the file path (remove base64 data)
              finalDocumentUploads[docType] = {
                id: doc.id,
                name: doc.name,
                size: doc.size,
                type: doc.type,
                fromDatabase: true,
                file_path: filePath,
              };
              
              console.log(`📤 Uploaded document ${docType} to storage: ${filePath}`);
            } catch (uploadErr) {
              console.error(`Failed to upload document ${docType}:`, uploadErr);
            }
          }
        }

        // Upload uploaded_files that have base64 fileData to storage
        finalUploadedFiles = await Promise.all(
          finalUploadedFiles.map(async (file: any) => {
            if (file?.fileData && !file.fromWarehouse && !file.fromDatabase) {
              try {
                const base64Response = await fetch(file.fileData);
                const blob = await base64Response.blob();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;
                const filePath = `${user.id}/permit-documents/${fileName}`;
                
                const { error: uploadError } = await supabase.storage
                  .from('documents')
                  .upload(filePath, blob, { cacheControl: '3600', upsert: false, contentType: file.type });
                
                if (uploadError) {
                  console.error('Failed to upload file:', uploadError);
                  return file;
                }
                
                console.log(`📤 Uploaded file to storage: ${filePath}`);
                return { id: file.id, name: file.name, size: file.size, type: file.type, fromDatabase: true, file_path: filePath };
              } catch (err) {
                console.error('Failed to upload file:', err);
                return file;
              }
            }
            return file;
          })
        );

        // Upload public_consultation_proof that have base64 fileData to storage
        finalConsultationProof = await Promise.all(
          finalConsultationProof.map(async (file: any) => {
            if (file?.fileData && !file.fromWarehouse && !file.fromDatabase) {
              try {
                const base64Response = await fetch(file.fileData);
                const blob = await base64Response.blob();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;
                const filePath = `${user.id}/consultation-documents/${fileName}`;
                
                const { error: uploadError } = await supabase.storage
                  .from('documents')
                  .upload(filePath, blob, { cacheControl: '3600', upsert: false, contentType: file.type });
                
                if (uploadError) {
                  console.error('Failed to upload consultation proof:', uploadError);
                  return file;
                }
                
                console.log(`📤 Uploaded consultation proof to storage: ${filePath}`);
                return { id: file.id, name: file.name, size: file.size, type: file.type, fromDatabase: true, file_path: filePath };
              } catch (err) {
                console.error('Failed to upload consultation proof:', err);
                return file;
              }
            }
            return file;
          })
        );
      }

      // For drafts, store documents as metadata only (not uploaded to final storage)
      // For submission, use finalDocumentUploads which has been uploaded to storage
      const applicationData = {
        title: formData.applicationTitle,
        permit_type: formData.permit_type || '',
        description: formData.projectDescription,
        status: isDraft ? 'draft' : 'pending',
        user_id: user.id,
        entity_id: formData.entity_id || null,
        existing_permit_id: formData.existing_permit_id || null,
        activity_location: formData.projectLocation,
        uploaded_files: isDraft ? formData.uploadedFiles : finalUploadedFiles,
        document_uploads: isDraft ? formData.document_uploads || {} : finalDocumentUploads,
        is_draft: isDraft,
        current_step: 10,
        application_number: generatedAppNumber,
        application_date: isDraft ? null : new Date().toISOString(),
        activity_id: formData.prescribed_activity_id || null,
        permit_type_id: formData.permit_type_id || null,
        mandatory_fields_complete: formData.mandatory_fields_complete,
        industrial_sector_id: formData.industrial_sector_id || null,
        intent_registration_id: formData.intent_registration_id || null,
        owner_name: formData.owner_name || null,
      };

      let result;
      const draftIdToDelete = lastSavedDraftId;
      
      if (!isDraft && draftIdToDelete) {
        // SUBMISSION: Create new record and delete draft afterward
        result = await supabase
          .from('permit_applications')
          .insert(applicationData)
          .select()
          .single();
      } else if (permitId || (isDraft && lastSavedDraftId)) {
        // Update existing application (draft save or editing existing permit)
        const updateId = permitId || lastSavedDraftId;
        result = await supabase
          .from('permit_applications')
          .update(applicationData)
          .eq('id', updateId)
          .select()
          .single();
      } else {
        // Create new application (new draft or direct submit without prior draft)
        result = await supabase
          .from('permit_applications')
          .insert(applicationData)
          .select()
          .single();
      }

      const { data: permitApp, error: permitError } = result;
      if (permitError) throw permitError;

      // Save permit-specific details to normalized child tables
      if (permitApp?.id) {
        try {
          await savePermitDetailsFromFlat(permitApp.id, {
            // Water & Waste
            water_extraction_details: waterExtractionDetails,
            waste_contaminant_details: wasteDischargeDetails,
            // Location
            province: formData.province,
            district: formData.district,
            llg: formData.llg,
            project_boundary: formData.project_boundary,
            coordinates: formData.coordinates,
            total_area_sqkm: formData.total_area_sqkm ? parseFloat(formData.total_area_sqkm) : undefined,
            project_site_description: formData.project_site_description,
            site_ownership_details: formData.site_ownership_details,
            land_type: formData.land_type,
            tenure: formData.tenure,
            legal_description: formData.legal_description,
            // Consultation
            consultation_period_start: formData.consultation_period_start,
            consultation_period_end: formData.consultation_period_end,
            consulted_departments: formData.departments_approached,
            public_consultation_proof: isDraft ? formData.public_consultation_proof : finalConsultationProof,
            landowner_negotiation_status: formData.landowner_negotiation_status,
            government_agreements_details: formData.government_agreement,
            required_approvals: formData.approvals_required,
            // Fee
            application_fee: formData.calculatedFees?.administrationFee || formData.application_fee,
            fee_amount: formData.calculatedFees?.totalFee || formData.fee_amount,
            fee_breakdown: formData.calculatedFees || formData.fee_breakdown,
            fee_source: formData.calculatedFees?.source || formData.fee_source,
            composite_fee: formData.calculatedFees?.compositeFee || formData.composite_fee,
            processing_days: formData.calculatedFees?.processingDays || formData.processing_days,
            payment_status: formData.payment_status,
            // Project
            project_description: formData.projectDescription,
            project_start_date: formData.projectStartDate,
            project_end_date: formData.projectEndDate,
            commencement_date: formData.projectStartDate,
            completion_date: formData.projectEndDate,
            environmental_impact: formData.environmentalImpact,
            mitigation_measures: formData.mitigationMeasures,
            // Classification
            permit_category: formData.permit_category,
            activity_classification: formData.activity_description,
            activity_category: formData.activity_category,
            activity_subcategory: formData.activity_subcategory,
            activity_level: formData.activity_level,
            eia_required: formData.eia_required,
            eis_required: formData.eis_required,
            permit_type_specific_data: formData.permit_type_specific_data,
            // Compliance
            compliance_checks: formData.complianceChecks,
            compliance_commitment: formData.compliance_commitment,
            compliance_commitment_accepted_at: formData.compliance_commitment_accepted_at,
            legal_declaration_accepted: formData.legal_declaration_accepted,
            legal_declaration_accepted_at: formData.legal_declaration_accepted_at,
          });
          console.log('💾 Saved permit details to child tables');
        } catch (childError) {
          console.error('Error saving to child tables:', childError);
          // Non-fatal - the main application was saved
        }
      }

      // If this was a submission from a draft, delete the draft record
      if (!isDraft && draftIdToDelete && permitApp?.id !== draftIdToDelete) {
        try {
          // Delete any documents linked to the old draft
          await supabase
            .from('documents')
            .delete()
            .eq('permit_id', draftIdToDelete);
          
          // Delete child table records for the draft
          await supabase.from('permit_location_details').delete().eq('permit_application_id', draftIdToDelete);
          await supabase.from('permit_consultation_details').delete().eq('permit_application_id', draftIdToDelete);
          await supabase.from('permit_fee_details').delete().eq('permit_application_id', draftIdToDelete);
          await supabase.from('permit_project_details').delete().eq('permit_application_id', draftIdToDelete);
          await supabase.from('permit_classification_details').delete().eq('permit_application_id', draftIdToDelete);
          await supabase.from('permit_compliance_details').delete().eq('permit_application_id', draftIdToDelete);
          
          // Delete the draft permit application
          const { error: deleteError } = await supabase
            .from('permit_applications')
            .delete()
            .eq('id', draftIdToDelete);
          
          if (deleteError) {
            console.warn('Failed to delete draft after submission:', deleteError);
          } else {
            console.log('🗑️ Draft deleted after successful submission:', draftIdToDelete);
          }
        } catch (deleteErr) {
          console.warn('Error cleaning up draft:', deleteErr);
          // Non-fatal - the submission was successful
        }
      }

      toast({
        title: isDraft ? "Draft Saved!" : "Application Submitted!",
        description: isDraft 
          ? `Application has been saved as a draft.` 
          : `Application ${generatedAppNumber} has been submitted successfully.`,
      });
      
      // For drafts, update the saved draft ID so subsequent saves update the same record
      if (isDraft && permitApp?.id) {
        setLastSavedDraftId(permitApp.id);
        console.log('💾 Draft saved with ID:', permitApp.id);
      }
      
      // Only reset form for new applications (not drafts) in standalone mode
      if (isStandalone && !isDraft) {
        const newAppNum = generateApplicationNumber();
        setApplicationNumber(newAppNum);
        setFormData({...initialFormData, applicationNumber: newAppNum});
        setLastSavedDraftId(null);
      } else if (onSuccess) {
        onSuccess();
      }

      // Force page refresh for successful submissions to update dashboard data
      if (!isDraft) {
        setTimeout(() => {
          window.location.reload();
        }, 1500); // Give time for toast to show
      }

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Helper to convert file to base64
    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    };
    
    // For all cases, store file as base64 metadata (will be uploaded to storage on final submit)
    // This keeps drafts temporary and lightweight
    try {
      const uploadedFileData = await Promise.all(
        files.map(async (file) => ({
          id: `file_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          fromDatabase: false,
          fileData: await fileToBase64(file), // Store base64 for later upload
        }))
      );
      
      handleInputChange('uploadedFiles', [...(formData.uploadedFiles || []), ...uploadedFileData]);
      
      toast({
        title: "Files Added",
        description: `${files.length} file(s) added. They will be uploaded when you submit the application.`
      });
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        title: "Error",
        description: "Failed to process files. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeFile = async (fileId: string) => {
    const fileToRemove = (formData.uploadedFiles || []).find((file: any) => file.id === fileId);
    
    if (fileToRemove && fileToRemove.fromDatabase && fileToRemove.file_path) {
      // If file is from database/storage, also delete from storage and database
      try {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([fileToRemove.file_path]);

        if (storageError) {
          console.warn('Failed to delete from storage:', storageError);
        }

        // Try to delete from documents table if it exists there
        await supabase
          .from('documents')
          .delete()
          .eq('file_path', fileToRemove.file_path);
        
        toast({
          title: "File Deleted",
          description: "File removed successfully."
        });
      } catch (error) {
        console.error('Error deleting file:', error);
        toast({
          title: "Delete Error",
          description: "Failed to delete file from storage.",
          variant: "destructive"
        });
      }
    }
    
    // Always remove from form data
    const updatedFiles = (formData.uploadedFiles || []).filter((file: any) => file.id !== fileId);
    handleInputChange('uploadedFiles', updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Check if intent is selected to make related fields read-only
  const hasLinkedIntent = !!formData.intent_registration_id;

  const tabComponents = {
    classification: (
      <ActivityClassificationStep 
        data={formData} 
        onChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
        hasLinkedIntent={hasLinkedIntent}
      />
    ),
    project: <ProjectAndSpecificDetailsTab formData={formData} handleInputChange={handleInputChange} hasLinkedIntent={hasLinkedIntent} />,
    location: <LocationTab formData={formData} handleInputChange={handleInputChange} hasLinkedIntent={hasLinkedIntent} />,
    consultation: <PublicConsultationStep data={formData} onChange={(updates) => handleInputChange(updates)} hasLinkedIntent={hasLinkedIntent} />,
    documents: <DocumentsTab formData={formData} handleInputChange={handleInputChange} handleFileUpload={handleFileUpload} removeFile={removeFile} formatFileSize={formatFileSize} permitId={permitId || lastSavedDraftId} activityLevel={formData.activity_level} />,
    fees: (
      <ApplicationFeeStep 
        data={formData} 
        onChange={(updates) => handleInputChange(updates)}
      />
    ),
    
    review: <ReviewSubmitStep data={formData} onChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))} />,
  };

  const content = (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {isStandalone ? 'New Permit Application' : 'PNG Environment Act 2000 Permit Application'}
        </h1>
          <p className="text-muted-foreground text-lg">
          {isStandalone 
            ? 'Complete the form below to apply for an environmental permit under PNG Environment Act 2000.'
            : 'Complete all necessary details to apply for an environmental permit'
          }
        </p>
      </div>

      <div className={`${isStandalone ? 'mb-6' : 'mb-4'} p-${isStandalone ? '4' : '3'} bg-secondary/30 rounded-lg border border-border`}>
        <Label htmlFor="applicationNumber" className="text-sm font-medium text-primary">Application Number</Label>
        <Input
          id="applicationNumber"
          type="text"
          value={formData.applicationNumber}
          readOnly
          className={`mt-1 bg-background/70 border-border/50 ${isStandalone ? 'text-lg' : ''} font-semibold`}
        />
      </div>

      {/* Intent Registration Selection */}
      <div className={`${isStandalone ? 'mb-6' : 'mb-4'} p-${isStandalone ? '4' : '3'} bg-primary/5 rounded-lg border border-primary/20`}>
        <Label htmlFor="intentRegistration" className="text-sm font-medium text-primary">
          Link to Approved Intent Registration *
        </Label>
        <p className="text-xs text-muted-foreground mt-1 mb-3">
          Select an approved Intent Registration to launch this permit application. This is required to link the records and proceed with the permit process.
        </p>
        <Select
          value={formData.intent_registration_id || 'none'}
          onValueChange={(value) => handleInputChange('intent_registration_id', value === 'none' ? null : value)}
          disabled={intentsLoading}
        >
          <SelectTrigger id="intentRegistration" className="mt-1 bg-background">
            <SelectValue placeholder={intentsLoading ? "Loading approved intents..." : approvedIntents.length === 0 ? "No approved intent registrations found" : "Select an approved intent registration"} />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            <SelectItem value="none">None - New Application</SelectItem>
            {approvedIntents.map((intent) => (
              <SelectItem key={intent.id} value={intent.id}>
                {intent.entity?.name || 'Unknown Entity'} - {intent.activity_description.substring(0, 50)}
                {intent.activity_description.length > 50 ? '...' : ''} (Level {intent.activity_level})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className={`flex flex-wrap h-auto gap-1 p-1 w-full justify-start ${isStandalone ? 'mb-8' : 'mb-6'} bg-muted/50`}>
        <TabsTrigger value="project" className="flex items-center gap-1 text-xs sm:text-sm h-auto py-1.5 px-2 sm:px-3">
          <Building className="w-4 h-4" />
          <span className="hidden sm:inline">Project</span>
        </TabsTrigger>
        <TabsTrigger value="location" className="flex items-center gap-1 text-xs sm:text-sm h-auto py-1.5 px-2 sm:px-3">
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">Location</span>
        </TabsTrigger>
        <TabsTrigger value="classification" className="flex items-center gap-1 text-xs sm:text-sm h-auto py-1.5 px-2 sm:px-3">
          <Activity className="w-4 h-4" />
          <span className="hidden sm:inline">Classification</span>
        </TabsTrigger>
        <TabsTrigger value="consultation" className="flex items-center gap-1 text-xs sm:text-sm h-auto py-1.5 px-2 sm:px-3">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Consultation</span>
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center gap-1 text-xs sm:text-sm h-auto py-1.5 px-2 sm:px-3">
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Documents</span>
        </TabsTrigger>
        <TabsTrigger value="fees" className="flex items-center gap-1 text-xs sm:text-sm h-auto py-1.5 px-2 sm:px-3">
          <DollarSign className="w-4 h-4" />
          <span className="hidden sm:inline">Fees</span>
        </TabsTrigger>
        <TabsTrigger value="review" className="flex items-center gap-1 text-xs sm:text-sm h-auto py-1.5 px-2 sm:px-3">
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Review</span>
        </TabsTrigger>
          </TabsList>

          {Object.entries(tabComponents).map(([tabKey, TabComponent]) => (
            <TabsContent key={tabKey} value={tabKey}>
              {TabComponent}
            </TabsContent>
          ))}
        </Tabs>

        <div className={`flex flex-col sm:flex-row justify-between items-center ${isStandalone ? 'mt-8 pt-6' : 'mt-6 pt-4'} border-t border-border/50 gap-4`}>
          <div className="text-sm text-muted-foreground flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-yellow-400" />
            All fields marked with * are required.
          </div>
          <div className="flex gap-4">
            {!isStandalone && (
              <Button
                variant="outline"
                onClick={onCancel}
                className="border-muted-foreground/30 text-muted-foreground hover:bg-muted/50"
              >
                Cancel
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => handleSubmit(true)}
              className="border-primary/70 text-primary hover:bg-primary/10 hover:text-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={() => handleSubmit(false)}
              disabled={!formData.legal_declaration_accepted || !formData.compliance_commitment}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isStandalone) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {content}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return content;
}