/**
 * MTB Credit Card Application - Application Form Page
 * 
 * Multi-step form for credit card application.
 * Supports both SELF and ASSISTED modes.
 * 
 * API: Uses application.api.ts ONLY
 */

import { useState, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts';
import { ErrorMessage } from '../components';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, Save, Loader2 } from 'lucide-react';
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
  DeclarationSubmitStep,
} from '../application/components/steps';
import { useApplicationForm } from '../application/hooks';
import { APPLICATION_STEPS, type ApplicationMode } from '@/types/application-form.types';
import { toast } from 'sonner';

interface LocationState {
  mode?: ApplicationMode;
}

// Generate application reference number
const generateApplicationId = (): string => {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MTB-CC-${datePart}-${randomPart}`;
};

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

  const {
    applicationData,
    updatePreApplication,
    setOtpVerified,
    updateCardSelection,
    updatePersonalInfo,
    updateProfessionalInfo,
    updateMonthlyIncome,
    addBankAccount,
    updateBankAccount,
    removeBankAccount,
    addCreditFacility,
    updateCreditFacility,
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

  // Calculate completed steps based on form data validation
  const completedSteps = useMemo(() => {
    const completed: number[] = [];
    
    // Step 1: Card Selection - check if all required fields are filled
    if (applicationData.cardSelection.cardNetwork && 
        applicationData.cardSelection.cardTier && 
        applicationData.cardSelection.cardCategory &&
        applicationData.cardSelection.expectedCreditLimit) {
      completed.push(1);
    }
    
    // Step 2: Personal Info
    if (applicationData.personalInfo.nameOnCard && 
        applicationData.personalInfo.nidNumber &&
        applicationData.personalInfo.fatherName &&
        applicationData.personalInfo.motherName) {
      completed.push(2);
    }
    
    // Step 3: Professional Info
    if (applicationData.professionalInfo.organizationName && 
        applicationData.professionalInfo.designation) {
      completed.push(3);
    }
    
    // Step 4: Monthly Income
    if (applicationData.monthlyIncome.salariedIncome?.grossSalary || 
        applicationData.monthlyIncome.businessIncome?.grossIncome) {
      completed.push(4);
    }
    
    // Step 5 & 6: Optional - always mark as complete
    completed.push(5, 6);
    
    // Step 7: Nominee
    if (applicationData.nominee.nomineeName && 
        applicationData.nominee.declarationAccepted) {
      completed.push(7);
    }
    
    // Step 8: Supplementary - Optional
    completed.push(8);
    
    // Step 9: References
    if (applicationData.references.reference1.refereeName && 
        applicationData.references.reference2.refereeName) {
      completed.push(9);
    }
    
    // Step 10: Image & Signature
    if (applicationData.imageSignature.primaryApplicantPhoto && 
        applicationData.imageSignature.primaryApplicantSignature) {
      completed.push(10);
    }
    
    // Step 11: Auto Debit
    if (applicationData.autoDebit.accountName && 
        applicationData.autoDebit.mtbAccountNumber) {
      completed.push(11);
    }
    
    // Step 12: MID
    const allDeclarationsAnswered = applicationData.mid.declarations.every(d => d.answer !== null);
    const requiredDocsUploaded = applicationData.mid.documentChecklist
      .filter(d => d.required)
      .every(d => d.uploaded);
    if (allDeclarationsAnswered && requiredDocsUploaded) {
      completed.push(12);
    }
    
    return completed;
  }, [applicationData]);

  // Check if current step is valid for navigation
  const isCurrentStepValid = useCallback((): boolean => {
    const step = applicationData.currentStep;
    
    // Optional steps are always valid
    if (APPLICATION_STEPS[step - 1]?.isOptional) {
      return true;
    }
    
    return completedSteps.includes(step);
  }, [applicationData.currentStep, completedSteps]);

  // Check if ready for final submission
  const canSubmit = useMemo(() => {
    return applicationData.termsAccepted && applicationData.declarationAccepted;
  }, [applicationData.termsAccepted, applicationData.declarationAccepted]);

  const handleOnboardingSubmit = (data: any) => {
    updatePreApplication(data);
  };

  const handleOtpVerified = () => {
    setOtpVerified(true);
    setShowOnboarding(false);
    goToStep(1);
  };

  const handleNext = () => {
    // If on final step (step 13), submit
    if (applicationData.currentStep === 13) {
      handleSubmit();
      return;
    }
    
    // Regular step navigation
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
    // Draft is auto-saved, but show confirmation
    toast.success('Application saved as draft', {
      description: 'You can resume your application anytime.',
    });
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error('Please accept the terms and declaration to submit');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const applicationId = generateApplicationId();
      setSubmittedApplicationId(applicationId);
      setIsSubmitted(true);
      clearDraft();
      
      toast.success('Application submitted successfully!');
    } catch (err) {
      setError('Failed to submit application. Please try again.');
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

  const currentStepInfo = applicationData.currentStep <= 12 
    ? APPLICATION_STEPS[applicationData.currentStep - 1]
    : { title: 'Declaration & Submit', description: 'Review and submit your application', isOptional: false };

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
          {/* Mode Indicator */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary">
              {mode === 'SELF' ? 'Self Application' : 'Assisted Application'}
            </span>
          </div>

          <PreApplicationForm
            mode={mode}
            initialData={applicationData.preApplication}
            onSubmit={handleOnboardingSubmit}
            onOtpVerified={handleOtpVerified}
          />

          <div className="text-center mt-6">
            <Button variant="ghost" onClick={handleCancel}>
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
              // Clear existing and set new accounts
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
              // Clear existing and set new facilities
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
          <DeclarationSubmitStep
            termsAccepted={applicationData.termsAccepted}
            declarationAccepted={applicationData.declarationAccepted}
            onTermsChange={setTermsAccepted}
            onDeclarationChange={setDeclarationAccepted}
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
      <div className="container mx-auto px-4 py-8">
        {/* Mode Indicator */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary">
            {mode === 'SELF' ? 'Self Application' : 'Assisted Application'}
          </span>
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
                    : 'Final Step: Declaration & Submit'
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

        {/* Navigation - Vertical Stack */}
        <div className="max-w-3xl mx-auto mt-6 flex flex-col gap-3">
          <Button 
            onClick={handleNext} 
            size="lg" 
            className="w-full"
            disabled={isSubmitting || (isFinalSubmitStep && !canSubmit)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : isFinalSubmitStep ? (
              <>
                Submit Application
                <Check className="ml-2 h-4 w-4" />
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
            className="w-full gap-2"
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
            className="w-full"
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
