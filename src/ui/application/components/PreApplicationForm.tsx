/**
 * MTB Credit Card Application - Pre-Application / Onboarding Form
 * Card-based design matching Resume Application page
 * Desktop: 2-column layout, Mobile: 1-column layout
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subYears } from 'date-fns';
import { motion } from 'framer-motion';
import { Loader2, CreditCard, User, ArrowLeft, Phone, Mail, Calendar, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { preApplicationSchema, type PreApplicationFormData } from '@/lib/validation-schemas';
import type { ApplicationMode } from '@/types/application-form.types';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ResumeDashboard } from './ResumeDashboard';
import { OtpVerificationScreen } from './OtpVerificationScreen';
import { ExistingApplicantSupplementary } from './ExistingApplicantSupplementary';
import { TailwindDatePicker } from '@/components/ui/tailwind-date-picker';

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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="mx-auto w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mb-4"
            >
              <CreditCard className="h-8 w-8 text-success" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground">Credit Card Application</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Start a new application or manage existing ones
            </p>
          </div>

          <div className="space-y-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
            </motion.div>
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

  // Main Form - Card-based design
  return (
    <div className="min-h-screen bg-mobile-background px-4 py-8">
      <div className="max-w-lg mx-auto space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Single Card with All Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="shadow-lg border-0">
                <CardHeader className="text-center pb-6">
                  <motion.div
                    className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <User className="h-8 w-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Personal Details</CardTitle>
                  <CardDescription className="text-base">
                    Please provide your basic information to begin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Full Name (As per NID)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your full name"
                            className="h-11"
                          />
                        </FormControl>
                        <FormDescription>Name must match your National ID</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="nidNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>NID Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="10, 13, or 17 digits"
                              inputMode="numeric"
                              maxLength={17}
                              className="h-11"
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel required>Date of Birth</FormLabel>
                          <TailwindDatePicker
                            value={field.value}
                            onChange={(date) => field.onChange(date?.toISOString() || '')}
                            minDate={minDateOfBirth}
                            maxDate={maxDateOfBirth}
                          />
                          <FormDescription className="text-xs">Must be 18+ years old</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Mobile Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="01XXXXXXXXX"
                              inputMode="tel"
                              maxLength={11}
                              className="h-11"
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>11 digits starting with 01</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="your.email@example.com"
                              className="h-11"
                            />
                          </FormControl>
                          <FormDescription>We'll send updates here</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons - Matching Resume Dashboard style */}
            <div className="space-y-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isSendingOtp || isLoading}
                  className={cn(
                    "w-full h-auto py-4 px-5 flex items-center justify-center gap-3",
                    "bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all"
                  )}
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6" />
                      </div>
                      <div className="text-left flex-1">
                        <span className="font-semibold block text-base">Send OTP & Proceed</span>
                        <span className="text-xs opacity-90">Verify your mobile number</span>
                      </div>
                    </>
                  )}
                </Button>
              </motion.div>

              <Button
                type="button"
                onClick={() => setApplicationType(null)}
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
