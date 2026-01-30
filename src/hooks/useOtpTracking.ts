/**
 * MTB Credit Card Application - OTP Tracking Hook
 * 
 * Manages OTP attempts with cooldown tracking and rate limiting.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as otpApi from '@/api/otp.api';
import type { OtpAttemptState } from '@/types/session.types';

interface UseOtpTrackingReturn {
  remainingAttempts: number;
  maxAttempts: number;
  isLocked: boolean;
  cooldownSeconds: number;
  isLoading: boolean;
  error: string | null;
  requestOtp: (mobileNumber: string) => Promise<boolean>;
  verifyOtp: (mobileNumber: string, otp: string) => Promise<boolean>;
  refreshStatus: (mobileNumber: string) => Promise<void>;
  resetError: () => void;
}

export function useOtpTracking(sessionId: string | null): UseOtpTrackingReturn {
  const [otpState, setOtpState] = useState<OtpAttemptState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer for cooldown
  useEffect(() => {
    if (cooldownSeconds > 0) {
      cooldownTimerRef.current = setTimeout(() => {
        setCooldownSeconds(prev => prev - 1);
      }, 1000);
    } else if (otpState?.isLocked) {
      // Cooldown expired, unlock
      setOtpState(prev => prev ? { ...prev, isLocked: false } : null);
    }

    return () => {
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
    };
  }, [cooldownSeconds, otpState?.isLocked]);

  const requestOtp = useCallback(async (mobileNumber: string): Promise<boolean> => {
    if (!sessionId) {
      setError('Session not initialized');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await otpApi.requestOtp(mobileNumber, sessionId);
      
      if (response.status === 200 && response.data) {
        setOtpState({
          mobileNumber,
          remainingAttempts: response.data.attempts_remaining,
          maxAttempts: 5,
          isLocked: false,
        });
        return true;
      } else if (response.status === 429) {
        // Rate limited
        const match = response.message.match(/(\d+) seconds/);
        if (match) {
          setCooldownSeconds(parseInt(match[1], 10));
          setOtpState(prev => prev ? { 
            ...prev, 
            isLocked: true,
            remainingAttempts: 0,
          } : {
            mobileNumber,
            remainingAttempts: 0,
            maxAttempts: 5,
            isLocked: true,
          });
        }
        setError(response.message);
        return false;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const verifyOtp = useCallback(async (mobileNumber: string, otp: string): Promise<boolean> => {
    if (!sessionId) {
      setError('Session not initialized');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await otpApi.verifyOtp(mobileNumber, otp, sessionId);
      
      if (response.status === 200 && response.data?.verified) {
        // Reset state on success
        setOtpState({
          mobileNumber,
          remainingAttempts: 5,
          maxAttempts: 5,
          isLocked: false,
        });
        setCooldownSeconds(0);
        return true;
      } else if (response.status === 429) {
        // Rate limited
        const match = response.message.match(/(\d+) seconds/);
        if (match) {
          setCooldownSeconds(parseInt(match[1], 10));
        }
        setOtpState(prev => prev ? { 
          ...prev, 
          isLocked: true,
          remainingAttempts: 0,
        } : null);
        setError(response.message);
        return false;
      } else {
        // Wrong OTP - extract remaining attempts
        const match = response.message.match(/(\d+) attempts? remaining/);
        if (match) {
          setOtpState(prev => prev ? { 
            ...prev, 
            remainingAttempts: parseInt(match[1], 10),
          } : null);
        }
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const refreshStatus = useCallback(async (mobileNumber: string): Promise<void> => {
    if (!sessionId) {
      return;
    }

    try {
      const response = await otpApi.getOtpStatus(mobileNumber, sessionId);
      
      if (response.status === 200 && response.data) {
        setOtpState(response.data);
        if (response.data.cooldownSeconds) {
          setCooldownSeconds(response.data.cooldownSeconds);
        }
      }
    } catch (err) {
      // Silently fail on refresh
    }
  }, [sessionId]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    remainingAttempts: otpState?.remainingAttempts ?? 5,
    maxAttempts: otpState?.maxAttempts ?? 5,
    isLocked: otpState?.isLocked ?? false,
    cooldownSeconds,
    isLoading,
    error,
    requestOtp,
    verifyOtp,
    refreshStatus,
    resetError,
  };
}
