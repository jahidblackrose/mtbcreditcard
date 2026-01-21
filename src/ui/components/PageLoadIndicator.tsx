/**
 * MTB Credit Card Application - Page Load Indicator
 * 
 * Mobile app-like page loading animation with save status.
 * Shows at the top of every page when loading/saving.
 */

import { useEffect, useState } from 'react';
import { Check, Cloud, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SaveStatus } from '@/hooks/useDraft';

interface PageLoadIndicatorProps {
  isLoading?: boolean;
  saveStatus?: SaveStatus;
  className?: string;
}

export function PageLoadIndicator({
  isLoading = false,
  saveStatus = 'idle',
  className,
}: PageLoadIndicatorProps) {
  const [showSaved, setShowSaved] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Show "saved" indicator briefly after save completes
  useEffect(() => {
    if (saveStatus === 'saved') {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoad(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const isActive = isLoading || saveStatus === 'saving' || showSaved || initialLoad;

  if (!isActive) return null;

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        className
      )}
    >
      {/* Progress bar animation */}
      <div className="h-0.5 bg-muted overflow-hidden">
        <div
          className={cn(
            'h-full bg-primary transition-all duration-300',
            (isLoading || initialLoad) && 'animate-progress-bar',
            saveStatus === 'saving' && 'animate-progress-bar',
            (showSaved || saveStatus === 'saved') && 'w-full'
          )}
          style={{
            animation: (isLoading || saveStatus === 'saving' || initialLoad)
              ? 'progress 1.5s ease-in-out infinite'
              : undefined,
          }}
        />
      </div>

      {/* Status message */}
      <div
        className={cn(
          'flex items-center justify-center py-1.5 text-xs font-medium transition-all duration-300',
          'bg-primary/5 border-b border-primary/10',
          saveStatus === 'saving' && 'text-muted-foreground',
          (showSaved || saveStatus === 'saved') && 'text-success',
          saveStatus === 'error' && 'text-destructive bg-destructive/5 border-destructive/10'
        )}
      >
        {(isLoading || initialLoad) && saveStatus === 'idle' && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading...</span>
          </div>
        )}
        {saveStatus === 'saving' && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Saving your progress...</span>
          </div>
        )}
        {(showSaved || saveStatus === 'saved') && !isLoading && (
          <div className="flex items-center gap-2">
            <Cloud className="h-3 w-3" />
            <Check className="h-3 w-3" />
            <span>All changes saved</span>
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="flex items-center gap-2">
            <span>Save failed - Will retry automatically</span>
          </div>
        )}
      </div>
    </div>
  );
}
