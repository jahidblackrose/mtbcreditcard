/**
 * MTB Credit Card Application - Submission API
 * 
 * API adapter for final application submission.
 * Backend validates all draft data before committing.
 */

import { env } from '@/config';
import { http } from './httpClient';
import type { ApiResponse } from '@/types';
import type { SubmissionResponse } from '@/types/session.types';

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Submits application using sessionId only
 * Backend retrieves all draft data from Redis
 */
export async function submitApplication(
  sessionId: string
): Promise<ApiResponse<SubmissionResponse>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
    
    // Simulate random validation errors for demo (10% chance)
    if (Math.random() < 0.1) {
      return {
        status: 422,
        message: 'Application validation failed. Please review your information and try again.',
      };
    }

    const referenceNumber = `MTB-CC-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
    
    return {
      status: 200,
      message: 'Application submitted successfully! You will receive confirmation via SMS and email.',
      data: {
        referenceNumber,
        applicationId: crypto.randomUUID(),
        submittedAt: new Date().toISOString(),
        status: 'SUBMITTED',
      },
    };
  }

  return http.post('/application/submit', { sessionId });
}

/**
 * Checks submission status
 */
export async function getSubmissionStatus(
  applicationId: string
): Promise<ApiResponse<{ status: string; referenceNumber: string }>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      status: 200,
      message: 'Status retrieved',
      data: {
        status: 'SUBMITTED',
        referenceNumber: `MTB-CC-${new Date().getFullYear()}-00001`,
      },
    };
  }

  return http.get(`/application/${applicationId}/status`);
}
