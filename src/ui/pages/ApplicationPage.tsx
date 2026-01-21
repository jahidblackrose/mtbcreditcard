/**
 * MTB Credit Card Application - Application Form Page
 * 
 * Multi-step form for credit card application.
 * Supports both SELF and ASSISTED modes.
 * 
 * API: Uses application.api.ts ONLY
 */

import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts';
import { ErrorMessage } from '../components';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, Save } from 'lucide-react';
import { FormStepIndicator, PreApplicationForm } from '../application/components';
import { useApplicationForm } from '../application/hooks';
import { APPLICATION_STEPS, type ApplicationMode } from '@/types/application-form.types';

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

  const {
    applicationData,
    updatePreApplication,
    setOtpVerified,
    nextStep,
    prevStep,
    goToStep,
  } = useApplicationForm(mode);

  const completedSteps = useMemo(() => {
    // For now, mark steps before current as completed
    return Array.from({ length: applicationData.currentStep }, (_, i) => i + 1);
  }, [applicationData.currentStep]);

  const handleOnboardingSubmit = (data: any) => {
    updatePreApplication(data);
  };

  const handleOtpVerified = () => {
    setOtpVerified(true);
    setShowOnboarding(false);
    goToStep(1);
  };

  const handleNext = () => {
    if (applicationData.currentStep < APPLICATION_STEPS.length) {
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

  const handleCancel = () => {
    navigate('/');
  };

  const currentStepInfo = APPLICATION_STEPS[applicationData.currentStep - 1];

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
                <CardTitle>{currentStepInfo?.title}</CardTitle>
                <CardDescription>{currentStepInfo?.description}</CardDescription>
              </div>
              {currentStepInfo?.isOptional && (
                <span className="text-xs bg-muted px-2 py-1 rounded">Optional</span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Placeholder content for each step */}
            <div className="min-h-[400px] flex items-center justify-center text-muted-foreground border-2 border-dashed border-muted rounded-lg">
              <div className="text-center p-8">
                <p className="text-lg font-medium mb-2">Step {applicationData.currentStep}: {currentStepInfo?.title}</p>
                <p className="text-sm">Form fields for this step will be implemented here.</p>
                <p className="text-xs mt-4 text-muted-foreground/60">
                  This includes all fields as per the official MTB Credit Card Application Form.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation - Vertical Stack */}
        <div className="max-w-3xl mx-auto mt-6 flex flex-col gap-3">
          <Button onClick={handleNext} size="lg" className="w-full">
            {applicationData.currentStep === APPLICATION_STEPS.length ? (
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
          
          <Button variant="outline" size="lg" className="w-full gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          
          <Button variant="ghost" size="lg" onClick={handleBack} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {applicationData.currentStep === 1 ? 'Back to Start' : 'Previous'}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
