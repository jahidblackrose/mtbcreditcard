/**
 * MTB Credit Card Application - Environment Configuration
 *
 * This file contains all environment-specific configuration.
 * Switching from MOCK to REAL requires ONLY changing these values.
 *
 * SECURITY WARNING:
 * - MOCK mode is for development/testing ONLY
 * - MOCK mode uses localStorage for sessions (NOT secure)
 * - Never use MOCK mode in production
 * - MOCK credentials are visible in source code
 */

export type AppMode = 'MOCK' | 'REAL';

export interface EnvironmentConfig {
  API_BASE_URL: string;
  MODE: AppMode;
  APP_NAME: string;
  APP_VERSION: string;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
}

// Validate environment on load
function validateEnv(): void {
  const mode = import.meta.env.VITE_APP_MODE as AppMode;

  if (!mode || !['MOCK', 'REAL'].includes(mode)) {
    console.warn(
      '[CONFIG] VITE_APP_MODE not set or invalid. Defaulting to MOCK.\n' +
      'Set VITE_APP_MODE=REAL for production use.'
    );
  }

  if (mode === 'MOCK' && import.meta.env.PROD) {
    console.error(
      '[SECURITY WARNING] MOCK mode is enabled in PRODUCTION environment!\n' +
      'This is NOT secure. localStorage sessions can be stolen via XSS.\n' +
      'Set VITE_APP_MODE=REAL immediately.'
    );
  }

  // Warn if demo credentials might be exposed
  if (mode === 'MOCK' && import.meta.env.DEV) {
    console.info(
      '[CONFIG] Running in MOCK mode (development)\n' +
      'Demo credentials are active for testing only.\n' +
      'These will be disabled in REAL mode.'
    );
  }
}

// Run validation
validateEnv();

const config: EnvironmentConfig = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.mtb.com.bd/v1',
  MODE: (import.meta.env.VITE_APP_MODE as AppMode) || 'MOCK',
  APP_NAME: 'MTB Credit Card Application',
  APP_VERSION: '1.0.0',
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
};

// Additional safety checks
if (config.MODE === 'REAL' && !import.meta.env.VITE_API_BASE_URL) {
  console.error(
    '[CONFIG] VITE_API_BASE_URL must be set in REAL mode!\n' +
    'The application will not function correctly without it.'
  );
}

export const env = config;

export default config;
