/**
 * SkipToContent - Accessibility component for keyboard users
 * Provides links to skip to main content or navigation
 */

import React from 'react';

export const SkipToContent: React.FC = () => {
  const handleSkip = (targetId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sr-only focus-within:not-sr-only">
      <style>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        .focus-within\\:not-sr-only:focus-within {
          position: fixed;
          top: 0;
          left: 0;
          width: auto;
          height: auto;
          padding: 1rem 1.5rem;
          margin: 0;
          overflow: visible;
          clip: auto;
          white-space: normal;
          border-width: 2px;
          z-index: 9999;
          background: white;
          border: 2px solid #2563eb;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
      `}</style>
      <a
        href="#main-content"
        onClick={handleSkip('main-content')}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded"
      >
        Skip to main content
      </a>
      <a
        href="#application-form"
        onClick={handleSkip('application-form')}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded ml-2"
      >
        Skip to application form
      </a>
    </div>
  );
};
