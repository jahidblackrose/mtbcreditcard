/**
 * MTB Credit Card Application - Applications API
 * 
 * API adapter for application management.
 * Handles fetching applications by mobile number, reference, and status tracking.
 */

import { env } from '@/config';
import { http } from './httpClient';
import type { ApiResponse } from '@/types';
import { 
  getApplicationsByMobile as getMockAppsByMobile, 
  getApplicationByReference as getMockAppByRef,
  getStatusTimeline as getMockTimeline,
  MOCK_APPLICATIONS 
} from './mockData';

// ============================================
// TYPES
// ============================================

export interface Application {
  application_id: string;
  reference_number: string;
  status: string;
  card_product_code: string;
  card_product_name: string;
  applicant_name: string;
  mobile_number: string;
  email?: string;
  created_at: string;
  submitted_at: string | null;
  last_updated_at: string;
  current_step: number;
  total_steps: number;
  is_submitted: boolean;
}

export interface ApplicationTimeline {
  timestamp: string;
  event: string;
  status: 'completed' | 'pending' | 'current' | 'error';
  description: string;
  actor?: string;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Gets all applications for a mobile number
 * Real API: GET /applications?mobile_number=xxx
 */
export async function getApplicationsByMobile(
  mobileNumber: string
): Promise<ApiResponse<Application[]>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const apps = getMockAppsByMobile(mobileNumber);
    
    return {
      status: 200,
      message: apps.length > 0 
        ? `Found ${apps.length} application(s)` 
        : 'No applications found',
      data: apps as Application[],
    };
  }

  return http.get(`/applications?mobile_number=${encodeURIComponent(mobileNumber)}`);
}

/**
 * Gets application by reference number
 * Real API: GET /applications/reference/:referenceNumber
 */
export async function getApplicationByReference(
  referenceNumber: string
): Promise<ApiResponse<Application | null>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const app = getMockAppByRef(referenceNumber);
    
    if (!app) {
      return {
        status: 404,
        message: 'Application not found',
        data: null,
      };
    }
    
    return {
      status: 200,
      message: 'Application retrieved',
      data: app as Application,
    };
  }

  return http.get(`/applications/reference/${encodeURIComponent(referenceNumber)}`);
}

/**
 * Gets application status timeline
 * Real API: GET /applications/:applicationId/timeline
 */
export async function getApplicationTimeline(
  referenceNumber: string
): Promise<ApiResponse<ApplicationTimeline[]>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const timeline = getMockTimeline(referenceNumber);
    
    return {
      status: 200,
      message: timeline.length > 0 ? 'Timeline retrieved' : 'No timeline found',
      data: timeline,
    };
  }

  return http.get(`/applications/reference/${encodeURIComponent(referenceNumber)}/timeline`);
}

/**
 * Submits a completed application
 * Real API: POST /applications/submit
 */
export async function submitApplication(
  sessionId: string,
  applicationId: string
): Promise<ApiResponse<{ 
  reference_number: string; 
  submitted_at: string;
  estimated_processing_days: number;
}>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const now = new Date();
    
    return {
      status: 200,
      message: 'Application submitted successfully',
      data: {
        reference_number: `MTBCC-${now.toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        submitted_at: now.toISOString(),
        estimated_processing_days: 7,
      },
    };
  }

  return http.post('/applications/submit', { 
    session_id: sessionId, 
    application_id: applicationId 
  });
}

/**
 * Gets all applications (for RM dashboard)
 * Real API: GET /applications/all
 */
export async function getAllApplications(
  filters?: {
    status?: string;
    date_from?: string;
    date_to?: string;
    branch_code?: string;
  }
): Promise<ApiResponse<Application[]>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let apps = [...MOCK_APPLICATIONS];
    
    // Apply filters
    if (filters?.status) {
      apps = apps.filter(app => app.status === filters.status);
    }
    
    return {
      status: 200,
      message: `Found ${apps.length} application(s)`,
      data: apps as Application[],
    };
  }

  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.date_from) params.append('date_from', filters.date_from);
  if (filters?.date_to) params.append('date_to', filters.date_to);
  if (filters?.branch_code) params.append('branch_code', filters.branch_code);
  
  return http.get(`/applications/all?${params.toString()}`);
}
