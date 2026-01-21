/**
 * MTB Credit Card Application - Header Component
 * 
 * Responsive header with logo and navigation.
 */

import mtbLogo from '@/assets/mtb-logo.png';
import { ThemeToggle } from '../components/ThemeToggle';

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src={mtbLogo} 
            alt="Mutual Trust Bank PLC" 
            className="h-8 md:h-10 w-auto"
          />
          <div className="hidden sm:block">
            <span className="text-sm font-medium text-foreground">
              Credit Card Application
            </span>
          </div>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* Additional nav items can be added here */}
        </div>
      </div>
    </header>
  );
}
