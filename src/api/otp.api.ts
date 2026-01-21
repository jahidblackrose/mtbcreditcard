/**
 * MTB Credit Card Application - OTP API
 * 
 * API adapter for Redis-backed OTP tracking.
 * Handles OTP requests, verification, and attempt tracking.
 */

import { env } from '@/config';
import { http } from './httpClient';
import type { ApiResponse } from '@/types';
import type { OtpAttemptState } from '@/types/session.types';

// ============================================
// MOCK DATA
// ============================================

let mockOtpState: OtpAttemptState | null = null;
const MAX_ATTEMPTS = 5;
const COOLDOWN_SECONDS = 30;

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Requests OTP to be sent
 */
export async function requestOtp(
  mobileNumber: string,
  sessionId: string
): Promise<ApiResponse<{ expiresIn: number; remainingAttempts: number }>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Validate mobile number format
    if (!mobileNumber || !/^01[3-9]\d{8}$/.test(mobileNumber)) {
      return {
        status: 400,
        message: 'Please enter a valid Bangladesh mobile number',
      };
    }

    // Check if locked
    if (mockOtpState?.isLocked && mockOtpState.lockExpiresAt) {
      const lockExpiry = new Date(mockOtpState.lockExpiresAt);
      if (lockExpiry > new Date()) {
        const cooldownSeconds = Math.ceil((lockExpiry.getTime() - Date.now()) / 1000);
        return {
          status: 429,
          message: `Too many attempts. Please wait ${cooldownSeconds} seconds.`,
        };
      }
      // Lock expired, reset state
      mockOtpState = null;
    }

    // Initialize or update OTP state
    if (!mockOtpState || mockOtpState.mobileNumber !== mobileNumber) {
      mockOtpState = {
        mobileNumber,
        remainingAttempts: MAX_ATTEMPTS,
        maxAttempts: MAX_ATTEMPTS,
        isLocked: false,
        lastAttemptAt: new Date().toISOString(),
      };
    }

    return {
      status: 200,
      message: 'OTP sent successfully to your mobile number',
      data: {
        expiresIn: 300, // 5 minutes
        remainingAttempts: mockOtpState.remainingAttempts,
      },
    };
  }

  return http.post('/otp/request', { mobileNumber, sessionId });
}

/**
 * Verifies OTP
 */
export async function verifyOtp(
  mobileNumber: string,
  otp: string,
  sessionId: string
): Promise<ApiResponse<{ verified: boolean; userId?: string }>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Check if locked
    if (mockOtpState?.isLocked && mockOtpState.lockExpiresAt) {
      const lockExpiry = new Date(mockOtpState.lockExpiresAt);
      if (lockExpiry > new Date()) {
        const cooldownSeconds = Math.ceil((lockExpiry.getTime() - Date.now()) / 1000);
        return {
          status: 429,
          message: `Too many attempts. Please wait ${cooldownSeconds} seconds.`,
        };
      }
    }

    // Demo OTP: 123456
    if (otp === '123456') {
      // Reset attempts on success
      if (mockOtpState) {
        mockOtpState.remainingAttempts = MAX_ATTEMPTS;
        mockOtpState.isLocked = false;
      }
      
      return {
        status: 200,
        message: 'OTP verified successfully',
        data: {
          verified: true,
          userId: crypto.randomUUID(),
        },
      };
    }

    // Wrong OTP - decrement attempts
    if (mockOtpState) {
      mockOtpState.remainingAttempts -= 1;
      mockOtpState.lastAttemptAt = new Date().toISOString();

      if (mockOtpState.remainingAttempts <= 0) {
        mockOtpState.isLocked = true;
        mockOtpState.lockExpiresAt = new Date(Date.now() + COOLDOWN_SECONDS * 1000).toISOString();
        mockOtpState.cooldownSeconds = COOLDOWN_SECONDS;
        
        return {
          status: 429,
          message: `Too many failed attempts. Please wait ${COOLDOWN_SECONDS} seconds.`,
        };
      }
    }

    return {
      status: 401,
      message: `Invalid OTP. ${mockOtpState?.remainingAttempts || 0} attempts remaining.`,
    };
  }

  return http.post('/otp/verify', { mobileNumber, otp, sessionId });
}

/**
 * Gets OTP attempt status
 */
export async function getOtpStatus(
  mobileNumber: string,
  sessionId: string
): Promise<ApiResponse<OtpAttemptState>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    if (!mockOtpState || mockOtpState.mobileNumber !== mobileNumber) {
      return {
        status: 200,
        message: 'OTP status retrieved',
        data: {
          mobileNumber,
          remainingAttempts: MAX_ATTEMPTS,
          maxAttempts: MAX_ATTEMPTS,
          isLocked: false,
        },
      };
    }

    // Update cooldown if locked
    if (mockOtpState.isLocked && mockOtpState.lockExpiresAt) {
      const lockExpiry = new Date(mockOtpState.lockExpiresAt);
      if (lockExpiry > new Date()) {
        mockOtpState.cooldownSeconds = Math.ceil((lockExpiry.getTime() - Date.now()) / 1000);
      } else {
        // Lock expired
        mockOtpState.isLocked = false;
        mockOtpState.remainingAttempts = MAX_ATTEMPTS;
        mockOtpState.cooldownSeconds = undefined;
        mockOtpState.lockExpiresAt = undefined;
      }
    }

    return {
      status: 200,
      message: 'OTP status retrieved',
      data: mockOtpState,
    };
  }

  return http.get(`/otp/status?mobileNumber=${encodeURIComponent(mobileNumber)}&sessionId=${sessionId}`);
}
