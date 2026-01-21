/**
 * MTB Credit Card Application - RM Dashboard API
 * 
 * API adapter for RM dashboard showing applications.
 * 
 * MODE: MOCK implementation
 */

import { env } from '@/config';
import { http } from './httpClient';
import type { ApiResponse, ApplicationSummary, ApplicationStatus } from '@/types';

// ============================================
// MOCK DATA
// ============================================

const mockApplications: ApplicationSummary[] = [
  {
    id: 'app-001',
    referenceNumber: 'MTB-CC-2026-00123',
    status: 'SUBMITTED',
    cardType: 'VISA_GOLD',
    applicantName: 'Mohammad Rahman',
    submittedAt: '2026-01-20T10:30:00Z',
    lastUpdatedAt: '2026-01-20T10:30:00Z',
  },
  {
    id: 'app-002',
    referenceNumber: 'MTB-CC-2026-00124',
    status: 'UNDER_REVIEW',
    cardType: 'MASTERCARD_GOLD',
    applicantName: 'Ayesha Begum',
    submittedAt: '2026-01-19T14:15:00Z',
    lastUpdatedAt: '2026-01-20T09:00:00Z',
  },
  {
    id: 'app-003',
    referenceNumber: 'MTB-CC-2026-00125',
    status: 'DRAFT',
    cardType: 'VISA_CLASSIC',
    applicantName: 'Kamal Hossain',
    lastUpdatedAt: '2026-01-21T08:45:00Z',
  },
  {
    id: 'app-004',
    referenceNumber: 'MTB-CC-2026-00126',
    status: 'APPROVED',
    cardType: 'MASTERCARD_WORLD',
    applicantName: 'Nusrat Jahan',
    submittedAt: '2026-01-15T11:00:00Z',
    lastUpdatedAt: '2026-01-18T16:30:00Z',
  },
  {
    id: 'app-005',
    referenceNumber: 'MTB-CC-2026-00127',
    status: 'DOCUMENTS_REQUIRED',
    cardType: 'VISA_PLATINUM',
    applicantName: 'Tanvir Ahmed',
    submittedAt: '2026-01-17T09:20:00Z',
    lastUpdatedAt: '2026-01-19T14:00:00Z',
  },
];

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get all applications for the logged-in RM
 */
export async function getRMApplications(
  filters?: {
    status?: ApplicationStatus;
    search?: string;
  }
): Promise<ApiResponse<ApplicationSummary[]>> {
  if (env.MODE === 'MOCK') {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filtered = [...mockApplications];

    if (filters?.status) {
      filtered = filtered.filter((app) => app.status === filters.status);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.applicantName.toLowerCase().includes(searchLower) ||
          app.referenceNumber.toLowerCase().includes(searchLower)
      );
    }

    return {
      status: 200,
      message: 'Applications retrieved successfully',
      data: filtered,
    };
  }

  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);

  return http.get(`/rm/applications?${params.toString()}`);
}

/**
 * Get RM dashboard statistics
 */
export async function getRMDashboardStats(): Promise<ApiResponse<{
  total: number;
  draft: number;
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
  documentsRequired: number;
}>> {
  if (env.MODE === 'MOCK') {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      status: 200,
      message: 'Stats retrieved successfully',
      data: {
        total: mockApplications.length,
        draft: mockApplications.filter((a) => a.status === 'DRAFT').length,
        submitted: mockApplications.filter((a) => a.status === 'SUBMITTED').length,
        underReview: mockApplications.filter((a) => a.status === 'UNDER_REVIEW').length,
        approved: mockApplications.filter((a) => a.status === 'APPROVED').length,
        rejected: mockApplications.filter((a) => a.status === 'REJECTED').length,
        documentsRequired: mockApplications.filter((a) => a.status === 'DOCUMENTS_REQUIRED').length,
      },
    };
  }

  return http.get('/rm/dashboard/stats');
}

/**
 * Continue an existing draft application
 */
export async function continueApplication(
  applicationId: string
): Promise<ApiResponse<{ redirectUrl: string }>> {
  if (env.MODE === 'MOCK') {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const app = mockApplications.find((a) => a.id === applicationId);
    
    if (!app) {
      return {
        status: 404,
        message: 'Application not found',
      };
    }

    if (app.status !== 'DRAFT') {
      return {
        status: 400,
        message: 'Only draft applications can be continued',
      };
    }

    return {
      status: 200,
      message: 'Application loaded',
      data: { redirectUrl: `/apply?id=${applicationId}` },
    };
  }

  return http.post(`/rm/applications/${applicationId}/continue`);
}
