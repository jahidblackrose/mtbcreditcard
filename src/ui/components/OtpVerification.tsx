/**
 * MTB Credit Card Application - OTP Verification Component
 * 
 * Features 2-minute countdown timer with resend functionality.
 * Bank-grade secure feel with attempt tracking.
 */

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Shield, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { toast } from 'sonner';

interface OtpVerificationProps {
  mobileNumber: string;
  onVerify: () => void;
  onBack: () => void;
  onResend: () => Promise<void>;
}

const OTP_TIMER_SECONDS = 120; // 2 minutes
const MAX_ATTEMPTS = 5;
const COOLDOWN_SECONDS = 30;

export function OtpVerification({
  mobileNumber,
  onVerify,
  onBack,
  onResend,
}: OtpVerificationProps) {
  const [otpValue, setOtpValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  
  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(OTP_TIMER_SECONDS);
  const [canResend, setCanResend] = useState(false);
  
  // Attempt tracking
  const [remainingAttempts, setRemainingAttempts] = useState(MAX_ATTEMPTS);
  const [isLocked, setIsLocked] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Countdown timer effect
  useEffect(() => {
    if (timerSeconds <= 0) {
      setCanResend(true);
      return;
    }
    
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timerSeconds]);
  
  // Cooldown timer effect
  useEffect(() => {
    if (cooldownSeconds <= 0 || !isLocked) return;
    
    const interval = setInterval(() => {
      setCooldownSeconds(prev => {
        if (prev <= 1) {
          setIsLocked(false);
          setRemainingAttempts(MAX_ATTEMPTS);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [cooldownSeconds, isLocked]);
  
  const handleResend = useCallback(async () => {
    if (!canResend || isResending) return;
    
    setIsResending(true);
    setOtpError(null);
    
    try {
      await onResend();
      // Reset timer
      setTimerSeconds(OTP_TIMER_SECONDS);
      setCanResend(false);
      setOtpValue('');
      toast.success('OTP sent successfully', {
        description: `A new OTP has been sent to ${mobileNumber}`,
      });
    } catch (error) {
      toast.error('Failed to resend OTP', {
        description: 'Please try again in a moment.',
      });
    } finally {
      setIsResending(false);
    }
  }, [canResend, isResending, mobileNumber, onResend]);
  
  const handleVerify = async () => {
    if (otpValue.length !== 6 || isVerifying || isLocked) return;
    
    setIsVerifying(true);
    setOtpError(null);
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock verification - accept 123456
    if (otpValue === '123456') {
      toast.success('OTP verified successfully');
      onVerify();
    } else {
      const newAttempts = remainingAttempts - 1;
      setRemainingAttempts(newAttempts);
      
      if (newAttempts <= 0) {
        setIsLocked(true);
        setCooldownSeconds(COOLDOWN_SECONDS);
        setOtpError(`Too many attempts. Please wait ${COOLDOWN_SECONDS} seconds.`);
      } else {
        setOtpError(`Invalid OTP. ${newAttempts} attempt${newAttempts > 1 ? 's' : ''} remaining.`);
      }
      setOtpValue('');
    }
    
    setIsVerifying(false);
  };
  
  // Mask mobile number
  const maskedMobile = mobileNumber.slice(0, 3) + '****' + mobileNumber.slice(-4);
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Verify Your Mobile Number</CardTitle>
        <CardDescription>
          We've sent a 6-digit OTP to <span className="font-medium text-foreground">{maskedMobile}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Timer display */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {timerSeconds > 0 ? (
            <span className="text-muted-foreground">
              OTP expires in <span className="font-mono font-semibold text-foreground">{formatTime(timerSeconds)}</span>
            </span>
          ) : (
            <span className="text-warning font-medium">OTP expired. Please resend.</span>
          )}
        </div>
        
        {/* Locked state */}
        {isLocked ? (
          <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">Too many attempts</p>
              <p className="text-xs text-muted-foreground">
                Please wait <span className="font-mono font-semibold">{cooldownSeconds}s</span> before trying again
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Attempt indicator */}
            {remainingAttempts < MAX_ATTEMPTS && (
              <div className={cn(
                "flex items-center gap-2 text-sm rounded-lg p-2",
                remainingAttempts <= 2 ? "text-destructive bg-destructive/5" : "text-warning bg-warning/5"
              )}>
                <AlertCircle className="h-4 w-4" />
                <span>{remainingAttempts} attempt{remainingAttempts > 1 ? 's' : ''} remaining</span>
              </div>
            )}
            
            {/* OTP Input */}
            <div className="flex flex-col items-center gap-4">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => {
                  setOtpValue(value);
                  setOtpError(null);
                }}
                disabled={isLocked}
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
              
              {otpError && (
                <p className="text-sm text-destructive text-center">{otpError}</p>
              )}
            </div>
            
            {/* Demo hint */}
            <p className="text-xs text-muted-foreground text-center">
              For demo: use OTP <span className="font-mono font-bold bg-muted px-1.5 py-0.5 rounded">123456</span>
            </p>
            
            {/* Verify button */}
            <Button
              onClick={handleVerify}
              disabled={otpValue.length !== 6 || isVerifying || isLocked || timerSeconds === 0}
              className="w-full"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Continue'
              )}
            </Button>
            
            {/* Resend section */}
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResend}
                disabled={!canResend || isResending}
                className={cn(
                  "text-sm",
                  canResend ? "text-primary hover:text-primary/80" : "text-muted-foreground"
                )}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-3 w-3" />
                    {canResend ? 'Resend OTP' : `Resend in ${formatTime(timerSeconds)}`}
                  </>
                )}
              </Button>
            </div>
          </>
        )}
        
        {/* Back button */}
        <Button variant="ghost" onClick={onBack} className="w-full">
          ← Back to form
        </Button>
      </CardContent>
    </Card>
  );
}