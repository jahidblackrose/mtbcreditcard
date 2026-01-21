/**
 * MTB Credit Card Application - Pre-Application / Onboarding Form
 * 
 * Collects initial information and handles OTP verification for Self mode.
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

interface PreApplicationFormProps {
  mode: ApplicationMode;
  initialData?: Partial<PreApplicationFormData>;
  onSubmit: (data: PreApplicationFormData) => void;
  onOtpVerified: () => void;
  isLoading?: boolean;
}

export function PreApplicationForm({
  mode,
  initialData,
  onSubmit,
  onOtpVerified,
  isLoading = false,
}: PreApplicationFormProps) {
  const [showOtp, setShowOtp] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

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
      setShowOtp(true);
      setOtpSent(true);
      // In real implementation, this would trigger OTP sending via API
    }
  };

  const handleResendOtp = async () => {
    setOtpError(null);
    setOtpSent(true);
    // Mock resend - in real implementation, call API
  };

  const handleVerifyOtp = async () => {
    setIsVerifyingOtp(true);
    setOtpError(null);
    
    // Mock verification - in real implementation, call API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (otpValue === '123456') {
      onOtpVerified();
    } else {
      setOtpError('Invalid OTP. Please try again.');
    }
    
    setIsVerifyingOtp(false);
  };

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
            className="w-full"
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
              className="text-sm text-primary hover:underline"
            >
              Didn't receive OTP? Resend
            </button>
          </div>
          
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
        <CardTitle className="text-2xl">Start Your Application</CardTitle>
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

            {/* Mode Indicator */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  mode === 'SELF' ? 'bg-primary/10' : 'bg-success/10'
                )}>
                  <Shield className={cn(
                    'h-4 w-4',
                    mode === 'SELF' ? 'text-primary' : 'text-success'
                  )} />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {mode === 'SELF' ? 'Self Application Mode' : 'Assisted Mode'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {mode === 'SELF'
                      ? 'OTP verification will be required'
                      : 'Banker-assisted, no OTP required'}
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
