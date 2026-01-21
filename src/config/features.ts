/**
 * MTB Credit Card Application - Feature Flags
 * 
 * Feature flags for gradual rollout and A/B testing.
 * These can be toggled without code changes in production.
 */

export interface FeatureFlags {
  ENABLE_ASSISTED_MODE: boolean;
  ENABLE_SELF_MODE: boolean;
  ENABLE_DOCUMENT_UPLOAD: boolean;
  ENABLE_VIDEO_KYC: boolean;
  ENABLE_BIOMETRIC_AUTH: boolean;
  ENABLE_ANALYTICS: boolean;
}

const features: FeatureFlags = {
  ENABLE_ASSISTED_MODE: true,
  ENABLE_SELF_MODE: true,
  ENABLE_DOCUMENT_UPLOAD: true,
  ENABLE_VIDEO_KYC: false,
  ENABLE_BIOMETRIC_AUTH: false,
  ENABLE_ANALYTICS: true,
};

export default features;
