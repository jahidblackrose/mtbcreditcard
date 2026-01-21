/**
 * MTB Credit Card Application - HTTP Client
 * 
 * Base HTTP client for all API calls.
 * Handles base URL, headers, and error transformation.
 * 
 * SECURITY:
 * - No credentials stored in frontend
 * - Auth tokens handled by backend/BFF
 * - No PII in logs
 */

import { env } from '@/config';
import type { ApiResponse } from '@/types';

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Creates the full URL from path
 */
function buildUrl(path: string): string {
  const baseUrl = env.API_BASE_URL.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Default headers for all requests
 */
function getDefaultHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-App-Version': env.APP_VERSION,
  };
}

/**
 * Generic HTTP request handler
 * 
 * In MOCK mode, this function is not called.
 * API adapters return mock data directly.
 */
export async function httpRequest<T>(
  options: RequestOptions
): Promise<ApiResponse<T>> {
  // In MOCK mode, this should not be called
  if (env.MODE === 'MOCK') {
    console.warn('[httpClient] httpRequest called in MOCK mode. This should not happen.');
    return {
      status: 500,
      message: 'API is in MOCK mode. Real HTTP calls are disabled.',
    };
  }

  try {
    const url = buildUrl(options.path);
    const headers = { ...getDefaultHeaders(), ...options.headers };

    const response = await fetch(url, {
      method: options.method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: 'include', // Include cookies for session management
    });

    const data = await response.json();

    // API returns our standard response format
    return data as ApiResponse<T>;
  } catch (error) {
    // Network or parsing error - return safe error message
    console.error('[httpClient] Request failed:', options.path);
    return {
      status: 500,
      message: 'Unable to connect to server. Please try again later.',
    };
  }
}

/**
 * Convenience methods
 */
export const http = {
  get: <T>(path: string) => 
    httpRequest<T>({ method: 'GET', path }),
  
  post: <T>(path: string, body?: unknown) => 
    httpRequest<T>({ method: 'POST', path, body }),
  
  put: <T>(path: string, body?: unknown) => 
    httpRequest<T>({ method: 'PUT', path, body }),
  
  patch: <T>(path: string, body?: unknown) => 
    httpRequest<T>({ method: 'PATCH', path, body }),
  
  delete: <T>(path: string) => 
    httpRequest<T>({ method: 'DELETE', path }),
};
