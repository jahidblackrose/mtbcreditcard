/**
 * MTB Credit Card Application - Session API
 * 
 * API adapter for Redis-backed session management.
 * Handles session creation, extension, and expiry.
 * 
 * MOCK data structures match real API contracts exactly.
 */

import { env } from '@/config';
import { http } from './httpClient';
import type { ApiResponse } from '@/types';
import type { SessionState, SessionExtendResponse } from '@/types/session.types';

// ============================================
// MOCK DATA STORE (matches real API contract)
// ============================================

interface MockSession {
  session_id: string;
  mode: 'SELF' | 'ASSISTED';
  created_at: string;
  expires_at: string;
  ttl_seconds: number;
  is_active: boolean;
  staff_id?: string;
  staff_name?: string;
  branch_code?: string;
}

const mockSessions: Record<string, MockSession> = {};
const SESSION_TTL_MS = 1800000; // 30 minutes

function generateSessionId(mode: 'SELF' | 'ASSISTED'): string {
  const prefix = mode === 'ASSISTED' ? 'sess_assisted_' : 'sess_';
  return prefix + Math.random().toString(36).substring(2, 15);
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Creates a new session
 * Real API: POST /session/create
 */
export async function createSession(
  mode: 'SELF' | 'ASSISTED',
  staffId?: string
): Promise<ApiResponse<SessionState>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);
    const sessionId = generateSessionId(mode);
    
    const session: MockSession = {
      session_id: sessionId,
      mode,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      ttl_seconds: SESSION_TTL_MS / 1000,
      is_active: true,
      staff_id: staffId,
    };
    
    mockSessions[sessionId] = session;
    
    // Also store in localStorage for persistence across refreshes
    localStorage.setItem('session_id', sessionId);
    localStorage.setItem('session_mode', mode);
    localStorage.setItem('session_created_at', now.toISOString());
    localStorage.setItem('session_expires_at', expiresAt.toISOString());
    
    return {
      status: 200,
      message: 'Session created successfully',
      data: {
        sessionId,
        mode,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        ttlSeconds: SESSION_TTL_MS / 1000,
        isActive: true,
      },
    };
  }

  return http.post('/session/create', { mode, staff_id: staffId });
}

/**
 * Gets current session state
 * Real API: GET /session/:sessionId
 */
export async function getSession(
  sessionId: string
): Promise<ApiResponse<SessionState>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let session = mockSessions[sessionId];
    
    // Try to restore from localStorage if not in memory
    if (!session) {
      const storedSessionId = localStorage.getItem('session_id');
      const storedMode = localStorage.getItem('session_mode') as 'SELF' | 'ASSISTED' | null;
      const storedCreatedAt = localStorage.getItem('session_created_at');
      const storedExpiresAt = localStorage.getItem('session_expires_at');
      
      if (storedSessionId === sessionId && storedMode && storedExpiresAt) {
        session = {
          session_id: storedSessionId,
          mode: storedMode,
          created_at: storedCreatedAt || new Date().toISOString(),
          expires_at: storedExpiresAt,
          ttl_seconds: Math.max(0, Math.floor((new Date(storedExpiresAt).getTime() - Date.now()) / 1000)),
          is_active: new Date(storedExpiresAt) > new Date(),
        };
        mockSessions[sessionId] = session;
      }
    }
    
    if (!session) {
      return {
        status: 404,
        message: 'Session not found or expired',
      };
    }

    // Check if expired
    if (new Date(session.expires_at) < new Date()) {
      session.is_active = false;
      return {
        status: 401,
        message: 'Session has expired. Please start again.',
      };
    }

    // Update TTL
    const ttlSeconds = Math.max(
      0,
      Math.floor((new Date(session.expires_at).getTime() - Date.now()) / 1000)
    );

    return {
      status: 200,
      message: 'Session retrieved successfully',
      data: {
        sessionId: session.session_id,
        mode: session.mode,
        createdAt: session.created_at,
        expiresAt: session.expires_at,
        ttlSeconds,
        isActive: session.is_active,
      },
    };
  }

  return http.get(`/session/${sessionId}`);
}

/**
 * Extends session TTL
 * Real API: POST /session/:sessionId/extend
 */
export async function extendSession(
  sessionId: string
): Promise<ApiResponse<SessionExtendResponse>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const session = mockSessions[sessionId];
    
    if (!session) {
      return {
        status: 404,
        message: 'Session not found',
      };
    }

    // Extend by 30 minutes
    const newExpiresAt = new Date(Date.now() + SESSION_TTL_MS);
    session.expires_at = newExpiresAt.toISOString();
    session.ttl_seconds = SESSION_TTL_MS / 1000;
    session.is_active = true;
    
    // Update localStorage
    localStorage.setItem('session_expires_at', newExpiresAt.toISOString());

    return {
      status: 200,
      message: 'Session extended successfully',
      data: {
        newExpiresAt: newExpiresAt.toISOString(),
        newTtlSeconds: SESSION_TTL_MS / 1000,
      },
    };
  }

  return http.post(`/session/${sessionId}/extend`);
}

/**
 * Ends session
 * Real API: DELETE /session/:sessionId
 */
export async function endSession(
  sessionId: string
): Promise<ApiResponse<void>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    delete mockSessions[sessionId];
    
    // Clear localStorage
    localStorage.removeItem('session_id');
    localStorage.removeItem('session_mode');
    localStorage.removeItem('session_created_at');
    localStorage.removeItem('session_expires_at');
    
    return {
      status: 200,
      message: 'Session ended successfully',
    };
  }

  return http.delete(`/session/${sessionId}`);
}

/**
 * Validates session is still active
 * Real API: GET /session/:sessionId/validate
 */
export async function validateSession(
  sessionId: string
): Promise<ApiResponse<{ is_valid: boolean; ttl_seconds: number }>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const session = mockSessions[sessionId];
    
    if (!session || new Date(session.expires_at) < new Date()) {
      return {
        status: 200,
        message: 'Session validation result',
        data: { is_valid: false, ttl_seconds: 0 },
      };
    }

    const ttlSeconds = Math.max(
      0,
      Math.floor((new Date(session.expires_at).getTime() - Date.now()) / 1000)
    );

    return {
      status: 200,
      message: 'Session is valid',
      data: { is_valid: true, ttl_seconds: ttlSeconds },
    };
  }

  return http.get(`/session/${sessionId}/validate`);
}
