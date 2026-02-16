/**
 * MTB Credit Card Application - Page Loader
 *
 * Loading spinner shown during route transitions and initial page load.
 */

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
}

export function PageLoader({ size = 'md', fullScreen = false, text }: PageLoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        {content}
      </div>
    );
  }

  return content;
}
