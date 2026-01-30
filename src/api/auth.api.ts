/**
 * MTB Credit Card Application - Auth Page API
 * 
 * API adapter for authentication.
 * In production, auth is handled by backend/BFF.
 * 
 * MODE: MOCK implementation
 */

import { env } from '@/config';
import { http } from './httpClient';
import type { ApiResponse, User, UserSession, StaffUser, FullUserSession } from '@/types';
import { MOCK_RM_CREDENTIALS, validateRMCredentials } from './mockData';

// ============================================
// MOCK DATA - DEVELOPMENT ONLY
// ============================================
// WARNING: This mock data is for DEVELOPMENT/DEMO purposes only.
// In REAL mode, all authentication is handled by the backend.
// These credentials must NEVER be used in production.
// ============================================

const MOCK_USER: User = {
  id: 'user-001',
  name: 'Test User',
  email: 'test@mtb.com.bd',
  mobileNumber: '+8801712345678',
  role: 'APPLICANT',
};

// ============================================
// APPLICANT AUTH (OTP-based)
// ============================================

/**
 * Initiates OTP login
 */
export async function requestOtp(
  mobileNumber: string
): Promise<ApiResponse<{ otpSent: boolean; expiresIn: number }>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!mobileNumber || mobileNumber.length < 10) {
      return {
        status: 400,
        message: 'Please enter a valid mobile number',
      };
    }

    return {
      status: 200,
      message: 'OTP sent successfully to your mobile number',
      data: {
        otpSent: true,
        expiresIn: 300,
      },
    };
  }

  return http.post('/auth/otp/request', { mobileNumber });
}

/**
 * Verifies OTP and logs in
 * 
 * MOCK MODE: Accepts '123456' as demo OTP for development only.
 * REAL MODE: Server-side validation with proper rate limiting, expiry, and lockout.
 */
export async function verifyOtp(
  mobileNumber: string,
  otp: string
): Promise<ApiResponse<FullUserSession>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // MOCK MODE ONLY - In production, OTP validation happens server-side with:
    // - Time-based expiration (5-10 minutes)
    // - Maximum 3-5 attempts before lockout
    // - Rate limiting per mobile number
    // - Secure OTP delivery via SMS gateway
    const MOCK_DEMO_OTP = '123456'; // Demo OTP for development only
    
    if (otp !== MOCK_DEMO_OTP) {
      return {
        status: 401,
        message: 'Invalid OTP. Please try again.',
      };
    }

    return {
      status: 200,
      message: 'Login successful',
      data: {
        user: MOCK_USER,
        sessionId: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        isAuthenticated: true,
      },
    };
  }

  return http.post('/auth/otp/verify', { mobileNumber, otp });
}

/**
 * Gets current session (for applicants)
 */
export async function getCurrentSession(): Promise<ApiResponse<FullUserSession>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      status: 200,
      message: 'No active session',
      data: {
        user: {} as User,
        sessionId: '',
        expiresAt: '',
        isAuthenticated: false,
      },
    };
  }

  return http.get('/auth/session');
}

/**
 * Logs out current user (applicant)
 */
export async function logout(): Promise<ApiResponse<void>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      status: 200,
      message: 'Logged out successfully',
    };
  }

  return http.post('/auth/logout');
}

// ============================================
// RM AUTH (Staff ID + Password)
// ============================================

/**
 * RM Login with Staff ID and Password
 * 
 * MOCK MODE: Uses localStorage for session (development only).
 * REAL MODE: Server returns secure HTTP-only cookies; no client-side session storage.
 * 
 * WARNING: localStorage approach is for MOCK MODE ONLY.
 * In production, session management is handled server-side with:
 * - Secure HTTP-only cookies
 * - Server-side session validation on every request
 * - Signed/encrypted session tokens
 */
export async function rmLogin(
  staffId: string,
  password: string
): Promise<ApiResponse<UserSession>> {
  if (env.MODE === 'MOCK') {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = validateRMCredentials(staffId, password);

    if (!user) {
      return {
        status: 401,
        message: 'Invalid Staff ID or Password',
      };
    }

    const session: UserSession = {
      userId: user.staff_id,
      role: user.role as 'RM' | 'BRANCH_MANAGER' | 'ADMIN',
      isAuthenticated: true,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    };

    // MOCK MODE ONLY: Store session in localStorage for demo purposes.
    // In REAL mode, the server handles session via secure HTTP-only cookies.
    // This client-side storage is NOT secure for production use.
    localStorage.setItem('mtb_rm_session', JSON.stringify({
      session,
      user: {
        id: user.staff_id,
        staffId: user.staff_id,
        fullName: user.name,
        email: `${user.staff_id}@mtb.com`,
        branch: user.branch_code,
        role: user.role,
      },
      _mockModeOnly: true, // Flag indicating this is mock data
    }));

    return {
      status: 200,
      message: 'Login successful',
      data: session,
    };
  }

  return http.post('/auth/rm/login', { staffId, password });
}

/**
 * RM Logout
 */
export async function rmLogout(): Promise<ApiResponse<void>> {
  if (env.MODE === 'MOCK') {
    await new Promise((resolve) => setTimeout(resolve, 300));

    localStorage.removeItem('mtb_rm_session');

    return {
      status: 200,
      message: 'Logged out successfully',
    };
  }

  return http.post('/auth/rm/logout');
}

/**
 * Get current RM session
 */
export async function getRMSession(): Promise<ApiResponse<{
  session: UserSession;
  user: StaffUser;
} | null>> {
  if (env.MODE === 'MOCK') {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const stored = localStorage.getItem('mtb_rm_session');
    
    if (!stored) {
      return {
        status: 200,
        message: 'No active session',
        data: null,
      };
    }

    try {
      const data = JSON.parse(stored);
      
      if (new Date(data.session.expiresAt) < new Date()) {
        localStorage.removeItem('mtb_rm_session');
        return {
          status: 200,
          message: 'Session expired',
          data: null,
        };
      }

      return {
        status: 200,
        message: 'Session active',
        data: data,
      };
    } catch {
      return {
        status: 200,
        message: 'Invalid session data',
        data: null,
      };
    }
  }

  return http.get('/auth/rm/session');
}
