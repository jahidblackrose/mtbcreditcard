/**
 * MTB Credit Card Application - Application Page API
 * 
 * API adapter for the credit card application form.
 * Handles application creation, updates, and submission.
 * 
 * MODE: MOCK implementation
 */

import { env } from '@/config';
import { http } from './httpClient';
import type {
  ApiResponse,
  CreditCardApplication,
  ApplicationMode,
  ApplicantPersonalInfo,
  ApplicantAddress,
  ApplicantEmployment,
  CardProduct,
} from '@/types';

// ============================================
// MOCK DATA
// ============================================

let mockApplications: Map<string, CreditCardApplication> = new Map();

function generateReferenceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `MTB-CC-${year}-${random}`;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Creates a new credit card application
 */
export async function createApplication(
  mode: ApplicationMode,
  selectedCard: CardProduct
): Promise<ApiResponse<{ applicationId: string; referenceNumber: string }>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const id = crypto.randomUUID();
    const referenceNumber = generateReferenceNumber();
    const now = new Date().toISOString();

    const newApplication: CreditCardApplication = {
      id,
      referenceNumber,
      mode,
      status: 'DRAFT',
      selectedCard,
      personalInfo: {} as ApplicantPersonalInfo,
      presentAddress: {} as ApplicantAddress,
      permanentAddress: {} as ApplicantAddress,
      employment: {} as ApplicantEmployment,
      documents: [],
      requestedCreditLimit: '0',
      createdAt: now,
      updatedAt: now,
    };

    mockApplications.set(id, newApplication);

    return {
      status: 200,
      message: 'Application created successfully',
      data: { applicationId: id, referenceNumber },
    };
  }

  return http.post('/applications', { mode, cardId: selectedCard.id });
}

/**
 * Fetches application by ID
 */
export async function getApplication(
  applicationId: string
): Promise<ApiResponse<CreditCardApplication>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const application = mockApplications.get(applicationId);
    
    if (!application) {
      return {
        status: 404,
        message: 'Application not found',
      };
    }

    return {
      status: 200,
      message: 'Application retrieved successfully',
      data: application,
    };
  }

  return http.get(`/applications/${applicationId}`);
}

/**
 * Updates personal information
 */
export async function updatePersonalInfo(
  applicationId: string,
  personalInfo: ApplicantPersonalInfo
): Promise<ApiResponse<void>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const application = mockApplications.get(applicationId);
    
    if (!application) {
      return {
        status: 404,
        message: 'Application not found',
      };
    }

    application.personalInfo = personalInfo;
    application.updatedAt = new Date().toISOString();

    return {
      status: 200,
      message: 'Personal information saved successfully',
    };
  }

  return http.patch(`/applications/${applicationId}/personal-info`, personalInfo);
}

/**
 * Updates address information
 */
export async function updateAddresses(
  applicationId: string,
  presentAddress: ApplicantAddress,
  permanentAddress: ApplicantAddress
): Promise<ApiResponse<void>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const application = mockApplications.get(applicationId);
    
    if (!application) {
      return {
        status: 404,
        message: 'Application not found',
      };
    }

    application.presentAddress = presentAddress;
    application.permanentAddress = permanentAddress;
    application.updatedAt = new Date().toISOString();

    return {
      status: 200,
      message: 'Address information saved successfully',
    };
  }

  return http.patch(`/applications/${applicationId}/addresses`, {
    presentAddress,
    permanentAddress,
  });
}

/**
 * Updates employment information
 */
export async function updateEmployment(
  applicationId: string,
  employment: ApplicantEmployment
): Promise<ApiResponse<void>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const application = mockApplications.get(applicationId);
    
    if (!application) {
      return {
        status: 404,
        message: 'Application not found',
      };
    }

    application.employment = employment;
    application.updatedAt = new Date().toISOString();

    return {
      status: 200,
      message: 'Employment information saved successfully',
    };
  }

  return http.patch(`/applications/${applicationId}/employment`, employment);
}

/**
 * Submits the application for review
 */
export async function submitApplication(
  applicationId: string
): Promise<ApiResponse<{ referenceNumber: string }>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const application = mockApplications.get(applicationId);
    
    if (!application) {
      return {
        status: 404,
        message: 'Application not found',
      };
    }

    // Validation
    if (!application.personalInfo.fullName) {
      return {
        status: 400,
        message: 'Please complete all required personal information',
      };
    }

    application.status = 'SUBMITTED';
    application.submittedAt = new Date().toISOString();
    application.updatedAt = new Date().toISOString();

    return {
      status: 200,
      message: 'Application submitted successfully. You will receive updates via SMS and email.',
      data: { referenceNumber: application.referenceNumber },
    };
  }

  return http.post(`/applications/${applicationId}/submit`);
}
