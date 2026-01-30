/**
 * MTB Credit Card Application - Draft API
 * 
 * API adapter for Redis-backed draft state management.
 * Handles draft save, restore, and versioning.
 * 
 * MOCK data structures match real API contracts exactly.
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
import { MOCK_DRAFT_STEPS, generateApplicationId, generateReferenceNumber } from './mockData';

// ============================================
// MOCK DATA STORE
// ============================================

interface MockDraftEntry {
  session_id: string;
  application_id: string;
  reference_number: string;
  current_step: number;
  highest_completed_step: number;
  draft_version: number;
  step_versions: DraftVersion[];
  data: Record<string, unknown>;
  steps: Record<number, {
    step_name: string;
    data: Record<string, unknown>;
    is_complete: boolean;
    saved_at: string;
  }>;
  last_saved_at: string;
  is_submitted: boolean;
  created_at: string;
}

const mockDraftStore: Record<string, MockDraftEntry> = {};

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Initializes a new draft for a session
 * Real API: POST /drafts/initialize
 */
export async function initializeDraft(
  sessionId: string
): Promise<ApiResponse<DraftState>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const applicationId = generateApplicationId();
    const referenceNumber = generateReferenceNumber();
    const now = new Date().toISOString();
    
    const draft: MockDraftEntry = {
      session_id: sessionId,
      application_id: applicationId,
      reference_number: referenceNumber,
      current_step: 1,
      highest_completed_step: 0,
      draft_version: 1,
      step_versions: [],
      data: {},
      steps: {},
      last_saved_at: now,
      is_submitted: false,
      created_at: now,
    };
    
    mockDraftStore[sessionId] = draft;

    return {
      status: 200,
      message: 'Draft initialized successfully',
      data: {
        sessionId,
        applicationId,
        currentStep: 1,
        highestCompletedStep: 0,
        draftVersion: 1,
        stepVersions: [],
        data: {},
        lastSavedAt: now,
        isSubmitted: false,
      },
    };
  }

  return http.post('/drafts/initialize', { session_id: sessionId });
}

/**
 * Gets draft state by session ID
 * Real API: GET /drafts/:sessionId
 */
export async function getDraft(
  sessionId: string
): Promise<ApiResponse<DraftState | null>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let draft = mockDraftStore[sessionId];
    
    // For demo purposes, return sample data if resuming
    if (!draft) {
      // Check if we should provide sample resume data
      const shouldProvideSampleData = sessionId.includes('resume') || 
        localStorage.getItem('mtb_demo_resume') === 'true';
      
      if (shouldProvideSampleData) {
        const applicationId = generateApplicationId();
        const now = new Date().toISOString();
        
        // Create draft with pre-filled steps from mock data
        draft = {
          session_id: sessionId,
          application_id: applicationId,
          reference_number: generateReferenceNumber(),
          current_step: 6,
          highest_completed_step: 5,
          draft_version: 5,
          step_versions: Object.entries(MOCK_DRAFT_STEPS).map(([stepNum, step]) => ({
            stepNumber: parseInt(stepNum),
            stepName: step.step_name,
            version: 1,
            savedAt: step.saved_at,
            isComplete: step.is_complete,
          })),
          data: Object.entries(MOCK_DRAFT_STEPS).reduce((acc, [stepNum, step]) => {
            acc[`step_${stepNum}`] = step.data;
            return acc;
          }, {} as Record<string, unknown>),
          steps: MOCK_DRAFT_STEPS as any,
          last_saved_at: now,
          is_submitted: false,
          created_at: '2026-01-30T09:00:00Z',
        };
        
        mockDraftStore[sessionId] = draft;
      } else {
        return {
          status: 200,
          message: 'No draft found for this session',
          data: null,
        };
      }
    }

    return {
      status: 200,
      message: 'Draft retrieved successfully',
      data: {
        sessionId: draft.session_id,
        applicationId: draft.application_id,
        currentStep: draft.current_step,
        highestCompletedStep: draft.highest_completed_step,
        draftVersion: draft.draft_version,
        stepVersions: draft.step_versions,
        data: draft.data,
        lastSavedAt: draft.last_saved_at,
        isSubmitted: draft.is_submitted,
      },
    };
  }

  return http.get(`/drafts/${sessionId}`);
}

