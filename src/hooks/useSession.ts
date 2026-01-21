/**
 * MTB Credit Card Application - Session Hook
 * 
 * Manages session state with expiry warnings and auto-extension.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as sessionApi from '@/api/session.api';
import type { SessionState } from '@/types/session.types';

const SESSION_WARNING_THRESHOLD = 2 * 60; // 2 minutes before expiry

interface UseSessionReturn {
  session: SessionState | null;
  isLoading: boolean;
  isExpired: boolean;
  isWarning: boolean;
  ttlSeconds: number;
  error: string | null;
  createSession: (mode: 'SELF' | 'ASSISTED') => Promise<SessionState | null>;
  extendSession: () => Promise<boolean>;
  endSession: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<SessionState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ttlSeconds, setTtlSeconds] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update TTL countdown
  useEffect(() => {
    if (!session?.isActive || !session.expiresAt) {
      return;
    }

    const updateTtl = () => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000)
      );
      
      setTtlSeconds(remaining);
      setIsWarning(remaining > 0 && remaining <= SESSION_WARNING_THRESHOLD);
      
      if (remaining === 0) {
        setIsExpired(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    };

    updateTtl();
    timerRef.current = setInterval(updateTtl, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [session?.expiresAt, session?.isActive]);

  const createSession = useCallback(async (mode: 'SELF' | 'ASSISTED'): Promise<SessionState | null> => {
    setIsLoading(true);
    setError(null);
    setIsExpired(false);
    setIsWarning(false);

    try {
      const response = await sessionApi.createSession(mode);
      
      if (response.status === 200 && response.data) {
        setSession(response.data);
        setTtlSeconds(response.data.ttlSeconds);
        return response.data;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError('Failed to create session. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const extendSession = useCallback(async (): Promise<boolean> => {
    if (!session?.sessionId) {
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await sessionApi.extendSession(session.sessionId);
      
      if (response.status === 200 && response.data) {
        setSession(prev => prev ? {
          ...prev,
          expiresAt: response.data!.newExpiresAt,
          ttlSeconds: response.data!.newTtlSeconds,
          isActive: true,
        } : null);
        setIsWarning(false);
        setIsExpired(false);
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError('Failed to extend session.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session?.sessionId]);

  const endSession = useCallback(async (): Promise<void> => {
    if (!session?.sessionId) {
      return;
    }

    try {
      await sessionApi.endSession(session.sessionId);
    } finally {
      setSession(null);
      setTtlSeconds(0);
      setIsExpired(false);
      setIsWarning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [session?.sessionId]);

  const refreshSession = useCallback(async (): Promise<void> => {
    if (!session?.sessionId) {
      return;
    }

    try {
      const response = await sessionApi.getSession(session.sessionId);
      
      if (response.status === 200 && response.data) {
        setSession(response.data);
        setTtlSeconds(response.data.ttlSeconds);
        setIsExpired(!response.data.isActive);
      } else if (response.status === 401) {
        setIsExpired(true);
      }
    } catch (err) {
      setError('Failed to refresh session.');
    }
  }, [session?.sessionId]);

  return {
    session,
    isLoading,
    isExpired,
    isWarning,
    ttlSeconds,
    error,
    createSession,
    extendSession,
    endSession,
    refreshSession,
  };
}
