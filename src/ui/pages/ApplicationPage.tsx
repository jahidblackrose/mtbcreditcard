/**
 * MTB Credit Card Application - Application Form Page
 * 
 * Multi-step form for credit card application.
 * Supports both SELF and ASSISTED modes with Redis-backed state management.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts';
import { ErrorMessage, SaveStatusIndicator, SessionExpiryWarning } from '../components';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Save, Loader2, Send } from 'lucide-react';
import { FormStepIndicator, PreApplicationForm, SubmissionSuccess } from '../application/components';
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
  MIDStep,
  FinalReviewStep,
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
    getHighestCompletedStep,
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

  // Calculate completed steps based on form data validation
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
    
    // Optional steps are always complete
    completed.push(5, 6);
    
    if (applicationData.nominee.nomineeName && 
        applicationData.nominee.declarationAccepted) {
      completed.push(7);
    }
    
    completed.push(8); // Supplementary is optional
    
    if (applicationData.references.reference1.refereeName && 
        applicationData.references.reference2.refereeName) {
      completed.push(9);
    }
    
    if (applicationData.imageSignature.primaryApplicantPhoto && 
        applicationData.imageSignature.primaryApplicantSignature) {
      completed.push(10);
    }
    
    if (applicationData.autoDebit.accountName && 
        applicationData.autoDebit.mtbAccountNumber) {
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
    
    // Create session after OTP verification
    await createSession(mode);
  };

  const handleResumeApplication = async (mobileNumber: string) => {
    // In a real implementation, this would fetch the draft from backend
    toast.info('Resume feature will fetch your saved application', {
      description: `Looking up application for ${mobileNumber}...`,
    });
    // For demo, just proceed to onboarding
  };

  const handleNext = () => {
    if (applicationData.currentStep === 13) {
      handleSubmit();
      return;
    }
    
    if (applicationData.currentStep < 13) {
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

  const handleSaveDraft = () => {
    toast.success('Application saved as draft', {
      description: 'You can resume your application anytime.',
    });
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

  const handleCancel = () => {
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

  const currentStepInfo = applicationData.currentStep <= 12 
    ? APPLICATION_STEPS[applicationData.currentStep - 1]
    : { title: 'Final Review & Submit', description: 'Review and submit your application', isOptional: false };

  // Show success screen after submission
  if (isSubmitted) {
    return (
      <MainLayout>
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
      </MainLayout>
    );
  }

  // Show onboarding/pre-application form first
  if (showOnboarding || !applicationData.otpVerified) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <PreApplicationForm
            mode={mode}
            initialData={applicationData.preApplication}
            onSubmit={handleOnboardingSubmit}
            onOtpVerified={handleOtpVerified}
            onResumeApplication={handleResumeApplication}
          />

          <div className="text-center mt-6">
            <Button variant="ghost" onClick={handleCancel} className="text-muted-foreground hover:text-foreground">
              Cancel Application
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

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
            initialData={applicationData.personalInfo}
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
          <MIDStep
            initialData={applicationData.mid}
            onSave={updateMID}
          />
        );
      case 13:
        return (
          <FinalReviewStep
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

  const isLastStep = applicationData.currentStep === 13;
  const isFinalSubmitStep = isLastStep;

  return (
    <MainLayout>
      {/* Session Expiry Warning */}
      {isSessionWarning && (
        <SessionExpiryWarning
          ttlSeconds={ttlSeconds}
          onExtend={handleExtendSession}
          isExpired={isSessionExpired}
          isWarning={isSessionWarning}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Save Status Indicator */}
        <div className="fixed top-20 right-4 z-40">
          <SaveStatusIndicator status={saveStatus} />
        </div>

        {/* Progress Steps */}
        <div className="max-w-5xl mx-auto mb-8">
          <FormStepIndicator
            currentStep={applicationData.currentStep}
            completedSteps={completedSteps}
            onStepClick={goToStep}
          />
        </div>

        {error && (
          <ErrorMessage message={error} className="max-w-2xl mx-auto mb-6" />
        )}

        {/* Step Content */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {applicationData.currentStep <= 12 
                    ? `Step ${applicationData.currentStep}: ${currentStepInfo?.title}`
                    : 'Final Step: Review & Submit'
                  }
                </CardTitle>
                <CardDescription>{currentStepInfo?.description}</CardDescription>
              </div>
              {currentStepInfo?.isOptional && (
                <span className="text-xs bg-muted px-2 py-1 rounded">Optional</span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation - Vertical Stack with MTB colors */}
        <div className="max-w-3xl mx-auto mt-6 flex flex-col gap-3">
          <Button 
            onClick={handleNext} 
            size="lg" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isSubmitting || (isFinalSubmitStep && !canSubmit)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : isFinalSubmitStep ? (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Application
              </>
            ) : (
              <>
                {currentStepInfo?.isOptional ? 'Skip / Continue' : 'Continue'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full gap-2 border-primary text-primary hover:bg-primary/5"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          
          <Button 
            variant="ghost" 
            size="lg" 
            onClick={handleBack} 
            className="w-full text-muted-foreground hover:text-foreground"
            disabled={isSubmitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {applicationData.currentStep === 1 ? 'Back to Start' : 'Previous'}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
