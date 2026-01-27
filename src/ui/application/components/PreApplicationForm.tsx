/**
 * MTB Credit Card Application - Pre-Application / Onboarding Form
 * Mobile Banking App Style
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subYears } from 'date-fns';
import { Loader2, CreditCard, User, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { preApplicationSchema, type PreApplicationFormData } from '@/lib/validation-schemas';
import type { ApplicationMode } from '@/types/application-form.types';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { ResumeDashboard } from './ResumeDashboard';
import { OtpVerificationScreen } from './OtpVerificationScreen';
import { ExistingApplicantSupplementary } from './ExistingApplicantSupplementary';
import { MobileFormCard, MobileFormSection, MobileInput, MobilePhoneInput, MobileDateInput } from '@/ui/mobile/components';

interface PreApplicationFormProps {
  mode: ApplicationMode;
  initialData?: Partial<PreApplicationFormData>;
  onSubmit: (data: PreApplicationFormData) => void;
  onOtpVerified: () => void;
  onResumeApplication?: (mobileNumber: string) => void;
  onSupplementaryOnly?: () => void;
  onCheckStatus?: (referenceNumber: string) => void;
  isLoading?: boolean;
}

export function PreApplicationForm({
  mode,
  initialData,
  onSubmit,
  onOtpVerified,
  onResumeApplication,
  onSupplementaryOnly,
  onCheckStatus,
  isLoading = false,
}: PreApplicationFormProps) {
  const [applicationType, setApplicationType] = useState<'new' | 'resume' | 'supplementary' | null>(mode === 'ASSISTED' ? 'new' : null);
  const [showOtp, setShowOtp] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const maxDateOfBirth = subYears(new Date(), 18);
  const minDateOfBirth = new Date('1940-01-01');

  const form = useForm<PreApplicationFormData>({
    resolver: zodResolver(preApplicationSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      nidNumber: initialData?.nidNumber || '',
      dateOfBirth: initialData?.dateOfBirth || '',
      mobileNumber: initialData?.mobileNumber || '',
      email: initialData?.email || '',
    },
  });

  const handleFormSubmit = async (data: PreApplicationFormData) => {
    if (mode === 'ASSISTED') {
      onSubmit(data);
      onOtpVerified();
    } else {
      onSubmit(data);
      setIsSendingOtp(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSendingOtp(false);
      setShowOtp(true);
    }
  };

  const handleResendOtp = async () => {
    // Simulate resend
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  // Application type selection for Self mode
  if (mode === 'SELF' && applicationType === null) {
    return (
      <div className="min-h-screen bg-mobile-background px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mb-4">
              <CreditCard className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Credit Card Application</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Start a new application or manage existing ones
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setApplicationType('new')}
              className={cn(
                'w-full flex items-center gap-4 p-5 rounded-2xl',
                'bg-card border border-border/50',
                'transition-all duration-200',
                'hover:border-success hover:shadow-md',
                'text-left'
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-success" />
              </div>
              <div className="flex-1">
                <span className="block text-base font-semibold text-foreground">New Application</span>
                <span className="block text-xs text-muted-foreground mt-0.5">
                  Start a fresh credit card application
                </span>
              </div>
            </button>
            
            <button
              onClick={() => setApplicationType('resume')}
              className={cn(
                'w-full flex items-center gap-4 p-5 rounded-2xl',
                'bg-card border border-border/50',
                'transition-all duration-200',
                'hover:border-primary hover:shadow-md',
                'text-left'
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <span className="block text-base font-semibold text-foreground">Existing Applicant</span>
                <span className="block text-xs text-muted-foreground mt-0.5">
                  Resume, add supplementary, or check status
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Resume Dashboard
  if (applicationType === 'resume') {
    return (
      <ResumeDashboard
        onResumeApplication={onResumeApplication!}
        onSupplementaryOnly={() => setApplicationType('supplementary')}
        onCheckStatus={onCheckStatus!}
        onBack={() => setApplicationType(null)}
        isLoading={isLoading}
      />
    );
  }

  // Existing Applicant - Add Supplementary Card Flow
  if (applicationType === 'supplementary') {
    return (
      <ExistingApplicantSupplementary
        onBack={() => setApplicationType('resume')}
        onComplete={() => {
          // Handle completion - could show success message or redirect
          setApplicationType(null);
        }}
      />
    );
  }

  // OTP Verification Screen
  if (showOtp) {
    return (
      <OtpVerificationScreen
        mobileNumber={form.getValues('mobileNumber')}
        onVerify={onOtpVerified}
        onBack={() => setShowOtp(false)}
        onResend={handleResendOtp}
      />
    );
  }

  // Main Form
  return (
    <div className="min-h-screen bg-mobile-background flex flex-col">
      {/* Top Bar */}
      {applicationType === 'new' && mode === 'SELF' && (
        <div className="sticky top-0 z-50 bg-mobile-background px-4 py-3 safe-area-top">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setApplicationType(null)}
              className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <span className="text-base font-medium">New Application</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-4 pt-4 pb-2 md:pt-10 md:pb-6">
        <div className="mx-auto w-full max-w-sm md:max-w-lg md:text-center">
          <h1 className="text-2xl font-bold text-foreground">Personal Details</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === 'SELF'
              ? 'Please provide your basic information to begin'
              : 'Banker-assisted application'}
          </p>
        </div>
      </div>

      {/* Form Content - Desktop: centered fixed-width */}
      <div className="flex-1 px-4 pb-36 md:px-0">
        <div className="mx-auto w-full max-w-sm md:max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
            <MobileFormSection title="GENERAL DETAILS">
              <MobileFormCard className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MobileInput
                          {...field}
                          label="Full Name (As per NID)"
                          placeholder="Enter your full name"
                        />
                      </FormControl>
                      <FormMessage className="px-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nidNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MobileInput
                          {...field}
                          label="NID Number"
                          placeholder="10, 13, or 17 digit NID"
                          inputMode="numeric"
                          maxLength={17}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage className="px-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <MobileDateInput
                        label="Date of Birth"
                        placeholder="Select your date of birth"
                        value={field.value}
                        onChange={(date) => field.onChange(date?.toISOString() || '')}
                        minDate={minDateOfBirth}
                        maxDate={maxDateOfBirth}
                      />
                      <p className="text-xs text-muted-foreground px-1 mt-1">
                        You must be at least 18 years old
                      </p>
                      <FormMessage className="px-1" />
                    </FormItem>
                  )}
                />
              </MobileFormCard>
            </MobileFormSection>

            <MobileFormSection title="CONTACT DETAILS">
              <MobileFormCard className="space-y-4">
                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MobilePhoneInput
                          {...field}
                          label="Mobile Number"
                        />
                      </FormControl>
                      <FormMessage className="px-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MobileInput
                          {...field}
                          type="email"
                          label="Email Address"
                          placeholder="your.email@example.com"
                        />
                      </FormControl>
                      <FormMessage className="px-1" />
                    </FormItem>
                  )}
                />
              </MobileFormCard>
            </MobileFormSection>

            {/* Hidden submit button for form validation */}
            <button type="submit" className="hidden" />
          </form>
        </Form>
        </div>
      </div>

      {/* Bottom CTA - Desktop aligns to same card width */}
      <div className="fixed bottom-0 left-0 right-0 bg-mobile-background border-t border-border/50 px-5 py-5 safe-area-bottom shadow-lg">
        <div className="mx-auto w-full max-w-sm md:max-w-lg">
          <button
            type="button"
            onClick={form.handleSubmit(handleFormSubmit)}
            disabled={isSendingOtp || isLoading}
            className={cn(
              "w-full py-4 rounded-full text-base font-semibold transition-all",
              "bg-success hover:bg-success/90 text-success-foreground",
              "shadow-md hover:shadow-lg",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus:outline-none focus:ring-2 focus:ring-success/50 focus:ring-offset-2"
            )}
          >
            {isSendingOtp ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending OTP...
              </span>
            ) : mode === 'SELF' ? (
              'Send OTP & Proceed'
            ) : (
              'Proceed'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
