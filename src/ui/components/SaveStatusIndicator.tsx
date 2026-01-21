/**
 * MTB Credit Card Application - Save Status Indicator
 * 
 * Shows auto-save status (Saving... / Saved / Error)
 */

import { Check, Loader2, AlertCircle, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SaveStatus } from '@/hooks/useDraft';

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  className?: string;
}

export function SaveStatusIndicator({ status, className }: SaveStatusIndicatorProps) {
  if (status === 'idle') {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-xs transition-all duration-300',
        status === 'saving' && 'text-muted-foreground',
        status === 'saved' && 'text-success',
        status === 'error' && 'text-destructive',
        className
      )}
    >
      {status === 'saving' && (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Saving...</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <Cloud className="h-3 w-3" />
          <Check className="h-3 w-3" />
          <span>Saved</span>
        </>
      )}
      {status === 'error' && (
        <>
          <AlertCircle className="h-3 w-3" />
          <span>Save failed</span>
        </>
      )}
    </div>
  );
}
