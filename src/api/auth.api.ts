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
import type { ApiResponse, User, UserSession } from '@/types';

// ============================================
// MOCK DATA
// ============================================

const MOCK_USER: User = {
  id: 'user-001',
  name: 'Test User',
  email: 'test@mtb.com.bd',
  mobileNumber: '+8801712345678',
  role: 'APPLICANT',
};

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Initiates OTP login
 */
export async function requestOtp(
  mobileNumber: string
): Promise<ApiResponse<{ otpSent: boolean; expiresIn: number }>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple validation
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
        expiresIn: 300, // 5 minutes
      },
    };
  }

  return http.post('/auth/otp/request', { mobileNumber });
}

/**
 * Verifies OTP and logs in
 */
export async function verifyOtp(
  mobileNumber: string,
  otp: string
): Promise<ApiResponse<UserSession>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Mock OTP is always 123456
    if (otp !== '123456') {
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
 * Gets current session
 */
export async function getCurrentSession(): Promise<ApiResponse<UserSession>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // For demo, always return unauthenticated
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
 * Logs out current user
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
