/**
 * MTB Credit Card Application - Application Form Page
 * 
 * Multi-step form for credit card application.
 * Supports both SELF and ASSISTED modes.
 * 
 * API: Uses application.api.ts ONLY
 */

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts';
import { LoadingSpinner, ErrorMessage } from '../components';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import type { ApplicationMode } from '@/types';

interface LocationState {
  mode?: ApplicationMode;
  eligibleCards?: unknown[];
}

const STEPS = [
  { id: 'card', title: 'Select Card', description: 'Choose your preferred credit card' },
  { id: 'personal', title: 'Personal Info', description: 'Your basic information' },
  { id: 'address', title: 'Address', description: 'Present and permanent address' },
  { id: 'employment', title: 'Employment', description: 'Your employment details' },
  { id: 'documents', title: 'Documents', description: 'Upload required documents' },
  { id: 'review', title: 'Review', description: 'Review and submit' },
];

export function ApplicationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  
  const mode: ApplicationMode = state?.mode || 'SELF';
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

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
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${index < currentStep 
                        ? 'bg-success text-success-foreground' 
                        : index === currentStep 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {index < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`
                        flex-1 h-0.5 mx-2
                        ${index < currentStep ? 'bg-success' : 'bg-muted'}
                      `}
                    />
                  )}
                </div>
                <span className="text-xs mt-2 text-muted-foreground hidden md:block">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <ErrorMessage message={error} className="max-w-2xl mx-auto mb-6" />
        )}

        {/* Step Content */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{STEPS[currentStep].title}</CardTitle>
            <CardDescription>{STEPS[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder content for each step */}
            <div className="min-h-[300px] flex items-center justify-center text-muted-foreground">
              <p>Form content for "{STEPS[currentStep].title}" will be implemented in the next phase.</p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="max-w-2xl mx-auto mt-6 flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          
          <Button onClick={handleNext}>
            {currentStep === STEPS.length - 1 ? (
              <>
                Submit Application
                <Check className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
