/**
 * MTB Credit Card Application - Environment Configuration
 * 
 * This file contains all environment-specific configuration.
 * Switching from MOCK to REAL requires ONLY changing these values.
 */

export type AppMode = 'MOCK' | 'REAL';

export interface EnvironmentConfig {
  API_BASE_URL: string;
  MODE: AppMode;
  APP_NAME: string;
  APP_VERSION: string;
}

const config: EnvironmentConfig = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.mtb.com.bd/v1',
  MODE: (import.meta.env.VITE_APP_MODE as AppMode) || 'MOCK',
  APP_NAME: 'MTB Credit Card Application',
  APP_VERSION: '1.0.0',
};

export default config;
