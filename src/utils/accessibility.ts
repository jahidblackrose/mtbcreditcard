/**
 * Accessibility Utilities (WCAG 2.1 AA)
 * Helper functions and components for improving accessibility
 */

import { useCallback } from 'react';

/**
 * Announces messages to screen readers using ARIA live regions
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Generates a unique ID for accessibility attributes
 */
export const generateId = (prefix: string) => {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Trap focus within a container (for modals, dialogs)
 */
export const trapFocus = (containerElement: HTMLElement) => {
  const focusableElements = containerElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  containerElement.addEventListener('keydown', handleTabKey);

  // Return cleanup function
  return () => {
    containerElement.removeEventListener('keydown', handleTabKey);
  };
};

/**
 * Check if color contrast meets WCAG AA standards (4.5:1 for normal text)
 */
export const checkContrastRatio = (foreground: string, background: string): { passes: boolean; ratio: number } => {
  // Simple contrast calculation (not perfect but good enough for basic checks)
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.replace('#', ''), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = (rgb & 0xff) / 255;

    const a = [r, g, b].map((v) => {
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);

  return {
    passes: ratio >= 4.5,
    ratio,
  };
};

/**
 * Keyboard navigation hook
 */
export const useKeyboardNavigation = (callbacks: {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
}) => {
  useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        callbacks.onEscape?.();
        break;
      case 'Enter':
        callbacks.onEnter?.();
        break;
      case 'ArrowUp':
        e.preventDefault();
        callbacks.onArrowUp?.();
        break;
      case 'ArrowDown':
        e.preventDefault();
        callbacks.onArrowDown?.();
        break;
      case 'ArrowLeft':
        callbacks.onArrowLeft?.();
        break;
      case 'ArrowRight':
        callbacks.onArrowRight?.();
        break;
    }
  }, [callbacks]);
};

/**
 * ARIA helper for describing complex UI elements
 */
export const getAriaProps = (
  type: 'button' | 'link' | 'input' | 'menu' | 'dialog' | 'alert',
  options?: {
    label?: string;
    describedBy?: string;
    expanded?: boolean;
    pressed?: boolean;
    checked?: boolean;
    disabled?: boolean;
    required?: boolean;
    invalid?: boolean;
  }
) => {
  const props: Record<string, string | boolean> = {};

  switch (type) {
    case 'button':
      if (options?.label) props['aria-label'] = options.label;
      if (options?.pressed !== undefined) props['aria-pressed'] = options.pressed;
      if (options?.expanded !== undefined) props['aria-expanded'] = options.expanded;
      if (options?.disabled) props['aria-disabled'] = options.disabled;
      props.type = 'button';
      break;
    case 'link':
      if (options?.label) props['aria-label'] = options.label;
      break;
    case 'input':
      if (options?.label) props['aria-label'] = options.label;
      if (options?.describedBy) props['aria-describedby'] = options.describedBy;
      if (options?.required) props['aria-required'] = options.required;
      if (options?.invalid) props['aria-invalid'] = options.invalid;
      break;
    case 'menu':
      props['role'] = 'menu';
      if (options?.label) props['aria-label'] = options.label;
      break;
    case 'dialog':
      props['role'] = 'dialog';
      if (options?.label) props['aria-label'] = options.label;
      if (options?.describedBy) props['aria-describedby'] = options.describedBy;
      props['aria-modal'] = 'true';
      break;
    case 'alert':
      props['role'] = 'alert';
      if (options?.label) props['aria-label'] = options.label;
      props['aria-live'] = 'polite';
      props['aria-atomic'] = 'true';
      break;
  }

  return props;
};

/**
 * Skip to main content link
 */
export const SkipLink = ({ targetId = 'main-content', label = 'Skip to main content' }) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md"
    >
      {label}
    </a>
  );
};

/**
 * Hidden visually but accessible to screen readers
 */
export const VisuallyHidden = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: 0,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Focus visible utility for better keyboard navigation
 */
export const applyFocusVisible = () => {
  // Add focus-visible polyfill styles if not present
  if (!document.getElementById('focus-visible-styles')) {
    const style = document.createElement('style');
    style.id = 'focus-visible-styles';
    style.textContent = `
      .focus-visible:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
      .focus-visible:focus:not(:focus-visible) {
        outline: none;
      }
    `;
    document.head.appendChild(style);
  }
};
