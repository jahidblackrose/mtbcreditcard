/**
 * OTP Verification Screen
 * Clean, mobile-first OTP verification UI
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Loader2, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

interface OtpVerificationScreenProps {
  mobileNumber: string;
  onVerify: () => void;
  onBack: () => void;
  onResend: () => Promise<void>;
}

export function OtpVerificationScreen({
  mobileNumber,
  onVerify,
  onBack,
  onResend,
}: OtpVerificationScreenProps) {
  const [otpValue, setOtpValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [resendTimer, setResendTimer] = useState(120);

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds > 0) {
      const timer = setInterval(() => {
        setLockoutSeconds((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setRemainingAttempts(5);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    if (otpValue.length !== 6 || isLocked) return;
    
    setIsVerifying(true);
    setError(null);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock verification - use 123456 for success
    if (otpValue === '123456') {
      onVerify();
    } else {
      const newAttempts = remainingAttempts - 1;
      setRemainingAttempts(newAttempts);
      
      if (newAttempts <= 0) {
        setIsLocked(true);
        setLockoutSeconds(30);
        setError('Too many failed attempts');
      } else {
        setError(`Invalid OTP. ${newAttempts} attempt${newAttempts === 1 ? '' : 's'} remaining.`);
      }
      setOtpValue('');
    }
    
    setIsVerifying(false);
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isSending) return;
    
    setIsSending(true);
    setError(null);
    
    try {
      await onResend();
      setResendTimer(120);
      setOtpValue('');
    } catch {
      setError('Failed to resend OTP. Please try again.');
    }
    
    setIsSending(false);
  };

  const canResend = resendTimer === 0 && !isSending;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* MTB Gradient Bar */}
      <div className="h-1.5 mtb-gradient-bar" />
      
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center h-14 px-4">
          <button
            type="button"
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="ml-3 text-base font-medium">Verify Mobile</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-8">
        {/* Desktop: centered fixed-width card like Registration */}
        <div className="mx-auto w-full max-w-sm md:max-w-lg">
          <div className="md:bg-card md:border md:border-border md:rounded-2xl md:p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-success" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Enter Verification Code
            </h1>
            <p className="text-sm text-muted-foreground">
              We sent a 6-digit code to <span className="font-medium">{mobileNumber}</span>
            </p>
          </div>

          {/* Timer Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Code expires in</span>
              <span className="font-mono font-semibold text-foreground">
                {formatTime(resendTimer)}
              </span>
            </div>
          </div>

          {/* Locked State */}
          {isLocked ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Too many attempts</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please wait{' '}
                    <span className="font-mono font-semibold">{lockoutSeconds}s</span>{' '}
                    before trying again
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* OTP Input */}
              <div className="flex justify-center mb-4">
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={(value) => {
                    setOtpValue(value);
                    setError(null);
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

              {/* Error Message */}
              {error && (
                <div className="flex items-center justify-center gap-2 text-destructive text-sm mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Remaining Attempts Warning */}
              {remainingAttempts < 5 && remainingAttempts > 0 && !error && (
                <div className={cn(
                  "flex items-center justify-center gap-2 text-sm mb-4",
                  remainingAttempts <= 2 ? "text-destructive" : "text-warning"
                )}>
                  <AlertCircle className="h-4 w-4" />
                  <span>{remainingAttempts} attempt{remainingAttempts === 1 ? '' : 's'} remaining</span>
                </div>
              )}

              {/* Demo Hint */}
              <p className="text-xs text-center text-muted-foreground mb-6">
                Demo: use code <span className="font-mono font-bold bg-muted px-1.5 py-0.5 rounded">123456</span>
              </p>
            </>
          )}

          {/* Resend Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className={cn(
                "text-sm font-medium transition-colors",
                canResend
                  ? "text-success hover:text-success/80"
                  : "text-muted-foreground cursor-not-allowed"
              )}
            >
              {isSending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </span>
              ) : canResend ? (
                "Resend Code"
              ) : (
                `Resend in ${formatTime(resendTimer)}`
              )}
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="sticky bottom-0 bg-background border-t border-border px-4 py-4 safe-area-bottom">
        <button
          type="button"
          onClick={handleVerify}
          disabled={otpValue.length !== 6 || isVerifying || isLocked}
          className={cn(
            "w-full py-4 rounded-full font-semibold text-base",
            "bg-success text-success-foreground",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2"
          )}
        >
          {isVerifying ? (
            <span className="inline-flex items-center justify-center gap-2">
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
