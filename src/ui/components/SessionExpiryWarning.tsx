/**
 * MTB Credit Card Application - Session Expiry Warning
 * 
 * Shows countdown and extend button when session is about to expire.
 */

import { useState } from 'react';
import { Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SessionExpiryWarningProps {
  ttlSeconds: number;
  isWarning: boolean;
  isExpired: boolean;
  onExtend: () => Promise<boolean>;
  onRestart?: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function SessionExpiryWarning({
  ttlSeconds,
  isWarning,
  isExpired,
  onExtend,
  onRestart,
}: SessionExpiryWarningProps) {
  const [isExtending, setIsExtending] = useState(false);

  const handleExtend = async () => {
    setIsExtending(true);
    await onExtend();
    setIsExtending(false);
  };

  // Expired state - full screen overlay
  if (isExpired) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="mx-4 max-w-md rounded-lg border border-destructive/20 bg-card p-6 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Session Expired</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Your session has expired due to inactivity. Your progress has been saved.
            </p>
            <Button onClick={onRestart} className="w-full">
              Resume Application
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Warning state - floating banner
  if (isWarning) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-md animate-in slide-in-from-bottom-4 duration-300 md:left-auto md:right-4">
        <div className="flex items-center gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3 shadow-lg backdrop-blur-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warning/20">
            <Clock className="h-4 w-4 text-warning" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Session expiring soon</p>
            <p className="text-xs text-muted-foreground">
              Expires in <span className="font-mono font-semibold">{formatTime(ttlSeconds)}</span>
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExtend}
            disabled={isExtending}
            className="shrink-0"
          >
            {isExtending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              'Extend'
            )}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
