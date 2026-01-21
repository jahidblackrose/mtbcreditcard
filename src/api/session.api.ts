/**
 * MTB Credit Card Application - Session API
 * 
 * API adapter for Redis-backed session management.
 * Handles session creation, extension, and expiry.
 */

import { env } from '@/config';
import { http } from './httpClient';
import type { ApiResponse } from '@/types';
import type { SessionState, SessionExtendResponse } from '@/types/session.types';

// ============================================
// MOCK DATA
// ============================================

let mockSession: SessionState | null = null;

function createMockSession(mode: 'SELF' | 'ASSISTED'): SessionState {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes
  
  return {
    sessionId: crypto.randomUUID(),
    mode,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    ttlSeconds: 30 * 60,
    isActive: true,
  };
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Creates a new session
 */
export async function createSession(
  mode: 'SELF' | 'ASSISTED'
): Promise<ApiResponse<SessionState>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    mockSession = createMockSession(mode);
    
    return {
      status: 200,
      message: 'Session created successfully',
      data: mockSession,
    };
  }

  return http.post('/session/create', { mode });
}

/**
 * Gets current session state
 */
export async function getSession(
  sessionId: string
): Promise<ApiResponse<SessionState>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (!mockSession || mockSession.sessionId !== sessionId) {
      return {
        status: 404,
        message: 'Session not found or expired',
      };
    }

    // Check if expired
    if (new Date(mockSession.expiresAt) < new Date()) {
      mockSession.isActive = false;
      return {
        status: 401,
        message: 'Session has expired. Please start again.',
      };
    }

    // Update TTL
    const ttlSeconds = Math.max(
      0,
      Math.floor((new Date(mockSession.expiresAt).getTime() - Date.now()) / 1000)
    );
    mockSession.ttlSeconds = ttlSeconds;

    return {
      status: 200,
      message: 'Session retrieved successfully',
      data: mockSession,
    };
  }

  return http.get(`/session/${sessionId}`);
}

/**
 * Extends session TTL
 */
export async function extendSession(
  sessionId: string
): Promise<ApiResponse<SessionExtendResponse>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (!mockSession || mockSession.sessionId !== sessionId) {
      return {
        status: 404,
        message: 'Session not found',
      };
    }

    // Extend by 30 minutes
    const newExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
    mockSession.expiresAt = newExpiresAt.toISOString();
    mockSession.ttlSeconds = 30 * 60;
    mockSession.isActive = true;

    return {
      status: 200,
      message: 'Session extended successfully',
      data: {
        newExpiresAt: newExpiresAt.toISOString(),
        newTtlSeconds: 30 * 60,
      },
    };
  }

  return http.post(`/session/${sessionId}/extend`);
}

/**
 * Ends session
 */
export async function endSession(
  sessionId: string
): Promise<ApiResponse<void>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 200));
    mockSession = null;
    return {
      status: 200,
      message: 'Session ended successfully',
    };
  }

  return http.delete(`/session/${sessionId}`);
}
