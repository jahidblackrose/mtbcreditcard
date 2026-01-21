/**
 * MTB Credit Card Application - Pre-Application / Onboarding Form
 * 
 * Collects initial information and handles OTP verification for Self mode.
 * Supports new applicant and resume existing application flows via dashboard.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, subYears } from 'date-fns';
import { CalendarIcon, Loader2, Mail, Phone, User, CreditCard, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { preApplicationSchema, type PreApplicationFormData } from '@/lib/validation-schemas';
import type { ApplicationMode } from '@/types/application-form.types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResumeDashboard } from './ResumeDashboard';

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
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [isLocked, setIsLocked] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Calculate the maximum allowed date (18 years ago from today)
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

  const isFormValid = form.formState.isValid;

  const handleFormSubmit = async (data: PreApplicationFormData) => {
    if (mode === 'ASSISTED') {
      // Assisted mode bypasses OTP
      onSubmit(data);
      onOtpVerified();
    } else {
      // Self mode requires OTP
      onSubmit(data);
      setIsSendingOtp(true);
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSendingOtp(false);
      setShowOtp(true);
    }
  };

  const handleResendOtp = async () => {
    setOtpError(null);
    setIsSendingOtp(true);
    // Simulate resend
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSendingOtp(false);
  };

  const handleVerifyOtp = async () => {
    setIsVerifyingOtp(true);
    setOtpError(null);
    
    // Mock verification
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
        // Start countdown
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

  const handleResumeFromDashboard = (mobileNumber: string) => {
    onResumeApplication?.(mobileNumber);
  };

  const handleSupplementaryOnly = () => {
    onSupplementaryOnly?.();
  };

  const handleCheckStatus = (referenceNumber: string) => {
    onCheckStatus?.(referenceNumber);
  };

  // Application type selection for Self mode
  if (mode === 'SELF' && applicationType === null) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Credit Card Application</CardTitle>
          <CardDescription>
            Start a new application or manage existing ones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setApplicationType('new')}
            className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-primary hover:bg-primary/90"
            size="lg"
          >
            <CreditCard className="h-6 w-6" />
            <span className="font-semibold">New Application</span>
            <span className="text-xs opacity-90">Start a fresh credit card application</span>
          </Button>
          
          <Button
            onClick={() => setApplicationType('resume')}
            variant="outline"
            className="w-full h-auto py-4 flex flex-col items-center gap-2 border-primary text-primary hover:bg-primary/5"
            size="lg"
          >
            <User className="h-6 w-6" />
            <span className="font-semibold">Existing Applicant</span>
            <span className="text-xs text-muted-foreground">Resume, add supplementary, or check status</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Resume Dashboard for existing applicants
  if (applicationType === 'resume') {
    return (
      <ResumeDashboard
        onResumeApplication={handleResumeFromDashboard}
        onSupplementaryOnly={handleSupplementaryOnly}
        onCheckStatus={handleCheckStatus}
        onBack={() => setApplicationType(null)}
        isLoading={isLoading}
      />
    );
  }

  if (showOtp) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Verify Your Mobile Number</CardTitle>
          <CardDescription>
            We've sent a 6-digit OTP to {form.getValues('mobileNumber')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Attempt Indicator */}
          {remainingAttempts < 5 && !isLocked && (
            <div className={cn(
              "flex items-center gap-2 text-sm",
              remainingAttempts <= 2 ? "text-destructive" : "text-warning"
            )}>
              <Shield className="h-4 w-4" />
              <span>{remainingAttempts} attempts remaining</span>
            </div>
          )}

          {isLocked ? (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">Too many attempts</p>
                <p className="text-xs text-muted-foreground">
                  Please wait <span className="font-mono font-semibold">{cooldownSeconds}s</span> before trying again
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={(value) => {
                    setOtpValue(value);
                    setOtpError(null);
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              {otpError && (
                <p className="text-sm text-destructive text-center">{otpError}</p>
              )}
              
              <p className="text-xs text-muted-foreground text-center">
                For demo: use OTP <span className="font-mono font-bold">123456</span>
              </p>
              
              <Button
                onClick={handleVerifyOtp}
                disabled={otpValue.length !== 6 || isVerifyingOtp}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSendingOtp}
                  className="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingOtp ? 'Sending...' : "Didn't receive OTP? Resend"}
                </button>
              </div>
            </>
          )}
          
          <Button
            variant="ghost"
            onClick={() => setShowOtp(false)}
            className="w-full"
          >
            ← Back to form
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">
          {applicationType === 'new' ? 'New Application' : 'Start Your Application'}
        </CardTitle>
        <CardDescription>
          {mode === 'SELF' 
            ? 'Please provide your basic information to begin. OTP verification required.'
            : 'Banker-assisted application. OTP verification not required.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name (As per NID)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter your full name"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* NID Number */}
            <FormField
              control={form.control}
              name="nidNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NID Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="10, 13, or 17 digit NID"
                      maxLength={17}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your 10, 13, or 17 digit National ID number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), 'PPP')
                          ) : (
                            <span>Pick your date of birth</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          field.onChange(date?.toISOString() || '');
                          setDatePickerOpen(false);
                        }}
                        disabled={(date) =>
                          date > maxDateOfBirth || date < minDateOfBirth
                        }
                        defaultMonth={field.value ? new Date(field.value) : maxDateOfBirth}
                        fromYear={1940}
                        toYear={maxDateOfBirth.getFullYear()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    You must be at least 18 years old to apply
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mobile Number */}
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="01XXXXXXXXX"
                        className="pl-10"
                        maxLength={11}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    11-digit mobile number starting with 01
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
              disabled={!isFormValid || isLoading || isSendingOtp}
            >
              {isLoading || isSendingOtp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : mode === 'SELF' ? (
                'Send OTP & Continue'
              ) : (
                'Start Application'
              )}
            </Button>

            {mode === 'SELF' && applicationType === 'new' && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setApplicationType(null)}
              >
                ← Back
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
