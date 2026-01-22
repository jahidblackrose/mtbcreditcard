/**
 * MTB Credit Card Application - Header Component
 * 
 * Responsive header with MTB logo and "line of trust" branding.
 * Clean, bank-grade design without orange.
 */

import mtbLogo from '@/assets/mtb-logo.png';
import mtbWave from '@/assets/mtb-wave.png';
import { ThemeToggle } from '../components/ThemeToggle';

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and branding */}
        <div className="flex items-center gap-4">
          <img 
            src={mtbLogo} 
            alt="Mutual Trust Bank PLC" 
            className="h-10 md:h-12 w-auto"
          />
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold text-foreground leading-tight">
              Credit Card Application
            </span>
            <span className="text-xs text-muted-foreground">
              You can bank on us
            </span>
          </div>
        </div>
        
        {/* Right side - Line of Trust strip and actions */}
        <div className="flex items-center gap-4">
          {/* Line of trust wave on larger screens */}
          <img 
            src={mtbWave}
            alt=""
            className="hidden lg:block h-8 w-auto opacity-80"
          />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}