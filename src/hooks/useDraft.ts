/**
 * MTB Credit Card Application - Draft Hook
 * 
 * Manages draft state with auto-save, debouncing, and versioning.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import * as draftApi from '@/api/draft.api';
import type { DraftState, DraftSaveRequest, DraftVersion } from '@/types/session.types';

const DEBOUNCE_MS = 1000; // 1 second debounce for auto-save

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseDraftReturn {
  draft: DraftState | null;
  isLoading: boolean;
  saveStatus: SaveStatus;
  error: string | null;
  stepVersions: DraftVersion[];
  initializeDraft: (sessionId: string) => Promise<DraftState | null>;
  loadDraft: (sessionId: string) => Promise<DraftState | null>;
  saveDraftStep: (
    stepNumber: number,
    stepName: string,
    data: Record<string, unknown>,
    isComplete?: boolean
  ) => void;
  clearDraft: () => Promise<void>;
  getHighestCompletedStep: () => number;
}

export function useDraft(sessionId: string | null): UseDraftReturn {
  const [draft, setDraft] = useState<DraftState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [stepVersions, setStepVersions] = useState<DraftVersion[]>([]);
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSaveRef = useRef<DraftSaveRequest | null>(null);

  // Clear debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const initializeDraft = useCallback(async (sid: string): Promise<DraftState | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await draftApi.initializeDraft(sid);
      
      if (response.status === 200 && response.data) {
        setDraft(response.data);
        setStepVersions(response.data.stepVersions);
        return response.data;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError('Failed to initialize draft.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadDraft = useCallback(async (sid: string): Promise<DraftState | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await draftApi.getDraft(sid);
      
      if (response.status === 200) {
        if (response.data) {
          setDraft(response.data);
          setStepVersions(response.data.stepVersions);
          return response.data;
        }
        return null; // No existing draft
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError('Failed to load draft.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const executeSave = useCallback(async (request: DraftSaveRequest) => {
    setSaveStatus('saving');
    
    try {
      const response = await draftApi.saveDraftStep(request);
      
      if (response.status === 200 && response.data) {
        setSaveStatus('saved');
        setDraft(prev => prev ? {
          ...prev,
          draftVersion: response.data!.draftVersion,
          lastSavedAt: response.data!.savedAt,
          currentStep: request.stepNumber,
          highestCompletedStep: request.isStepComplete && request.stepNumber > (prev.highestCompletedStep || 0)
            ? request.stepNumber
            : prev.highestCompletedStep,
        } : null);
        
        // Update step versions
        setStepVersions(prev => {
          const existing = prev.findIndex(v => v.stepNumber === request.stepNumber);
          const newVersion: DraftVersion = {
            stepNumber: request.stepNumber,
            stepName: request.stepName,
            version: existing >= 0 ? prev[existing].version + 1 : 1,
            savedAt: response.data!.savedAt,
            isComplete: request.isStepComplete || false,
          };
          
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = newVersion;
            return updated;
          }
          return [...prev, newVersion];
        });

        // Reset status after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else if (response.status === 429) {
        // Rate limited
        setError(response.message);
        setSaveStatus('error');
      } else {
        setError(response.message);
        setSaveStatus('error');
      }
    } catch (err) {
      setError('Failed to save draft.');
      setSaveStatus('error');
    }
  }, []);

  const saveDraftStep = useCallback((
    stepNumber: number,
    stepName: string,
    data: Record<string, unknown>,
    isComplete?: boolean
  ) => {
    if (!sessionId) {
      return;
    }

    const request: DraftSaveRequest = {
      sessionId,
      stepNumber,
      stepName,
      data,
      isStepComplete: isComplete,
    };

    pendingSaveRef.current = request;

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      if (pendingSaveRef.current) {
        executeSave(pendingSaveRef.current);
        pendingSaveRef.current = null;
      }
    }, DEBOUNCE_MS);
  }, [sessionId, executeSave]);

  const clearDraft = useCallback(async (): Promise<void> => {
    if (!sessionId) {
      return;
    }

    try {
      await draftApi.clearDraft(sessionId);
      setDraft(null);
      setStepVersions([]);
    } catch (err) {
      setError('Failed to clear draft.');
    }
  }, [sessionId]);

  const getHighestCompletedStep = useCallback((): number => {
    return draft?.highestCompletedStep || 0;
  }, [draft?.highestCompletedStep]);

  return {
    draft,
    isLoading,
    saveStatus,
    error,
    stepVersions,
    initializeDraft,
    loadDraft,
    saveDraftStep,
    clearDraft,
    getHighestCompletedStep,
  };
}
