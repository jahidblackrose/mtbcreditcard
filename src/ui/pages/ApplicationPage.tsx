/**
 * MTB Credit Card Application - Responsive Application Page
 * 
 * Mobile-first with desktop Bootstrap-style layout for larger screens.
 * - Mobile (≤ 768px): Floating labels, MLine bar, sticky CTA
 * - Desktop (> 768px): Bootstrap 12-grid, sidebar stepper, standard inputs
 */

import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileStepLayout } from '../mobile/components';
import { DesktopStepLayout } from '../desktop/components';
import { SessionExpiryWarning } from '../components';
import { PreApplicationForm, SubmissionSuccess } from '../application/components';
import { 
  CardSelectionStep,
  PersonalInfoStep,
  ProfessionalInfoStep,
  MonthlyIncomeStep,
  BankAccountsStep,
  CreditFacilitiesStep,
  NomineeStep,
  SupplementaryCardStep,
  ReferencesStep,
  ImageSignatureStep,
  AutoDebitStep,
  DeclarationSubmitStep,
} from '../application/components/steps';
import { useApplicationForm } from '../application/hooks';
import { useSession } from '@/hooks/useSession';
import { useDraft } from '@/hooks/useDraft';
import { APPLICATION_STEPS, type ApplicationMode } from '@/types/application-form.types';
import { toast } from 'sonner';
import * as submissionApi from '@/api/submission.api';

interface LocationState {
  mode?: ApplicationMode;
}

