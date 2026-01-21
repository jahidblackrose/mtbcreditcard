/**
 * MTB Credit Card Application - OTP Attempt Indicator
 * 
 * Shows remaining attempts and cooldown timer.
 */

import { AlertCircle, Clock, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OtpAttemptIndicatorProps {
  remainingAttempts: number;
  maxAttempts: number;
  isLocked: boolean;
  cooldownSeconds: number;
  className?: string;
}

function formatCooldown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  return `${secs}s`;
}

export function OtpAttemptIndicator({
  remainingAttempts,
  maxAttempts,
  isLocked,
  cooldownSeconds,
  className,
}: OtpAttemptIndicatorProps) {
  // Locked state with cooldown
  if (isLocked && cooldownSeconds > 0) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3',
          className
        )}
      >
        <Clock className="h-4 w-4 text-destructive" />
        <div className="flex-1">
          <p className="text-sm font-medium text-destructive">Too many attempts</p>
          <p className="text-xs text-muted-foreground">
            Please wait <span className="font-mono font-semibold">{formatCooldown(cooldownSeconds)}</span> before trying again
          </p>
        </div>
      </div>
    );
  }

  // Low attempts warning
  if (remainingAttempts <= 2 && remainingAttempts > 0) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-sm',
          remainingAttempts === 1 ? 'text-destructive' : 'text-warning',
          className
        )}
      >
        <AlertCircle className="h-4 w-4" />
        <span>
          {remainingAttempts} attempt{remainingAttempts === 1 ? '' : 's'} remaining
        </span>
      </div>
    );
  }

  // Normal state - show attempts
  if (remainingAttempts < maxAttempts) {
    return (
      <div className={cn('flex items-center gap-2 text-xs text-muted-foreground', className)}>
        <Shield className="h-3 w-3" />
        <span>{remainingAttempts} of {maxAttempts} attempts remaining</span>
      </div>
    );
  }

  return null;
}
