/**
 * MTB Credit Card Application - OTP API
 * 
 * API adapter for Redis-backed OTP tracking.
 * Handles OTP requests, verification, and attempt tracking.
 * 
 * MOCK data structures match real API contracts exactly.
 */

import { env } from '@/config';
import { http } from './httpClient';
import type { ApiResponse } from '@/types';
import type { OtpAttemptState } from '@/types/session.types';

// ============================================
// MOCK DATA STORE (matches real API contract)
// ============================================

interface MockOtpEntry {
  otp: string;
  mobile_number: string;
  expires_at: number;
  attempts_remaining: number;
  max_attempts: number;
  is_locked: boolean;
  lock_expires_at?: number;
  created_at: string;
}

const mockOtpStore: Record<string, MockOtpEntry> = {};
const MAX_ATTEMPTS = 5;
const OTP_EXPIRY_MS = 300000; // 5 minutes
const LOCK_DURATION_MS = 30000; // 30 seconds

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function maskMobileNumber(mobile: string): string {
  if (mobile.length < 11) return mobile;
  return mobile.substring(0, 4) + '******' + mobile.substring(10);
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Requests OTP to be sent
 * Real API: POST /auth/otp/request
 */
export async function requestOtp(
  mobileNumber: string,
  sessionId: string
): Promise<ApiResponse<{ 
  otp_sent: boolean; 
  expires_in: number; 
  mobile_number: string;
  attempts_remaining: number;
}>> {
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
    const existing = mockOtpStore[mobileNumber];
    if (existing?.is_locked && existing.lock_expires_at) {
      if (Date.now() < existing.lock_expires_at) {
        const cooldownSeconds = Math.ceil((existing.lock_expires_at - Date.now()) / 1000);
        return {
          status: 429,
          message: `Too many attempts. Please wait ${cooldownSeconds} seconds.`,
        };
      }
      // Lock expired, allow new OTP
      delete mockOtpStore[mobileNumber];
    }

    // Generate new OTP
    const otp = generateOtp();
    mockOtpStore[mobileNumber] = {
      otp,
      mobile_number: mobileNumber,
      expires_at: Date.now() + OTP_EXPIRY_MS,
      attempts_remaining: MAX_ATTEMPTS,
      max_attempts: MAX_ATTEMPTS,
      is_locked: false,
      created_at: new Date().toISOString(),
    };

    // Log OTP in dev mode for testing
    console.log(`[MOCK OTP] ${mobileNumber}: ${otp}`);

    return {
      status: 200,
      message: 'OTP sent successfully to your mobile number',
      data: {
        otp_sent: true,
        expires_in: 300,
        mobile_number: maskMobileNumber(mobileNumber),
        attempts_remaining: MAX_ATTEMPTS,
      },
    };
  }

  return http.post('/auth/otp/request', { 
    mobile_number: mobileNumber, 
    session_id: sessionId 
  });
}

/**
 * Verifies OTP
 * Real API: POST /auth/otp/verify
 */
