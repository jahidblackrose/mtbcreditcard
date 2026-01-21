/**
 * MTB Credit Card Application - API Layer Exports
 * 
 * Page-wise API adapters following strict separation of concerns.
 * Each UI page imports ONLY its corresponding API file.
 */

// Re-export for convenience, but pages should import directly
export * from './landing.api';
export * from './application.api';
export * from './dashboard.api';
export * from './auth.api';
export * from './session.api';
export * from './draft.api';
// OTP and submission APIs have name conflicts - import directly from their files
export { requestOtp as requestOtpTracked, verifyOtp as verifyOtpTracked, getOtpStatus } from './otp.api';
export { submitApplication as submitApplicationFinal, getSubmissionStatus } from './submission.api';
