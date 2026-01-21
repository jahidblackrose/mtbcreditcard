/**
 * MTB Credit Card Application - Dashboard Page API
 * 
 * API adapter for the application dashboard/status tracking.
 * 
 * MODE: MOCK implementation
 */

import { env } from '@/config';
import { http } from './httpClient';
import type {
  ApiResponse,
  ApplicationSummary,
  PaginatedResponse,
  CreditCardApplication,
} from '@/types';

// ============================================
// MOCK DATA
// ============================================

const MOCK_APPLICATIONS: ApplicationSummary[] = [
  {
    id: 'app-001',
    referenceNumber: 'MTB-CC-2024-00123',
    status: 'UNDER_REVIEW',
    cardType: 'VISA_GOLD',
    applicantName: 'Ahmed Rahman',
    submittedAt: '2024-01-15T10:30:00Z',
    lastUpdatedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: 'app-002',
    referenceNumber: 'MTB-CC-2024-00089',
    status: 'APPROVED',
    cardType: 'VISA_PLATINUM',
    applicantName: 'Fatima Begum',
    submittedAt: '2024-01-10T09:15:00Z',
    lastUpdatedAt: '2024-01-14T16:45:00Z',
  },
  {
    id: 'app-003',
    referenceNumber: 'MTB-CC-2024-00156',
    status: 'DOCUMENTS_REQUIRED',
    cardType: 'MASTERCARD_GOLD',
    applicantName: 'Mohammad Hasan',
    submittedAt: '2024-01-18T11:00:00Z',
    lastUpdatedAt: '2024-01-19T09:30:00Z',
  },
];

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetches all applications for the current user
 */
export async function getMyApplications(
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<PaginatedResponse<ApplicationSummary>>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      status: 200,
      message: 'Applications retrieved successfully',
      data: {
        items: MOCK_APPLICATIONS,
        pagination: {
          currentPage: page,
          totalPages: 1,
          totalItems: MOCK_APPLICATIONS.length,
          itemsPerPage: limit,
        },
      },
    };
  }

  return http.get(`/applications?page=${page}&limit=${limit}`);
}

/**
 * Fetches application status by reference number (public)
 */
export async function trackApplication(
  referenceNumber: string
): Promise<ApiResponse<ApplicationSummary>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const application = MOCK_APPLICATIONS.find(
      app => app.referenceNumber === referenceNumber
    );

    if (!application) {
      return {
        status: 404,
        message: 'No application found with this reference number',
      };
    }

    return {
      status: 200,
      message: 'Application found',
      data: application,
    };
  }

  return http.get(`/applications/track/${referenceNumber}`);
}

/**
 * Dashboard statistics for staff (assisted mode)
 */
export interface DashboardStats {
  totalApplications: number;
  pendingReview: number;
  approvedToday: number;
  documentsRequired: number;
}

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      status: 200,
      message: 'Dashboard stats retrieved',
      data: {
        totalApplications: 156,
        pendingReview: 23,
        approvedToday: 8,
        documentsRequired: 12,
      },
    };
  }

  return http.get('/dashboard/stats');
}
