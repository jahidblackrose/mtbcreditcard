/**
 * MTB Credit Card Application - Pre-Application / Onboarding Form
 * Mobile Banking App Style
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, subYears } from 'date-fns';
import { CalendarIcon, Loader2, CreditCard, Shield, User, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { preApplicationSchema, type PreApplicationFormData } from '@/lib/validation-schemas';
import type { ApplicationMode } from '@/types/application-form.types';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { ResumeDashboard } from './ResumeDashboard';
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
  const [applicationType, setApplicationType] = useState<'new' | 'resume' | null>(mode === 'ASSISTED' ? 'new' : null);
  const [showOtp, setShowOtp] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [isLocked, setIsLocked] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

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

  // Resend countdown timer
  useEffect(() => {
    if (showOtp && !canResend) {
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showOtp, canResend]);

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
      setResendCooldown(120);
      setCanResend(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setOtpError(null);
    setIsSendingOtp(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSendingOtp(false);
    setResendCooldown(120);
    setCanResend(false);
  };

  const handleVerifyOtp = async () => {
    setIsVerifyingOtp(true);
    setOtpError(null);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (otpValue === '123456') {
      onOtpVerified();
    } else {
      const newAttempts = remainingAttempts - 1;
      setRemainingAttempts(newAttempts);
      
      if (newAttempts <= 0) {
        setIsLocked(true);
        setCooldownSeconds(30);
        setOtpError('Too many attempts. Please wait 30 seconds.');
        const interval = setInterval(() => {
          setCooldownSeconds(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsLocked(false);
              setRemainingAttempts(5);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setOtpError(`Invalid OTP. ${newAttempts} attempts remaining.`);
      }
    }
    
    setIsVerifyingOtp(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        onSupplementaryOnly={onSupplementaryOnly!}
        onCheckStatus={onCheckStatus!}
        onBack={() => setApplicationType(null)}
        isLoading={isLoading}
      />
    );
  }

  // OTP Verification Screen
  if (showOtp) {
    return (
      <div className="min-h-screen bg-mobile-background flex flex-col">
        {/* Top Bar */}
        <div className="sticky top-0 z-50 bg-mobile-background px-4 py-3 safe-area-top">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowOtp(false)}
              className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <span className="text-base font-medium">Verify OTP</span>
          </div>
        </div>

        <div className="flex-1 px-4 pt-6">
          <div className="max-w-md mx-auto text-center">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-success" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Verify Your Mobile
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              We've sent a 6-digit OTP to {form.getValues('mobileNumber')}
            </p>

            {/* Countdown Timer */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-muted rounded-full px-4 py-2">
                <span className="text-sm text-muted-foreground">Time remaining:</span>
                <span className="font-mono font-semibold text-foreground">{formatTime(resendCooldown)}</span>
              </div>
            </div>

            {/* Attempt Indicator */}
            {remainingAttempts < 5 && !isLocked && (
              <div className={cn(
                "flex items-center justify-center gap-2 text-sm mb-4",
                remainingAttempts <= 2 ? "text-destructive" : "text-warning"
              )}>
                <Shield className="h-4 w-4" />
                <span>{remainingAttempts} attempts remaining</span>
              </div>
            )}

            {isLocked ? (
              <MobileFormCard className="mb-6">
                <div className="text-center py-4">
                  <p className="text-sm font-medium text-destructive">Too many attempts</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please wait <span className="font-mono font-semibold">{cooldownSeconds}s</span> before trying again
                  </p>
                </div>
              </MobileFormCard>
            ) : (
              <>
                <div className="flex justify-center mb-6">
                  <InputOTP
                    maxLength={6}
                    value={otpValue}
                    onChange={(value) => {
                      setOtpValue(value);
                      setOtpError(null);
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-12 h-14 text-lg" />
                      <InputOTPSlot index={1} className="w-12 h-14 text-lg" />
                      <InputOTPSlot index={2} className="w-12 h-14 text-lg" />
                      <InputOTPSlot index={3} className="w-12 h-14 text-lg" />
                      <InputOTPSlot index={4} className="w-12 h-14 text-lg" />
                      <InputOTPSlot index={5} className="w-12 h-14 text-lg" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                
                {otpError && (
                  <p className="text-sm text-destructive text-center mb-4">{otpError}</p>
                )}
                
                <p className="text-xs text-muted-foreground text-center mb-6">
                  For demo: use OTP <span className="font-mono font-bold">123456</span>
                </p>
              </>
            )}

            {/* Resend Button */}
            <div className="text-center mb-6">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || isSendingOtp}
                className={cn(
                  "text-sm font-medium transition-colors",
                  canResend 
                    ? "text-success hover:underline" 
                    : "text-muted-foreground cursor-not-allowed"
                )}
              >
                {isSendingOtp ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </span>
                ) : canResend ? (
                  "Resend OTP"
                ) : (
                  `Resend in ${formatTime(resendCooldown)}`
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="sticky bottom-0 bg-mobile-background border-t border-border px-4 py-4 safe-area-bottom">
          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={otpValue.length !== 6 || isVerifyingOtp || isLocked}
            className="w-full py-4 rounded-full text-base font-semibold transition-all mobile-cta-button disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            {isVerifyingOtp ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Verifying...
              </span>
            ) : (
              'Verify & Continue'
            )}
          </button>
        </div>
      </div>
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
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-foreground">
          Personal Details
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === 'SELF' 
            ? 'Please provide your basic information to begin'
            : 'Banker-assisted application'}
        </p>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-4 pb-32">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
                          placeholder="1XXXXXXXXX"
                          maxLength={10}
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

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-mobile-background border-t border-border px-4 py-4 safe-area-bottom">
        <button
          type="button"
          onClick={form.handleSubmit(handleFormSubmit)}
          disabled={isSendingOtp || isLoading}
          className="w-full py-4 rounded-full text-base font-semibold transition-all mobile-cta-button disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2"
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
  );
}
