/**
 * MTB Credit Card Application - Draft API
 * 
 * API adapter for Redis-backed draft state management.
 * Handles draft save, restore, and versioning.
 */

import { env } from '@/config';
import { http } from './httpClient';
import type { ApiResponse } from '@/types';
import type { 
  DraftState, 
  DraftSaveRequest, 
  DraftSaveResponse,
  DraftVersion 
} from '@/types/session.types';

// ============================================
// MOCK DATA
// ============================================

let mockDraft: DraftState | null = null;

function generateApplicationId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `MTB-CC-${year}-${random}`;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Initializes a new draft for a session
 */
export async function initializeDraft(
  sessionId: string
): Promise<ApiResponse<DraftState>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const applicationId = generateApplicationId();
    const now = new Date().toISOString();
    
    mockDraft = {
      sessionId,
      applicationId,
      currentStep: 1,
      highestCompletedStep: 0,
      draftVersion: 1,
      stepVersions: [],
      data: {},
      lastSavedAt: now,
      isSubmitted: false,
    };

    return {
      status: 200,
      message: 'Draft initialized successfully',
      data: mockDraft,
    };
  }

  return http.post('/draft/initialize', { sessionId });
}

/**
 * Gets draft state by session ID
 */
export async function getDraft(
  sessionId: string
): Promise<ApiResponse<DraftState | null>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (!mockDraft || mockDraft.sessionId !== sessionId) {
      return {
        status: 200,
        message: 'No draft found for this session',
        data: null,
      };
    }

    return {
      status: 200,
      message: 'Draft retrieved successfully',
      data: mockDraft,
    };
  }

  return http.get(`/draft/${sessionId}`);
}

/**
 * Saves draft step data (debounced on frontend)
 */
export async function saveDraftStep(
  request: DraftSaveRequest
): Promise<ApiResponse<DraftSaveResponse>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    if (!mockDraft || mockDraft.sessionId !== request.sessionId) {
      return {
        status: 404,
        message: 'Draft not found. Please refresh the page.',
      };
    }

    const now = new Date().toISOString();
    
    // Update step version
    const existingVersionIndex = mockDraft.stepVersions.findIndex(
      v => v.stepNumber === request.stepNumber
    );
    
    const stepVersion: DraftVersion = {
      stepNumber: request.stepNumber,
      stepName: request.stepName,
      version: existingVersionIndex >= 0 
        ? mockDraft.stepVersions[existingVersionIndex].version + 1 
        : 1,
      savedAt: now,
      isComplete: request.isStepComplete || false,
    };

    if (existingVersionIndex >= 0) {
      mockDraft.stepVersions[existingVersionIndex] = stepVersion;
    } else {
      mockDraft.stepVersions.push(stepVersion);
    }

    // Update draft data
    mockDraft.data = {
      ...mockDraft.data,
      [`step_${request.stepNumber}`]: request.data,
    };
    mockDraft.currentStep = request.stepNumber;
    mockDraft.draftVersion += 1;
    mockDraft.lastSavedAt = now;

    // Update highest completed step
    if (request.isStepComplete && request.stepNumber > mockDraft.highestCompletedStep) {
      mockDraft.highestCompletedStep = request.stepNumber;
    }

    return {
      status: 200,
      message: 'Draft saved',
      data: {
        success: true,
        draftVersion: mockDraft.draftVersion,
        savedAt: now,
      },
    };
  }

  return http.post('/draft/save', request);
}

/**
 * Clears draft after successful submission
 */
export async function clearDraft(
  sessionId: string
): Promise<ApiResponse<void>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (mockDraft?.sessionId === sessionId) {
      mockDraft.isSubmitted = true;
    }
    
    return {
      status: 200,
      message: 'Draft cleared successfully',
    };
  }

  return http.delete(`/draft/${sessionId}`);
}

/**
 * Gets step versions for history
 */
export async function getStepVersions(
  sessionId: string
): Promise<ApiResponse<DraftVersion[]>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    if (!mockDraft || mockDraft.sessionId !== sessionId) {
      return {
        status: 200,
        message: 'No versions found',
        data: [],
      };
    }

    return {
      status: 200,
      message: 'Versions retrieved',
      data: mockDraft.stepVersions,
    };
  }

  return http.get(`/draft/${sessionId}/versions`);
}
