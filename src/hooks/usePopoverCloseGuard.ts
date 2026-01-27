import { useCallback, useEffect, useRef } from "react";

/**
 * usePopoverCloseGuard
 * -------------------
 * Prevents Radix Popover from auto-closing due to focus shifts that happen when
 * interacting with native <select> (month/year) inside the Calendar caption.
 *
 * The popover should still close on:
 * - outside click (when not actively interacting with the calendar)
 * - explicit close (e.g., after selecting a valid date)
 */
export function usePopoverCloseGuard(delayMs: number = 1200) {
  const interactingRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const resetInteracting = useCallback(() => {
    interactingRef.current = false;
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const markInteracting = useCallback(() => {
    interactingRef.current = true;
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      interactingRef.current = false;
      timeoutRef.current = null;
    }, delayMs);
  }, [delayMs]);

  const shouldIgnoreClose = useCallback((nextOpen: boolean) => {
    return nextOpen === false && interactingRef.current === true;
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { markInteracting, shouldIgnoreClose, resetInteracting };
}