export async function verifyOtp(
  mobileNumber: string,
  otp: string,
  sessionId: string
): Promise<ApiResponse<{ 
  verified: boolean; 
  session_id?: string;
  user_exists?: boolean;
  has_pending_applications?: boolean;
  applicant_id?: string;
  attempts_remaining?: number;
  locked?: boolean;
}>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const stored = mockOtpStore[mobileNumber];
    
    // No OTP found
    if (!stored) {
      return {
        status: 400,
        message: 'OTP not found. Please request a new OTP.',
        data: { verified: false },
      };
    }

    // Check if locked
    if (stored.is_locked && stored.lock_expires_at) {
      if (Date.now() < stored.lock_expires_at) {
        const cooldownSeconds = Math.ceil((stored.lock_expires_at - Date.now()) / 1000);
        return {
          status: 429,
          message: `Account temporarily locked. Please wait ${cooldownSeconds} seconds.`,
          data: { verified: false, locked: true },
        };
      }
    }

    // OTP expired
    if (Date.now() > stored.expires_at) {
      delete mockOtpStore[mobileNumber];
      return {
        status: 400,
        message: 'OTP has expired. Please request a new OTP.',
        data: { verified: false },
      };
    }

    // Correct OTP
    if (stored.otp === otp) {
      delete mockOtpStore[mobileNumber];
      
      // Check if user has existing applications (mock logic)
      const userExists = ['01712345678', '01812345678'].includes(mobileNumber);
      const hasPendingApps = mobileNumber === '01712345678';
      
      return {
        status: 200,
        message: 'OTP verified successfully',
        data: {
          verified: true,
          session_id: sessionId,
          user_exists: userExists,
          has_pending_applications: hasPendingApps,
          applicant_id: userExists ? `APL_${mobileNumber}` : undefined,
        },
      };
    }

    // Wrong OTP - decrement attempts
    stored.attempts_remaining -= 1;

    if (stored.attempts_remaining <= 0) {
      stored.is_locked = true;
      stored.lock_expires_at = Date.now() + LOCK_DURATION_MS;
      
      return {
        status: 429,
        message: `Too many failed attempts. Please wait 30 seconds.`,
        data: { 
          verified: false, 
          locked: true,
          attempts_remaining: 0,
        },
      };
    }

    return {
      status: 400,
      message: `Invalid OTP. ${stored.attempts_remaining} attempts remaining.`,
      data: { 
        verified: false,
        attempts_remaining: stored.attempts_remaining,
      },
    };
  }

  return http.post('/auth/otp/verify', { 
    mobile_number: mobileNumber, 
    otp, 
    session_id: sessionId 
  });
}

/**
 * Resends OTP
 * Real API: POST /auth/otp/resend
 */
export async function resendOtp(
  mobileNumber: string,
  sessionId: string
): Promise<ApiResponse<{ 
  otp_sent: boolean; 
  expires_in: number;
  attempts_remaining: number;
}>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if locked
    const existing = mockOtpStore[mobileNumber];
    if (existing?.is_locked && existing.lock_expires_at) {
      if (Date.now() < existing.lock_expires_at) {
        const cooldownSeconds = Math.ceil((existing.lock_expires_at - Date.now()) / 1000);
        return {
          status: 429,
          message: `Please wait ${cooldownSeconds} seconds before requesting a new OTP.`,
        };
      }
    }

    // Generate new OTP
    const otp = generateOtp();
    mockOtpStore[mobileNumber] = {
      otp,
      mobile_number: mobileNumber,
      expires_at: Date.now() + OTP_EXPIRY_MS,
      attempts_remaining: MAX_ATTEMPTS,
      max_attempts: MAX_ATTEMPTS,
      is_locked: false,
      created_at: new Date().toISOString(),
    };

    console.log(`[MOCK OTP RESEND] ${mobileNumber}: ${otp}`);

    return {
      status: 200,
      message: 'New OTP sent successfully',
      data: {
        otp_sent: true,
        expires_in: 300,
        attempts_remaining: MAX_ATTEMPTS,
      },
    };
  }

  return http.post('/auth/otp/resend', { 
    mobile_number: mobileNumber, 
    session_id: sessionId 
  });
}

/**
 * Gets OTP attempt status
 * Real API: GET /auth/otp/status
 */
export async function getOtpStatus(
  mobileNumber: string,
  sessionId: string
): Promise<ApiResponse<OtpAttemptState>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const stored = mockOtpStore[mobileNumber];
    
    if (!stored) {
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
    let cooldownSeconds: number | undefined;
    if (stored.is_locked && stored.lock_expires_at) {
      if (Date.now() < stored.lock_expires_at) {
        cooldownSeconds = Math.ceil((stored.lock_expires_at - Date.now()) / 1000);
      } else {
        // Lock expired
        stored.is_locked = false;
        stored.attempts_remaining = MAX_ATTEMPTS;
        stored.lock_expires_at = undefined;
      }
    }

    return {
      status: 200,
      message: 'OTP status retrieved',
      data: {
        mobileNumber,
        remainingAttempts: stored.attempts_remaining,
        maxAttempts: stored.max_attempts,
        isLocked: stored.is_locked,
        lockExpiresAt: stored.lock_expires_at ? new Date(stored.lock_expires_at).toISOString() : undefined,
        cooldownSeconds,
        lastAttemptAt: stored.created_at,
      },
    };
  }

  return http.get(`/auth/otp/status?mobile_number=${encodeURIComponent(mobileNumber)}&session_id=${sessionId}`);
}
