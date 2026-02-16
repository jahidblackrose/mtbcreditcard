/**
 * MTB Credit Card Application - Responsive Application Page
 *
 * Mobile-first with desktop Bootstrap-style layout for larger screens.
 * - Mobile (≤ 768px): Floating labels, MLine bar, sticky CTA
 * - Desktop (> 768px): Bootstrap 12-grid, sidebar stepper, standard inputs
 *
 * Enhanced with improved UX, loading states, and professional design.
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
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
import { ApplicationHeader, StepNavigation, FormSkeleton, DesktopApplicationLayout } from '@/components';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

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
      setIsSaving(true);
      saveDraftStep(applicationData.currentStep, stepName, applicationData as unknown as Record<string, unknown>);
      // Simulate save completion (in real app, this would be async)
      const timer = setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [session?.sessionId, applicationData, showOnboarding, saveDraftStep]);

  // Clear validation error when step changes
  useEffect(() => {
    setValidationError(null);
  }, [applicationData.currentStep]);

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

  const handleNext = useCallback(() => {
    if (applicationData.currentStep === 12) {
      handleSubmit();
      return;
    }

    if (applicationData.currentStep < 12) {
      setIsLoading(true);
      setValidationError(null);

      // Simulate validation and navigation
      setTimeout(() => {
        setIsLoading(false);
        nextStep();
        // Scroll to top on step change
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    }
  }, [applicationData.currentStep, nextStep]);

  const handleBack = useCallback(() => {
    if (applicationData.currentStep > 1) {
      prevStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowOnboarding(true);
    }
  }, [applicationData.currentStep, prevStep]);

  const handleSaveDraft = useCallback(() => {
    setIsSaving(true);
    const stepName = APPLICATION_STEPS[applicationData.currentStep - 1]?.title || 'Unknown';
    saveDraftStep(applicationData.currentStep, stepName, applicationData as unknown as Record<string, unknown>);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
      toast.success('Draft saved successfully');
    }, 500);
  }, [applicationData, saveDraftStep]);

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

  // Render step content with loading state
  const renderStepContent = () => {
    if (isLoading) {
      return <FormSkeleton fieldCount={5} showActions={false} />;
    }

    switch (applicationData.currentStep) {
      case 1:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key={applicationData.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CardSelectionStep
                initialData={applicationData.cardSelection}
                onSave={updateCardSelection}
              />
            </motion.div>
          </AnimatePresence>
        );
      case 2:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key={applicationData.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PersonalInfoStep
                initialData={{
                  ...applicationData.personalInfo,
                  nidNumber: applicationData.personalInfo.nidNumber || applicationData.preApplication.nidNumber,
                  mobileNumber: applicationData.personalInfo.mobileNumber || applicationData.preApplication.mobileNumber,
                  email: applicationData.personalInfo.email || applicationData.preApplication.email,
                }}
                onSave={updatePersonalInfo}
              />
            </motion.div>
          </AnimatePresence>
        );
      case 3:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key={applicationData.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProfessionalInfoStep
                initialData={applicationData.professionalInfo}
                onSave={updateProfessionalInfo}
              />
            </motion.div>
          </AnimatePresence>
        );
      case 4:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key={applicationData.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MonthlyIncomeStep
                initialData={applicationData.monthlyIncome}
                onSave={updateMonthlyIncome}
              />
            </motion.div>
          </AnimatePresence>
        );
      case 5:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key={applicationData.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BankAccountsStep
                initialData={applicationData.bankAccounts}
                onSave={(accounts) => {
                  applicationData.bankAccounts.forEach(acc => removeBankAccount(acc.id));
                  accounts.forEach(acc => addBankAccount(acc));
                }}
              />
            </motion.div>
          </AnimatePresence>
        );
      case 6:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key={applicationData.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CreditFacilitiesStep
                initialData={applicationData.creditFacilities}
                onSave={(facilities) => {
                  applicationData.creditFacilities.forEach(fac => removeCreditFacility(fac.id));
                  facilities.forEach(fac => addCreditFacility(fac));
                }}
              />
            </motion.div>
          </AnimatePresence>
        );
      case 7:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key={applicationData.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <NomineeStep
                initialData={applicationData.nominee}
                onSave={updateNominee}
              />
            </motion.div>
          </AnimatePresence>
        );
      case 8:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key={applicationData.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          </AnimatePresence>
        );
      case 9:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key={applicationData.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ReferencesStep
                initialData={applicationData.references}
                onSave={updateReferences}
              />
            </motion.div>
          </AnimatePresence>
        );
      case 10:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key={applicationData.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ImageSignatureStep
                initialData={applicationData.imageSignature}
                hasSupplementary={applicationData.hasSupplementaryCard}
                onSave={updateImageSignature}
              />
            </motion.div>
          </AnimatePresence>
        );
      case 11:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key={applicationData.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AutoDebitStep
                initialData={applicationData.autoDebit}
                onSave={updateAutoDebit}
              />
            </motion.div>
          </AnimatePresence>
        );
      case 12:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key={applicationData.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          </AnimatePresence>
        );
      default:
        return null;
    }
  };

  // Render error block - improved with better UX
  const renderError = () => {
    if (!error) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-6 rounded-xl bg-red-50 border-2 border-red-200"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900 mb-1">Something went wrong</h3>
            <p className="text-red-700 text-sm mb-2">{error}</p>
            <p className="text-red-600 text-xs">Please review your information and try again. Your draft has been saved.</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 transition-colors"
            aria-label="Dismiss error"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </motion.div>
    );
  };

  // Desktop Layout (> 768px) - Professional layout with sidebar
  if (!isMobile) {
    return (
      <DesktopApplicationLayout
        currentStep={applicationData.currentStep}
        totalSteps={12}
        completedSteps={completedSteps}
        stepTitle={currentStepInfo?.title || 'Declaration & Submit'}
        stepDescription={currentStepInfo?.description}
        applicationId={session?.sessionId}
        isSaving={isSaving}
        lastSaved={lastSaved}
        mode={mode}
        onStepClick={(step) => {
          // Only allow going to completed steps or previous steps
          if (completedSteps.includes(step) || step < applicationData.currentStep) {
            goToStep(step);
          }
        }}
        navigation={
          <StepNavigation
            currentStep={applicationData.currentStep}
            totalSteps={12}
            canGoBack={applicationData.currentStep > 1}
            canGoNext={true}
            isNextLoading={isSubmitting || isLoading}
            isSaving={isSaving}
            onBack={handleBack}
            onNext={handleNext}
            onSave={handleSaveDraft}
            onNextText={applicationData.currentStep === 12 ? 'Submit Application' : undefined}
            showSave={applicationData.currentStep !== 12}
            errorMessage={validationError || undefined}
          />
        }
      >
        {/* Session Warning */}
        {isSessionWarning && (
          <div className="mb-6">
            <SessionExpiryWarning
              ttlSeconds={ttlSeconds}
              onExtend={handleExtendSession}
              isExpired={isSessionExpired}
              isWarning={isSessionWarning}
            />
          </div>
        )}

        {/* Error Display */}
        {renderError()}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </DesktopApplicationLayout>
    );
  }

  // Mobile Layout (≤ 768px) - Enhanced with better UX
  return (
    <div className="min-h-screen bg-mobile-background pb-24">
      {/* Session Warning */}
      {isSessionWarning && (
        <SessionExpiryWarning
          ttlSeconds={ttlSeconds}
          onExtend={handleExtendSession}
          isExpired={isSessionExpired}
          isWarning={isSessionWarning}
        />
      )}

      {/* Application Header (Mobile) */}
      <ApplicationHeader
        currentStep={applicationData.currentStep}
        totalSteps={12}
        stepTitle={currentStepInfo?.title || 'Declaration & Submit'}
        applicationId={session?.sessionId}
        isSaving={isSaving}
        lastSaved={lastSaved}
        mode={mode}
      />

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6">
        {/* Error Display */}
        {renderError()}

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>
      </div>

      {/* Step Navigation (Sticky at bottom) */}
      <StepNavigation
        currentStep={applicationData.currentStep}
        totalSteps={12}
        canGoBack={applicationData.currentStep > 1}
        canGoNext={true}
        isNextLoading={isSubmitting || isLoading}
        isSaving={isSaving}
        onBack={handleBack}
        onNext={handleNext}
        onSave={handleSaveDraft}
        onNextText={applicationData.currentStep === 12 ? 'Submit Application' : undefined}
        showSave={applicationData.currentStep !== 12}
        errorMessage={validationError || undefined}
      />
    </div>
  );
}
