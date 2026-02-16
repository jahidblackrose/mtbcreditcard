/**
 * SessionTimeoutWarning - Warns users before session expires
 * Shows a dialog 2 minutes before session expiry with option to extend
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SessionTimeoutWarningProps {
  sessionExpiryTime: Date | null;
  onExtend: () => void;
  onLogout: () => void;
  warningMinutes?: number;
}

export const SessionTimeoutWarning: React.FC<SessionTimeoutWarningProps> = ({
  sessionExpiryTime,
  onExtend,
  onLogout,
  warningMinutes = 2,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!sessionExpiryTime) return;

    const warningTime = warningMinutes * 60 * 1000; // Convert to ms
    const checkInterval = 1000; // Check every second

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiryTime = new Date(sessionExpiryTime).getTime();
      const timeUntilExpiry = expiryTime - now;

      // Show warning when within warning period
      if (timeUntilExpiry <= warningTime && timeUntilExpiry > 0) {
        setIsOpen(true);
        setTimeRemaining(Math.ceil(timeUntilExpiry / 1000));
      }

      // Auto-logout when session expires
      if (timeUntilExpiry <= 0) {
        setIsOpen(false);
        onLogout();
      }
    }, checkInterval);

    return () => clearInterval(interval);
  }, [sessionExpiryTime, warningMinutes, onLogout]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExtend = () => {
    onExtend();
    setIsOpen(false);
  };

  const handleLogoutNow = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        aria-labelledby="session-timeout-title"
        aria-describedby="session-timeout-description"
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <DialogTitle id="session-timeout-title" className="text-lg">
              Session Expiring Soon
            </DialogTitle>
          </div>
          <DialogDescription id="session-timeout-description" className="pt-2">
            Your session will expire in <span className="font-bold text-amber-600">{formatTime(timeRemaining)}</span> minutes.
            You can extend your session or save your work and logout.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <p className="font-medium">Don't lose your work!</p>
            <p className="mt-1">For your security, sessions automatically expire after a period of inactivity. Extend your session to continue working.</p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleLogoutNow}
            className="focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Logout Now
          </Button>
          <Button
            onClick={handleExtend}
            className="focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            autoFocus
          >
            Extend Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