/**
 * Saves draft step data (debounced on frontend)
 * Real API: POST /drafts/save
 */
export async function saveDraftStep(
  request: DraftSaveRequest
): Promise<ApiResponse<DraftSaveResponse>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    let draft = mockDraftStore[request.sessionId];
    
    if (!draft) {
      // Auto-create draft if not exists
      const applicationId = generateApplicationId();
      const now = new Date().toISOString();
      
      draft = {
        session_id: request.sessionId,
        application_id: applicationId,
        reference_number: generateReferenceNumber(),
        current_step: request.stepNumber,
        highest_completed_step: 0,
        draft_version: 0,
        step_versions: [],
        data: {},
        steps: {},
        last_saved_at: now,
        is_submitted: false,
        created_at: now,
      };
      
      mockDraftStore[request.sessionId] = draft;
    }

    const now = new Date().toISOString();
    
    // Update step version
    const existingVersionIndex = draft.step_versions.findIndex(
      v => v.stepNumber === request.stepNumber
    );
    
    const stepVersion: DraftVersion = {
      stepNumber: request.stepNumber,
      stepName: request.stepName,
      version: existingVersionIndex >= 0 
        ? draft.step_versions[existingVersionIndex].version + 1 
        : 1,
      savedAt: now,
      isComplete: request.isStepComplete || false,
    };

    if (existingVersionIndex >= 0) {
      draft.step_versions[existingVersionIndex] = stepVersion;
    } else {
      draft.step_versions.push(stepVersion);
    }

    // Update draft data
    draft.data = {
      ...draft.data,
      [`step_${request.stepNumber}`]: request.data,
    };
    
    // Update steps
    draft.steps[request.stepNumber] = {
      step_name: request.stepName,
      data: request.data,
      is_complete: request.isStepComplete || false,
      saved_at: now,
    };
    
    draft.current_step = request.stepNumber;
    draft.draft_version += 1;
    draft.last_saved_at = now;

    // Update highest completed step
    if (request.isStepComplete && request.stepNumber > draft.highest_completed_step) {
      draft.highest_completed_step = request.stepNumber;
    }

    return {
      status: 200,
      message: 'Draft saved',
      data: {
        success: true,
        draftVersion: draft.draft_version,
        savedAt: now,
      },
    };
  }

  return http.post('/drafts/save', request);
}

/**
 * Clears draft after successful submission
 * Real API: DELETE /drafts/:sessionId
 */
export async function clearDraft(
  sessionId: string
): Promise<ApiResponse<void>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (mockDraftStore[sessionId]) {
      mockDraftStore[sessionId].is_submitted = true;
    }
    
    return {
      status: 200,
      message: 'Draft cleared successfully',
    };
  }

  return http.delete(`/drafts/${sessionId}`);
}

/**
 * Gets step versions for history
 * Real API: GET /drafts/:sessionId/versions
 */
export async function getStepVersions(
  sessionId: string
): Promise<ApiResponse<DraftVersion[]>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const draft = mockDraftStore[sessionId];
    
    if (!draft) {
      return {
        status: 200,
        message: 'No versions found',
        data: [],
      };
    }

    return {
      status: 200,
      message: 'Versions retrieved',
      data: draft.step_versions,
    };
  }

  return http.get(`/drafts/${sessionId}/versions`);
}

/**
 * Gets specific step data
 * Real API: GET /drafts/:sessionId/step/:stepNumber
 */
export async function getStepData(
  sessionId: string,
  stepNumber: number
): Promise<ApiResponse<{ data: Record<string, unknown>; is_complete: boolean } | null>> {
  if (env.MODE === 'MOCK') {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const draft = mockDraftStore[sessionId];
    
    if (!draft || !draft.steps[stepNumber]) {
      return {
        status: 200,
        message: 'Step data not found',
        data: null,
      };
    }

    const step = draft.steps[stepNumber];
    
    return {
      status: 200,
      message: 'Step data retrieved',
      data: {
        data: step.data,
        is_complete: step.is_complete,
      },
    };
  }

  return http.get(`/drafts/${sessionId}/step/${stepNumber}`);
}
