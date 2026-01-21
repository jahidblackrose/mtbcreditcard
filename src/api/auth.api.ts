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

interface MockRMUser {
  id: string;
  staffId: string;
  fullName: string;
  email: string;
  branch: string;
  role: 'RM' | 'BRANCH_MANAGER' | 'ADMIN';
  password: string;
}

const mockRMUsers: MockRMUser[] = [
  {
    id: 'rm-001',
    staffId: 'MTB-RM-001',
    fullName: 'Aminul Haque',
    email: 'aminul.haque@mtb.com',
    branch: 'Gulshan Branch',
    role: 'RM',
    password: 'password123',
  },
  {
    id: 'rm-002',
    staffId: 'MTB-RM-002',
    fullName: 'Fatima Akter',
    email: 'fatima.akter@mtb.com',
    branch: 'Dhanmondi Branch',
    role: 'RM',
    password: 'password123',
  },
  {
    id: 'bm-001',
    staffId: 'MTB-BM-001',
    fullName: 'Karim Ahmed',
    email: 'karim.ahmed@mtb.com',
    branch: 'Gulshan Branch',
    role: 'BRANCH_MANAGER',
    password: 'password123',
  },
];

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
 */
export async function verifyOtp(
  mobileNumber: string,
  otp: string
): Promise<ApiResponse<FullUserSession>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 600));
    
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
 */
export async function rmLogin(
  staffId: string,
  password: string
): Promise<ApiResponse<UserSession>> {
  if (env.MODE === 'MOCK') {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = mockRMUsers.find(
      (u) => u.staffId.toLowerCase() === staffId.toLowerCase() && u.password === password
    );

    if (!user) {
      return {
        status: 401,
        message: 'Invalid Staff ID or Password',
      };
    }

    const session: UserSession = {
      userId: user.id,
      role: user.role,
      isAuthenticated: true,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    };

    localStorage.setItem('mtb_rm_session', JSON.stringify({
      session,
      user: {
        id: user.id,
        staffId: user.staffId,
        fullName: user.fullName,
        email: user.email,
        branch: user.branch,
        role: user.role,
      },
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
