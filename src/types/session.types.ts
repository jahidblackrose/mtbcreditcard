/**
 * MTB Credit Card Application - Session & Draft Types
 * 
 * Types for Redis-backed state management
 */

/**
 * Session state from backend (Redis-backed)
 */
export interface SessionState {
  sessionId: string;
  applicationId?: string;
  userId?: string;
  mode: 'SELF' | 'ASSISTED';
  createdAt: string;
  expiresAt: string;
  ttlSeconds: number;
  isActive: boolean;
}

/**
 * Draft step versioning
 */
export interface DraftVersion {
  stepNumber: number;
  stepName: string;
  version: number;
  savedAt: string;
  isComplete: boolean;
}

/**
 * Draft state from backend (Redis-backed)
 */
export interface DraftState {
  sessionId: string;
  applicationId: string;
  currentStep: number;
  highestCompletedStep: number;
  draftVersion: number;
  stepVersions: DraftVersion[];
  data: Record<string, unknown>;
  lastSavedAt: string;
  isSubmitted: boolean;
}

/**
 * OTP attempt state
 */
export interface OtpAttemptState {
  mobileNumber: string;
  remainingAttempts: number;
  maxAttempts: number;
  isLocked: boolean;
  lockExpiresAt?: string;
  cooldownSeconds?: number;
  lastAttemptAt?: string;
}

/**
 * Rate limit response from backend
 */
export interface RateLimitInfo {
  isLimited: boolean;
  retryAfterSeconds?: number;
  limitType: 'otp' | 'draft' | 'submission';
  message?: string;
}

/**
 * Draft save request
 */
export interface DraftSaveRequest {
  sessionId: string;
  stepNumber: number;
  stepName: string;
  data: Record<string, unknown>;
  isStepComplete?: boolean;
}

/**
 * Draft save response
 */
export interface DraftSaveResponse {
  success: boolean;
  draftVersion: number;
  savedAt: string;
}

/**
 * Application submission response
 */
export interface SubmissionResponse {
  referenceNumber: string;
  applicationId: string;
  submittedAt: string;
  status: 'SUBMITTED' | 'PENDING_VERIFICATION';
}

/**
 * Session extend response
 */
export interface SessionExtendResponse {
  newExpiresAt: string;
  newTtlSeconds: number;
}
