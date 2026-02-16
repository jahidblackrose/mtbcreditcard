/**
 * Security Utilities
 * Helper functions for enhancing application security
 */

import { CryptoJS } from 'crypto-js';

/**
 * Session storage with encryption
 */
export const secureStorage = {
  set: (key: string, value: unknown, ttl?: number) => {
    const data = {
      value,
      expiry: ttl ? Date.now() + ttl * 1000 : null,
    };
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), import.meta.env.VITE_ENCRYPTION_KEY || 'mtb-secure-key').toString();
    sessionStorage.setItem(key, encrypted);
  },

  get: (key: string) => {
    const encrypted = sessionStorage.getItem(key);
    if (!encrypted) return null;

    try {
      const decrypted = CryptoJS.AES.decrypt(encrypted, import.meta.env.VITE_ENCRYPTION_KEY || 'mtb-secure-key');
      const data = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

      if (data.expiry && Date.now() > data.expiry) {
        sessionStorage.removeItem(key);
        return null;
      }

      return data.value;
    } catch {
      return null;
    }
  },

  remove: (key: string) => {
    sessionStorage.removeItem(key);
  },

  clear: () => {
    sessionStorage.clear();
  },
};

/**
 * Clear sensitive data on logout
 */
export const clearSensitiveData = () => {
  // Clear session storage
  sessionStorage.clear();

  // Clear any sensitive in-memory data
  // Note: React state will be cleared when component unmounts

  // Clear any cached sensitive data
  const keysToRemove: string[] = [];
  Object.keys(localStorage).forEach((key) => {
    if (key.includes('token') || key.includes('user') || key.includes('sensitive')) {
      keysToRemove.push(key);
    }
  });
  keysToRemove.forEach((key) => localStorage.removeItem(key));
};

/**
 * Generate CSRF token
 */
export const generateCSRFToken = (): string => {
  return CryptoJS.lib.WordArray.random(32).toString();
};

/**
 * Validate session expiry
 */
export const isSessionExpired = (expiresAt: string): boolean => {
  return new Date(expiresAt) < new Date();
};

/**
 * Get session warning time (2 minutes before expiry)
 */
export const getSessionWarningTime = (expiresAt: string): Date | null => {
  const expiryTime = new Date(expiresAt);
  const warningTime = new Date(expiryTime.getTime() - 2 * 60 * 1000); // 2 minutes before
  return warningTime > new Date() ? warningTime : null;
};

/**
 * Sanitize user input (basic implementation)
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate NID number (Bangladesh)
 */
export const validateNID = (nid: string): boolean => {
  // Bangladesh NID is 10 or 13 digits
  const nidPattern = /^\d{10}$|^\d{13}$/;
  return nidPattern.test(nid);
};

/**
 * Validate mobile number (Bangladesh)
 */
export const validateMobileNumber = (mobile: string): boolean => {
  // Bangladesh mobile: 01 followed by 9 digits
  const mobilePattern = /^01\d{9}$/;
  return mobilePattern.test(mobile);
};

/**
 * Validate email with basic checks
 */
export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) return false;

  // Check for common typos in domain
  const [localPart, domain] = email.split('@');
  if (domain.includes('.cim') || domain.includes('.gnail')) return false;

  return true;
};

/**
 * Rate limiting helper (local storage based)
 */
export const checkRateLimit = (
  action: string,
  maxAttempts: number = 5,
  windowMs: number = 60000
): { allowed: boolean; remainingAttempts: number; resetTime: Date | null } => {
  const key = `ratelimit_${action}`;
  const now = Date.now();

  const data = secureStorage.get(key) as { attempts: number; resetTime: number } | null;

  if (!data || now > data.resetTime) {
    // New window
    const newData = { attempts: 1, resetTime: now + windowMs };
    secureStorage.set(key, newData);
    return { allowed: true, remainingAttempts: maxAttempts - 1, resetTime: new Date(newData.resetTime) };
  }

  if (data.attempts >= maxAttempts) {
    return { allowed: false, remainingAttempts: 0, resetTime: new Date(data.resetTime) };
  }

  // Increment attempts
  data.attempts += 1;
  secureStorage.set(key, data);
  return { allowed: true, remainingAttempts: maxAttempts - data.attempts, resetTime: new Date(data.resetTime) };
};

/**
 * Reset rate limit
 */
export const resetRateLimit = (action: string) => {
  const key = `ratelimit_${action}`;
  secureStorage.remove(key);
};

/**
 * Security headers for API requests
 */
export const getSecurityHeaders = () => {
  return {
    'X-CSRF-Token': generateCSRFToken(),
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Security-Policy': "default-src 'self'",
  };
};

/**
 * Log security events (in production, send to monitoring service)
 */
export const logSecurityEvent = (event: {
  type: 'auth_failure' | 'session_expiry' | 'rate_limit' | 'suspicious_activity';
  details: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high';
}) => {
  if (import.meta.env.MODE === 'production') {
    // In production, send to logging/monitoring service
    console.warn('[Security Event]', event);
  } else {
    console.log('[Security Event - Dev Mode]', event);
  }
};
