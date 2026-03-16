/**
 * Application constants
 * Storage keys, timeouts, and other configuration values
 */

// Session Storage Keys
export const SESSION_STORAGE_KEYS = {
  SESSION_ID: 'mtb_session_id',
  MOBILE_NUMBER: 'mtb_mobile',
  OTP_ATTEMPTS: 'mtb_otp_attempts',
  OTP_LOCKOUT: 'mtb_otp_lockout',
  CURRENT_STEP: 'mtb_current_step',
  FORM_DATA: 'mtb_form_data',
} as const;

// Local Storage Keys (sensitive)
export const LOCAL_STORAGE_KEYS = [
  'auth_token',
  'refresh_token',
  'access_token',
  'user_data',
  'applicant_data',
  'form_draft',
  'session_id',
] as const;

// Session Configuration
export const SESSION_CONFIG = {
  DEFAULT_DURATION: 30 * 60 * 1000, // 30 minutes
  WARNING_BEFORE: 2 * 60 * 1000, // 2 minutes before expiry
  EXTEND_DURATION: 30 * 60 * 1000, // Extend by 30 minutes
  MAX_EXTENSIONS: 3, // Maximum number of times session can be extended
} as const;

// OTP Configuration
export const OTP_CONFIG = {
  MAX_ATTEMPTS: 5,
  LOCKOUT_DURATION: 30 * 60 * 1000, // 30 minutes
  EXPIRY_DURATION: 5 * 60 * 1000, // 5 minutes
  RESEND_COOLDOWN: 60 * 1000, // 1 minute
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  OTP_SEND: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 per hour
  DRAFT_SAVE: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per minute
  GENERAL_API: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 per minute
  STAFF_LOGIN: { maxRequests: 10, windowMs: 15 * 60 * 1000 }, // 10 per 15 min
} as const;

// Accessibility
export const ARIA_LABELS = {
  CLOSE: 'Close',
  NEXT_STEP: 'Next step',
  PREVIOUS_STEP: 'Previous step',
  SAVE_DRAFT: 'Save draft',
  SUBMIT: 'Submit application',
  DELETE: 'Delete',
  EDIT: 'Edit',
  LOADING: 'Loading',
  ERROR: 'Error',
  SUCCESS: 'Success',
  WARNING: 'Warning',
} as const;

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  SUBMIT_FORM: 'Ctrl+Enter',
  SAVE_DRAFT: 'Ctrl+S',
  NEXT_STEP: 'Ctrl+→',
  PREVIOUS_STEP: 'Ctrl+←',
  OPEN_HELP: 'Ctrl+?',
} as const;

// Validation Timeouts
export const VALIDATION_TIMEOUTS = {
  DEBOUNCE: 300, // ms
  AUTOSAVE: 2000, // ms
  SESSION_CHECK: 5000, // ms
} as const;
