/**
 * OTP Verification Screen
 * Card-based design matching Resume Application page
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Loader2, AlertCircle, Clock, ArrowLeft, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-mobile-background px-4 py-8">
      <div className="max-w-lg mx-auto space-y-6">
        {/* OTP Card */}
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
                <Shield className="h-8 w-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-gray-900">Verify Mobile</CardTitle>
              <CardDescription className="text-base">
                We sent a 6-digit code to <span className="font-semibold text-gray-900">{mobileNumber}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timer Badge */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-900">Code expires in</span>
                  <span className="font-mono font-semibold text-blue-900">
                    {formatTime(resendTimer)}
                  </span>
                </div>
              </div>

              {/* Locked State */}
              {isLocked ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-900">Too many attempts</p>
                      <p className="text-sm text-red-700 mt-1">
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
                  <div className="flex justify-center">
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
                    <div className="flex items-center justify-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span className="text-center">{error}</span>
                    </div>
                  )}

                  {/* Remaining Attempts Warning */}
                  {remainingAttempts < 5 && remainingAttempts > 0 && !error && (
                    <div className={cn(
                      "flex items-center justify-center gap-2 text-sm bg-amber-50 p-3 rounded-lg",
                      remainingAttempts <= 2 ? "text-red-600" : "text-amber-600"
                    )}>
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{remainingAttempts} attempt{remainingAttempts === 1 ? '' : 's'} remaining</span>
                    </div>
                  )}

                  {/* Demo Hint */}
                  <div className="text-center bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">
                      Demo: use code <span className="font-mono font-bold bg-white px-2 py-1 rounded border">123456</span>
                    </p>
                  </div>
                </>
              )}

              {/* Resend Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    canResend
                      ? "text-blue-600 hover:text-blue-700 underline"
                      : "text-gray-400 cursor-not-allowed"
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              onClick={handleVerify}
              disabled={otpValue.length !== 6 || isVerifying || isLocked}
              className={cn(
                "w-full h-auto py-4 px-5 flex items-center justify-center gap-3",
                "bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="text-left flex-1">
                    <span className="font-semibold block text-base">Verify & Continue</span>
                    <span className="text-xs opacity-90">Confirm your mobile number</span>
                  </div>
                </>
              )}
            </Button>
          </motion.div>

          <Button
            type="button"
            onClick={onBack}
            variant="ghost"
            className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Previous
          </Button>
        </div>
      </div>
    </div>
  );
}
