/**
 * MTB Credit Card Application - Main Layout
 * 
 * Root layout component for all pages.
 * Includes header, gradient bar, page load animation, and responsive container.
 */

import { ReactNode, useEffect, useState } from 'react';
import { Header } from './Header';
import { PageLoadIndicator } from '../components/PageLoadIndicator';
import type { SaveStatus } from '@/hooks/useDraft';

export interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  hideNav?: boolean;
  isLoading?: boolean;
  saveStatus?: SaveStatus;
}

export function MainLayout({ 
  children, 
  showHeader = true, 
  hideNav = false,
  isLoading = false,
  saveStatus = 'idle',
}: MainLayoutProps) {
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    // Mobile app-like page entrance animation
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Page Load Indicator at the very top */}
      <PageLoadIndicator isLoading={isLoading} saveStatus={saveStatus} />

      {/* MTB Brand Gradient Bar */}
      <div className="mtb-gradient-bar" />
      
      {showHeader && !hideNav && <Header />}
      
      <main 
        className={`flex-1 transition-all duration-300 ease-out ${
          pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {children}
      </main>
      
      {/* Footer placeholder */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>© 2024 Mutual Trust Bank PLC. All rights reserved.</p>
      </footer>
    </div>
  );
}
