/**
 * MTB Credit Card Application - Main Layout
 * 
 * Root layout component for all pages.
 * Includes header, gradient bar, and responsive container.
 */

import { ReactNode } from 'react';
import { Header } from './Header';

export interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  hideNav?: boolean;
}

export function MainLayout({ children, showHeader = true, hideNav = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* MTB Brand Gradient Bar */}
      <div className="mtb-gradient-bar" />
      
      {showHeader && !hideNav && <Header />}
      
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer placeholder */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>© 2024 Mutual Trust Bank PLC. All rights reserved.</p>
      </footer>
    </div>
  );
}
