/**
 * MTB Credit Card Application - Header Component
 * 
 * Premium banking header with navy theme.
 */

import { useNavigate } from 'react-router-dom';
import mtbLogo from '@/assets/mtb-logo.png';
import { ThemeToggle } from '../components/ThemeToggle';

export function Header() {
  const navigate = useNavigate();
  
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <img 
            src={mtbLogo} 
            alt="Mutual Trust Bank PLC" 
            className="h-8 md:h-10 w-auto"
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-foreground leading-tight">
              Credit Card Application
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              Mutual Trust Bank PLC
            </span>
          </div>
        </button>
        
        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
