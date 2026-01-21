/**
 * MTB Credit Card Application - Rate Limiting Hook
 * 
 * Handles rate limit detection and cooldown UI.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface RateLimitState {
  isLimited: boolean;
  retryAfterSeconds: number;
  limitType: string | null;
  message: string | null;
}

interface UseRateLimitReturn {
  isLimited: boolean;
  retryAfterSeconds: number;
  limitType: string | null;
  message: string | null;
  handleApiResponse: (status: number, message: string, limitType?: string) => boolean;
  reset: () => void;
}

export function useRateLimit(): UseRateLimitReturn {
  const [state, setState] = useState<RateLimitState>({
    isLimited: false,
    retryAfterSeconds: 0,
    limitType: null,
    message: null,
  });
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer
  useEffect(() => {
    if (state.retryAfterSeconds > 0) {
      timerRef.current = setTimeout(() => {
        setState(prev => {
          const newSeconds = prev.retryAfterSeconds - 1;
          return {
            ...prev,
            retryAfterSeconds: newSeconds,
            isLimited: newSeconds > 0,
          };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [state.retryAfterSeconds]);

  const handleApiResponse = useCallback((
    status: number,
    message: string,
    limitType?: string
  ): boolean => {
    if (status === 429) {
      // Extract retry time from message if present
      const match = message.match(/(\d+) seconds?/);
      const retryAfter = match ? parseInt(match[1], 10) : 30;
      
      setState({
        isLimited: true,
        retryAfterSeconds: retryAfter,
        limitType: limitType || 'unknown',
        message,
      });
      
      return true; // Rate limited
    }
    
    return false; // Not rate limited
  }, []);

  const reset = useCallback(() => {
    setState({
      isLimited: false,
      retryAfterSeconds: 0,
      limitType: null,
      message: null,
    });
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  return {
    isLimited: state.isLimited,
    retryAfterSeconds: state.retryAfterSeconds,
    limitType: state.limitType,
    message: state.message,
    handleApiResponse,
    reset,
  };
}
