/**
 * Secure logout utilities
 * Handles secure session cleanup and data clearing
 */

import { SESSION_STORAGE_KEYS, LOCAL_STORAGE_KEYS } from '@/config/constants';

/**
 * Clear all sensitive data from storage
 */
export const clearSensitiveData = (): void => {
  try {
    // Clear session storage
    Object.values(SESSION_STORAGE_KEYS).forEach(key => {
      sessionStorage.removeItem(key);
    });

    // Clear sensitive local storage items
    LOCAL_STORAGE_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });

    // Clear any other sensitive data that might be in localStorage
    const sensitiveKeys = [
      'auth_token',
      'refresh_token',
      'access_token',
      'user_data',
      'applicant_data',
      'form_draft',
      'session_id',
      'mobile_number',
      'otp_attempts',
      'application_data',
    ];

    sensitiveKeys.forEach(key => {
      localStorage.removeItem(key);
    });

  } catch (error) {
    console.error('Error clearing sensitive data:', error);
  }
};

/**
 * Secure logout handler
 * Clears all data and redirects to login
 */
export const handleSecureLogout = (redirectUrl: string = '/'): void => {
  // Clear all sensitive data
  clearSensitiveData();

  // Clear any cached data
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }

  // Redirect to login/home
  window.location.href = redirectUrl;
};

/**
 * Check if session is valid
 */
export const isSessionValid = (sessionExpiry: string | Date | null): boolean => {
  if (!sessionExpiry) return false;

  const expiryTime = new Date(sessionExpiry).getTime();
  const now = new Date().getTime();

  return expiryTime > now;
};

/**
 * Get session time remaining in seconds
 */
export const getSessionTimeRemaining = (sessionExpiry: string | Date | null): number => {
  if (!sessionExpiry) return 0;

  const expiryTime = new Date(sessionExpiry).getTime();
  const now = new Date().getTime();

  const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
  return remaining;
};

/**
 * Format seconds to MM:SS display
 */
export const formatSessionTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