export function ApplicationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const isMobile = useIsMobile();
  
  const mode: ApplicationMode = state?.mode || 'SELF';
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedApplicationId, setSubmittedApplicationId] = useState<string>('');
  const [livePhoto, setLivePhoto] = useState<string | null>(null);

  // Session management
  const {
    session,
    isExpired: isSessionExpired,
    isWarning: isSessionWarning,
    ttlSeconds,
    createSession,
    extendSession,
  } = useSession();

  // Draft management
  const {
    saveStatus,
    saveDraftStep,
  } = useDraft(session?.sessionId || null);

  const {
    applicationData,
    updatePreApplication,
    setOtpVerified,
    updateCardSelection,
    updatePersonalInfo,
    updateProfessionalInfo,
    updateMonthlyIncome,
    addBankAccount,
    removeBankAccount,
    addCreditFacility,
    removeCreditFacility,
    updateNominee,
    updateSupplementaryCard,
    updateReferences,
    updateImageSignature,
    updateAutoDebit,
    updateMID,
    setTermsAccepted,
    setDeclarationAccepted,
    nextStep,
    prevStep,
    goToStep,
    clearDraft,
  } = useApplicationForm(mode);

  // Create session on component mount
  useEffect(() => {
    if (!session && showOnboarding === false) {
      createSession(mode);
    }
  }, [session, showOnboarding, mode, createSession]);

  // Auto-save draft when step data changes
  useEffect(() => {
    if (session?.sessionId && applicationData.currentStep > 0 && !showOnboarding) {
      const stepName = APPLICATION_STEPS[applicationData.currentStep - 1]?.title || 'Unknown';
      saveDraftStep(applicationData.currentStep, stepName, applicationData as unknown as Record<string, unknown>);
    }
  }, [session?.sessionId, applicationData, showOnboarding, saveDraftStep]);

  // Calculate completed steps
  const completedSteps = useMemo(() => {
    const completed: number[] = [];
    
    if (applicationData.cardSelection.cardNetwork && 
        applicationData.cardSelection.cardTier && 
        applicationData.cardSelection.cardCategory &&
        applicationData.cardSelection.expectedCreditLimit) {
      completed.push(1);
    }
    
    if (applicationData.personalInfo.nameOnCard && 
        applicationData.personalInfo.nidNumber &&
        applicationData.personalInfo.fatherName &&
        applicationData.personalInfo.motherName) {
      completed.push(2);
    }
    
    if (applicationData.professionalInfo.organizationName && 
        applicationData.professionalInfo.designation) {
      completed.push(3);
    }
    
    if (applicationData.monthlyIncome.salariedIncome?.grossSalary || 
        applicationData.monthlyIncome.businessIncome?.grossIncome) {
      completed.push(4);
    }
    
    completed.push(5, 6);
    
    if (applicationData.nominee.nomineeName && 
        applicationData.nominee.declarationAccepted) {
      completed.push(7);
    }
    
    completed.push(8);
    
    if (applicationData.references.reference1.refereeName && 
        applicationData.references.reference2.refereeName) {
      completed.push(9);
    }
    
    if (applicationData.imageSignature.primaryApplicantPhoto && 
        applicationData.imageSignature.primaryApplicantSignature) {
      completed.push(10);
    }
    
    if (applicationData.autoDebit.mtbAccountNumber) {
      completed.push(11);
    }
    
    const allDeclarationsAnswered = applicationData.mid.declarations.every(d => d.answer !== null);
    const requiredDocsUploaded = applicationData.mid.documentChecklist
      .filter(d => d.required)
      .every(d => d.uploaded);
    if (allDeclarationsAnswered && requiredDocsUploaded) {
      completed.push(12);
    }
    
    return completed;
  }, [applicationData]);

  // Check if ready for final submission
  const canSubmit = useMemo(() => {
    return applicationData.termsAccepted && applicationData.declarationAccepted && livePhoto !== null;
  }, [applicationData.termsAccepted, applicationData.declarationAccepted, livePhoto]);

  const handleOnboardingSubmit = async (data: any) => {
    updatePreApplication(data);
  };

  const handleOtpVerified = async () => {
    setOtpVerified(true);
    setShowOnboarding(false);
    goToStep(1);
    await createSession(mode);
  };

  const handleResumeApplication = async (mobileNumber: string) => {
    toast.info('Resume feature will fetch your saved application', {
      description: `Looking up application for ${mobileNumber}...`,
    });
  };

  const handleNext = () => {
    if (applicationData.currentStep === 12) {
      handleSubmit();
      return;
    }
    
    if (applicationData.currentStep < 12) {
      nextStep();
    }
  };

  const handleBack = () => {
    if (applicationData.currentStep > 1) {
      prevStep();
    } else {
      setShowOnboarding(true);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error('Please complete all requirements to submit');
      return;
    }

    if (!session?.sessionId) {
      toast.error('Session expired. Please refresh and try again.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submissionApi.submitApplication(session.sessionId);
      
      if (response.status === 200 && response.data) {
        setSubmittedApplicationId(response.data.referenceNumber);
        setIsSubmitted(true);
        clearDraft();
        toast.success('Application submitted successfully!');
      } else {
        setError(response.message);
        toast.error(response.message);
      }
    } catch (err) {
      setError('Failed to submit application. Please try again.');
      toast.error('Submission failed. Your draft is saved.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleExtendSession = async (): Promise<boolean> => {
    const success = await extendSession();
    if (success) {
      toast.success('Session extended');
    } else {
      toast.error('Failed to extend session');
    }
    return success;
  };

  const handleSupplementaryOnly = () => {
    toast.info('Supplementary Card Application', {
      description: 'Please enter your existing card details first.',
    });
  };

  const handleCheckStatus = (referenceNumber: string) => {
    toast.info('Status Check', {
      description: `Checking status for ${referenceNumber}...`,
    });
  };

  // Get current step info
  const currentStepInfo = applicationData.currentStep <= 12 
    ? APPLICATION_STEPS[applicationData.currentStep - 1]
    : { title: 'Final Review', description: 'Review and submit your application', isOptional: false };

  // Show success screen after submission
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-mobile-background">
        <div className="container mx-auto px-4 py-8">
          <SubmissionSuccess
            applicationId={submittedApplicationId}
            applicantName={applicationData.preApplication.fullName}
            applicantEmail={applicationData.preApplication.email}
            applicantMobile={applicationData.preApplication.mobileNumber}
            submittedAt={new Date().toISOString()}
            onGoHome={handleGoHome}
          />
        </div>
      </div>
    );
  }

  // Show onboarding/pre-application form first
  if (showOnboarding || !applicationData.otpVerified) {
    return (
      <div className="min-h-screen bg-mobile-background">
        <div className="container mx-auto px-4 py-8">
          <PreApplicationForm
            mode={mode}
            initialData={applicationData.preApplication}
            onSubmit={handleOnboardingSubmit}
            onOtpVerified={handleOtpVerified}
            onResumeApplication={handleResumeApplication}
            onSupplementaryOnly={handleSupplementaryOnly}
            onCheckStatus={handleCheckStatus}
          />
        </div>
      </div>
    );
  }

  // Determine proceed button label
  const getProceedLabel = () => {
    if (applicationData.currentStep === 12) {
      return 'Submit';
    }
    if (currentStepInfo?.isOptional) {
      return 'Skip / Continue';
    }
    return 'Proceed';
  };

  // Render step content
  const renderStepContent = () => {
    switch (applicationData.currentStep) {
      case 1:
        return (
          <CardSelectionStep
            initialData={applicationData.cardSelection}
            onSave={updateCardSelection}
          />
        );
      case 2:
        return (
          <PersonalInfoStep
            initialData={{
              ...applicationData.personalInfo,
              nidNumber: applicationData.personalInfo.nidNumber || applicationData.preApplication.nidNumber,
              mobileNumber: applicationData.personalInfo.mobileNumber || applicationData.preApplication.mobileNumber,
              email: applicationData.personalInfo.email || applicationData.preApplication.email,
            }}
            onSave={updatePersonalInfo}
          />
        );
      case 3:
        return (
          <ProfessionalInfoStep
            initialData={applicationData.professionalInfo}
            onSave={updateProfessionalInfo}
          />
        );
      case 4:
        return (
          <MonthlyIncomeStep
            initialData={applicationData.monthlyIncome}
            onSave={updateMonthlyIncome}
          />
        );
      case 5:
        return (
          <BankAccountsStep
            initialData={applicationData.bankAccounts}
            onSave={(accounts) => {
              applicationData.bankAccounts.forEach(acc => removeBankAccount(acc.id));
              accounts.forEach(acc => addBankAccount(acc));
            }}
          />
        );
      case 6:
        return (
          <CreditFacilitiesStep
            initialData={applicationData.creditFacilities}
            onSave={(facilities) => {
              applicationData.creditFacilities.forEach(fac => removeCreditFacility(fac.id));
              facilities.forEach(fac => addCreditFacility(fac));
            }}
          />
        );
      case 7:
        return (
          <NomineeStep
            initialData={applicationData.nominee}
            onSave={updateNominee}
          />
        );
      case 8:
        return (
          <SupplementaryCardStep
            initialData={applicationData.supplementaryCard}
            hasSupplementaryCard={applicationData.hasSupplementaryCard}
            onToggle={(has) => {
              if (!has) {
                updateSupplementaryCard(undefined);
              }
            }}
            onSave={updateSupplementaryCard}
          />
        );
      case 9:
        return (
          <ReferencesStep
            initialData={applicationData.references}
            onSave={updateReferences}
          />
        );
      case 10:
        return (
          <ImageSignatureStep
            initialData={applicationData.imageSignature}
            hasSupplementary={applicationData.hasSupplementaryCard}
            onSave={updateImageSignature}
          />
        );
      case 11:
        return (
          <AutoDebitStep
            initialData={applicationData.autoDebit}
            onSave={updateAutoDebit}
          />
        );
      case 12:
        return (
          <DeclarationSubmitStep
            termsAccepted={applicationData.termsAccepted}
            declarationAccepted={applicationData.declarationAccepted}
            onTermsChange={setTermsAccepted}
            onDeclarationChange={setDeclarationAccepted}
            livePhoto={livePhoto}
            onLivePhotoCapture={setLivePhoto}
            supplementaryCard={applicationData.supplementaryCard}
            hasSupplementaryCard={applicationData.hasSupplementaryCard}
          />
        );
      default:
        return null;
    }
  };

  // Render error block - dark theme style for submission errors
  const renderError = () => error && (
    <div 
      className="mb-4 p-6 rounded-xl text-center"
      style={{ backgroundColor: '#333333' }}
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-4">
        <AlertTriangle className="h-6 w-6 text-red-400" />
      </div>
      <h3 
        className="text-xl font-bold mb-2"
        style={{ color: '#ffffff' }}
      >
        Error: Something went wrong!
      </h3>
      <p className="text-gray-300 text-sm">{error}</p>
      <p className="text-gray-400 text-xs mt-2">Please review your information and try again.</p>
    </div>
  );

  // Desktop Layout (> 768px)
  if (!isMobile) {
    return (
      <>
        {isSessionWarning && (
          <SessionExpiryWarning
            ttlSeconds={ttlSeconds}
            onExtend={handleExtendSession}
            isExpired={isSessionExpired}
            isWarning={isSessionWarning}
          />
        )}

        <DesktopStepLayout
          currentStep={applicationData.currentStep}
          totalSteps={12}
          steps={APPLICATION_STEPS.map(step => ({
            title: step.title,
            description: step.description,
            isOptional: step.isOptional,
          }))}
          completedSteps={completedSteps}
          title={currentStepInfo?.title || 'Declaration & Submit'}
          description={currentStepInfo?.description}
          onBack={handleBack}
          onProceed={handleNext}
          onStepClick={goToStep}
          proceedLabel={getProceedLabel()}
          proceedDisabled={isSubmitting || (applicationData.currentStep === 12 && !canSubmit)}
          isLoading={isSubmitting}
        >
          {renderError()}
          {renderStepContent()}
        </DesktopStepLayout>
      </>
    );
  }

  // Mobile Layout (≤ 768px)
  return (
    <>
      {/* Session Expiry Warning */}
      {isSessionWarning && (
        <SessionExpiryWarning
          ttlSeconds={ttlSeconds}
          onExtend={handleExtendSession}
          isExpired={isSessionExpired}
          isWarning={isSessionWarning}
        />
      )}

      <MobileStepLayout
        currentStep={applicationData.currentStep}
        totalSteps={12}
        title={currentStepInfo?.title || 'Declaration & Submit'}
        description={currentStepInfo?.description}
        onBack={handleBack}
        onProceed={handleNext}
        proceedLabel={getProceedLabel()}
        proceedDisabled={isSubmitting || (applicationData.currentStep === 12 && !canSubmit)}
        isLoading={isSubmitting}
      >
        {renderError()}
        {renderStepContent()}
      </MobileStepLayout>
    </>
  );
}
