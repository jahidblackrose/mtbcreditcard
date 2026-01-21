/**
 * MTB Credit Card Application - Rate Limit Message
 * 
 * Shows rate limit feedback with countdown.
 */

import { Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RateLimitMessageProps {
  isLimited: boolean;
  retryAfterSeconds: number;
  message?: string | null;
  className?: string;
}

export function RateLimitMessage({
  isLimited,
  retryAfterSeconds,
  message,
  className,
}: RateLimitMessageProps) {
  if (!isLimited) {
    return null;
  }

  return (
    <Alert variant="destructive" className={cn('animate-in fade-in-0 slide-in-from-top-2', className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center gap-2">
        <span>{message || 'Too many requests. Please wait.'}</span>
        {retryAfterSeconds > 0 && (
          <span className="inline-flex items-center gap-1 rounded bg-destructive/10 px-2 py-0.5 text-xs font-mono">
            <Clock className="h-3 w-3" />
            {retryAfterSeconds}s
          </span>
        )}
      </AlertDescription>
    </Alert>
  );
}
